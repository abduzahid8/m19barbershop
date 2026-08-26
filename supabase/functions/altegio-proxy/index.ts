const ALTEGIO_BASE = 'https://api.alteg.io/api/v1';
const PARTNER_TOKEN = Deno.env.get('ALTEGIO_PARTNER_TOKEN')!;
const USER_TOKEN = Deno.env.get('ALTEGIO_USER_TOKEN')!;
const LOCATION_ID = Deno.env.get('ALTEGIO_LOCATION_ID')!;

function headers() {
  return {
    'Authorization': `Bearer ${PARTNER_TOKEN}, User ${USER_TOKEN}`,
    'Accept': 'application/vnd.api.v2+json',
    'Content-Type': 'application/json',
  };
}

async function altegioFetch(path: string, options: RequestInit = {}) {
  const url = `${ALTEGIO_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers(), ...(options.headers as Record<string, string> || {}) },
  });
  const body = await res.json();
  if (!res.ok || body?.success === false) {
    throw new Error(body?.meta?.message || `Altegio error: ${res.status}`);
  }
  return body;
}

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const proxyBase = '/altegio-proxy';
    const proxyIndex = url.pathname.indexOf(proxyBase);
    const path = proxyIndex >= 0 ? url.pathname.slice(proxyIndex + proxyBase.length) : url.pathname;
    const method = req.method;

    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    let result;

    switch (true) {
      // ─── Services ──────────────────────────────────
      case method === 'GET' && path === '/services': {
        const [svcResult, catResult] = await Promise.all([
          altegioFetch(`/services/${LOCATION_ID}`),
          altegioFetch(`/service_categories/${LOCATION_ID}/0`).catch(() => ({ data: [] })),
        ]);
        const catMap = new Map<number, string>();
        (catResult.data || []).forEach((c: any) => {
          if (c.id != null && c.title) catMap.set(Number(c.id), c.title);
        });
        const services = (svcResult.data || []).map((s: any) => ({
          id: String(s.id),
          name: s.title,
          price: s.price_min,
          duration: (s.staff?.[0]?.seance_length || 3600) / 60,
          icon: s.category_id ? 'scissors' : 'star',
          description: s.comment || '',
          category: catMap.get(Number(s.category_id)) || '',
          category_id: s.category_id,
          booking_title: s.booking_title,
          staff: (s.staff || []).map((st: any) => ({
            id: String(st.id),
            duration: st.seance_length,
          })),
        }));
        return jsonResponse({ success: true, data: services });
      }

      // ─── Staff (Barbers) ───────────────────────────
      case method === 'GET' && path === '/staff': {
        result = await altegioFetch(`/staff/${LOCATION_ID}`);
        const _name = (t: string | undefined) => t?.toLowerCase() || '';
        const _pos = (t: string | undefined) => t?.toLowerCase() || '';
        const posTitle = (b: any) => _pos(b.position?.title);
        const sp = (b: any) => _name(b.specialization);
        const nm = (b: any) => _name(b.name);
        const isReceptionist = (b: any) =>
          posTitle(b).includes('ресепшн') ||
          posTitle(b).includes('reception') ||
          posTitle(b).includes('администратор') ||
          sp(b).includes('ресепшн') ||
          sp(b).includes('reception') ||
          sp(b).includes('администратор');
        const isShakhnoza = (b: any) =>
          nm(b).includes('shakhnoza') ||
          nm(b).includes('шахноза') ||
          nm(b).includes('shahnoza') ||
          nm(b).includes('shaxnoza');
        const stripHtml = (s: string | undefined) =>
          s ? s.replace(/<[^>]*>/g, '') : '';
        const barbers = (result.data || [])
          .filter((b: any) => !isReceptionist(b) && !isShakhnoza(b))
          .map((b: any) => ({
            id: String(b.id),
            name: stripHtml(b.name),
            specialty: stripHtml(b.specialization || 'Barber'),
            rating: b.rating || 0,
            reviewCount: b.comments_count || 0,
            bio: stripHtml(b.information || ''),
            imageUrl: b.avatar_big || b.avatar,
            portfolio: [],
            reviews: [],
            available: !b.fired && !b.hidden,
            position: b.position?.title || '',
            colorIndex: 0,
          }));
        return jsonResponse({ success: true, data: barbers });
      }

      // ─── Time Slots (seances) ──────────────────────
      case method === 'GET' && path.startsWith('/staff/') && path.endsWith('/slots'): {
        const staffId = path.split('/')[2];
        const date = url.searchParams.get('date') || '';
        if (!date || !staffId) {
          return jsonResponse({ success: false, error: 'Missing staff_id or date' }, 400);
        }
        result = await altegioFetch(`/timetable/seances/${LOCATION_ID}/${staffId}/${date}`);
        const rawSlots: { time: string; is_free: boolean }[] = result.data || [];
        const slots = rawSlots
          .filter((s: any) => s.time?.endsWith(':00'))
          .map((s: any) => ({
            time: s.time,
            available: s.is_free === true || s.is_free === 1,
          }));
        return jsonResponse({ success: true, data: slots });
      }

      // ─── Create Appointment ────────────────────────
      case method === 'POST' && path === '/appointments': {
        const body = await req.json();
        const { staff_id, service_ids, client_name, client_email, datetime, seance_length } = body;

        // Find client by email (optional — Altegio handles inline client on record creation)
        let clientId: number | null = null;
        try {
          const allClients = await altegioFetch(`/clients/${LOCATION_ID}?count=500`);
          const existing = ((allClients?.data || []) as any[]).find(
            (c: any) => c.email?.toLowerCase() === (client_email || '').toLowerCase()
          );
          if (existing) clientId = existing.id;
        } catch {
          // client lookup is best-effort
        }

        const servicesRes = await altegioFetch(`/services/${LOCATION_ID}`);
        const services = (servicesRes.data || []) as any[];
        const selectedServices = services.filter((s: any) =>
          service_ids.includes(Number(s.id)) || service_ids.includes(String(s.id))
        );

        const payload: any = {
          staff_id: Number(staff_id),
          services: selectedServices.map((s: any) => ({
            id: s.id,
            first_cost: s.price_min,
            discount: 0,
            cost: s.price_min,
          })),
          client: {
            name: client_name,
            email: client_email,
          },
          datetime,
          seance_length: seance_length || 3600,
          send_sms: false,
          sms_remain_hours: 0,
          email_remain_hours: 0,
          save_if_busy: false,
        };

        if (clientId) {
          payload.client_id = clientId;
        }

        result = await altegioFetch(`/records/${LOCATION_ID}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

        const record = result?.data?.[0] || result?.data;
        return jsonResponse({
          success: true,
          data: {
            id: String(record?.id || ''),
            staff_id: String(record?.staff_id || staff_id),
            datetime: record?.datetime || datetime,
          },
        });
      }

      // ─── Get Appointments by email ─────────────────
      case method === 'GET' && path === '/appointments': {
        const email = url.searchParams.get('email') || '';
        if (!email) {
          return jsonResponse({ success: false, error: 'Missing email' }, 400);
        }

        const allClients = await altegioFetch(`/clients/${LOCATION_ID}?count=500`);
        const client = ((allClients?.data || []) as any[]).find(
          (c: any) => c.email?.toLowerCase() === email.toLowerCase()
        );
        if (!client) {
          return jsonResponse({ success: true, data: [] });
        }

        result = await altegioFetch(`/records/${LOCATION_ID}?client_id=${client.id}`);
        const appointments = (result.data || []).map((r: any) => ({
          id: String(r.id),
          barberId: String(r.staff_id),
          barberName: r.staff?.name || '',
          serviceNames: (r.services || []).map((s: any) => s.title),
          date: (r.datetime || '').split('T')[0],
          time: (r.datetime || '').split('T')[1]?.slice(0, 5) || '',
          status: r.deleted ? 'cancelled' : r.attendance === 1 ? 'completed' : 'upcoming',
        }));
        return jsonResponse({ success: true, data: appointments });
      }

      // ─── Cancel Appointment ────────────────────────
      case method === 'DELETE' && path.startsWith('/appointments/'): {
        const recordId = path.split('/')[2];
        await altegioFetch(`/record/${LOCATION_ID}/${recordId}`, { method: 'DELETE' });
        return jsonResponse({ success: true });
      }

      // ─── Reviews ───────────────────────────────────
      case method === 'GET' && path === '/reviews': {
        result = await altegioFetch(`/comments/${LOCATION_ID}`);
        const reviews = (result.data || []).map((r: any) => ({
          id: String(r.id),
          author: r.username || 'Anonymous',
          rating: r.rating || 5,
          text: r.text || '',
          date: (r.date || '').split('T')[0],
          source: 'app',
          authorAvatarUrl: r.user_avatar || undefined,
        }));
        return jsonResponse({ success: true, data: reviews });
      }

      default:
        return jsonResponse({ success: false, error: `Not found: ${method} ${path}` }, 404);
    }
  } catch (err) {
    console.error('altegio-proxy error', err);
    return jsonResponse(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      500
    );
  }
});

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

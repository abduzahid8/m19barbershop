const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    const body = await req.text();
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(body);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const record = (payload.record as Record<string, unknown>) ?? payload;
    const user_id = record.user_id as string;
    const barber_name = record.barber_name as string;
    const service_names = record.service_names as string | string[];
    const date = record.date as string;
    const time = record.time as string;

    if (!user_id || !barber_name || !service_names || !date || !time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let userName = 'Unknown';
    try {
      const profileRes = await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user_id}&select=name,phone`,
        { headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
      );
      if (profileRes.ok) {
        const profiles: { name?: string; phone?: string }[] = await profileRes.json();
        userName = profiles?.[0]?.name || profiles?.[0]?.phone || 'Unknown';
      }
    } catch {
      // fallback to 'Unknown'
    }

    const services = Array.isArray(service_names) ? service_names.join(', ') : service_names;

    const message = [
      `✂️ <b>Новая запись!</b>`,
      ``,
      `👤 <b>Клиент:</b> ${userName}`,
      `💇 <b>Барбер:</b> ${barber_name}`,
      `✂️ <b>Услуги:</b> ${services}`,
      `📅 <b>Дата:</b> ${date}`,
      `⏰ <b>Время:</b> ${time}`,
    ].join('\n');

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!tgRes.ok) {
      const errBody = await tgRes.text();
      console.error('Telegram API error', errBody);
      return new Response(
        JSON.stringify({ error: 'Failed to send Telegram message', detail: errBody }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('send-telegram-notification error', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

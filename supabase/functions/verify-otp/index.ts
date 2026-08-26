const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const TWILIO_VERIFY_SERVICE_SID = Deno.env.get('TWILIO_VERIFY_SERVICE_SID')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return new Response(
        JSON.stringify({ error: 'Phone and code are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const checkForm = new URLSearchParams({ To: phone, Code: code });

    const checkRes = await fetch(
      `https://verify.twilio.com/v2/Services/${TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: checkForm,
      }
    );

    const checkData = await checkRes.json();

    if (checkData.status !== 'approved') {
      return new Response(
        JSON.stringify({ error: checkData.message || 'Invalid verification code' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json' };
    const oneTimePassword = crypto.randomUUID();

    const findRes = await fetch(
      `${SUPABASE_URL}/auth/v1/admin/users?filter[phone]=${encodeURIComponent(phone)}`,
      { headers: authHeader }
    );
    const { users } = await findRes.json();
    const existingUser = users?.[0];

    if (existingUser) {
      const updateRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users/${existingUser.id}`,
        {
          method: 'PUT',
          headers: authHeader,
          body: JSON.stringify({ password: oneTimePassword }),
        }
      );
      if (!updateRes.ok) {
        const err = await updateRes.json();
        throw new Error(err.msg || 'Failed to update user');
      }
    } else {
      const createRes = await fetch(
        `${SUPABASE_URL}/auth/v1/admin/users`,
        {
          method: 'POST',
          headers: authHeader,
          body: JSON.stringify({
            phone,
            password: oneTimePassword,
            phone_confirm: true,
          }),
        }
      );
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.msg || 'Failed to create user');
      }
    }

    return new Response(
      JSON.stringify({ password: oneTimePassword }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('verify-otp error', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

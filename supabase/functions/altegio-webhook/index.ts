Deno.serve(async (req) => {
  try {
    const body = await req.json();
    console.log('Altegio webhook received:', JSON.stringify(body));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('altegio-webhook error', err);
    return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://met.coffee",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const data = await request.json();

      const course = data.course || "Без названия";
      const name = data.name || "";
      const contact = data.contact || "";
      const message = data.message || "";
      const page = data.page || "";

      const text =
`🧾 Новая заявка MET
Курс: ${course}
Имя: ${name}
Контакт: ${contact}
Запрос: ${message}
Страница: ${page}`;

      const tgResponse = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: env.TG_CHAT_ID,
          message_thread_id: Number(env.TG_THREAD_ID),
          text
        })
      });

      const tgResult = await tgResponse.json();

      if (!tgResponse.ok) {
        return new Response(JSON.stringify({
          ok: false,
          error: tgResult.description || "Telegram API error"
        }), {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        error: String(error)
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};
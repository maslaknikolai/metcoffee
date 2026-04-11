export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const data = await request.json();

      const course = data.course || "Без названия";
      const name = data.name || "";
      const contact = data.contact || "";
      const message = data.message || "";
      const page = data.page || "";

      const text =
`🧾 Заявка на курс MET
Курс: ${course}
Имя: ${name}
Контакт: ${contact}
Запрос: ${message}
Страница: ${page}`;

      const tgRes = await fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
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

      const tgJson = await tgRes.json();

      if (!tgJson.ok) {
        return new Response(JSON.stringify({
          ok: false,
          error: tgJson
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        error: String(error)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
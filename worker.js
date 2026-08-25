export default {
  async fetch(request, env) {

    // Test
    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "JKBOSE AI Worker Running"
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }


    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }


    try {

      let body = {};

      try {
        body = await request.json();
      } catch {
        body = {
          prompt: "Hello, world!"
        };
      }


      const response = await fetch(
        "https://velona.in/gateway/v1/inference/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.VELONA_KEY}`
          },

          body: JSON.stringify({
            model: "nvidia/nemotron-3-super-120b-a12b:free",
            turns: [
              {
                role: "user",
                content: body.prompt || "Hello, world!"
              }
            ]
          })
        }
      );


      const raw = await response.text();

      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        data = {
          error: raw,
          status: response.status
        };
      }


      return new Response(
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );


    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );

    }
  }
};

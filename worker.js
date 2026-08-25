export default {
  async fetch(request, env) {

    // Test URL
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
          prompt: "Hello world"
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
            model: "openai/gpt-5-nano:batch",
            turns: [
              {
                role: "user",
                content: body.prompt
              }
            ]
          })
        }
      );


      const text = await response.text();

      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = {
          error: text,
          status: response.status
        };
      }


      return new Response(
        JSON.stringify(result),
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

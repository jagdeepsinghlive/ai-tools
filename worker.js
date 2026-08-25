export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }


    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "API Working"
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );
    }


    try {

      let body = await request.json();

      let userPrompt = body.prompt || "Hello";


      let apiResponse = await fetch(
        "https://velona.in/gateway/v1/inference/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.VELONA_KEY}`
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3-nano-30b-a3b",
            turns: [
              {
                role: "user",
                content: userPrompt
              }
            ]
          })
        }
      );


      let result = await apiResponse.json();


      return new Response(
        JSON.stringify(result),
        {
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );


    } catch(error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...cors
          }
        }
      );

    }

  }
};

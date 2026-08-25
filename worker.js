export default {
  async fetch(request, env) {

    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "JKBOSE AI Worker Running"
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    try {

      const response = await fetch(
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
                content: "Hello, world!"
              }
            ]
          })
        }
      );


      const data = await response.json();


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
            "Content-Type": "application/json"
          }
        }
      );

    }
  }
};

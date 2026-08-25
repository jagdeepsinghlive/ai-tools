export default {
  async fetch(request, env) {

    if (request.method === "GET") {
      return new Response("Worker Running");
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
          model: "google/gemini-2.5-flash-lite:batch",
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
  }
};

export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors
      });
    }


    if (request.method !== "POST") {
      return new Response("AI Worker Running", {
        headers: cors
      });
    }


    try {

      const data = await request.json();

      const userMessage =
        data.messages?.[0]?.content || "Hello";


      const response = await fetch(
        "https://agentrouter.org/v1/messages",
        {
          method: "POST",

          headers: {
            "x-api-key": env.API_KEY,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
            "User-Agent": "claude-code",
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            model: "claude-3-5-sonnet",

            max_tokens: 1024,

            messages: [
              {
                role: "user",
                content: userMessage
              }
            ]

          })
        }
      );


      const result = await response.json();


      // Convert Anthropic response to OpenAI style
      if(result.content){

        return new Response(
          JSON.stringify({

            choices:[
              {
                message:{
                  role:"assistant",
                  content: result.content[0].text
                }
              }
            ]

          }),
          {
            headers:{
              ...cors,
              "Content-Type":"application/json"
            }
          }
        );

      }


      return new Response(
        JSON.stringify(result),
        {
          headers:{
            ...cors,
            "Content-Type":"application/json"
          }
        }
      );


    } catch(error){

      return new Response(
        JSON.stringify({
          error:error.message
        }),
        {
          status:500,
          headers:{
            ...cors,
            "Content-Type":"application/json"
          }
        }
      );

    }

  }
}

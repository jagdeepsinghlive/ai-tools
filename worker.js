export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null,{headers:cors});
    }


    if (request.method === "GET") {
      return new Response("AI Worker Running");
    }


    try {

      const body = await request.json();

      const prompt = body.prompt || "Create educational content";


      const aiPrompt = `
You are a premium education AI assistant.

Create JKBOSE educational content in HTML format only.

STRICT RULES:
- Return ONLY HTML.
- Do not use markdown.
- Do not use ### or **.
- Never create broken tables.
- Always create proper <table>, <tr>, <th>, <td>.
- Keep mobile friendly.

HTML structure:

<div class="ai-result">

<h1>Topic Title</h1>

<div class="summary">
Short introduction
</div>

<h2>Important Points</h2>
<ul>
<li>Point</li>
</ul>

<h2>Important Questions</h2>

<table>
<tr>
<th>No.</th>
<th>Question</th>
<th>Marks</th>
</tr>

<tr>
<td>1</td>
<td>Question text</td>
<td>3</td>
</tr>

</table>

<div class="tips">
Exam Tips
</div>

</div>


User Request:
${prompt}
`;


      const response = await fetch(
        "https://velona.in/gateway/v1/inference/run",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${env.VELONA_KEY}`
          },
          body:JSON.stringify({
            model:"nvidia/nemotron-3-nano-30b-a3b",
            turns:[
              {
                role:"user",
                content:aiPrompt
              }
            ]
          })
        }
      );


      const data = await response.json();


      return new Response(
        JSON.stringify({
          html:data.data?.output || "No result"
        }),
        {
          headers:{
            "Content-Type":"application/json",
            ...cors
          }
        }
      );


    }catch(error){

      return new Response(
        JSON.stringify({
          error:error.message
        }),
        {
          status:500,
          headers:{
            "Content-Type":"application/json",
            ...cors
          }
        }
      );

    }
  }
};

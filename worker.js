export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };


    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors
      });
    }


    if (request.method === "GET") {
      return new Response(
        JSON.stringify({
          status: "JKBOSE AI Worker Running"
        }),
        {
          headers:{
            "Content-Type":"application/json",
            ...cors
          }
        }
      );
    }


    try {

      const body = await request.json();

      const userPrompt = body.prompt || "";


      const aiPrompt = `

You are JKBOSE Class 10 AI Education Assistant.

Create high quality exam content.

IMPORTANT RULES:

1. Return ONLY HTML inside one div.
2. Do not use <html>, <body>, <head>.
3. Do not use h1 tag.
4. Use h2 and h3 only.
5. Create clean mobile friendly tables.
6. Never create broken tables.
7. Do not use Markdown.
8. Do not use ### or ** symbols.

FOR MATHEMATICS:

Use LaTeX format:

Correct:
\\(\\sqrt{50}\\)

Correct:
\\(\\frac{5}{3}\\)

Never write raw LaTeX without brackets.


Output structure:

<div class="ai-content">

<h2>Topic Title</h2>

<div class="summary">
Short explanation
</div>


<h3>Important Points</h3>

<ul>
<li>Point 1</li>
<li>Point 2</li>
</ul>


<h3>Important Questions</h3>

<table>
<tr>
<th>No.</th>
<th>Question</th>
<th>Marks</th>
</tr>

<tr>
<td>1</td>
<td>Question text</td>
<td>2</td>
</tr>

</table>


<h3>Exam Tips</h3>

<ul>
<li>Tip</li>
</ul>


</div>


User Request:

${userPrompt}

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


      let output = 
      data?.data?.output || "No response";


      return new Response(
        JSON.stringify({
          html: output
        }),
        {
          headers:{
            "Content-Type":"application/json",
            ...cors
          }
        }
      );


    }
    catch(error){

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

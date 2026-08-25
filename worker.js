export default {
  async fetch(request, env) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };


    if(request.method==="OPTIONS"){
      return new Response(null,{headers:cors});
    }


    if(request.method==="GET"){
      return new Response(
        JSON.stringify({
          status:"JKBOSE Advanced AI Bot Running"
        }),
        {
          headers:{
            "Content-Type":"application/json",
            ...cors
          }
        }
      );
    }


    try{


      const body = await request.json();

      const userPrompt = body.prompt || "Hello";


      const systemPrompt = `

You are an advanced JKBOSE AI teacher.

Create beautiful educational answers.

Return ONLY HTML.

Rules:

1. Never use markdown.
2. Use proper HTML tags.
3. Use h2,h3 headings.
4. Use tables for comparison and questions.
5. Use LaTeX for mathematics.

LaTeX examples:

\\(x^2+y^2=z^2\\)

\\(\\frac{a}{b}\\)

\\(\\sqrt{x}\\)


For diagrams:
Use simple SVG or image links if required.

Create:

- Title
- Explanation
- Important Points
- Formula box
- Tables
- Examples
- Exam Questions
- Summary


Table format:

<table>
<tr>
<th>No</th>
<th>Question</th>
<th>Marks</th>
</tr>

<tr>
<td>1</td>
<td>Question</td>
<td>5</td>
</tr>

</table>


Keep output attractive and mobile friendly.


User:
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

            model:"qwen/qwen3.7-flash",

            turns:[
              {
                role:"user",
                content:systemPrompt
              }
            ]

          })
        }
      );


      const data = await response.json();


      return new Response(
        JSON.stringify({
          html:data.data?.output || "No response"
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

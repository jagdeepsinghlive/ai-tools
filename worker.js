export default {

async fetch(request, env) {


const cors = {
"Access-Control-Allow-Origin":"*",
"Access-Control-Allow-Methods":"POST, GET, OPTIONS",
"Access-Control-Allow-Headers":"Content-Type"
};


// CORS

if(request.method==="OPTIONS"){

return new Response(null,{
headers:cors
});

}


// Test

if(request.method==="GET"){

return new Response(
JSON.stringify({
status:"AI Current Affairs Worker Running"
}),
{
headers:{
"Content-Type":"application/json",
...cors
}
});

}



try{


const body = await request.json();

const userPrompt = body.prompt || "Generate top current affairs";



const prompt = `

You are an expert current affairs assistant.

Generate ONLY Top 10 Current Affairs.

Date:
${new Date().toDateString()}


Rules:

- Exactly 10 news.
- Only important exam oriented news.
- Useful for JKSSB, SSC, UPSC and competitive exams.
- No introduction.
- No conclusion.
- No markdown.
- Return valid JSON only.


JSON FORMAT:

[
{
"category":"National",
"title":"News headline",
"description":"2-3 line explanation"
}
]


Cover:

1. National
2. International
3. Economy
4. Science & Technology
5. Government Schemes
6. Sports


User Request:

${userPrompt}

`;



const response = await fetch(

"https://velona.in/gateway/v1/inference/run",

{

method:"POST",

headers:{

"Content-Type":"application/json",

"Authorization":
`Bearer ${env.VELONA_KEY}`

},


body:JSON.stringify({

model:"qwen/qwen3.7-flash",

turns:[

{

role:"user",

content:prompt

}

]

})

}

);



const data = await response.json();



let output =
data?.data?.output || "[]";


// Clean JSON

output = output
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();



let json;


try{

json = JSON.parse(output);

}

catch(e){

json=[
{
category:"AI",
title:"Response Format Error",
description:output
}
];

}



return new Response(

JSON.stringify({

status:"success",

articles:json

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

status:"error",

message:error.message

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

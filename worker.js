export default {
async fetch(request, env) {

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "POST, OPTIONS",
"Access-Control-Allow-Headers": "Content-Type"
};

// CORS preflight
if(request.method === "OPTIONS"){
return new Response(null,{
headers:corsHeaders
});
}

if(request.method !== "POST"){
return new Response("AI Bot Running",{
headers:corsHeaders
});
}


try{

const body = await request.json();

const aiResponse = await fetch(
"https://agentrouter.org/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+env.API_KEY
},
body:JSON.stringify(body)
});


return new Response(
await aiResponse.text(),
{
headers:{
...corsHeaders,
"Content-Type":"application/json"
}
});

}
catch(error){

return new Response(
JSON.stringify({
error:error.message
}),
{
status:500,
headers:{
...corsHeaders,
"Content-Type":"application/json"
}
});

}

}
}

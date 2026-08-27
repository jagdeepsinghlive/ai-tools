export default {
async fetch(request, env) {

if(request.method !== "POST"){
return new Response("AI Bot Running");
}

const body = await request.json();

const response = await fetch(
"https://agentrouter.org/v1/chat/completions",
{
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer "+env.API_KEY
},
body:JSON.stringify(body)
}
);

return new Response(
await response.text(),
{
headers:{
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
}
}
);

}
}

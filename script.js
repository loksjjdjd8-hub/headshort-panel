const $=s=>document.querySelector(s);
let keys=JSON.parse(localStorage.getItem("hsDemoKeys")||"[]");
let account=JSON.parse(localStorage.getItem("hsDemoAccount")||"null");
let current=localStorage.getItem("hsDemoCurrent")||"";

function showAuth(mode){$("#loginBox").classList.toggle("hidden",mode!=="login");$("#registerBox").classList.toggle("hidden",mode!=="register");$("#authMsg").textContent=""}
function enter(user){current=user;localStorage.setItem("hsDemoCurrent",user);$("#auth").classList.add("hidden");$("#app").classList.remove("hidden");$("#userLabel").textContent="🟣 "+user;$("#profileName").textContent=user;$("#avatar").textContent=user[0].toUpperCase();render()}
function makeKey(){return "HS-DEMO-"+crypto.randomUUID().replaceAll("-","").slice(0,20).toUpperCase()}
function generate(){let days=+$("#duration").value,now=new Date(),exp=new Date(now.getTime()+days*86400000);keys.unshift({key:makeKey(),created:now.toISOString(),expires:exp.toISOString()});localStorage.setItem("hsDemoKeys",JSON.stringify(keys));render();$("#result").classList.remove("hidden");$("#result").textContent="Generated: "+keys[0].key}
function render(){$("#total").textContent=keys.length;$("#active").textContent=keys.filter(k=>new Date(k.expires)>new Date()).length;$("#soon").textContent=keys.filter(k=>{let d=new Date(k.expires)-new Date();return d>0&&d<259200000}).length;$("#table").innerHTML=keys.length?keys.map(k=>`<tr><td><code>${k.key}</code></td><td>${new Date(k.created).toLocaleString()}</td><td>${new Date(k.expires).toLocaleString()}</td><td class="status">${new Date(k.expires)>new Date()?"ACTIVE":"EXPIRED"}</td></tr>`).join(""):`<tr><td colspan="4">No keys yet.</td></tr>`}
$("#showRegister").onclick=()=>showAuth("register");$("#showLogin").onclick=()=>showAuth("login");
$("#registerBtn").onclick=()=>{let u=$("#regUser").value.trim(),p=$("#regPass").value,p2=$("#regPass2").value;if(!u||!p)return $("#authMsg").textContent="Enter username and password.";if(p!==p2)return $("#authMsg").textContent="Passwords do not match.";account={user:u,pass:p};localStorage.setItem("hsDemoAccount",JSON.stringify(account));enter(u)};
$("#loginBtn").onclick=()=>{let u=$("#loginUser").value.trim(),p=$("#loginPass").value;if(!account)return $("#authMsg").textContent="No demo account yet. Register first.";if(u!==account.user||p!==account.pass)return $("#authMsg").textContent="Incorrect demo login.";enter(u)};
$("#logout").onclick=()=>{localStorage.removeItem("hsDemoCurrent");location.reload()};
$("#gen").onclick=generate;$("#gen2").onclick=generate;$("#dl").onclick=()=>alert("Demo button only — connect your own legitimate application file.");
document.querySelectorAll(".nav[data-page]").forEach(b=>b.onclick=()=>{document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));b.classList.add("active");document.querySelectorAll(".page").forEach(x=>x.classList.remove("active-page"));$("#"+b.dataset.page).classList.add("active-page");$("#title").textContent=b.textContent.replace(/^[^ ]+ /,"");$("#sidebar").classList.remove("open")});
$("#menu").onclick=()=>$("#sidebar").classList.toggle("open");
if(current&&account)enter(current);else showAuth("login");

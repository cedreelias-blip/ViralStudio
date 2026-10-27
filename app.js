const $ = id => document.getElementById(id);
const state = { scenes: [], images: [], current: 0, musicUrl: null, imageUrls: [] };
const canvas = $("preview"), ctx = canvas.getContext("2d");
const defaultScene = (title, text) => ({title, text, imageIndex:-1});
function setStatus(msg){ $("exportStatus").textContent = msg; }
function escapeText(s){ return String(s || ""); }

function buildDraft(){
  const topic = $("topic").value.trim() || "una historia que está dando de qué hablar";
  const style = $("style").value;
  const duration = Number($("duration").value);
  let intro = "Espera, porque lo que pasó después te va a sorprender.";
  let middle = `Hoy hablamos de ${topic}. Esto es lo que debes saber antes de sacar tus propias conclusiones.`;
  let reveal = "Hay detalles que todavía necesitan confirmación, así que conviene separar los hechos de los rumores.";
  let ending = "¿Tú qué opinas? Te leo en los comentarios. Sígueme para más historias.";
  if(style==="news"){intro="Esto es lo que se sabe hasta ahora.";middle=`Vamos con el contexto de ${topic}.`;reveal="Comprueba las fuentes y las fechas antes de compartir la información.";ending="¿Qué dato te parece más importante? Déjalo en los comentarios."}
  if(style==="facts"){intro="Aquí tienes algo que quizá no sabías.";middle=`Hablemos de ${topic}, paso a paso.`;reveal="Y ese es el detalle que hace que esta historia sea tan interesante.";ending="¿Conocías este dato? Guarda el video y compártelo."}
  if(style==="horror"){intro="Hay historias que es mejor no escuchar de noche.";middle=`Todo comienza con ${topic}...`;reveal="Pero cuando parecía que todo había terminado, ocurrió algo inexplicable.";ending="¿Tú te atreverías a seguir investigando?";}
  if(style==="motivation"){intro="No necesitas tenerlo todo resuelto para comenzar.";middle=`Piensa en esto: ${topic}.`;reveal="El cambio empieza con una decisión pequeña, repetida cada día.";ending="Guarda este video para cuando necesites un impulso."}
  if(style==="anime"){intro="Esta historia tiene un detalle que muchos pasan por alto.";middle=`Hoy repasamos ${topic}.`;reveal="Y ese giro cambia la forma de entender lo que ocurrió.";ending="¿Qué otra historia quieres que analicemos?"}
  const list = duration===30 ? [defaultScene("Gancho",intro),defaultScene("Contexto",middle),defaultScene("Punto clave",reveal),defaultScene("Cierre",ending)] :
    [defaultScene("Gancho",intro),defaultScene("Contexto",middle),defaultScene("Desarrollo","Primero, observa los detalles y el contexto completo."),defaultScene("Revelación",reveal),defaultScene("Cierre",ending)];
  state.scenes = list;
  state.current = 0;
  renderScenes(); drawPreview();
}
function renderScenes(){
  const wrap = $("scenes"); wrap.innerHTML="";
  state.scenes.forEach((scene,i)=>{
    const card=document.createElement("div");card.className="scene-card";
    const top=document.createElement("div");top.className="scene-top";
    const name=document.createElement("strong");name.textContent=`ESCENA ${i+1}`;
    const remove=document.createElement("button");remove.className="small-action";remove.textContent="Eliminar";remove.disabled=state.scenes.length<=1;
    remove.onclick=()=>{state.scenes.splice(i,1);state.current=Math.min(state.current,state.scenes.length-1);renderScenes();drawPreview()};
    top.append(name,remove);card.append(top);
    const lab1=document.createElement("label");lab1.textContent="Título / texto en pantalla";
    const title=document.createElement("textarea");title.rows=2;title.value=scene.title;title.maxLength=100;
    title.addEventListener("input",()=>{scene.title=title.value;if(state.current===i)drawPreview()});
    const lab2=document.createElement("label");lab2.textContent="Narración";
    const text=document.createElement("textarea");text.rows=3;text.value=scene.text;text.maxLength=900;
    text.addEventListener("input",()=>{scene.text=text.value;if(state.current===i)drawPreview()});
    const imgLabel=document.createElement("label");imgLabel.textContent="Imagen de fondo";
    const select=document.createElement("select");
    const noImg=document.createElement("option");noImg.value="-1";noImg.textContent="Fondo gráfico";select.append(noImg);
    state.images.forEach((im,j)=>{const op=document.createElement("option");op.value=String(j);op.textContent=`Imagen ${j+1}`;select.append(op)});
    select.value=String(scene.imageIndex);select.onchange=()=>{scene.imageIndex=Number(select.value);if(state.current===i)drawPreview()};
    card.append(lab1,title,lab2,text,imgLabel,select);wrap.append(card);
  });
}
function wrapLines(text,maxWidth,font){
  ctx.font=font; const words=String(text||"").split(/\s+/); const lines=[]; let line="";
  for(const word of words){const test=line?line+" "+word:word;if(ctx.measureText(test).width>maxWidth && line){lines.push(line);line=word}else line=test}
  if(line)lines.push(line);return lines;
}
function roundedRect(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function drawPreview(){
  const w=canvas.width,h=canvas.height,s=state.scenes[state.current]||defaultScene("Tu video","Añade una idea para comenzar.");
  ctx.clearRect(0,0,w,h);
  const img=s.imageIndex>=0?state.images[s.imageIndex]?.img:null;
  if(img){const scale=Math.max(w/img.width,h/img.height),iw=img.width*scale,ih=img.height*scale;ctx.drawImage(img,(w-iw)/2,(h-ih)/2,iw,ih)}
  else{
    const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#312e81");g.addColorStop(.5,"#111827");g.addColorStop(1,"#082f49");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.globalAlpha=.24;for(let i=0;i<13;i++){ctx.beginPath();ctx.arc((i*83+25)%w,(i*137+40)%h,22+(i%3)*10,0,Math.PI*2);ctx.fillStyle=i%2?"#a78bfa":"#67e8f9";ctx.fill()}ctx.globalAlpha=1;
  }
  const shade=ctx.createLinearGradient(0,0,0,h);shade.addColorStop(0,"rgba(0,0,0,.15)");shade.addColorStop(.35,"rgba(0,0,0,.12)");shade.addColorStop(1,"rgba(0,0,0,.88)");ctx.fillStyle=shade;ctx.fillRect(0,0,w,h);
  ctx.fillStyle="#67e8f9";ctx.font="bold 13px system-ui";ctx.fillText("VIRALSTUDIO AI",22,34);
  roundedRect(20,h-246,w-40,185,18,"rgba(8,12,25,.64)");
  const titleLines=wrapLines(s.title||"Tu título",w-68,"bold 29px system-ui").slice(0,4);
  ctx.fillStyle="#fff";ctx.font="bold 29px system-ui";let y=h-212;
  titleLines.forEach(line=>{ctx.fillText(line,34,y);y+=36});
  const sub=wrapLines(s.text,w-68,"15px system-ui").slice(0,4);ctx.fillStyle="#e5e7eb";ctx.font="15px system-ui";y=Math.max(y+6,h-91);
  sub.forEach(line=>{ctx.fillText(line,34,y);y+=20});
  ctx.fillStyle="#c4b5fd";ctx.font="bold 12px system-ui";ctx.fillText("@RANDOM_VID",22,h-22);
  $("sceneCounter").textContent=`Escena ${state.current+1} de ${state.scenes.length}`;
}
function loadImageFiles(files){
  [...files].forEach(file=>{if(!file.type.startsWith("image/"))return;const url=URL.createObjectURL(file);const img=new Image();img.onload=()=>{state.images.push({name:file.name,img,url});state.imageUrls.push(url);renderImages();renderScenes();drawPreview()};img.src=url});
}
function renderImages(){const box=$("imageList");box.innerHTML="";state.images.forEach((im,i)=>{const img=document.createElement("img");img.className="image-thumb";img.src=im.url;img.alt=`Imagen ${i+1}`;box.append(img)})}
function selectVoice(){
  if(!("speechSynthesis" in window))return;
  const voices=speechSynthesis.getVoices();const sel=$("voiceSelect");const old=sel.value;sel.innerHTML='<option value="">Voz predeterminada</option>';
  voices.forEach((v,i)=>{const op=document.createElement("option");op.value=String(i);op.textContent=`${v.name} (${v.lang})`;sel.append(op)});if(old)sel.value=old;
}
function speak(text){
  if(!("speechSynthesis" in window)){setStatus("Este navegador no ofrece voz sintética.");return}
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="es-ES";u.rate=Number($("rate").value);
  const voices=speechSynthesis.getVoices();const idx=$("voiceSelect").value;if(idx!==""&&voices[Number(idx)])u.voice=voices[Number(idx)];
  speechSynthesis.speak(u);setStatus("Reproduciendo narración en el dispositivo.");
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
function exportVideo(){
  if(!canvas.captureStream||!window.MediaRecorder){setStatus("Tu navegador no permite esta exportación. Guarda las imágenes de escena o usa un navegador Chromium reciente.");return}
  const stream=canvas.captureStream(24);let mime="video/webm;codecs=vp9";if(!MediaRecorder.isTypeSupported(mime))mime="video/webm";if(!MediaRecorder.isTypeSupported(mime)){setStatus("Formato de grabación no compatible en este navegador.");return}
  let recorder;try{recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:3500000})}catch(e){setStatus("No se pudo iniciar la exportación en este dispositivo.");return}
  const chunks=[];recorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  recorder.onerror=()=>setStatus("Error durante la exportación. Prueba con menos imágenes o escenas.");
  recorder.onstop=()=>{const blob=new Blob(chunks,{type:mime});downloadBlob(blob,"viralstudio-video.webm");stream.getTracks().forEach(t=>t.stop());setStatus("Video visual exportado. Añade la voz y música en tu editor móvil si lo necesitas.")};
  recorder.start();let i=0;const total=state.scenes.length;const sceneMs=Math.max(2500,Math.round(Number($("duration").value)*1000/total));
  const advance=()=>{state.current=i;drawPreview();i++;if(i<total){setTimeout(advance,sceneMs)}else{setTimeout(()=>recorder.stop(),sceneMs)}};
  state.current=0;drawPreview();setStatus("Exportando… mantén esta pantalla abierta.");setTimeout(advance,sceneMs);
}
function projectData(){return {app:"ViralStudio AI",version:1,topic:$("topic").value,style:$("style").value,duration:$("duration").value,scenes:state.scenes.map(s=>({title:s.title,text:s.text,imageIndex:s.imageIndex})),imageNames:state.images.map(i=>i.name),note:"Las imágenes no se incluyen en este JSON. Vuelve a seleccionarlas al importar."}}
function importProject(obj){
  if(!obj||!Array.isArray(obj.scenes)||obj.scenes.length===0)throw new Error("Proyecto inválido");
  $("topic").value=obj.topic||"";$("style").value=obj.style||"drama";$("duration").value=String(obj.duration||45);
  state.scenes=obj.scenes.map(s=>({title:String(s.title||""),text:String(s.text||""),imageIndex:-1}));state.current=0;renderScenes();drawPreview();
}
$("makeScript").onclick=buildDraft;
$("addScene").onclick=()=>{state.scenes.push(defaultScene("Nueva escena","Escribe aquí la narración de esta escena."));state.current=state.scenes.length-1;renderScenes();drawPreview()};
$("speakAll").onclick=()=>speak(state.scenes.map(s=>s.text).join(" "));
$("imageFiles").addEventListener("change",e=>loadImageFiles(e.target.files));
$("prevScene").onclick=()=>{state.current=(state.current-1+state.scenes.length)%state.scenes.length;drawPreview()};
$("nextScene").onclick=()=>{state.current=(state.current+1)%state.scenes.length;drawPreview()};
$("downloadCard").onclick=()=>canvas.toBlob(blob=>blob&&downloadBlob(blob,`viralstudio-escena-${state.current+1}.png`),"image/png");
$("exportVideo").onclick=exportVideo;
$("saveProject").onclick=()=>downloadBlob(new Blob([JSON.stringify(projectData(),null,2)],{type:"application/json"}),"viralstudio-proyecto.json");
$("loadProject").onclick=()=>$("projectFile").click();
$("projectFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{importProject(JSON.parse(await f.text()));setStatus("Proyecto importado. Vuelve a seleccionar las imágenes si las usabas.")}catch(err){setStatus("No se pudo importar: archivo JSON inválido.")}e.target.value=""};
if("speechSynthesis" in window){selectVoice();speechSynthesis.onvoiceschanged=selectVoice}
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
buildDraft();

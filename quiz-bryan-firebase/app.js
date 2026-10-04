import { db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Preguntas basadas exclusivamente en la Guía Completa de Tecnología Digital proporcionada.
const QUESTIONS = [
 {q:'¿Cuál es el botón principal del mouse en la configuración normal?',a:['Botón derecho','Botón izquierdo','La rueda','El botón central'],c:1},
 {q:'¿Qué hace normalmente la rueda del mouse?',a:['Apaga la computadora','Desplaza la página','Abre Configuración','Cambia el teclado'],c:1},
 {q:'¿Qué opción de Propiedades: Mouse permite hacer que el botón derecho sea el principal?',a:['Velocidad de doble clic','Punteros y opciones','Intercambiar botones primario y secundario','Rueda'],c:2},
 {q:'¿Qué unidad es la más pequeña y representa 0 o 1?',a:['Byte','KB','Bit','MB'],c:2},
 {q:'¿Cuántos bits forman un byte?',a:['2','4','8','16'],c:2},
 {q:'¿Qué componente procesa instrucciones y coordina las tareas?',a:['RAM','CPU','GPU','Disco duro'],c:1},
 {q:'¿Qué componente funciona como espacio temporal de trabajo y es volátil?',a:['RAM','Disco duro','Placa madre','Fuente de poder'],c:0},
 {q:'¿Qué componente guarda archivos y programas de forma permanente?',a:['RAM','CPU','Disco duro / SSD','Ventilador'],c:2},
 {q:'¿Qué componente conecta y permite la comunicación entre los componentes?',a:['GPU','Placa madre','RAM','Fuente de poder'],c:1},
 {q:'¿Qué componente procesa gráficos, imágenes y video?',a:['GPU','CPU','RAM','Placa madre'],c:0},
 {q:'¿Qué hace la fuente de poder?',a:['Guarda archivos','Procesa gráficos','Proporciona y distribuye energía eléctrica','Controla el cursor'],c:2},
 {q:'¿Cuál de estos es un periférico de entrada?',a:['Monitor','Impresora','Teclado','Parlantes'],c:2},
 {q:'¿Cuál de estos es un periférico de salida?',a:['Mouse','Micrófono','Monitor','Teclado'],c:2},
 {q:'¿Qué conector transmite video y audio digital?',a:['VGA','Ethernet','HDMI','Audio jack'],c:2},
 {q:'¿Qué conector se relaciona con video analógico y es más antiguo?',a:['USB','HDMI','VGA','Ethernet'],c:2},
 {q:'¿Qué conexión corresponde a red cableada?',a:['Ethernet','HDMI','VGA','USB'],c:0},
 {q:'¿Qué hace un firewall?',a:['Aumenta la RAM','Revisa el tráfico de red y aplica reglas de conexión','Guarda archivos permanentemente','Cambia el nombre de archivos'],c:1},
 {q:'¿Cuál es un ejemplo de software de aplicación?',a:['Sistema operativo','Controlador','Navegador','Utilidad del sistema'],c:2},
 {q:'Verdadero o falso: Backspace borra a la izquierda del cursor.',a:['Verdadero','Falso'],c:0},
 {q:'Verdadero o falso: Windows + L bloquea la computadora.',a:['Verdadero','Falso'],c:0},
 {q:'Verdadero o falso: Windows + E abre el Explorador de archivos.',a:['Verdadero','Falso'],c:0},
 {q:'Verdadero o falso: Windows + D muestra u oculta el escritorio.',a:['Verdadero','Falso'],c:0},
 {q:'Verdadero o falso: Win + I abre Configuración.',a:['Verdadero','Falso'],c:0},
 {q:'¿Qué tecla permite cambiar el nombre de un archivo o carpeta según la guía?',a:['F1','F2','F5','F12'],c:1},
 {q:'¿Dónde se encuentra normalmente la barra de tareas de Windows?',a:['En la parte superior','En el centro del monitor','En la parte inferior','Dentro del BIOS'],c:2}
];

let current=0, score=0, player='', selected=false, quiz=[];
const $=id=>document.getElementById(id);
function shuffle(arr){return [...arr].sort(()=>Math.random()-.5)}
function startQuiz(){
 player=$('player-name').value.trim();
 if(!player){$('start-error').textContent='Escribe tu nombre para comenzar.';return}
 $('start-error').textContent=''; current=0;score=0;selected=false;quiz=shuffle(QUESTIONS).slice(0,20);
 $('start-screen').classList.add('hidden');$('result-screen').classList.add('hidden');$('quiz-screen').classList.remove('hidden');
 $('player-label').textContent='👤 '+player; renderQuestion();
}
function renderQuestion(){
 selected=false;$('next-btn').classList.add('hidden');const item=quiz[current];
 $('question-number').textContent='Pregunta '+(current+1);$('progress-label').textContent=(current+1)+' / '+quiz.length;
 $('progress-bar').style.width=((current)/quiz.length*100)+'%';$('question-text').textContent=item.q;
 const box=$('answers');box.innerHTML='';item.a.forEach((answer,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=String.fromCharCode(65+i)+'. '+answer;b.onclick=()=>choose(i,b);box.appendChild(b)});
}
function choose(i,btn){if(selected)return;selected=true;const item=quiz[current];document.querySelectorAll('.answer').forEach((b,n)=>{b.disabled=true;if(n===item.c)b.classList.add('correct')});if(i===item.c)score++;else btn.classList.add('wrong');$('next-btn').classList.remove('hidden')}
function next(){if(!selected)return;if(current<quiz.length-1){current++;renderQuestion()}else finish()}
async function finish(){
 $('quiz-screen').classList.add('hidden');$('result-screen').classList.remove('hidden');$('progress-bar').style.width='100%';
 const pct=Math.round(score/quiz.length*100);$('result-name').textContent=player;$('score-value').textContent=score;$('score-total').textContent=' / '+quiz.length;$('result-percent').textContent=pct+'%';
 $('result-message').textContent=pct>=90?'🔥 ¡Excelente trabajo!':pct>=70?'👏 ¡Muy bien! Sigue practicando.':pct>=50?'💪 Vas bien, pero puedes mejorar.':'📚 Repasa la guía y vuelve a intentarlo.';
 await saveResult({name:player,score,total:quiz.length,percent:pct});
}
async function saveResult(data){
 $('save-status').textContent='Guardando resultado...';
 try {
   await addDoc(collection(db,'results'),{...data,finishedAt:serverTimestamp()});
   $('save-status').textContent='✅ Resultado guardado correctamente.';
 } catch(error) {
   console.error(error);
   $('save-status').textContent='⚠️ No se pudo guardar el resultado. Revisa la conexión con Firebase.';
 }
}
$('start-btn').onclick=startQuiz;$('next-btn').onclick=next;$('restart-btn').onclick=()=>{$('result-screen').classList.add('hidden');$('start-screen').classList.remove('hidden');$('player-name').value='';$('save-status').textContent=''};
$('player-name').addEventListener('keydown',e=>{if(e.key==='Enter')startQuiz()});

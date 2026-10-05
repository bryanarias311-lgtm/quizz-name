import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu configuración de Firebase Console ya vinculada
const firebaseConfig = {
  apiKey: "AIzaSyDVMrDyJEYwoSEELtbE54WOyesV5Aa5-eA",
  authDomain: "quizz-del-profe-bryan.firebaseapp.com",
  projectId: "quizz-del-profe-bryan",
  storageBucket: "quizz-del-profe-bryan.firebasestorage.app",
  messagingSenderId: "493671360525",
  appId: "1:493671360525:web:a955632a53c503624d0d44",
  measurementId: "G-PGKLM60G6C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let userDocId = "";
let tabSwitchCount = 0;

const questions = [
    // --- VERDADERO / FALSO (15) ---
    { type: "vf", question: "1. En las preguntas de Verdadero/Falso, una sola palabra equivocada (como 'izquierda' por 'derecha' o 'temporal' por 'permanente') cambia toda la respuesta a Falso.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "2. El orden correcto para estudiar los factores de una PC es: 1° CPU, 2° RAM y 3° Disco Duro.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "3. Cambiar la 'Velocidad de doble clic' en el mouse hace que el cursor/puntero se mueva más rápido por toda la pantalla.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "4. En la configuración del mouse, una persona zurda puede cambiar las funciones del botón derecho para que sea su botón principal.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "5. Para poner una tilde con el código ALT (ejemplo Alt + 160), debes usar los números del teclado numérico de la derecha con 'Bloq Num' activado.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "6. La tecla 'Backspace' (retroceso) borra el texto que está a la derecha del cursor.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "7. Un Byte es la reunión de 8 bits.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "8. Un Kilobyte (KB) equivale exactamente a 1,000 bytes.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "9. La memoria RAM guarda los archivos de forma permanente; no se borran al apagar la computadora.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "10. La Placa Madre es la pieza que conecta y permite que todos los componentes de la computadora se comuniquen entre sí.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "11. En el examen, cuando te pidan arrastrar las partes del disco duro, las oraciones te van a decir el nombre de la pieza de forma directa.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "12. Un Firewall y un Antivirus son exactamente la misma herramienta de seguridad.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "13. El software de aplicación (como Word o un juego) es más básico e importante que el software de sistema (como Windows) porque controlan la PC.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "14. El protector de pantalla del monitor solo sirve para decorar y no tiene ninguna otra utilidad.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "15. El Panel de Control clásico aún existe en Windows porque muchas opciones avanzadas no se han movido a la app de Configuración moderna.", options: ["Verdadero", "Falso"], correct: 0 },

    // --- SELECCIÓN MÚLTIPLE (23) ---
    { type: "multiple", question: "16. ¿Por qué el procesador (CPU) es el Factor 1 en una computadora?", options: ["Porque guarda las fotos y archivos para siempre.", "Porque procesa las instrucciones y si no funciona, nada puede ejecutar programas.", "Porque evita que la pantalla se apague.", "Porque le da energía eléctrica a la computadora."], correct: 1 },
    { type: "multiple", question: "17. ¿Para qué sirve el botón derecho del mouse en su uso normal?", options: ["Para seleccionar un texto o abrir carpetas con doble clic.", "Para abrir el menú contextual con opciones del objeto seleccionado.", "Para mover la pantalla hacia arriba o hacia abajo.", "Para apagar el monitor."], correct: 1 },
    { type: "multiple", question: "18. En las propiedades del mouse, ¿qué casilla debes marcar para cambiar el botón con el que seleccionas y arrastras?", options: ["Velocidad del puntero.", "Intercambiar botones primario y secundario.", "Velocidad de doble clic.", "Rastro del puntero."], correct: 1 },
    { type: "multiple", question: "19. ¿Cuál combinación de teclas te permite escribir la letra 'á' con tilde usando códigos ALT?", options: ["Alt + 160", "Alt + 161", "Alt + 162", "Alt + 130"], correct: 0 },
    { type: "multiple", question: "20. ¿Qué letra obtienes si escribes la combinación Alt + 130?", options: ["á", "é", "í", "ú"], correct: 1 },
    { type: "multiple", question: "21. Si la computadora se traba o quieres ver las opciones de seguridad, ¿qué atajo debes presionar?", options: ["Ctrl + Alt + Supr (o Delete)", "Win + L", "Win + D", "Ctrl + Shift + N"], correct: 0 },
    { type: "multiple", question: "22. Vas a salir al recreo y quieres dejar tu computadora bloqueada de inmediato, ¿qué atajo usas?", options: ["Windows + D", "Windows + L", "Windows + E", "Windows + R"], correct: 1 },
    { type: "multiple", question: "23. ¿Qué atajo de teclado sirve para ocultar todas las ventanas abiertas y mostrar el escritorio?", options: ["Windows + D", "Windows + E", "Win + 1", "Win + A"], correct: 0 },
    { type: "multiple", question: "24. Para abrir el 'Explorador de archivos' de Windows rápidamente, presionas:", options: ["Windows + E", "Windows + L", "Win + R", "Ctrl + Shift + Esc"], correct: 0 },
    { type: "multiple", question: "25. ¿Qué acción realiza el atajo de teclado Ctrl + Shift + N dentro de una carpeta?", options: ["Elimina la carpeta seleccionada.", "Crea una Nueva carpeta de inmediato.", "Abre el Administrador de tareas.", "Cierra la ventana activa."], correct: 1 },
    { type: "multiple", question: "26. ¿Cuál es la combinación de teclas para abrir directamente el Administrador de Tareas?", options: ["Ctrl + Shift + Esc", "Ctrl + Alt + Supr", "Win + R", "Win + I"], correct: 0 },
    { type: "multiple", question: "27. ¿Cómo se llama la unidad de almacenamiento más pequeña en informática (que vale 0 o 1)?", options: ["Byte", "Bit", "Kilobyte", "Gigabyte"], correct: 1 },
    { type: "multiple", question: "28. ¿A cuántos Megabytes (MB) equivale 1 Gigabyte (GB)?", options: ["1,000 MB", "1,024 MB", "100 MB", "8 MB"], correct: 1 },
    { type: "multiple", question: "29. ¿Qué componente interno de la computadora se encarga de procesar los gráficos y las imágenes de los juegos o videos?", options: ["CPU", "GPU (Tarjeta gráfica)", "Fuente de poder", "RAM"], correct: 1 },
    { type: "multiple", question: "30. ¿Qué pieza se encarga de recibir la corriente eléctrica de la pared y repartirla a todas las partes de la PC?", options: ["Placa madre", "Fuente de poder", "Ventilador", "Disco duro"], correct: 1 },
    { type: "multiple", question: "31. Es un sistema de seguridad que revisa las conexiones de red para permitir o bloquear el paso de información:", options: ["Antivirus", "Firewall", "Navegador web", "Procesador"], correct: 1 },
    { type: "multiple", question: "32. Un programa de escritura (como Word), un navegador (como Chrome) y un videojuego son ejemplos de:", options: ["Software de sistema", "Software de aplicación", "Controladores de hardware", "Archivos ocultos"], correct: 1 },
    { type: "multiple", question: "33. ¿Cuál de los siguientes objetos es un periférico de Entrada (introduce datos a la PC)?", options: ["Monitor", "Impresora", "Micrófono", "Parlantes"], correct: 2 },
    { type: "multiple", question: "34. ¿Qué tipo de cable o puerto antiguo se usa para transmitir únicamente video analógico a un monitor?", options: ["HDMI", "VGA", "Ethernet", "USB"], correct: 1 },
    { type: "multiple", question: "35. Si seleccionas un archivo y presionas esta tecla, podrás 'Cambiar su nombre' directamente:", options: ["F2", "F5", "F1", "F12"], correct: 0 },
    { type: "multiple", question: "36. Para Ocultar un archivo en Windows debes hacer clic derecho, entrar en Propiedades (pestaña General) y activar la casilla:", options: ["Solo lectura", "Oculto", "Protegido", "Sistema"], correct: 1 },
    { type: "multiple", question: "37. ¿Cuál es la función de la Barra de Tareas (ubicada abajo en Windows)?", options: ["Sirve para abrir el menú Inicio, cambiar de ventanas y ver la hora o notificaciones.", "Aumenta la memoria RAM de la computadora.", "Procesa las imágenes de la tarjeta gráfica.", "Cambia la velocidad del puntero del mouse."], correct: 0 },
    { type: "multiple", question: "38. ¿Qué combinación de teclas abre directamente la app de Configuración moderna en Windows?", options: ["Windows + I", "Windows + A", "Windows + R", "Windows + E"], correct: 0 },

    // --- ARRASTRAR Y SOLTAR (1 EJERCICIO COMPLETO PARA SUMAR LAS 39 PREGUNTAS) ---
    {
        type: "drag",
        question: "39. Partes internas del Disco Duro: Arrastra cada nombre sobre la definición correcta (¡Atención: 1 nombre sobra!):",
        items: ["Cabezal", "Cara", "Pista", "Plato magnético", "Cluster", "Cilindro"],
        matches: [
            { id: 1, text: "Pieza móvil que lee y escribe la información sobre la superficie del disco.", target: "Cabezal" },
            { id: 2, text: "Cada uno de los dos lados útiles de un plato donde se pueden grabar datos.", target: "Cara" },
            { id: 3, text: "Un círculo o anillo de datos ubicado a una distancia fija del centro del disco.", target: "Pista" },
            { id: 4, text: "Disco circular cubierto de material magnético que gira rápido para guardar archivos.", target: "Plato magnético" },
            { id: 5, text: "Grupo de sectores que el sistema de archivos usa como la unidad básica para guardar datos.", target: "Cluster" }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const usernameInput = document.getElementById("username");
const questionTitle = document.getElementById("question-title");
const optionsContainer = document.getElementById("options-container");
const dragDropContainer = document.getElementById("drag-drop-container");
const dropZones = document.getElementById("drop-zones");
const dragItems = document.getElementById("drag-items");
const submitDragBtn = document.getElementById("submit-drag-btn");

document.addEventListener("visibilitychange", async () => {
    if (document.hidden && userName !== "") {
        tabSwitchCount++;
        if (userDocId) {
            await setDoc(doc(db, "en_vivo", userDocId), {
                salidasDePestana: tabSwitchCount,
                alerta: "¡Cambió de pestaña!"
            }, { merge: true });
        }
    }
});

startBtn.addEventListener("click", async () => {
    userName = usernameInput.value.trim();
    if (!userName) return alert("Por favor escribe tu nombre antes de comenzar.");

    userDocId = `${userName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    
    try {
        await setDoc(doc(db, "en_vivo", userDocId), {
            nombre: userName,
            preguntaActual: 1,
            puntuacionActual: 0,
            salidasDePestana: 0,
            estado: "En curso",
            ultimaActividad: new Date()
        });
    } catch (e) {
        console.error("Error al registrar inicio:", e);
    }
    
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
});

function loadQuestion() {
    resetState();
    const q = questions[currentQuestionIndex];
    document.getElementById("question-number").innerText = `Pregunta ${currentQuestionIndex + 1} de 39`;
    document.getElementById("score-live").innerText = `Puntos: ${score}`;
    questionTitle.innerText = q.question;

    if (q.type === "multiple" || q.type === "vf") {
        optionsContainer.classList.remove("hidden");
        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.innerText = opt;
            btn.className = "option-btn";
            btn.onclick = () => selectOption(idx, q.correct, opt);
            optionsContainer.appendChild(btn);
        });
    } else if (q.type === "drag") {
        dragDropContainer.classList.remove("hidden");
        setupDragAndDrop(q);
    }
}

function resetState() {
    optionsContainer.innerHTML = "";
    dropZones.innerHTML = "";
    dragItems.innerHTML = "";
    optionsContainer.classList.add("hidden");
    dragDropContainer.classList.add("hidden");
}

async function selectOption(selected, correct, selectedText) {
    if (selected === correct) score++;

    try {
        await setDoc(doc(db, "en_vivo", userDocId), {
            preguntaActual: currentQuestionIndex + 1,
            ultimaRespuesta: selectedText,
            puntuacionActual: score,
            ultimaActividad: new Date()
        }, { merge: true });
    } catch (e) {
        console.error("Error en tiempo real:", e);
    }

    nextQuestion();
}

function setupDragAndDrop(q) {
    q.matches.forEach(m => {
        const zone = document.createElement("div");
        zone.className = "drop-zone";
        zone.dataset.target = m.target;
        zone.innerHTML = `<p style="flex: 1; text-align: left; margin-right: 10px;">${m.text}</p><div class="drop-target" data-filled="">Arrastra aquí</div>`;
        dropZones.appendChild(zone);
    });

    const shuffledItems = [...q.items].sort(() => Math.random() - 0.5);
    shuffledItems.forEach(item => {
        const badge = document.createElement("div");
        badge.className = "drag-item";
        badge.draggable = true;
        badge.innerText = item;
        badge.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", item));
        dragItems.appendChild(badge);
    });

    document.querySelectorAll(".drop-target").forEach(target => {
        target.addEventListener("dragover", e => e.preventDefault());
        target.addEventListener("drop", e => {
            e.preventDefault();
            const text = e.dataTransfer.getData("text/plain");
            target.innerText = text;
            target.dataset.filled = text;
            target.classList.add("filled");
        });
    });

    submitDragBtn.onclick = async () => {
        let correctCount = 0;
        document.querySelectorAll(".drop-zone").forEach(zone => {
            const filled = zone.querySelector(".drop-target").dataset.filled;
            if (filled === zone.dataset.target) {
                correctCount++;
            }
        });
        score += correctCount;

        try {
            await setDoc(doc(db, "en_vivo", userDocId), {
                preguntaActual: 39,
                ultimaRespuesta: `Drag & Drop (${correctCount}/5)`,
                puntuacionActual: score,
                ultimaActividad: new Date()
            }, { merge: true });
        } catch (e) {
            console.error("Error en tiempo real:", e);
        }

        nextQuestion();
    };
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
    }
}

async function finishQuiz() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    
    const totalPossible = 43; // 38 preguntas simples + 5 aciertos del ejercicio de arrastrar
    const percentage = Math.round((score / totalPossible) * 100);

    document.getElementById("result-user").innerText = `Estudiante: ${userName}`;
    document.getElementById("result-percent").innerText = `Porcentaje de Aciertos: ${percentage}%`;
    document.getElementById("result-score").innerText = `Puntuación: ${score} / ${totalPossible} puntos`;

    try {
        await setDoc(doc(db, "en_vivo", userDocId), {
            estado: "Completado",
            porcentajeFinal: percentage,
            salidasDePestana: tabSwitchCount,
            ultimaActividad: new Date()
        }, { merge: true });
    } catch (e) {
        console.error("Error al actualizar:", e);
    }

    try {
        await addDoc(collection(db, "resultados"), {
            nombre: userName,
            puntuacion: score,
            porcentaje: percentage,
            total: totalPossible,
            salidasDePestana: tabSwitchCount,
            fecha: new Date()
        });
    } catch (error) {
        console.error("Error al enviar resultado final:", error);
    }
}

restartBtn.addEventListener("click", () => location.reload());

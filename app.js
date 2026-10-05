import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// COPIA AQUÍ TU CONFIGURACIÓN DE FIREBASE DE SIEMPRE
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT.firebaseapp.com",
    projectId: "quizz-del-profe-bryan",
    storageBucket: "TU_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// BANCO COMPLETO DE PREGUNTAS (GUÍA DE TECNOLOGÍA DIGITAL)
const questions = [
    // --- VERDADERO / FALSO ---
    {
        type: "vf",
        question: "1. El protector de pantalla del monitor solo sirve para decorar.",
        options: ["Verdadero", "Falso"],
        correct: 1 // Falso
    },
    {
        type: "vf",
        question: "2. En la configuración del mouse, los usuarios zurdos pueden modificarla para mayor comodidad.",
        options: ["Verdadero", "Falso"],
        correct: 0 // Verdadero
    },
    {
        type: "vf",
        question: "3. La memoria RAM guarda los archivos de forma permanente aunque se apague la computadora.",
        options: ["Verdadero", "Falso"],
        correct: 1 // Falso
    },
    {
        type: "vf",
        question: "4. Un Firewall y un antivirus son exactamente lo mismo.",
        options: ["Verdadero", "Falso"],
        correct: 1 // Falso
    },
    {
        type: "vf",
        question: "5. Para usar los códigos ALT clásicos en el teclado numérico, normalmente se requiere tener Bloq Num (Num Lock) activado.",
        options: ["Verdadero", "Falso"],
        correct: 0 // Verdadero
    },

    // --- SELECCIÓN MÚLTIPLE ---
    {
        type: "multiple",
        question: "6. ¿Qué componente procesa instrucciones y se considera el 'cerebro' de la PC?",
        options: ["Placa Madre", "CPU", "RAM", "Fuente de Poder"],
        correct: 1
    },
    {
        type: "multiple",
        question: "7. ¿Cuál es la función del Botón Derecho del mouse?",
        options: ["Seleccionar y abrir con doble clic", "Abrir el menú contextual", "Desplazar la página arriba y abajo", "Cambiar la velocidad del puntero"],
        correct: 1
    },
    {
        type: "multiple",
        question: "8. ¿Qué atajo de teclado abre directamente el Administrador de tareas?",
        options: ["Ctrl + Alt + Supr", "Ctrl + Shift + Esc", "Win + R", "Ctrl + Alt + Del"],
        correct: 1
    },
    {
        type: "multiple",
        question: "9. ¿Cuál es la combinación de teclas para bloquear la computadora inmediatamente?",
        options: ["Win + D", "Win + E", "Win + L", "Win + A"],
        correct: 2
    },
    {
        type: "multiple",
        question: "10. ¿Qué atajo muestra u oculta rápidamente el escritorio?",
        options: ["Win + D", "Win + E", "Win + 1", "Win + R"],
        correct: 0
    },
    {
        type: "multiple",
        question: "11. ¿Qué combinación abre la ventana de 'Ejecutar comando'?",
        options: ["Win + E", "Win + R", "Win + A", "Ctrl + Shift + N"],
        correct: 1
    },
    {
        type: "multiple",
        question: "12. ¿Cuál es el código Alt para escribir la vocal 'á' con tilde?",
        options: ["Alt + 160", "Alt + 161", "Alt + 162", "Alt + 130"],
        correct: 0
    },
    {
        type: "multiple",
        question: "13. ¿Cuál es la unidad de almacenamiento más pequeña (representa un 0 o un 1)?",
        options: ["Byte", "Bit", "Kilobyte (KB)", "Megabyte (MB)"],
        correct: 1
    },
    {
        type: "multiple",
        question: "14. ¿Cuántos Bytes conforman un Kilobyte (KB)?",
        options: ["8", "1000", "1024", "512"],
        correct: 2
    },
    {
        type: "multiple",
        question: "15. ¿Qué componente proporciona y distribuye la energía eléctrica a las partes internas?",
        options: ["Placa Madre", "GPU", "Fuente de Poder", "Disipador"],
        correct: 2
    },
    {
        type: "multiple",
        question: "16. ¿Qué puerto transmite video analógico y es un conector más antiguo?",
        options: ["HDMI", "VGA", "Ethernet", "USB"],
        correct: 1
    },
    {
        type: "multiple",
        question: "17. ¿Cuál de los siguientes es un periférico de Entrada?",
        options: ["Impresora", "Monitor", "Micrófono", "Parlantes"],
        correct: 2
    },
    {
        type: "multiple",
        question: "18. ¿Qué tecla te permite renombrar un archivo o carpeta seleccionada?",
        options: ["F2", "F5", "Backspace", "Delete"],
        correct: 0
    },
    {
        type: "multiple",
        question: "19. ¿En qué orden de importancia se estudian los 3 factores clave de una PC?",
        options: ["1. RAM - 2. CPU - 3. Disco Duro", "1. CPU - 2. RAM - 3. Disco Duro", "1. Disco Duro - 2. CPU - 3. RAM", "1. CPU - 2. Disco Duro - 3. RAM"],
        correct: 1
    },

    // --- ACTIVIDAD DE ARRASTRAR Y SOLTAR (EXCLUSIVA PARA PARTES DEL DISCO DURO) ---
    {
        type: "drag",
        question: "20. Partes Internas del Disco Duro: Arrastra cada concepto a su definición exacta.",
        items: ["Cabezal", "Cara", "Pista", "Plato magnético", "Cluster", "Cilindro"], // Sobra Cilindro
        matches: [
            { id: 1, text: "Parte que lee y escribe la información sobre las superficies de almacenamiento.", target: "Cabezal" },
            { id: 2, text: "Cada superficie utilizable de un plato donde se puede grabar información.", target: "Cara" },
            { id: 3, text: "Anillo circular de datos ubicado a una distancia fija del centro del plato.", target: "Pista" },
            { id: 4, text: "Disco circular recubierto de material magnético que gira y almacena datos.", target: "Plato magnético" },
            { id: 5, text: "Grupo de sectores que el sistema de archivos usa como unidad de asignación.", target: "Cluster" }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userName = "";

// Elementos DOM
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

startBtn.addEventListener("click", () => {
    userName = usernameInput.value.trim();
    if (!userName) return alert("Por favor escribe tu nombre");
    
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    loadQuestion();
});

function loadQuestion() {
    resetState();
    const q = questions[currentQuestionIndex];
    document.getElementById("question-number").innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
    document.getElementById("score-live").innerText = `Puntos: ${score}`;
    questionTitle.innerText = q.question;

    if (q.type === "multiple" || q.type === "vf") {
        optionsContainer.classList.remove("hidden");
        q.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.innerText = opt;
            btn.className = "option-btn";
            btn.onclick = () => selectOption(idx, q.correct);
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

function selectOption(selected, correct) {
    if (selected === correct) score += 2; // Cada pregunta directa vale 2 puntos
    nextQuestion();
}

function setupDragAndDrop(q) {
    // Generar zonas donde soltar
    q.matches.forEach(m => {
        const zone = document.createElement("div");
        zone.className = "drop-zone";
        zone.dataset.target = m.target;
        zone.innerHTML = `<p style="flex: 1; text-align: left; margin-right: 10px;">${m.text}</p><div class="drop-target" data-filled="">Arrastra aquí</div>`;
        dropZones.appendChild(zone);
    });

    // Mezclar y mostrar los conceptos
    const shuffledItems = [...q.items].sort(() => Math.random() - 0.5);
    shuffledItems.forEach(item => {
        const badge = document.createElement("div");
        badge.className = "drag-item";
        badge.draggable = true;
        badge.innerText = item;
        badge.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", item));
        dragItems.appendChild(badge);
    });

    // Eventos para dropzones
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

    submitDragBtn.onclick = () => {
        let correctCount = 0;
        document.querySelectorAll(".drop-zone").forEach(zone => {
            const filled = zone.querySelector(".drop-target").dataset.filled;
            if (filled === zone.dataset.target) {
                correctCount++;
            }
        });
        score += correctCount * 2; // Cada acierto del disco duro vale 2 puntos
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
    
    // Total de puntos posibles: 19 preguntas x 2 pts + 5 partes del disco x 2 pts = 48 pts
    const totalPossible = 48; 
    const percentage = Math.round((score / totalPossible) * 100);

    document.getElementById("result-user").innerText = `Estudiante: ${userName}`;
    document.getElementById("result-percent").innerText = `Porcentaje: ${percentage}%`;
    document.getElementById("result-score").innerText = `Puntuación: ${score} / ${totalPossible} pts`;

    // Guardar en Firestore
    try {
        await addDoc(collection(db, "resultados"), {
            nombre: userName,
            Puntuacion: score,
            Porcentaje: percentage,
            Total: totalPossible,
            fecha: new Date()
        });
        console.log("Guardado en Firestore exitosamente");
    } catch (e) {
        console.error("Error guardando en Firestore: ", e);
    }
}

restartBtn.addEventListener("click", () => location.reload());

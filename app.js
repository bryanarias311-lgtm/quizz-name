import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Sustituye estos valores por tus claves reales de Firebase Console
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "quizz-del-profe-bryan.firebaseapp.com",
    projectId: "quizz-del-profe-bryan",
    storageBucket: "quizz-del-profe-bryan.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// BANCO DE 39 PREGUNTAS (GUÍA COMPLETA)
const questions = [
    // --- VERDADERO / FALSO (15) ---
    { type: "vf", question: "1. En las preguntas de Verdadero/Falso del examen, una sola palabra equivocada (como izquierda, derecha, temporal o permanente) puede hacer falsa la oración.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "2. En la pregunta de factores de una PC, el orden correcto de importancia es: 1. Disco Duro, 2. RAM, 3. CPU.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "3. La velocidad de doble clic en Propiedades del Mouse cambia la velocidad a la que se mueve el puntero por la pantalla.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "4. En la configuración del mouse, los usuarios zurdos pueden intercambiar los botones primario y secundario para mayor comodidad.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "5. Para usar los códigos ALT tradicionales para vocales con tilde, es necesario usar los números de la fila superior del teclado alfanumérico.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "6. El atajo 'Backspace' se utiliza para borrar el texto ubicado a la derecha del cursor.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "7. Un Byte está compuesto exactamente por un conjunto de 8 bits.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "8. Un Kilobyte (KB) equivale exactamente a 1,000 bytes.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "9. La memoria RAM es un medio de almacenamiento permanente que conserva la información aunque se apague la computadora.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "10. La Placa Madre es el componente encargado de conectar y permitir la comunicación entre todos los demás componentes.", options: ["Verdadero", "Falso"], correct: 0 },
    { type: "vf", question: "11. En la actividad de arrastrar sobre las partes del disco duro, las descripciones dicen directamente el nombre de la parte.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "12. Un Firewall y un antivirus son exactamente lo mismo porque ambos son software de aplicación.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "13. El software de aplicación se considera más básico que el software de sistema porque las aplicaciones controlan el hardware.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "14. El protector de pantalla del monitor solo sirve para decorar.", options: ["Verdadero", "Falso"], correct: 1 },
    { type: "vf", question: "15. La app 'Configuración' moderna ha reemplazado por completo al Panel de Control clásico, por lo que este último ya no existe en Windows.", options: ["Verdadero", "Falso"], correct: 1 },

    // --- SELECCIÓN MÚLTIPLE (23) ---
    { type: "multiple", question: "16. ¿Cuál es la razón principal por la que la CPU se estudia como el Factor 1 en una PC?", options: ["Guarda los archivos de forma permanente.", "Procesa instrucciones y coordina las tareas; sin ella el resto no ejecuta programas.", "Aumenta el espacio de trabajo temporal para tener varias pestañas.", "Proporciona la energía eléctrica a los componentes."], correct: 1 },
    { type: "multiple", question: "17. ¿Qué función cumple el botón derecho del mouse en la configuración normal?", options: ["Seleccionar y abrir con doble clic.", "Desplazar la página hacia arriba y abajo.", "Abrir el menú contextual con opciones del elemento seleccionado.", "Cambiar la velocidad del puntero."], correct: 2 },
    { type: "multiple", question: "18. ¿Qué opción en Propiedades: Mouse permite que el botón derecho realice las funciones principales de seleccionar y arrastrar?", options: ["Ajustar velocidad de doble clic.", "Intercambiar botones primario y secundario.", "Opciones de puntero.", "Rastro del puntero."], correct: 1 },
    { type: "multiple", question: "19. ¿Cuál es el código ALT que permite insertar la vocal 'á' con tilde?", options: ["Alt + 160", "Alt + 161", "Alt + 162", "Alt + 130"], correct: 0 },
    { type: "multiple", question: "20. ¿Qué carácter se obtiene al presionar la combinación Alt + 130?", options: ["á", "é", "í", "ú"], correct: 1 },
    { type: "multiple", question: "21. ¿Qué combinación de teclas abre la Pantalla de seguridad de Windows?", options: ["Ctrl + Shift + Esc", "Win + L", "Ctrl + Alt + Supr (o Delete)", "Win + R"], correct: 2 },
    { type: "multiple", question: "22. ¿Cuál es el atajo de teclado para bloquear la computadora inmediatamente?", options: ["Windows + L", "Windows + D", "Windows + E", "Ctrl + Shift + N"], correct: 0 },
    { type: "multiple", question: "23. Si deseas mostrar u ocultar rápidamente el escritorio en Windows, debes presionar:", options: ["Windows + E", "Windows + D", "Win + R", "Win + A"], correct: 1 },
    { type: "multiple", question: "24. ¿Qué combinación de teclas abre directamente el Explorador de archivos?", options: ["Windows + E", "Windows + 1", "Win + A", "Ctrl + Shift + Esc"], correct: 0 },
    { type: "multiple", question: "25. ¿Para qué se utiliza la combinación de teclas Ctrl + Shift + N?", options: ["Abrir el Administrador de tareas.", "Crear una Nueva carpeta.", "Abrir el menú Ejecutar.", "Bloquear la pantalla."], correct: 1 },
    { type: "multiple", question: "26. ¿Qué combinación abre directamente el Administrador de Tareas?", options: ["Ctrl + Alt + Supr", "Ctrl + Shift + Esc", "Win + R", "Win + I"], correct: 1 },
    { type: "multiple", question: "27. ¿Cuál es la unidad de información más pequeña en informática, que representa un 0 o un 1?", options: ["Byte", "Bit", "Kilobyte", "Cluster"], correct: 1 },
    { type: "multiple", question: "28. ¿A cuántos Megabytes (MB) equivale 1 Gigabyte (GB)?", options: ["100 MB", "1,000 MB", "1,024 MB", "8 MB"], correct: 2 },
    { type: "multiple", question: "29. ¿Qué componente interno procesa los gráficos, imágenes y video de la computadora?", options: ["CPU", "GPU", "Fuente de poder", "Placa madre"], correct: 1 },
    { type: "multiple", question: "30. ¿Qué componente se encarga de proporcionar y distribuir la energía eléctrica a todos los elementos internos?", options: ["Placa madre", "Fuente de poder", "Ventilador / Disipador", "RAM"], correct: 1 },
    { type: "multiple", question: "31. ¿Qué sistema de seguridad revisa el tráfico de red y aplica reglas para permitir o bloquear conexiones?", options: ["Antivirus", "Firewall", "Software de aplicación", "Controlador de dispositivo"], correct: 1 },
    { type: "multiple", question: "32. Un procesador de textos, un navegador web y un juego son ejemplos de:", options: ["Software de sistema", "Software principal", "Software de aplicación", "Controladores de hardware"], correct: 2 },
    { type: "multiple", question: "33. ¿Cuál de los siguientes es clasificado como un periférico de Entrada?", options: ["Monitor", "Impresora", "Micrófono", "Parlantes"], correct: 2 },
    { type: "multiple", question: "34. ¿Qué tipo de puerto o conector se utiliza exclusivamente para transmitir video analógico antiguo?", options: ["HDMI", "VGA", "Ethernet", "Audio jack 3.5 mm"], correct: 1 },
    { type: "multiple", question: "35. ¿Qué tecla del teclado te permite activar la opción 'Cambiar nombre' en un archivo seleccionado?", options: ["F2", "F5", "F1", "F11"], correct: 0 },
    { type: "multiple", question: "36. Para ocultar un archivo en Windows, debes hacer clic derecho sobre él, ir a Propiedades y en la pestaña General marcar la casilla:", options: ["Solo lectura", "Oculto", "Bloqueado", "Sistema"], correct: 1 },
    { type: "multiple", question: "37. ¿Cuál es la función principal de la Barra de Tareas en Windows?", options: ["Garantizar la refrigeración de la CPU.", "Abrir el menú Inicio, acceder a programas anclados/abiertos y ver hora/avisos.", "Procesar los datos gráficos de los juegos.", "Intercambiar los botones del mouse."], correct: 1 },
    { type: "multiple", question: "38. ¿Qué atajo de teclado abre la app de Configuración moderna en Windows?", options: ["Win + I", "Win + A", "Win + R", "Win + E"], correct: 0 },

    // --- ARRASTRAR Y SOLTAR (1) ---
    {
        type: "drag",
        question: "39. Partes Internas del Disco Duro: Arrastra el nombre correcto a cada definición (¡Cuidado, 1 concepto sobra!):",
        items: ["Cabezal", "Cara", "Pista", "Plato magnético", "Cluster", "Cilindro"],
        matches: [
            { id: 1, text: "Parte que lee y escribe la información sobre las superficies de almacenamiento.", target: "Cabezal" },
            { id: 2, text: "Cada superficie utilizable de un plato, donde se puede grabar información.", target: "Cara" },
            { id: 3, text: "Anillo circular de datos ubicado a una distancia fija del centro del plato.", target: "Pista" },
            { id: 4, text: "Disco circular recubierto de material magnético que gira y almacena datos.", target: "Plato magnético" },
            { id: 5, text: "Grupo de sectores que el sistema de archivos usa como unidad de asignación para guardar datos.", target: "Cluster" }
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

startBtn.addEventListener("click", () => {
    userName = usernameInput.value.trim();
    if (!userName) return alert("Por favor escribe tu nombre antes de empezar.");
    
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
    if (selected === correct) score++;
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

    submitDragBtn.onclick = () => {
        let correctCount = 0;
        document.querySelectorAll(".drop-zone").forEach(zone => {
            const filled = zone.querySelector(".drop-target").dataset.filled;
            if (filled === zone.dataset.target) {
                correctCount++;
            }
        });
        score += correctCount;
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
    
    const totalPossible = 43; // 38 de selección + 5 de arrastrar
    const percentage = Math.round((score / totalPossible) * 100);

    document.getElementById("result-user").innerText = `Estudiante: ${userName}`;
    document.getElementById("result-percent").innerText = `Porcentaje de Aciertos: ${percentage}%`;
    document.getElementById("result-score").innerText = `Puntuación: ${score} / ${totalPossible} puntos`;

    // GUARDAR EN FIRESTORE
    try {
        await addDoc(collection(db, "resultados"), {
            nombre: userName,
            puntuacion: score,
            porcentaje: percentage,
            total: totalPossible,
            fecha: new Date()
        });
        console.log("Resultado guardado correctamente en Firebase.");
    } catch (error) {
        console.error("Error guardando en Firestore: ", error);
    }
}

restartBtn.addEventListener("click", () => location.reload());

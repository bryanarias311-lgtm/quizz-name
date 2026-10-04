import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const $ = id => document.getElementById(id);

async function loadResults() {
  $('admin-status').textContent = 'Cargando resultados...';
  try {
    const snap = await getDocs(query(collection(db, 'results'), orderBy('finishedAt', 'desc')));
    $('results-body').innerHTML = '';
    if (snap.empty) {
      $('results-body').innerHTML = '<tr><td colspan="4">Todavía no hay resultados.</td></tr>';
    } else {
      snap.forEach(doc => {
        const r = doc.data();
        const date = r.finishedAt?.toDate ? r.finishedAt.toDate().toLocaleString('es-DO') : '—';
        const tr = document.createElement('tr');
        [r.name, `${r.score}/${r.total}`, `${r.percent}%`, date].forEach(value => {
          const td = document.createElement('td'); td.textContent = value ?? '—'; tr.appendChild(td);
        });
        $('results-body').appendChild(tr);
      });
    }
    $('admin-status').textContent = `${snap.size} resultado(s) encontrado(s).`;
  } catch (error) {
    console.error(error);
    $('admin-status').textContent = '⚠️ No se pudieron cargar los resultados. Comprueba que tu usuario esté autorizado en Firestore.';
  }
}

$('login-btn').onclick = async () => {
  const email = $('admin-email').value.trim();
  const password = $('admin-password').value;
  $('login-error').textContent = '';
  if (!email || !password) { $('login-error').textContent = 'Escribe tu correo y contraseña.'; return; }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    $('login-error').textContent = 'Correo o contraseña incorrectos.';
  }
};

$('logout-btn').onclick = () => signOut(auth);
$('refresh-btn').onclick = loadResults;

onAuthStateChanged(auth, user => {
  if (user) {
    $('login-card').classList.add('hidden');
    $('results-card').classList.remove('hidden');
    loadResults();
  } else {
    $('results-card').classList.add('hidden');
    $('login-card').classList.remove('hidden');
  }
});

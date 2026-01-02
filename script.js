<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics-compat.js"></script>

<script>
// ===============================
// FIREBASE CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyAeCrURSs0TBXlYF3TKLi4q98VwrGaKe_Q",
  authDomain: "spsch-849e5.firebaseapp.com",
  databaseURL: "https://spsch-849e5-default-rtdb.firebaseio.com",
  projectId: "spsch-849e5",
  storageBucket: "spsch-849e5.firebasestorage.app",
  messagingSenderId: "698967090558",
  appId: "1:698967090558:web:978781fd27b86c36203f2f",
  measurementId: "G-C5D3774P2G"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.database();
const baseRef = db.ref("registros"); // ajuste se necessário

// ===============================
// VARIÁVEIS
// ===============================
let dados = {};
let cacheOriginal = {};

// ===============================
// CARREGAR BASE
// ===============================
baseRef.once("value").then(snapshot => {
  dados = snapshot.val() || {};
  cacheOriginal = JSON.parse(JSON.stringify(dados));
  log(`Base carregada: ${Object.keys(dados).length} registros`);
});

// ===============================
// SIMULAR EXCLUSÃO POR DATA
// ===============================
function simular() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert("Informe o período completo");
    return;
  }

  let count = 0;

  Object.values(dados).forEach(item => {
    if (item.data >= inicio && item.data <= fim) {
      count++;
    }
  });

  log(`SIMULAÇÃO`);
  log(`Registros que seriam excluídos: ${count}`);
}

// ===============================
// EXCLUIR POR PERÍODO
// ===============================
function excluirPorData() {
  const inicio = dataInicio.value;
  const fim = dataFim.value;

  if (!inicio || !fim) {
    alert("Informe o período completo");
    return;
  }

  if (!confirm(`Confirma exclusão de ${inicio} até ${fim}?`)) return;

  const updates = {};
  let removidos = 0;

  Object.entries(dados).forEach(([key, item]) => {
    if (item.data >= inicio && item.data <= fim) {
      updates[key] = null; // DELETE no Firebase
      removidos++;
    }
  });

  db.ref("backup_exclusoes/" + Date.now()).set(dados); // backup completo

  baseRef.update(updates).then(() => {
    log(`EXCLUSÃO EXECUTADA`);
    log(`Registros removidos: ${removidos}`);
    location.reload();
  });
}

// ===============================
// EXCLUSÃO EM MASSA
// ===============================
function excluirTudo() {
  if (!confirm("⚠️ CONFIRMA EXCLUSÃO TOTAL DA BASE?")) return;

  db.ref("backup_exclusoes/" + Date.now()).set(dados); // backup total

  baseRef.remove().then(() => {
    log(`🔥 BASE TOTALMENTE APAGADA`);
    location.reload();
  });
}

// ===============================
// BAIXAR JSON ATUAL
// ===============================
function baixarJSON() {
  const blob = new Blob(
    [JSON.stringify(dados, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_sps_ch.json";
  a.click();
  URL.revokeObjectURL(url);

  log("Backup JSON baixado");
}

// ===============================
// LOG
// ===============================
function log(msg) {
  const logEl = document.getElementById("log");
  logEl.textContent += msg + "\n";
}
</script>

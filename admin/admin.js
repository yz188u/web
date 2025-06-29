const firebaseConfig = {
  apiKey: "AIzaSyDz-XphmGqzwG1zQHePFjfA25LRLidNrN4",
  authDomain: "xzuyaxhubkey.firebaseapp.com",
  databaseURL: "https://xzuyaxhubkey-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xzuyaxhubkey",
  storageBucket: "xzuyaxhubkey.firebasestorage.app",
  messagingSenderId: "537227442896",
  appId: "1:537227442896:web:eb9f74bd38618e5f873cd5"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const ADMIN_PASSWORD = "xzuyax123";

function checkPassword() {
  const input = document.getElementById("adminPass").value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("mainPanel").classList.remove("hidden");
    loadSettings();
    loadKeys();
  } else {
    alert("Password salah.");
  }
}

function loadSettings() {
  db.ref("settings/defaultDuration").once("value").then(snap => {
    const durasi = snap.val() || 86400000;
    document.getElementById("durationInput").value = durasi / 3600000;
  });

  db.ref("settings/apis").once("value").then(snap => {
    const apis = snap.val() || {};
    document.getElementById("workinkApi").value = apis.workink || "";
    document.getElementById("lootlabsApi").value = apis.lootlabs || "";
    document.getElementById("linkvertiseApi").value = apis.linkvertise || "";
  });
}

function saveDuration() {
  const jam = parseInt(document.getElementById("durationInput").value);
  const ms = jam * 3600000;
  db.ref("settings/defaultDuration").set(ms).then(() => {
    document.getElementById("durationStatus").innerText = "✅ Disimpan.";
  });
}

function saveAPIKeys() {
  const apis = {
    workink: document.getElementById("workinkApi").value,
    lootlabs: document.getElementById("lootlabsApi").value,
    linkvertise: document.getElementById("linkvertiseApi").value,
  };
  db.ref("settings/apis").set(apis).then(() => {
    document.getElementById("apiStatus").innerText = "✅ API Key disimpan.";
  });
}

function loadKeys() {
  db.ref("keys").once("value").then(snap => {
    const data = snap.val() || {};
    const tbody = document.getElementById("keyList");
    tbody.innerHTML = "";

    Object.entries(data).forEach(([hwid, info]) => {
      const tr = document.createElement("tr");
      const exp = new Date(info.expires).toLocaleString();
      tr.innerHTML = `<td>${hwid}</td><td>${exp}</td><td>${info.method}</td>`;
      tbody.appendChild(tr);
    });

    if (Object.keys(data).length === 0) {
      tbody.innerHTML = `<tr><td colspan="3">❌ Tidak ada data.</td></tr>`;
    }
  });
}

import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");

/* Index-Seite: Name speichern und weiterleiten */
const nextBtnIndex = document.getElementById("nextBtn");
if (nextBtnIndex && window.location.pathname.endsWith("index.html")) {
  nextBtnIndex.addEventListener("click", () => {
    const name = document.getElementById("realName").value;
    if(!name) return alert("Bitte Name eingeben");
    localStorage.setItem("realName", name);
    window.location.href = "role.html";
  });
}

/* Role-Seite: Spielname speichern und weiterleiten */
const nextBtnRole = document.getElementById("nextBtn");
if (nextBtnRole && window.location.pathname.endsWith("role.html")) {
  nextBtnRole.addEventListener("click", async () => {
    const role = document.getElementById("gameName").value;
    if(!role) return alert("Bitte Spielname eingeben");

    const realName = localStorage.getItem("realName");
    await addDoc(playersRef, { realName, role });

    window.location.href = "game.html";
  });
}

/* Game-Seite: andere Spieler anzeigen */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  list.innerHTML = "";
  const snapshot = await getDocs(playersRef);

  snapshot.forEach(doc => {
    const p = doc.data();
    if (p.realName !== myName) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<span>${p.realName}</span> = <strong>${p.role}</strong>`;
      list.appendChild(div);
    }
  });
}

if (window.location.pathname.endsWith("game.html")) {
  loadGame();
  setInterval(loadGame, 3000); // alle 3 Sekunden aktualisieren
}


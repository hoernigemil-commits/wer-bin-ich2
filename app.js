import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const playersRef = collection(db, "players");

/* Seite 1: Eigener Name */
window.saveName = function () {
  const name = document.getElementById("realName").value;
  localStorage.setItem("realName", name);
  window.location.href = "role.html";
};

/* Seite 2: Spielname eingeben */
window.saveRole = async function () {
  const role = document.getElementById("gameName").value;
  const realName = localStorage.getItem("realName");

  await addDoc(playersRef, {
    realName: realName,
    role: role
  });

  window.location.href = "game.html";
};

/* Seite 3: Andere Spieler anzeigen */
async function loadGame() {
  const myName = localStorage.getItem("realName");
  const list = document.getElementById("list");
  if (!list) return;

  const snapshot = await getDocs(playersRef);

  snapshot.forEach(doc => {
    const p = doc.data();
    if (p.realName !== myName) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <span>${p.realName}</span>
        <strong>${p.role}</strong>
      `;
      list.appendChild(div);
    }
  });
}

if (window.location.pathname.includes("game.html")) {
  loadGame();
}

let entries = JSON.parse(localStorage.getItem("culturatlas_memories") || "[]");
let currentClick = { top: 0, left: 0 };

function startApp() {
  document.getElementById("landing").style.display = "none";
  renderPins();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.getElementById("map-area").addEventListener("click", (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const top = ((e.clientY - rect.top) / rect.height) * 100;
  const left = ((e.clientX - rect.left) / rect.width) * 100;

  currentClick = { top, left };
  document.getElementById("form-container").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("form-container").addEventListener("submit", (e) => {
  e.preventDefault();
  const note = document.getElementById("cultural-note").value.trim();
  const audio = document.getElementById("audio-upload").files[0];

  if (!note) return alert("Cultural note required.");

  const save = (audioData = null) => {
    entries.push({ ...currentClick, note, audio: audioData });
    localStorage.setItem("culturatlas_memories", JSON.stringify(entries));
    document.getElementById("form-container").reset();
    renderPins();
    renderList();
  };

  if (audio) {
    const reader = new FileReader();
    reader.onload = (e) => save(e.target.result);
    reader.readAsDataURL(audio);
  } else {
    save();
  }
});

function renderPins() {
  const map = document.getElementById("map-area");
  map.querySelectorAll(".memory-marker").forEach(p => p.remove());

  entries.forEach((entry) => {
    const pin = document.createElement("div");
    pin.className = "memory-marker";
    pin.style.top = `${entry.top}%`;
    pin.style.left = `${entry.left}%`;
    pin.title = entry.note;
    map.appendChild(pin);
  });
}

function renderList() {
  const list = document.getElementById("entry-items");
  list.innerHTML = "";
  entries.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry.note;
    li.onclick = () => {
      alert(entry.note);
    };
    list.appendChild(li);
  });
}

window.onload = () => {
  renderPins();
  renderList();
};

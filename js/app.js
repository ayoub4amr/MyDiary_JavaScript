// prettier-ignore
const colors = ["#2196f3", "#cacaca", "#82DC8C", "#7fc8f8", "#c6d7eb", "#800080", "#72B000", "#A9E2DA", "#7C95D0", "#97E8AB", "#F208EF", "#14E8E3",
];

const title = document.querySelector("#title");
const content = document.querySelector("#content");
const btnAdd = document.querySelector('[type="submit"]');
const notesList = document.querySelector(".notes");
const showNote = document.querySelector(".show-note");
const noteContent = document.querySelector(".show-note .content");
const closeNote = document.querySelector(".show-note .close");
const mode = document.querySelector(".mode");

class Note {
  id = Date.now() + "";
  date = new Date();
  backgroundColor = colors[Math.floor(Math.random() * 12)];
  constructor(title, content) {
    this.title = title;
    this.content = content;
  }
}

class App {
  #notes = [];
  constructor() {
    this.#getDefaultMode();
    this.#getDataFromLocalStorage();
    this.#eventListeners();
  }

  #eventListeners() {
    btnAdd.addEventListener("click", this.#addNote.bind(this));
    notesList.addEventListener("click", this.#openNote.bind(this));
    notesList.addEventListener("click", this.#deleteNote.bind(this));
    closeNote.addEventListener("click", this.#closeNote.bind(this));
    mode.addEventListener("click", this.#switchMode);
  }

  #addNote(e) {
    e.preventDefault();
    const note = new Note(title.value, content.value);
    this.#notes.push(note);
    title.value = "";
    content.value = "";
    this.#addNoteToList(note);
    this.#sendDataToLocalStorage();
  }

  #addNoteToList(note) {
    const html = `
    <div class="note" style="background-color:${note.backgroundColor}" data-id=${note.id}>
    <i class="fa-solid fa-trash-can delete"></i>
    <h3>${note.title}</h3>
    </div>`;
    notesList.insertAdjacentHTML("afterbegin", html);
    VanillaTilt.init(document.querySelectorAll(".note"));
  }

  #deleteNote(e) {
    const note = e.target.closest(".note");
    if (!note || ![...e.target.classList].includes("delete")) return;
    this.#notes = this.#notes.filter(
      (element) => element.id != note.dataset.id
    );
    notesList.removeChild(note);
    this.#sendDataToLocalStorage();
  }

  #openNote(e) {
    const note = e.target.closest(".note");
    if (!note || [...e.target.classList].includes("delete")) return;
    const selectedNote = this.#notes.find(
      (element) => element.id === note.dataset.id
    );
    this.#renderNote(selectedNote);
  }

  #renderNote(note) {
    noteContent.innerHTML = "";
    const html = `
    <h2 class="title">${note.title}</h2>
    <p class="text">${note.content}</p>
    <span class="date">${(note.date + "").slice(0, 21)}</span>
    `;
    noteContent.innerHTML = html;
    showNote.classList.remove("hide");
  }

  #closeNote(e) {
    const note = e.target.closest(".show-note");
    note.classList.add("hide");
  }

  #switchMode(e) {
    document.body.classList.toggle("light-mode");
    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("default-mode", "light");
    } else {
      localStorage.setItem("default-mode", "dark");
    }
  }

  #getDefaultMode() {
    const mode = localStorage.getItem("default-mode");
    if (!mode) return;
    if (mode === "dark") {
      document.body.classList.remove("light-mode");
    }
  }

  #sendDataToLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(this.#notes));
  }

  #getDataFromLocalStorage() {
    const notes = JSON.parse(localStorage.getItem("notes"));
    if (!notes) return;
    notes.forEach((note) => (note.date = new Date(note.date)));
    this.#notes = notes;
    this.#renderNotesOnList();
  }

  #renderNotesOnList() {
    this.#notes.forEach((note) => {
      this.#addNoteToList(note);
    });
  }
}

const app = new App();

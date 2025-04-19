const form = document.querySelector("#all-form");  /*seletor de consulta*/
const input = document.querySelector("#all-input");
const list = document.querySelector("#all-list");
const filterButtons = document.querySelectorAll(".filter");

let todos = [];


/*adicionar ouvinte de eventos */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  /*evitar inadimplência - submit(enviar) */   

  const text = input.value.trim();
  if (text !== "") {
    const todo = {
      id: Date.now(),   // Um ID único baseado na data/hora atual
      text: text,       // O texto digitado pelo usuário
      completed: false,  // A tarefa começa como "não concluída"
    };
    todos.push(todo);
    input.value = "";
    renderTodos();
    saveToLocalStorage();
  }
});

function renderTodos(filter = "all") {
  list.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
  });

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", todo.completed);

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.addEventListener("click", () => toggleTodo(todo.id));

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.addEventListener("click", () => removeTodo(todo.id));

    li.append(span, btn);
    list.appendChild(li);
  });
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos(currentFilter);
  saveToLocalStorage();
}

function removeTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos(currentFilter);
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
  }
}

let currentFilter = "all";

loadFromLocalStorage();
renderTodos();

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTodos(currentFilter);
  });
});

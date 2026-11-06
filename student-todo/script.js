const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const filterButtons = document.querySelectorAll(".filter-button");
const themeToggle = document.getElementById("themeToggle");
const storageKey = "studentTodoTasks";
const themeKey = "studentTodoTheme";
let activeFilter = "all";
let tasks = loadTasks();

function loadTasks() {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch (error) { return []; }
}

function saveTasks() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }

function renderTasks() {
    const visibleTasks = tasks.filter((task) => activeFilter === "all" || (activeFilter === "completed" ? task.completed : !task.completed));
    taskList.innerHTML = "";
    visibleTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = task.completed ? "completed" : "";
        const toggle = document.createElement("button");
        toggle.className = "check-button";
        toggle.type = "button";
        toggle.setAttribute("aria-label", task.completed ? `Mark ${task.text} as active` : `Complete ${task.text}`);
        toggle.textContent = task.completed ? "Done" : "";
        toggle.addEventListener("click", () => toggleTask(task.id));

        const content = document.createElement("div");
        content.className = "task-content";
        const label = document.createElement("span");
        label.className = "task-label";
        label.textContent = task.text;
        const priority = document.createElement("span");
        priority.className = `priority priority-${task.priority}`;
        priority.textContent = `${task.priority} priority`;
        content.append(label, priority);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));
        taskItem.append(toggle, content, deleteButton);
        taskList.appendChild(taskItem);
    });

    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    document.getElementById("totalCount").textContent = total;
    document.getElementById("activeCount").textContent = total - completed;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("progressText").textContent = `${completed} of ${total} complete`;
    document.getElementById("progressBar").style.width = total ? `${completed / total * 100}%` : "0%";
    document.getElementById("listCount").textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? "task" : "tasks"}`;
    emptyState.hidden = visibleTasks.length > 0;
    emptyState.textContent = tasks.length && activeFilter !== "all" ? `No ${activeFilter} tasks here.` : "Your list is clear. Add a task to get started.";
}

function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) { taskInput.focus(); return; }
    tasks.unshift({ id: Date.now().toString(), text: taskText, priority: prioritySelect.value, completed: false });
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
}

function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
}

taskForm.addEventListener("submit", addTask);
filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
}));

function setTheme(theme) {
    document.body.dataset.theme = theme;
    themeToggle.querySelector("span").textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    localStorage.setItem(themeKey, theme);
}

themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
setTheme(localStorage.getItem(themeKey) || "light");
document.getElementById("taskDate").textContent = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date());
renderTasks();

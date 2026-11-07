const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("prioritySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const taskError = document.getElementById("taskError");
const filterButtons = document.querySelectorAll(".filter-button");
const themeToggle = document.getElementById("themeToggle");
const authShell = document.getElementById("authShell");
const appShell = document.getElementById("appShell");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");
const configMessage = document.getElementById("configMessage");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const logoutButton = document.getElementById("logoutButton");
const themeKey = "studentTodoTheme";
let activeFilter = "all";
let authMode = "login";
let tasks = [];
let currentUser = null;
let confirmationSent = false;

const config = window.SUPABASE_CONFIG;
const supabaseClient = config?.url && config?.publishableKey && window.supabase
    ? window.supabase.createClient(config.url, config.publishableKey)
    : null;

function showAuthMessage(message = "", isError = true) {
    authMessage.textContent = message;
    authMessage.classList.toggle("is-error", isError && Boolean(message));
}

function showTaskError(message = "") {
    taskError.textContent = message;
    taskError.hidden = !message;
}

function setTaskLoading(isLoading) {
    loadingState.hidden = !isLoading;
    taskForm.querySelector("button").disabled = isLoading;
}

function setAuthMode(mode) {
    if (confirmationSent) return;
    authMode = mode;
    const isLogin = mode === "login";
    loginTab.classList.toggle("active", isLogin);
    signupTab.classList.toggle("active", !isLogin);
    loginTab.setAttribute("aria-selected", isLogin);
    signupTab.setAttribute("aria-selected", !isLogin);
    authSubmit.textContent = isLogin ? "Log in" : "Create account";
    authPassword.autocomplete = isLogin ? "current-password" : "new-password";
    showAuthMessage();
}

function setAuthLoading(isLoading) {
    authSubmit.disabled = isLoading || confirmationSent;
    authSubmit.textContent = isLoading
        ? (authMode === "login" ? "Logging in..." : "Creating...")
        : (authMode === "login" ? "Log in" : "Create account");
}

function setConfirmationState(isSent) {
    confirmationSent = isSent;
    authEmail.disabled = isSent;
    authPassword.disabled = isSent;
    loginTab.disabled = isSent;
    signupTab.disabled = isSent;
    authShell.classList.toggle("confirmation-state", isSent);
    if (isSent) {
        authSubmit.disabled = true;
    }
}

function getEmailRedirectUrl() {
    return window.location.protocol === "http:" || window.location.protocol === "https:"
        ? window.location.href.split("#")[0]
        : undefined;
}

async function handleAuth(event) {
    event.preventDefault();
    if (confirmationSent) return;
    if (!supabaseClient) {
        showAuthMessage("Supabase is not configured. Check config.js.");
        return;
    }
    setAuthLoading(true);
    showAuthMessage();
    try {
        const result = authMode === "login"
            ? await supabaseClient.auth.signInWithPassword({ email: authEmail.value.trim(), password: authPassword.value })
            : await supabaseClient.auth.signUp({
                email: authEmail.value.trim(),
                password: authPassword.value,
                options: { emailRedirectTo: getEmailRedirectUrl() }
            });
        if (result.error) {
            showAuthMessage(result.error.message);
            return;
        }
        if (authMode === "signup") {
            if (result.data.session) {
                showAuthMessage("Account created. You are now signed in.", false);
            } else {
                showAuthMessage(`Confirmation email sent to ${authEmail.value.trim()}. Check your inbox and confirm your account before logging in.`, false);
                authPassword.value = "";
                setConfirmationState(true);
            }
        }
    } catch (error) {
        showAuthMessage(`Authentication failed: ${error.message}`);
    } finally {
        setAuthLoading(false);
    }
}

function showApp(user) {
    currentUser = user;
    authShell.hidden = true;
    appShell.hidden = false;
    document.getElementById("userInfo").textContent = `Signed in as ${user.email}`;
    loadTasks();
}

function showAuth() {
    currentUser = null;
    tasks = [];
    setConfirmationState(false);
    authShell.hidden = false;
    appShell.hidden = true;
    authPassword.value = "";
}

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
        toggle.addEventListener("click", () => toggleTask(task.id, task.completed));

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

function mapTask(task) {
    return { id: task.id, text: task.text, priority: task.priority || "medium", completed: Boolean(task.completed) };
}

async function loadTasks() {
    if (!currentUser) return;
    setTaskLoading(true);
    showTaskError();
    const { data, error } = await supabaseClient.from("Tasks").select("*").eq("user_id", currentUser.id);
    setTaskLoading(false);
    if (error) {
        showTaskError(`Could not load tasks: ${error.message}`);
        return;
    }
    tasks = data.map(mapTask);
    renderTasks();
}

async function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText || !currentUser) { taskInput.focus(); return; }
    setTaskLoading(true);
    showTaskError();
    const { data, error } = await supabaseClient.from("Tasks").insert({ text: taskText, priority: prioritySelect.value, completed: false, user_id: currentUser.id }).select().single();
    setTaskLoading(false);
    if (error) {
        showTaskError(`Could not add task: ${error.message}`);
        return;
    }
    tasks.unshift(mapTask(data));
    renderTasks();
    taskForm.reset();
    taskInput.focus();
}

async function toggleTask(id, completed) {
    showTaskError();
    const { error } = await supabaseClient.from("Tasks").update({ completed: !completed }).eq("id", id).eq("user_id", currentUser.id);
    if (error) { showTaskError(`Could not update task: ${error.message}`); return; }
    tasks = tasks.map((task) => task.id === id ? { ...task, completed: !completed } : task);
    renderTasks();
}

async function deleteTask(id) {
    showTaskError();
    const { error } = await supabaseClient.from("Tasks").delete().eq("id", id).eq("user_id", currentUser.id);
    if (error) { showTaskError(`Could not delete task: ${error.message}`); return; }
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
}

function setTheme(theme) {
    document.body.dataset.theme = theme;
    themeToggle.querySelector("span").textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    localStorage.setItem(themeKey, theme);
}

async function initialize() {
    setTheme(localStorage.getItem(themeKey) || "light");
    document.getElementById("taskDate").textContent = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date());
    if (!supabaseClient) {
        configMessage.hidden = false;
        authSubmit.disabled = true;
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) showApp(session.user); else showAuth();
    supabaseClient.auth.onAuthStateChange((_event, sessionState) => {
        if (sessionState?.user) showApp(sessionState.user); else showAuth();
    });
}

taskForm.addEventListener("submit", addTask);
authForm.addEventListener("submit", handleAuth);
loginTab.addEventListener("click", () => setAuthMode("login"));
signupTab.addEventListener("click", () => setAuthMode("signup"));
logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) showTaskError(`Could not log out: ${error.message}`);
    } catch (error) {
        showTaskError(`Could not log out: ${error.message}`);
    } finally {
        logoutButton.disabled = false;
    }
});
filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
}));
themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
initialize();

const taskInput = document.getElementById("taskInput");
const taskDueDate = document.getElementById("taskDueDate");
const prioritySelect = document.getElementById("prioritySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const taskMessage = document.getElementById("taskMessage");
const taskError = document.getElementById("taskError");
const filterButtons = document.querySelectorAll(".filter-button");
const themeToggle = document.getElementById("themeToggle");
const authShell = document.getElementById("authShell");
const appShell = document.getElementById("appShell");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const passwordToggle = document.getElementById("passwordToggle");
const authSubmit = document.getElementById("authSubmit");
const authMessage = document.getElementById("authMessage");
const configMessage = document.getElementById("configMessage");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const logoutButton = document.getElementById("logoutButton");
const editModal = document.getElementById("editModal");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskTitle = document.getElementById("editTaskTitle");
const editTaskDescription = document.getElementById("editTaskDescription");
const editTaskDueDate = document.getElementById("editTaskDueDate");
const editTaskPriority = document.getElementById("editTaskPriority");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");
const themeKey = "studentTodoTheme";
let activeFilter = "all";
let authMode = "login";
let tasks = [];
let currentUser = null;
let confirmationSent = false;
let confirmationRedirectInProgress = false;
let editingTask = null;

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getTaskStatus(task, today = getLocalDateKey()) {
    if (task.completed || !task.dueDate) return "normal";
    if (task.dueDate < today) return "overdue";
    if (task.dueDate === today) return "due-today";
    return "upcoming";
}

function formatDueDate(dueDate) {
    if (!dueDate) return "";
    const [year, month, day] = dueDate.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium"
    }).format(new Date(year, month - 1, day));
}

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

function showTaskMessage(message = "") {
    taskMessage.textContent = message;
    taskMessage.hidden = !message;
}

function setTaskLoading(isLoading) {
    loadingState.hidden = !isLoading;
    taskForm.querySelector("button").disabled = isLoading;
}

function setAuthMode(mode) {
    if (confirmationSent) return;
    authMode = mode;
    resetPasswordVisibility();
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
    if (isSent) resetPasswordVisibility();
    authEmail.disabled = isSent;
    authPassword.disabled = isSent;
    passwordToggle.disabled = isSent;
    loginTab.disabled = isSent;
    signupTab.disabled = isSent;
    authShell.classList.toggle("confirmation-state", isSent);
    authSubmit.disabled = isSent;
}

function getEmailRedirectUrl() {
    return window.location.protocol === "http:" || window.location.protocol === "https:"
        ? window.location.href.split("#")[0]
        : undefined;
}

async function handleAuth(event) {
    event.preventDefault();
    if (confirmationSent) return;
    showAuthMessage();
    if (!supabaseClient) {
        showAuthMessage("Supabase is not configured. Check config.js.");
        return;
    }
    setAuthLoading(true);
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
                showAuthMessage(`Confirmation email sent to ${authEmail.value.trim()}. Open it and click the confirmation link, then return here to log in.`, false);
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
    setAuthMode("login");
    authShell.hidden = false;
    appShell.hidden = true;
    authPassword.value = "";
    resetPasswordVisibility();
    setAuthLoading(false);
}

function resetPasswordVisibility() {
    authPassword.type = "password";
    passwordToggle.setAttribute("aria-label", "Show password");
    passwordToggle.setAttribute("aria-pressed", "false");
    passwordToggle.classList.remove("is-visible");
}

function isEmailConfirmationRedirect() {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(window.location.search);
    return hashParams.get("type") === "signup" || searchParams.get("type") === "signup";
}

function clearEmailConfirmationRedirect() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.searchParams.delete("code");
    window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
}

async function requireManualLoginAfterConfirmation() {
    confirmationRedirectInProgress = true;
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        clearEmailConfirmationRedirect();
        showAuth();
        showAuthMessage("Email confirmed. Please enter your email and password to log in.", false);
    } finally {
        confirmationRedirectInProgress = false;
    }
}

function renderTasks() {
    const today = getLocalDateKey();
    const visibleTasks = tasks.filter((task) => {
        const status = getTaskStatus(task, today);
        if (activeFilter === "all") return true;
        if (activeFilter === "completed") return task.completed;
        return status === activeFilter;
    });
    taskList.innerHTML = "";
    visibleTasks.forEach((task) => {
        const taskItem = document.createElement("li");
        const status = getTaskStatus(task, today);
        taskItem.className = `${task.completed ? "completed " : ""}${status === "overdue" ? "overdue" : ""}`;
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
        content.append(label);
        if (task.description) {
            const description = document.createElement("span");
            description.className = "task-description";
            description.textContent = task.description;
            content.append(description);
        }
        if (task.dueDate) {
            const dueDate = document.createElement("span");
            const dueClass = status === "due-today" ? "today" : status;
            dueDate.className = `due-date due-${dueClass}`;
            dueDate.textContent = status === "overdue"
                ? `Overdue · ${formatDueDate(task.dueDate)}`
                : status === "due-today"
                    ? "Due today"
                    : `Due · ${formatDueDate(task.dueDate)}`;
            content.append(dueDate);
        }
        const priority = document.createElement("span");
        priority.className = `priority priority-${task.priority}`;
        priority.textContent = `${task.priority} priority`;
        content.append(priority);

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.type = "button";
        editButton.setAttribute("aria-label", `Edit ${task.text}`);
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => openEditModal(task));

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task.id));
        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";
        taskActions.append(editButton, deleteButton);
        taskItem.append(toggle, content, taskActions);
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
    emptyState.textContent = tasks.length && activeFilter !== "all" ? `No ${activeFilter.replace("-", " ")} tasks here.` : "Your list is clear. Add a task to get started.";
}

function mapTask(task) {
    return {
        id: task.id,
        text: task.text,
        description: task.description || "",
        dueDate: task.due_date || "",
        priority: task.priority || "medium",
        completed: Boolean(task.completed)
    };
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
    showTaskMessage();
    const { data, error } = await supabaseClient.from("Tasks").insert({
        text: taskText,
        priority: prioritySelect.value,
        due_date: taskDueDate.value || null,
        completed: false,
        user_id: currentUser.id
    }).select().single();
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
    showTaskMessage();
    const { error } = await supabaseClient.from("Tasks").update({ completed: !completed }).eq("id", id).eq("user_id", currentUser.id);
    if (error) { showTaskError(`Could not update task: ${error.message}`); return; }
    tasks = tasks.map((task) => task.id === id ? { ...task, completed: !completed } : task);
    renderTasks();
}

async function deleteTask(id) {
    showTaskError();
    showTaskMessage();
    const { error } = await supabaseClient.from("Tasks").delete().eq("id", id).eq("user_id", currentUser.id);
    if (error) { showTaskError(`Could not delete task: ${error.message}`); return; }
    tasks = tasks.filter((task) => task.id !== id);
    renderTasks();
}

function openEditModal(task) {
    editingTask = task;
    editTaskTitle.value = task.text;
    editTaskDescription.value = task.description;
    editTaskDueDate.value = task.dueDate;
    editTaskPriority.value = task.priority;
    editModal.hidden = false;
    document.body.classList.add("modal-open");
    editTaskTitle.focus();
}

function closeEditDialog() {
    editModal.hidden = true;
    document.body.classList.remove("modal-open");
    editingTask = null;
    editTaskForm.reset();
}

async function saveEditedTask(event) {
    event.preventDefault();
    if (!editingTask || !currentUser) return;
    const text = editTaskTitle.value.trim();
    if (!text) {
        editTaskTitle.focus();
        return;
    }

    saveEdit.disabled = true;
    showTaskError();
    showTaskMessage();
    let data;
    let error;
    try {
        ({ data, error } = await supabaseClient
            .from("Tasks")
            .update({
                text,
                description: editTaskDescription.value.trim(),
                due_date: editTaskDueDate.value || null,
                priority: editTaskPriority.value
            })
            .eq("id", editingTask.id)
            .eq("user_id", currentUser.id)
            .select()
            .single());
    } catch (requestError) {
        showTaskError(`Could not update task: ${requestError.message}`);
        return;
    } finally {
        saveEdit.disabled = false;
    }

    if (error) {
        showTaskError(`Could not update task: ${error.message}`);
        return;
    }
    tasks = tasks.map((task) => task.id === editingTask.id ? mapTask(data) : task);
    closeEditDialog();
    renderTasks();
    showTaskMessage("Task updated successfully.");
}

function setTheme(theme) {
    document.body.dataset.theme = theme;
    themeToggle.querySelector("span").textContent = theme === "dark" ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    localStorage.setItem(themeKey, theme);
}

function updateLocalDateTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "medium"
    });
    const taskDate = document.getElementById("taskDate");
    taskDate.dateTime = now.toISOString();
    taskDate.textContent = formatter.format(now);
}

async function initialize() {
    setTheme(localStorage.getItem(themeKey) || "light");
    updateLocalDateTime();
    setInterval(updateLocalDateTime, 1000);
    if (!supabaseClient) {
        configMessage.hidden = false;
        authSubmit.disabled = true;
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user && isEmailConfirmationRedirect()) {
        try {
            await requireManualLoginAfterConfirmation();
        } catch (error) {
            showAuth();
            showAuthMessage(`Could not prepare the login screen: ${error.message}`);
        }
    } else if (session?.user) {
        showApp(session.user);
    } else {
        showAuth();
    }
    supabaseClient.auth.onAuthStateChange((_event, sessionState) => {
        if (confirmationRedirectInProgress) return;
        if (sessionState?.user) {
            showApp(sessionState.user);
        } else {
            showAuth();
        }
    });
}

taskForm.addEventListener("submit", addTask);
editTaskForm.addEventListener("submit", saveEditedTask);
authForm.addEventListener("submit", handleAuth);
loginTab.addEventListener("click", () => setAuthMode("login"));
signupTab.addEventListener("click", () => setAuthMode("signup"));
passwordToggle.addEventListener("click", () => {
    const isVisible = authPassword.type === "text";
    authPassword.type = isVisible ? "password" : "text";
    passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
    passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    passwordToggle.classList.toggle("is-visible", !isVisible);
});
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
setInterval(() => {
    if (currentUser) renderTasks();
}, 60000);
closeEditModal.addEventListener("click", closeEditDialog);
cancelEdit.addEventListener("click", closeEditDialog);
editModal.addEventListener("click", (event) => {
    if (event.target === editModal) closeEditDialog();
});
initialize();

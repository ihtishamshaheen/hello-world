const taskInput = document.getElementById("taskInput");
const taskDueDate = document.getElementById("taskDueDate");
const taskCategory = document.getElementById("taskCategory");
const prioritySelect = document.getElementById("prioritySelect");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const taskMessage = document.getElementById("taskMessage");
const taskError = document.getElementById("taskError");
const taskSearch = document.getElementById("taskSearch");
const clearSearch = document.getElementById("clearSearch");
const categoryFilter = document.getElementById("categoryFilter");
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
const editTaskCategory = document.getElementById("editTaskCategory");
const editTaskPriority = document.getElementById("editTaskPriority");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");
const toastRegion = document.getElementById("toastRegion");
const tasksViewTab = document.getElementById("tasksViewTab");
const plannerViewTab = document.getElementById("plannerViewTab");
const taskPanel = document.querySelector(".task-panel");
const plannerPanel = document.getElementById("plannerPanel");
const previousWeek = document.getElementById("previousWeek");
const nextWeek = document.getElementById("nextWeek");
const weekLabel = document.getElementById("weekLabel");
const calendarGrid = document.getElementById("calendarGrid");
const agendaTitle = document.getElementById("agendaTitle");
const agendaList = document.getElementById("agendaList");
const agendaEmpty = document.getElementById("agendaEmpty");
const addForDate = document.getElementById("addForDate");
const focusViewTab = document.getElementById("focusViewTab");
const focusPanel = document.getElementById("focusPanel");
const focusTaskLabel = document.getElementById("focusTaskLabel");
const focusSessionCount = document.getElementById("focusSessionCount");
const timerRing = document.getElementById("timerRing");
const timerDisplay = document.getElementById("timerDisplay");
const timerModeLabel = document.getElementById("timerModeLabel");
const timerStart = document.getElementById("timerStart");
const timerPause = document.getElementById("timerPause");
const timerReset = document.getElementById("timerReset");
const focusSettings = document.getElementById("focusSettings");
const focusTaskSelect = document.getElementById("focusTaskSelect");
const focusDuration = document.getElementById("focusDuration");
const shortBreakDuration = document.getElementById("shortBreakDuration");
const longBreakDuration = document.getElementById("longBreakDuration");
const themeKey = "studentTodoTheme";
let activeFilter = "all";
let searchQuery = "";
let selectedCategory = "all";
let authMode = "login";
let tasks = [];
let currentUser = null;
let confirmationSent = false;
let confirmationRedirectInProgress = false;
let editingTask = null;
let calendarWeekOffset = 0;
let selectedCalendarDate = getLocalDateKey();
let activeView = "tasks";
const activeToasts = new Set();
let focusMode = "focus";
let focusSecondsRemaining = 25 * 60;
let focusTotalSeconds = 25 * 60;
let focusTimerId = null;
let focusSessionTotal = 0;
let completedFocusSessions = 0;

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

function parseLocalDate(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function getWeekDates() {
    const today = parseLocalDate(getLocalDateKey());
    const day = today.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + calendarWeekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return getLocalDateKey(date);
    });
}

function formatWeekLabel(dates) {
    const first = parseLocalDate(dates[0]);
    const last = parseLocalDate(dates[6]);
    const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${formatter.format(first)} - ${formatter.format(last)}`;
}

function setActiveView(view) {
    activeView = view;
    const showPlanner = view === "planner";
    const showFocus = view === "focus";
    taskPanel.hidden = showPlanner || showFocus;
    plannerPanel.hidden = !showPlanner;
    focusPanel.hidden = !showFocus;
    tasksViewTab.classList.toggle("active", view === "tasks");
    plannerViewTab.classList.toggle("active", showPlanner);
    focusViewTab.classList.toggle("active", showFocus);
    tasksViewTab.setAttribute("aria-selected", String(view === "tasks"));
    plannerViewTab.setAttribute("aria-selected", String(showPlanner));
    focusViewTab.setAttribute("aria-selected", String(showFocus));
    if (showPlanner) renderPlanner();
    if (showFocus) renderFocusTaskOptions();
}

function getFocusDurationSeconds() {
    return Math.max(1, Number(focusDuration.value) || 25) * 60;
}

function getShortBreakSeconds() {
    return Math.max(1, Number(shortBreakDuration.value) || 5) * 60;
}

function getLongBreakSeconds() {
    return Math.max(1, Number(longBreakDuration.value) || 15) * 60;
}

function updateTimerDisplay() {
    const minutes = Math.floor(focusSecondsRemaining / 60);
    const seconds = focusSecondsRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    timerModeLabel.textContent = focusMode === "focus" ? "Focus" : focusMode === "short-break" ? "Short break" : "Long break";
    const progress = focusTotalSeconds ? (focusTotalSeconds - focusSecondsRemaining) / focusTotalSeconds : 0;
    timerRing.style.setProperty("--timer-progress", `${progress * 360}deg`);
}

function setFocusMode(mode, durationSeconds) {
    focusMode = mode;
    focusTotalSeconds = durationSeconds;
    focusSecondsRemaining = durationSeconds;
    updateTimerDisplay();
}

function renderFocusTaskOptions() {
    const selectedTaskId = focusTaskSelect.value;
    focusTaskSelect.innerHTML = '<option value="">No task selected</option>';
    tasks.filter((task) => !task.completed).forEach((task) => {
        const option = document.createElement("option");
        option.value = task.id;
        option.textContent = task.text;
        focusTaskSelect.appendChild(option);
    });
    if (tasks.some((task) => String(task.id) === selectedTaskId && !task.completed)) {
        focusTaskSelect.value = selectedTaskId;
    }
    updateFocusTaskLabel();
}

function updateFocusTaskLabel() {
    const task = tasks.find((item) => String(item.id) === focusTaskSelect.value);
    focusTaskLabel.textContent = task ? `Focusing on: ${task.text}` : "Choose a task to begin.";
}

async function loadFocusSessionCount() {
    if (!currentUser) return;
    try {
        const { count, error } = await supabaseClient
            .from("FocusSessions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", currentUser.id);
        if (error) throw error;
        completedFocusSessions = count || 0;
        focusSessionCount.textContent = completedFocusSessions;
    } catch (error) {
        showToast(`Could not load focus sessions: ${error.message}`, "error");
    }
}

async function saveCompletedFocusSession() {
    if (!currentUser) return;
    const { error } = await supabaseClient.from("FocusSessions").insert({
        user_id: currentUser.id,
        task_id: focusTaskSelect.value || null,
        duration_minutes: Math.max(1, Number(focusDuration.value) || 25)
    });
    if (error) throw error;
    completedFocusSessions += 1;
    focusSessionCount.textContent = completedFocusSessions;
}

async function finishTimerSession() {
    focusTimerId = null;
    timerPause.disabled = true;
    if (focusMode === "focus") {
        try {
            await saveCompletedFocusSession();
            showToast("Focus session complete. Great work!");
        } catch (error) {
            showToast(`Focus session finished, but could not save it: ${error.message}`, "error");
        }
        const nextMode = completedFocusSessions > 0 && completedFocusSessions % 4 === 0 ? "long-break" : "short-break";
        setFocusMode(nextMode, nextMode === "long-break" ? getLongBreakSeconds() : getShortBreakSeconds());
    } else {
        showToast("Break finished. Ready for another focus session.");
        setFocusMode("focus", getFocusDurationSeconds());
    }
    timerStart.textContent = "Start";
}

function runFocusTimer() {
    if (focusTimerId) return;
    let lastTick = Date.now();
    timerStart.textContent = "Running";
    timerStart.disabled = true;
    timerPause.disabled = false;
    focusTimerId = window.setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - lastTick) / 1000);
        if (elapsedSeconds < 1) return;
        lastTick += elapsedSeconds * 1000;
        focusSecondsRemaining = Math.max(0, focusSecondsRemaining - elapsedSeconds);
        updateTimerDisplay();
        if (focusSecondsRemaining === 0) {
            window.clearInterval(focusTimerId);
            timerStart.disabled = false;
            finishTimerSession();
        }
    }, 250);
}

function pauseFocusTimer() {
    if (!focusTimerId) return;
    window.clearInterval(focusTimerId);
    focusTimerId = null;
    timerStart.disabled = false;
    timerStart.textContent = "Resume";
    timerPause.disabled = true;
}

function resetFocusTimer() {
    if (focusTimerId) window.clearInterval(focusTimerId);
    focusTimerId = null;
    timerStart.disabled = false;
    timerStart.textContent = "Start";
    timerPause.disabled = true;
    setFocusMode("focus", getFocusDurationSeconds());
}

function applyFocusDurations(event) {
    event.preventDefault();
    if (focusTimerId) {
        showToast("Pause or reset the timer before changing durations.", "warning");
        return;
    }
    resetFocusTimer();
    showToast("Timer durations updated.");
}

function createCalendarTaskEntry(task) {
    const entry = document.createElement("button");
    entry.className = `calendar-task${task.completed ? " calendar-task-completed" : ""}`;
    entry.type = "button";
    entry.title = `Edit ${task.text}`;
    entry.addEventListener("click", () => openEditModal(task));
    const title = document.createElement("strong");
    title.textContent = task.text;
    const details = document.createElement("span");
    details.textContent = `${task.priority} priority · ${task.completed ? "Completed" : "Active"}`;
    entry.append(title, details);
    return entry;
}

function renderPlanner() {
    const dates = getWeekDates();
    weekLabel.textContent = formatWeekLabel(dates);
    calendarGrid.innerHTML = "";
    dates.forEach((dateKey) => {
        const date = parseLocalDate(dateKey);
        const day = document.createElement("section");
        const isToday = dateKey === getLocalDateKey();
        const isSelected = dateKey === selectedCalendarDate;
        day.className = `calendar-day${isToday ? " calendar-today" : ""}${isSelected ? " calendar-selected" : ""}`;
        const heading = document.createElement("button");
        heading.className = "calendar-day-heading";
        heading.type = "button";
        heading.setAttribute("aria-label", `Show tasks for ${date.toLocaleDateString()}`);
        heading.innerHTML = `<span>${new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date)}</span><strong>${date.getDate()}</strong>`;
        heading.addEventListener("click", () => {
            selectedCalendarDate = dateKey;
            renderPlanner();
        });
        const entries = document.createElement("div");
        entries.className = "calendar-entries";
        tasks.filter((task) => task.dueDate === dateKey).forEach((task) => entries.appendChild(createCalendarTaskEntry(task)));
        day.append(heading, entries);
        calendarGrid.appendChild(day);
    });

    const selectedDate = parseLocalDate(selectedCalendarDate);
    agendaTitle.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: "long", month: "long", day: "numeric"
    }).format(selectedDate);
    agendaList.innerHTML = "";
    const agendaTasks = tasks.filter((task) => task.dueDate === selectedCalendarDate);
    agendaEmpty.hidden = agendaTasks.length > 0;
    agendaTasks.forEach((task) => {
        const item = document.createElement("li");
        const entry = createCalendarTaskEntry(task);
        item.appendChild(entry);
        agendaList.appendChild(item);
    });
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

function showToast(message, type = "success", duration = 4200) {
    const key = `${type}:${message}`;
    if (activeToasts.has(key)) return;
    activeToasts.add(key);

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = type === "success" ? "✓" : type === "warning" ? "!" : "×";

    const text = document.createElement("span");
    text.className = "toast-text";
    text.textContent = message;

    const dismiss = document.createElement("button");
    dismiss.className = "toast-dismiss";
    dismiss.type = "button";
    dismiss.setAttribute("aria-label", "Dismiss notification");
    dismiss.textContent = "×";

    const removeToast = () => {
        if (!toast.isConnected) return;
        toast.classList.add("toast-leaving");
        window.setTimeout(() => toast.remove(), 180);
        activeToasts.delete(key);
    };
    dismiss.addEventListener("click", removeToast);
    toast.addEventListener("animationend", (event) => {
        if (event.animationName === "toast-in") toast.classList.add("toast-ready");
    });
    toast.append(icon, text, dismiss);
    toastRegion.appendChild(toast);
    window.setTimeout(removeToast, duration);
}

function getAuthErrorMessage(error) {
    const message = error?.message?.toLowerCase() || "";
    return message.includes("invalid login credentials") || message.includes("invalid credentials")
        ? "Incorrect email or password."
        : error?.message || "Authentication failed. Please try again.";
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
        showToast("Supabase is not configured. Check config.js.", "error", 6000);
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
            const message = getAuthErrorMessage(result.error);
            showAuthMessage(message);
            showToast(message, authMode === "login" && message === "Incorrect email or password." ? "warning" : "error");
            return;
        }
        if (authMode === "signup") {
            if (result.data.session) {
                showAuthMessage("Account created. You are now signed in.", false);
                showToast("Registration successful. Welcome to Study Desk.");
            } else {
                showAuthMessage(`Confirmation email sent to ${authEmail.value.trim()}. Open it and click the confirmation link, then return here to log in.`, false);
                showToast("Registration successful. Check your email to confirm your account.", "success", 6000);
                authPassword.value = "";
                setConfirmationState(true);
            }
        } else {
            showToast("Login successful. Welcome back.");
        }
    } catch (error) {
        const message = getAuthErrorMessage(error);
        showAuthMessage(message);
        showToast(message, "error");
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
    resetFocusTimer();
    completedFocusSessions = 0;
    focusSessionCount.textContent = "0";
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
        showToast("Email confirmed. Please log in to continue.");
    } finally {
        confirmationRedirectInProgress = false;
    }
}

function renderTasks() {
    const today = getLocalDateKey();
    const visibleTasks = tasks.filter((task) => {
        const status = getTaskStatus(task, today);
        const searchableText = `${task.text} ${task.description}`.toLowerCase();
        const matchesSearch = !searchQuery || searchableText.includes(searchQuery);
        const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
        if (!matchesSearch || !matchesCategory) return false;
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
        const category = document.createElement("span");
        category.className = "category-badge";
        category.textContent = task.category;
        content.append(category);
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
    if (visibleTasks.length === 0 && tasks.length > 0) {
        emptyState.textContent = searchQuery || selectedCategory !== "all"
            ? "No tasks match your search and category filters."
            : `No ${activeFilter.replace("-", " ")} tasks here.`;
    } else {
        emptyState.textContent = "Your list is clear. Add a task to get started.";
    }
}

function mapTask(task) {
    return {
        id: task.id,
        text: task.text,
        description: task.description || "",
        dueDate: task.due_date || "",
        category: task.category || "Other",
        priority: task.priority || "medium",
        completed: Boolean(task.completed)
    };
}

async function loadTasks() {
    if (!currentUser) return;
    setTaskLoading(true);
    showTaskError();
    try {
        const { data, error } = await supabaseClient.from("Tasks").select("*").eq("user_id", currentUser.id);
        if (error) {
            showTaskError(`Could not load tasks: ${error.message}`);
            showToast(`Could not load tasks: ${error.message}`, "error");
            return;
        }
        tasks = data.map(mapTask);
        renderTasks();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        loadFocusSessionCount();
    } catch (error) {
        showTaskError(`Could not load tasks: ${error.message}`);
        showToast(`Could not load tasks: ${error.message}`, "error");
    } finally {
        setTaskLoading(false);
    }
}

async function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText || !currentUser) { taskInput.focus(); return; }
    setTaskLoading(true);
    showTaskError();
    showTaskMessage();
    try {
        const { data, error } = await supabaseClient.from("Tasks").insert({
            text: taskText,
            priority: prioritySelect.value,
            due_date: taskDueDate.value || null,
            category: taskCategory.value,
            completed: false,
            user_id: currentUser.id
        }).select().single();
        if (error) {
            showTaskError(`Could not add task: ${error.message}`);
            showToast(`Could not create task: ${error.message}`, "error");
            return;
        }
        tasks.unshift(mapTask(data));
        renderTasks();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        taskForm.reset();
        taskInput.focus();
        showToast("Task created successfully.");
    } catch (error) {
        showTaskError(`Could not create task: ${error.message}`);
        showToast(`Could not create task: ${error.message}`, "error");
    } finally {
        setTaskLoading(false);
    }
}

async function toggleTask(id, completed) {
    showTaskError();
    showTaskMessage();
    try {
        const { error } = await supabaseClient.from("Tasks").update({ completed: !completed }).eq("id", id).eq("user_id", currentUser.id);
        if (error) {
            showTaskError(`Could not update task: ${error.message}`);
            showToast(`Could not update task: ${error.message}`, "error");
            return;
        }
        tasks = tasks.map((task) => task.id === id ? { ...task, completed: !completed } : task);
        renderTasks();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        showToast(completed ? "Task marked incomplete." : "Task marked completed.");
    } catch (error) {
        showTaskError(`Could not update task: ${error.message}`);
        showToast(`Could not update task: ${error.message}`, "error");
    }
}

async function deleteTask(id) {
    showTaskError();
    showTaskMessage();
    try {
        const { error } = await supabaseClient.from("Tasks").delete().eq("id", id).eq("user_id", currentUser.id);
        if (error) {
            showTaskError(`Could not delete task: ${error.message}`);
            showToast(`Could not delete task: ${error.message}`, "error");
            return;
        }
        tasks = tasks.filter((task) => task.id !== id);
        renderTasks();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        showToast("Task deleted successfully.");
    } catch (error) {
        showTaskError(`Could not delete task: ${error.message}`);
        showToast(`Could not delete task: ${error.message}`, "error");
    }
}

function openEditModal(task) {
    editingTask = task;
    editTaskTitle.value = task.text;
    editTaskDescription.value = task.description;
    editTaskDueDate.value = task.dueDate;
    editTaskCategory.value = task.category;
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
                category: editTaskCategory.value,
                priority: editTaskPriority.value
            })
            .eq("id", editingTask.id)
            .eq("user_id", currentUser.id)
            .select()
            .single());
    } catch (requestError) {
        showTaskError(`Could not update task: ${requestError.message}`);
        showToast(`Could not update task: ${requestError.message}`, "error");
        return;
    } finally {
        saveEdit.disabled = false;
    }

    if (error) {
        showTaskError(`Could not update task: ${error.message}`);
        showToast(`Could not update task: ${error.message}`, "error");
        return;
    }
    tasks = tasks.map((task) => task.id === editingTask.id ? mapTask(data) : task);
    closeEditDialog();
    renderTasks();
    renderFocusTaskOptions();
    if (activeView === "planner") renderPlanner();
    showTaskMessage("Task updated successfully.");
    showToast("Task updated successfully.");
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
        showToast("Supabase is not configured. Check config.js.", "error", 6000);
        return;
    }
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user && isEmailConfirmationRedirect()) {
        try {
            await requireManualLoginAfterConfirmation();
        } catch (error) {
            showAuth();
            showAuthMessage(`Could not prepare the login screen: ${error.message}`);
            showToast(`Could not prepare the login screen: ${error.message}`, "error");
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
        if (error) {
            showTaskError(`Could not log out: ${error.message}`);
            showToast(`Could not log out: ${error.message}`, "error");
        }
    } catch (error) {
        showTaskError(`Could not log out: ${error.message}`);
        showToast(`Could not log out: ${error.message}`, "error");
    } finally {
        logoutButton.disabled = false;
    }
});
filterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderTasks();
}));
taskSearch.addEventListener("input", () => {
    searchQuery = taskSearch.value.trim().toLowerCase();
    clearSearch.hidden = !searchQuery;
    renderTasks();
});
clearSearch.addEventListener("click", () => {
    taskSearch.value = "";
    searchQuery = "";
    clearSearch.hidden = true;
    taskSearch.focus();
    renderTasks();
});
categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value;
    renderTasks();
});
themeToggle.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark"));
tasksViewTab.addEventListener("click", () => setActiveView("tasks"));
plannerViewTab.addEventListener("click", () => setActiveView("planner"));
focusViewTab.addEventListener("click", () => setActiveView("focus"));
previousWeek.addEventListener("click", () => {
    calendarWeekOffset -= 1;
    selectedCalendarDate = getWeekDates()[0];
    renderPlanner();
});
nextWeek.addEventListener("click", () => {
    calendarWeekOffset += 1;
    selectedCalendarDate = getWeekDates()[0];
    renderPlanner();
});
addForDate.addEventListener("click", () => {
    setActiveView("tasks");
    taskDueDate.value = selectedCalendarDate;
    taskInput.focus();
    showToast(`New task due ${formatDueDate(selectedCalendarDate)}.`);
});
timerStart.addEventListener("click", runFocusTimer);
timerPause.addEventListener("click", pauseFocusTimer);
timerReset.addEventListener("click", resetFocusTimer);
focusSettings.addEventListener("submit", applyFocusDurations);
focusTaskSelect.addEventListener("change", updateFocusTaskLabel);
setInterval(() => {
    if (currentUser) renderTasks();
}, 60000);
closeEditModal.addEventListener("click", closeEditDialog);
cancelEdit.addEventListener("click", closeEditDialog);
editModal.addEventListener("click", (event) => {
    if (event.target === editModal) closeEditDialog();
});
initialize();

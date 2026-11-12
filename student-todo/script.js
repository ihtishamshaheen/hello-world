const taskInput = document.getElementById("taskInput");
const taskDueDate = document.getElementById("taskDueDate");
const taskDueTime = document.getElementById("taskDueTime");
const taskReminderEnabled = document.getElementById("taskReminderEnabled");
const taskReminderOptions = document.getElementById("taskReminderOptions");
const taskRecurrence = document.getElementById("taskRecurrence");
const taskRecurrenceInterval = document.getElementById("taskRecurrenceInterval");
const taskRecurrenceEndDate = document.getElementById("taskRecurrenceEndDate");
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
const authFullName = document.getElementById("authFullName");
const authFullNameLabel = document.getElementById("authFullNameLabel");
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
const editTaskDueTime = document.getElementById("editTaskDueTime");
const editTaskReminderEnabled = document.getElementById("editTaskReminderEnabled");
const editTaskReminderOptions = document.getElementById("editTaskReminderOptions");
const editTaskRecurrence = document.getElementById("editTaskRecurrence");
const editTaskRecurrenceInterval = document.getElementById("editTaskRecurrenceInterval");
const editTaskRecurrenceEndDate = document.getElementById("editTaskRecurrenceEndDate");
const editTaskRecurrenceActive = document.getElementById("editTaskRecurrenceActive");
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
const analyticsViewTab = document.getElementById("analyticsViewTab");
const analyticsPanel = document.getElementById("analyticsPanel");
const kanbanViewTab = document.getElementById("kanbanViewTab");
const kanbanPanel = document.getElementById("kanbanPanel");
const settingsViewTab = document.getElementById("settingsViewTab");
const settingsPanel = document.getElementById("settingsPanel");
const exportTasksCsv = document.getElementById("exportTasksCsv");
const exportTasksJson = document.getElementById("exportTasksJson");
const kanbanCategoryFilter = document.getElementById("kanbanCategoryFilter");
const kanbanPriorityFilter = document.getElementById("kanbanPriorityFilter");
const kanbanLoading = document.getElementById("kanbanLoading");
const kanbanBoard = document.getElementById("kanbanBoard");
const weeklyAnalytics = document.getElementById("weeklyAnalytics");
const monthlyAnalytics = document.getElementById("monthlyAnalytics");
const analyticsLoading = document.getElementById("analyticsLoading");
const analyticsEmpty = document.getElementById("analyticsEmpty");
const analyticsContent = document.getElementById("analyticsContent");
const completionChart = document.getElementById("completionChart");
const categoryChart = document.getElementById("categoryChart");
const analyticsFocusSessions = document.getElementById("analyticsFocusSessions");
const analyticsCurrentStreak = document.getElementById("analyticsCurrentStreak");
const analyticsLongestStreak = document.getElementById("analyticsLongestStreak");
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
const currentStreak = document.getElementById("currentStreak");
const longestStreak = document.getElementById("longestStreak");
const streakMessage = document.getElementById("streakMessage");
const activityDays = document.getElementById("activityDays");
const dashboardHeading = document.getElementById("dashboard-heading");
const dashboardDate = document.getElementById("dashboardDate");
const quickAddTask = document.getElementById("quickAddTask");
const dashboardOverdueCount = document.getElementById("dashboardOverdueCount");
const dashboardStreakCount = document.getElementById("dashboardStreakCount");
const todayTaskList = document.getElementById("todayTaskList");
const todayTaskCount = document.getElementById("todayTaskCount");
const todayTaskEmpty = document.getElementById("todayTaskEmpty");
const upcomingTaskList = document.getElementById("upcomingTaskList");
const upcomingTaskCount = document.getElementById("upcomingTaskCount");
const upcomingTaskEmpty = document.getElementById("upcomingTaskEmpty");
const miniProductivityChart = document.getElementById("miniProductivityChart");
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
let analyticsPeriod = "weekly";
let analyticsRequestId = 0;
let kanbanCategory = "all";
let kanbanPriority = "all";
const activeToasts = new Set();
let focusMode = "focus";
let focusSecondsRemaining = 25 * 60;
let focusTotalSeconds = 25 * 60;
let focusTimerId = null;
let focusSessionTotal = 0;
let completedFocusSessions = 0;
let studyActivityDates = [];

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

function getCurrentWeekDates() {
    const savedOffset = calendarWeekOffset;
    calendarWeekOffset = 0;
    const dates = getWeekDates();
    calendarWeekOffset = savedOffset;
    return dates;
}

function calculateStreaks(activityDates) {
    const dates = [...new Set(activityDates)]
        .filter((date) => date <= getLocalDateKey())
        .sort();
    const dateSet = new Set(dates);
    let longest = 0;
    let run = 0;
    let previousDate = null;
    dates.forEach((date) => {
        const currentDate = parseLocalDate(date);
        const expectedDate = previousDate ? new Date(previousDate) : null;
        if (expectedDate) expectedDate.setDate(expectedDate.getDate() + 1);
        const isConsecutive = expectedDate && date === getLocalDateKey(expectedDate);
        run = isConsecutive ? run + 1 : 1;
        longest = Math.max(longest, run);
        previousDate = currentDate;
    });

    let current = 0;
    const cursor = parseLocalDate(getLocalDateKey());
    if (!dateSet.has(getLocalDateKey())) cursor.setDate(cursor.getDate() - 1);
    while (dateSet.has(getLocalDateKey(cursor))) {
        current += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return { current, longest };
}

function renderStudyStreak() {
    const streaks = calculateStreaks(studyActivityDates);
    currentStreak.textContent = streaks.current;
    longestStreak.textContent = streaks.longest;
    dashboardStreakCount.textContent = streaks.current;
    streakMessage.textContent = streaks.current > 0
        ? (streaks.current >= 3 ? "You are building a strong study habit." : "Keep going to grow your streak.")
        : "Complete a task or focus session to start your streak.";

    activityDays.innerHTML = "";
    const today = getLocalDateKey();
    getCurrentWeekDates().forEach((dateKey) => {
        const date = parseLocalDate(dateKey);
        const day = document.createElement("div");
        const isFuture = dateKey > today;
        day.className = `activity-day${studyActivityDates.includes(dateKey) ? " activity-day-active" : ""}${dateKey === today ? " activity-day-today" : ""}${isFuture ? " activity-day-future" : ""}`;
        const label = document.createElement("span");
        label.textContent = new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(date);
        const marker = document.createElement("strong");
        marker.textContent = studyActivityDates.includes(dateKey) ? "✓" : date.getDate();
        day.append(label, marker);
        activityDays.appendChild(day);
    });
}

function getGreeting(hour = new Date().getHours()) {
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

function updateDashboardDate() {
    const now = new Date();
    dashboardHeading.textContent = getGreeting(now.getHours());
    dashboardDate.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: "long", month: "long", day: "numeric", year: "numeric"
    }).format(now);
}

function createDashboardTaskItem(task) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = `dashboard-task-item${task.completed ? " dashboard-task-complete" : ""}`;
    button.type = "button";
    button.addEventListener("click", () => openEditModal(task));
    const title = document.createElement("strong");
    title.textContent = task.text;
    const meta = document.createElement("span");
    meta.textContent = task.dueDate ? formatDueDate(task.dueDate) : "No due date";
    const priority = document.createElement("em");
    priority.className = `priority priority-${task.priority}`;
    priority.textContent = task.priority;
    button.append(title, meta, priority);
    item.appendChild(button);
    return item;
}

function renderMiniProductivityChart() {
    const weekDates = getCurrentWeekDates();
    const counts = weekDates.map((date) => tasks.filter((task) =>
        task.completed && getTaskAnalyticsDate(task) === date
    ).length);
    const maximum = Math.max(...counts, 1);
    miniProductivityChart.replaceChildren();
    weekDates.forEach((date, index) => {
        const bar = document.createElement("div");
        bar.className = "mini-chart-bar";
        const fill = document.createElement("span");
        fill.style.height = `${Math.max(8, counts[index] / maximum * 100)}%`;
        fill.title = `${counts[index]} completed`;
        const label = document.createElement("small");
        label.textContent = new Intl.DateTimeFormat(undefined, { weekday: "narrow" })
            .format(parseLocalDate(date));
        bar.append(fill, label);
        miniProductivityChart.appendChild(bar);
    });
}

function renderDashboardSections() {
    updateDashboardDate();
    const today = getLocalDateKey();
    const todayTasks = tasks.filter((task) => task.dueDate === today);
    const upcomingTasks = tasks
        .filter((task) => !task.completed && task.dueDate > today)
        .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
        .slice(0, 5);
    todayTaskList.replaceChildren();
    upcomingTaskList.replaceChildren();
    todayTasks.forEach((task) => todayTaskList.appendChild(createDashboardTaskItem(task)));
    upcomingTasks.forEach((task) => upcomingTaskList.appendChild(createDashboardTaskItem(task)));
    todayTaskCount.textContent = todayTasks.length;
    upcomingTaskCount.textContent = upcomingTasks.length;
    todayTaskEmpty.hidden = todayTasks.length > 0;
    upcomingTaskEmpty.hidden = upcomingTasks.length > 0;
    renderMiniProductivityChart();
}

function getAnalyticsRange() {
    const today = parseLocalDate(getLocalDateKey());
    if (analyticsPeriod === "weekly") {
        const dates = getCurrentWeekDates();
        const start = parseLocalDate(dates[0]);
        const end = parseLocalDate(dates[6]);
        end.setDate(end.getDate() + 1);
        return { start, end, dates };
    }
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const dates = [];
    for (const cursor = new Date(start); cursor < end; cursor.setDate(cursor.getDate() + 1)) {
        dates.push(getLocalDateKey(cursor));
    }
    return { start, end, dates };
}

function isDateInRange(dateKey, range) {
    return Boolean(dateKey) && dateKey >= getLocalDateKey(range.start) && dateKey < getLocalDateKey(range.end);
}

function getTaskAnalyticsDate(task) {
    return task.dueDate || (task.createdAt ? task.createdAt.slice(0, 10) : "");
}

function createAnalyticsBar(label, value, maximum, className = "") {
    const item = document.createElement("div");
    item.className = `chart-bar-item ${className}`;
    const barLabel = document.createElement("span");
    barLabel.textContent = label;
    const track = document.createElement("span");
    track.className = "chart-bar-track";
    const bar = document.createElement("span");
    bar.className = "chart-bar";
    bar.style.height = `${maximum ? Math.max(4, value / maximum * 100) : 4}%`;
    bar.title = `${value} completed`;
    track.appendChild(bar);
    const count = document.createElement("strong");
    count.textContent = value;
    item.append(barLabel, track, count);
    return item;
}

function renderAnalyticsCharts(range, periodTasks) {
    const completionCounts = range.dates.map((date) => periodTasks
        .filter((task) => task.completed && getTaskAnalyticsDate(task) === date).length);
    const chartBuckets = analyticsPeriod === "weekly"
        ? completionCounts
        : Array.from({ length: 5 }, (_, index) => completionCounts
            .slice(index * 7, (index + 1) * 7)
            .reduce((sum, value) => sum + value, 0));
    const labels = analyticsPeriod === "weekly"
        ? range.dates.map((date) => new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(parseLocalDate(date)))
        : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
    const maximum = Math.max(...chartBuckets, 0);
    completionChart.innerHTML = "";
    chartBuckets.forEach((value, index) => {
        completionChart.appendChild(createAnalyticsBar(labels[index], value, maximum));
    });

    const categoryCounts = new Map();
    periodTasks.forEach((task) => categoryCounts.set(task.category, (categoryCounts.get(task.category) || 0) + 1));
    const categories = [...categoryCounts.entries()].sort((first, second) => second[1] - first[1]);
    const categoryMaximum = Math.max(...categories.map(([, value]) => value), 0);
    categoryChart.innerHTML = "";
    categories.forEach(([category, value]) => {
        const item = document.createElement("div");
        item.className = "category-chart-item";
        const label = document.createElement("span");
        label.textContent = category;
        const track = document.createElement("span");
        track.className = "category-track";
        const bar = document.createElement("span");
        bar.style.width = `${categoryMaximum ? value / categoryMaximum * 100 : 0}%`;
        track.appendChild(bar);
        const count = document.createElement("strong");
        count.textContent = value;
        item.append(label, track, count);
        categoryChart.appendChild(item);
    });
}

async function loadAnalytics() {
    if (!currentUser) return;
    const requestId = ++analyticsRequestId;
    const range = getAnalyticsRange();
    analyticsLoading.hidden = false;
    analyticsEmpty.hidden = true;
    analyticsContent.hidden = true;
    try {
        const startIso = range.start.toISOString();
        const endIso = range.end.toISOString();
        const { data: sessions, error } = await supabaseClient
            .from("FocusSessions")
            .select("id,completed_at")
            .eq("user_id", currentUser.id)
            .gte("completed_at", startIso)
            .lt("completed_at", endIso);
        if (error) throw error;
        if (requestId !== analyticsRequestId) return;

        const periodTasks = tasks.filter((task) => isDateInRange(getTaskAnalyticsDate(task), range));
        const completed = periodTasks.filter((task) => task.completed).length;
        const pending = periodTasks.length - completed;
        const overdue = periodTasks.filter((task) => getTaskStatus(task) === "overdue").length;
        document.getElementById("analyticsTotal").textContent = periodTasks.length;
        document.getElementById("analyticsCompleted").textContent = completed;
        document.getElementById("analyticsPending").textContent = pending;
        document.getElementById("analyticsOverdue").textContent = overdue;
        document.getElementById("analyticsPercentage").textContent = periodTasks.length
            ? `${Math.round(completed / periodTasks.length * 100)}%`
            : "0%";
        analyticsFocusSessions.textContent = sessions.length;
        const streaks = calculateStreaks(studyActivityDates);
        analyticsCurrentStreak.textContent = streaks.current;
        analyticsLongestStreak.textContent = streaks.longest;
        renderAnalyticsCharts(range, periodTasks);
        const hasData = periodTasks.length > 0 || sessions.length > 0
            || studyActivityDates.some((date) => isDateInRange(date, range));
        analyticsEmpty.hidden = hasData;
        analyticsContent.hidden = !hasData;
    } catch (error) {
        showToast(`Could not load analytics: ${error.message}`, "error");
        analyticsEmpty.textContent = "Analytics could not be loaded. Please try again.";
        analyticsEmpty.hidden = false;
    } finally {
        if (requestId === analyticsRequestId) analyticsLoading.hidden = true;
    }
}

function refreshAnalyticsIfVisible() {
    if (activeView === "analytics") loadAnalytics();
}

function getKanbanStatus(task) {
    if (task.status === "completed" || task.completed) return "completed";
    return task.status === "in_progress" ? "in_progress" : "todo";
}

function createKanbanCard(task) {
    const card = document.createElement("article");
    card.className = `kanban-card${task.completed ? " kanban-card-completed" : ""}`;
    card.draggable = true;
    card.dataset.taskId = String(task.id);
    card.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", String(task.id));
        event.dataTransfer.effectAllowed = "move";
        card.classList.add("kanban-dragging");
    });
    card.addEventListener("dragend", () => card.classList.remove("kanban-dragging"));

    const title = document.createElement("h4");
    title.textContent = task.text;
    const details = document.createElement("div");
    details.className = "kanban-card-details";
    const priority = document.createElement("span");
    priority.className = `priority priority-${task.priority}`;
    priority.textContent = `${task.priority} priority`;
    const category = document.createElement("span");
    category.className = "category-badge";
    category.textContent = task.category;
    details.append(priority, category);
    if (task.dueDate) {
        const dueDate = document.createElement("span");
        dueDate.className = `kanban-due-date${getTaskStatus(task) === "overdue" ? " kanban-due-overdue" : ""}`;
        dueDate.textContent = getTaskStatus(task) === "overdue"
            ? `Overdue · ${formatDueDate(task.dueDate)}`
            : `Due · ${formatDueDate(task.dueDate)}`;
        details.appendChild(dueDate);
    }

    const actions = document.createElement("div");
    actions.className = "kanban-card-actions";
    const edit = document.createElement("button");
    edit.className = "edit-button";
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => openEditModal(task));
    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteTask(task.id));
    actions.append(edit, remove);
    card.append(title, details, actions);
    return card;
}

function renderKanban() {
    const columns = {
        todo: document.getElementById("todoCards"),
        in_progress: document.getElementById("inProgressCards"),
        completed: document.getElementById("kanbanCompletedCards")
    };
    Object.values(columns).forEach((column) => column.replaceChildren());
    const visibleTasks = tasks.filter((task) =>
        (kanbanCategory === "all" || task.category === kanbanCategory)
        && (kanbanPriority === "all" || task.priority === kanbanPriority)
    );
    visibleTasks.forEach((task) => columns[getKanbanStatus(task)].appendChild(createKanbanCard(task)));
    Object.entries(columns).forEach(([status, column]) => {
        const count = status === "todo" ? "todoCount" : status === "in_progress" ? "inProgressCount" : "kanbanCompletedCount";
        column.closest(".kanban-column").classList.toggle("kanban-column-empty", column.children.length === 0);
        document.getElementById(count).textContent = column.children.length;
    });
}

async function moveTaskToStatus(taskId, status) {
    const task = tasks.find((item) => String(item.id) === String(taskId));
    if (!task || !currentUser || getKanbanStatus(task) === status) return;
    kanbanLoading.hidden = false;
    const completed = status === "completed";
    try {
        const { data, error } = await supabaseClient
            .from("Tasks")
            .update({ status, completed })
            .eq("id", task.id)
            .eq("user_id", currentUser.id)
            .select()
            .single();
        if (error) throw error;
        tasks = tasks.map((item) => item.id === task.id ? mapTask(data) : item);
        renderKanban();
        renderTasks();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        if (completed) {
            try {
                await recordStudyActivity();
            } catch (activityError) {
                showToast(`Task moved, but study activity could not be saved: ${activityError.message}`, "error");
            }
        }
        refreshAnalyticsIfVisible();
        showToast(`Task moved to ${status === "in_progress" ? "In Progress" : status === "completed" ? "Completed" : "To Do"}.`);
    } catch (error) {
        showToast(`Could not move task: ${error.message}`, "error");
    } finally {
        kanbanLoading.hidden = true;
    }
}

kanbanBoard.addEventListener("dragover", (event) => {
    const column = event.target.closest(".kanban-column");
    if (!column) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    column.classList.add("kanban-column-drop-target");
});
kanbanBoard.addEventListener("dragleave", (event) => {
    const column = event.target.closest(".kanban-column");
    if (column && !column.contains(event.relatedTarget)) column.classList.remove("kanban-column-drop-target");
});
kanbanBoard.addEventListener("drop", (event) => {
    const column = event.target.closest(".kanban-column");
    if (!column) return;
    event.preventDefault();
    column.classList.remove("kanban-column-drop-target");
    moveTaskToStatus(event.dataTransfer.getData("text/plain"), column.dataset.status);
});

async function loadStudyActivity() {
    if (!currentUser) return;
    try {
        const { data, error } = await supabaseClient
            .from("StudyActivity")
            .select("activity_date")
            .eq("user_id", currentUser.id)
            .lte("activity_date", getLocalDateKey())
            .order("activity_date", { ascending: true });
        if (error) throw error;
        studyActivityDates = data.map((row) => row.activity_date);
        renderStudyStreak();
        refreshAnalyticsIfVisible();
    } catch (error) {
        showToast(`Could not load study streak: ${error.message}`, "error");
    }
}

async function recordStudyActivity() {
    if (!currentUser) return;
    const activityDate = getLocalDateKey();
    const before = calculateStreaks(studyActivityDates).current;
    if (studyActivityDates.includes(activityDate)) return;
    const { error } = await supabaseClient
        .from("StudyActivity")
        .upsert({ user_id: currentUser.id, activity_date: activityDate }, {
            onConflict: "user_id,activity_date",
            ignoreDuplicates: true
        });
    if (error) throw error;
    studyActivityDates = [...studyActivityDates, activityDate];
    renderStudyStreak();
    const after = calculateStreaks(studyActivityDates).current;
    if (after > before) showToast(`Streak increased to ${after} ${after === 1 ? "day" : "days"}!`);
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
    const showAnalytics = view === "analytics";
    const showKanban = view === "kanban";
    const showSettings = view === "settings";
    taskPanel.hidden = showPlanner || showFocus || showAnalytics || showKanban || showSettings;
    plannerPanel.hidden = !showPlanner;
    focusPanel.hidden = !showFocus;
    analyticsPanel.hidden = !showAnalytics;
    kanbanPanel.hidden = !showKanban;
    settingsPanel.hidden = !showSettings;
    tasksViewTab.classList.toggle("active", view === "tasks");
    plannerViewTab.classList.toggle("active", showPlanner);
    focusViewTab.classList.toggle("active", showFocus);
    analyticsViewTab.classList.toggle("active", showAnalytics);
    kanbanViewTab.classList.toggle("active", showKanban);
    settingsViewTab.classList.toggle("active", showSettings);
    tasksViewTab.setAttribute("aria-selected", String(view === "tasks"));
    plannerViewTab.setAttribute("aria-selected", String(showPlanner));
    focusViewTab.setAttribute("aria-selected", String(showFocus));
    analyticsViewTab.setAttribute("aria-selected", String(showAnalytics));
    kanbanViewTab.setAttribute("aria-selected", String(showKanban));
    settingsViewTab.setAttribute("aria-selected", String(showSettings));
    if (showPlanner) renderPlanner();
    if (showFocus) renderFocusTaskOptions();
    if (showAnalytics) loadAnalytics();
    if (showKanban) renderKanban();
}

function getExportRows(sourceTasks) {
    return sourceTasks.map((task) => ({
        title: task.text,
        description: task.description,
        priority: task.priority,
        category: task.category,
        due_date: task.dueDate || "",
        completed: task.completed,
        created_at: task.createdAt || ""
    }));
}

function downloadExport(content, fileName, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function escapeCsvValue(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
}

async function exportTasks(format) {
    if (!currentUser || !supabaseClient) {
        showToast("Sign in before exporting your tasks.", "error");
        return;
    }
    exportTasksCsv.disabled = true;
    exportTasksJson.disabled = true;
    try {
        const { data, error } = await supabaseClient
            .from("Tasks")
            .select("text,description,priority,category,due_date,completed,created_at")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: true });
        if (error) throw error;
        const rows = getExportRows(data.map(mapTask));
        const stamp = getLocalDateKey();
        if (format === "json") {
            downloadExport(JSON.stringify(rows, null, 2), `study-desk-tasks-${stamp}.json`, "application/json");
        } else {
            const headers = ["title", "description", "priority", "category", "due_date", "completed", "created_at"];
            const csv = [headers, ...rows.map((row) => headers.map((header) => row[header]))]
                .map((row) => row.map(escapeCsvValue).join(","))
                .join("\r\n");
            downloadExport(`\uFEFF${csv}`, `study-desk-tasks-${stamp}.csv`, "text/csv;charset=utf-8");
        }
        showToast(`Tasks exported as ${format.toUpperCase()}.`);
    } catch (error) {
        showToast(`Could not export tasks: ${error.message}`, "error");
    } finally {
        exportTasksCsv.disabled = false;
        exportTasksJson.disabled = false;
    }
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
    await recordStudyActivity();
    refreshAnalyticsIfVisible();
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
    authFullName.hidden = isLogin;
    authFullNameLabel.hidden = isLogin;
    authFullName.required = !isLogin;
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
    authFullName.disabled = isSent;
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
        const fullName = authFullName.value.trim();
        if (authMode === "signup" && !fullName) {
            showAuthMessage("Please enter your full name.");
            authFullName.focus();
            return;
        }
        const result = authMode === "login"
            ? await supabaseClient.auth.signInWithPassword({ email: authEmail.value.trim(), password: authPassword.value })
            : await supabaseClient.auth.signUp({
                email: authEmail.value.trim(),
                password: authPassword.value,
                options: {
                    emailRedirectTo: getEmailRedirectUrl(),
                    data: { full_name: fullName }
                }
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
    const metadata = user.user_metadata || {};
    const metadataName = [metadata.full_name, metadata.name, metadata.username]
        .find((value) => typeof value === "string" && value.trim());
    const emailName = typeof user.email === "string"
        ? user.email.split("@")[0]
        : "there";
    const displayName = (metadataName || emailName).trim();
    document.getElementById("userInfo").textContent = `Welcome, ${displayName}`;
    loadTasks();
}

function showAuth() {
    currentUser = null;
    tasks = [];
    resetFocusTimer();
    completedFocusSessions = 0;
    focusSessionCount.textContent = "0";
    studyActivityDates = [];
    renderStudyStreak();
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
    const overdue = tasks.filter((task) => getTaskStatus(task) === "overdue").length;
    document.getElementById("totalCount").textContent = total;
    document.getElementById("activeCount").textContent = total - completed;
    document.getElementById("completedCount").textContent = completed;
    dashboardOverdueCount.textContent = overdue;
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
    renderDashboardSections();
}

function getSelectedValues(select) {
    return Array.from(select.selectedOptions).map((option) => option.value);
}

function getDueAt(dateInput, timeInput) {
    if (!dateInput || !timeInput) return null;
    const localDate = new Date(`${dateInput}T${timeInput}`);
    return Number.isNaN(localDate.getTime()) ? null : localDate.toISOString();
}

function getRecurrenceRule(select, intervalInput) {
    if (select.value === "none") return null;
    return select.value;
}

function setRecurrenceControls(select, intervalInput, endDateInput) {
    const recurring = select.value !== "none";
    intervalInput.hidden = !recurring;
    endDateInput.hidden = !recurring;
}

function setReminderControls(enabledInput, optionsInput) {
    optionsInput.disabled = !enabledInput.checked;
}

function getLocalTimeFromIso(value) {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ""
        : `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function mapTask(task) {
    let recurrenceRule = null;
    if (task.recurrence_rule && task.recurrence_rule !== "none") {
        try {
            const frequency = typeof task.recurrence_rule === "string"
                ? task.recurrence_rule
                : task.recurrence_rule.frequency;
            recurrenceRule = {
                frequency,
                interval: Math.max(1, Number(task.recurrence_interval) || 1)
            };
        } catch (error) {
            console.error("Could not parse recurrence rule.", error);
        }
    }
    return {
        id: task.id,
        text: task.text,
        description: task.description ?? "",
        dueDate: task.due_date || "",
        dueAt: task.due_at || "",
        reminderEnabled: Boolean(task.reminder_enabled),
        reminderOptions: task.reminder_options || [],
        recurrenceRule,
        recurrenceEndDate: task.recurrence_end_date || "",
        recurrenceActive: Boolean(task.recurrence_active),
        recurrenceSeriesId: task.recurrence_series_id || "",
        category: task.category || "Other",
        priority: task.priority || "medium",
        completed: Boolean(task.completed),
        status: task.status || (task.completed ? "completed" : "todo"),
        createdAt: task.created_at || ""
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
        renderKanban();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        loadFocusSessionCount();
        loadStudyActivity();
        loadAnalytics();
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
            due_at: getDueAt(taskDueDate.value, taskDueTime.value || (taskRecurrence.value !== "none" ? "00:00" : "")),
            reminder_enabled: taskReminderEnabled.checked && Boolean(taskDueTime.value),
            reminder_options: taskReminderEnabled.checked ? getSelectedValues(taskReminderOptions) : [],
            recurrence_rule: getRecurrenceRule(taskRecurrence, taskRecurrenceInterval),
            recurrence_interval: Math.max(1, Number(taskRecurrenceInterval.value) || 1),
            recurrence_end_date: taskRecurrence.value === "none" ? null : taskRecurrenceEndDate.value || null,
            recurrence_active: taskRecurrence.value !== "none",
            category: taskCategory.value,
            completed: false,
            status: "todo",
            user_id: currentUser.id
        }).select().single();
        if (error) {
            showTaskError(`Could not add task: ${error.message}`);
            showToast(`Could not create task: ${error.message}`, "error");
            return;
        }
        tasks.unshift(mapTask(data));
        renderTasks();
        refreshAnalyticsIfVisible();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        taskForm.reset();
        setRecurrenceControls(taskRecurrence, taskRecurrenceInterval, taskRecurrenceEndDate);
        setReminderControls(taskReminderEnabled, taskReminderOptions);
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
        const nextCompleted = !completed;
        const { error } = await supabaseClient.from("Tasks")
            .update({ completed: nextCompleted, status: nextCompleted ? "completed" : "todo" })
            .eq("id", id)
            .eq("user_id", currentUser.id);
        if (error) {
            showTaskError(`Could not update task: ${error.message}`);
            showToast(`Could not update task: ${error.message}`, "error");
            return;
        }
        tasks = tasks.map((task) => task.id === id
            ? { ...task, completed: nextCompleted, status: nextCompleted ? "completed" : "todo" }
            : task);
        renderTasks();
        renderKanban();
        renderFocusTaskOptions();
        if (activeView === "planner") renderPlanner();
        if (!completed) {
            try {
                await recordStudyActivity();
            } catch (activityError) {
                showToast(`Task completed, but study activity could not be saved: ${activityError.message}`, "error");
            }
        }
        refreshAnalyticsIfVisible();
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
        renderKanban();
        refreshAnalyticsIfVisible();
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
    editTaskDueTime.value = getLocalTimeFromIso(task.dueAt);
    editTaskReminderEnabled.checked = task.reminderEnabled;
    Array.from(editTaskReminderOptions.options).forEach((option) => {
        option.selected = task.reminderOptions.includes(option.value);
    });
    editTaskRecurrence.value = task.recurrenceRule?.frequency || "none";
    editTaskRecurrenceInterval.value = task.recurrenceRule?.interval || 1;
    editTaskRecurrenceEndDate.value = task.recurrenceEndDate;
    editTaskRecurrenceActive.checked = task.recurrenceActive;
    setRecurrenceControls(editTaskRecurrence, editTaskRecurrenceInterval, editTaskRecurrenceEndDate);
    setReminderControls(editTaskReminderEnabled, editTaskReminderOptions);
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
                due_at: getDueAt(editTaskDueDate.value, editTaskDueTime.value || (editTaskRecurrence.value !== "none" ? "00:00" : "")),
                reminder_enabled: editTaskReminderEnabled.checked && Boolean(editTaskDueTime.value),
                reminder_options: editTaskReminderEnabled.checked ? getSelectedValues(editTaskReminderOptions) : [],
                recurrence_rule: getRecurrenceRule(editTaskRecurrence, editTaskRecurrenceInterval),
                recurrence_interval: Math.max(1, Number(editTaskRecurrenceInterval.value) || 1),
                recurrence_end_date: editTaskRecurrence.value === "none" ? null : editTaskRecurrenceEndDate.value || null,
                recurrence_active: editTaskRecurrence.value !== "none" && editTaskRecurrenceActive.checked,
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
    renderKanban();
    refreshAnalyticsIfVisible();
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
    updateDashboardDate();
    updateLocalDateTime();
    setInterval(updateLocalDateTime, 1000);
    setInterval(updateDashboardDate, 60000);
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
quickAddTask.addEventListener("click", () => {
    setActiveView("tasks");
    taskInput.focus();
    taskInput.scrollIntoView({ behavior: "smooth", block: "center" });
});
tasksViewTab.addEventListener("click", () => setActiveView("tasks"));
plannerViewTab.addEventListener("click", () => setActiveView("planner"));
focusViewTab.addEventListener("click", () => setActiveView("focus"));
analyticsViewTab.addEventListener("click", () => setActiveView("analytics"));
kanbanViewTab.addEventListener("click", () => setActiveView("kanban"));
settingsViewTab.addEventListener("click", () => setActiveView("settings"));
exportTasksCsv.addEventListener("click", () => exportTasks("csv"));
exportTasksJson.addEventListener("click", () => exportTasks("json"));
kanbanCategoryFilter.addEventListener("change", () => {
    kanbanCategory = kanbanCategoryFilter.value;
    renderKanban();
});
kanbanPriorityFilter.addEventListener("change", () => {
    kanbanPriority = kanbanPriorityFilter.value;
    renderKanban();
});
weeklyAnalytics.addEventListener("click", () => {
    analyticsPeriod = "weekly";
    weeklyAnalytics.classList.add("active");
    monthlyAnalytics.classList.remove("active");
    loadAnalytics();
});
monthlyAnalytics.addEventListener("click", () => {
    analyticsPeriod = "monthly";
    monthlyAnalytics.classList.add("active");
    weeklyAnalytics.classList.remove("active");
    loadAnalytics();
});
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
taskRecurrence.addEventListener("change", () => {
    setRecurrenceControls(taskRecurrence, taskRecurrenceInterval, taskRecurrenceEndDate);
});
editTaskRecurrence.addEventListener("change", () => {
    setRecurrenceControls(editTaskRecurrence, editTaskRecurrenceInterval, editTaskRecurrenceEndDate);
});
taskReminderEnabled.addEventListener("change", () => {
    setReminderControls(taskReminderEnabled, taskReminderOptions);
});
editTaskReminderEnabled.addEventListener("change", () => {
    setReminderControls(editTaskReminderEnabled, editTaskReminderOptions);
});
setRecurrenceControls(taskRecurrence, taskRecurrenceInterval, taskRecurrenceEndDate);
setReminderControls(taskReminderEnabled, taskReminderOptions);
timerStart.addEventListener("click", runFocusTimer);
timerPause.addEventListener("click", pauseFocusTimer);
timerReset.addEventListener("click", resetFocusTimer);
focusSettings.addEventListener("submit", applyFocusDurations);
focusTaskSelect.addEventListener("change", updateFocusTaskLabel);
setInterval(() => {
    if (currentUser) renderTasks();
}, 60000);
window.addEventListener("online", () => {
    if (!currentUser) return;
    showToast("Connection restored. Syncing your tasks.");
    loadTasks();
});
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch((error) => {
            console.error("Could not register the service worker.", error);
        });
    });
}
closeEditModal.addEventListener("click", closeEditDialog);
cancelEdit.addEventListener("click", closeEditDialog);
editModal.addEventListener("click", (event) => {
    if (event.target === editModal) closeEditDialog();
});
initialize();

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {
    const taskText = taskInput.value.trim();

    if (!taskText) {
        taskInput.focus();
        return;
    }

    const taskItem = document.createElement("li");
    const taskLabel = document.createElement("span");
    const completeButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    taskLabel.textContent = taskText;
    completeButton.type = "button";
    completeButton.textContent = "Complete";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    completeButton.addEventListener("click", () => {
        taskItem.classList.toggle("completed");
        completeButton.textContent = taskItem.classList.contains("completed")
            ? "Undo"
            : "Complete";
    });

    deleteButton.addEventListener("click", () => {
        taskItem.remove();
    });

    taskItem.append(taskLabel, completeButton, deleteButton);
    taskList.appendChild(taskItem);
    taskInput.value = "";
    taskInput.focus();
}

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

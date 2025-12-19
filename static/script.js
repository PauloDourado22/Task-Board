/* ---Initialization--- */
const statuses = ["todo", "in-progress", "completed"];

// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks on page load
renderTasks();

/* ---Render Tasks Function--- */
function renderTasks() {
    // Clear all lists first
    document.querySelectorAll(".column ul").forEach(ul => ul.innerHTML = "");

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.style.opacity = 0; // start invisible
        document
            .querySelector(`.column[data-status="${task.status}"] ul`)
            .appendChild(li);

        // trigger fade-in
        setTimeout(() => {
            li.style.opacity = 1;
        }, 10);

        // Task text node
        const taskTextNode = document.createTextNode(task.text);
        li.appendChild(taskTextNode);

        // Completed style
        if (task.status === "completed") li.classList.add("completed");

        // Controls container
        const controls = document.createElement("div");

        // Left button (move backward)
        if (task.status !== "todo") {
            const left = document.createElement("button");
            left.type = "button";
            left.textContent = "←";
            left.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                moveTask(task.id, -1);
            });
            controls.appendChild(left);
        }

        // Right button (move forward)
        if (task.status !== "completed") {
            const right = document.createElement("button");
            right.type = "button";
            right.textContent = "→";
            right.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                moveTask(task.id, 1);
            });
            controls.appendChild(right);
        }

        // Delete button
        const del = document.createElement("button");
        del.type = "button";
        del.textContent = "x";
        del.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            deleteTask(task.id);
        });
        controls.appendChild(del);

        li.appendChild(controls);

        // Append task to the correct column
        document
            .querySelector(`.column[data-status="${task.status}"] ul`)
            .appendChild(li);
    });

    // Save updated tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---Add Task--- */
document.getElementById("task-form").addEventListener("submit", e => {
    e.preventDefault();

    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if (!taskText) return;

    tasks.push({
        id: Date.now(),
        text: taskText,
        status: "todo"
    });

    input.value = "";
    renderTasks();
});

/* ---Move Task--- */
function moveTask(id, direction) {
    const task = tasks.find(t => t.id === id);
    const index = statuses.indexOf(task.status);
    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < statuses.length) {
        task.status = statuses[newIndex];
        renderTasks();
    }
}

/* ---Delete Task--- */
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        const li = document.querySelector(`.column ul li:nth-child(${index + 1})`);
        li.classList.add("fade-out");

        setTimeout(() => {
            tasks.splice(index, 1);
            renderTasks();
        }, 150);
    }
}

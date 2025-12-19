let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
    document.querySelectorAll(".column ul").forEach(ul => ul.innerHTML = "");

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.text;

        const controls = document.createElement("div");

        if (task.status !== "todo") {
            const left = document.createElement("button");
            left.textContent = "←";
            left.onclick = () => moveTask(task.id, -1);
            controls.appendChild(left);
        }

        if (task.status !== "completed") {
            const right = document.createElement("button");
            right.textContent = "→";
            right.onclick = () => moveTask(task.id, 1);
            controls.appendChild(right);
        }

        const del = document.createElement("button");
        del.type = "button";
        del.textContent = "x";

        del.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteTask(task.id);
        });
        
        controls.appendChild(del);

        li.appendChild(controls);

        document
            .querySelector(`.column[data-status="${task.status}"] ul`)
            .appendChild(li);
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Add Task */
document.getElementById("task-form").addEventListener("submit", e => {
    e.preventDefault();

    const input = document.getElementById("task-input");
    tasks.push({
        id: Date.now(),
        text: input.value,
        status: "todo"    
    });

    input.value = "";
    renderTasks();
});

/* Move and Delete */
const statuses = ["todo", "in-progress", "completed"];

function moveTask(id, direction) {
    const task = tasks.find(t => t.id === id);
    const index = statuses.indexOf(task.status);
    task.status = statuses[index + direction];
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}
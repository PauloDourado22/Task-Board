/* ---Initialization--- */
const statuses = ["todo", "in-progress", "completed"];

// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render tasks on page load
renderTasks();

/* ---Render Tasks Function--- */
function renderTasks() {
    console.log("renderTasks called", tasks);
    // Clear all lists first
    document.querySelectorAll(".column ul").forEach(ul => ul.innerHTML = "");

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.id = task.id;

        li.style.opacity = 0; // start invisible
        setTimeout(() => { li.style.opacity = 1; }, 10);

        // Task text
        const taskTextNode = document.createTextNode(task.text);
        li.appendChild(taskTextNode);

        // Details container
        const details = document.createElement("div");
        details.className = "task-details hidden"

        // Only add date/time if task is scheduled
        if (task.scheduled) {
            const meta = document.createElement("small");
            meta.className = "task-date";
            const date = new Date(task.dueAt);
            meta.textContent = `Scheduled for: ${date.toLocaleString()}`;

            details.appendChild(meta);
        }

        li.appendChild(details);

        // Completed style
        if (task.status === "completed") li.classList.add("completed");

        // Controls container
        const controls = document.createElement("div");

        // Complete button (only for to Do tasks)
        if (task.status === "todo") {
            const complete = document.createElement("button");
            complete.type = "button";
            complete.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
            complete.classList.add("btn-complete");
            complete.title = "Complete task";

            complete.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                completeTask(task.id);
            });

            controls.appendChild(complete);
        }

        // Left button
        if (task.status !== "todo") {
            const left = document.createElement("button");
            left.type = "button";
            left.innerHTML = '<i class="fa-solid fa-circle-left"></i>';
            left.classList.add("btn-move-left");
            
            left.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();
                moveTask(task.id, -1);
            });
            controls.appendChild(left);
        }

        // Right button
        if (task.status !== "completed") {
            const right = document.createElement("button");
            right.type = "button";
            right.innerHTML = '<i class="fa-solid fa-circle-right"></i>';
            right.classList.add("btn-move-right");
            
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
        del.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
        del.classList.add("btn-delete");
        
        del.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            deleteTask(task.id);
        });
        controls.appendChild(del);

        // Expand button
        const expand = document.createElement("button");
        expand.type = "button";
        expand.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
        expand.classList.add("btn-expand");

        expand.addEventListener("click", e => {
            e.stopPropagation();
            details.classList.toggle("hidden");
            details.classList.toggle("open");
        });

        controls.appendChild(expand);

        li.appendChild(controls);

        // Append task to correct column
        document.querySelector(`.column[data-status="${task.status}"] ul`).appendChild(li);
    });

    // Save tasks
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ---Add Normal Task--- */
document.getElementById("task-form").addEventListener("submit", e => {
    e.preventDefault();

    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if (!taskText) return;

    tasks.push({
        id: Date.now(),
        text: taskText,
        status: "todo",
        dueAt: new Date().toISOString(),
        scheduled: false
    });

    input.value = "";
    renderTasks();
});

/* ---Toggle Schedule Input--- */
document.getElementById("show-schedule").addEventListener("click", e => {
    e.preventDefault();
    const container = document.getElementById("schedule-container");
    
    if (container.style.display === "none") {
        container.style.display = "flex";

        // datetime input focus
        const dateInput = document.getElementById("task-datetime");
        dateInput.focus();
    } else {
        container.style.display = "none";
    }
});

/* ---Add Scheduled Task--- */
document.getElementById("add-task-scheduled").addEventListener("click", e => {
    e.preventDefault();

    const input = document.getElementById("task-input");
    const taskText = input.value.trim();
    if (!taskText) return;

    const dateInput = document.getElementById("task-datetime");
    if (!scheduledDate) {
        alert("Please pick a date/time to schedule the task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        status: "todo",
        dueAt: scheduledDate.toISOString(),
        scheduled: true
    });

    // Clear inputs and hide datetime picker
    input.value = "";
    scheduledDate = null;
    document.getElementById("schedule-container").style.display = "none";

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

/* --- Complete Task --- */
function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.status = "completed";
    renderTasks();
} 

/* --- Delete Task --- */
function deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        const li = document.querySelector(`li[data-id="${id}"]`);
        li.classList.add("fade-out");

        setTimeout(() => {
            tasks.splice(index, 1);
            renderTasks();
        }, 150);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    flatpickr("#task-datetime-calendar", {
        inline: true,       // show full calendar immediately
        enableTime: true,   // include time selector
        dateFormat: "Y-m-d H:i",
        onChange: function(selectedDates) {
            scheduledDate = selectedDates[0];
        }
    });
});

/* --- Toggle Dark Mode --- */
const toggleBtn = document.getElementById("toggle-theme");
if (toggleBtn) {
    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark");

    updateThemeIcon(document.body.classList.contains("dark"));

    toggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateThemeIcon(isDark);
    });
}

/* --- Update theme icon --- */
function updateThemeIcon(isDark) {
    const icon = document.querySelector("#toggle-theme i");
    if (!icon) return;
    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
}
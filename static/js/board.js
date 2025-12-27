document.addEventListener("DOMContentLoaded", () => {

    const board = document.querySelector(".board");
    if (!board) return; // 🔒 prevents running on login/signup pages

    /* ===============================
       State
    =============================== */
    const statuses = ["todo", "in-progress", "completed"];
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let scheduledDate = null;

    /* ===============================
       Render
    =============================== */
    function renderTasks() {
        document.querySelectorAll(".column ul").forEach(ul => ul.innerHTML = "");

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.dataset.id = task.id;
            li.textContent = task.text;

            if (task.status === "completed") {
                li.classList.add("completed");
            }

            const details = document.createElement("div");
            details.className = "task-details hidden";

            if (task.scheduled) {
                const date = new Date(task.dueAt);
                const meta = document.createElement("small");
                meta.className = "task-date";
                meta.textContent = `Scheduled for: ${date.toLocaleString()}`;
                details.appendChild(meta);
            }

            li.appendChild(details);

            const controls = document.createElement("div");

            if (task.status === "todo") {
                const complete = createButton("btn-complete", "fa-circle-check", () => {
                    task.status = "completed";
                    renderTasks();
                });
                controls.appendChild(complete);
            }

            if (task.status !== "todo") {
                controls.appendChild(
                    createButton("btn-move-left", "fa-circle-left", () => moveTask(task, -1))
                );
            }

            if (task.status !== "completed") {
                controls.appendChild(
                    createButton("btn-move-right", "fa-circle-right", () => moveTask(task, 1))
                );
            }

            controls.appendChild(
                createButton("btn-delete", "fa-trash-can", () => deleteTask(task.id))
            );

            controls.appendChild(
                createButton("btn-expand", "fa-ellipsis", () => {
                    details.classList.toggle("hidden");
                })
            );

            li.appendChild(controls);

            document
                .querySelector(`.column[data-status="${task.status}"] ul`)
                .appendChild(li);
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function createButton(className, icon, handler) {
        const btn = document.createElement("button");
        btn.className = className;
        btn.innerHTML = `<i class="fa-solid ${icon}"></i>`;
        btn.addEventListener("click", e => {
            e.stopPropagation();
            handler();
        });
        return btn;
    }

    function moveTask(task, dir) {
        const idx = statuses.indexOf(task.status);
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < statuses.length) {
            task.status = statuses[newIdx];
            renderTasks();
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }

    /* ===============================
       Form
    =============================== */
    const form = document.getElementById("task-form");
    if (form) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const input = document.getElementById("task-input");
            const text = input.value.trim();
            if (!text) return;

            tasks.push({
                id: Date.now(),
                text,
                status: "todo",
                scheduled: false,
                dueAt: new Date().toISOString()
            });

            input.value = "";
            renderTasks();
        });
    }

    document.getElementById("show-schedule")?.addEventListener("click", () => {
        const container = document.getElementById("schedule-container");
        container.style.display =
            container.style.display === "none" ? "flex" : "none";
    });

    document.getElementById("add-task-scheduled")?.addEventListener("click", () => {
        const input = document.getElementById("task-input");
        if (!input.value || !scheduledDate) return;

        tasks.push({
            id: Date.now(),
            text: input.value.trim(),
            status: "todo",
            scheduled: true,
            dueAt: scheduledDate.toISOString()
        });

        scheduledDate = null;
        input.value = "";
        document.getElementById("schedule-container").style.display = "none";
        renderTasks();
    });

    /* ===============================
       Calendar
    =============================== */
    const calendar = document.getElementById("task-datetime-calendar");
    if (calendar) {
        flatpickr(calendar, {
            inline: true,
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            onChange: dates => {
                scheduledDate = dates[0];
            }
        });
    }

    renderTasks();
});

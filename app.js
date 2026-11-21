// ===== Data (localStorage keys are unchanged) =====
let tasks = JSON.parse(localStorage.getItem('userTasksList')) || [];
let currentFilter = 'all';
let lastAddedId = null;   // naya task jis ki animation chalani hai

function saveTasks() {
    localStorage.setItem('userTasksList', JSON.stringify(tasks));
}

// task text user ne likha hai, isko safe banane ke liye
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Success popup (toast) =====
function showToast(title, message) {
    const wrap = document.getElementById('toast-wrap');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span class="toast-icon">&#10003;</span><div><strong>' + escapeHTML(title) +
        '</strong><small>' + escapeHTML(message) + '</small></div>';
    wrap.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('out');
        setTimeout(function () { toast.remove(); }, 300);
    }, 2600);
}

// counter badalne par chhota sa bump
function setCounter(id, value) {
    const el = document.getElementById(id);
    if (el.innerText !== String(value)) {
        el.innerText = value;
        el.classList.remove('bump');
        void el.offsetWidth;          // animation dobara chalane ke liye
        el.classList.add('bump');
    }
}

// ===== Page load =====
window.addEventListener('DOMContentLoaded', function () {
    const storedName = localStorage.getItem('Username');

    if (storedName) {
        document.getElementById('display-name').innerText = 'Hello, ' + storedName + '!';
        document.getElementById('name-avatar').innerText = storedName.charAt(0).toUpperCase();
    }

    // sidebar filters
    document.querySelectorAll('.nav-item').forEach(function (btn) {
        btn.addEventListener('click', function () {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.nav-item').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderTasks();
        });
    });

    // Enter dabane se bhi task add ho
    document.getElementById('add-task').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') addTask();
    });

    renderTasks();
});

// ===== Add =====
function addTask() {
    const taskText = document.getElementById('add-task').value.trim();
    const prioritySelect = document.getElementById('select-priority').value.trim();
    const taskDate = document.getElementById('task-date').value;

    if (taskText === "") {
        alert("Please enter a task description!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        priority: prioritySelect.replace("priority:", "").trim(),
        date: taskDate || "No Due Date",
        status: "Pending"
    };

    tasks.push(newTask);
    lastAddedId = newTask.id;
    saveTasks();

    document.getElementById('add-task').value = "";
    document.getElementById('task-date').value = "";

    renderTasks();
    showToast("Task added successfully!", taskText);
}

// ===== Show =====
function renderTasks() {
    const listContainer = document.getElementById('task-list-container');
    listContainer.innerHTML = "";

    let total = tasks.length;
    let completed = 0;
    let pending = 0;
    let important = 0;

    // counters hamesha saare tasks ke hote hain
    tasks.forEach(function (task) {
        if (task.status === "Completed") completed++; else pending++;
        if (task.priority.toLowerCase() === "high") important++;
    });

    // list filter ke hisab se
    const titles = { all: "All Tasks", completed: "Completed", pending: "Pending", important: "Important" };
    document.getElementById('list-title').innerText = titles[currentFilter];

    const visible = tasks.filter(function (task) {
        if (currentFilter === 'completed') return task.status === "Completed";
        if (currentFilter === 'pending') return task.status !== "Completed";
        if (currentFilter === 'important') return task.priority.toLowerCase() === "high";
        return true;
    });

    if (visible.length === 0) {
        listContainer.innerHTML = '<div class="empty">' +
            (tasks.length === 0 ? "No tasks yet. Add your first task above." : "No tasks in this list.") +
            '</div>';
    }

    visible.forEach(function (task) {
        const isDone = task.status === "Completed";
        const p = task.priority.toLowerCase();
        const edgeColor = p === "high" ? "var(--high)" : p === "medium" ? "var(--medium)" : "var(--low)";

        listContainer.innerHTML += `
            <div class="task-row ${task.id === lastAddedId ? 'new' : ''}" style="--edge: ${edgeColor};">
                <div class="task-main">
                    <button class="check ${isDone ? 'on' : ''}" onclick="toggleTaskStatus(${task.id})"
                        aria-label="${isDone ? 'Mark as pending' : 'Mark as completed'}">&#10003;</button>
                    <div>
                        <div class="task-text ${isDone ? 'done' : ''}">${escapeHTML(task.text)}</div>
                        <div class="task-meta">Due: ${escapeHTML(task.date)} &nbsp;|&nbsp; Priority: <strong>${escapeHTML(task.priority)}</strong></div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="icon-btn edit" onclick="editTaskItem(${task.id})">Edit</button>
                    <button class="icon-btn del" onclick="deleteTaskItem(${task.id})">Delete</button>
                </div>
            </div>
        `;
    });

    lastAddedId = null;   // animation sirf ek dafa chalay

    setCounter('total-counter', total);
    setCounter('completed-counter', completed);
    setCounter('pending-counter', pending);
    setCounter('important-counter', important);
}

// ===== Edit =====
function editTaskItem(id) {
    const taskToEdit = tasks.find(function (task) { return task.id === id; });

    if (taskToEdit) {
        const newText = prompt("Edit your task description:", taskToEdit.text);

        if (newText !== null && newText.trim() !== "") {
            taskToEdit.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}   // <-- original code mein ye closing bracket missing thi, isi wajah se toggle/delete kaam nahi kartay thay

// ===== Complete / Pending =====
function toggleTaskStatus(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) {
            task.status = task.status === "Pending" ? "Completed" : "Pending";
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

// ===== Delete =====
function deleteTaskItem(id) {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    renderTasks();
}
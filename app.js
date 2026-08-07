
window.addEventListener('DOMContentLoaded', function () {

    let storedName = localStorage.getItem('Username');

    if (storedName) {
        document.getElementById('display-name').innerText = storedName;

        let firstLetter = storedName.charAt(0).toUpperCase();

        document.getElementById('name-avatar').innerText = firstLetter;
    }
});


    // LocalStorage se data load karna ya khali array banana
    let tasks = JSON.parse(localStorage.getItem('userTasksList')) || [];

    // Page open hote hi purane tasks aur counters screen par lana
    window.addEventListener('DOMContentLoaded', () => {
        renderTasks();
    });

    // 1. Naya Task Add karne ka function
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
        localStorage.setItem('userTasksList', JSON.stringify(tasks));

        document.getElementById('add-task').value = "";
        document.getElementById('task-date').value = "";

        renderTasks();
    }

    // 2. Tasks aur Counters update karne ka core function
    function renderTasks() {
        const listContainer = document.getElementById('task-list-container');
        listContainer.innerHTML = ""; 

        let total = tasks.length;
        let completed = 0;
        let pending = 0;
        let important = 0;

        tasks.forEach(task => {
            if (task.status === "Completed") {
                completed++;
            } else {
                pending++;
            }
            
            if (task.priority.toLowerCase() === "high") {
                important++;
            }

            let statusIcon = task.status === "Completed" ? "✅" : "⚪";
            let lineThrough = task.status === "Completed" ? "text-decoration: line-through; color: gray;" : "";
            let edgeColor = task.priority.toLowerCase() === "high" ? "red" : task.priority.toLowerCase() === "medium" ? "orange" : "blue";

            // Row HTML: Edit button (✏️) ke sath update kar di hai
            const rowHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 15px; margin-top: 10px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 6px solid ${edgeColor};">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <span style="cursor: pointer; font-size: 20px;" onclick="toggleTaskStatus(${task.id})">${statusIcon}</span>
                        <div>
                            <span style="${lineThrough} font-size: large; font-weight: 500;">${task.text}</span>
                            <br><small style="color: gray;">Due: ${task.date} | Priority: <strong style="color:${edgeColor};">${task.priority}</strong></small>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <!-- ✏️ EDIT BUTTON -->
                        <button onclick="editTaskItem(${task.id})" style="background: none; border: none; color: #8000ff; cursor: pointer; font-size: 16px;">✏️ Edit</button>
                        <!-- 🗑️ DELETE BUTTON -->
                        <button onclick="deleteTaskItem(${task.id})" style="background: none; border: none; color: red; cursor: pointer; font-size: 16px;">🗑️ Delete</button>
                    </div>
                </div>
            `;
            listContainer.innerHTML += rowHTML;
        });

        document.getElementById('total-counter').innerText = total;
        document.getElementById('completed-counter').innerText = completed;
        document.getElementById('pending-counter').innerText = pending;
        document.getElementById('important-counter').innerText = important;
    }

    // 3. Task Edit karne ka function
    function editTaskItem(id) {
        // Pehle array me se target task dhoondhein
        const taskToEdit = tasks.find(task => task.id === id);
        
        if (taskToEdit) {
            // Prompt box khol kar purana text pehle se likha hua dikhana
            const newText = prompt("Edit your task description:", taskToEdit.text);
            
            // Agar user cancel na kare aur kuch likhe, tabhi update karein
            if (newText !== null && newText.trim() !== "") {
                taskToEdit.text = newText.trim();
                localStorage.setItem('userTasksList', JSON.stringify(tasks));
                renderTasks(); // Screen par naya naam show karna
            }
        }
    }

    // 4. Task complete karne ka toggle mechanics
    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.status = task.status === "Pending" ? "Completed" : "Pending";
            }
            return task;
        });
        localStorage.setItem('userTasksList', JSON.stringify(tasks));
        renderTasks();
    }

    // 5. Task delete karne ki mechanism
    function deleteTaskItem(id) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('userTasksList', JSON.stringify(tasks));
        renderTasks();
    }


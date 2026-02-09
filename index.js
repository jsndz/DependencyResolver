export const tasks = [];
export const dependencies = [];

const taskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("task");
const taskList = document.getElementById("taskList");

const taskASelect = document.getElementById("taskA");
const taskBSelect = document.getElementById("taskB");
const addDepBtn = document.getElementById("addDependency");
const depLabel = document.getElementById("dependencyLabel");

taskBtn.onclick = function () {
    const t = taskInput.value.trim();
    if (t === "") return;

    tasks.push(t);
    taskInput.value = "";
    renderTasks();
    updateDropdowns();
};

function updateDropdowns() {
    taskASelect.innerHTML = "";
    taskBSelect.innerHTML = "";

    tasks.forEach((task, i) => {
        const optA = new Option(task, i);
        const optB = new Option(task, i);
        taskASelect.add(optA);
        taskBSelect.add(optB);
    });
}

addDepBtn.onclick = function () {
    const a = taskASelect.value;
    const b = taskBSelect.value;

    if (a === b) return;

    dependencies.push({ from: a, to: b });

    depLabel.textContent =
        `Task "${tasks[b]}" depends on "${tasks[a]}"`;

    renderTasks();
};

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task;

        

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "x";
        removeBtn.onclick = function () {
            tasks.splice(index, 1);

            for (let i = dependencies.length - 1; i >= 0; i--) {
                if (dependencies[i].from == index ||
                    dependencies[i].to == index) {
                    dependencies.splice(i, 1);
                }
            }

            renderTasks();
            updateDropdowns();
        };

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    });
}
const taskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("task");
const taskList = document.getElementById("taskList");

const taskASelect = document.getElementById("taskA");
const taskBSelect = document.getElementById("taskB");
const addDepBtn = document.getElementById("addDependency");
const checkDepBtn = document.getElementById("run");
const depLabel = document.getElementById("dependencyLabel");
const orderList = document.getElementById("order");

const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const pathList = document.getElementById("path");
const checkDisBtn = document.getElementById("checkDis");

const cycle = document.getElementById("cycle");

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  return res.json();
}

async function reload() {
  const tasks = await api("/api/tasks");
  renderTasks(tasks);
  updateDropdowns(tasks);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t.task;

    const btn = document.createElement("button");
    btn.textContent = "x";
    btn.onclick = async () => {
      await fetch(`/api/task/${t.id}`, { method: "DELETE" });
      reload();
    };

    li.appendChild(btn);
    taskList.appendChild(li);
  });
}

function updateDropdowns(tasks) {
  [taskASelect, taskBSelect, fromSelect, toSelect].forEach(
    (el) => (el.innerHTML = "")
  );

  tasks.forEach((t) => {
    taskASelect.add(new Option(t.task, t.id));
    taskBSelect.add(new Option(t.task, t.id));
    fromSelect.add(new Option(t.task, t.id));
    toSelect.add(new Option(t.task, t.id));
  });
}

taskBtn.onclick = async () => {
  const task = taskInput.value.trim();
  if (!task) return;

  await api("/api/task", {
    method: "POST",
    body: JSON.stringify({ task }),
  });

  taskInput.value = "";
  reload();
};
addDepBtn.onclick = async () => {
  const from = taskASelect.value;
  const to = taskBSelect.value;
  if (from === to) return;

  await api("/api/dependency", {
    method: "POST",
    body: JSON.stringify({ from, to }),
  });

  depLabel.textContent = "Dependency added ✔";
};  

checkDepBtn.onclick = async () => {
  orderList.innerHTML = "";
  const res = await api("/api/order");
  console.log(res);
  
  if (res.ok) {
    res.order.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t; 
      orderList.appendChild(li);
    });
  } else {
    cycle.innerText = "Cycle Detected"
    res.cycle.forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      orderList.appendChild(li);
    });
    
  }
};

checkDisBtn.onclick = async () => {
  pathList.innerHTML = "";

  const from = fromSelect.value;
  const to = toSelect.value;

  const path = await api(`/api/path?from=${from}&to=${to}`);

  path.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    pathList.appendChild(li);
  });
};

reload();


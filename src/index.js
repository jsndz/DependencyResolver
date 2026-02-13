const tasks = [];
const dependencies = [];

const taskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("task");
const taskList = document.getElementById("taskList");

const taskASelect = document.getElementById("taskA");
const taskBSelect = document.getElementById("taskB");
const addDepBtn = document.getElementById("addDependency");
const checkDepFtn = document.getElementById("run");
const depLabel = document.getElementById("dependencyLabel");
const order = document.getElementById("order");

const from = document.getElementById("from");
const to = document.getElementById("to");
const path = document.getElementById("path");
const checkDis = document.getElementById("checkDis");

taskBtn.onclick = function () {
  const t = taskInput.value.trim();
  if (t === "") return;

  tasks.push({ task: t, id: crypto.randomUUID() });
  taskInput.value = "";
  renderTasks();
  updateDropdowns();
};

checkDepFtn.onclick = function () {
  const dep = DependencyResolver(dependencies, tasks);
  console.log(dep);
  dep.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerText = task;
    order.appendChild(li);
  });
};

checkDis.onclick = function () {
  const p = CheckDistance();
  p.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerText = task;
    path.appendChild(li);
  });
}

function updateDropdowns() {
  taskASelect.innerHTML = "";
  taskBSelect.innerHTML = "";
  from.innerHTML = "";
  to.innerHTML = "";
  tasks.forEach((task) => {
    const optA = new Option(task.task, task.id);
    const optB = new Option(task.task, task.id);
    taskASelect.add(optA);
    taskBSelect.add(optB);
    const fromOpt = new Option(task.task, task.id);
    const toOpt = new Option(task.task, task.id);
    from.add(fromOpt);
    to.add(toOpt);
  });
}

addDepBtn.onclick = function () {
  const a = taskASelect.value;
  const b = taskBSelect.value;

  if (a === b) return;

  dependencies.push({ from: a, to: b });

  depLabel.textContent = `Task "${tasks.find((t) => t.id === b).task}"
         depends on
         "${tasks.find((t) => t.id === a).task}"`;
};
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.task;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "x";
    removeBtn.onclick = function () {
      const removedId = task.id;

      tasks.splice(index, 1);

      for (let i = dependencies.length - 1; i >= 0; i--) {
        if (
          dependencies[i].from === removedId ||
          dependencies[i].to === removedId
        ) {
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

function BuildAL(dependencies, tasks, idToIndex) {
  const al = Array.from({ length: tasks.length }, () => []);

  dependencies.forEach((dep) => {
    const a = idToIndex.get(dep.from);
    const b = idToIndex.get(dep.to);
    al[a].push(b);
  });

  return al;
}
function toposort(al) {
  const q = new Queue();
  const ans = [];
  const indegree = Array(al.length).fill(0);
  let count = 0;
  for (const neighbours of al) {
    for (const neighbour of neighbours) {
      indegree[neighbour]++;
    }
  }
  for (let i = 0; i < indegree.length; i++) {
    if (indegree[i] === 0) q.push(i);
  }
  while (!q.empty()) {
    let node = q.front();
    q.pop();
    ans.push(node);
    count++;
    for (let neighbour of al[node]) {
      indegree[neighbour]--;
      if (indegree[neighbour] == 0) {
        q.push(neighbour);
      }
    }
  }
  if (count != al.length) {
    return [];
  }
  return ans;
}

function DependencyResolver(dependencies, tasks) {
  const idToIndex = new Map();

  tasks.forEach((t, i) => idToIndex.set(t.id, i));
  const al = BuildAL(dependencies, tasks, idToIndex);
  const order = toposort(al);
  return order.map((o) => {
    return tasks[o].task;
  });
}

function CheckDistance() {
  const a = from.value;
  const b = to.value;
  const idToIndex = new Map();
  tasks.forEach((t, i) => {
    idToIndex.set(t.id, i);
  });
  const srcIndex = idToIndex.get(a);
  const destIndex = idToIndex.get(b);
  const al = BuildAL(dependencies, tasks, idToIndex);
  const path = BFS(al, srcIndex, destIndex);
  console.log(path);
  return path.map((p,i)=>{
    return tasks[p].task;
  })
}


function BFS(al, src, dest) {
  let vis = Array(al.length).fill(0);
  let q = new Queue();
  let parent  = Array(al.length).fill(-1);
  q.push({ node: src, dis: 1 });
  vis[src]=1;
  while (!q.empty()) {
    let obj = q.front();
    q.pop();
    if (obj.node == dest) {
      break;
    }

    
    for (let neighbour of al[obj.node]) {
      if (vis[neighbour] == 0) {
        vis[neighbour] = 1;
        parent[neighbour] = obj.node;
        q.push({ node: neighbour, dis: obj.dis +1 });
      }
    }
  }

  if(vis[dest]==0) return [];

  const path =[];
  let index = dest;
 
  while(index !=-1){
    path.push(index)
    index = parent[index]
    
  }
  return path.reverse();
}

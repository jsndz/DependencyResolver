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
  
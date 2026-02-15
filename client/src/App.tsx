import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import AnalysisPage from "./pages/AnalysisPage";
import ExecutionPage from "./pages/ExecutionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="analysis" element={<AnalysisPage />} />
        <Route path="execution" element={<ExecutionPage />} />
      </Route>
    </Routes>
  );
}

export default App;

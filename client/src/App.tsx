import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import AnalysisPage from "./pages/AnalysisPage";
import {ExecutionPage} from "./pages/ExecutionPage";
import { ReportPage } from "./pages/ReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tasks" element={<TasksPage />} />

        <Route path="/analysis" element={<AnalysisPage />} />
   
      <Route path="/execution" element={<ExecutionPage />} />
      <Route path="/report" element={<ReportPage />} />
    </Routes>
  );
}

export default App;

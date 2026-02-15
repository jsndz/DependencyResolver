import { Outlet, NavLink } from "react-router-dom";
import { Workflow, LayoutDashboard, ListTodo, BarChart3, BarChart4, ExternalLink } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function Layout() {
  const { error } = useAppStore();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Workflow className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Workflow Dependency Engine</h1>
              <p className="text-sm text-gray-600">
                Visualize and analyze task dependencies
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutDashboard size={18} />
              Home
            </NavLink>
            <NavLink to="/tasks" className={navLinkClass}>
              <ListTodo size={18} />
              Tasks
            </NavLink>
            <NavLink to="/analysis" className={navLinkClass}>
              <BarChart3 size={18} />
              Analysis
            </NavLink>
            <NavLink to="/execution" className={navLinkClass}>
              <ExternalLink size={18} />
              Execution
            </NavLink>
          </nav>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

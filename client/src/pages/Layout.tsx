import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, ListTodo, BarChart3, ExternalLink } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { cn } from "../components/lib/utils";

export default function Layout() {
  const { error } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-16 border-b bg-background flex-shrink-0">
        <div className="mx-auto max-w-7xl h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" className="h-8 w-8" />
            <div className="leading-tight">
              <div className="font-semibold">Orchestra</div>
              <div className="text-xs text-muted-foreground">Workflow Engine</div>
            </div>
          </div>

          <nav className="flex gap-1">
            <NavItem to="/" icon={LayoutDashboard}>Home</NavItem>
            <NavItem to="/tasks" icon={ListTodo}>Tasks</NavItem>
            <NavItem to="/analysis" icon={BarChart3}>Analysis</NavItem>
            <NavItem to="/execution" icon={ExternalLink}>Execution</NavItem>
          </nav>
        </div>
      </header>

      {error && (
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      {/* This fills the rest of the screen */}
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-7xl h-full px-6 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon: Icon, children }: any) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}

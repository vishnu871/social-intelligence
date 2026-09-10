import {
  LayoutDashboard,
  CalendarDays,
  MessageCircle,
  ClipboardCheck,
  Sparkles,
  Settings,
} from "lucide-react";

export default function Sidebar({
  activePage,
  setActivePage,
}) {
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "calendar",
      label: "Weekly Calendar",
      icon: CalendarDays,
    },
    {
      id: "intelligence",
      label: "Ask Intelligence",
      icon: MessageCircle,
    },
    {
      id: "approval",
      label: "Approval",
      icon: ClipboardCheck,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">Z</div>

        <div className="brand-copy">
          <div className="brand-name">
            Zuva Life
          </div>

          <div className="brand-subtitle">
            Social Intelligence
          </div>
        </div>
      </div>

      <div className="sidebar-section-title">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${
                activePage === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(item.id)
              }
            >
              <Icon
                size={18}
                strokeWidth={1.8}
              />

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="nav-item"
        >
          <Sparkles
            size={18}
            strokeWidth={1.8}
          />

          <span>Intelligence Engine</span>
        </button>

        <button
          type="button"
          className="nav-item"
        >
          <Settings
            size={18}
            strokeWidth={1.8}
          />

          <span>Settings</span>
        </button>

        <div className="sidebar-status">
          <div className="status-dot" />

          <div className="sidebar-status-copy">
            <strong>Engine connected</strong>

            <small>
              Cell 83 production data
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}
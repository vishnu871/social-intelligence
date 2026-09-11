import React from "react";
import {
  CalendarDays,
  ClipboardCheck,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Sparkles,
} from "lucide-react";

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

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">Z</div>

        <div className="brand-copy">
          <div className="sidebar-brand-mark">Zuva Life</div>
          <div className="sidebar-brand-subtitle">
            Social Intelligence
          </div>
        </div>
      </div>

      <div className="sidebar-section-label">Workspace</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-button ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-tools">
        <button
          type="button"
          className="sidebar-tool"
          onClick={() => onNavigate("intelligence")}
        >
          <Sparkles size={17} />
          <span>Intelligence Engine</span>
        </button>

        <button type="button" className="sidebar-tool">
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span>Engine connected</span>
        </div>

        <div className="sidebar-data-status">
          Cell 83 production data
        </div>
      </div>
    </aside>
  );
}
import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  MessageCircle,
  ClipboardCheck,
  Sparkles,
  Settings,
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

export default function Sidebar({
  activePage,
  onNavigate,
}) {
  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          Z
        </div>

        <div className="sidebar-brand-copy">
          <div className="sidebar-brand-title">
            Zuva Life
          </div>

          <div className="sidebar-brand-subtitle">
            SOCIAL INTELLIGENCE
          </div>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="sidebar-section-label">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-nav-item ${
                isActive
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onNavigate(item.id)
              }
            >
              <Icon
                size={19}
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* SIDEBAR SECONDARY */}
      <div className="sidebar-bottom">
        <div className="sidebar-secondary">
          <button
            type="button"
            className="sidebar-nav-item sidebar-secondary-item"
          >
            <Sparkles
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <span>
              Intelligence Engine
            </span>
          </button>

          <button
            type="button"
            className="sidebar-nav-item sidebar-secondary-item"
          >
            <Settings
              size={19}
              strokeWidth={1.9}
              aria-hidden="true"
            />

            <span>
              Settings
            </span>
          </button>
        </div>

        {/* ENGINE STATUS */}
        <div className="sidebar-status">
          <span className="sidebar-status-dot" />

          <span className="sidebar-status-text">
            Engine connected
          </span>
        </div>

        <div className="sidebar-status-subtitle">
          Cell 83 production data
        </div>
      </div>
    </aside>
  );
}
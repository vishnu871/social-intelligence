import React from "react";
import {
  Bell,
  Search,
  Upload,
} from "lucide-react";

export default function Topbar({
  search,
  onSearchChange,
  onUpload,
  title = "Social Intelligence",
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        <div className="search-box">
          <Search size={18} className="search-icon" />

          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search recommendations..."
            aria-label="Search recommendations"
          />
        </div>

        <input
          id="cell83-upload"
          type="file"
          accept=".csv,text/csv"
          className="hidden-file-input"
          onChange={onUpload}
        />

        <label
          htmlFor="cell83-upload"
          className="upload-button"
        >
          <Upload size={16} />
          <span>Load Cell 83 CSV</span>
        </label>

        <button
          type="button"
          className="topbar-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        <div className="avatar" aria-label="User">
          V
        </div>
      </div>
    </header>
  );
}
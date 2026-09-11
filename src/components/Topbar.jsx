import React, { useRef } from "react";
import {
  Search,
  Upload,
  Bell,
} from "lucide-react";

export default function Topbar({
  search,
  onSearchChange,
  onUpload,
  title = "Social Intelligence",
}) {
  const fileInputRef =
    useRef(null);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">
          {title}
        </h2>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <Search
            size={19}
            strokeWidth={1.8}
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value
              )
            }
            placeholder="Search recommendations..."
            aria-label="Search recommendations"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onUpload}
          className="hidden-file-input"
        />

        <button
          type="button"
          className="topbar-upload"
          onClick={handleUploadClick}
        >
          <Upload
            size={17}
            strokeWidth={1.9}
          />

          <span>
            Load Cell 83 CSV
          </span>
        </button>

        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Notifications"
        >
          <Bell
            size={18}
            strokeWidth={1.8}
          />
        </button>

        <div
          className="topbar-avatar"
          aria-label="User"
        >
          V
        </div>
      </div>
    </header>
  );
}
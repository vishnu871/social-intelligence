import {
  Bell,
  Search,
  Upload,
} from "lucide-react";

export default function Topbar({
  onUpload,
  searchValue,
  setSearchValue,
}) {
  return (
    <header className="topbar">
      <div className="search-box">
        <Search
          size={17}
          strokeWidth={1.8}
        />

        <input
          type="text"
          value={searchValue}
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
          placeholder="Search recommendations..."
          aria-label="Search recommendations"
        />
      </div>

      <div className="topbar-actions">
        <label className="upload-button">
          <Upload
            size={16}
            strokeWidth={1.8}
          />

          <span>Load Cell 83 CSV</span>

          <input
            type="file"
            accept=".csv,text/csv"
            onChange={onUpload}
            hidden
          />
        </label>

        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell
            size={18}
            strokeWidth={1.8}
          />
        </button>

        <div
          className="user-avatar"
          title="Zuva Life workspace"
        >
          V
        </div>
      </div>
    </header>
  );
}
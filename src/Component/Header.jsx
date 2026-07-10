import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import "./Header.css";

export default function Header({ user = {} }) {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">

      {/* Left: User Info */}
      <div className="user-info">
        <div className="avatar">
          {/* Replace with <img src={user.avatar} alt={user.name} /> when available */}
          {user.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <span>{user.name?.charAt(0).toUpperCase() ?? "A"}</span>
          }
        </div>
        <div className="greeting">
          <div className="greeting-sub">Good morning 👋</div>
          <div className="greeting-name">{user.name ?? "Alajo"}</div>
        </div>
      </div>

      {/* Center: Create Ajo Group (hidden on mobile) */}
      <button
        className="create-btn"
        onClick={() => navigate("/dashboard/alajo/groups/create")}
      >
        <Icon name="plus" size={16} color="#fff" />
        Create Ajo Group
      </button>

      {/* Right: Bell */}
      <div className="header-right">
        <button className="bell-btn" onClick={() => { /* TODO: open notifications */ }}>
          <Icon name="bell" size={18} color="#6b7280" />
        </button>
      </div>
    </header>
  );
}
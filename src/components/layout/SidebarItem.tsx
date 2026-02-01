import { NavLink } from "react-router-dom";
import "./styles/sidebarItem.css";

type SidebarItemProps = {
  icon: string;
  label: string;
  href?: string;
};

export function SidebarItem({ icon, label, href }: SidebarItemProps) {
  return (
    <NavLink
      to={href ?? "#"}
      className={({ isActive }) => `sbItem ${isActive ? "active" : ""}`}
      aria-label={label}
    >
      <span className="sbIcon" aria-hidden="true">
        {icon}
      </span>

      <span className="sbLabel">{label}</span>

      <span className="sbTooltip" role="tooltip">
        {label}
      </span>
    </NavLink>
  );
}

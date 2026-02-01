import type { MenuOption } from "./menuOptions";

type SidebarSubmenuProps = {
  item: MenuOption;
  label: string;
  level: number;
  isOpen: boolean;
  onToggle: (key: string) => void;
  renderChild: (child: MenuOption, level: number) => React.ReactNode;
};

export function SidebarSubmenu({
  item,
  label,
  level,
  isOpen,
  onToggle,
  renderChild,
}: SidebarSubmenuProps) {
  return (
    <div className="sbGroup">
      <button
        type="button"
        className={`sbItem sbGroupBtn ${isOpen ? "open" : ""}`}
        onClick={() => onToggle(item.key)}
        aria-expanded={isOpen}
        style={{ paddingLeft: 10 + level * 12 }}
      >
        <span className="sbIcon" aria-hidden="true">
          {item.icon}
        </span>

        <span className="sbLabel">{label}</span>

        {/* caret */}
        <span className="sbCaret" aria-hidden="true">
          {isOpen ? "▾" : "▸"}
        </span>

        <span className="sbTooltip" role="tooltip">
          {label}
        </span>
      </button>

      {isOpen && (
        <div className="sbChildren">
          {item.children?.map((c) => renderChild(c, level + 1))}
        </div>
      )}
    </div>
  );
}

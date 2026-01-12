import darkLogo from "../../assets/vp-logo-theme-dark.png";
import lightLogo from "../../assets/vp-logo-theme-light.png";

import { useTheme } from "../../theme/theme.store";

type ThemeLogoProps = {
  size?: number;
  alt?: string;
  className?: string;
};

export function ThemeLogo({ size, alt = "VP 360", className }: ThemeLogoProps) {
  const { theme } = useTheme();
  const src = theme === "dark" ? darkLogo : lightLogo;

  const width = size ? `${size}px` : "var(--vp-logo-width, 150px)";

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width, height: "auto", display: "block" }}
      draggable={false}
    />
  );
}

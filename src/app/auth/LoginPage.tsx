import { useState } from "react";
import { useAuth } from "../../auth/auth.store";
import "./styles/LoginPage.css";
import { useTranslation } from "react-i18next";
import { ThemeLogo } from "../../components/common/ThemeLogo";

export function LoginPage() {
  const { t } = useTranslation();

  const { login, attemptsLeft, lockedUntil } = useAuth();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Password123#");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const locked = lockedUntil ? Date.now() < lockedUntil : false;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(username, password);
      if (!res.ok) setError(res.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="loginLogo">
          <ThemeLogo size={150} alt="VP App logo" />
        </div>
        <div className="loginTitle">{t("login.title")}</div>
        <div className="loginSub">{t("login.subtitle")}</div>

        <form className="loginForm" onSubmit={onSubmit}>
          <label className="loginLabel">
            {t("login.username")}
            <input
              className="loginInput"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading || locked}
            />
          </label>

          <label className="loginLabel">
            {t("login.password")}
            <input
              className="loginInput"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading || locked}
            />
          </label>

          {error && <div className="loginError">{error}</div>}

          <button
            className="loginBtn"
            type="submit"
            disabled={loading || locked}
          >
            {loading ? t("login.validating") : t("login.enter")}
          </button>

          <div className="loginHint">
            {`${t("login.attemptsLeft")} ${attemptsLeft}`}
          </div>
        </form>
      </div>
    </div>
  );
}

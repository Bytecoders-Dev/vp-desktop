import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthUser, DemoCredential } from "./auth.types";
import { pbkdf2Hash, safeEqual } from "./auth.crypto";

type AuthState = {
  user: AuthUser | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;

  // seguridad / UX
  attemptsLeft: number;
  lockedUntil: number | null; // epoch ms
};

const AuthCtx = createContext<AuthState | null>(null);

const SESSION_KEY = "vp-auth-session";

// Credencial DEMO (puedes cambiar displayName/username).
// NOTA: genera salt/hash una vez con el snippet de abajo (te lo dejo más abajo).
const DEMO: DemoCredential = {
  username: "admin",
  displayName: "Administrador",
  saltB64: "xJEPenJtxapZFDt9G1cuSQ==",
  passwordHashB64: "eHbonXSxSBmaH+tytjL2OwdHH6uJqxv5PSWUVuCrNos=",
};

const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as AuthUser;

      if (parsed?.username && parsed?.displayName) {
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login: AuthState["login"] = async (username, password) => {
    const now = Date.now();
    if (lockedUntil && now < lockedUntil) {
      const s = Math.ceil((lockedUntil - now) / 1000);
      return {
        ok: false,
        error: `Demasiados intentos. Intenta de nuevo en ${s}s.`,
      };
    }

    // Validaciones mínimas
    if (!username.trim() || !password)
      return { ok: false, error: "Usuario y contraseña son requeridos." };

    // Solo demo local:
    if (username !== DEMO.username) {
      return failAttempt("Credenciales inválidas.");
    }

    const hash = await pbkdf2Hash(password, DEMO.saltB64);
    if (!safeEqual(hash, DEMO.passwordHashB64)) {
      return failAttempt("Credenciales inválidas.");
    }

    // OK
    const nextUser = { username: DEMO.username, displayName: DEMO.displayName };
    setUser(nextUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));

    setAttemptsLeft(MAX_ATTEMPTS);
    setLockedUntil(null);
    return { ok: true };
  };

  const failAttempt = (msg: string) => {
    setAttemptsLeft((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next === 0) setLockedUntil(Date.now() + LOCK_MS);
      return next === 0 ? MAX_ATTEMPTS : next;
    });
    return { ok: false as const, error: msg };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const value = useMemo(
    () => ({ user, login, logout, attemptsLeft, lockedUntil }),
    [user, attemptsLeft, lockedUntil]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

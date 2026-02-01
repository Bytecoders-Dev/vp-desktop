import { LoginPage } from "../app/auth/LoginPage";
import { useAuth } from "./auth.store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  return <>{children}</>;
}

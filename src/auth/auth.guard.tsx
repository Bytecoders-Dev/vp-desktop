import { useAuth } from "./auth.store";
import { LoginPage } from "../pages/LoginPage";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <LoginPage />;
  return <>{children}</>;
}

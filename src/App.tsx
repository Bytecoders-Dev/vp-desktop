import { AuthProvider } from "./auth/auth.store";
import { RequireAuth } from "./auth/auth.guard";
import { ThemeProvider } from "./theme/theme.store";
import { AppShell } from "./app/AppShell";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RequireAuth>
          <AppShell />
        </RequireAuth>
      </AuthProvider>
    </ThemeProvider>
  );
}

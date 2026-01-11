import { AuthProvider } from "./auth/auth.store";
import { RequireAuth } from "./auth/auth.guard";
import { ThemeProvider } from "./theme/theme.store";
import { AppShell } from "./app/AppShell";
import { useAutoUpdater } from "./updater/useAutoUpdater";

export default function App() {
  useAutoUpdater({ checkOnStart: true, askBeforeInstall: true });

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

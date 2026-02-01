import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/auth.store";
import { RequireAuth } from "./auth/auth.guard";
import { ThemeProvider } from "./theme/theme.store";
import { AppShell } from "./app/AppShell";
import { menuOptions } from "./components/layout/menuOptions";
import { routesFromMenu } from "./utils/routesFromMenu";
import { PrimeReactProvider } from "primereact/api";

export default function App() {
  const routes = routesFromMenu(menuOptions);

  return (
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <RequireAuth>
              <Routes>
                <Route path="/" element={<AppShell />}>
                  {routes.map((r) => (
                    <Route key={r.path} path={r.path} element={<r.element />} />
                  ))}
                </Route>
              </Routes>
            </RequireAuth>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

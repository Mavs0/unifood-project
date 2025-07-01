import "./App.css";
import AppRoutes from "./routes/AppRoutes";

import "primereact/resources/themes/saga-blue/theme.css";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { PrimeReactProvider } from "primereact/api";

import { ThemeProvider } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PrimeReactProvider>
          <AppRoutes />
        </PrimeReactProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;

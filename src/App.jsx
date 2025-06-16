import "./App.css";
import AppRoutes from "./routes/AppRoutes";

import "primereact/resources/themes/saga-blue/theme.css";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import { PrimeReactProvider } from "primereact/api";

import { ToastProvider } from "./components/toast/ToastContext";
import ToastContainer from "./components/toast/ToastContainer";

function App() {
  return (
    <PrimeReactProvider>
      <ToastProvider>
        <ToastContainer />
        <AppRoutes />
      </ToastProvider>
    </PrimeReactProvider>
  );
}

export default App;

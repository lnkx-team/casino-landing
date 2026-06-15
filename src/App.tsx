import { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [isPanel, setIsPanel] = useState(
    window.location.pathname.toLowerCase().includes("panel")
  );

  useEffect(() => {
    const onChange = () =>
      setIsPanel(window.location.pathname.toLowerCase().includes("panel"));
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return isPanel ? <AdminPanel /> : <LandingPage />;
}
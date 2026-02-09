import { Routes, Route } from "react-router-dom";
import Header from "./Header";

import Diurno from "../pages/Diurno";
import Vespertino from "../pages/Vespertino";
import Perfil from "../pages/Perfil";

const MainContent = () => {
  return (
    <main className="flex-1 p-8">
      <Header />

      <div className="h-full bg-white rounded-2xl shadow-sm p-6">
        <Routes>
          <Route path="/diurno" element={<Diurno />} />
          <Route path="/vespertino" element={<Vespertino />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Diurno />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;

import { Routes, Route } from "react-router-dom";
import Header from "./Header";

import SolicitarDias from "../pages/SolicitarDias";
import Perfil from "../pages/Perfil";
import DiasSolicitados from "../pages/DiasSolicitado";

const MainContent = () => {
  return (
    <main className="flex-1 p-8">
      <Header />

      <div className="h-fit bg-white rounded-2xl shadow-sm p-6">
        <Routes>
          <Route path="/solicitar" element={<SolicitarDias />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/dias" element={<DiasSolicitados />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<SolicitarDias />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;

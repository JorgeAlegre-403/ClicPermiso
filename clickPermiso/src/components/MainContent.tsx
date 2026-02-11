import { Routes, Route } from "react-router-dom";
import Header from "./Header";

import Diurno from "../pages/Diurno";
import Perfil from "../pages/Perfil";
import Dias from "../pages/Dias";

const MainContent = () => {
  return (
    <main className="flex-1 p-8">
      <Header />

      <div className="h-fit bg-white rounded-2xl shadow-sm p-6">
        <Routes>
          <Route path="/diurno" element={<Diurno />} />
          <Route path="/dias" element={<Dias />} />
          <Route path="/perfil" element={<Perfil />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Diurno />} />
        </Routes>
      </div>
    </main>
  );
};

export default MainContent;

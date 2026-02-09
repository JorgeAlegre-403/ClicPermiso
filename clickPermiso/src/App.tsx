import { BrowserRouter } from "react-router-dom";
import LeftMenu from "./components/LeftMenu";
import MainContent from "./components/MainContent";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-slate-100">
        <LeftMenu />
        <MainContent />
      </div>
    </BrowserRouter>
  );
}

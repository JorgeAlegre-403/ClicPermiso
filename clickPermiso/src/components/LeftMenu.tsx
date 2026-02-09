import Logo from "../assets/logo_albarregas.png";
import { NavLink } from "react-router-dom";
import { CiCalendar, CiCalendarDate } from "react-icons/ci";
import { VscAccount } from "react-icons/vsc";

const LeftMenu = () => {
    const clases = "flex items-center gap-2 px-3 py-2 rounded-lg active:bg-blue-400";

    return (
        <aside className="w-64 bg-white shadow-md px-4 py-6">
            <img src={Logo} alt="Logo_Albarregas" className="mb-4" />
            <hr />

            <div className="mb-8 mt-4">
                <h2 className="text-lg font-semibold text-slate-700">
                    I.E.S Albarragas
                </h2>
            </div>

            <nav className="flex flex-col gap-2 text-xl">
                <NavLink
                    to="/diurno" className={clases}>
                    <CiCalendarDate />
                    Sol. día diurno
                </NavLink>

                <NavLink to="/vespertino" className={clases}>
                    <CiCalendarDate />
                    Sol. día vespertino
                </NavLink>

                <NavLink to="/perfil" className={clases}>
                    <VscAccount />
                    Mi perfil
                </NavLink>

                <NavLink to="/dias" className={clases}>
                    <CiCalendar />
                    Mis días solicitados
                </NavLink>
            </nav>
        </aside>
    );
};

export default LeftMenu;

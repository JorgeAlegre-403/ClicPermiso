import { FaArrowRightFromBracket } from "react-icons/fa6";

const Header = () => {
    return (
        <>
            <div className="m-1 flex justify-between">
                <strong><h1>I.E.S Albarregas</h1></strong>
                <span className="p-4">Hola, Jorge <button className="cursor-pointer"><FaArrowRightFromBracket />
                </button></span>
            </div>
        </>
    )
}

export default Header
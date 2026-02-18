import { FaArrowRightFromBracket } from "react-icons/fa6";

const Header = () => {
    return (
        <>
            <div className="text-xl m-4 flex items-center justify-between">
                <strong><h1>I.E.S Albarregas</h1></strong>
                <span>Hola, Jorge <button className="cursor-pointer ml-2"><FaArrowRightFromBracket />
                </button></span>
            </div>
        </>
    )
}

export default Header
import { SlArrowRightCircle } from "react-icons/sl";

const Header = () => {
    return (
        <>
            <div className="m-1 flex justify-between">
                <strong><h1>I.E.S Albarregas</h1></strong>
                <span className="p-4">Hola, Jorge <button className="cursor-pointer"><SlArrowRightCircle /></button></span>
            </div>
        </>
    )
}

export default Header
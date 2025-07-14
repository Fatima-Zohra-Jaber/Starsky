import { Link } from "react-router-dom";

function Header(){
    return (
        <div className="sticky top-0 shadow z-50 h-16 flex justify-between items-center border-b border-gray-500/20">
            <div className="flex items-center">
                <img src="../../public/logo.png" className="h-6" alt="Logo" />
                <div className="inline-flex items-center rounded-full px-2 py-0.5 ml-1.5 h-4 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/50 hover:bg-blue-600/30 hover:text-blue-500 font-medium">
                    V 0.1
                </div>
            </div>
            <Link
                to="/login"
                className="flex justify-center items-center px-4 py-1 text-md bg-gradient-to-r from-blue-800 to-blue-500 rounded-xl"
            >
                Connexion
            </Link>
        </div>
    )
}
export default Header;
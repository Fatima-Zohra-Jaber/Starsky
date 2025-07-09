// import { Zap, Menu } from "lucide-react";

function Header(){
    return (
        <div className="sticky top-0 shadow z-50 flex justify-between items-center py-4">
            <div className="flex items-center">
                <img src="../../public/logo.png" className="h-8" alt="Logo" />
                <div class="inline-flex items-center rounded-full px-2.5 py-0.5 ml-1.5 h-5 text-xs bg-blue-500/20 text-blue-300 border border-blue-400/50 hover:bg-blue-600/30 hover:text-blue-500 font-medium">
                    V 0.1
                </div>
            </div>
            <button className="flex justify-center items-center px-6 py-1.5 text-lg bg-gradient-to-r from-blue-800 to-blue-500 rounded-xl">
                connexion
            </button>
        </div>
    )
}
export default Header;
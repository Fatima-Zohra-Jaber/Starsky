import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, LogOut} from "lucide-react";


function Header(){
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Vérifier si l'utilisateur est connecté
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [location]);

    // Déconnexion
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <div className="sticky top-0 shadow z-50 min-h-16 px-6 flex justify-between items-center border-b border-gray-500/20">
            {/* Logo et version*/}
                <div className="flex items-center space-x-8">
                    <Link to="/" className="flex items-center group">
                        <div className="relative">
                            <img
                                src="/logo.png"
                                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
                                alt="Starsky Logo"
                            />
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-800 to-blue-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
                        </div>
                        <div className="inline-flex items-center rounded-full px-2 py-0.5 ml-2 text-xs bg-gradient-to-r from-blue-800/20 to-blue-500/20 text-blue-300 border border-blue-400/30 font-medium backdrop-blur-sm">
                            v0.1
                        </div>
                    </Link>
                </div>
            {/* Connexion / Déconnexion */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-800 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm text-gray-300 hidden sm:block">
                                {user?.email ? user.email : 'Utilisateur'}
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-400/30 border border-transparent rounded-lg transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            <span className="hidden sm:block">Déconnexion</span>
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="group relative flex items-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-800 to-blue-500 rounded-xl hover:from-blue-800 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r  from-blue-800 to-blue-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                        <span className="relative flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Connexion
                        </span>
                    </Link>
                )}
            </div>
        </div>
    )
}
export default Header;
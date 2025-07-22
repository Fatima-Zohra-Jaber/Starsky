import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {  ArrowRight, Rocket} from "lucide-react";


export default function Hero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/generate');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center">
      {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl"></div>
        </div>
      {/* Titre Principal */}
      <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
        <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Créez des sites web
        </span>
        <br />
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          en quelques secondes
        </span>
      </h1>
      {/* Sous-titre */}
      <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        Transformez vos idées en sites web professionnels grâce à notre IA avancée.
        <span className="text-blue-400 font-medium"> Aucune compétence technique requise.</span>
      </p>
      {/* Boutons d'action */}
      <button
        onClick={handleClick}
        className="group relative flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl hover:from-blue-800 hover:to-blue-500 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
        <span className="relative flex items-center">
          <Rocket className="w-5 h-5 mr-3" />
          {user ? 'Continuer la création' : 'Commencer gratuitement'}
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </button>
    </div>
  );
}

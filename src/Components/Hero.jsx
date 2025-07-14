import { useNavigate } from "react-router-dom";

export default function Hero() {

  const navigate = useNavigate();

  const handleClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/generate');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex-grow overflow-y-auto flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">AI Website Generator</h1>
      <p className="text-lg text-gray-300 mb-8">
        Générez votre site web professionnel en quelques clics, grâce à l'intelligence artificielle.
      </p>
      <button
        onClick={handleClick}
        className="text-white px-5 py-2 rounded-xl shadow bg-gradient-to-r from-blue-800 to-blue-500 transition"
      >
        Commencer
      </button>
    </div>
  );
}

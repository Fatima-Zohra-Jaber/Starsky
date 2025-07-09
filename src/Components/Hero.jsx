import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold mb-4">AI Website Generator</h1>
      <p className="text-lg text-gray-300 mb-8">
        Générez votre site web professionnel en quelques clics, grâce à l'intelligence artificielle.
      </p>
      <Link
        to="/generate"
        className="text-white px-6 py-3 rounded-xl shadow bg-gradient-to-r from-blue-800 to-blue-500 transition"
      >
        Commencer
      </Link>
    </div>
  );
}

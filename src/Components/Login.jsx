import { useState } from 'react';
import { Facebook } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (email === 'user@example.com' && password === 'password') {
      localStorage.setItem("user",JSON.stringify(email) );
      navigate("/generate");
    } else {
      setError('Email ou mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    // rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md 
    <div className="flex-grow overflow-y-auto flex justify-center items-centerp-4">
      <div className="w-full max-w-md bg-[#1e1e1e] px-8 py-4 my-4 rounded-lg  transition-all duration-300 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={
              'w-full py-2 rounded text-white font-semibold transition ' +
              (loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700')
            }
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <button
            type="button"
            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center"
          >
            <Facebook size={20} className="mr-2" />
            Google
          </button>
          <button
            type="button"
            className="flex-1 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded flex items-center justify-center"
          >
            <Facebook size={20} className="mr-2" />
            Facebook
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            S’inscrire
          </a>
        </p>
      </div>
    </div>
  );
}

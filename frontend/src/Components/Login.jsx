
import { useState } from 'react';
import { Facebook, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); //MonMotDePasse123
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = isSignUp
        ? await register({ email, password })
        : await login({ email, password });

      if (response.error) {
        setError(response.error);
      } else {
        if (isSignUp) {
          setError('');
          setIsSignUp(false);
          alert('Inscription réussie ! Vérifiez votre email pour confirmer votre compte, puis connectez-vous.');
        } else {
          // Stocker le token et l'email dans localStorage
          localStorage.setItem("user", JSON.stringify({
            email: response.data.user.email,
            token: response.data.session.access_token
          }));
          navigate("/generate");
        }
      }
    } catch (error) {
      // Extraire le message d'erreur du serveur si disponible
      let errorMessage = error.message;
      if (errorMessage.includes('Email address') && errorMessage.includes('invalid')) {
        errorMessage = 'Adresse email invalide. Veuillez utiliser un email valide.';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email ou mot de passe incorrect. Vérifiez vos identifiants ou créez un compte.';
      } else if (errorMessage.includes('HTTP 400:')) {
        errorMessage = errorMessage.replace('HTTP 400: ', '').replace(/[{}]/g, '').replace('error:', '').replace(/"/g, '');
      }

      setError(errorMessage || (isSignUp ? 'Erreur d\'inscription. Veuillez réessayer.' : 'Erreur de connexion. Veuillez réessayer.'));
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow overflow-y-auto flex justify-center items-center p-4 relative">     
      <div className="relative w-full max-w-md transition-all duration-300 rounded-2xl hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]">
        {/* Carte de connexion */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
          {/* En-tête */}
          <h2 className="text-center text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Inscription' : 'Connexion'}
          </h2>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 mb-6 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Adresse email {isSignUp && <span className="text-xs text-gray-400">(utilisez un email valide)</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="exemple@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-12 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de connexion/inscription */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                loading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-800 hover:to-blue-500 text-white shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? 'Inscription en cours...' : 'Connexion en cours...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'S\'inscrire' : 'Se connecter'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Note d'information pour l'inscription */}
          {/* {isSignUp && (
            <div className="bg-blue-900/20 border border-blue-500/30 text-blue-300 p-3 mb-4 rounded-xl text-xs">
              <strong>Note :</strong> Après inscription, vous devrez peut-être confirmer votre email avant de pouvoir vous connecter.
            </div>
          )} */}

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900/80 text-gray-400">ou continuer avec</span>
            </div>
          </div>

          {/* Connexions sociales */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </button>
          </div>

          {/* Lien de basculement */}
          <p className="mt-4 text-center text-sm text-gray-400">
            {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-500 hover:text-blue-400 font-medium transition-colors duration-200"
            >
              {isSignUp ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

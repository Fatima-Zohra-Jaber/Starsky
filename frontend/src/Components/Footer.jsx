import { Youtube, Twitter, Linkedin, Instagram, Github, Heart } from "lucide-react";

function Footer(){
    return (
        <footer className="border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm px-6">
            <div className="flex flex-col md:flex-row justify-between items-center py-4 text-sm">
                {/* Créateur */}
                <div className="flex items-center mb-2 md:mb-0">
                    <span className="text-gray-400">Créé avec</span>
                    <Heart className="w-4 h-4 mx-1 text-red-400" />
                    <span className="text-gray-400">par</span>
                    <span className="ml-1 text-blue-500 hover:text-blue-400 hover:underline cursor-pointer font-medium transition-colors duration-200">
                        Monzed
                    </span>
                </div>

                {/* Copyright */}
                <div className="text-gray-400 mb-2 md:mb-0">
                    © {new Date().getFullYear()} Starsky. Tous droits réservés.
                </div>

                {/* Réseaux sociaux */}
                <div className="flex items-center space-x-3">
                    <a
                        href="#"
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                        aria-label="YouTube"
                    >
                        <Youtube className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                        aria-label="Twitter"
                    >
                        <Twitter className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-600/10 rounded-lg transition-all duration-200"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-400/10 rounded-lg transition-all duration-200"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-4 h-4" />
                    </a>
                    <a
                        href="#"
                        className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-300/10 rounded-lg transition-all duration-200"
                        aria-label="GitHub"
                    >
                        <Github className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
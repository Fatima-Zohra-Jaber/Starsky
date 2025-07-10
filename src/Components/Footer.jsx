import { Youtube, Twitter, Linkedin, Instagram, Github } from "lucide-react";

function Footer(){

    return (
        <div className="flex justify-between py-4 border-t border-gray-500/20 text-sm">
            <p className="">Fait par <span className="text-blue-700 hover:text-blue-500 hover:underline cursor-pointer">Monzed</span></p>
            <p className="">© 2025 Starsky. Tous droits réservés.</p>
            <div className="flex items-center space-x-4 text-white/50">
                <Youtube className="w-5 h-5 hover:text-blue-70 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-blue-70 transition-colors cursor-pointer"/>
                <Linkedin className="w-5 h-5 hover:text-blue-70 transition-colors cursor-pointer"/>
                <Instagram className="w-5 h-5 hover:text-blue-70 transition-colors cursor-pointer"/>
                <Github className="w-5 h-5 hover:text-blue-70 transition-colors cursor-pointer"/>
            </div>
        </div>
    )
}
export default Footer;
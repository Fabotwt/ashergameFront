import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2" onClick={scrollToTop}>
              <Gamepad2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Ashergame</span>
            </div>
            <p className="text-base-content/70">
              La plateforme ultime pour les jeux mobiles avec un système de coins innovant.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li onClick={scrollToTop}><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Accueil</a></li>
              <li onClick={scrollToTop}><Link to="/games" className="text-base-content/70 hover:text-primary transition-colors">Jeux</Link></li>
              <li onClick={scrollToTop}><Link to="/refund-policy" className="text-base-content/70 hover:text-primary transition-colors">Politique de remboursement</Link></li>
              <li onClick={scrollToTop}><Link to="/terms-and-conditions" className="text-base-content/70 hover:text-primary transition-colors">Termes & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base-content/70" onClick={scrollToTop}>
                <Mail className="w-4 h-4" />
                <a href="mailto:contact@ashergame.com?subject=Contactez-nous">Contactez-nous</a>
              </div>
              {/* <div className="flex items-center gap-2 text-base-content/70">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div> */}
              {/* <div className="flex items-center gap-2 text-base-content/70">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div> */}
            </div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="text-center text-base-content/70">
          <p>&copy; 2025 Ashergame. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

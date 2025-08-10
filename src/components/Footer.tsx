import React from 'react';
import { Gamepad2, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 border-t border-base-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
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
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Accueil</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Jeux</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">À propos</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Recharge USDT</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Système de coins</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Support caissier</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-base-content/70">
                <Mail className="w-4 h-4" />
                <span>contact@ashergame.com</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/70">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
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

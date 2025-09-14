import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Coins, Shield, Zap, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen bg-gradient-to-br from-primary/20 via-base-100 to-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="hero-content text-center relative z-10">
          <div className="max-w-4xl animate-fade-in">
            <div className="mb-8">
              <Gamepad2 className="w-20 h-20 text-primary mx-auto mb-4 animate-float" />
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ashergame
            </h1>
            <p className="text-xl mb-8 text-base-content/80 max-w-2xl mx-auto leading-relaxed">
              La plateforme révolutionnaire pour les jeux mobiles avec un système de coins innovant. 
              Rechargez, jouez et gérez vos transactions en toute sécurité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary btn-lg group">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-secondary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi choisir Ashergame ?</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Une plateforme complète avec des fonctionnalités avancées pour tous types d'utilisateurs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Coins className="w-8 h-8 text-primary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">Système de Coins</h3>
                <p className="text-base-content/70">
                  Gérez vos coins facilement avec notre système sécurisé. Rechargez via USDT TRC20/BEP20 ou par caissier.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">Sécurité Maximale</h3>
                <p className="text-base-content/70">
                  Transactions sécurisées avec authentification multi-niveaux et protection des données utilisateurs.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body text-center">
                <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="card-title justify-center text-2xl mb-4">Transactions Rapides</h3>
                <p className="text-base-content/70">
                  Rechargez instantanément vos comptes avec des transactions ultra-rapides et fiables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer votre aventure gaming ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de joueurs qui font confiance à Ashergame pour leurs transactions de jeux mobiles.
          </p>
          <Link to="/register" className="btn btn-accent btn-lg">
            Créer un compte gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

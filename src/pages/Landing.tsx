import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Coins, Shield, Zap, Star, ArrowRight, ExternalLink, Download } from 'lucide-react';

export const Landing: React.FC = () => {
  const games = [
    {
      id: 1,
      name: "Mobile Legends",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
      category: "MOBA",
      rating: 4.8,
      players: "100M+",
      description: "Le MOBA mobile le plus populaire au monde"
    },
    {
      id: 2,
      name: "PUBG Mobile",
      image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      category: "Battle Royale",
      rating: 4.7,
      players: "50M+",
      description: "Battle royale intense avec 100 joueurs"
    },
    {
      id: 3,
      name: "Free Fire",
      image: "https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg",
      category: "Battle Royale",
      rating: 4.6,
      players: "80M+",
      description: "Action rapide en 10 minutes maximum"
    },
    {
      id: 4,
      name: "Call of Duty Mobile",
      image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg",
      category: "FPS",
      rating: 4.9,
      players: "30M+",
      description: "FPS légendaire maintenant sur mobile"
    },
    {
      id: 5,
      name: "Clash Royale",
      image: "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
      category: "Stratégie",
      rating: 4.5,
      players: "25M+",
      description: "Stratégie en temps réel avec des cartes"
    },
    {
      id: 6,
      name: "Genshin Impact",
      image: "https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg",
      category: "RPG",
      rating: 4.8,
      players: "40M+",
      description: "RPG open-world avec des graphismes époustouflants"
    }
  ];

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

      {/* Games Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Jeux Disponibles</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Découvrez notre sélection de jeux mobiles populaires et rechargez vos comptes facilement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {games.map((game) => (
              <div key={game.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <figure className="relative h-48 overflow-hidden">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="badge badge-primary">{game.category}</div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{game.rating}</span>
                    </div>
                  </div>
                </figure>
                
                <div className="card-body">
                  <h3 className="card-title text-xl">{game.name}</h3>
                  <p className="text-base-content/70 text-sm mb-3">{game.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Gamepad2 className="w-4 h-4" />
                      {game.players} joueurs
                    </span>
                  </div>
                  
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">
                      Recharger
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Telegram Download Section */}
          <div className="text-center">
            <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 max-w-2xl mx-auto">
              <div className="card-body text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Téléchargez nos Jeux</h3>
                  <p className="text-lg text-base-content/70 mb-6">
                    Rejoignez notre communauté Telegram pour télécharger les dernières versions de vos jeux préférés
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://t.me/ashergame_official" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg group"
                  >
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.686-2.965 7.686-.896 0-1.507-.83-1.507-1.788 0-.63.169-1.169.508-1.62l3.319-3.99c.169-.203.338-.407.338-.68 0-.407-.338-.61-.677-.61-.508 0-.846.203-1.184.61l-4.215 5.085c-.169.203-.338.407-.677.407-.508 0-.846-.407-.846-.814 0-.203.169-.61.338-.814l6.388-7.695c.338-.407.677-.814 1.184-.814.677 0 1.015.407 1.015 1.017z"/>
                    </svg>
                    Rejoindre Telegram
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <button className="btn btn-outline btn-lg">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Voir tous les jeux
                  </button>
                </div>
                
                <div className="mt-6 text-sm text-base-content/60">
                  <p>✅ Téléchargements sécurisés • ✅ Mises à jour automatiques • ✅ Support 24/7</p>
                </div>
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

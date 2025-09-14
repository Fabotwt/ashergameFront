import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Termes et conditions</h1>
      <p className="mb-4">
        Veuillez lire attentivement les termes et conditions suivants qui régissent l'utilisation de notre site de jeux de divertissement et d'affiliation.
      </p>
      
      <h2 className="text-2xl font-bold mt-6 mb-2">Inscription</h2>
      <p className="mb-4">
        A l’inscription, le nouvel utilisateur reçoit systématiquement un message de confirmation dans sa boîte électronique qui valide son inscription.
      </p>
      
      <h2 className="text-2xl font-bold mt-6 mb-2">Affiliation</h2>
      <p className="mb-4">
        Tout utilisateur peut parrainer d’autres en leur fournissant son nom d’utilisateur qui représente son adresse d’affiliation. A cet effet, le parrain gagne une commission sur le premier dépôt de chaque filleul.
      </p>
      
      <h2 className="text-2xl font-bold mt-6 mb-2">Dépôt et retrait</h2>
      <p className="mb-4">
        Pour déposer ou retirer de l’argent, l’utilisateur peut utiliser les moyens de paiement disponibles sur la plateforme.
      </p>
      
      <h2 className="text-2xl font-bold mt-6 mb-2">Restriction</h2>
      <p>
        Vous ne pouvez utiliser la plateforme que si vous avez au moins 18 ans. Nous surveillons le fait que la plateforme ne soit pas utilisée par des mineurs. Nous résilierons votre compte si nous soupçonnons raisonnablement que vous êtes mineur(e).
      </p>
    </div>
  );
};

export default TermsAndConditions;

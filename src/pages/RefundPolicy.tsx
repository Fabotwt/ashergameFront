import React from 'react';

const RefundPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Politique de remboursement</h1>
      <p className="mb-4">
        Nous sommes déterminés à fournir une expérience de jeu de divertissement satisfaisante et transparente. Si vous rencontrez un problème avec un pari ou une transaction, veuillez lire notre politique de remboursement ci-dessous.
      </p>
      <h2 className="text-2xl font-bold mb-2">REMBOURSEMENTS POUR LES PARIS</h2>
      <p className="mb-4">
        Nous offrons des remboursements dans les situations suivantes :
      </p>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Annulation d'un événement :</strong> Si un événement est annulé ou reporté, vous pouvez demander un remboursement intégral de votre mise.</li>
        <li><strong>Erreur de cote :</strong> En cas d'erreur de cote sur un pari, nous rembourserons la différence entre la cote annoncée et la cote correcte.</li>
        <li><strong>Problème technique :</strong> Si vous rencontrez des problèmes techniques lors de la passation d'un pari et que cela affecte le résultat, nous vous rembourserons.</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">DEMANDE DE REMBOURSEMENT</h2>
      <p className="mb-4">
        Pour demander un remboursement, veuillez contacter notre service clientèle en fournissant les détails pertinents, tels que le numéro de transaction, la date du pari et une description du problème rencontré.
      </p>
      <p className="mb-4">
        Nous traiterons votre demande de remboursement dans les plus brefs délais et nous vous informerons de la décision.
      </p>
      <p>
        Veuillez noter que les demandes de remboursement seront évaluées au cas par cas, conformément à nos conditions générales d'utilisation.
      </p>
    </div>
  );
};

export default RefundPolicy;

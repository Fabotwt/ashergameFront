import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Wallet, 
  Copy, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  FileImage,
  Coins,
  CreditCard
} from 'lucide-react';

export const DirectRecharge: React.FC = () => {
  const { user, createRechargeRequest } = useAuthStore();
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const [step, setStep] = useState(1);

  if (!user) return null;

  const networks = {
    TRC20: {
      name: 'TRON (TRC20)',
      address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      fee: '1 USDT',
      time: '1-3 minutes',
      color: 'text-red-500'
    },
    BEP20: {
      name: 'Binance Smart Chain (BEP20)',
      address: '0x742d35Cc6634C0532925a3b8D4C9db4C2b7e9b4e',
      fee: '0.5 USDT',
      time: '1-5 minutes',
      color: 'text-yellow-500'
    }
  };

  const copyAddress = (network: string) => {
    navigator.clipboard.writeText(networks[network as keyof typeof networks].address);
    setCopied(network);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setProofFile(file);
      } else {
        alert('Veuillez sélectionner une image ou un fichier PDF');
      }
    }
  };

  const handleSubmit = async () => {
    if (!amount || !proofFile) return;

    setLoading(true);
    try {
      await createRechargeRequest({
        amount: parseInt(amount),
        network: selectedNetwork,
        proofFile,
        address: networks[selectedNetwork as keyof typeof networks].address
      });
      setStep(4); // Success step
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisir le Réseau</h2>
        <p className="text-base-content/70">Sélectionnez le réseau pour votre transfert USDT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(networks).map(([key, network]) => (
          <div
            key={key}
            className={`card cursor-pointer transition-all ${
              selectedNetwork === key 
                ? 'bg-primary text-primary-content shadow-lg scale-105' 
                : 'bg-base-200 hover:bg-base-300'
            }`}
            onClick={() => setSelectedNetwork(key)}
          >
            <div className="card-body">
              <h3 className="card-title">
                <div className={`w-3 h-3 rounded-full ${network.color} bg-current`}></div>
                {network.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Frais réseau:</span>
                  <span className="font-medium">{network.fee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps de confirmation:</span>
                  <span className="font-medium">{network.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={() => setStep(2)}
      >
        Continuer
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Montant et Adresse</h2>
        <p className="text-base-content/70">Entrez le montant et copiez l'adresse de destination</p>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Montant à recharger (coins)</span>
        </label>
        <input
          type="number"
          placeholder="1000"
          className="input input-bordered input-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="10"
          max="100000"
        />
        <label className="label">
          <span className="label-text-alt">Minimum: 10 coins - Maximum: 100,000 coins</span>
        </label>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">
            Adresse de Destination ({selectedNetwork})
          </h3>
          
          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-medium">Important !</p>
              <p className="text-sm">
                Envoyez uniquement des USDT sur le réseau {networks[selectedNetwork as keyof typeof networks].name}. 
                Tout autre token ou réseau entraînera une perte définitive.
              </p>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Adresse {selectedNetwork}</span>
            </label>
            <div className="join">
              <input
                type="text"
                value={networks[selectedNetwork as keyof typeof networks].address}
                className="input input-bordered join-item flex-1 font-mono text-sm"
                readOnly
              />
              <button
                className={`btn join-item ${copied === selectedNetwork ? 'btn-success' : 'btn-outline'}`}
                onClick={() => copyAddress(selectedNetwork)}
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied === selectedNetwork ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>

          <div className="stats stats-horizontal shadow mt-4">
            <div className="stat">
              <div className="stat-title">Réseau</div>
              <div className="stat-value text-lg">{selectedNetwork}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Frais</div>
              <div className="stat-value text-lg">{networks[selectedNetwork as keyof typeof networks].fee}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="btn btn-outline flex-1"
          onClick={() => setStep(1)}
        >
          Retour
        </button>
        <button
          className="btn btn-primary flex-1"
          onClick={() => setStep(3)}
          disabled={!amount || parseInt(amount) < 10}
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Preuve de Paiement</h2>
        <p className="text-base-content/70">Téléchargez la capture d'écran de votre transaction</p>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title">Résumé de la Transaction</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-base-content/70">Montant:</span>
              <div className="font-bold text-lg">{parseInt(amount).toLocaleString()} coins</div>
            </div>
            <div>
              <span className="text-base-content/70">Réseau:</span>
              <div className="font-bold text-lg">{selectedNetwork}</div>
            </div>
            <div className="col-span-2">
              <span className="text-base-content/70">Adresse:</span>
              <div className="font-mono text-sm break-all">
                {networks[selectedNetwork as keyof typeof networks].address}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Preuve de paiement</span>
        </label>
        <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
          {proofFile ? (
            <div className="space-y-4">
              <FileImage className="w-16 h-16 mx-auto text-success" />
              <div>
                <p className="font-medium text-success">{proofFile.name}</p>
                <p className="text-sm text-base-content/70">
                  {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setProofFile(null)}
              >
                Changer le fichier
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-16 h-16 mx-auto text-base-content/50" />
              <div>
                <p className="font-medium">Cliquez pour télécharger</p>
                <p className="text-sm text-base-content/70">
                  PNG, JPG, PDF - Max 10MB
                </p>
              </div>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
      </div>

      <div className="alert alert-info">
        <Info className="w-5 h-5" />
        <div>
          <p className="font-medium">Instructions</p>
          <ul className="text-sm list-disc list-inside mt-2 space-y-1">
            <li>Prenez une capture d'écran de votre transaction depuis votre wallet</li>
            <li>Assurez-vous que l'adresse de destination est visible</li>
            <li>Le montant et la date doivent être clairement lisibles</li>
            <li>Formats acceptés: PNG, JPG, PDF (max 10MB)</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="btn btn-outline flex-1"
          onClick={() => setStep(2)}
        >
          Retour
        </button>
        <button
          className={`btn btn-primary flex-1 ${loading ? 'loading' : ''}`}
          onClick={handleSubmit}
          disabled={!proofFile || loading}
        >
          {loading ? 'Envoi...' : 'Soumettre la Demande'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-24 h-24 mx-auto text-success" />
      <div>
        <h2 className="text-2xl font-bold text-success mb-2">Demande Soumise !</h2>
        <p className="text-base-content/70">
          Votre demande de recharge a été envoyée avec succès
        </p>
      </div>

      <div className="card bg-base-200 max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title justify-center">Prochaines Étapes</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <span>Votre demande est en cours de vérification</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Vous recevrez vos coins après approbation</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-info" />
              <span>Délai habituel: 1-24 heures</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          className="btn btn-outline"
          onClick={() => {
            setStep(1);
            setAmount('');
            setProofFile(null);
            setSelectedNetwork('TRC20');
          }}
        >
          Nouvelle Demande
        </button>
        <button className="btn btn-primary">
          Voir mes Transactions
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recharge Directe USDT</h1>
            <p className="text-base-content/70">Rechargez votre compte directement avec USDT</p>
          </div>

          {/* Progress Steps */}
          <div className="steps steps-horizontal w-full mb-8">
            <div className={`step ${step >= 1 ? 'step-primary' : ''}`}>Réseau</div>
            <div className={`step ${step >= 2 ? 'step-primary' : ''}`}>Montant</div>
            <div className={`step ${step >= 3 ? 'step-primary' : ''}`}>Preuve</div>
            <div className={`step ${step >= 4 ? 'step-primary' : ''}`}>Confirmation</div>
          </div>

          {/* Step Content */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

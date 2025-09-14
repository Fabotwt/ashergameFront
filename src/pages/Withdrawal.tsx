import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { 
  ArrowDownLeft, 
  Wallet, 
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Shield,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export const Withdrawal: React.FC = () => {
  const { user, requestWithdrawal } = useAuthStore();
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showAddress, setShowAddress] = useState(false);

  if (!user) return null;

  const networks = {
    TRC20: {
      name: 'TRON (TRC20)',
      fee: 1,
      minWithdrawal: 10,
      maxWithdrawal: 50000,
      processingTime: '5-30 minutes',
      color: 'text-red-500',
      addressFormat: 'T...',
      addressLength: 34
    },
    BEP20: {
      name: 'Binance Smart Chain (BEP20)',
      fee: 0.5,
      minWithdrawal: 10,
      maxWithdrawal: 50000,
      processingTime: '5-15 minutes',
      color: 'text-yellow-500',
      addressFormat: '0x...',
      addressLength: 42
    }
  };

  const selectedNetworkInfo = networks[selectedNetwork as keyof typeof networks];
  const finalAmount = amount ? parseFloat(amount) - selectedNetworkInfo.fee : 0;

  const validateAddress = (address: string, network: string) => {
    if (!address) return false;
    
    if (network === 'TRC20') {
      return address.startsWith('T') && address.length === 34;
    } else if (network === 'BEP20') {
      return address.startsWith('0x') && address.length === 42;
    }
    return false;
  };

  const isValidWithdrawal = () => {
    const amountNum = parseFloat(amount);
    return (
      amount &&
      amountNum >= selectedNetworkInfo.minWithdrawal &&
      amountNum <= selectedNetworkInfo.maxWithdrawal &&
      amountNum <= user.coins &&
      validateAddress(recipientAddress, selectedNetwork)
    );
  };

  const handleSubmit = async () => {
    if (!isValidWithdrawal()) return;

    setLoading(true);
    const result = await requestWithdrawal(
      parseFloat(amount),
      selectedNetwork,
      recipientAddress
    );

    if (result.success) {
      toast.success(result.message);
      setStep(4); // Go to success step
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choisir le Réseau</h2>
        <p className="text-base-content/70">Sélectionnez le réseau pour votre retrait USDT</p>
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
                  <span className="font-medium">{network.fee} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum:</span>
                  <span className="font-medium">{network.minWithdrawal} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Temps de traitement:</span>
                  <span className="font-medium">{network.processingTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info">
        <Info className="w-5 h-5" />
        <div>
          <p className="font-medium">Information importante</p>
          <p className="text-sm">
            Les frais de réseau sont déduits automatiquement du montant du retrait. 
            Assurez-vous de choisir le bon réseau pour éviter toute perte de fonds.
          </p>
        </div>
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
        <h2 className="text-2xl font-bold mb-2">Montant du Retrait</h2>
        <p className="text-base-content/70">Entrez le montant que vous souhaitez retirer</p>
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg">Solde Disponible</h3>
          <div className="stat">
            <div className="stat-value text-primary">{user.coins.toLocaleString()} coins</div>
            <div className="stat-desc">≈ {user.coins.toLocaleString()} USDT</div>
          </div>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Montant à retirer (USDT)</span>
        </label>
        <input
          type="number"
          placeholder={`Min: ${selectedNetworkInfo.minWithdrawal} USDT`}
          className="input input-bordered input-lg"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={selectedNetworkInfo.minWithdrawal}
          max={Math.min(selectedNetworkInfo.maxWithdrawal, user.coins)}
        />
        <label className="label">
          <span className="label-text-alt">
            Min: {selectedNetworkInfo.minWithdrawal} USDT - Max: {Math.min(selectedNetworkInfo.maxWithdrawal, user.coins).toLocaleString()} USDT
          </span>
        </label>
      </div>

      {amount && parseFloat(amount) >= selectedNetworkInfo.minWithdrawal && (
        <div className="card bg-base-300">
          <div className="card-body">
            <h4 className="card-title text-base">Résumé du Retrait</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Montant demandé:</span>
                <span className="font-medium">{parseFloat(amount).toLocaleString()} USDT</span>
              </div>
              <div className="flex justify-between text-error">
                <span>Frais réseau ({selectedNetwork}):</span>
                <span className="font-medium">-{selectedNetworkInfo.fee} USDT</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span>Montant final reçu:</span>
                <span className="text-success">{finalAmount.toLocaleString()} USDT</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
          disabled={!amount || parseFloat(amount) < selectedNetworkInfo.minWithdrawal || parseFloat(amount) > user.coins}
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Adresse de Réception</h2>
        <p className="text-base-content/70">Entrez l'adresse {selectedNetwork} où vous souhaitez recevoir vos USDT</p>
      </div>

      <div className="alert alert-warning">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <p className="font-medium">Attention !</p>
          <p className="text-sm">
            Vérifiez soigneusement l'adresse de réception. Les transactions blockchain sont irréversibles. 
            Une adresse incorrecte entraînera une perte définitive des fonds.
          </p>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Adresse {selectedNetwork}</span>
          <span className="label-text-alt">Format: {selectedNetworkInfo.addressFormat}</span>
        </label>
        <div className="relative">
          <input
            type={showAddress ? "text" : "password"}
            placeholder={`Adresse ${selectedNetwork} (${selectedNetworkInfo.addressLength} caractères)`}
            className={`input input-bordered w-full pr-12 font-mono ${
              recipientAddress && !validateAddress(recipientAddress, selectedNetwork) 
                ? 'input-error' 
                : recipientAddress && validateAddress(recipientAddress, selectedNetwork)
                ? 'input-success'
                : ''
            }`}
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value.trim())}
          />
          <button
            type="button"
            className="btn btn-ghost btn-sm absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setShowAddress(!showAddress)}
          >
            {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {recipientAddress && !validateAddress(recipientAddress, selectedNetwork) && (
          <label className="label">
            <span className="label-text-alt text-error">
              Adresse {selectedNetwork} invalide. Doit commencer par {selectedNetworkInfo.addressFormat.split('...')[0]} et contenir {selectedNetworkInfo.addressLength} caractères.
            </span>
          </label>
        )}
        {recipientAddress && validateAddress(recipientAddress, selectedNetwork) && (
          <label className="label">
            <span className="label-text-alt text-success">
              ✓ Adresse {selectedNetwork} valide
            </span>
          </label>
        )}
      </div>

      <div className="card bg-base-200">
        <div className="card-body">
          <h4 className="card-title text-base">
            <Shield className="w-5 h-5" />
            Vérification Finale
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Réseau:</span>
              <span className="font-medium">{selectedNetworkInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant à retirer:</span>
              <span className="font-medium">{parseFloat(amount).toLocaleString()} USDT</span>
            </div>
            <div className="flex justify-between">
              <span>Frais réseau:</span>
              <span className="font-medium text-error">{selectedNetworkInfo.fee} USDT</span>
            </div>
            <div className="flex justify-between">
              <span>Montant final:</span>
              <span className="font-bold text-success">{finalAmount.toLocaleString()} USDT</span>
            </div>
            <div className="divider my-2"></div>
            <div>
              <span>Adresse de réception:</span>
              <div className="font-mono text-sm break-all mt-1 p-2 bg-base-300 rounded">
                {recipientAddress || 'Non renseignée'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <Clock className="w-5 h-5" />
        <div>
          <p className="font-medium">Temps de traitement</p>
          <p className="text-sm">
            Votre demande sera traitée dans un délai de {selectedNetworkInfo.processingTime} après validation par notre équipe.
          </p>
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
          disabled={!isValidWithdrawal() || loading}
        >
          {loading ? 'Traitement...' : 'Confirmer le Retrait'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-24 h-24 mx-auto text-success" />
      <div>
        <h2 className="text-2xl font-bold text-success mb-2">Demande de Retrait Soumise !</h2>
        <p className="text-base-content/70">
          Votre demande de retrait a été envoyée avec succès
        </p>
      </div>

      <div className="card bg-base-200 max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title justify-center">Détails de la Demande</h3>
          <div className="space-y-2 text-left">
            <div className="flex justify-between">
              <span>Réseau:</span>
              <span className="font-medium">{selectedNetworkInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant final:</span>
              <span className="font-bold text-success">{finalAmount.toLocaleString()} USDT</span>
            </div>
            <div className="flex justify-between">
              <span>Statut:</span>
              <div className="badge badge-warning">En attente</div>
            </div>
          </div>
        </div>
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
              <span>Les fonds seront envoyés après approbation</span>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-info" />
              <span>Délai: {selectedNetworkInfo.processingTime}</span>
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
            setRecipientAddress('');
            setSelectedNetwork('TRC20');
          }}
        >
          Nouveau Retrait
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
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              <ArrowDownLeft className="w-8 h-8 text-primary" />
              Retrait USDT
            </h1>
            <p className="text-base-content/70">Retirez vos coins en USDT sur votre wallet</p>
          </div>

          {/* Progress Steps */}
          <div className="steps steps-horizontal w-full mb-8">
            <div className={`step ${step >= 1 ? 'step-primary' : ''}`}>Réseau</div>
            <div className={`step ${step >= 2 ? 'step-primary' : ''}`}>Montant</div>
            <div className={`step ${step >= 3 ? 'step-primary' : ''}`}>Adresse</div>
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

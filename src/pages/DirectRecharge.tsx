import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
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
  const { user } = useAuthStore();
  const [selectedNetwork, setSelectedNetwork] = useState('TRC20');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addresses, setAddresses] = useState({ usdtTrc: '', usdtBep: '' });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Assurez-vous que l'URL de base de l'API est correctement configurée, par exemple dans un fichier .env
        const response = await fetch(`${import.meta.env.VITE_API_URL}/settings/deposit-addresses`);
        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setAddresses(data.data);
        } else {
          throw new Error(data.message || 'Failed to process addresses');
        }
      } catch (error) {
        console.error('Error fetching deposit addresses:', error);
        toast.error('Impossible de charger les adresses de dépôt.');
      }
    };

    fetchAddresses();
  }, []);

  const networks = {
    TRC20: {
      name: 'TRON (TRC20)',
      address: addresses.usdtTrc,
    },
    BEP20: {
      name: 'Binance Smart Chain (BEP20)',
      address: addresses.usdtBep,
    }
  };

  const copyAddress = (network: string) => {
    const address = networks[network as keyof typeof networks].address;
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Adresse copiée !');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      return;
    }

    setLoading(true);
    try {
      const token = useAuthStore.getState().authToken;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recharge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          amount: parseInt(amount), 
          network: selectedNetwork 
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        toast.success(data.message || 'Votre demande de recharge a été soumise avec succès.');
        setAmount('');
      } else {
        throw new Error(data.message || 'Une erreur est survenue.');
      }
    } catch (error: any) {
      console.error('Erreur lors de la demande de recharge:', error);
      toast.error(error.message || 'Impossible de soumettre la demande.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-100 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Recharge Directe USDT</h1>
            <p className="text-base-content/70">Rechargez votre compte directement avec USDT</p>
          </div>

          <form onSubmit={handleSubmit} className="card bg-base-200 shadow-lg">
            <div className="card-body space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1. Choisissez le réseau</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(networks).map(([key, network]) => (
                    <div
                      key={key}
                      className={`card cursor-pointer transition-all ${
                        selectedNetwork === key 
                          ? 'bg-primary text-primary-content shadow-lg scale-105' 
                          : 'bg-base-300 hover:bg-neutral'
                      }`}
                      onClick={() => setSelectedNetwork(key)}
                    >
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">{network.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2. Copiez l'adresse et envoyez vos USDT</h3>
                <div className="alert alert-warning">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Envoyez uniquement des USDT sur ce réseau pour éviter toute perte de fonds.</span>
                </div>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Adresse de dépôt {selectedNetwork}</span>
                  </label>
                  <div className="join">
                    <input
                      type="text"
                      value={networks[selectedNetwork as keyof typeof networks].address || 'Chargement...'}
                      className="input input-bordered join-item flex-1 font-mono text-sm"
                      readOnly
                    />
                    <button
                      type="button"
                      className={`btn join-item ${copied ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => copyAddress(selectedNetwork)}
                      disabled={!networks[selectedNetwork as keyof typeof networks].address}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3. Confirmez votre opération</h3>
                 <p className="text-sm text-base-content/70 mb-4">Une fois le transfert effectué, entrez le montant en USDT que vous avez envoyé. Notre équipe vérifiera la transaction et créditera votre compte.</p>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Montant envoyé (USDT)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 100"
                    className="input input-bordered input-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="card-actions">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading || !amount}
                >
                  {loading ? 'Soumission en cours...' : 'Soumettre ma demande de recharge'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

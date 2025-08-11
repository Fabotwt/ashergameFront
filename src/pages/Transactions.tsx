import React, { useEffect, useState } from 'react';
import { useAuthStore, Transaction } from '../store/authStore';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Loader, 
  AlertCircle,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

export const Transactions: React.FC = () => {
  const { authToken, user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterUsername, setFilterUsername] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(filterType !== 'all' && { type: filterType }),
        ...(filterUsername && { username: filterUsername }),
      }).toString();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/transactions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      setTransactions(result.data || []);
      setLastPage(result.meta.lastPage);
      setCurrentPage(result.meta.currentPage);
    } catch (err) {
      console.error('Erreur lors de la récupération des transactions:', err);
      setError('Impossible de charger les transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken && user?.role === 'admin') {
      fetchTransactions();
    } else if (!user || user.role !== 'admin') {
      setError('Accès non autorisé. Seuls les administrateurs peuvent voir cette page.');
      setLoading(false);
    }
  }, [authToken, user, currentPage, filterStatus, filterType, filterUsername]);

  const handleUpdateStatus = async (transactionId: string, newStatus: 'Approved' | 'Rejected') => {
    Swal.fire({
      title: `Confirmer ${newStatus === 'Approved' ? 'l\'approbation' : 'le rejet'} ?`,
      text: `Voulez-vous vraiment ${newStatus === 'Approved' ? 'approuver' : 'rejeter'} cette transaction ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Approved' ? '#3085d6' : '#d33',
      cancelButtonColor: '#888',
      confirmButtonText: newStatus === 'Approved' ? 'Oui, approuver!' : 'Oui, rejeter!',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/transactions/${transactionId}/status`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ status: newStatus })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
          }

          Swal.fire(
            newStatus === 'Approved' ? 'Approuvée!' : 'Rejetée!',
            `La transaction a été ${newStatus === 'Approved' ? 'approuvée' : 'rejeter'} avec succès.`, 
            'success'
          );
          fetchTransactions(); // Refresh the list
        } catch (err: any) {
          console.error('Erreur lors de la mise à jour du statut:', err);
          Swal.fire(
            'Erreur!',
            err.message || 'Impossible de mettre à jour le statut de la transaction.',
            'error'
          );
        }
      }
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-error';
      case 'Pending': return 'badge-warning';
      case 'completed': return 'badge-success'; // For existing mock data
      case 'pending': return 'badge-warning';   // For existing mock data
      default: return 'badge-neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chargement des transactions...</h2>
          <p className="text-base-content/70">Récupération des données depuis l'API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center p-4 bg-base-200 rounded-lg shadow-lg">
          <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erreur</h2>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={fetchTransactions}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
          <History className="w-8 h-8" />
          Gestion des Transactions
        </h1>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-secondary mb-4">Filtres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="form-control">
                <label className="label"><span className="label-text">Statut</span></label>
                <select 
                  className="select select-bordered w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="Pending">En attente</option>
                  <option value="Completed">Terminé</option>
                  <option value="Rejected">Rejeté</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Type</span></label>
                <select 
                  className="select select-bordered w-full"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="Recharge">Recharge</option>
                  <option value="Withdrawal">Retrait</option>
                  <option value="Transfer">Transfert</option>
                  <option value="Purchase">Achat</option>
                  <option value="Affiliate">Affiliation</option>
                  <option value="Referral_Bonus">Bonus Parrainage</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Nom d'utilisateur</span></label>
                <input 
                  type="text" 
                  placeholder="Rechercher par nom d'utilisateur"
                  className="input input-bordered w-full"
                  value={filterUsername}
                  onChange={(e) => setFilterUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn btn-primary" onClick={fetchTransactions}>
                <RefreshCw className="w-4 h-4" /> Appliquer les filtres
              </button>
              <button className="btn btn-outline" onClick={() => {
                setFilterStatus('all');
                setFilterType('all');
                setFilterUsername('');
                setCurrentPage(1); // Reset to first page on filter reset
              }}>
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title text-secondary mb-4">Toutes les Transactions ({transactions.length})</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID Transaction</th>
                    <th>Utilisateur</th>
                    <th>Type</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td><span className="font-mono text-sm">{transaction.id.toString().substring(0, 8)}...</span></td>
                        <td>{transaction.account?.username || 'N/A'}</td>
                        <td>{transaction.type}</td>
                        <td>{parseFloat(transaction.amount).toLocaleString()} coins</td>
                        <td>
                          <div className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                            {transaction.status}
                          </div>
                        </td>
                        <td>{formatDate(transaction.createdAt)}</td>
                        <td>
                          {transaction.status === 'Pending' || transaction.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleUpdateStatus(transaction.id, 'Approved')}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approuver
                              </button>
                              <button 
                                className="btn btn-error btn-sm"
                                onClick={() => handleUpdateStatus(transaction.id, 'Rejected')}
                              >
                                <XCircle className="w-4 h-4" />
                                Rejeter
                              </button>
                            </div>
                          ) : (
                            <span className="text-base-content/70">Statut final</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <AlertCircle className="w-12 h-12 mx-auto text-base-content/50 mb-4" />
                        <p className="text-base-content/70">Aucune transaction trouvée.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <div className="join">
                <button 
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <button className="join-item btn">Page {currentPage} / {lastPage}</button>
                <button 
                  className="join-item btn"
                  onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                  disabled={currentPage === lastPage}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
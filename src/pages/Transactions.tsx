import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  History, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  Calendar,
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const Transactions: React.FC = () => {
  const { user, transactions } = useAuthStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');

  if (!user) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <div className="badge badge-success gap-1"><CheckCircle className="w-3 h-3" />Confirmé</div>;
      case 'pending':
        return <div className="badge badge-warning gap-1"><Clock className="w-3 h-3" />En attente</div>;
      case 'rejected':
        return <div className="badge badge-error gap-1"><XCircle className="w-3 h-3" />Rejeté</div>;
      default:
        return <div className="badge badge-info gap-1"><AlertCircle className="w-3 h-3" />Inconnu</div>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="w-4 h-4 text-success" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-error" />;
      case 'transfer':
        return <Coins className="w-4 h-4 text-primary" />;
      default:
        return <History className="w-4 h-4 text-base-content/50" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'transfer': return 'Transfert';
      case 'purchase': return 'Achat';
      case 'affiliate': return 'Commission';
      default: return type;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Historique des Transactions</h1>
            <p className="text-base-content/70">Consultez toutes vos transactions et leur statut</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-success">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Dépôts</div>
              <div className="stat-value text-success">{totalDeposits.toLocaleString()}</div>
              <div className="stat-desc">coins reçus</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-error">
                <TrendingDown className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Retraits</div>
              <div className="stat-value text-error">{totalWithdrawals.toLocaleString()}</div>
              <div className="stat-desc">coins retirés</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-warning">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">En Attente</div>
              <div className="stat-value text-warning">{pendingTransactions}</div>
              <div className="stat-desc">transactions</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <Coins className="w-8 h-8" />
              </div>
              <div className="stat-title">Solde Actuel</div>
              <div className="stat-value text-primary">{user.coins.toLocaleString()}</div>
              <div className="stat-desc">coins disponibles</div>
            </div>
          </div>

          {/* Filters */}
          <div className="card bg-base-200 shadow-lg mb-6">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Rechercher</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Référence, description..."
                      className="input input-bordered w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Tous</option>
                    <option value="deposit">Dépôts</option>
                    <option value="withdrawal">Retraits</option>
                    <option value="transfer">Transferts</option>
                    <option value="purchase">Achats</option>
                    <option value="affiliate">Commissions</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Période</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="all">Toutes</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">&nbsp;</span>
                  </label>
                  <button className="btn btn-outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <History className="w-6 h-6" />
                Transactions ({filteredTransactions.length})
              </h3>
              
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Référence</th>
                      <th>Montant</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-base-content/50" />
                            <div>
                              <div className="font-medium">
                                {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-sm text-base-content/70">
                                {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(transaction.type)}
                            <span className="capitalize">{getTypeLabel(transaction.type)}</span>
                          </div>
                        </td>
                        <td>
                          <div className="max-w-xs truncate" title={transaction.description}>
                            {transaction.description}
                          </div>
                        </td>
                        <td>
                          <div className="font-mono text-sm">
                            {transaction.reference || '-'}
                          </div>
                        </td>
                        <td>
                          <div className={`font-bold flex items-center gap-1 ${
                            transaction.amount > 0 ? 'text-success' : 'text-error'
                          }`}>
                            <Coins className="w-4 h-4" />
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(transaction.status)}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button className="btn btn-xs btn-outline">
                              <Eye className="w-3 h-3" />
                            </button>
                            {transaction.proof && (
                              <button className="btn btn-xs btn-primary btn-outline">
                                <Download className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <History className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                    <p className="text-base-content/70">Aucune transaction trouvée</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

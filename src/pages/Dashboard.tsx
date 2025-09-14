import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { 
  Coins, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Plus, 
  Send, 
  History,
  Settings,
  BarChart3,
  Wallet,
  Gamepad2,
  Edit,
  Trash2,
  Filter,
  Search,
  Eye,
  UserPlus,
  Star,
  Loader,
  Calendar,
  Hash,
  User,
  Shield,
  CheckCircle,
  XCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX,
  Crown,
  AlertCircle,
  Gift
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    updateCoins, 
    users, 
    addGame, 
    games, 
    updateUserCoins, 
    fetchCurrentUser, 
    isLoadingUser,
    isLoadingAuth,
    // Nouvelles fonctions admin
    adminUsers,
    adminStats,
    isLoadingAdminData,
    fetchActiveUsers,
    fetchAdminStats,
    toggleUserStatus,
    toggleUserRole,
    rechargeCashier,
    rechargePlayer,
    rechargePlayerByCashier,
    cashierStats,
    fetchCashierStats,
    playerStats,
    fetchPlayerStats
  } = useAuthStore();
  
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [usdtAddress, setUsdtAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [userFilter, setUserFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Game form state
  const [gameForm, setGameForm] = useState({
    name: '',
    category: '',
    image: '',
    description: '',
    rating: 4.5,
    players: ''
  });

  useEffect(() => {
    if (!user && !isLoadingUser && !isLoadingAuth) {
      fetchCurrentUser();
    }
  }, [user, isLoadingUser, isLoadingAuth, fetchCurrentUser]);

  // Récupérer les données admin ou caissier
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchActiveUsers();
      fetchAdminStats();
    } else if (user?.role === 'cashier') {
      fetchCashierStats();
    } else if (user?.role === 'player') {
      fetchPlayerStats();
    }
  }, [user, fetchActiveUsers, fetchAdminStats, fetchCashierStats]);

  // Afficher un loader pendant le chargement des données utilisateur
  if (isLoadingUser || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Chargement de votre profil...</h2>
          <p className="text-base-content/70">Récupération des données depuis l'API</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Erreur de chargement</h2>
          <p className="text-base-content/70">Impossible de récupérer les données utilisateur</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => fetchCurrentUser()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const handleRecharge = async (type: 'usdt' | 'cashier') => {
    setLoading(true);
    setNotification(null);
    try {
      if (type === 'usdt') {
        // Assuming createRechargeRequest handles the API call
        // This part needs to be properly integrated with the actual form data for USDT recharge
        // For now, it's a placeholder as the USDT recharge form is in DirectRecharge.tsx
        setNotification({ type: 'success', message: 'USDT Recharge initiated (simulated)' });
      } else if (type === 'cashier') {
        // This case is handled by handleRechargeCashier or handleRechargePlayer
        setNotification({ type: 'error', message: 'Invalid recharge type' });
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Recharge failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    setNotification(null);
    try {
      const amount = parseInt(rechargeAmount);
      if (amount <= 0) {
        setNotification({ type: 'error', message: 'Montant invalide' });
        return;
      }
      // Assuming there's an API for player-to-player transfer
      // For now, this is a placeholder
      setNotification({ type: 'success', message: `Transfer of ${amount} coins to ${targetUsername} (simulated)` });
      setRechargeAmount('');
      setTargetUsername('');
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || 'Transfer failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGame = () => {
    if (gameForm.name && gameForm.category) {
      addGame({
        id: Date.now().toString(),
        ...gameForm,
        image: gameForm.image || 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
      });
      setGameForm({
        name: '',
        category: '',
        image: '',
        description: '',
        rating: 4.5,
        players: ''
      });
    }
  };

  // 🆕 Gestion du toggle de statut utilisateur
  const handleToggleUserStatus = async (userId: string) => {
    const success = await toggleUserStatus(userId);
    if (success) {
      // Optionnel: afficher une notification de succès
      console.log('✅ Statut utilisateur modifié avec succès');
    } else {
      // Optionnel: afficher une notification d'erreur
      console.log('❌ Erreur lors de la modification du statut');
    }
  };

  // 🆕 Gestion du changement de rôle utilisateur
  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    // Cycle entre les rôles : player -> cashier -> admin -> player
    let newRole: 'player' | 'cashier' | 'admin';
    switch (currentRole) {
      case 'player':
        newRole = 'cashier';
        break;
      case 'cashier':
        newRole = 'admin';
        break;
      case 'admin':
        newRole = 'player';
        break;
      default:
        newRole = 'player';
    }

    const success = await toggleUserRole(userId, newRole);
    if (success) {
      console.log(`✅ Rôle utilisateur modifié vers ${newRole} avec succès`);
    } else {
      console.log('❌ Erreur lors de la modification du rôle');
    }
  };

  // 🆕 Actualiser les données admin
  const handleRefreshAdminData = async () => {
    if (user && user.role === 'admin') {
      await fetchActiveUsers();
      await fetchAdminStats();
    }
  };

  const handleRechargeCashier = async () => {
    setLoading(true);
    const amount = parseInt(rechargeAmount);
    const success = await rechargeCashier(targetUsername, amount);
    if (success) {
      console.log('Caissier rechargé avec succès');
      setRechargeAmount('');
      setTargetUsername('');
    } else {
      console.error('Erreur lors de la recharge du caissier');
    }
    setLoading(false);
  };

  const handleRechargePlayer = async () => {
    setLoading(true);
    const amount = parseInt(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Veuillez entrer un montant valide.');
      setLoading(false);
      return;
    }

    const result = await rechargePlayerByCashier(targetUsername, amount);
    
    if (result.success) {
      toast.success(result.message || 'Joueur rechargé avec succès !');
      setRechargeAmount('');
      setTargetUsername('');
    } else {
      toast.error(result.message || 'Erreur lors de la recharge.');
    }
    setLoading(false);
  };

  // Utiliser adminUsers pour les admins, sinon users mock
  const filteredUsers = (user?.role === 'admin' ? adminUsers : users).filter(u => {
    const matchesFilter = userFilter === 'all' || u.role === userFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch && u.id !== user.id;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'cashier': return 'Caissier';
      case 'player': return 'Joueur';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'badge-error';
      case 'cashier': return 'badge-warning';
      case 'player': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const getCountryFlag = (countryCode?: string) => {
    const flags: { [key: string]: string } = {
      'FR': '🇫🇷',
      'BE': '🇧🇪',
      'CH': '🇨🇭',
      'CA': '🇨🇦',
      'MA': '🇲🇦',
      'TN': '🇹🇳',
      'DZ': '🇩🇿',
      'SN': '🇸🇳',
      'CI': '🇨🇮'
    };
    return flags[countryCode || ''] || '🌍';
  };

  // Fonction pour obtenir le nom d'affichage (username ou nom complet)
  const getDisplayName = () => {
    if (user.username) {
      return user.username;
    }
    return user.name;
  };

  const renderPlayerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Coins className="w-8 h-8" />
          </div>
          <div className="stat-title">Mes Coins</div>
          <div className="stat-value text-primary">{user.coins.toLocaleString()}</div>
          <div className="stat-desc">Solde disponible</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-secondary">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="stat-title">Transactions</div>
          <div className="stat-value text-secondary">{playerStats?.transactionsCount || 0}</div>
          <div className="stat-desc">Ce mois-ci</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Mes Filleuls</div>
          <div className="stat-value text-accent">{playerStats?.referralsCount || 0}</div>
          <div className="stat-desc">Total</div>
        </div>
      </div>

      {/* User Info Card - Enhanced with all API data */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">
            <Users className="w-6 h-6" />
            Informations du Profil
            {user.enabled && (
              <div className="badge badge-success gap-2">
                <CheckCircle className="w-3 h-3" />
                Compte Activé
              </div>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <strong>Email:</strong> 
                <span className="text-primary">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Nom complet:</strong> 
                <span>{user.name}</span>
              </div>
              {user.username && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <strong>Nom d'utilisateur:</strong> 
                  <span className="font-mono text-accent">@{user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Rôle:</strong> 
                <div className="badge badge-primary">{getRoleLabel(user.role)}</div>
              </div>
              {user.accountId && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>ID Compte:</strong> 
                  <span className="font-mono text-secondary">{user.accountId}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {user.accountNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>Numéro de compte:</strong> 
                  <span className="font-mono text-accent">{user.accountNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Téléphone:</strong> 
                <span>{user.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Pays:</strong> 
                <span className="flex items-center gap-1">
                  {getCountryFlag(user.country)}
                  {user.country || 'Non renseigné'}
                </span>
              </div>
              {user.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <strong>Membre depuis:</strong> 
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <strong>Statut du compte:</strong> 
                {user.enabled ? (
                  <div className="badge badge-success">Activé</div>
                ) : (
                  <div className="badge badge-warning">En attente</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg">
          <div className="card-body">
            <h3 className="card-title">
              <Gift className="w-6 h-6" />
              Programme de Parrainage
            </h3>
            <p>Invitez vos amis et gagnez des commissions sur leur premier dépôt ! Partagez votre nom d'utilisateur comme code de parrainage.</p>
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text text-primary-content/80">Votre code de parrainage</span>
              </label>
              <div className="join">
                <input
                  type="text"
                  value={user.username || ''}
                  className="input input-bordered join-item flex-1 font-mono"
                  readOnly
                />
                <button
                  className="btn btn-neutral join-item"
                  onClick={() => {
                    navigator.clipboard.writeText(user.username || '');
                    toast.success('Code de parrainage copié !');
                  }}
                >
                  Copier
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cashier Recharge */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-secondary">
              <Users className="w-6 h-6" />
              Recharge par Caissier
            </h3>
            <div className="space-y-4">
              <div className="alert alert-info">
                <span className="text-sm">
                  Donnez votre ID de compte à un caissier pour être rechargé
                </span>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Votre ID de compte</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={user.accountId || user.id}
                    className="input input-bordered flex-1 font-mono"
                    readOnly
                  />
                  <button
                    className="btn btn-outline"
                    onClick={() => navigator.clipboard.writeText((user.accountId || user.id).toString())}
                  >
                    Copier
                  </button>
                </div>
              </div>
              {user.accountNumber && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Numéro de compte</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={user.accountNumber}
                      className="input input-bordered flex-1 font-mono"
                      readOnly
                    />
                    <button
                      className="btn btn-outline"
                      onClick={() => navigator.clipboard.writeText(user.accountNumber!.toString())}
                    >
                      Copier
                    </button>
                  </div>
                </div>
              )}
              {user.username && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom d'utilisateur</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={`@${user.username}`}
                      className="input input-bordered flex-1 font-mono"
                      readOnly
                    />
                    <button
                      className="btn btn-outline"
                      onClick={() => navigator.clipboard.writeText(`@${user.username}`)}
                    >
                      Copier
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCashierDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Coins className="w-8 h-8" />
          </div>
          <div className="stat-title">Mes Coins</div>
          <div className="stat-value text-primary">{user.coins.toLocaleString()}</div>
          <div className="stat-desc">Disponible</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <Send className="w-8 h-8" />
          </div>
          <div className="stat-title">Transactions</div>
          <div className="stat-value text-accent">{cashierStats?.transactionsCount || 0}</div>
          <div className="stat-desc">Total</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Commission</div>
          <div className="stat-value text-success">{cashierStats?.commissionRate || 0}%</div>
          <div className="stat-desc">Taux actuel</div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">
            <Users className="w-6 h-6" />
            Informations du Profil Caissier
            {user.enabled && (
              <div className="badge badge-success gap-2">
                <CheckCircle className="w-3 h-3" />
                Compte Activé
              </div>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <strong>Email:</strong> 
                <span className="text-primary">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Nom complet:</strong> 
                <span>{user.name}</span>
              </div>
              {user.username && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <strong>Nom d'utilisateur:</strong> 
                  <span className="font-mono text-accent">@{user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Rôle:</strong> 
                <div className="badge badge-secondary">{getRoleLabel(user.role)}</div>
              </div>
              {user.accountId && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>ID Caissier:</strong> 
                  <span className="font-mono text-secondary">{user.accountId}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {user.accountNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>Numéro de compte:</strong> 
                  <span className="font-mono text-accent">{user.accountNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Téléphone:</strong> 
                <span>{user.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Pays:</strong> 
                <span className="flex items-center gap-1">
                  {getCountryFlag(user.country)}
                  {user.country || 'Non renseigné'}
                </span>
              </div>
              {user.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <strong>Membre depuis:</strong> 
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <strong>Statut du compte:</strong> 
                {user.enabled ? (
                  <div className="badge badge-success">Activé</div>
                ) : (
                  <div className="badge badge-warning">En attente</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recharge Player */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">
            <Send className="w-6 h-6" />
            Recharger un Joueur
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom d'utilisateur du joueur</span>
              </label>
              <input
                type="text"
                placeholder="Nom d'utilisateur du joueur"
                className="input input-bordered"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Montant (coins)</span>
              </label>
              <input
                type="number"
                placeholder="1000"
                className="input input-bordered"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">&nbsp;</span>
              </label>
              <button
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleRechargePlayer}
                disabled={!targetUsername || !rechargeAmount || loading}
              >
                Recharger
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards - Utilise les vraies données API */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-primary">
            <Coins className="w-8 h-8" />
          </div>
          <div className="stat-title">Mes Coins</div>
          <div className="stat-value text-primary">{user.coins.toLocaleString()}</div>
          <div className="stat-desc">Disponible</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-secondary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Utilisateurs</div>
          <div className="stat-value text-secondary">
            {adminStats?.totalUsers || adminUsers.length}
          </div>
          <div className="stat-desc">Total actifs</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-accent">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div className="stat-title">Jeux</div>
          <div className="stat-value text-accent">{games.length}</div>
          <div className="stat-desc">Disponibles</div>
        </div>
        
        <div className="stat bg-base-200 rounded-lg shadow-lg">
          <div className="stat-figure text-success">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Actifs</div>
          <div className="stat-value text-success">
            {adminStats?.activeUsers || 'N/A'}
          </div>
          <div className="stat-desc">Comptes activés</div>
        </div>
      </div>

      {/* 🆕 Statistiques détaillées admin */}
      {adminStats && (
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-primary">
              <BarChart3 className="w-6 h-6" />
              Statistiques Détaillées
              <button 
                className="btn btn-sm btn-outline"
                onClick={handleRefreshAdminData}
                disabled={isLoadingAdminData}
              >
                {isLoadingAdminData ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Total Utilisateurs</div>
                <div className="stat-value text-lg">{adminStats.totalUsers}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Joueurs</div>
                <div className="stat-value text-lg text-info">{adminStats.totalPlayers}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Caissiers</div>
                <div className="stat-value text-lg text-warning">{adminStats.totalCashiers}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Admins</div>
                <div className="stat-value text-lg text-error">{adminStats.totalAdmins}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Comptes Actifs</div>
                <div className="stat-value text-lg text-success">{adminStats.activeUsers}</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-4">
                <div className="stat-title text-xs">Comptes Inactifs</div>
                <div className="stat-value text-lg text-neutral">{adminStats.inactiveUsers}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Info Card */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-primary">
            <Users className="w-6 h-6" />
            Informations du Profil Administrateur
            {user.enabled && (
              <div className="badge badge-success gap-2">
                <CheckCircle className="w-3 h-3" />
                Activé
              </div>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <strong>Email:</strong> 
                <span className="text-primary">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Nom complet:</strong> 
                <span>{user.name}</span>
              </div>
              {user.username && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <strong>Nom d'utilisateur:</strong> 
                  <span className="font-mono text-accent">@{user.username}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Rôle:</strong> 
                <div className="badge badge-accent">{getRoleLabel(user.role)}</div>
              </div>
              {user.accountId && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>ID Admin:</strong> 
                  <span className="font-mono text-secondary">{user.accountId}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {user.accountNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  <strong>Numéro de compte:</strong> 
                  <span className="font-mono text-accent">{user.accountNumber}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <strong>Téléphone:</strong> 
                <span>{user.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2">
                <strong>Pays:</strong> 
                <span className="flex items-center gap-1">
                  {getCountryFlag(user.country)}
                  {user.country || 'Non renseigné'}
                </span>
              </div>
              {user.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <strong>Membre depuis:</strong> 
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <strong>Statut du compte:</strong> 
                {user.enabled ? (
                  <div className="badge badge-success">Activé</div>
                ) : (
                  <div className="badge badge-warning">En attente</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        <button 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        {/* <button 
          className={`tab ${activeTab === 'games' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Gestion des Jeux
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Gestion des Utilisateurs
        </button> */}
        {/* <button 
          className={`tab ${activeTab === 'transactions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Gestion des Transactions
        </button> */}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recharge Cashier */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary">
                <Plus className="w-6 h-6" />
                Recharger un Caissier
              </h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom d'utilisateur du caissier</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nom d'utilisateur du caissier"
                    className="input input-bordered"
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Montant (coins)</span>
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    className="input input-bordered"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                  />
                </div>
                <button
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  onClick={handleRechargeCashier}
                  disabled={!targetUsername || !rechargeAmount || loading}
                >
                  Recharger le caissier
                </button>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-secondary">
                <Settings className="w-6 h-6" />
                Configuration Système
              </h3>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Maintenance mode</span>
                    <input type="checkbox" className="toggle toggle-primary" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Nouvelles inscriptions</span>
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Recharges USDT</span>
                    <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                  </label>
                </div>
                <button className="btn btn-outline w-full">
                  Sauvegarder les paramètres
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'games' && (
        <div className="space-y-6">
          {/* Add Game Form */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-primary">
                <Plus className="w-6 h-6" />
                Ajouter un Nouveau Jeu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nom du jeu</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mobile Legends"
                    className="input input-bordered"
                    value={gameForm.name}
                    onChange={(e) => setGameForm({...gameForm, name: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Catégorie</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={gameForm.category}
                    onChange={(e) => setGameForm({...gameForm, category: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    <option value="MOBA">MOBA</option>
                    <option value="Battle Royale">Battle Royale</option>
                    <option value="FPS">FPS</option>
                    <option value="RPG">RPG</option>
                    <option value="Stratégie">Stratégie</option>
                    <option value="Action">Action</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL de l'image</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.pexels.com/..."
                    className="input input-bordered"
                    value={gameForm.image}
                    onChange={(e) => setGameForm({...gameForm, image: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Nombre de joueurs</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 100M+"
                    className="input input-bordered"
                    value={gameForm.players}
                    onChange={(e) => setGameForm({...gameForm, players: e.target.value})}
                  />
                </div>
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    placeholder="Description du jeu..."
                    className="textarea textarea-bordered"
                    value={gameForm.description}
                    onChange={(e) => setGameForm({...gameForm, description: e.target.value})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Note (1-5)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    className="input input-bordered"
                    value={gameForm.rating}
                    onChange={(e) => setGameForm({...gameForm, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">&nbsp;</span>
                  </label>
                  <button
                    className="btn btn-primary"
                    onClick={handleAddGame}
                    disabled={!gameForm.name || !gameForm.category}
                  >
                    Ajouter le jeu
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Games List */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-secondary">
                <Gamepad2 className="w-6 h-6" />
                Jeux Disponibles ({games.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                  <div key={game.id} className="card bg-base-100 shadow-md">
                    <figure className="h-32">
                      <img src={game.image} alt={game.name} className="w-full h-full object-cover" />
                    </figure>
                    <div className="card-body p-4">
                      <h4 className="card-title text-sm">{game.name}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="badge badge-primary badge-xs">{game.category}</div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{game.rating}</span>
                        </div>
                      </div>
                      <div className="card-actions justify-end mt-2">
                        <button className="btn btn-xs btn-outline">
                          <Edit className="w-3 h-3" />
                        </button>
                        <button className="btn btn-xs btn-error btn-outline">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* 🆕 Loader pour les données admin */}
          {isLoadingAdminData && (
            <div className="alert alert-info">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Chargement des données utilisateurs depuis l'API...</span>
            </div>
          )}

          {/* Filters */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="form-control flex-1">
                  <label className="label">
                    <span className="label-text">Rechercher</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nom ou email..."
                      className="input input-bordered w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Filtrer par rôle</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                  >
                    <option value="all">Tous</option>
                    <option value="player">Joueurs</option>
                    <option value="cashier">Caissiers</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">&nbsp;</span>
                  </label>
                  <button 
                    className="btn btn-outline"
                    onClick={handleRefreshAdminData}
                    disabled={isLoadingAdminData}
                  >
                    {isLoadingAdminData ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Actualiser
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 🆕 Users List avec données API */}
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-secondary mb-4">
                <Users className="w-6 h-6" />
                Utilisateurs ({filteredUsers.length})
                {user.role === 'admin' && (
                  <div className="badge badge-info">
                    API: {adminUsers.length} utilisateurs
                  </div>
                )}
              </h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Coins</th>
                      <th>Pays</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-white font-bold">
                                  {u.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{u.name}</div>
                              <div className="text-sm opacity-50">{u.email}</div>
                              {u.username && (
                                <div className="text-xs text-accent">@{u.username}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={`badge ${getRoleBadgeClass(u.role)}`}>
                            {u.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                            {getRoleLabel(u.role)}
                          </div>
                        </td>
                        <td>
                          {u.enabled ? (
                            <div className="badge badge-success gap-1">
                              <UserCheck className="w-3 h-3" />
                              Activé
                            </div>
                          ) : (
                            <div className="badge badge-warning gap-1">
                              <UserX className="w-3 h-3" />
                              Inactif
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <Coins className="w-4 h-4 text-primary" />
                            <span className="font-bold">{u.coins.toLocaleString()}</span>
                          </div>
                        </td>
                        <td>
                          <span className="flex items-center gap-1">
                            {getCountryFlag(u.country)}
                            {u.country || 'Non spécifié'}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            {/* 🆕 Toggle Status Button */}
                            <button 
                              className={`btn btn-xs ${u.enabled ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleToggleUserStatus(u.id)}
                              title={u.enabled ? 'Désactiver' : 'Activer'}
                            >
                              {u.enabled ? (
                                <ToggleRight className="w-3 h-3" />
                              ) : (
                                <ToggleLeft className="w-3 h-3" />
                              )}
                            </button>
                            
                            {/* 🆕 Toggle Role Button */}
                            <button 
                              className="btn btn-xs btn-info"
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              title="Changer le rôle"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                            
                            <button className="btn btn-xs btn-outline">
                              <Eye className="w-3 h-3" />
                            </button>
                            <button className="btn btn-xs btn-primary btn-outline">
                              <Coins className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* 🆕 Message si aucun utilisateur */}
              {filteredUsers.length === 0 && !isLoadingAdminData && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-base-content/50 mb-4" />
                  <p className="text-base-content/70">Aucun utilisateur trouvé</p>
                  <button 
                    className="btn btn-outline btn-sm mt-2"
                    onClick={handleRefreshAdminData}
                  >
                    Actualiser les données
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'transactions' && (
        <Transactions />
      )} */}
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Bonjour, {getDisplayName()} 👋
              </h1>
              <p className="text-base-content/70 mt-1">
                Tableau de bord {getRoleLabel(user.role)}
                {user.username && (
                  <span className="ml-2 text-accent">(@{user.username})</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="badge badge-primary badge-lg">
                {getRoleLabel(user.role)}
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => fetchCurrentUser()}
                title="Actualiser les données"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {user.role === 'player' && renderPlayerDashboard()}
        {user.role === 'cashier' && renderCashierDashboard()}
        {user.role === 'admin' && renderAdminDashboard()}

        {/* Recent Transactions */}
        {/* <div className="mt-8">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">
                <History className="w-6 h-6" />
                Transactions Récentes
              </h3>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2025-01-15 14:30</td>
                      <td>Recharge USDT</td>
                      <td className="text-success">+1,000 coins</td>
                      <td><div className="badge badge-success">Confirmé</div></td>
                    </tr>
                    <tr>
                      <td>2025-01-14 09:15</td>
                      <td>Achat jeu</td>
                      <td className="text-error">-50 coins</td>
                      <td><div className="badge badge-success">Confirmé</div></td>
                    </tr>
                    <tr>
                      <td>2025-01-13 16:45</td>
                      <td>Recharge caissier</td>
                      <td className="text-success">+500 coins</td>
                      <td><div className="badge badge-success">Confirmé</div></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldCheck, 
  Crown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Coins,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { 
    user, 
    adminUsers, 
    adminStats, 
    usersPagination,
    isLoadingAdminData,
    fetchActiveUsers, 
    fetchInactiveUsers,
    fetchAdminStats, 
    toggleUserStatus, 
    toggleUserRole 
  } = useAuthStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Charger les données au montage et lorsque les filtres changent
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminStats();
      if (statusFilter === 'active') {
        fetchActiveUsers(currentPage);
      } else if (statusFilter === 'inactive') {
        fetchInactiveUsers(currentPage);
      }
    }
  }, [user, currentPage, statusFilter]);

  // Fonction pour changer de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (usersPagination?.lastPage || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Fonction pour aller à la première page
  const goToFirstPage = () => {
    handlePageChange(1);
  };

  // Fonction pour aller à la dernière page
  const goToLastPage = () => {
    if (usersPagination?.lastPage) {
      handlePageChange(usersPagination.lastPage);
    }
  };

  // Fonction pour aller à la page précédente
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  // Fonction pour aller à la page suivante
  const goToNextPage = () => {
    if (usersPagination && currentPage < usersPagination.lastPage) {
      handlePageChange(currentPage + 1);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-error mb-4" />
          <h2 className="text-2xl font-bold mb-2">Accès Refusé</h2>
          <p className="text-base-content/70">Seuls les administrateurs peuvent accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleToggleStatus = async (userId: string) => {
    const success = await toggleUserStatus(userId);
    if (success) {
      // Optionnel: afficher une notification de succès
      console.log('Statut utilisateur modifié avec succès');
    }
  };

  const handleToggleRole = async (accountId: number | undefined, currentRole: string) => {
    if (accountId === undefined) {
      console.error("User accountId is undefined");
      return;
    }
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

    const success = await toggleUserRole(accountId, newRole);
    if (success) {
      setFlashMessage({ type: 'success', message: `Rôle utilisateur modifié vers ${newRole} avec succès` });
      setTimeout(() => setFlashMessage(null), 3000);
    } else {
      setFlashMessage({ type: 'error', message: 'Erreur lors de la modification du rôle' });
      setTimeout(() => setFlashMessage(null), 3000);
    }
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1); // Réinitialiser à la première page lors du changement de filtre
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-warning" />;
      case 'cashier':
        return <ShieldCheck className="w-4 h-4 text-info" />;
      default:
        return <Shield className="w-4 h-4 text-base-content/50" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <div className="badge badge-warning badge-sm">Admin</div>;
      case 'cashier':
        return <div className="badge badge-info badge-sm">Caissier</div>;
      default:
        return <div className="badge badge-ghost badge-sm">Joueur</div>;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Flash Message */}
        {flashMessage && (
          <div className={`alert ${flashMessage.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mb-4`}>
            <div>
              <span>{flashMessage.message}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-base-content/70 mt-2">
              Gérez les comptes utilisateurs, leurs rôles et statuts
            </p>
          </div>
        </div>

        {/* Statistiques */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Total</div>
              <div className="stat-value text-2xl">{adminStats.totalUsers}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-success">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Actifs</div>
              <div className="stat-value text-2xl">{adminStats.activeUsers}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-error">
                <UserX className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Inactifs</div>
              <div className="stat-value text-2xl">{adminStats.inactiveUsers}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-base-content/50">
                <Shield className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Joueurs</div>
              <div className="stat-value text-2xl">{adminStats.totalPlayers}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-info">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Caissiers</div>
              <div className="stat-value text-2xl">{adminStats.totalCashiers}</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-4">
              <div className="stat-figure text-warning">
                <Crown className="w-8 h-8" />
              </div>
              <div className="stat-title text-sm">Admins</div>
              <div className="stat-value text-2xl">{adminStats.totalAdmins}</div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="card bg-base-200 shadow-lg mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou username..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                </div>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tous les rôles</option>
                  <option value="player">Joueurs</option>
                  <option value="cashier">Caissiers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="form-control">
                <select
                  className="select select-bordered"
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informations de pagination */}
        {usersPagination && (
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-base-content/70">
              Affichage de {((currentPage - 1) * usersPagination.perPage) + 1} à{' '}
              {Math.min(currentPage * usersPagination.perPage, usersPagination.total)} sur{' '}
              {usersPagination.total} utilisateurs
            </div>
            <div className="text-sm text-base-content/70">
              Page {currentPage} sur {usersPagination.lastPage}
            </div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        {isLoadingAdminData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des utilisateurs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="card bg-base-200 shadow-lg">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold flex items-center gap-2">
                          {user.name}
                          {getRoleIcon(user.role)}
                          {getRoleBadge(user.role)}
                          {user.enabled ? (
                            <div className="badge badge-success badge-sm">Actif</div>
                          ) : (
                            <div className="badge badge-error badge-sm">Inactif</div>
                          )}
                        </h3>
                        <p className="text-sm text-base-content/70">{user.email}</p>
                        {user.username && (
                          <p className="text-xs text-base-content/50">@{user.username}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`btn btn-sm ${user.enabled ? 'btn-error' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.enabled ? (
                          <>
                            <UserX className="w-4 h-4" />
                            Désactiver
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Activer
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleToggleRole(user.accountId, user.role)}
                      >
                        {getRoleIcon(user.role)}
                        Changer rôle
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-base-content/50" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-base-content/50" />
                      <span>{user.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-base-content/50" />
                      <span>{user.country || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="w-4 h-4 text-base-content/50" />
                      <span>{user.coins.toLocaleString()} coins</span>
                    </div>
                  </div>

                  {user.lastLoginIp && (
                    <div className="mt-2 text-xs text-base-content/50">
                      Dernière IP: {user.lastLoginIp}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contrôles de pagination */}
        {usersPagination && usersPagination.lastPage > 1 && (
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div className="text-sm text-base-content/70">
                  {usersPagination.total} utilisateurs au total
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Première page */}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Page précédente */}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Précédent
                  </button>

                  {/* Indicateur de page */}
                  <div className="flex items-center gap-2 mx-4">
                    <span className="text-sm">Page</span>
                    <div className="badge badge-primary badge-lg">
                      {currentPage}
                    </div>
                    <span className="text-sm">sur {usersPagination.lastPage}</span>
                  </div>

                  {/* Page suivante */}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={goToNextPage}
                    disabled={currentPage === usersPagination.lastPage}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  
                  {/* Dernière page */}
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={goToLastPage}
                    disabled={currentPage === usersPagination.lastPage}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barre de progression de pagination */}
              <div className="mt-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: usersPagination.lastPage }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      className={`btn btn-xs ${
                        pageNum === currentPage ? 'btn-primary' : 'btn-ghost'
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isLoadingAdminData}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message si aucun utilisateur */}
        {!isLoadingAdminData && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-bold mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-base-content/70">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Aucun utilisateur disponible.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

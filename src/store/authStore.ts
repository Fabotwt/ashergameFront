import { create } from 'zustand';

export type UserRole = 'player' | 'cashier' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  coins: number;
  avatar?: string;
  phone?: string;
  country?: string;
  username?: string;
  enabled?: boolean;
  referralCode?: string;
  referredBy?: string;
  accountId?: number;
  accountNumber?: number;
  createdAt?: string;
  updatedAt?: string;
  lastLoginIp?: string; // 🆕 Nouveau champ depuis l'API
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  video: string;
  image: string;
  link: string;
  apk: string;
  description: string;
  category: string;
  rating: number;
  players: string;
}

export interface Transaction {
  id: string;
  accountId: number;
  date: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'purchase' | 'affiliate' | 'referral_bonus' | 'Recharge';
  description: string;
  reference?: string;
  amount: string;
  urlImgPreuve?: string | null;
  status: 'Pending' | 'Completed' | 'Rejected';
  createdAt: string;
  updatedAt: string;
  account?: {
    id: number;
    username: string;
    password?: string;
    lastLoginIp?: string | null;
    lastLoginDate?: string | null;
    email: string;
    role: UserRole;
    phone?: string;
    country?: string;
    enabled: number;
    createdAt?: string | null;
  };
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: 'active' | 'pending';
  firstDepositAmount?: number;
}

export interface AffiliateEarning {
  id: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  originalAmount: number;
  createdAt: string;
}

export interface RechargeRequest {
  amount: number;
  network: string;
  proofFile: File;
  address: string;
}

export interface WithdrawalRequest {
  amount: number;
  network: string;
  recipientAddress: string;
  fee: number;
}

export interface CashierRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  motivation: string;
  experience: string;
  availability: string;
  region: string;
  languages: string[];
  expectedVolume: string;
  referrals: string;
  identityDocument: File | null;
  proofOfAddress: File | null;
  bankStatement: File | null;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

// ✅ Interface corrigée pour correspondre exactement à la structure API réelle
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPlayers: number;
  totalCashiers: number;
  totalAdmins: number;
}

export interface PlayerStats {
  transactionsCount: number;
  referralsCount: number;
}

// 🆕 Interface pour la pagination API
export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

interface AuthState {
  user: User | null;
  users: User[];
  adminUsers: User[]; // Liste des utilisateurs récupérés via API admin
  adminStats: AdminStats | null; // Statistiques admin
  cashierStats: CashierStats | null;
  playerStats: PlayerStats | null;
  usersPagination: PaginationMeta | null; // 🆕 Métadonnées de pagination
  games: Game[];
  transactions: Transaction[];
  affiliates: Affiliate[];
  affiliateEarnings: AffiliateEarning[];
  cashierRequests: CashierRequest[];
  affiliateStats: { referredUsers: User[], commissionTransactions: Transaction[], referredUsersCount: number, totalEarnings: number } | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoadingUser: boolean;
  isLoadingAdminData: boolean;
  isLoadingAuth: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole, phone?: string, country?: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  fetchCurrentUser: () => Promise<void>;
  // Nouvelles fonctions admin
  fetchActiveUsers: (page?: number) => Promise<void>; // 🆕 Ajout paramètre page
  fetchInactiveUsers: (page?: number) => Promise<void>;
  fetchAdminStats: () => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  toggleUserRole: (accountId: number, newRole: UserRole) => Promise<boolean>;
  updateCoins: (amount: number) => void;
  updateUser: (userData: Partial<User>) => void;
  updateUserCoins: (userId: string, amount: number) => void;
  addGame: (game: Game) => void;
  createRechargeRequest: (request: RechargeRequest) => Promise<void>;
  createWithdrawalRequest: (request: WithdrawalRequest) => Promise<void>;
  createCashierRequest: (request: Partial<CashierRequest>) => Promise<void>;
  approveCashierRequest: (requestId: string, reviewNotes?: string) => Promise<void>;
  rejectCashierRequest: (requestId: string, reviewNotes?: string) => Promise<void>;
  createCashier: (cashierData: any) => Promise<void>;
  rechargeCashier: (username: string, amount: number) => Promise<boolean>;
  rechargePlayer: (username: string, amount: number) => Promise<{success: boolean, message: string}>;
  fetchAffiliateStats: () => Promise<void>;
  fetchCashierStats: () => Promise<void>;
  fetchPlayerStats: () => Promise<void>;
  requestWithdrawal: (amount: number, network: string, address: string) => Promise<{ success: boolean, message: string }>;
}

// Mock users for demo


// Helper function to map API role to UserRole
const mapApiRoleToUserRole = (apiRole?: string): UserRole => {
  if (!apiRole) return 'player';
  
  switch (apiRole.toLowerCase()) {
    case 'joueur':
    case 'player':
      return 'player';
    case 'caissier':
    case 'cashier':
      return 'cashier';
    case 'admin':
    case 'administrateur':
      return 'admin';
    default:
      return 'player';
  }
};

// 🆕 Helper function pour mapper la structure API simplifiée vers User
const mapSimpleApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id?.toString() || Date.now().toString(),
    email: apiUser.email || `${apiUser.username}@example.com`,
    name: apiUser.username || 'Utilisateur',
    role: mapApiRoleToUserRole(apiUser.role),
    coins: parseInt(apiUser.coins) || 0,
    username: apiUser.username,
    lastLoginIp: apiUser.lastLoginIp,
    enabled: apiUser.enabled === 1 || apiUser.enabled === true,
    phone: apiUser.phone,
    country: apiUser.country,
    accountId: apiUser.id,
    accountNumber: apiUser.account_number,
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
    avatar: apiUser.avatar,
    referralCode: apiUser.referral_code,
    referredBy: apiUser.referred_by,
  };
};

// Helper function to map API user data to User interface (ancienne version pour /me)
const mapApiUserToUser = (apiUser: any, apiAccount?: any): User => {
  return {
    id: apiUser.id?.toString() || Date.now().toString(),
    email: apiUser.email || '',
    name: apiUser.fullName || apiUser.name || apiUser.email?.split('@')[0] || 'Utilisateur',
    
    // Données depuis account si disponible
    role: apiAccount?.role || apiUser.role,
    phone: apiAccount?.phone || apiUser.phone,
    country: apiAccount?.country || apiUser.country,
    username: apiAccount?.username || apiUser.username,
    enabled: apiAccount?.enabled === 1 || apiUser.enabled === 1,
    
    // Données financières
    coins: parseInt(apiUser.coins) || 0,
    
    // Données de compte
    accountId: apiUser.accountId || apiUser.id,
    accountNumber: apiUser.accountNumber,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
    
    // Données optionnelles
    avatar: apiUser.avatar,
    referralCode: apiUser.referral_code,
    referredBy: apiUser.referred_by
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  users: [],
  adminUsers: [],
  adminStats: null,
  cashierStats: null,
  usersPagination: null, // 🆕 Initialisation pagination
  games: [],
  transactions: [],
  affiliates: [],
  affiliateEarnings: [],
  cashierRequests: [],
  affiliateStats: null,
  isAuthenticated: false,
  authToken: localStorage.getItem('authToken'),
  isLoadingUser: false,
  isLoadingAdminData: false,
  isLoadingAuth: !!localStorage.getItem('authToken'),
  
  login: async (email: string, password: string) => {
    try {
      // Récupérer le token depuis localStorage (déjà stocké par Login.tsx)
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.error('Aucun token trouvé dans localStorage');
        return false;
      }

      // In a real app, you would verify the token with the backend
      // For now, we assume if a token exists, the user is authenticated
      set({ 
        isAuthenticated: true, 
        authToken 
      });
      return true;

    } catch (error) {
      console.error('Erreur lors de la connexion locale:', error);
      return false;
    }
  },

  fetchCurrentUser: async () => {
    const { authToken } = get();
    
    if (!authToken) {
      console.error('Aucun token d\'authentification trouvé');
      set({ isLoadingAuth: false });
      return;
    }

    set({ isLoadingUser: true, isLoadingAuth: true });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
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

      const data = await response.json();
      console.log('Réponse API /me complète:', data);

      if (data.status === 'success' && data.data) {
        // Mapper les données de l'API vers notre interface User
        const apiData = data.data;
        const apiUser = apiData.user;
        const apiAccount = apiData.account;
        
        const user: User = {
          // Données de base depuis user
          id: apiUser.id?.toString() || Date.now().toString(),
          email: apiUser.email || '',
          name: apiUser.fullName || apiUser.name || apiUser.email?.split('@')[0] || 'Utilisateur',
          
          // Données depuis account
          role: mapApiRoleToUserRole(apiAccount?.role),
          phone: apiAccount?.phone || apiUser.phone,
          country: apiAccount?.country || apiUser.country,
          username: apiAccount?.username,
          enabled: apiAccount?.enabled === 1,
          
          // Données financières
          coins: parseInt(apiData.coins) || 0,
          
          // Données de compte
          accountId: apiUser.accountId,
          accountNumber: apiUser.accountNumber,
          createdAt: apiUser.createdAt,
          updatedAt: apiUser.updatedAt,
          
          // Données optionnelles
          avatar: apiUser.avatar,
          referralCode: apiUser.referral_code,
          referredBy: apiUser.referred_by
        };

        console.log('Utilisateur mappé avec données account:', user);

        set({ 
          user,
          isAuthenticated: true,
          isLoadingUser: false,
          isLoadingAuth: false
        });
      } else {
        console.error('Format de réponse API inattendu:', data);
        set({ isLoadingUser: false, isLoadingAuth: false });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      set({ isLoadingUser: false, isLoadingAuth: false });
    }
  },

  // ✅ API MISE À JOUR: Récupérer la liste des utilisateurs actifs avec pagination
  fetchActiveUsers: async (page = 1) => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      console.error('Accès non autorisé pour récupérer les utilisateurs');
      return;
    }

    set({ isLoadingAdminData: true });

    try {
      console.log(`🔄 Récupération des utilisateurs actifs (page ${page})...`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/active?page=${page}`, {
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

      const data = await response.json();
      console.log('✅ Réponse API /users/active complète:', data);

      if (data.data && data.meta) {
        // ✅ Mapper les utilisateurs avec la nouvelle structure API simplifiée
        const apiUsers = Array.isArray(data.data) ? data.data : [];
        const mappedUsers: User[] = apiUsers.map((apiUser: any) => {
          console.log('🔄 Mapping utilisateur API:', apiUser);
          return mapSimpleApiUserToUser(apiUser);
        });

        // ✅ Extraire les métadonnées de pagination
        const pagination: PaginationMeta = {
          total: data.meta.total,
          perPage: data.meta.perPage,
          currentPage: data.meta.currentPage,
          lastPage: data.meta.lastPage,
          firstPage: data.meta.firstPage,
          firstPageUrl: data.meta.firstPageUrl,
          lastPageUrl: data.meta.lastPageUrl,
          nextPageUrl: data.meta.nextPageUrl,
          previousPageUrl: data.meta.previousPageUrl
        };

        console.log(`📊 ${mappedUsers.length} utilisateurs récupérés (page ${page}/${pagination.lastPage})`);
        console.log('📄 Pagination:', pagination);

        set({ 
          adminUsers: mappedUsers,
          usersPagination: pagination,
          isLoadingAdminData: false
        });
      } else {
        console.error('Format de réponse API inattendu:', data);
        set({ isLoadingAdminData: false });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      set({ isLoadingAdminData: false });
    }
  },

  fetchInactiveUsers: async (page = 1) => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      console.error('Accès non autorisé pour récupérer les utilisateurs inactifs');
      return;
    }

    set({ isLoadingAdminData: true });

    try {
      console.log(`🔄 Récupération des utilisateurs inactifs (page ${page})...`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/inactive?page=${page}`, {
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

      const data = await response.json();
      console.log('✅ Réponse API /users/inactive complète:', data);

      if (data.data && data.meta) {
        const apiUsers = Array.isArray(data.data) ? data.data : [];
        const mappedUsers: User[] = apiUsers.map((apiUser: any) => {
          console.log('🔄 Mapping utilisateur API:', apiUser);
          return mapSimpleApiUserToUser(apiUser);
        });

        const pagination: PaginationMeta = {
          total: data.meta.total,
          perPage: data.meta.perPage,
          currentPage: data.meta.currentPage,
          lastPage: data.meta.lastPage,
          firstPage: data.meta.firstPage,
          firstPageUrl: data.meta.firstPageUrl,
          lastPageUrl: data.meta.lastPageUrl,
          nextPageUrl: data.meta.nextPageUrl,
          previousPageUrl: data.meta.previousPageUrl
        };

        console.log(`📊 ${mappedUsers.length} utilisateurs récupérés (page ${page}/${pagination.lastPage})`);
        console.log('📄 Pagination:', pagination);

        set({ 
          adminUsers: mappedUsers,
          usersPagination: pagination,
          isLoadingAdminData: false
        });
      } else {
        console.error('Format de réponse API inattendu:', data);
        set({ isLoadingAdminData: false });
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs inactifs:', error);
      set({ isLoadingAdminData: false });
    }
  },

  // ✅ NOUVELLE API: Récupérer les statistiques admin (structure API complète)
  fetchAdminStats: async () => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      console.error('Accès non autorisé pour récupérer les statistiques');
      return;
    }

    try {
      console.log('🔄 Récupération des statistiques admin...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
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

      const data = await response.json();
      console.log('✅ Réponse API /stats complète:', data);

      if (data.status === 'success') {
        // ✅ Mapper exactement selon la structure API réelle
        const stats: AdminStats = {
          totalUsers: data.totalUsers || 0,
          activeUsers: data.activeUsers || 0,
          inactiveUsers: data.inactiveUsers || 0,
          totalPlayers: data.totalPlayers || 0,
          totalCashiers: data.totalCashiers || 0,
          totalAdmins: data.totalAdmins || 0,
        };

        console.log('📊 Statistiques complètes récupérées:', stats);
        set({ adminStats: stats });
      } else {
        console.error('Format de réponse API inattendu:', data);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
    }
  },

  // 🆕 NOUVELLE API: Activer/Désactiver un utilisateur
  toggleUserStatus: async (userId: string) => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      return { success: false, message: 'Accès non autorisé' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { adminUsers } = get();
        const updatedUsers = adminUsers.map(u => 
          u.id === userId ? { ...u, enabled: !u.enabled } : u
        );
        set({ adminUsers: updatedUsers });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Échec de la modification du statut' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur lors de la modification du statut' };
    }
  },

  // 🆕 NOUVELLE API: Changer le rôle d'un utilisateur
  toggleUserRole: async (accountId: number, newRole: UserRole) => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      return { success: false, message: 'Accès non autorisé' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${accountId}/toggle-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        const { adminUsers } = get();
        const updatedUsers = adminUsers.map(u => 
          u.accountId === accountId ? { ...u, role: newRole } : u
        );
        set({ adminUsers: updatedUsers });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Échec de la modification du rôle' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erreur lors de la modification du rôle' };
    }
  },
  
  register: async (email: string, password: string, name: string, role: UserRole, phone?: string, country?: string, referralCode?: string) => {
    // This function is now primarily for local state update after successful API registration
    // The actual registration API call is handled in Register.tsx
    return true;
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('tokenAbilities');
    localStorage.removeItem('tokenExpiresAt');
    set({ 
      user: null, 
      isAuthenticated: false, 
      authToken: null,
      adminUsers: [],
      adminStats: null,
      usersPagination: null // 🆕 Reset pagination
    });
  },
  
  updateCoins: (amount: number) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, coins: user.coins + amount };
      set(state => ({
        user: updatedUser,
        users: state.users.map(u => u.id === user.id ? updatedUser : u)
      }));
    }
  },
  
  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...userData };
      set(state => ({
        user: updatedUser,
        users: state.users.map(u => u.id === user.id ? updatedUser : u)
      }));
    }
  },
  
  updateUserCoins: (userId: string, amount: number) => {
    set(state => ({
      users: state.users.map(u => 
        u.id === userId ? { ...u, coins: u.coins + amount } : u
      )
    }));
  },
  
  fetchGames: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/games`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        set({ games: data.data.data }); // Correctly access the nested data array
      } else {
        set({ games: [] });
      }
    } catch (err) {
      console.error('Impossible de charger les jeux.', err);
      set({ games: [] }); // Ensure games is an array on error
    }
  },

  addGame: async (gameData: FormData) => {
    const { authToken, user } = get();
    if (!authToken || !user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/games`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: gameData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add game');
    }

    set(state => ({
      games: [...state.games, data.data]
    }));

    return data;
  },

  updateGame: async (id: string, game: Partial<Game>) => {
    const { authToken, user } = get();
    if (!authToken || !user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/games/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(game)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update game');
    }

    set(state => ({
      games: state.games.map(g => g.id === id ? data.data : g)
    }));

    return data;
  },

  deleteGame: async (id: string) => {
    const { authToken, user } = get();
    if (!authToken || !user || user.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/games/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete game');
    }

    set(state => ({
      games: state.games.filter(g => g.id !== id)
    }));

    return data;
  },

  createRechargeRequest: async (request: RechargeRequest) => {
    const { authToken, user } = get();
    if (!user || !authToken) throw new Error('User not authenticated');

    const formData = new FormData();
    formData.append('amount', request.amount.toString());
    formData.append('network', request.network);
    formData.append('address', request.address);
    formData.append('proofFile', request.proofFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/recharge-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create recharge request');
      }

      // Optionally update local state if needed, e.g., add to transactions list
      // For now, just log success
      console.log('Recharge request created successfully:', data);

    } catch (error) {
      console.error('Error creating recharge request:', error);
      throw error;
    }
  },

  createWithdrawalRequest: async (request: WithdrawalRequest) => {
    const { authToken, user } = get();
    if (!user || !authToken) throw new Error('User not authenticated');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/withdrawal-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create withdrawal request');
      }

      // Optionally update local state if needed
      console.log('Withdrawal request created successfully:', data);

    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      throw error;
    }
  },

  createCashierRequest: async (request: Partial<CashierRequest>) => {
    const { authToken, user } = get();
    if (!user || !authToken) throw new Error('User not authenticated');

    const formData = new FormData();
    formData.append('motivation', request.motivation || '');
    formData.append('experience', request.experience || '');
    formData.append('availability', request.availability || '');
    formData.append('region', request.region || '');
    formData.append('expectedVolume', request.expectedVolume || '');
    formData.append('referrals', request.referrals || '');
    request.languages?.forEach(lang => formData.append('languages[]', lang));

    if (request.identityDocument) formData.append('identityDocument', request.identityDocument);
    if (request.proofOfAddress) formData.append('proofOfAddress', request.proofOfAddress);
    if (request.bankStatement) formData.append('bankStatement', request.bankStatement);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/cashier-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create cashier request');
      }

      console.log('Cashier request created successfully:', data);

    } catch (error) {
      console.error('Error creating cashier request:', error);
      throw error;
    }
  },

  approveCashierRequest: async (requestId: string, reviewNotes?: string) => {
    const { authToken, user } = get();
    if (!user || user.role !== 'admin' || !authToken) throw new Error('Unauthorized');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/cashier-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ reviewNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve cashier request');
      }

      console.log('Cashier request approved successfully:', data);

    } catch (error) {
      console.error('Error approving cashier request:', error);
      throw error;
    }
  },

  rejectCashierRequest: async (requestId: string, reviewNotes?: string) => {
    const { authToken, user } = get();
    if (!user || user.role !== 'admin' || !authToken) throw new Error('Unauthorized');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/cashier-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ reviewNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reject cashier request');
      }

      console.log('Cashier request rejected successfully:', data);

    } catch (error) {
      console.error('Error rejecting cashier request:', error);
      throw error;
    }
  },

  createCashier: async (cashierData: any) => {
    const { authToken, user } = get();
    if (!user || user.role !== 'admin' || !authToken) throw new Error('Unauthorized');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/cashiers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(cashierData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create cashier');
      }

      console.log('Cashier created successfully:', data);

    } catch (error) {
      console.error('Error creating cashier:', error);
      throw error;
    }
  },

  rechargeCashier: async (username: string, amount: number) => {
    const { authToken, user } = get();
    if (!authToken || !user || user.role !== 'admin') {
      console.error('Accès non autorisé pour recharger un caissier');
      return false;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/cashiers/recharge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ username, amount })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Mettre à jour la liste des utilisateurs localement
        const { adminUsers } = get();
        const updatedUsers = adminUsers.map(u =>
          u.username === username ? { ...u, coins: u.coins + amount } : u
        );
        set({ adminUsers: updatedUsers });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la recharge du caissier:', error);
      return false;
    }
  },

  rechargeUser: async (username: string, amount: number) => {
    const { authToken, user } = get();
    if (!authToken || !user || (user.role !== 'admin' && user.role !== 'cashier')) {
      return { success: false, message: 'Accès non autorisé pour recharger un utilisateur' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/recharge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, amount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      if (data.status === 'success') {
        // Mettre à jour l'état local
        set(state => ({
          adminUsers: state.adminUsers.map(u => 
            u.username === username ? { ...u, coins: u.coins + amount } : u
          )
        }));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Une erreur est survenue' };
      }
    } catch (error: any) {
      console.error("Erreur lors de la recharge de l'utilisateur:", error);
      return { success: false, message: error.message || "Erreur lors de la recharge de l'utilisateur" };
    }
  },

  rechargePlayerByCashier: async (username: string, amount: number) => {
    const { authToken, user } = get();
    if (!authToken || !user || user.role !== 'cashier') {
      return { success: false, message: 'Accès non autorisé' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cashier/recharge`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, amount })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Mettre à jour le solde du caissier
        set(state => ({
          user: state.user ? { ...state.user, coins: state.user.coins - amount } : null
        }));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Une erreur est survenue' };
      }
    } catch (error: any) {
      console.error('Erreur lors de la recharge par le caissier:', error);
      return { success: false, message: error.message || 'Erreur lors de la recharge' };
    }
  },

  fetchAffiliateStats: async () => {
    const { authToken } = get();
    if (!authToken) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/affiliate/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        set({ affiliateStats: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch affiliate stats:', error);
    }
  },

  fetchCashierStats: async () => {
    const { authToken } = get();
    if (!authToken) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cashier/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        set({ cashierStats: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch cashier stats:', error);
    }
  },

  fetchPlayerStats: async () => {
    const { authToken } = get();
    if (!authToken) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/player/stats`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        set({ playerStats: data.data });
      }
    } catch (error) {
      console.error('Failed to fetch player stats:', error);
    }
  },

  requestWithdrawal: async (amount: number, network: string, address: string) => {
    const { authToken, user } = get();
    if (!authToken || !user) {
      return { success: false, message: 'Utilisateur non authentifié' };
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/player/withdrawal-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, network, address }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        // Mettre à jour le solde de l'utilisateur localement
        set(state => ({
          user: state.user ? { ...state.user, coins: state.user.coins - amount } : null
        }));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Une erreur est survenue' };
      }
    } catch (error: any) {
      console.error('Erreur lors de la demande de retrait:', error);
      return { success: false, message: error.message || 'Erreur lors de la demande de retrait' };
    }
  },
}));

// Initialize auth state
if (localStorage.getItem('authToken')) {
  useAuthStore.getState().fetchCurrentUser();
}

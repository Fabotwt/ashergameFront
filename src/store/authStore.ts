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
  category: string;
  image: string;
  description: string;
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
  usersPagination: PaginationMeta | null; // 🆕 Métadonnées de pagination
  games: Game[];
  transactions: Transaction[];
  affiliates: Affiliate[];
  affiliateEarnings: AffiliateEarning[];
  cashierRequests: CashierRequest[];
  isAuthenticated: boolean;
  authToken: string | null;
  isLoadingUser: boolean;
  isLoadingAdminData: boolean;
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
}

// Mock users for demo
const mockUsers: User[] = [
  { id: '1', email: 'admin@ashergame.com', name: 'Admin', role: 'admin', coins: 10000, phone: '+33123456789', country: 'FR' },
  { id: '2', email: 'cashier@ashergame.com', name: 'Caissier', role: 'cashier', coins: 5000, phone: '+33987654321', country: 'FR' },
  { id: '3', email: 'player@ashergame.com', name: 'Joueur', role: 'player', coins: 1000, phone: '+33456789123', country: 'FR' },
  { id: '4', email: 'player2@ashergame.com', name: 'Marie Dubois', role: 'player', coins: 2500, phone: '+33789123456', country: 'BE' },
  { id: '5', email: 'cashier2@ashergame.com', name: 'Ahmed Ben Ali', role: 'cashier', coins: 7500, phone: '+33321654987', country: 'MA' },
];

// Mock games for demo
const mockGames: Game[] = [
  {
    id: '1',
    name: 'Mobile Legends',
    category: 'MOBA',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    description: 'Le MOBA mobile le plus populaire au monde',
    rating: 4.8,
    players: '100M+'
  },
  {
    id: '2',
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    description: 'Battle royale intense avec 100 joueurs',
    rating: 4.7,
    players: '50M+'
  },
  {
    id: '3',
    name: 'Free Fire',
    category: 'Battle Royale',
    image: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg',
    description: 'Action rapide en 10 minutes maximum',
    rating: 4.6,
    players: '80M+'
  }
];

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '3',
    type: 'deposit',
    amount: 1000,
    description: 'Recharge USDT TRC20',
    status: 'completed',
    reference: 'TXN001',
    network: 'TRC20',
    createdAt: '2025-01-15T14:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    type: 'purchase',
    amount: -50,
    description: 'Achat Mobile Legends - Skin',
    status: 'completed',
    reference: 'PUR001',
    createdAt: '2025-01-14T09:15:00Z'
  },
  {
    id: '3',
    userId: '3',
    type: 'affiliate',
    amount: 200,
    description: 'Commission parrainage - Marie Dubois',
    status: 'completed',
    reference: 'AFF001',
    createdAt: '2025-01-13T16:45:00Z'
  },
  {
    id: '4',
    userId: '3',
    type: 'referral_bonus',
    amount: 500,
    description: 'Bonus de parrainage - Code WELCOME50',
    status: 'completed',
    reference: 'REF001',
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: '5',
    userId: '3',
    type: 'deposit',
    amount: 500,
    description: 'Recharge par caissier',
    status: 'completed',
    reference: 'CSH001',
    createdAt: '2025-01-12T11:20:00Z'
  },
  {
    id: '6',
    userId: '3',
    type: 'deposit',
    amount: 2000,
    description: 'Recharge USDT BEP20',
    status: 'pending',
    reference: 'TXN002',
    network: 'BEP20',
    createdAt: '2025-01-15T18:00:00Z'
  },
  {
    id: '7',
    userId: '3',
    type: 'withdrawal',
    amount: -500,
    description: 'Retrait USDT TRC20',
    status: 'pending',
    reference: 'WTH001',
    network: 'TRC20',
    recipientAddress: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
    fee: 1,
    createdAt: '2025-01-15T20:00:00Z'
  }
];

// Mock affiliates
const mockAffiliates: Affiliate[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    email: 'marie@example.com',
    joinedAt: '2025-01-10T10:00:00Z',
    status: 'active',
    firstDepositAmount: 1000
  },
  {
    id: '2',
    name: 'Pierre Martin',
    email: 'pierre@example.com',
    joinedAt: '2025-01-12T15:30:00Z',
    status: 'active',
    firstDepositAmount: 500
  },
  {
    id: '3',
    name: 'Sophie Leroy',
    email: 'sophie@example.com',
    joinedAt: '2025-01-14T09:15:00Z',
    status: 'pending'
  }
];

// Mock affiliate earnings
const mockAffiliateEarnings: AffiliateEarning[] = [
  {
    id: '1',
    affiliateId: '1',
    affiliateName: 'Marie Dubois',
    amount: 200,
    originalAmount: 1000,
    createdAt: '2025-01-10T12:00:00Z'
  },
  {
    id: '2',
    affiliateId: '2',
    affiliateName: 'Pierre Martin',
    amount: 100,
    originalAmount: 500,
    createdAt: '2025-01-12T16:00:00Z'
  }
];

// Valid referral codes for demo
const validReferralCodes = ['ASHERGAME2025', 'WELCOME50', 'BONUS100', 'FRIEND20'];

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
  users: mockUsers,
  adminUsers: [],
  adminStats: null,
  usersPagination: null, // 🆕 Initialisation pagination
  games: mockGames,
  transactions: mockTransactions,
  affiliates: mockAffiliates,
  affiliateEarnings: mockAffiliateEarnings,
  cashierRequests: [],
  isAuthenticated: false,
  authToken: localStorage.getItem('authToken'),
  isLoadingUser: false,
  isLoadingAdminData: false,
  
  login: async (email: string, password: string) => {
    try {
      // Récupérer le token depuis localStorage (déjà stocké par Login.tsx)
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        console.error('Aucun token trouvé dans localStorage');
        return false;
      }

      // Pour la démo, utiliser les utilisateurs mock basés sur l'email
      // Dans une vraie app, vous feriez une requête API pour récupérer les données utilisateur
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        set({ 
          user, 
          isAuthenticated: true, 
          authToken 
        });
        return true;
      } else {
        // Si l'utilisateur n'est pas dans les mocks, créer un utilisateur basique
        // En production, vous récupéreriez les données depuis l'API
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0], // Utiliser la partie avant @ comme nom
          role: 'player',
          coins: 1000
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          authToken,
          users: [...get().users, newUser]
        });
        return true;
      }
    } catch (error) {
      console.error('Erreur lors de la connexion locale:', error);
      return false;
    }
  },

  fetchCurrentUser: async () => {
    const { authToken } = get();
    
    if (!authToken) {
      console.error('Aucun token d\'authentification trouvé');
      return;
    }

    set({ isLoadingUser: true });

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
          isLoadingUser: false
        });
      } else {
        console.error('Format de réponse API inattendu:', data);
        set({ isLoadingUser: false });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      
      // En cas d'erreur, utiliser les données mock si disponibles
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        // Fallback vers les données mock ou créer un utilisateur basique
        const fallbackUser: User = {
          id: Date.now().toString(),
          email: 'user@ashergame.com',
          name: 'Utilisateur',
          role: 'player',
          coins: 1000
        };

        set({ 
          user: fallbackUser,
          isAuthenticated: true,
          isLoadingUser: false
        });
      } else {
        set({ isLoadingUser: false });
      }
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
      console.error('Accès non autorisé pour modifier le statut utilisateur');
      return false;
    }

    try {
      console.log(`🔄 Modification du statut utilisateur ${userId}...`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/toggle-status`, {
        method: 'PUT',
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
      console.log('✅ Réponse API toggle-status:', data);

      if (data.status === 'success') {
        // Mettre à jour la liste des utilisateurs localement
        const { adminUsers } = get();
        const updatedUsers = adminUsers.map(u => 
          u.id === userId ? { ...u, enabled: !u.enabled } : u
        );
        
        set({ adminUsers: updatedUsers });
        console.log(`✅ Statut utilisateur ${userId} modifié avec succès`);
        return true;
      } else {
        console.error('Échec de la modification du statut:', data);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la modification du statut:', error);
      return false;
    }
  },

  // 🆕 NOUVELLE API: Changer le rôle d'un utilisateur
  toggleUserRole: async (accountId: number, newRole: UserRole) => {
    const { authToken, user } = get();
    
    if (!authToken || !user || user.role !== 'admin') {
      console.error('Accès non autorisé pour modifier le rôle utilisateur');
      return false;
    }

    try {
      console.log(`🔄 Modification du rôle utilisateur ${accountId} vers ${newRole}...`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${accountId}/toggle-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Réponse API toggle-role:', data);

      if (data.status === 'success') {
        // Mettre à jour la liste des utilisateurs localement
        const { adminUsers } = get();
        const updatedUsers = adminUsers.map(u => 
          u.accountId === accountId ? { ...u, role: newRole } : u
        );
        
        set({ adminUsers: updatedUsers });
        console.log(`✅ Rôle utilisateur ${accountId} modifié vers ${newRole} avec succès`);
        return true;
      } else {
        console.error('Échec de la modification du rôle:', data);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la modification du rôle:', error);
      return false;
    }
  },
  
  register: async (email: string, password: string, name: string, role: UserRole, phone?: string, country?: string, referralCode?: string) => {
    // Mock registration
    let initialCoins = 1000; // Coins de base
    
    // Bonus de parrainage
    if (referralCode && validReferralCodes.includes(referralCode.toUpperCase())) {
      initialCoins += 500; // Bonus d'inscription avec code de parrainage
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      coins: initialCoins,
      phone,
      country,
      referralCode: referralCode?.toUpperCase(),
    };
    
    // Ajouter transaction de bonus si code de parrainage valide
    const newTransactions = [...get().transactions];
    if (referralCode && validReferralCodes.includes(referralCode.toUpperCase())) {
      const bonusTransaction: Transaction = {
        id: Date.now().toString(),
        userId: newUser.id,
        type: 'referral_bonus',
        amount: 500,
        description: `Bonus de parrainage - Code ${referralCode.toUpperCase()}`,
        status: 'completed',
        reference: `REF${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      newTransactions.unshift(bonusTransaction);
    }
    
    // Add to users list
    set(state => ({
      user: newUser,
      users: [...state.users, newUser],
      transactions: newTransactions,
      isAuthenticated: true
    }));
    
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
  
  addGame: (game: Game) => {
    set(state => ({
      games: [...state.games, game]
    }));
  },

  createRechargeRequest: async (request: RechargeRequest) => {
    const { user } = get();
    if (!user) return;

    // Simulate file upload and create transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'deposit',
      amount: request.amount,
      description: `Recharge USDT ${request.network}`,
      status: 'pending',
      reference: `TXN${Date.now()}`,
      network: request.network,
      proof: URL.createObjectURL(request.proofFile), // In real app, this would be uploaded to server
      createdAt: new Date().toISOString()
    };

    set(state => ({
      transactions: [newTransaction, ...state.transactions]
    }));
  },

  createWithdrawalRequest: async (request: WithdrawalRequest) => {
    const { user } = get();
    if (!user) return;

    // Create withdrawal transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'withdrawal',
      amount: -request.amount, // Negative for withdrawal
      description: `Retrait USDT ${request.network}`,
      status: 'pending',
      reference: `WTH${Date.now()}`,
      network: request.network,
      recipientAddress: request.recipientAddress,
      fee: request.fee,
      createdAt: new Date().toISOString()
    };

    // Temporarily deduct coins (will be restored if rejected)
    const updatedUser = { ...user, coins: user.coins - request.amount };

    set(state => ({
      user: updatedUser,
      users: state.users.map(u => u.id === user.id ? updatedUser : u),
      transactions: [newTransaction, ...state.transactions]
    }));
  },

  createCashierRequest: async (request: Partial<CashierRequest>) => {
    const { user } = get();
    if (!user) return;

    const newRequest: CashierRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      motivation: request.motivation || '',
      experience: request.experience || '',
      availability: request.availability || '',
      region: request.region || '',
      languages: request.languages || [],
      expectedVolume: request.expectedVolume || '',
      referrals: request.referrals || '',
      identityDocument: request.identityDocument || null,
      proofOfAddress: request.proofOfAddress || null,
      bankStatement: request.bankStatement || null,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    set(state => ({
      cashierRequests: [...state.cashierRequests, newRequest]
    }));
  },

  approveCashierRequest: async (requestId: string, reviewNotes?: string) => {
    const { user } = get();
    if (!user || user.role !== 'admin') return;

    set(state => ({
      cashierRequests: state.cashierRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'approved' as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: user.id,
              reviewNotes
            }
          : req
      )
    }));
  },

  rejectCashierRequest: async (requestId: string, reviewNotes?: string) => {
    const { user } = get();
    if (!user || user.role !== 'admin') return;

    set(state => ({
      cashierRequests: state.cashierRequests.map(req =>
        req.id === requestId
          ? {
              ...req,
              status: 'rejected' as const,
              reviewedAt: new Date().toISOString(),
              reviewedBy: user.id,
              reviewNotes
            }
          : req
      )
    }));
  },

  createCashier: async (cashierData: any) => {
    const newCashier: User = {
      id: Date.now().toString(),
      email: cashierData.email,
      name: cashierData.name,
      role: 'cashier',
      coins: cashierData.initialCoins || 5000,
      phone: cashierData.phone,
      country: cashierData.country,
    };

    set(state => ({
      users: [...state.users, newCashier]
    }));
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
}));

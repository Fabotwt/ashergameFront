import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Copy, 
  Share2, 
  Calendar,
  Eye,
  Gift,
  UserPlus,
  DollarSign
} from 'lucide-react';

export const Affiliates: React.FC = () => {
  const { user, affiliateStats, fetchAffiliateStats } = useAuthStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchAffiliateStats();
  }, [fetchAffiliateStats]);

  if (!user) return null;

  const referralLink = `https://ashergame.online/register?ref=${user.username}`;
  
  const totalEarnings = affiliateStats?.totalEarnings || 0;
  const totalAffiliates = affiliateStats?.referredUsersCount || 0;
  const commissionTransactions = affiliateStats?.commissionTransactions || [];
  const referredUsers = affiliateStats?.referredUsers || [];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Rejoignez Ashergame',
        text: 'Inscrivez-vous sur Ashergame et commencez à jouer !',
        url: referralLink,
      });
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Programme d'Affiliation</h1>
            <p className="text-base-content/70">Gagnez 20% du premier dépôt de vos filleuls</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Affiliés</div>
              <div className="stat-value text-primary">{totalAffiliates}</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-success">
                <Coins className="w-8 h-8" />
              </div>
              <div className="stat-title">Gains Totaux</div>
              <div className="stat-value text-success">{totalEarnings.toLocaleString()}</div>
              <div className="stat-desc">coins gagnés</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-secondary">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Ce Mois</div>
              <div className="stat-value text-secondary">{totalEarnings.toLocaleString()}</div>
              <div className="stat-desc">Total des gains</div>
            </div>
            
            <div className="stat bg-base-200 rounded-lg shadow-lg">
              <div className="stat-figure text-accent">
                <DollarSign className="w-8 h-8" />
              </div>
              <div className="stat-title">Commission</div>
              <div className="stat-value text-accent">20%</div>
              <div className="stat-desc">du 1er dépôt</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="card bg-base-200 shadow-lg mb-6">
            <div className="card-body">
              <h3 className="card-title mb-4">
                <Share2 className="w-6 h-6" />
                Votre Lien de Parrainage
              </h3>
              
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lien de parrainage</span>
                    </label>
                    <div className="join">
                      <input
                        type="text"
                        value={referralLink}
                        className="input input-bordered join-item flex-1"
                        readOnly
                      />
                      <button
                        className={`btn join-item ${copied ? 'btn-success' : 'btn-outline'}`}
                        onClick={copyReferralLink}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? 'Copié !' : 'Copier'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={shareReferralLink}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </button>
                </div>
              </div>

              <div className="alert alert-info mt-4">
                <Gift className="w-5 h-5" />
                <div>
                  <h4 className="font-bold">Comment ça marche ?</h4>
                  <p className="text-sm">
                    Partagez votre lien de parrainage. Quand quelqu'un s'inscrit et fait son premier dépôt, 
                    vous recevez 20% de ce montant en coins !
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Affiliates List */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <Users className="w-6 h-6" />
                  Mes Affiliés ({referredUsers.length})
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {referredUsers.map((affiliate) => (
                    <div key={affiliate.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {affiliate.name ? affiliate.name.charAt(0).toUpperCase() : 'A'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{affiliate.name || 'Utilisateur Anonyme'}</div>
                          <div className="text-sm text-base-content/70">
                            Inscrit le {new Date(affiliate.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {referredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <UserPlus className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                      <p className="text-base-content/70">Aucun affilié pour le moment</p>
                      <p className="text-sm text-base-content/50 mt-2">
                        Partagez votre lien pour commencer à gagner !
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Earnings History */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <Coins className="w-6 h-6" />
                  Historique des Gains
                </h3>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {commissionTransactions.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-3 bg-base-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                          <Coins className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <div className="font-medium">{earning.description}</div>
                          <div className="text-sm text-base-content/70 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(earning.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">
                          +{earning.amount.toLocaleString()} coins
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {commissionTransactions.length === 0 && (
                    <div className="text-center py-8">
                      <Coins className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                      <p className="text-base-content/70">Aucun gain pour le moment</p>
                      <p className="text-sm text-base-content/50 mt-2">
                        Vos commissions apparaîtront ici
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

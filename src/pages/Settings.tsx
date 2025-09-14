import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Swal from 'sweetalert2';

interface SettingsData {
  adminEmail: string;
  adminPhone: string;
  usdtTrc: string;
  usdtBep: string;
  tauxCaissier: number;
  commissionReference: number;
  withdrawMin: number;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
  maintenance: boolean;
  recharge: boolean;
  retrait: boolean;
}

export const Settings: React.FC = () => {
  const { authToken, user } = useAuthStore();
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user?.role !== 'admin') {
        setError('Accès non autorisé.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const result = await response.json();
        setSettings(result.settings);
      } catch (err) {
        console.error('Erreur lors de la récupération des paramètres:', err);
        setError('Impossible de charger les paramètres.');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchSettings();
    }
  }, [authToken, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    if (settings) {
        setSettings({
            ...settings,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
        });
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      Swal.fire('Succès', 'Paramètres mis à jour avec succès!', 'success');
    } catch (err) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      Swal.fire('Erreur', 'Impossible de mettre à jour les paramètres.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
        <SettingsIcon className="w-8 h-8" />
        Paramètres de l'application
      </h1>

      {settings && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields */}
              <div className="form-control">
                <label className="label"><span className="label-text">Email Admin</span></label>
                <input type="text" name="adminEmail" value={settings.adminEmail} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Téléphone Admin</span></label>
                <input type="text" name="adminPhone" value={settings.adminPhone} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">USDT TRC20</span></label>
                <input type="text" name="usdtTrc" value={settings.usdtTrc} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">USDT BEP20</span></label>
                <input type="text" name="usdtBep" value={settings.usdtBep} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Taux Caissier</span></label>
                <input type="number" name="tauxCaissier" value={settings.tauxCaissier} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Commission de référence</span></label>
                <input type="number" name="commissionReference" value={settings.commissionReference} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Retrait Minimum</span></label>
                <input type="number" name="withdrawMin" value={settings.withdrawMin} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Facebook</span></label>
                <input type="text" name="facebook" value={settings.facebook} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Instagram</span></label>
                <input type="text" name="instagram" value={settings.instagram} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">TikTok</span></label>
                <input type="text" name="tiktok" value={settings.tiktok} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">WhatsApp</span></label>
                <input type="text" name="whatsapp" value={settings.whatsapp} onChange={handleInputChange} className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Maintenance</span> 
                  <input type="checkbox" name="maintenance" checked={settings.maintenance} onChange={handleInputChange} className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Recharge</span> 
                  <input type="checkbox" name="recharge" checked={settings.recharge} onChange={handleInputChange} className="toggle toggle-primary" />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Retrait</span> 
                  <input type="checkbox" name="retrait" checked={settings.retrait} onChange={handleInputChange} className="toggle toggle-primary" />
                </label>
              </div>
            </div>
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                <Save className="w-5 h-5 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

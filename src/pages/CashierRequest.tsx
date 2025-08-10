import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  UserPlus, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Phone,
  MapPin,
  Mail,
  User,
  Clock,
  Shield,
  Banknote,
  Users
} from 'lucide-react';

export const CashierRequest: React.FC = () => {
  const { user, createCashierRequest } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    motivation: '',
    experience: '',
    availability: '',
    region: '',
    languages: [] as string[],
    identityDocument: null as File | null,
    proofOfAddress: null as File | null,
    bankStatement: null as File | null,
    expectedVolume: '',
    referrals: ''
  });

  if (!user || user.role !== 'player') {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto text-warning mb-4" />
          <h2 className="text-2xl font-bold mb-2">Accès Restreint</h2>
          <p className="text-base-content/70">Seuls les joueurs peuvent faire une demande pour devenir caissier.</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createCashierRequest(formData);
      setStep(4);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = () => {
    return formData.motivation.length >= 100 && 
           formData.experience.length >= 50 && 
           formData.availability && 
           formData.region;
  };

  const isStep2Valid = () => {
    return formData.languages.length > 0 && 
           formData.expectedVolume && 
           formData.referrals;
  };

  const isStep3Valid = () => {
    return formData.identityDocument && 
           formData.proofOfAddress && 
           formData.bankStatement;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Informations Personnelles</h2>
        <p className="text-base-content/70">Parlez-nous de vous et de votre motivation</p>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Motivation *</span>
          <span className="label-text-alt">{formData.motivation.length}/500</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-32"
          placeholder="Expliquez pourquoi vous souhaitez devenir caissier sur Ashergame (minimum 100 caractères)..."
          value={formData.motivation}
          onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
          maxLength={500}
        />
        {formData.motivation.length > 0 && formData.motivation.length < 100 && (
          <label className="label">
            <span className="label-text-alt text-error">Minimum 100 caractères requis</span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Expérience *</span>
          <span className="label-text-alt">{formData.experience.length}/300</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Décrivez votre expérience avec les cryptomonnaies, les jeux mobiles ou le service client (minimum 50 caractères)..."
          value={formData.experience}
          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
          maxLength={300}
        />
        {formData.experience.length > 0 && formData.experience.length < 50 && (
          <label className="label">
            <span className="label-text-alt text-error">Minimum 50 caractères requis</span>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Disponibilité *</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.availability}
            onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
          >
            <option value="">Sélectionner</option>
            <option value="temps-plein">Temps plein (8h+/jour)</option>
            <option value="temps-partiel">Temps partiel (4-8h/jour)</option>
            <option value="weekend">Week-ends uniquement</option>
            <option value="soiree">Soirées (18h-23h)</option>
            <option value="flexible">Horaires flexibles</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Région *</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.region}
            onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
          >
            <option value="">Sélectionner</option>
            <option value="france">France</option>
            <option value="belgique">Belgique</option>
            <option value="suisse">Suisse</option>
            <option value="canada">Canada</option>
            <option value="maroc">Maroc</option>
            <option value="tunisie">Tunisie</option>
            <option value="algerie">Algérie</option>
            <option value="senegal">Sénégal</option>
            <option value="cote-ivoire">Côte d'Ivoire</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={() => setStep(2)}
        disabled={!isStep1Valid()}
      >
        Continuer
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Compétences et Objectifs</h2>
        <p className="text-base-content/70">Détaillez vos compétences et vos objectifs</p>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Langues parlées *</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['Français', 'Anglais', 'Arabe', 'Espagnol', 'Allemand', 'Italien'].map(lang => (
            <label key={lang} className="label cursor-pointer">
              <span className="label-text">{lang}</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.languages.includes(lang)}
                onChange={() => handleLanguageToggle(lang)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Volume mensuel estimé *</span>
        </label>
        <select
          className="select select-bordered"
          value={formData.expectedVolume}
          onChange={(e) => setFormData(prev => ({ ...prev, expectedVolume: e.target.value }))}
        >
          <option value="">Sélectionner</option>
          <option value="1000-5000">1,000 - 5,000 USDT</option>
          <option value="5000-10000">5,000 - 10,000 USDT</option>
          <option value="10000-25000">10,000 - 25,000 USDT</option>
          <option value="25000-50000">25,000 - 50,000 USDT</option>
          <option value="50000+">50,000+ USDT</option>
        </select>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Comment comptez-vous attirer des clients ? *</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Décrivez votre stratégie pour attirer et fidéliser des joueurs..."
          value={formData.referrals}
          onChange={(e) => setFormData(prev => ({ ...prev, referrals: e.target.value }))}
          maxLength={300}
        />
      </div>

      <div className="alert alert-info">
        <Info className="w-5 h-5" />
        <div>
          <p className="font-medium">Commission Caissier</p>
          <p className="text-sm">
            En tant que caissier, vous recevrez une commission de 2-5% sur chaque transaction selon votre volume mensuel.
          </p>
        </div>
      </div>

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
          disabled={!isStep2Valid()}
        >
          Continuer
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Documents Requis</h2>
        <p className="text-base-content/70">Téléchargez les documents nécessaires pour votre candidature</p>
      </div>

      <div className="alert alert-warning">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <p className="font-medium">Documents Obligatoires</p>
          <p className="text-sm">
            Tous les documents doivent être clairs, lisibles et en cours de validité. 
            Formats acceptés : JPG, PNG, PDF (max 5MB par fichier).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Identity Document */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="card-title text-base">
              <User className="w-5 h-5" />
              Pièce d'identité *
            </h4>
            <p className="text-sm text-base-content/70 mb-3">
              Carte d'identité, passeport ou permis de conduire
            </p>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload('identityDocument', e.target.files?.[0] || null)}
            />
            {formData.identityDocument && (
              <div className="text-success text-sm mt-2">
                ✓ {formData.identityDocument.name}
              </div>
            )}
          </div>
        </div>

        {/* Proof of Address */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="card-title text-base">
              <MapPin className="w-5 h-5" />
              Justificatif de domicile *
            </h4>
            <p className="text-sm text-base-content/70 mb-3">
              Facture (électricité, gaz, internet) de moins de 3 mois
            </p>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload('proofOfAddress', e.target.files?.[0] || null)}
            />
            {formData.proofOfAddress && (
              <div className="text-success text-sm mt-2">
                ✓ {formData.proofOfAddress.name}
              </div>
            )}
          </div>
        </div>

        {/* Bank Statement */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h4 className="card-title text-base">
              <Banknote className="w-5 h-5" />
              Relevé bancaire *
            </h4>
            <p className="text-sm text-base-content/70 mb-3">
              Relevé bancaire des 3 derniers mois ou RIB
            </p>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileUpload('bankStatement', e.target.files?.[0] || null)}
            />
            {formData.bankStatement && (
              <div className="text-success text-sm mt-2">
                ✓ {formData.bankStatement.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="alert alert-info">
        <Shield className="w-5 h-5" />
        <div>
          <p className="font-medium">Confidentialité</p>
          <p className="text-sm">
            Vos documents sont traités de manière confidentielle et sécurisée. 
            Ils ne seront utilisés que pour la vérification de votre candidature.
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
          disabled={!isStep3Valid() || loading}
        >
          {loading ? 'Envoi...' : 'Soumettre la Demande'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-24 h-24 mx-auto text-success" />
      <div>
        <h2 className="text-2xl font-bold text-success mb-2">Demande Envoyée !</h2>
        <p className="text-base-content/70">
          Votre candidature pour devenir caissier a été soumise avec succès
        </p>
      </div>

      <div className="card bg-base-200 max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title justify-center">Prochaines Étapes</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <span>Examen de votre dossier (2-5 jours ouvrés)</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-info" />
              <span>Entretien téléphonique si présélectionné</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Notification de la décision par email</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-200 max-w-md mx-auto">
        <div className="card-body">
          <h3 className="card-title justify-center">Critères d'Évaluation</h3>
          <div className="space-y-2 text-left text-sm">
            <div>• Motivation et sérieux de la candidature</div>
            <div>• Expérience dans le domaine</div>
            <div>• Disponibilité et engagement</div>
            <div>• Validité des documents fournis</div>
            <div>• Potentiel de volume d'affaires</div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => window.location.href = '/dashboard'}
      >
        Retour au Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">
              <UserPlus className="w-8 h-8 text-primary" />
              Devenir Caissier
            </h1>
            <p className="text-base-content/70">Rejoignez notre équipe de caissiers et gagnez des commissions</p>
          </div>

          {/* Progress Steps */}
          <div className="steps steps-horizontal w-full mb-8">
            <div className={`step ${step >= 1 ? 'step-primary' : ''}`}>Profil</div>
            <div className={`step ${step >= 2 ? 'step-primary' : ''}`}>Compétences</div>
            <div className={`step ${step >= 3 ? 'step-primary' : ''}`}>Documents</div>
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

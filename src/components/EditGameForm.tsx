import React, { useState } from 'react';
import { useAuthStore, Game } from '../store/authStore';
import { Save, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface EditGameFormProps {
  game: Game;
  onClose: () => void;
}

export const EditGameForm: React.FC<EditGameFormProps> = ({ game, onClose }) => {
  const { updateGame } = useAuthStore();
  const [gameForm, setGameForm] = useState(game);
  const [loading, setLoading] = useState(false);

  const handleUpdateGame = async () => {
    setLoading(true);
    try {
      const response = await updateGame(gameForm.id, gameForm);
      toast.success(response.message);
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update game');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card bg-base-200 shadow-lg w-full max-w-2xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="card-title text-primary">Modifier le jeu</h3>
            <button className="btn btn-sm btn-ghost" onClick={onClose}>
              <X />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nom du jeu</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Mobile Legends"
                className="input input-bordered"
                value={gameForm.name}
                onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Slug</span>
              </label>
              <input
                type="text"
                placeholder="Ex: mobile-legends"
                className="input input-bordered"
                value={gameForm.slug}
                onChange={(e) => setGameForm({ ...gameForm, slug: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Vidéo (URL)</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="input input-bordered"
                value={gameForm.video}
                onChange={(e) => setGameForm({ ...gameForm, video: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image (URL)</span>
              </label>
              <input
                type="url"
                placeholder="https://images.pexels.com/..."
                className="input input-bordered"
                value={gameForm.image}
                onChange={(e) => setGameForm({ ...gameForm, image: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Lien du jeu</span>
              </label>
              <input
                type="url"
                placeholder="https://play.google.com/..."
                className="input input-bordered"
                value={gameForm.link}
                onChange={(e) => setGameForm({ ...gameForm, link: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Lien APK</span>
              </label>
              <input
                type="url"
                placeholder="https://apks.com/..."
                className="input input-bordered"
                value={gameForm.apk}
                onChange={(e) => setGameForm({ ...gameForm, apk: e.target.value })}
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
                onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Catégorie</span>
              </label>
              <select
                className="select select-bordered"
                value={gameForm.category}
                onChange={(e) => setGameForm({ ...gameForm, category: e.target.value })}
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
                <span className="label-text">Note (1-5)</span>
              </label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                className="input input-bordered"
                value={gameForm.rating}
                onChange={(e) => setGameForm({ ...gameForm, rating: parseFloat(e.target.value) })}
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
                onChange={(e) => setGameForm({ ...gameForm, players: e.target.value })}
              />
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleUpdateGame}
              disabled={loading}
            >
              {loading ? <Loader className="w-6 h-6 animate-spin" /> : <Save />}
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

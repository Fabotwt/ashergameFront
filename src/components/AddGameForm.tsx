import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Plus, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export const AddGameForm: React.FC = () => {
  const { addGame } = useAuthStore();
  const [gameForm, setGameForm] = useState({
    name: '',
    slug: '',
    video: '',
    image: '',
    link: '',
    apk: '',
    description: '',
    category: '',
    rating: 4.5,
    players: ''
  });
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAddGame = async () => {
    if (gameForm.name && imageFile) {
      setLoading(true);
      const formData = new FormData();
      Object.entries(gameForm).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      formData.append('image', imageFile);

      try {
        const response = await addGame(formData);
        setGameForm({
          name: '',
          slug: '',
          video: '',
          image: '',
          link: '',
          apk: '',
          description: '',
          category: '',
          rating: 4.5,
          players: ''
        });
        setImageFile(null);
        toast.success(response.message);
      } catch (error: any) {
        toast.error(error.message || 'Failed to add game');
      }
      setLoading(false);
    }
  };

  return (
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
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">&nbsp;</span>
            </label>
            <button
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={handleAddGame}
              disabled={!gameForm.name || !gameForm.category || loading}
            >
              {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'Ajouter le jeu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

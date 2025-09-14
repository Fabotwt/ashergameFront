import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Gamepad2, Plus, Edit, Trash } from 'lucide-react';
import { AddGameForm } from '../components/AddGameForm';
import { EditGameForm } from '../components/EditGameForm';
import toast from 'react-hot-toast';

export const AdminGames: React.FC = () => {
  const { user, games, fetchGames, deleteGame } = useAuthStore();
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const handleDeleteGame = async (id: string) => {
    try {
      const response = await deleteGame(id);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete game');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
        <Gamepad2 className="w-8 h-8" />
        Gestion des Jeux
      </h1>

      {user?.role === 'admin' && (
        <div className="mb-6">
          <button className="btn btn-primary" onClick={() => setIsAddingGame(!isAddingGame)}>
            <Plus className="w-5 h-5 mr-2" />
            {isAddingGame ? 'Annuler' : 'Ajouter un jeu'}
          </button>
        </div>
      )}

      {isAddingGame && <AddGameForm />}

      {editingGame && <EditGameForm game={editingGame} onClose={() => setEditingGame(null)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <div key={game.id} className="card bg-base-200 shadow-xl">
            <figure><img src={`${import.meta.env.VITE_API_URL}${game.image}`} alt={game.name} className="h-48 w-full object-cover" /></figure>
            <div className="card-body">
              <h2 className="card-title">{game.name}</h2>
              <p>{game.description}</p>
              <div className="card-actions justify-end mt-4">
                {user?.role === 'admin' && (
                  <>
                    <button className="btn btn-sm btn-info" onClick={() => setEditingGame(game)}><Edit className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-error" onClick={() => handleDeleteGame(game.id)}><Trash className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

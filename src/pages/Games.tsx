import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Loader, ServerCrash } from 'lucide-react';

// Définir une interface pour la structure d'un jeu
interface Game {
  id: string;
  name: string;
  image: string;
  slug: string;
}

// Définir une interface pour les métadonnées de pagination
interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/games?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setGames(data.data.data);
          setMeta(data.data.meta);
        } else {
          throw new Error(data.message || 'Could not fetch games');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [page]);

  const renderPagination = () => {
    if (!meta || meta.lastPage <= 1) return null;

    return (
      <div className="join">
        <button 
          className="join-item btn" 
          onClick={() => setPage(p => Math.max(1, p - 1))} 
          disabled={page === 1}
        >
          «
        </button>
        <button className="join-item btn">Page {page}</button>
        <button 
          className="join-item btn" 
          onClick={() => setPage(p => Math.min(meta.lastPage, p + 1))} 
          disabled={page === meta.lastPage}
        >
          »
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 flex items-center justify-center gap-4">
            <Gamepad2 className="w-12 h-12 text-primary" />
            Tous les Jeux
          </h1>
          <p className="text-lg text-base-content/70">Découvrez notre catalogue de jeux</p>
        </div>

        {loading && (
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p>Chargement des jeux...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-error bg-error/10 p-4 rounded-lg">
            <ServerCrash className="w-12 h-12 mx-auto mb-2" />
            <p>Erreur: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map(game => (
                <div key={game.id} className="card bg-base-200 shadow-xl image-full">
                  <figure><img src={`${import.meta.env.VITE_API_URL}${game.image}`} alt={game.name} /></figure>
                  <div className="card-body justify-end">
                    <h2 className="card-title">{game.name}</h2>
                    <div className="card-actions">
                      <Link to={`/games/${game.id}`} className="btn btn-primary btn-sm">
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              {renderPagination()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

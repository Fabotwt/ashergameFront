import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, ServerCrash, Download, PlayCircle, ArrowLeft } from 'lucide-react';

// Définir une interface pour la structure complète d'un jeu
interface Game {
  id: string;
  name: string;
  slug: string;
  image: string;
  video: string;
  link: string;
  apk: string;
  description: string;
}

export const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/games/${id}`);
        if (!response.ok) {
          throw new Error('Game not found');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setGame(data.data);
        } else {
          throw new Error(data.message || 'Could not fetch game details');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGame();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <Loader className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="text-center text-error bg-error/10 p-8 rounded-lg">
          <ServerCrash className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <Link to="/games" className="btn btn-primary mt-4">Retour aux jeux</Link>
        </div>
      </div>
    );
  }

  if (!game) {
    return <div>Jeu non trouvé.</div>; // Should be handled by the error state, but as a fallback
  }

  // Helper pour extraire l'ID de la vidéo YouTube
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(game.video);

  return (
    <div className="min-h-screen bg-base-100 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/games" className="btn btn-outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste des jeux
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video Player */}
            {videoId ? (
              <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden shadow-lg bg-black flex items-center justify-center">
                <p>Vidéo non disponible</p>
              </div>
            )}
            
            {/* Description */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-3xl">Description</h2>
                <p className="text-base-content/80 whitespace-pre-wrap">{game.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Game Info Card */}
            <div className="card bg-base-200 shadow-lg">
              <figure>
                <img src={`${import.meta.env.VITE_API_URL}${game.image}`} alt={game.name} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h1 className="card-title text-4xl font-bold">{game.name}</h1>
                <div className="flex flex-col gap-4 mt-4">
                  <a href={game.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Jouer maintenant
                  </a>
                  <a href={game.apk} target="_blank" rel="noopener noreferrer" className="btn btn-secondary w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger l'APK
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

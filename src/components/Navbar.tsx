import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, User, LogOut, Coins, History, Users, Wallet, ArrowDownLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar bg-base-200 shadow-lg border-b border-base-300">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
          <Gamepad2 className="w-6 h-6" />
          Ashergame
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {!isAuthenticated && (
            <li><Link to="/" className="text-base-content hover:text-primary">Accueil</Link></li>
          )}
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard" className="text-base-content hover:text-primary">Dashboard</Link></li>
              <li><Link to="/transactions" className="text-base-content hover:text-primary">Transactions</Link></li>
              {user?.role === 'player' && (
                <>
                  <li><Link to="/affiliates" className="text-base-content hover:text-primary">Affiliation</Link></li>
                  <li><Link to="/recharge" className="text-base-content hover:text-primary">Recharge</Link></li>
                  <li><Link to="/withdrawal" className="text-base-content hover:text-primary">Retrait</Link></li>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <li><Link to="/admin/users" className="text-base-content hover:text-primary">Utilisateurs</Link></li>
                  <li><Link to="/admin/settings" className="text-base-content hover:text-primary">Paramètres</Link></li>
                  <li><Link to="/admin/games" className="text-base-content hover:text-primary">Jeux</Link></li>
                </>
              )}
              {user?.role === 'cashier' && (
                <>
                  <li><Link to="/recharge" className="text-base-content hover:text-primary">Recharge USDT</Link></li>
                </>
              )}
            </>
          )}
        </ul>
      </div>
      
      <div className="navbar-end">
        {isAuthenticated && user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52 border border-base-300">
              <li className="menu-title">
                <span className="text-primary font-semibold">{user.name}</span>
                <span className="text-xs text-base-content/70 capitalize">{user.role}</span>
              </li>
              <li>
                <div className="flex items-center gap-2 text-success">
                  <Coins className="w-4 h-4" />
                  {user.coins.toLocaleString()} coins
                </div>
              </li>
              <div className="divider my-1"></div>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profil</Link></li>
              <li>
                <Link to="/transactions">
                  <History className="w-4 h-4" />
                  Transactions
                </Link>
              </li>
              {user.role === 'player' && (
                <>
                  <li>
                    <Link to="/affiliates">
                      <Users className="w-4 h-4" />
                      Affiliation
                    </Link>
                  </li>
                  <li>
                    <Link to="/recharge">
                      <Wallet className="w-4 h-4" />
                      Recharge USDT
                    </Link>
                  </li>
                  <li>
                    <Link to="/withdrawal">
                      <ArrowDownLeft className="w-4 h-4" />
                      Retrait USDT
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'cashier' && (
                <>
                  <li>
                    <Link to="/recharge">
                      <Wallet className="w-4 h-4" />
                      Recharge USDT
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'admin' && (
                <>
                  <li>
                    <Link to="/admin/users">
                      <Users className="w-4 h-4" />
                      Utilisateurs
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/settings">
                      <Users className="w-4 h-4" />
                      Paramètres
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/games">
                      <Gamepad2 className="w-4 h-4" />
                      Jeux
                    </Link>
                  </li>
                  <li>
                    <a href="https://hostinger.titan.email/mail/" target="_blank" rel="noopener noreferrer">
                      Webmail
                    </a>
                  </li>
                  <li>
                    <a href="https://admin.ashergame.online" target="_blank" rel="noopener noreferrer">
                      Jeu Admin
                    </a>
                  </li>
                </>
              )}
              <div className="divider my-1"></div>
              <li><button onClick={handleLogout} className="text-error"><LogOut className="w-4 h-4" />Déconnexion</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            {/* <Link to="/login" className="btn btn-ghost"></Link> */}
            <Link to="/login" className="btn btn-primary">Connexion</Link>
          </div>
        )}
      </div>
    </div>
  );
};

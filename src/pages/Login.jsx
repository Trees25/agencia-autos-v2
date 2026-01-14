import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaLock, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de acceso',
        text: 'Credenciales inválidas. Por favor, revisa tus datos.',
        background: '#111',
        color: '#fff',
        confirmButtonColor: '#dc3545'
      });
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-black position-relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="position-absolute translate-middle" style={{ top: '20%', left: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(220, 53, 69, 0.1) 0%, transparent 70%)', filter: 'blur(50px)' }}></div>
      <div className="position-absolute translate-middle" style={{ bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(220, 53, 69, 0.05) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>

      <div className="container" style={{ maxWidth: '450px', zIndex: 1 }}>
        <div className="text-center mb-5 animate-fade-in">
          <div className="d-inline-flex align-items-center justify-content-center bg-accent text-white p-3 rounded-circle mb-3 shadow-lg">
            <FaCar size={32} />
          </div>
          <h1 className="h2 fw-bold text-white tracking-tight">MOLIN<span className="text-accent">AUTOS</span></h1>
          <p className="text-light opacity-50 small text-uppercase spacing-widest">Panel de Administración</p>
        </div>

        <div className="premium-card p-4 p-md-5 border-secondary border-opacity-10 shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="h4 fw-bold text-center mb-4 text-white">Ingreso Seguro</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="mb-4">
              <label className="small text-light opacity-75 text-uppercase mb-2 d-block">Correo Electrónico</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-light opacity-50">
                  <FaUser size={14} />
                </span>
                <input
                  className="form-control bg-dark border-secondary border-opacity-50 text-light py-3 px-3 shadow-none focus-accent"
                  type="email"
                  placeholder="admin@molinautos.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="small text-light opacity-75 text-uppercase mb-2 d-block">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary border-opacity-50 text-light opacity-50">
                  <FaLock size={14} />
                </span>
                <input
                  className="form-control bg-dark border-secondary border-opacity-50 text-light py-3 px-3 shadow-none focus-accent"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="btn btn-premium w-100 py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 transition-all shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                'Acceder al Panel'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="small text-light opacity-25">© {new Date().getFullYear()} MolinAutos S.A. Todos los derechos reservados.</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .focus-accent:focus {
          border-color: #dc3545 !important;
          background-color: rgba(220, 53, 69, 0.05) !important;
        }
        .spacing-widest { letter-spacing: 0.2em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}

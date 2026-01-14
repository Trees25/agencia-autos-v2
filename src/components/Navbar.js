import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaHome, FaCar, FaUserShield, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

export default function Navbar() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg navbar-dark glass-navbar py-3">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/img/logo-removebg-preview (2).png"
              alt="MolinAutos Logo"
              height="60"
              className="me-2"
            />
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className={`nav-link px-3 d-flex align-items-center ${isActive('/') ? 'active text-accent' : ''}`} to="/">
                  <FaHome className="me-2" /> Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link px-3 d-flex align-items-center ${isActive('/catalogo') ? 'active text-accent' : ''}`} to="/catalogo">
                  <FaCar className="me-2" /> Catálogo
                </Link>
              </li>

              {!session ? (
                <li className="nav-item ms-lg-3">
                  <Link className="btn btn-premium btn-sm d-flex align-items-center" to="/login">
                    <FaSignInAlt className="me-2" /> Ingresar
                  </Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link px-3 d-flex align-items-center ${isActive('/admin') ? 'active text-gold' : ''}`} to="/admin">
                      <FaUserShield className="me-2" /> Admin
                    </Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" /> Salir
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

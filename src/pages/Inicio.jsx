import React from 'react';
import Carousel from '../components/Carousel.js';
import AboutUs from '../components/AboutUs.js';
import Location from '../components/Location.js';
import Footer from '../components/Footer.js';
import { FaSearch, FaDollarSign, FaCar, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const whatsappNumber = "5492645051543";
  const mensajeCotizacion = "Hola, quiero cotizar mi vehículo.";
  const mensajeConsignacion = "Hola, quiero consultar sobre consignaciones.";

  return (
    <main>
      {/* Hero Section with Carousel Overlay */}
      <section className="position-relative overflow-hidden">
        <Carousel />
      </section>

      {/* Quick Actions */}
      <section className="py-5 bg-black">
        <div className="container py-4">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="premium-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="p-3 rounded-circle mb-3" style={{ background: 'rgba(220, 53, 69, 0.2)' }}>
                  <FaSearch size={30} className="text-accent" />
                </div>
                <h3 className="text-light">Busca tu vehículo</h3>
                <p className="text-light opacity-75 small">Encuentra el auto de tus sueños en nuestro inventario seleccionado.</p>
                <Link to="/catalogo" className="btn btn-link text-accent text-decoration-none fw-bold mt-auto">
                  VER MÁS <FaArrowRight size={12} className="ms-1" />
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="premium-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="p-3 rounded-circle mb-3" style={{ background: 'rgba(220, 53, 69, 0.2)' }}>
                  <FaDollarSign size={30} className="text-accent" />
                </div>
                <h3 className="text-light">Cotiza tu vehículo</h3>
                <p className="text-light opacity-75 small">Obtén la mejor valoración del mercado por tu auto actual.</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeCotizacion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link text-accent text-decoration-none fw-bold mt-auto"
                >
                  COTIZAR <FaArrowRight size={12} className="ms-1" />
                </a>
              </div>
            </div>

            <div className="col-md-4">
              <div className="premium-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                <div className="p-3 rounded-circle mb-3" style={{ background: 'rgba(220, 53, 69, 0.2)' }}>
                  <FaCar size={30} className="text-accent" />
                </div>
                <h3 className="text-light">Consigna tu vehículo</h3>
                <p className="text-light opacity-75 small">Vendemos tu auto por ti al mejor precio y en tiempo récord.</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeConsignacion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-link text-accent text-decoration-none fw-bold mt-auto"
                >
                  CONSIGNAR <FaArrowRight size={12} className="ms-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutUs />
      <Location />
      <Footer />
    </main>
  );
};

export default Home;

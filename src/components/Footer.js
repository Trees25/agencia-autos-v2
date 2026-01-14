import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-light pt-5 border-top border-secondary border-opacity-10">
      <div className="container text-center">
        <div className="row justify-content-center text-center">

          <div className="col-md-4 mb-4">
            <h3 className="h5 fw-bold text-accent text-uppercase tracking-wider mb-3">Contacto</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="https://wa.me/5492645051543"
                  className="text-light opacity-75 d-flex align-items-center justify-content-center gap-2 text-decoration-none hover-accent"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaWhatsapp className="text-accent" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="tel:+5492645051543"
                  className="text-light opacity-75 d-flex align-items-center justify-content-center gap-2 text-decoration-none hover-accent">
                  <i className="fas fa-phone text-accent"></i> +54 9 2645 051543
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h3 className="h5 fw-bold text-accent text-uppercase tracking-wider mb-3">Sobre nosotros</h3>
            <p className="text-light opacity-75 small">Más de 20 años en el sector, ofreciendo la mejor calidad y servicio personalizado en San Juan.</p>
          </div>

          <div className="col-md-4 mb-4">
            <h3 className="h5 fw-bold text-accent text-uppercase tracking-wider mb-3">Síguenos</h3>
            <div className="social-links d-flex flex-column align-items-center">
              <a href="https://www.instagram.com/molinaautos?igsh=cmh6Y3RzdzVrMWg3"
                className="text-light opacity-75 d-flex align-items-center gap-2 text-decoration-none hover-accent"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="lg" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Franja inferior de derechos */}
      <div className="bg-dark text-center py-3 mt-4 border-top border-secondary border-opacity-10">
        <small className="text-light opacity-50">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://treestech.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-decoration-none fw-bold"
          >
            Trees
          </a>
          - Todos los derechos reservados.
        </small>
      </div>
    </footer>
  );
};

export default Footer;

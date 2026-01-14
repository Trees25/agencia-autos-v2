import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppContact = () => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [consulta, setConsulta] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  const whatsappNumber = "5492645051543";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !telefono || !consulta) {
      alert("Por favor, completa todos los campos antes de enviar.");
      return;
    }

    const mensaje = `Hola, mi nombre es ${nombre}. Mi teléfono es ${telefono}. Quisiera consultar lo siguiente: ${consulta}`;


    const formattedPhone = telefono.replace(/\D/g, '');
    if (formattedPhone.length === 0) {
      alert("Por favor, ingresa un número de teléfono válido.");
      return;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(mensaje)}`;

    alert("El mensaje está listo. Solo presiona 'Enviar' en WhatsApp.");
    window.open(whatsappUrl, "_blank");
  };

  const handleConsultaChange = (e) => {
    const valor = e.target.value;
    setConsulta(valor);
    setMostrarMensaje(valor.length > 0); // Muestra el mensaje si hay texto
  };

  return (
    <section className="py-5 bg-black">
      <div className="container">
        <div className="premium-card overflow-hidden border-secondary border-opacity-10 shadow-lg">
          <div className="row g-0">
            <div className="col-md-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13596.262283503842!2d-68.5319931!3d-31.5772497!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96813fa948c80cbb%3A0x7035cf3888b11d1c!2sMolinAutos!5e0!3m2!1ses!2sar!4v1727731262532!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen
                loading="lazy"
                title="Ubicación de MolinAutos"
              ></iframe>
            </div>
            <div className="col-md-6 bg-dark">
              <div className="card-body p-4 p-lg-5 text-light">
                <h2 className="fw-bold mb-4 text-light">Contáctanos por WhatsApp</h2>
                <form onSubmit={handleSubmit} className="formulario">
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label text-light opacity-75 small uppercase tracking-wider">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control bg-transparent border-secondary text-light"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="telefono" className="form-label text-light opacity-75 small uppercase tracking-wider">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control bg-transparent border-secondary text-light"
                      id="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="consulta" className="form-label text-light opacity-75 small uppercase tracking-wider">
                      Consulta
                    </label>
                    <textarea
                      className="form-control bg-transparent border-secondary text-light"
                      id="consulta"
                      rows="3"
                      value={consulta}
                      onChange={handleConsultaChange}
                      required
                    ></textarea>
                    {mostrarMensaje && (
                      <div className="mt-2 p-2 rounded bg-accent bg-opacity-10 text-accent small border border-accent border-opacity-10">
                        Vista previa: {consulta}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-premium w-100 py-3 mt-2">
                    <FaWhatsapp className="me-2" /> Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppContact;

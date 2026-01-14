import React from 'react';

const AboutUs = () => {
    return (
        <section className="py-5 bg-black">
            <div className="container">
                <div className="premium-card p-2 border-secondary border-opacity-10">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-4">
                            <img src="img/images (1).gif" className="img-fluid rounded-start shadow-lg" alt="Animación de MolinAutos" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body p-4 text-light">
                                <h2 className="fw-bold mb-3 text-light">Tu concesionario de confianza</h2>
                                <p className="mb-3 lead text-light opacity-75">En MolinAutos, nos enorgullece ofrecer una amplia gama de vehículos de alta calidad y un servicio excepcional a nuestros clientes. Con más de 20 años de experiencia en el mercado automotriz, nos hemos convertido en líderes en la venta y mantenimiento de automóviles en la región.</p>
                                <p className="mb-0 text-light opacity-50">Nuestro compromiso es proporcionar a nuestros clientes una experiencia de compra sin igual, con asesoramiento personalizado, financiamiento flexible y un servicio postventa de primera clase. En MolinAutos, no solo vendemos autos, creamos relaciones duraderas con nuestros clientes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;


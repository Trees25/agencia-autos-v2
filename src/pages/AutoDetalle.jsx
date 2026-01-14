import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaWhatsapp, FaArrowLeft, FaGasPump, FaCogs } from "react-icons/fa";
import Footer from "../components/Footer.js";
import CreditSimulator from "../components/CreditSimulator";

export default function AutoDetalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [auto, setAuto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchAuto = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("autos")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                console.error("Error fetching auto:", error);
                navigate("/catalogo");
            } else {
                const normalized = {
                    ...data,
                    imagenes: (data.imagenes || []).map(img =>
                        typeof img === "string" ? JSON.parse(img) : img
                    )
                };
                setAuto(normalized);
            }
            setLoading(false);
        };

        fetchAuto();
    }, [id, navigate]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark">
            <div className="spinner-border text-accent" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (!auto) return null;

    const adminWsp = "5492645051543";
    const autoUrl = window.location.href;
    const wspMessage = encodeURIComponent(
        `Hola, quiero consultar sobre este auto: ${auto.marca} ${auto.modelo} ${auto.anio}. Link: ${autoUrl}`
    );

    return (
        <main className="bg-dark text-light pt-5">
            <div className="container py-5">
                <Link to="/catalogo" className="btn btn-link text-accent text-decoration-none mb-4 d-inline-flex align-items-center">
                    <FaArrowLeft className="me-2" /> Volver al catálogo
                </Link>

                <div className="row g-4">
                    {/* Main Content Column */}
                    <div className="col-lg-8">
                        <div className="premium-card p-2 mb-4 shadow-lg border-0 bg-black">
                            <img
                                src={auto.imagenes[activeImage]?.full || auto.imagenes[activeImage]}
                                className="img-fluid rounded w-100"
                                style={{ maxHeight: "600px", objectFit: "contain" }}
                                alt={`${auto.marca} ${auto.modelo}`}
                            />
                        </div>
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            {auto.imagenes.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`premium-card p-1 cursor-pointer ${activeImage === idx ? 'border-accent' : 'border-secondary border-opacity-25'}`}
                                    style={{ width: "80px", cursor: "pointer", opacity: activeImage === idx ? 1 : 0.6 }}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img.thumb || img} className="img-fluid rounded" alt="Miniatura" />
                                </div>
                            ))}
                        </div>

                        <div className="premium-card p-4 mb-4 border-secondary border-opacity-10">
                            <h3 className="h4 fw-bold mb-4 text-accent border-bottom border-secondary border-opacity-25 pb-2">Descripción General</h3>
                            <p className="text-light fs-5 leading-relaxed mb-0">{auto.caracteristicas || 'Consultar equipamiento completo.'}</p>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="col-lg-4">
                        {/* Action Card */}
                        <div className="premium-card p-4 mb-4 border-accent border-opacity-25 bg-gradient-dark">
                            <h1 className="h2 fw-bold mb-1">{auto.marca}</h1>
                            <h2 className="h4 text-accent mb-4">{auto.modelo} {auto.anio}</h2>

                            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-black rounded shadow-sm">
                                <span className="text-light opacity-50 small text-uppercase">Estado</span>
                                <span className="badge bg-accent px-3 py-2">{auto.status}</span>
                            </div>

                            <div className="row g-2 mb-4">
                                <div className="col-6">
                                    <div className="p-3 bg-secondary bg-opacity-10 rounded text-center border border-secondary border-opacity-10">
                                        <FaGasPump className="text-accent mb-1" />
                                        <div className="small text-light opacity-50" style={{ fontSize: '0.75rem' }}>MOTOR</div>
                                        <div className="fw-bold small text-light">{auto.combustible}</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 bg-secondary bg-opacity-10 rounded text-center border border-secondary border-opacity-10">
                                        <FaCogs className="text-accent mb-1" />
                                        <div className="small text-light opacity-50" style={{ fontSize: '0.75rem' }}>CAJA</div>
                                        <div className="fw-bold small text-light">{auto.transmision}</div>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`https://wa.me/${adminWsp}?text=${wspMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-premium w-100 py-3 fs-5"
                            >
                                <FaWhatsapp className="me-2" /> Consultar Precio
                            </a>
                        </div>

                        {/* Credit Simulator Section */}
                        <CreditSimulator carPrice={auto.precio} />

                        {auto.comentario && (
                            <div className="premium-card p-4 mt-4 border-secondary border-opacity-10">
                                <h5 className="text-accent mb-2 small text-uppercase fw-bold">Notas del Vendedor</h5>
                                <p className="text-light opacity-75 fst-italic mb-0 small">"{auto.comentario}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

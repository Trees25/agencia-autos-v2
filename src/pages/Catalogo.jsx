import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaWhatsapp, FaSearch, FaArrowRight, FaGasPump, FaRoad } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.js";

export default function Catalogo() {
  const [autos, setAutos] = useState([]);
  const [filteredAutos, setFilteredAutos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const applyFilters = () => {
      let result = autos;

      if (searchTerm) {
        result = result.filter(a =>
          `${a.marca} ${a.modelo}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (brandFilter) {
        result = result.filter(a => a.marca.trim().toUpperCase() === brandFilter.trim().toUpperCase());
      }
      if (typeFilter) {
        result = result.filter(a => a.combustible.trim().toUpperCase() === typeFilter.trim().toUpperCase());
      }

      setFilteredAutos(result);
    };

    applyFilters();
  }, [searchTerm, brandFilter, typeFilter, autos]);

  const fetchAutos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("autos")
      .select("*")
      .eq("status", "Disponible")
      .order("creado", { ascending: false });

    if (!error) {
      const normalized = (data || []).map(auto => ({
        ...auto,
        imagenes: (auto.imagenes || []).map(img =>
          typeof img === "string" ? JSON.parse(img) : img
        )
      }));
      setAutos(normalized);
      setFilteredAutos(normalized);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAutos();
  }, []);

  const adminWsp = "5492645051543";

  // Normalizar marcas para evitar duplicados por minúsculas/mayúsculas y espacios
  const brands = [...new Set(autos.map(a => a.marca.trim().toUpperCase()))].sort();
  const fuels = [...new Set(autos.map(a => a.combustible.trim().toUpperCase()))].sort();

  return (
    <main className="bg-dark min-vh-100 pt-5 text-light">
      <section className="py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center mb-5 tracking-tight">NUESTROS <span className="text-accent">VEHÍCULOS</span></h1>

          {/* Filters Section */}
          <div className="premium-card p-4 mb-5">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-secondary text-muted">
                    <FaSearch />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-secondary text-light"
                    placeholder="Marca o modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select bg-transparent border-secondary text-light"
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                >
                  <option value="" className="bg-dark">Todas las marcas</option>
                  {brands.map(b => <option key={b} value={b} className="bg-dark">{b}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select bg-transparent border-secondary text-light"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="" className="bg-dark">Todos los combustibles</option>
                  {fuels.map(f => <option key={f} value={f} className="bg-dark">{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-accent" role="status"></div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredAutos.length > 0 ? (
                filteredAutos.map((auto) => {
                  const autoUrl = `${window.location.origin}/catalogo/${auto.id}`;
                  const wspMessage = encodeURIComponent(
                    `Hola, quiero consultar sobre este auto: ${auto.marca} ${auto.modelo} ${auto.anio}. Link: ${autoUrl}`
                  );

                  return (
                    <div className="col" key={auto.id}>
                      <div className="premium-card h-100 border-secondary border-opacity-25">
                        <div className="position-relative overflow-hidden" style={{ height: "220px" }}>
                          {auto.imagenes?.length > 0 && (
                            <img
                              src={auto.imagenes[0].thumb || auto.imagenes[0]}
                              className="w-100 h-100"
                              style={{ objectFit: "cover" }}
                              alt={`${auto.marca} ${auto.modelo}`}
                            />
                          )}
                          <div className="position-absolute bottom-0 start-0 p-3 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                            <span className="badge bg-accent fw-bold">{auto.anio}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-dark">
                          <h2 className="h4 fw-bold mb-3">{auto.marca} {auto.modelo}</h2>

                          <div className="d-flex justify-content-between text-light opacity-75 small mb-4">
                            <span><FaRoad className="me-1 text-accent" /> {auto.km?.toLocaleString()} km</span>
                            <span><FaGasPump className="me-1 text-accent" /> {auto.combustible}</span>
                          </div>

                          <div className="d-grid gap-2">
                            <Link to={`/catalogo/${auto.id}`} className="btn btn-premium btn-sm">
                              Ver detalles <FaArrowRight className="ms-2" size={12} />
                            </Link>
                            <a
                              href={`https://wa.me/${adminWsp}?text=${wspMessage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-light btn-sm d-flex align-items-center justify-content-center"
                            >
                              <FaWhatsapp className="me-2" /> Consultar
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <p className="text-light fs-4 opacity-50">No se encontraron vehículos que coincidan con tu búsqueda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

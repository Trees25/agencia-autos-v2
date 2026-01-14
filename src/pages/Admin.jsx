import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import imageCompression from "browser-image-compression";
import {
  FaCar, FaUsers, FaChartLine, FaSignOutAlt,
  FaPlus, FaEdit, FaTrash, FaCheckCircle,
  FaUserPlus, FaImage, FaChevronRight, FaTimes,
  FaEnvelope, FaPhone, FaComment
} from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [autos, setAutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editAuto, setEditAuto] = useState(null);

  // Vehículo Form State
  const [form, setForm] = useState({
    marca: '', modelo: '', anio: '', km: '', motor: '', transmision: '',
    caracteristicas: '', estado: '', color: '', combustible: '',
    precio: '', status: 'Disponible', comentario: '', imagenes: [], archivosImagenes: []
  });

  const [clienteForm, setClienteForm] = useState({
    nombre: '', telefono: '', email: '', interes: '', notas: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) navigate('/login');
    else {
      fetchAllData();
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([fetchAutos(), fetchClientes()]);
    setLoading(false);
  };

  const fetchAutos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("autos")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("creado", { ascending: false });

    if (!error) {
      setAutos((data || []).map(auto => ({
        ...auto,
        imagenes: (auto.imagenes || []).map(img =>
          typeof img === "string" ? JSON.parse(img) : img
        )
      })));
    }
  };

  const fetchClientes = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (!error) setClientes(data || []);
  };

  const handleInput = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm(prev => ({ ...prev, archivosImagenes: [...(prev.archivosImagenes || []), ...Array.from(files)] }));
    else setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleClientInput = (e) => {
    const { name, value } = e.target;
    setClienteForm(prev => ({ ...prev, [name]: value }));
  };

  const uploadImages = async () => {
    if (!form.archivosImagenes || form.archivosImagenes.length === 0) return [];
    const uploadedUrls = [];
    for (const file of form.archivosImagenes) {
      try {
        const thumbOptions = { maxSizeMB: 0.2, maxWidthOrHeight: 300, useWebWorker: true, fileType: "image/webp" };
        const fullOptions = { maxSizeMB: 0.6, maxWidthOrHeight: 1280, useWebWorker: true, fileType: "image/webp" };
        const thumbFile = await imageCompression(file, thumbOptions);
        const thumbName = `thumb_${Date.now()}_${file.name.split(".")[0]}.webp`;
        await supabase.storage.from("autos").upload(thumbName, thumbFile);
        const { data: thumbData } = supabase.storage.from("autos").getPublicUrl(thumbName);
        const fullFile = await imageCompression(file, fullOptions);
        const fullName = `full_${Date.now()}_${file.name.split(".")[0]}.webp`;
        await supabase.storage.from("autos").upload(fullName, fullFile);
        const { data: fullData } = supabase.storage.from("autos").getPublicUrl(fullName);
        uploadedUrls.push({ thumb: thumbData.publicUrl, full: fullData.publicUrl });
      } catch (err) { console.error("❌ Error subiendo:", err.message); }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    let imagenesUrls = form.imagenes;
    if (form.archivosImagenes?.length > 0) {
      try {
        const nuevasImagenes = await uploadImages();
        imagenesUrls = [...imagenesUrls, ...nuevasImagenes];
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error subiendo imágenes', background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
        setLoading(false);
        return;
      }
    }

    const autoData = {
      marca: form.marca,
      modelo: form.modelo,
      anio: parseInt(form.anio),
      km: parseInt(form.km),
      motor: form.motor,
      transmision: form.transmision,
      caracteristicas: form.caracteristicas,
      estado: form.estado,
      color: form.color,
      combustible: form.combustible,
      precio: parseFloat(form.precio),
      status: form.status,
      comentario: form.comentario,
      imagenes: imagenesUrls,
      user_id: userData.user.id,
      actualizado: new Date().toISOString()
    };

    let error;
    if (editAuto) {
      const { error: updateError } = await supabase
        .from('autos')
        .update(autoData)
        .eq('id', editAuto.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('autos').insert(autoData);
      error = insertError;
    }

    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
    } else {
      Swal.fire({ icon: 'success', title: editAuto ? 'Actualizado' : 'Publicado', text: editAuto ? 'Vehículo actualizado correctamente' : 'Vehículo agregado al inventario', background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
      resetForm();
      fetchAutos();
      setShowForm(false);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      marca: '', modelo: '', anio: '', km: '', motor: '', transmision: '',
      caracteristicas: '', estado: '', color: '', combustible: '',
      precio: '', status: 'Disponible', comentario: '', imagenes: [], archivosImagenes: []
    });
    setEditAuto(null);
  };

  const handleEditClick = (auto) => {
    setEditAuto(auto);
    setForm({
      ...auto,
      archivosImagenes: [] // Reset files selection
    });

    setShowForm(true);

    // Hacer scroll al formulario
    setTimeout(() => {
      document.getElementById('inventory-header').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from('clientes').insert({ ...clienteForm, user_id: userData.user.id });
    if (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
    } else {
      Swal.fire({ icon: 'success', title: 'Registrado', text: 'Cliente guardado correctamente', background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
      setClienteForm({ nombre: '', telefono: '', email: '', interes: '', notas: '' });
      fetchClientes();
    }
  };

  const handleDeleteAuto = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar vehículo?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#212529',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await supabase.from('autos').delete().eq('id', id);
      fetchAutos();
      Swal.fire({ title: 'Eliminado', icon: 'success', background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
    }
  };

  const handleDeleteClient = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar cliente?',
      text: "Se borrará el registro del cliente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#212529',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar',
      background: '#111',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await supabase.from('clientes').delete().eq('id', id);
      fetchClientes();
      Swal.fire({ title: 'Borrado', icon: 'success', background: '#111', color: '#fff', confirmButtonColor: '#dc3545' });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const stats = {
    totalAutos: autos.length,
    disponibles: autos.filter(a => a.status === 'Disponible').length,
    vendidos: autos.filter(a => a.status === 'Vendido').length,
    totalClientes: clientes.length
  };

  return (
    <div className="d-flex min-vh-100 bg-black text-light">
      {/* SIDEBAR */}
      <aside className="bg-dark border-end border-secondary border-opacity-10 d-none d-lg-flex flex-column p-4" style={{ width: '280px' }}>
        <div className="mb-5 px-2">
          <h4 className="fw-bold text-accent mb-0">MOLINAUTOS</h4>
          <span className="small text-muted text-uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>Admin Dashboard</span>
        </div>

        <nav className="flex-grow-1">
          <ul className="list-unstyled">
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-100 text-start btn d-flex align-items-center gap-3 py-3 px-4 rounded-3 border-0 transition-all ${activeTab === 'dashboard' ? 'bg-accent text-white shadow-lg' : 'text-light opacity-50 hover-bg-secondary'}`}
              >
                <FaChartLine /> <span className="fw-semibold">Dashboard</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('inventario')}
                className={`w-100 text-start btn d-flex align-items-center gap-3 py-3 px-4 rounded-3 border-0 transition-all ${activeTab === 'inventario' ? 'bg-accent text-white shadow-lg' : 'text-light opacity-50 hover-bg-secondary'}`}
              >
                <FaCar /> <span className="fw-semibold">Inventario</span>
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveTab('clientes')}
                className={`w-100 text-start btn d-flex align-items-center gap-3 py-3 px-4 rounded-3 border-0 transition-all ${activeTab === 'clientes' ? 'bg-accent text-white shadow-lg' : 'text-light opacity-50 hover-bg-secondary'}`}
              >
                <FaUsers /> <span className="fw-semibold">Clientes (CRM)</span>
              </button>
            </li>
          </ul>
        </nav>

        <button onClick={handleLogout} className="btn btn-outline-danger border-0 d-flex align-items-center gap-3 py-3 px-4 mt-auto rounded-3">
          <FaSignOutAlt /> <span className="fw-semibold">Cerrar Sesión</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1 p-4 p-lg-5 overflow-auto" style={{ maxHeight: '100vh' }}>

        {/* MOBILE HEADER */}
        <div className="d-lg-none d-flex justify-content-between align-items-center mb-4 pb-4 border-bottom border-secondary border-opacity-10">
          <h4 className="fw-bold text-accent mb-0">MOLINAUTOS</h4>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger"><FaSignOutAlt /></button>
        </div>

        {activeTab === 'dashboard' && (
          <section className="animate-fade-in">
            <header className="mb-5">
              <h2 className="display-6 fw-bold mb-1">Bienvenido de nuevo</h2>
              <p className="text-light opacity-75">Esto es lo que está pasando hoy en tu agencia.</p>
            </header>

            <div className="row g-4 mb-5">
              {[
                { label: 'Total Stock', val: stats.totalAutos, icon: <FaCar />, color: 'primary' },
                { label: 'Disponibles', val: stats.disponibles, icon: <FaCheckCircle />, color: 'success' },
                { label: 'Vendidos', val: stats.vendidos, icon: <FaCar />, color: 'accent' },
                { label: 'Clientes', val: stats.totalClientes, icon: <FaUsers />, color: 'info' }
              ].map((stat, i) => (
                <div className="col-md-3" key={i}>
                  <div className="premium-card p-4 h-100 border-secondary border-opacity-10">
                    <div className={`text-${stat.color} fs-4 mb-3`}>{stat.icon}</div>
                    <h3 className="h2 fw-bold mb-1">{stat.val}</h3>
                    <p className="text-light opacity-50 small text-uppercase tracking-wider mb-0">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              <div className="col-lg-8">
                <div className="premium-card p-4 h-100 border-secondary border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="h5 fw-bold mb-0">Últimos Vehículos Agregados</h4>
                    <button onClick={() => setActiveTab('inventario')} className="btn btn-sm btn-link text-accent text-decoration-none">Ver todos <FaChevronRight size={10} /></button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-dark table-hover align-middle">
                      <thead className="small text-light opacity-50 border-secondary border-opacity-10">
                        <tr>
                          <th>Vehículo</th>
                          <th>Precio</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {autos.slice(0, 5).map(auto => (
                          <tr key={auto.id} className="border-secondary border-opacity-10">
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img src={auto.imagenes?.[0]?.thumb || ''} className="rounded-2" width="40" height="40" style={{ objectFit: 'cover' }} alt="" />
                                <div>
                                  <div className="fw-bold">{auto.marca} {auto.modelo}</div>
                                  <div className="small text-light opacity-50">{auto.anio}</div>
                                </div>
                              </div>
                            </td>
                            <td className="fw-bold text-accent">${auto.precio?.toLocaleString()}</td>
                            <td>
                              <span className={`badge rounded-pill ${auto.status === 'Disponible' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                {auto.status}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => { setEditAuto(auto); setActiveTab('inventario'); }} className="btn btn-sm btn-dark border-secondary border-opacity-20"><FaEdit /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="premium-card p-4 h-100 border-secondary border-opacity-10 bg-accent bg-opacity-10">
                  <h4 className="h5 fw-bold mb-3">Acciones Rápidas</h4>
                  <div className="d-grid gap-2">
                    <button onClick={() => setActiveTab('inventario')} className="btn btn-premium py-3 d-flex align-items-center justify-content-center gap-2">
                      <FaPlus /> Publicar Vehículo
                    </button>
                    <button onClick={() => setActiveTab('clientes')} className="btn btn-outline-light py-3 border-secondary border-opacity-50 d-flex align-items-center justify-content-center gap-2">
                      <FaUserPlus /> Registrar Cliente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MÁS SECCIONES (INVENTARIO, CLIENTES) SE IMPLEMENTARÁN EN LOS SIGUIENTES PASOS */}
        {activeTab === 'inventario' && (
          <section className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5" id="inventory-header">
              <h2 className="display-6 fw-bold mb-0">Gestión de Inventario</h2>
              <button
                className="btn btn-premium px-4 py-2"
                onClick={() => {
                  if (editAuto) resetForm();
                  setShowForm(!showForm);
                }}
              >
                <FaPlus className="me-2" /> {showForm && !editAuto ? 'Cerrar Formulario' : 'Nuevo Ingreso'}
              </button>
            </div>

            {/* Formulario (Condicional) */}
            {showForm && (
              <div className="mb-5 animate-fade-in">
                <div className="premium-card p-4 border-accent border-opacity-20 shadow-lg">
                  <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-10 pb-3">
                    <h4 className="h5 fw-bold mb-0 d-flex align-items-center gap-2">
                      <FaCar className="text-accent" /> {editAuto ? 'Editar Vehículo' : 'Datos del Vehículo'}
                    </h4>
                    <button onClick={() => { resetForm(); setShowForm(false); }} className="btn btn-sm btn-outline-light opacity-50 border-0">
                      {editAuto ? 'Cancelar edición' : 'Cerrar'} <FaTimes className="ms-1" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Marca</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="marca" value={form.marca} onChange={handleInput} required />
                    </div>
                    <div className="col-md-4">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Modelo</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="modelo" value={form.modelo} onChange={handleInput} required />
                    </div>
                    <div className="col-md-2">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Año</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="anio" type="number" value={form.anio} onChange={handleInput} required />
                    </div>
                    <div className="col-md-2">
                      <label className="small text-light opacity-75 text-uppercase mb-1">KM</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="km" type="number" value={form.km} onChange={handleInput} />
                    </div>
                    <div className="col-md-3">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Transmisión</label>
                      <select className="form-select bg-dark border-secondary border-opacity-50 text-light" name="transmision" value={form.transmision} onChange={handleInput} required>
                        <option value="">Seleccionar...</option>
                        <option value="Manual">Manual</option>
                        <option value="Automático">Automático</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Precio ($)</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="precio" type="number" value={form.precio} onChange={handleInput} required />
                    </div>
                    <div className="col-md-3">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Combustible</label>
                      <select className="form-select bg-dark border-secondary border-opacity-50 text-light" name="combustible" value={form.combustible} onChange={handleInput} required>
                        <option value="">Seleccionar...</option>
                        <option value="Nafta">Nafta</option>
                        <option value="Gasoil">Gasoil</option>
                        <option value="GNC">GNC</option>
                        <option value="Híbrido">Híbrido</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Venta</label>
                      <select className="form-select bg-dark border-secondary border-opacity-50 text-light" name="status" value={form.status} onChange={handleInput} required>
                        <option value="Disponible">Disponible</option>
                        <option value="Vendido">Vendido</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="small text-light opacity-75 text-uppercase mb-1">Imágenes (Máx 6)</label>
                      <input className="form-control bg-dark border-secondary border-opacity-50 text-light" type="file" multiple accept="image/*" onChange={handleInput} />
                    </div>
                    {form.archivosImagenes.length > 0 && (
                      <div className="col-12 d-flex flex-wrap gap-2">
                        {form.archivosImagenes.map((f, i) => (
                          <div key={i} className="position-relative">
                            <img src={URL.createObjectURL(f)} width="60" height="60" className="rounded border border-secondary" style={{ objectFit: 'cover' }} alt="" />
                            <button type="button" onClick={() => setForm(p => ({ ...p, archivosImagenes: p.archivosImagenes.filter((_, idx) => idx !== i) }))} className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border-0">
                              <FaTimes size={8} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="col-12">
                      <button type="submit" className="btn btn-premium w-100 py-3 mt-2" disabled={loading}>
                        {loading ? 'Procesando...' : (editAuto ? 'Guardar Cambios' : 'Publicar Vehículo')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="row g-4">
              {autos.map(auto => (
                <div className="col-md-6 col-xl-4" key={auto.id}>
                  <div className="premium-card h-100 border-secondary border-opacity-10 group overflow-hidden">
                    <div className="position-relative" style={{ height: '180px' }}>
                      <img
                        src={auto.imagenes?.[0]?.thumb || ''}
                        className="w-100 h-100 transition-all group-hover:scale-110"
                        style={{ objectFit: 'cover' }}
                        alt=""
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className={`badge rounded-pill ${auto.status === 'Disponible' ? 'bg-success' : 'bg-danger'}`}>
                          {auto.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0 text-white">{auto.marca} {auto.modelo}</h5>
                        <div className="text-accent fw-bold">${auto.precio?.toLocaleString()}</div>
                      </div>
                      <p className="small text-light opacity-50 mb-4">{auto.anio} • {auto.km?.toLocaleString()} km • {auto.combustible}</p>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-dark flex-grow-1 border-secondary border-opacity-20" onClick={() => handleEditClick(auto)}><FaEdit className="me-1" /> Editar</button>
                        <button className="btn btn-sm btn-outline-danger px-3 border-opacity-20" onClick={() => handleDeleteAuto(auto.id)}><FaTrash /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'clientes' && (
          <section className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h2 className="display-6 fw-bold mb-0">Gestión de Clientes</h2>
              <button className="btn btn-premium px-4 py-2" data-bs-toggle="collapse" data-bs-target="#clientForm">
                <FaUserPlus className="me-2" /> Agregar Cliente
              </button>
            </div>

            <div className="collapse mb-5" id="clientForm">
              <div className="premium-card p-4 border-accent border-opacity-20">
                <form onSubmit={handleClientSubmit} className="row g-3">
                  <div className="col-md-4">
                    <label className="small text-light opacity-75 text-uppercase mb-1">Nombre Completo</label>
                    <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="nombre" value={clienteForm.nombre} onChange={handleClientInput} required />
                  </div>
                  <div className="col-md-4">
                    <label className="small text-light opacity-75 text-uppercase mb-1">Teléfono</label>
                    <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="telefono" value={clienteForm.telefono} onChange={handleClientInput} required />
                  </div>
                  <div className="col-md-4">
                    <label className="small text-light opacity-75 text-uppercase mb-1">Email</label>
                    <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="email" type="email" value={clienteForm.email} onChange={handleClientInput} />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-light opacity-75 text-uppercase mb-1">Vehículo de Interés</label>
                    <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="interes" value={clienteForm.interes} onChange={handleClientInput} placeholder="Ej: VW Gol Trend" />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-light opacity-75 text-uppercase mb-1">Notas / Observaciones</label>
                    <input className="form-control bg-dark border-secondary border-opacity-50 text-light" name="notas" value={clienteForm.notas} onChange={handleClientInput} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-premium w-100 py-3 mt-2">Guardar Cliente</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="row g-4">
              {clientes.length > 0 ? clientes.map(c => (
                <div className="col-md-6 col-xl-4" key={c.id}>
                  <div className="premium-card p-4 border-secondary border-opacity-10 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-accent bg-opacity-10 text-accent p-3 rounded-circle">
                          <FaUsers />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0 text-white">{c.nombre}</h5>
                          <div className="small text-light opacity-50">{new Date(c.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDeleteClient(c.id)}><FaTrash /></button>
                    </div>
                    <div className="space-y-2">
                      <div className="d-flex align-items-center gap-2 small text-light opacity-75">
                        <FaPhone className="text-accent" size={12} /> {c.telefono}
                      </div>
                      {c.email && (
                        <div className="d-flex align-items-center gap-2 small text-light opacity-75">
                          <FaEnvelope className="text-accent" size={12} /> {c.email}
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-2 small text-light opacity-75">
                        <FaCar className="text-accent" size={12} /> {c.interes || 'Interés general'}
                      </div>
                    </div>
                    {c.notas && (
                      <div className="mt-4 p-3 bg-black rounded-3 small text-light opacity-75 border border-secondary border-opacity-10">
                        <FaComment className="me-2 text-accent" /> {c.notas}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5">
                  <p className="text-light opacity-75">No tienes clientes registrados aún.</p>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .transition-all { transition: all 0.3s ease; }
        .hover-bg-secondary:hover { background-color: rgba(255, 255, 255, 0.05); }
        .bg-accent { background-color: #dc3545 !important; }
        .text-accent { color: #dc3545 !important; }
        .btn-premium { 
          background-color: #dc3545 !important; 
          color: white; 
          border: none;
          transition: transform 0.2s;
        }
        .btn-premium:hover { transform: translateY(-2px); color: white; opacity: 0.9; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .table-dark { --bs-table-bg: transparent; }
        .premium-card {
          background: #111;
          border-radius: 20px;
        }
      ` }} />
    </div>
  );
}

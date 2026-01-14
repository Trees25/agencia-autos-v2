// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#202E40] text-white text-center px-4">
      <h1 className="text-9xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-lg mb-8">
        Lo sentimos, la página que estás buscando no existe o fue movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-white text-[#202E40] font-semibold shadow-lg hover:bg-gray-200 transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;

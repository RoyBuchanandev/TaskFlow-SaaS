import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const errorData = {
        type: '404_error',
        path: location.pathname,
        timestamp: new Date().toISOString()
      };
      
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(() => {});
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-[#9b9ba4] mb-8">La página que buscas no existe</p>
        <a href="/" className="text-[#0099ff] hover:text-[#0099ff]/90 underline">
          Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default NotFound;

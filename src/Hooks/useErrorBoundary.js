import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSessionStorage } from '../service/storageService';
function useErrorBoundary() {
  const [error, setError] = useState(null);
  const location = useLocation();

  const handleNavigate = () => {
    const currentUrl = location.pathname;
    if (currentUrl)
      window.location.href = `${currentUrl}`;
  }
  useEffect(() => {
    const handleError = (error) => {

      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  return { error, resetError: () => setError(null), handleNavigate };
}

export default useErrorBoundary;

import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (endpoint, options = {}) => {
  const baseUrl = 'http://localhost:8080/';
  const [uri, setUri] = useState(`${baseUrl}${endpoint}`);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOptions, setCurrentOptions] = useState(options);

  useEffect(() => {
    const fetchData = async () => {
      if (!uri || !currentOptions) return;

      try {
        setLoading(true);
        const response = await axios({
          url: uri,
          method: currentOptions.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(currentOptions.headers || {}),
          },
          withCredentials: true,
          data: currentOptions.body || undefined,
        });

        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error during request:", err);
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data}`);
        } else if (err.request) {
          setError("No response received from the server");
        } else {
          setError(err.message);
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uri, currentOptions]); // Ejecutar cuando cambien uri u options

  return {
    data,
    loading,
    error,
    setUri,
    setError,
    setOptions: setCurrentOptions,
    currentOptions,
  };
};

export default useApi;

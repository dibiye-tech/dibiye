import { useEffect, useState } from 'react';
import { whoami, checkTokenIsValid, getAccessToken } from '../hooks/useFetchQuery';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();

      if (token && await checkTokenIsValid()) {
        try {
          const userData = await whoami();
          setUser(userData);
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  return { user, setUser, loading };
};

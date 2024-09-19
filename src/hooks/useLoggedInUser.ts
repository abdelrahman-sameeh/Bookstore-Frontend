import { useState, useEffect } from 'react';
import authAxios from '../api/authAxios';
import { ApiEndpoints } from '../api/ApiEndpoints';

interface UserInterface {
  _id?: any;
  name?: any;
  email?: any;
  role?: any;
  picture?: any;
  stripeAccountId?: any;
  completedBoarding?: any;
}

const useLoggedInUser = (ignoreCache: boolean = false) => {
  const [user, setUser] = useState<UserInterface>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleResponse = (response: any) => {
    if (response?.status === 200) {
      const fetchedUser = response?.data?.data?.user;
      setUser(fetchedUser);
      sessionStorage.setItem('user', JSON.stringify(fetchedUser));
    }

    if (response?.status === 401 && response?.data?.message === "password changed, please login again") {
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const fetchUserFromAPI = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await authAxios(true, ApiEndpoints.getUpdateLoggedUser);
      handleResponse(response);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUser = sessionStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (ignoreCache) {
        await fetchUserFromAPI();
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (token) {
        await fetchUserFromAPI();
      }
    } catch (err) {
      setError('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [ignoreCache]);

  return { user, loading, error };
};

export default useLoggedInUser;

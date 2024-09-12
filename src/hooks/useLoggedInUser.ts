import { useState, useEffect } from 'react';
import authAxios from '../api/authAxios';
import { ApiEndpoints } from '../api/ApiEndpoints';

const useLoggedInUser = () => {
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        const response = await authAxios(true, ApiEndpoints.getUpdateLoggedUser)
        if(response?.status==200){
          localStorage.user = JSON.stringify(response?.data?.data?.user)
          window.location.reload()
        }
        if(response?.status==401 && response?.data?.message=="password changed, please login again"){
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useLoggedInUser;

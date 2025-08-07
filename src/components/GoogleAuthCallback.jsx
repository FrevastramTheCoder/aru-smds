
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleLogin, setError } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // prevent setState on unmounted component

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      if (isMounted) {
        setError(error);
        setLoading(false);
      }
      setTimeout(() => {
        if (isMounted) navigate('/login');
      }, 3000);
      return;
    }

    if (token) {
      googleLogin(token)
        .then(() => {
          if (isMounted) {
            setLoading(false);
            // Navigate in next tick to avoid rendering issues
            setTimeout(() => navigate('/dashboard'), 500);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'Google login failed');
            setLoading(false);
            setTimeout(() => navigate('/login'), 3000);
          }
        });
    } else {
      if (isMounted) {
        setError('No token received.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
      }
    }

    return () => {
      isMounted = false; // cleanup flag
    };
    // Run only on mount, avoid googleLogin and setError in deps to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, navigate]);

  return (
    <div className="auth-loading" style={{ textAlign: 'center', marginTop: '2rem' }}>
      <Loader2 className="animate-spin" size={48} />
      <p>{loading ? 'Signing you in...' : 'Redirecting...'}</p>
    </div>
  );
}

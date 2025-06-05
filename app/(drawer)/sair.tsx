import { useEffect, useContext } from 'react';
import { AuthContext } from '../../src/context/AuthContext';

export default function Sair() {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    logout(); 
  }, []);

  return null;
}

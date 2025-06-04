import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Sair() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/')
  }, []);

  return null;  
}

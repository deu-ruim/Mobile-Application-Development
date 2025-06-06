import { useEffect, useState } from 'react';

type WeatherData = {
  temp: number | null;
  icon: string | null;
  error: string | null;
  loading: boolean;
};

export function useWeather(latitude: number | null, longitude: number | null): WeatherData {
  const [temp, setTemp] = useState<number | null>(null);
  const [icon, setIcon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchWeather() {
      if (latitude === null || longitude === null) {
        setTemp(null);
        setIcon(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const API_KEY = '2abaa931e289d2b1c9e25d72ecaa4829'; 
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Erro ao buscar dados do clima. Código: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.main && typeof data.main.temp === 'number' && data.weather && data.weather[0]) {
          setTemp(data.main.temp);
          setIcon(data.weather[0].icon);
        } else {
          setTemp(null);
          setIcon(null);
          setError('Dados do clima inválidos.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar dados do clima.');
        setTemp(null);
        setIcon(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [latitude, longitude]);

  return { temp, icon, error, loading };
}

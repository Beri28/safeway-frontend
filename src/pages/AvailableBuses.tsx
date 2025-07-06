import React, { useEffect, useState } from 'react';
import { getBuses } from '../api';
import type { Bus } from '../apiTypes';
import TicketList from '../components/TicketList';

const AvailableBuses = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getBuses()
      .then(setBuses)
      .catch(() => setError('Failed to fetch buses.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-[#00796B]">All Available Buses</h2>
      {loading && <div>Loading buses...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <TicketList tickets={buses} onBook={() => {}} />
    </div>
  );
};

export default AvailableBuses;
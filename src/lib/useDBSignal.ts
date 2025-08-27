import { useEffect, useState } from 'react';

const DB_EVENT = 'db:updated';

/** Returns a number that bumps every time the local DB changes */
export default function useDBSignal() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((t: number) => t + 1);
    window.addEventListener(DB_EVENT, onChange);
    // also reflect cross-tab/localStorage changes:
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'job-agents-db-v1') onChange();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(DB_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return tick;
}

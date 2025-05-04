import { useState, useCallback } from "react";

export function useLoading() {
  const [loading, setLoading] = useState(false);

  const start = useCallback(() => setLoading(true), []);
  const stop = useCallback(() => setLoading(false), []);

  return {
    loading,
    start,
    stop,
  };
}

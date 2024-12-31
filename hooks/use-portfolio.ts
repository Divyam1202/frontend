"use client";

import { useState, useEffect } from 'react';
import { Portfolio } from '@/app/types/portfolio';
import { getPortfolioByUsername } from '@/lib/api/portfolio';

export function usePortfolio(username: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const data = await getPortfolioByUsername(username);
        setPortfolio(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPortfolio();
  }, [username]);

  return { portfolio, isLoading, error };
}
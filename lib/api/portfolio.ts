const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function getPortfolioByUsername(username: string) {
  const res = await fetch(`${API_URL}/api/portfolios/${username}`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function searchPortfolios(query: string) {
  const res = await fetch(`${API_URL}/api/portfolios/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search portfolios');
  return res.json();
}

export async function getPortfolio(userId: string) {
  const res = await fetch(`${API_URL}/portfolios/user/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function updatePortfolio(data: any, userId: string) {
  const res = await fetch(`${API_URL}/portfolios/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update portfolio');
  return res.json();
}

export async function deletePortfolio(userId: string) {
  const res = await fetch(`${API_URL}/portfolios/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete portfolio');
  return res.json();
}

export async function publishPortfolio(userId: string, publish: boolean) {
  const res = await fetch(`${API_URL}/portfolios/${userId}/publish`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ publish }),
  });
  if (!res.ok) throw new Error('Failed to publish/unpublish portfolio');
  return res.json();
}
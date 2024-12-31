import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define types for portfolio data
interface User {
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
}

interface Portfolio {
  _id: string;
  user: User;
  bio: string;
  skills: string[];
}

const Portfolio: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get<Portfolio[]>('/portfolios');
        setPortfolios(response.data);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div>
      <h1>Portfolios</h1>
      <ul>
        {portfolios.map((portfolio) => (
          <li key={portfolio._id}>
            <h2>
              {portfolio.user.firstName} {portfolio.user.lastName}
            </h2>
            <p>{portfolio.bio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;

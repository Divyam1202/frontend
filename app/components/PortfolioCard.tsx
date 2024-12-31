// app/portfolio/userDashboard/components/PortfolioCard.tsx
import Link from 'next/link';

const PortfolioCard = ({ portfolio }: { portfolio: any }) => {
  return (
    <div>
      <h3>{portfolio.bio}</h3>
      <p>Skills: {portfolio.skills.join(', ')}</p>
      <Link href={`/portfolio/${portfolio.user.username}`}>View Portfolio</Link>
    </div>
  );
};

export default PortfolioCard;

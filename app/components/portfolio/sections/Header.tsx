import React from "react";

interface HeaderProps {
  userId: string;
}

const Header: React.FC<HeaderProps> = ({ userId }) => {
  return (
    <header>
      <div className="flex items-center space-x-4">
        <h1>Welcome, {userId}</h1>
      </div>
    </header>
  );
};

export default Header;


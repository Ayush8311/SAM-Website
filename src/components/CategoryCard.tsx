import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  categoryId: string;
  icon: React.ReactNode;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, categoryId, icon }) => {
  return (
    <Link to={`/category/${categoryId}`} className="category-card">
      <div className="icon-wrapper">
        {icon}
      </div>
      <div className="category-info">
        <h3>{title}</h3>
        <p className="text-sub">{subtitle}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;

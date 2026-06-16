import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/data';
import './ProductCard.css';

interface ProductCardProps {
  id: string;
  name: string;
  subCategory?: string;
  localImage?: string;
  imageUrl?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, subCategory, localImage, imageUrl }) => {
  const imgSrc = getImageUrl(localImage, imageUrl);
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="image-container">
        {imgSrc ? (
          <img src={imgSrc} alt={name} loading="lazy" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }} />
        ) : null}
        <div className={`fallback-image ${imgSrc ? 'hidden' : ''}`}>
          <span>{initials}</span>
        </div>
      </div>
      <div className="product-info">
        {subCategory && <span className="caps-label sub-cat">{subCategory}</span>}
        <h4 className="product-name">{name}</h4>
        <div className="btn-view">
          <span className="caps-label">VIEW DETAILS</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

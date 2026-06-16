import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Home } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterChip from '../components/FilterChip';
import { getCategoryById } from '../utils/data';
import './Catalog.css';

const CATEGORIES = [
  { id: 'urology', label: 'Urology' },
  { id: 'interventional-radiology', label: 'Radiology' },
  { id: 'gastroenterology', label: 'Gastroenterology' },
  { id: 'gynaecology', label: 'Gynaecology' },
  { id: 'nephrology', label: 'Nephrology' },
];

const Catalog: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [activeChip, setActiveChip] = useState('All Equipment');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryData = categoryId ? getCategoryById(categoryId) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveChip('All Equipment');
  }, [categoryId]);

  if (!categoryData) {
    return (
      <div className="catalog-empty">
        <p>Category not found.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">Go Home</button>
      </div>
    );
  }

  const chips = ['All Equipment', ...categoryData.subCategories];

  const filteredProducts = categoryData.products.filter(p => {
    const matchesChip = activeChip === 'All Equipment' || p.sub_category_name === activeChip;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChip && matchesSearch;
  });

  return (
    <div className="catalog-page">
      <div className="catalog-topbar glass">
        <div className="container topbar-content">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go Back">
              <ArrowLeft size={24} />
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} aria-label="Go Home">
              <Home size={24} />
            </button>
          </div>
          <div className="topbar-title">
            <span className="caps-label text-blue">SAM INNOVATIVE SOLUTIONS</span>
            <h1>{categoryData.label} Catalog</h1>
          </div>
          
          <div className="catalog-search" style={{ width: '250px' }}>
            <div className="search-input-wrapper">
               <Search size={18} className="search-icon" />
               <input 
                 type="text" 
                 placeholder="Search products..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
          </div>
        </div>
      </div>

      <div className="catalog-filters glass">
        <div className="container filter-container">
          
          <div className="category-switcher-row chips-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className={`category-pill ${cat.id === categoryId ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="subcategory-search-row">
            <div className="chips-wrap">
              {chips.map(chip => (
                 <FilterChip 
                    key={chip} 
                    label={chip} 
                    isActive={activeChip === chip} 
                    onClick={() => setActiveChip(chip)} 
                 />
              ))}
            </div>
          </div>
          
        </div>
      </div>

      <main className="catalog-main bg-gray">
        <div className="container py-8">
           {filteredProducts.length === 0 ? (
             <div className="no-results">
               <p>No products found matching your criteria.</p>
               <button onClick={() => {setActiveChip('All Equipment'); setSearchQuery('');}} className="btn btn-outline">Clear Filters</button>
             </div>
           ) : (
             <div className="product-grid">
               {filteredProducts.map(product => (
                 <ProductCard 
                   key={product.id}
                   id={product.id}
                   name={product.name}
                   subCategory={product.sub_category_name}
                   localImage={product.local_image}
                   imageUrl={product.image_url}
                 />
               ))}
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default Catalog;

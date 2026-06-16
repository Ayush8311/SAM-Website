import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { getAllProducts, getImageUrl, Product } from '../utils/data';
import './GlobalSearch.css';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(Product & { display_category: string, sub_category_name: string, id: string })[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const all = getAllProducts();
      const q = query.toLowerCase();
      const filtered = all.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      ).slice(0, 8); // limit results
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-container" onClick={e => e.stopPropagation()}>
        <div className="search-header">
          <Search className="text-sub" size={20} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search products by name or description..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={onClose} aria-label="Close search"><X size={24} /></button>
        </div>
        
        {query.trim().length > 1 && (
          <div className="search-results">
            {results.length > 0 ? (
              results.map(p => (
                <Link to={`/product/${p.id}`} key={p.id} className="search-result-item" onClick={onClose}>
                  <div className="result-img-box">
                    {p.local_image || p.image_url ? (
                      <img src={getImageUrl(p.local_image, p.image_url)} alt={p.name} onError={(e) => {
                         (e.target as HTMLImageElement).style.display = 'none';
                         (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }} />
                    ) : null}
                    <div className={`fallback-image ${p.local_image || p.image_url ? 'hidden' : ''}`}>
                      <span>{p.name.substring(0, 2).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="result-info">
                    <h4>{p.name}</h4>
                    <span className="caps-label text-sub">{p.sub_category_name}</span>
                  </div>
                  <div className="result-action text-blue">
                    View Details
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-results-msg">No products found matching "{query}"</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearch;

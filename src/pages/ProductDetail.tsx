import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, ChevronRight, Home, X, Send } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProductById, getImageUrl, getSimilarProducts } from '../utils/data';
import './ProductDetail.css';

const COMPANY_EMAIL = 'enquiry@saminnovatives.com'; // ← update this

interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  message: string;
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<QuoteForm>({
    name: '', email: '', phone: '', quantity: '', message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) containerRef.current.scrollLeft = 0;
  }, [productId]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const product = productId ? getProductById(productId) : null;

  if (!product) {
    return (
      <div className="product-empty">
        <p>Product not found.</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">Go Back</button>
      </div>
    );
  }

  const validSpecs = (product.specifications || []).filter(s => s.trim().toLowerCase() !== 'infrastructure');
  const similarProducts = getSimilarProducts(product);
  const imgSrc = getImageUrl(product.local_image, product.image_url);
  const initials = product.name.substring(0, 2).toUpperCase();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`Quote Request: ${product.name}`);
    const body = encodeURIComponent(
      `Product: ${product.name}\n` +
      `Category: ${product.display_category} › ${product.sub_category_name}\n\n` +
      `--- Customer Details ---\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone || 'N/A'}\n` +
      `Quantity Required: ${form.quantity || 'N/A'}\n\n` +
      `Message:\n${form.message || 'No additional message.'}`
    );

    window.location.href = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;

    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', quantity: '', message: '' });
    }, 2500);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setForm({ name: '', email: '', phone: '', quantity: '', message: '' });
  };

  return (
    <div className="product-page">
      <div className="product-topbar glass">
        <div className="container topbar-content">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go Back">
              <ArrowLeft size={24} />
            </button>
            <button className="icon-btn" onClick={() => navigate('/')} aria-label="Go Home">
              <Home size={24} />
            </button>
          </div>
          <div className="topbar-title truncate">
            <h1>{product.name}</h1>
            <span className="caps-label text-blue">SAM INNOVATIVE SOLUTIONS</span>
          </div>
          <button className="icon-btn" aria-label="More Options">
            <MoreVertical size={24} />
          </button>
        </div>
      </div>

      <main className="product-main bg-gray">
        <div className="container">
          <div className="product-layout">

            {/* Image Column */}
            <div className="product-image-col">
              <div className="large-image-container box-shadow-soft">
                {imgSrc ? (
                  <img src={imgSrc} alt={product.name} onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }} />
                ) : null}
                <div className={`fallback-image ${imgSrc ? 'hidden' : ''}`}>
                  <span>{initials}</span>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="product-info-col">
              <div className="product-meta">
                <span className="caps-label text-sub">
                  {product.display_category} · {product.sub_category_name}
                </span>
                <h2 className="product-title">{product.name}</h2>
                <div className="product-desc">
                  {product.description.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {validSpecs.length > 0 && (
                <div className="specifications-box">
                  <h3>Specifications</h3>
                  <ul>
                    {validSpecs.map((spec, i) => (
                      <li key={i}>
                        <ChevronRight size={16} className="text-blue" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="product-actions">
                <button
                  className="btn btn-primary btn-full-mobile"
                  onClick={() => setShowModal(true)}
                >
                  Request a Quote
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="similar-products">
            <div className="container">
              <h3>Similar Products</h3>
              <div className="similar-scroll-container" ref={containerRef}>
                <div className="similar-row">
                  {similarProducts.map(sp => (
                    <div key={sp.id} className="similar-item">
                      <ProductCard
                        id={sp.id}
                        name={sp.name}
                        subCategory={sp.sub_category_name}
                        localImage={sp.local_image}
                        imageUrl={sp.image_url}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Quote Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Request a Quote</h2>
                <p className="modal-subtitle">{product.name}</p>
              </div>
              <button className="icon-btn modal-close" onClick={closeModal} aria-label="Close">
                <X size={22} />
              </button>
            </div>

            {submitted ? (
              <div className="modal-success">
                <div className="success-icon">✓</div>
                <p>Your mail client is opening…</p>
                <p className="success-sub">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email <span className="required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity Required</label>
                    <input
                      type="text"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 50 units"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Additional Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Any specific requirements, sizes, or questions..."
                    rows={3}
                  />
                </div>
                <div className="modal-product-ref">
                  <span>Product:</span> {product.name}
                </div>
                <button type="submit" className="btn btn-primary modal-submit">
                  <Send size={16} />
                  Send Quote Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

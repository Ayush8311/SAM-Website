import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, ChevronRight, Home, X, Send, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import ProductCard from '../components/ProductCard';
import { getProductById, getImageUrl, getSimilarProducts } from '../utils/data';
import './ProductDetail.css';

// ─── Fill these in after setting up your EmailJS account ─────────────────────
const EMAILJS_SERVICE_ID  = 'service_xxxxxxx';    // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';   // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'xxxxxxxxxxxxxxxxxxxx'; // Account → Public Key
// ─────────────────────────────────────────────────────────────────────────────

interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  message: string;
}

const EMPTY_FORM: QuoteForm = { name: '', email: '', phone: '', quantity: '', message: '' };

const ProductDetail: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<QuoteForm>(EMPTY_FORM);

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (containerRef.current) containerRef.current.scrollLeft = 0;
  }, [productId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
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

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const openModal = () => {
    setForm(EMPTY_FORM);
    setSubmitted(false);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in your name, email and phone number.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          product_name:     product.name,
          product_category: `${product.display_category} › ${product.sub_category_name}`,
          from_name:        form.name,
          from_email:       form.email,
          phone:            form.phone,
          quantity:         form.quantity || 'Not specified',
          message:          form.message  || 'No additional message.',
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Failed to send. Please try again or email us directly at enquiry@saminnovatives.com');
    } finally {
      setSending(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="product-page">

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
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

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="product-main bg-gray">
        <div className="container">
          <div className="product-layout">

            {/* Left Column: Image */}
            <div className="product-image-col">
              <div className="large-image-container box-shadow-soft">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`fallback-image ${imgSrc ? 'hidden' : ''}`}>
                  <span>{initials}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Info */}
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
                <button className="btn btn-primary btn-full-mobile" onClick={openModal}>
                  Enquire Now
                </button>
                <button className="btn btn-outline btn-full-mobile" onClick={openModal}>
                  Request a Quote
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Similar Products ─────────────────────────────────────────── */}
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

      {/* ── Enquiry Modal ─────────────────────────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            <button className="modal-close" onClick={closeModal} aria-label="Close">
              <X size={20} />
            </button>

            {submitted ? (
              /* Success state */
              <div className="modal-success">
                <CheckCircle size={56} className="success-icon" />
                <h2>Enquiry Sent!</h2>
                <p>
                  Thank you, <strong>{form.name}</strong>. Our team will get back to you
                  regarding <strong>{product.name}</strong> shortly.
                </p>
                <button className="btn btn-primary" onClick={closeModal}>Close</button>
              </div>
            ) : (
              /* Form state */
              <>
                <div className="modal-header">
                  <h2>Get a Quote</h2>
                  <p className="modal-product-name">{product.name}</p>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="modal-form" noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="eq-name">Your Name <span className="required">*</span></label>
                      <input id="eq-name" name="name" type="text" placeholder="John Doe"
                        value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="eq-email">Email <span className="required">*</span></label>
                      <input id="eq-email" name="email" type="email" placeholder="john@example.com"
                        value={form.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="eq-phone">Phone <span className="required">*</span></label>
                      <input id="eq-phone" name="phone" type="tel" placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="eq-qty">Quantity</label>
                      <input id="eq-qty" name="quantity" type="text" placeholder="e.g. 10 units"
                        value={form.quantity} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="eq-msg">Message</label>
                    <textarea id="eq-msg" name="message" rows={4}
                      placeholder="Any specific requirements, delivery timeline, etc."
                      value={form.message} onChange={handleChange} />
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  <button type="submit" className="btn btn-primary btn-full-mobile" disabled={sending}>
                    {sending ? (
                      <span className="sending-state"><span className="spinner" /> Sending…</span>
                    ) : (
                      <span className="sending-state"><Send size={16} /> Send Enquiry</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

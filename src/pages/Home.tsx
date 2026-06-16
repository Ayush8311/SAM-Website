import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, Activity, Settings, PlusCircle, Droplet } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import CategoryCard from '../components/CategoryCard';
import './Home.css';

const Home: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#solutions') {
      setTimeout(() => {
        const el = document.getElementById('solutions');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="app-container">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="badge">PRECISION INNOVATION</span>
              <h1>
                <span className="block text-dark">SAM INNOVATIVE</span>
                <span className="block text-blue">SOLUTIONS LLP</span>
              </h1>
              <p className="hero-subtitle">
                Advancing medical excellence through precision technology and innovative healthcare solutions.
              </p>
              <p className="hero-contact">
                <b>Call now: +91-9900583728</b>
              </p>
              <p className="hero-contact">
                <b>Email: enquiry@saminnovatives.com</b>
              </p>
              <br />
              <div className="hero-actions">
                <a href="#solutions" className="btn btn-primary btn-large">EXPLORE SOLUTIONS</a>
                {/*<Link to="/contact" className="btn btn-outline btn-large desktop-only">CONTACT US</Link>*/}
              </div>
            </div>
            <div className="hero-image desktop-only">
              <div className="image-placeholder bg-blue-100">
                <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80" alt="Surgical Team" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="solutions" className="section-solutions bg-gray">
          <div className="container">
            <div className="section-header">
              <h2>Our Solutions</h2>
              <a href="#solutions" className="text-blue font-semibold view-all">VIEW ALL &rarr;</a>
            </div>

            <div className="solutions-grid">
              <CategoryCard
                title="Urology"
                subtitle="Advanced diagnostic and surgical equipment"
                categoryId="urology"
                icon={<Droplet size={24} />}
              />
              <CategoryCard
                title="Radiology"
                subtitle="High-precision imaging and scanning systems"
                categoryId="interventional-radiology"
                icon={<Activity size={24} />}
              />
              <CategoryCard
                title="Gastroenterology"
                subtitle="Next-gen endoscopic and digestive care tools"
                categoryId="gastroenterology"
                icon={<Settings size={24} />}
              />
              <CategoryCard
                title="Gynaecology"
                subtitle="Specialized solutions for women's healthcare"
                categoryId="gynaecology"
                icon={<PlusCircle size={24} />}
              />
              <CategoryCard
                title="Nephrology"
                subtitle="Renal care and advanced filtration technology"
                categoryId="nephrology"
                icon={<Stethoscope size={24} />}
              />
            </div>
          </div>
        </section>

        {/* Feature Banner Section (Desktop) */}
        <section className="section-banner desktop-only">
          <div className="container">
            <div className="banner-card">
              <div className="banner-content">
                <h2>Innovative Product Ecosystem</h2>
                <ul className="trust-points">
                  <li>Global Quality Standards</li>
                  <li>Advanced Precision Engineering</li>
                  <li>Comprehensive Support</li>
                </ul>
              </div>
              <div className="banner-images">
                <div className="img-thumb top"><img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400" alt="Equipment" /></div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Home;

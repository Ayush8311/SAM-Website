import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import './Contact.css';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', category: '', message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Enquiry sent!');
    setFormData({ name: '', email: '', phone: '', category: '', message: '' });
  };

  return (
    <div className="app-container">
      <Navbar />
      
      <main className="contact-main">
        <div className="container contact-container">
          <div className="contact-card">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-subtitle">We'd love to hear from you. Fill out the form below to request a quote or ask a question.</p>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Your Name" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@company.com" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Product Interest</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="" disabled>Select Category</option>
                  <option value="Urology">Urology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Gynaecology">Gynaecology</option>
                  <option value="Nephrology">Nephrology</option>
                </select>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="How can we help?"></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-full">Send Enquiry</button>
            </form>

            <div className="company-info">
              <h2>SAM INNOVATIVE SOLUTIONS</h2>
              <p>Setting the standard in medical technology</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Contact;

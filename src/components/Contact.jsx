import React, { useState } from 'react';
import { Mail, Phone, Globe, User, Send, Youtube, Instagram } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('Sending...');

    const formDataObj = new FormData();
    // IMPORTANT: Replace this with the actual Web3Forms access key
    formDataObj.append("access_key", "cfbe41e5-839c-42af-903a-ed6b6631fde6");
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("message", formData.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj
      });

      const data = await response.json();

      if (data.success) {
        setSubmitMessage("Message Sent Successfully! ✓");
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage("Error sending message.");
      }
    } catch (error) {
      setSubmitMessage("Error sending message.");
    }

    setIsSubmitting(false);

    setTimeout(() => {
      setIsSent(false);
      setSubmitMessage('');
    }, 5000);
  };

  return (
    <section className="section" id="contact">
      <div className="contact-grid">
        <div className="contact-info animate-fade-in-up">
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Let's build something <span className="text-gradient">together</span>
          </h2>
          <p className="contact-desc">
            Open to internships, freelance projects, collaborations, and hackathon invites. Let's connect!
          </p>

          <div className="contact-links">
            <a href="mailto:bhuvaneshwarancsd@gmail.com" className="contact-item glass">
              <div className="icon-wrapper"><Mail size={20} /></div>
              <div>
                <span className="contact-label">Email</span>
                <span className="contact-value">bhuvaneshwarancsd@gmail.com</span>
              </div>
            </a>
            <div className="contact-item glass">
              <div className="icon-wrapper"><Phone size={20} /></div>
              <div>
                <span className="contact-label">Phone</span>
                <span className="contact-value">+91 79046 27592</span>
              </div>
            </div>
            <a href="https://github.com/Bhuvaneshdarkfire" target="_blank" rel="noreferrer" className="contact-item glass">
              <div className="icon-wrapper"><Globe size={20} /></div>
              <div>
                <span className="contact-label">GitHub</span>
                <span className="contact-value">Bhuvaneshdarkfire</span>
              </div>
            </a>
            <a href="https://linkedin.com/in/bhuvaneshwaran-r" target="_blank" rel="noreferrer" className="contact-item glass">
              <div className="icon-wrapper"><User size={20} /></div>
              <div>
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">bhuvaneshwaran-r</span>
              </div>
            </a>
            <a href="https://youtube.com/@smarttechintamilchannel7094?si=l3V2Rm4CATv3jAwr" target="_blank" rel="noreferrer" className="contact-item glass">
              <div className="icon-wrapper"><Youtube size={20} /></div>
              <div>
                <span className="contact-label">YouTube</span>
                <span className="contact-value">Smart Tech in Tamil</span>
              </div>
            </a>
            <a href="https://www.instagram.com/bhuvi_tech" target="_blank" rel="noreferrer" className="contact-item glass">
              <div className="icon-wrapper"><Instagram size={20} /></div>
              <div>
                <span className="contact-label">Instagram</span>
                <span className="contact-value">@bhuvi_tech</span>
              </div>
            </a>
          </div>
        </div>

        <div className="contact-form-wrapper glass animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full submit-btn" disabled={isSubmitting}>
              {submitMessage ? submitMessage : <><Send size={18} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

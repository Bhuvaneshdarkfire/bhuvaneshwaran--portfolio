import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FileText } from 'lucide-react';
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState({
    description: "I am an aspiring Software Developer with hands-on experience in Flutter, Firebase, Unity (AR/VR), React, and UI/UX design. I am passionate about building scalable, immersive apps and solving real-world problems through technology.",
    image: "/images/avatar.jpeg",
    resumeLink: "#",
    email: "bhuvanesh637453@gmail.com",
    phone: "+91 6374534720",
    location: "Salem, Tamil Nadu"
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, "content", "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData(prev => ({
            description: data.description || prev.description,
            image: data.image || prev.image,
            resumeLink: data.resumeLink || prev.resumeLink,
            email: data.email || prev.email,
            phone: data.phone || prev.phone,
            location: data.location || prev.location
          }));
        }
      } catch (err) {
        console.error("Using local fallback data because Firebase failed:", err);
      }
    };
    fetchAboutData();
  }, []);

  return (
    <section className="section about-section" id="about">
      <div className="about-grid">
        <div className="about-image-col animate-fade-in-up">
          <div className="avatar-wrapper">
            <div className="avatar-shape">
              <img src={aboutData.image} alt="Bhuvaneshwaran R" className="avatar-img" />
            </div>
            <div className="floating-badge flutter">Flutter</div>
            <div className="floating-badge unity">Unity</div>
            <div className="floating-badge react">React</div>
          </div>
        </div>

        <div className="about-content-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="about-bio">
            {aboutData.description}
          </p>

          <div className="info-cards">
            <div className="info-card glass">
              <span className="info-label">Location</span>
              <span className="info-value">{aboutData.location}</span>
            </div>
            <div className="info-card glass">
              <span className="info-label">Email</span>
              <span className="info-value">{aboutData.email}</span>
            </div>
            <div className="info-card glass">
              <a href={aboutData.resumeLink} download className="resume-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
                <FileText size={20} />
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Hero.css';

const Hero = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const [heroContent, setHeroContent] = useState({
    subtitle: "Building digital experiences",
    greeting: "Hi, I'm",
    name: "Bhuvaneshwaran R",
    roles: ['UI/UX Designer.', 'Web Developer.', 'App Developer.', 'Game Developer.'],
    description: "B.E. Computer Science & Design student at Sona College of Technology. Passionate about building scalable apps, immersive games, and solving real-world problems."
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, "content", "hero");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroContent({
            ...data,
            roles: typeof data.roles === 'string' ? data.roles.split(',').map(r => r.trim() + '.') : data.roles
          });
        }
      } catch (err) {
        console.error("Using local fallback data because Firebase failed:", err);
      }
    };
    fetchHeroContent();
  }, []);

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, typingSpeed);

    return () => clearInterval(ticker);
  }, [text, isDeleting, heroContent.roles]);

  const tick = () => {
    let i = loopNum % heroContent.roles.length;
    let fullText = heroContent.roles[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setTypingSpeed(prev => prev / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setTypingSpeed(2000);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setTypingSpeed(150);
    }
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-bg-gradient"></div>

      <div className="hero-content section flex-col items-center justify-center animate-fade-in-up">
        
        <div className="text-center" style={{ maxWidth: '800px', width: '100%' }}>
          <h2 className="section-subtitle">
            <span className="dot"></span> {heroContent.subtitle}
          </h2>
          <h1 className="hero-title">
            {heroContent.greeting} <br /> <span className="highlight-text">{heroContent.name}</span>
          </h1>
          <h2 className="hero-role">
            I am a <span className="typewriter">{text}</span><span className="cursor">|</span>
          </h2>
          <p className="hero-description">
            {heroContent.description}
          </p>
          <div className="flex justify-center gap-4 mt-8" style={{ flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card glass">
            <h3>5+</h3>
            <p>Freelance Work</p>
          </div>
          <div className="stat-card glass">
            <h3>18+</h3>
            <p>Projects</p>
          </div>
          <div className="stat-card glass">
            <h3>10+</h3>
            <p>Hackathons</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

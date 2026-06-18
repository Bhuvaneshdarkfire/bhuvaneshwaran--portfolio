import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Trophy, Code, Medal } from 'lucide-react';
import './Hackathons.css';
import { hackathons as localHackathons } from '../data/projectsData';

const Hackathons = () => {
  const [hackathonsData, setHackathonsData] = useState(localHackathons);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        if (!db) return;
        const querySnapshot = await getDocs(collection(db, "hackathons"));
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setHackathonsData(data);
        }
      } catch (err) {
        console.error("Using local fallback data because Firebase failed:", err);
      }
    };
    fetchHackathons();
  }, []);

  return (
    <section className="section bg-slate" id="hackathons">
      <div className="hackathons-header text-center">
        <h2 className="section-title">Hackathon <span className="text-gradient">Journey</span></h2>
        <p className="section-subtitle">Competing, learning, and building under pressure. 10+ hackathons and counting.</p>
      </div>

      <div className="hackathons-timeline">
        {hackathonsData.map((hackathon, index) => (
          <div key={hackathon.id} className={`timeline-item animate-fade-in-up`} style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="timeline-icon">
              {hackathon.status === 'Winner' ? <Trophy size={24} color="var(--accent-orange)" /> : 
               hackathon.status === 'Finalist' ? <Medal size={24} color="var(--primary)" /> : 
               <Code size={24} color="var(--text-muted)" />}
            </div>
            
            <div className="timeline-content glass">
              <span className="hackathon-status">{hackathon.status}</span>
              <h3 className="hackathon-title">{hackathon.title}</h3>
              <p className="hackathon-domain">{hackathon.domain}</p>
              <p className="hackathon-desc">{hackathon.description}</p>
              
              <div className="hackathon-tech">
                {hackathon.tech.map(t => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hackathons;

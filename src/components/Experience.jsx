import React from 'react';
import { Briefcase } from 'lucide-react';
import './Experience.css';

const Experience = () => {
  return (
    <section className="section bg-slate" id="experience" style={{ paddingTop: '2rem' }}>
      <div className="experience-header text-center">
        <h2 className="section-title">Work <span className="text-gradient">Experience</span></h2>
        <p className="section-subtitle">Real-world projects and professional roles.</p>
      </div>

      <div className="experience-timeline">
        <div className="timeline-item animate-fade-in-up">
          <div className="timeline-icon">
            <Briefcase size={24} color="var(--primary)" />
          </div>
          
          <div className="timeline-content glass">
            <span className="experience-date">2024 - Present</span>
            <h3 className="experience-title">Freelance Web & App Developer</h3>
            <p className="experience-company">Self-Employed</p>
            <p className="experience-desc">
              Successfully delivered 5+ freelance projects including <strong>Pencil Classes</strong> (e-learning platform), <strong>Sami Borewell Motor Service</strong> (business website), and a <strong>Movie Reviewer App</strong>. Worked closely with clients to gather requirements, design UIs, and deploy full-stack solutions using React, Firebase, and Android Studio.
            </p>
            
            <div className="experience-tech">
              <span>React</span>
              <span>Firebase</span>
              <span>Android Studio</span>
              <span>Figma</span>
            </div>
          </div>
        </div>

        <div className="timeline-item animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="timeline-icon">
            <Briefcase size={24} color="var(--primary)" />
          </div>
          
          <div className="timeline-content glass">
            <span className="experience-date">Mar 2026 - May 2026</span>
            <h3 className="experience-title">Web Developer Intern</h3>
            <p className="experience-company">Sasha Infinity Pvt Ltd</p>
            <p className="experience-desc">
              Developed the Sasha Learning Platform, a full-stack LMS using React and JavaScript. 
              Gained hands-on experience with containerization using Docker for scalable deployment, 
              improving platform performance and reliability.
            </p>
            
            <div className="experience-tech">
              <span>React</span>
              <span>JavaScript</span>
              <span>Docker</span>
              <span>Web Development</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;

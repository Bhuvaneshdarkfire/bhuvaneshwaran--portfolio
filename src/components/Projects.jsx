import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { projectsData as localProjectsData } from '../data/projectsData';
import { ExternalLink, X } from 'lucide-react';
import './Projects.css';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectsData, setProjectsData] = useState(localProjectsData);

  useEffect(() => {
    const fetchFirebaseProjects = async () => {
      try {
        if (!db) return;
        const querySnapshot = await getDocs(collection(db, "projects"));
        if (!querySnapshot.empty) {
          const fetchedProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setProjectsData(fetchedProjects);
        }
      } catch (error) {
        console.error("Using local fallback data because Firebase failed:", error);
      }
    };
    fetchFirebaseProjects();
  }, []);

  const categories = ['All', 'App Dev', 'Web Dev', 'Game / AR/VR', 'UI Design'];

  const filteredProjects = filter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <section className="section" id="projects">
      <h2 className="section-title">What I've <span className="text-gradient">Built</span></h2>
      <p className="section-subtitle">From mobile apps to VR worlds and UI designs.</p>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {categories.map(cat => (
          <button 
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            className="project-card animate-fade-in-up"
            onClick={() => setSelectedProject(project)}
            style={{ cursor: 'pointer' }}
          >
            <div className="project-image-wrapper">
              <img src={project.image} alt={project.title} className="project-image" />
              <div className="project-overlay">
                <span className="overlay-btn">View Details</span>
              </div>
            </div>
            
            <div className="project-content">
              <span className="project-category">{project.category}</span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description.length > 80 ? project.description.substring(0, 80) + '...' : project.description}</p>
              
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content glass project-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <X size={24} />
            </button>
            
            <div className="modal-layout">
              {selectedProject.figma ? (
                <div className="iframe-container">
                  <iframe 
                    src={selectedProject.figma}
                    allowFullScreen
                    title="Figma Prototype"
                  ></iframe>
                </div>
              ) : (
                <div className="modal-image-container">
                  <img src={selectedProject.image} alt={selectedProject.title} />
                </div>
              )}
              
              <div className="modal-sidebar">
                <span className="project-category">{selectedProject.category}</span>
                <h2>{selectedProject.title}</h2>
                <p className="modal-desc">{selectedProject.description}</p>
                
                <div className="project-tags">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>

                {selectedProject.link && (
                  <a href={selectedProject.link} target="_blank" rel="noreferrer" className="btn btn-primary w-full mt-4 flex justify-center gap-2">
                    <ExternalLink size={18} /> Visit Live Site
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;

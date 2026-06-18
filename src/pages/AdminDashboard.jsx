import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Image as ImageIcon, FileText, Code, Award, Plus, Trash2, Edit2 } from 'lucide-react';
import { projectsData as localProjectsData, hackathons as localHackathons } from '../data/projectsData';
import './Admin.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(true);
  
  // Content State (Hero & About)
  const [heroData, setHeroData] = useState({ subtitle: 'Building digital experiences', greeting: 'Hi, I\'m', name: 'Bhuvaneshwaran R', roles: 'UI/UX Designer, Web Developer, App Developer, Game Developer', description: 'B.E. Computer Science & Design student at Sona College of Technology. Passionate about building scalable apps, immersive games, and solving real-world problems.' });
  const [aboutData, setAboutData] = useState({ description: '', image: '', resumeLink: '', email: '', phone: '', location: '' });
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  // Projects State
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', description: '', image: '', tags: '', link: '' });

  // Hackathons State
  const [hackathons, setHackathons] = useState([]);
  const [editingHackathon, setEditingHackathon] = useState(null);
  const [hackathonForm, setHackathonForm] = useState({ title: '', domain: '', status: '', description: '', tech: '' });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchProjects();
        fetchHackathons();
        fetchContentData();
      } else {
        navigate('/admin');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchContentData = async () => {
    try {
      const heroSnapshot = await getDocs(collection(db, "content"));
      heroSnapshot.docs.forEach(doc => {
        if (doc.id === 'hero') setHeroData(doc.data());
        if (doc.id === 'about') setAboutData(doc.data());
      });
    } catch (err) {
      console.error("Error fetching content", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projData);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const fetchHackathons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hackathons"));
      const hackData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHackathons(hackData);
    } catch (err) {
      console.error("Error fetching hackathons", err);
    }
  };

  const handleSeedData = async () => {
    if (window.confirm("This will copy your local projectsData.js and hackathons into Firebase. Continue?")) {
      for (const p of localProjectsData) {
        await setDoc(doc(db, "projects", p.id), p);
      }
      for (const h of localHackathons) {
        await setDoc(doc(db, "hackathons", h.id), h);
      }
      // Seed initial hero content
      await setDoc(doc(db, "content", "hero"), heroData);
      // Seed initial about content
      await setDoc(doc(db, "content", "about"), aboutData);
      fetchProjects();
      fetchHackathons();
      fetchContentData();
      alert("Seeding complete!");
    }
  };

  const handleHeroSubmit = async (e) => {
    e.preventDefault();
    setIsSavingHero(true);
    await setDoc(doc(db, "content", "hero"), heroData);
    setIsSavingHero(false);
    alert("Hero section updated successfully!");
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    setIsSavingAbout(true);
    await setDoc(doc(db, "content", "about"), aboutData);
    setIsSavingAbout(false);
    alert("About section updated successfully!");
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const projectToSave = {
      ...formData,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags
    };

    if (editingProject) {
      await updateDoc(doc(db, "projects", editingProject.id), projectToSave);
    } else {
      await addDoc(collection(db, "projects"), projectToSave);
    }
    setEditingProject(null);
    setFormData({ title: '', category: '', description: '', image: '', tags: '', link: '' });
    fetchProjects();
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      fetchProjects();
    }
  };

  const handleHackathonSubmit = async (e) => {
    e.preventDefault();
    const hackathonToSave = {
      ...hackathonForm,
      tech: typeof hackathonForm.tech === 'string' ? hackathonForm.tech.split(',').map(t => t.trim()) : hackathonForm.tech
    };

    if (editingHackathon) {
      await updateDoc(doc(db, "hackathons", editingHackathon.id), hackathonToSave);
    } else {
      await addDoc(collection(db, "hackathons"), hackathonToSave);
    }
    setEditingHackathon(null);
    setHackathonForm({ title: '', domain: '', status: '', description: '', tech: '' });
    fetchHackathons();
  };

  const handleDeleteHackathon = async (id) => {
    if (window.confirm("Delete this hackathon?")) {
      await deleteDoc(doc(db, "hackathons", id));
      fetchHackathons();
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      navigate('/admin');
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading Admin Dashboard...</div>;

  if (!auth) {
    return (
      <div className="admin-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="admin-card text-center" style={{ maxWidth: '500px' }}>
          <h1 className="admin-card-title text-red-500">Firebase Not Configured</h1>
          <p className="admin-card-desc mb-4">You need to add your Firebase configuration to <code>src/firebase.js</code> before the Admin Dashboard can work.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hero':
        return (
          <div className="admin-card">
            <h3 className="admin-card-title mb-4">Edit Hero Section</h3>
            <p className="admin-card-desc mb-6">Update the main text and titles shown at the top of your portfolio.</p>
            <form onSubmit={handleHeroSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group full-width">
                  <label className="text-sm font-bold mb-2 block">Subtitle (Badge)</label>
                  <input required className="admin-input" value={heroData.subtitle} onChange={e => setHeroData({...heroData, subtitle: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Greeting</label>
                  <input required className="admin-input" value={heroData.greeting} onChange={e => setHeroData({...heroData, greeting: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block">Name</label>
                  <input required className="admin-input" value={heroData.name} onChange={e => setHeroData({...heroData, name: e.target.value})} />
                </div>
                <div className="admin-form-group full-width">
                  <label className="text-sm font-bold mb-2 block">Typewriter Roles (Comma separated)</label>
                  <input required className="admin-input" value={heroData.roles} onChange={e => setHeroData({...heroData, roles: e.target.value})} />
                </div>
                <div className="admin-form-group full-width">
                  <label className="text-sm font-bold mb-2 block">Description</label>
                  <textarea required className="admin-textarea" value={heroData.description} onChange={e => setHeroData({...heroData, description: e.target.value})}></textarea>
                </div>
              </div>
              <button type="submit" disabled={isSavingHero} className="btn btn-primary">{isSavingHero ? 'Saving...' : 'Save Hero Content'}</button>
            </form>
          </div>
        );
      case 'about':
        return (
          <div className="admin-card">
            <h3 className="admin-card-title mb-4">Edit About Section</h3>
            <p className="admin-card-desc mb-6">Update your personal photo, description, and contact info shown in the About section.</p>
            <form onSubmit={handleAboutSubmit} className="admin-form">
              <div className="admin-form-grid">
                <div className="admin-form-group full-width">
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Profile Image URL (G-Drive / Imgur link)</label>
                  <input required className="admin-input" value={aboutData.image} onChange={e => setAboutData({...aboutData, image: e.target.value})} />
                </div>
                <div className="admin-form-group full-width">
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>About Me Description</label>
                  <textarea required className="admin-textarea" value={aboutData.description} onChange={e => setAboutData({...aboutData, description: e.target.value})}></textarea>
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Resume PDF Link</label>
                  <input className="admin-input" value={aboutData.resumeLink} onChange={e => setAboutData({...aboutData, resumeLink: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Email Address</label>
                  <input type="email" className="admin-input" value={aboutData.email} onChange={e => setAboutData({...aboutData, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Phone Number</label>
                  <input className="admin-input" value={aboutData.phone} onChange={e => setAboutData({...aboutData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="text-sm font-bold mb-2 block" style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Location</label>
                  <input className="admin-input" value={aboutData.location} onChange={e => setAboutData({...aboutData, location: e.target.value})} />
                </div>
              </div>
              <button type="submit" disabled={isSavingAbout} className="btn btn-primary">{isSavingAbout ? 'Saving...' : 'Save About Content'}</button>
            </form>
          </div>
        );
      case 'projects':
        return (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Manage Projects</h3>
                <p className="admin-card-desc">Use image links (like Google Drive or Imgur) for the Image URL.</p>
              </div>
              <button onClick={handleSeedData} className="btn btn-secondary text-sm">Seed Local Data to Firebase</button>
            </div>

            <form onSubmit={handleProjectSubmit} className="admin-form">
              <h4 className="admin-form-title">{editingProject ? 'Edit Project' : 'Add New Project'}</h4>
              <div className="admin-form-grid">
                <input required placeholder="Project Title" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                <input required placeholder="Category (e.g. Web Dev)" className="admin-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                <div className="admin-form-group full-width">
                  <input required placeholder="Image URL (G-Drive / Imgur link)" className="admin-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                </div>
                <div className="admin-form-group full-width">
                  <textarea required placeholder="Description" className="admin-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                </div>
                <input required placeholder="Tags (comma separated)" className="admin-input" value={typeof formData.tags === 'object' ? formData.tags.join(', ') : formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
                <input placeholder="Live Link (optional)" className="admin-input" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
              </div>
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary">{editingProject ? 'Save Changes' : 'Add Project'}</button>
                {editingProject && <button type="button" onClick={() => { setEditingProject(null); setFormData({ title: '', category: '', description: '', image: '', tags: '', link: '' }); }} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>

            <div className="admin-grid">
              {projects.map(proj => (
                <div key={proj.id} className="admin-item-card">
                  <img src={proj.image} alt={proj.title} className="admin-item-img" onError={(e) => e.target.src = 'https://via.placeholder.com/300?text=Invalid+Image+Link'} />
                  <h4 className="admin-item-title truncate">{proj.title}</h4>
                  <p className="admin-item-category">{proj.category}</p>
                  <div className="admin-item-actions">
                    <button onClick={() => { setEditingProject(proj); setFormData(proj); }} className="admin-icon-btn edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDeleteProject(proj.id)} className="admin-icon-btn delete"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <div className="admin-empty">No projects found. Click "Seed Local Data" above to import existing projects.</div>}
            </div>
          </div>
        );
      case 'hackathons':
        return (
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Manage Hackathons</h3>
                <p className="admin-card-desc">Update your timeline events.</p>
              </div>
              <button onClick={handleSeedData} className="btn btn-secondary text-sm">Seed Local Data to Firebase</button>
            </div>

            <form onSubmit={handleHackathonSubmit} className="admin-form">
              <h4 className="admin-form-title">{editingHackathon ? 'Edit Hackathon' : 'Add New Hackathon'}</h4>
              <div className="admin-form-grid">
                <input required placeholder="Hackathon Title" className="admin-input" value={hackathonForm.title} onChange={e => setHackathonForm({...hackathonForm, title: e.target.value})} />
                <input required placeholder="Domain (e.g. AgriTech)" className="admin-input" value={hackathonForm.domain} onChange={e => setHackathonForm({...hackathonForm, domain: e.target.value})} />
                <input required placeholder="Status (e.g. Finalist, Host)" className="admin-input" value={hackathonForm.status} onChange={e => setHackathonForm({...hackathonForm, status: e.target.value})} />
                <input required placeholder="Technologies (comma separated)" className="admin-input" value={typeof hackathonForm.tech === 'object' ? hackathonForm.tech.join(', ') : hackathonForm.tech} onChange={e => setHackathonForm({...hackathonForm, tech: e.target.value})} />
                <div className="admin-form-group full-width">
                  <textarea required placeholder="Description" className="admin-textarea" value={hackathonForm.description} onChange={e => setHackathonForm({...hackathonForm, description: e.target.value})}></textarea>
                </div>
              </div>
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary">{editingHackathon ? 'Save Changes' : 'Add Hackathon'}</button>
                {editingHackathon && <button type="button" onClick={() => { setEditingHackathon(null); setHackathonForm({ title: '', domain: '', status: '', description: '', tech: '' }); }} className="btn btn-secondary">Cancel</button>}
              </div>
            </form>

            <div className="admin-grid">
              {hackathons.map(hack => (
                <div key={hack.id} className="admin-item-card">
                  <h4 className="admin-item-title">{hack.title}</h4>
                  <p className="admin-item-category mb-1">{hack.domain} • {hack.status}</p>
                  <p className="text-sm text-muted mb-4">{hack.description}</p>
                  <div className="flex gap-2">
                    {hack.tech && hack.tech.map((t, idx) => (
                      <span key={idx} className="text-xs bg-surface border border-subtle px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="admin-item-actions">
                    <button onClick={() => { setEditingHackathon(hack); setHackathonForm(hack); }} className="admin-icon-btn edit"><Edit2 size={16}/></button>
                    <button onClick={() => handleDeleteHackathon(hack.id)} className="admin-icon-btn delete"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              {hackathons.length === 0 && <div className="admin-empty">No hackathons found. Click "Seed Local Data" above to import existing hackathons.</div>}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-logo">CMS Admin</h2>
        
        <nav className="admin-nav">
          <button onClick={() => setActiveTab('hero')} className={`admin-nav-item ${activeTab === 'hero' ? 'active' : ''}`}>
            <ImageIcon size={20} /> Hero Section
          </button>
          <button onClick={() => setActiveTab('about')} className={`admin-nav-item ${activeTab === 'about' ? 'active' : ''}`}>
            <FileText size={20} /> About Section
          </button>
          <button onClick={() => setActiveTab('projects')} className={`admin-nav-item ${activeTab === 'projects' ? 'active' : ''}`}>
            <Code size={20} /> Manage Projects
          </button>
          <button onClick={() => setActiveTab('hackathons')} className={`admin-nav-item ${activeTab === 'hackathons' ? 'active' : ''}`}>
            <Award size={20} /> Hackathons
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-header">
          <h1 className="admin-title">Dashboard</h1>
          <div className="admin-user-info">
            <span className="admin-email">{user?.email}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React from 'react';
import './GameDev.css';

const GameDev = () => {
  return (
    <section className="section gamedev-section" id="gamedev">
      <div className="gamedev-header">
        <h2 className="section-title">Game & <span className="text-gradient">AR/VR</span></h2>
        <p className="section-subtitle">Crafting immersive worlds and interactive experiences using Unity and C#.</p>
      </div>

      <div className="gamedev-showcase">
        {/* Featured: Chemistry Lab */}
        <div className="featured-game animate-fade-in-up glass">
          <div className="game-visual">
            <img src="/images/chem_lab.png" alt="Chemistry Lab VR Simulator" className="game-img" />
            <div className="platform-badges">
              <span className="badge">Meta Quest 3</span>
              <span className="badge">OpenXR</span>
            </div>
          </div>
          <div className="game-info">
            <h3 className="game-title">Chemistry Lab VR Simulator</h3>
            <p className="game-desc">
              An immersive Virtual Reality educational tool. Features include real-time fluid physics simulations, particle effects for chemical reactions, and an interactive AI robot instructor. 
            </p>
            <ul className="game-features">
              <li>Realistic Fluid Dynamics</li>
              <li>AI Instructor Integration</li>
              <li>Hand-Tracking Support</li>
            </ul>
          </div>
        </div>

        {/* Grid for other games */}
        <div className="games-grid">
          <div className="game-card glass animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="game-status in-dev">Under Development</div>
            <img src="/images/kabaddi_game.png" alt="3D Kabaddi Game" className="game-card-img" />
            <div className="game-card-content">
              <h4>3D Kabaddi Game</h4>
              <p>A full 3D sports simulation with motion-captured animations and AI opponents.</p>
              <div className="tech-stack">Unity • C# • 3D Animation</div>
            </div>
          </div>

          <div className="game-card glass animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <img src="/images/flight_sim.png" alt="2D Flight Simulator" className="game-card-img" />
            <div className="game-card-content">
              <h4>2D Flight Simulator</h4>
              <p>Interactive 2D physics-based flight simulator focusing on aerodynamics and controls.</p>
              <div className="tech-stack">Unity • C# • 2D Physics</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameDev;

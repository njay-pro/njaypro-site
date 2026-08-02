import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const isArchetypeRoute = location.pathname === '/archetype';

  return (
    <header className="site-header" role="banner">
      <div className="header-inner container">
        <div className="brand-group">
          <NavLink to="/" className="brand-link" aria-label="Njay Home">
            <span className="brand-symbol">◈</span>
            <span className="brand-name font-mono">NJAY</span>
          </NavLink>
          <span className="brand-divider">/</span>
          <span className="brand-status font-mono">
            {isArchetypeRoute ? 'HERMES_ROUTER_V1.0' : 'NODAL_FOUNDRY_SYS'}
          </span>
        </div>

        <nav className="site-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link font-mono ${isActive ? 'active' : ''}`
            }
            end
          >
            <span className="nav-index">01</span>
            <span className="nav-label">BUILDER</span>
          </NavLink>

          <NavLink
            to="/archetype"
            className={({ isActive }) =>
              `nav-link font-mono ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-index">02</span>
            <span className="nav-label">ARCHETYPE</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

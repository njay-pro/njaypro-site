import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

/**
 * Site navigation — quiet top header.
 *
 * White canvas era: lowercase, mono, no numbers, no status pills.
 * Brand on the left, route labels on the right.
 */
export const Navigation: React.FC = () => {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <NavLink to="/" className="brand-link" aria-label="Njay Home">
          <span className="brand-name">njay</span>
        </NavLink>

        <nav className="site-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            home
          </NavLink>
          <NavLink
            to="/archetype-hermes-subagent"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            archetype-hermes-subagent
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

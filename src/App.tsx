import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { P5Field } from './components/P5Field';
import { RouteTransition } from './components/RouteTransition';
import './styles/index.css';

const BuilderPage = lazy(() =>
  import('./pages/BuilderPage').then((module) => ({ default: module.BuilderPage }))
);
const ArchetypePage = lazy(() =>
  import('./pages/ArchetypePage').then((module) => ({ default: module.ArchetypePage }))
);

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9rem',
    }}
  >
    <span className="socket mint" style={{ marginRight: '8px' }} />
    <span>EVALUATING_NODE...</span>
  </div>
);

export const AppContent: React.FC = () => {
  const location = useLocation();
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const signalColor = location.pathname === '/archetype' ? 'cyan' : 'mint';

  return (
    <>
      <ScrollToTop />
      {/* Background relation field */}
      <P5Field activeSignal={signalColor} isReducedMotion={isReducedMotion} />

      {/* Main navigation header */}
      <Navigation />

      {/* Page morph transition wrapper */}
      <RouteTransition>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<BuilderPage isReducedMotion={isReducedMotion} />} />
            <Route path="/archetype" element={<ArchetypePage isReducedMotion={isReducedMotion} />} />
            <Route path="*" element={<BuilderPage isReducedMotion={isReducedMotion} />} />
          </Routes>
        </Suspense>
      </RouteTransition>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};


import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Eagerly load Home for best LCP
import Home from './pages/Home';

// Lazy load
const Admin = lazy(() => import('./pages/Admin'));
const Register = lazy(() => import('./pages/Register'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const OfficialRules = lazy(() => import('./pages/OfficialRules'));
const FullGallery = lazy(() => import('./pages/FullGallery'));
const FullVideoGallery = lazy(() => import('./pages/FullVideoGallery'));

import { About, Partners, Jury, Prizes, Fees, Rules, Contact } from './pages/InfoPages';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/jury" element={<Jury />} />
                  <Route path="/prizes" element={<Prizes />} />
                  <Route path="/fees" element={<Fees />} />
                  <Route path="/rules" element={<Rules />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/thank-you" element={<ThankYou />} />
                  <Route path="/termeni" element={<TermsAndConditions />} />
                  <Route path="/regulament-oficial" element={<OfficialRules />} />
                  <Route path="/galerie" element={<FullGallery />} />
                  <Route path="/galerie-video" element={<FullVideoGallery />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;

import React, { useState, useEffect } from 'react';

const Footer = ({ onAdminClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleNavClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <footer className="footer-container">
                <div className="footer-wrapper limit-width">
                    <div className="footer-branding">
                        <span className="footer-logo">B<span className="accent-text">A</span></span>
                        <p className="footer-credits">© 2026 Belay Ayele. Built with passion in Ethiopia.</p>
                    </div>
                    
                    <div className="footer-links">
                        {['home', 'about', 'skills', 'projects', 'contact'].map(sec => (
                            <a 
                                key={sec} 
                                href={`#${sec}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(sec);
                                }}
                            >
                                {sec.charAt(0).toUpperCase() + sec.slice(1)}
                            </a>
                        ))}
                        <a 
                            href="#admin" 
                            onClick={(e) => {
                                e.preventDefault();
                                if (onAdminClick) onAdminClick();
                            }}
                            className="footer-admin-link"
                            style={{ opacity: 0.7, color: 'var(--accent-cyan, #00f0ff)', display: 'inline-flex', alignItems: 'center' }}
                            title="Admin Console"
                            aria-label="Admin Console"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="footer-admin-icon" style={{ transition: 'var(--transition)' }}>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </footer>

            {/* Back to top button */}
            <button 
                onClick={handleScrollToTop}
                className={`back-to-top-btn ${isVisible ? 'visible' : ''}`} 
                aria-label="Scroll back to top"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
        </>
    );
};

export default Footer;

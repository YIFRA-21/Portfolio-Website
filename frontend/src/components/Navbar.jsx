import React, { useState, useEffect } from 'react';

const Navbar = ({ activeSection }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 40) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    const handleNavClick = (sectionId) => {
        setIsMobileOpen(false);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-wrapper limit-width">
                <a href="#home" className="logo-link" aria-label="Belay Ayele Home" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                    <div className="logo-monogram">
                        <span className="logo-char">B</span><span className="logo-char accent">A</span>
                    </div>
                </a>
                
                {/* Hamburger Toggle */}
                <button 
                    className={`mobile-toggle ${isMobileOpen ? 'active' : ''}`} 
                    aria-label="Toggle navigation menu" 
                    aria-expanded={isMobileOpen}
                    onClick={toggleMobileMenu}
                >
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                </button>

                {/* Navigation Menu Links */}
                <nav className={`nav-links ${isMobileOpen ? 'mobile-active' : ''}`} role="navigation">
                    {['home', 'about', 'services', 'skills', 'projects', 'contact'].map((section) => (
                        <a 
                            key={section}
                            href={`#${section}`} 
                            className={`nav-item ${activeSection === section ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(section);
                            }}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;

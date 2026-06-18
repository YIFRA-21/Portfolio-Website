import React, { useState, useEffect } from 'react';
import CanvasBackground from './components/CanvasBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';

function App() {
    const [activeSection, setActiveSection] = useState('home');
    const [isAdminMode, setIsAdminMode] = useState(false);

    useEffect(() => {
        const sections = document.querySelectorAll('section[id]');
        
        const handleScroll = () => {
            const scrollY = window.pageYOffset;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 150;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    setActiveSection(sectionId);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isAdminMode]);

    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
        
        revealElements.forEach(el => observer.observe(el));
        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [isAdminMode]);

    // Handle routing override if the user specifies #/admin hash
    useEffect(() => {
        const checkHash = () => {
            if (window.location.hash === '#admin') {
                setIsAdminMode(true);
            } else {
                setIsAdminMode(false);
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
        return () => window.removeEventListener('hashchange', checkHash);
    }, []);

    const handleExitAdmin = () => {
        setIsAdminMode(false);
        window.location.hash = '';
    };

    const handleEnterAdmin = () => {
        setIsAdminMode(true);
        window.location.hash = 'admin';
    };

    if (isAdminMode) {
        return (
            <div className="portfolio-app admin-view">
                <CanvasBackground />
                <AdminDashboard onExit={handleExitAdmin} />
            </div>
        );
    }

    return (
        <div className="portfolio-app">
            {/* Reactive dot grid particle canvas background */}
            <CanvasBackground />

            {/* Header / Nav Navigation */}
            <Navbar activeSection={activeSection} />

            {/* Content Core */}
            <main>
                <Hero />
                <About />
                <Services />
                <Skills />
                <Projects />
                <Contact />
            </main>

            {/* Back to top & copyright controls */}
            <Footer onAdminClick={handleEnterAdmin} />
        </div>
    );
}

export default App;

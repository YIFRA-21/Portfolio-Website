import React, { useState, useEffect } from 'react';

const Hero = () => {
    const phrases = ["Backend Developer", "Frontend Developer", "Full-Stack Engineer"];
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
    const [typedText, setTypedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(100);

    // Typewriter loop
    useEffect(() => {
        let timer;
        const currentPhrase = phrases[currentPhraseIndex];

        const handleTypewriter = () => {
            if (isDeleting) {
                // Delete character
                setTypedText(prev => prev.substring(0, prev.length - 1));
                setTypingSpeed(50);
            } else {
                // Type character
                setTypedText(currentPhrase.substring(0, typedText.length + 1));
                setTypingSpeed(100);
            }

            // Word completed
            if (!isDeleting && typedText === currentPhrase) {
                setTypingSpeed(2000); // Hold word
                setIsDeleting(true);
            } 
            // Word deleted
            else if (isDeleting && typedText === "") {
                setIsDeleting(false);
                setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
                setTypingSpeed(500); // Brief pause before typing next word
            }
        };

        timer = setTimeout(handleTypewriter, typingSpeed);
        return () => clearTimeout(timer);
    }, [typedText, isDeleting, currentPhraseIndex, typingSpeed]);

    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePrintCV = (e) => {
        e.preventDefault();
        window.print();
    };

    return (
        <section id="home" className="hero-section limit-width">
            <div className="hero-grid">
                {/* Left Text Column */}
                <div className="hero-text-column reveal-on-scroll revealed">
                    <div className="terminal-prefix">
                        <span className="term-accent">std::init</span> {"->"} Loading developer...
                    </div>
                    
                    <h1 className="hero-name">
                        BELAY AYELE
                    </h1>
                    
                    <div className="hero-typewriter">
                        <span className="static-prefix">{">"} I am a </span>
                        <span className="dynamic-text">{typedText}</span>
                        <span className="cursor-blink">_</span>
                    </div>
                    
                    <p className="hero-subtitle">
                        IT Student <span className="divider">|</span> University of Debre Berhan, Ethiopia
                    </p>
                    
                    <p className="hero-description">
                        Building next-generation web platforms, secure backends, and responsive user experiences with a focus on code efficiency and performance.
                    </p>
                    
                    <div className="hero-actions">
                        <button 
                            onClick={() => handleScrollToSection('projects')} 
                            className="btn btn-primary"
                        >
                            <span>View My Work</span>
                            <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                        <a 
                            href="#print-cv" 
                            onClick={handlePrintCV}
                            className="btn btn-outline"
                        >
                            <span>Download CV</span>
                        </a>
                    </div>
                </div>

                {/* Right Avatar Column with Rotating Gradient Border */}
                <div className="hero-avatar-column reveal-on-scroll revealed">
                    <div className="hero-avatar-container">
                        {/* Animating spinner element */}
                        <div className="hero-avatar-border"></div>
                        {/* Circular masking wrapper */}
                        <div className="hero-avatar-mask">
                            <img 
                                src="/image20.jpg" 
                                alt="Belay Ayele Profile Avatar" 
                                className="hero-avatar-image" 
                                onError={(e) => {
                                    // Fallback for visual stability if image fails to resolve
                                    e.target.src = "https://images.unsplash.com/photo-1534972195531-d756b9bda9f2?q=80&w=300&auto=format&fit=crop";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Mouse Prompt */}
            <div className="scroll-prompt">
                <span className="scroll-text">Scroll Down</span>
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

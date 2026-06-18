import React from 'react';

const About = () => {
    return (
        <section id="about" className="section-padding">
            <div className="limit-width">
                <div className="section-header">
                    <h2 className="section-title">ABOUT ME</h2>
                    <div className="section-line"></div>
                </div>

                <div className="about-grid">
                    {/* Biography Column */}
                    <div className="about-text-column reveal-on-scroll revealed">
                        <p className="bio-paragraph">
                            Hello! I am a passionate developer from Ethiopia, currently studying <strong className="accent-text">Information Technology</strong> at the University of Debre Berhan. My interest in technology started with exploring how software makes complex systems simple and has evolved into building reliable, full-featured web applications.
                        </p>
                        <p className="bio-paragraph">
                            I thrive at the intersection of backend stability and frontend creativity, crafting clean code and interactive designs. Whether it's database schema optimization, secure REST API design, or building fluid interactive user interfaces, I approach every challenge with engineering curiosity and a goal of visual excellence.
                        </p>
                        
                        {/* Interactive status terminal output */}
                        <div className="terminal-box">
                            <div className="terminal-header">
                                <span className="term-dot"></span>
                                <span className="term-dot"></span>
                                <span className="term-dot"></span>
                                <span className="term-title">system_status.sh</span>
                            </div>
                            <div className="terminal-body">
                                <p className="term-line"><span className="term-user">belay@debre-berhan:~$</span> cat status.json</p>
                                <pre className="term-output"><code>{`{
  "current_focus": "Full-Stack Development",
  "academic_status": "IT Undergraduate",
  "open_to": ["Freelance", "Collaborations", "Internships"]
}`}</code></pre>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Metric Column */}
                    <div className="about-visual-column reveal-on-scroll revealed">
                        <div className="info-cards-grid">
                            <div className="info-card">
                                <svg className="info-card-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <span className="info-label">Name</span>
                                <span className="info-value">Belay Ayele</span>
                            </div>
                            
                            <div className="info-card">
                                <svg className="info-card-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                                </svg>
                                <span className="info-label">University</span>
                                <span className="info-value text-small">Debre Berhan University</span>
                            </div>
                            
                            <div className="info-card">
                                <svg className="info-card-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                                <span className="info-label">Department</span>
                                <span className="info-value text-small">Information Technology</span>
                            </div>
                            
                            <div className="info-card">
                                <svg className="info-card-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span className="info-label">Location</span>
                                <span className="info-value">Ethiopia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;

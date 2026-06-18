import React, { useEffect, useState } from 'react';

const Skills = () => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger progress bar slide-in after component mount
        const timer = setTimeout(() => setAnimate(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const backendSkills = [
        { name: "Node.js / Express", level: 85 },
        { name: "Python / Django", level: 90 },
        { name: "RESTful APIs / GraphQL", level: 92 },
        { name: "System Design & OOP", level: 80 },
        { name: "Docker & Microservices", level: 75 }
    ];

    const frontendSkills = [
        { name: "React.js", level: 88 },
        { name: "JavaScript (ES6+)", level: 90 },
        { name: "Tailwind CSS / CSS3", level: 95 },
        { name: "HTML5 Semantics", level: 96 }
    ];

    const databaseSkills = [
        { name: "PostgreSQL", level: 90 },
        { name: "MySQL", level: 85 },
        { name: "MongoDB", level: 82 },
        { name: "Microsoft SQL Server", level: 80 }
    ];

    const networkingSkills = [
        { name: "Network Routing & Switching", level: 80 },
        { name: "IP Protocols (TCP/IP, DNS)", level: 85 },
        { name: "System Administration & Linux", level: 88 },
        { name: "Network Security & Firewalls", level: 82 }
    ];

    const tools = ["Git", "GitHub", "VS Code", "Docker", "Linux", "Kubernetes", "AWS"];

    return (
        <section id="skills" className="section-padding section-alt-bg">
            <div className="limit-width">
                <div className="section-header">
                    <h2 className="section-title">Technical Expertise</h2>
                    <div className="section-line"></div>
                </div>

                <div className="skills-grid">
                    {/* Backend Architecture */}
                    <div className="skills-category-card reveal-on-scroll revealed">
                        <div className="category-header">
                            <div className="category-icon-wrapper cyan">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                                    <line x1="6" y1="6" x2="6.01" y2="6"></line>
                                    <line x1="6" y1="18" x2="6.01" y2="18"></line>
                                </svg>
                            </div>
                            <h3 className="category-title">Backend Architecture</h3>
                        </div>
                        <p className="category-description">Designing reliable application logic, secure databases, APIs, and scalable infrastructure patterns.</p>
                        
                        <div className="skill-bars-list">
                            {backendSkills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-percent">{skill.level}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: animate ? `${skill.level}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Frontend Engineering */}
                    <div className="skills-category-card reveal-on-scroll revealed">
                        <div className="category-header">
                            <div className="category-icon-wrapper purple">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                    <polyline points="2 17 12 22 22 17"></polyline>
                                    <polyline points="2 12 12 17 22 12"></polyline>
                                </svg>
                            </div>
                            <h3 className="category-title">Frontend Engineering</h3>
                        </div>
                        <p className="category-description">Creating fluid responsive designs, modular components, and highly interactive user experiences.</p>
                        
                        <div className="skill-bars-list">
                            {frontendSkills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-percent">{skill.level}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: animate ? `${skill.level}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Database Architecture */}
                    <div className="skills-category-card reveal-on-scroll revealed">
                        <div className="category-header">
                            <div className="category-icon-wrapper amber">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                                </svg>
                            </div>
                            <h3 className="category-title">Database Architecture</h3>
                        </div>
                        <p className="category-description">Designing structured relational schemas, efficient queries, and indexing strategies, as well as NoSQL document stores.</p>
                        
                        <div className="skill-bars-list">
                            {databaseSkills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-percent">{skill.level}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: animate ? `${skill.level}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IT & Networking */}
                    <div className="skills-category-card reveal-on-scroll revealed">
                        <div className="category-header">
                            <div className="category-icon-wrapper green">
                                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                                    <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                                    <rect x="9" y="2" width="6" height="6" rx="1"></rect>
                                    <path d="M12 8v8M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path>
                                </svg>
                            </div>
                            <h3 className="category-title">IT & Networking</h3>
                        </div>
                        <p className="category-description">Administering Linux servers, configuring secure network configurations, and maintaining protocols and firewalls.</p>
                        
                        <div className="skill-bars-list">
                            {networkingSkills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{skill.name}</span>
                                        <span className="skill-percent">{skill.level}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: animate ? `${skill.level}%` : '0%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* DevOps & Tools Grid */}
                <div className="tools-grid-container reveal-on-scroll revealed">
                    <h3 className="tools-title">Development & DevOps Tools</h3>
                    <div className="tools-grid">
                        {tools.map(tool => (
                            <div key={tool} className="tool-tag">
                                <svg className="tool-tag-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="16 18 22 12 16 6"></polyline>
                                    <polyline points="8 6 2 12 8 18"></polyline>
                                </svg>
                                <span>{tool}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;

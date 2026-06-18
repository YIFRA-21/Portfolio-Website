import React, { useState, useEffect } from 'react';

const Projects = () => {
    const fallbackProjects = [
        {
            title: "Student Management System",
            description: "A comprehensive school management system designed to streamline record-keeping, class scheduling, grade administration, and administrative reporting for higher academic institutions.",
            tags: ["Django", "PostgreSQL", "Python", "Bootstrap"],
            github: "https://github.com",
            demo: "#"
        },
        {
            title: "Personal Portfolio Website",
            description: "A high-performance, visually interactive web presentation engineered to showcase skills, architectural solutions, and completed academic applications with clean code standards.",
            tags: ["React.js", "Tailwind CSS", "Framer Motion", "Vite"],
            github: "https://github.com",
            demo: "#"
        },
        {
            title: "REST API Service",
            description: "A highly optimized backend service layer supplying structured APIs with JSON payloads, secure token-based user authentication (JWT), request routing, and caching layers.",
            tags: ["Node.js", "Express", "MongoDB", "JWT Auth"],
            github: "https://github.com",
            demo: "#"
        },
        {
            title: "University Course Tracker",
            description: "A neat script and desktop helper tool that maps academic syllabi, tracks grades on course modules, and computes cumulative GPAs with beautiful command line dashboards.",
            tags: ["Python", "SQLite3", "CLI Dashboard", "Terminal UI"],
            github: "https://github.com",
            demo: "#"
        }
    ];

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects/');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.warn('[Projects API Warning]: Server returned error. Loading fallback project data.');
                    setProjects(fallbackProjects);
                }
            } catch (error) {
                console.warn('[Projects API Warning]: Server connection failed. Loading fallback project data.', error);
                setProjects(fallbackProjects);
            }
        };

        fetchProjects();
    }, []);

    return (
        <section id="projects" className="section-padding">
            <div className="limit-width">
                <div className="section-header">
                    <h2 className="section-title">Selected Projects</h2>
                    <div className="section-line"></div>
                </div>

                <div className="projects-grid">
                    {projects.map((project, idx) => (
                        <div key={idx} className="project-card reveal-on-scroll revealed">
                            <div className="project-header">
                                <div className="project-folder-icon">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                </div>
                                <div className="project-card-links">
                                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label="GitHub Repository">
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                        </svg>
                                    </a>
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-icon-link" aria-label="Live Demo">
                                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                            <polyline points="15 3 21 3 21 9"></polyline>
                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            
                            <div className="project-card-content">
                                <h3 className="project-card-title">{project.title}</h3>
                                <p className="project-card-description">{project.description}</p>
                            </div>
                            
                            <div className="project-card-footer">
                                <div className="project-tags">
                                    {project.tags.map((tag, tagIdx) => (
                                        <span key={tagIdx} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;

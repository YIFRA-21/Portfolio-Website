import React from 'react';

const Services = () => {
    const servicesList = [
        {
            title: "Web Development",
            description: "Creating beautiful, functional, and high-performing websites that deliver exceptional user experiences.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            )
        },
        {
            title: "Responsive Design",
            description: "Building mobile-first, responsive websites that look great on all devices and screen sizes.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
            )
        },
        {
            title: "Performance Optimization",
            description: "Optimizing websites for speed and performance to ensure fast loading times and smooth interactions.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
            )
        },
        {
            title: "UI/UX Design",
            description: "Designing intuitive and engaging user interfaces that provide seamless digital experiences.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03467 19.1761 5.27586 19.2604 5.51862 19.227C6.67139 19.0683 7.82416 18.9097 8.97693 18.751C9.28189 18.709 9.5855 18.8465 9.7562 19.1026C10.2319 19.8166 10.7077 20.5307 11.1834 21.2447C11.3323 21.4682 11.5831 21.6 11.8507 21.6C11.9004 21.6 11.9504 21.595 12 22Z"></path>
                    <circle cx="7.5" cy="10.5" r="1.5"></circle>
                    <circle cx="11.5" cy="7.5" r="1.5"></circle>
                    <circle cx="16.5" cy="9.5" r="1.5"></circle>
                </svg>
            )
        },
        {
            title: "Custom Development",
            description: "Developing custom web applications tailored to specific business needs and requirements.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            )
        },
        {
            title: "Backend Solutions",
            description: "Building robust backend systems and APIs to power modern web applications.",
            icon: (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                </svg>
            )
        }
    ];

    return (
        <section id="services" className="section-padding">
            <div className="limit-width">
                <div className="services-header-container">
                    <div className="services-header-top-row">
                        <h2 className="section-title" style={{ fontSize: '2.5rem' }}>
                            My <span className="gradient-text-services">Services</span>
                        </h2>
                        <div className="section-line"></div>
                    </div>
                    <p className="services-header-desc">
                        A comprehensive suite of web development services designed to create beautiful, functional, and high-performing websites and web applications
                    </p>
                </div>

                <div className="services-grid">
                    {servicesList.map((service, index) => (
                        <div key={index} className="service-card reveal-on-scroll">
                            <div className="service-icon-container">
                                {service.icon}
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

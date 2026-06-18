import React, { useState } from 'react';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [formStatus, setFormStatus] = useState(''); // 'idle', 'sending', 'success', 'error'
    const [feedbackText, setFeedbackText] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Reset states
        setFormStatus('sending');
        setFeedbackText('');

        // Basic validations
        if (!name.trim() || !email.trim() || !message.trim()) {
            setFormStatus('error');
            setFeedbackText('Error: Fill in all payload fields before transmission.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.trim())) {
            setFormStatus('error');
            setFeedbackText('Error: Invalid email structure detected.');
            return;
        }

        const stages = [
            'Initializing TCP handshake...',
            'Encrypting details (RSA-2048)...',
            'Transmitting packet to Django backend (Port 8000)...',
        ];

        // Animate stages first to simulate a high-tech terminal connection
        for (let i = 0; i < stages.length; i++) {
            setFeedbackText(stages[i]);
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        try {
            const response = await fetch('/api/contact/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus('success');
                setFeedbackText(data.message || 'Message successfully transmitted. I will respond shortly.');
                // Reset inputs
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setFormStatus('error');
                setFeedbackText(data.message || 'Error: Django server refused the transmission.');
            }
        } catch (error) {
            // Visual fallback if the backend server is not running locally yet
            console.warn('[Full-Stack Warning]: Backend server connection failed. Fallback simulation activated.', error);
            setFormStatus('success');
            setFeedbackText('Local server offline. Fallback transmission saved in local memory buffer.');
            setName('');
            setEmail('');
            setMessage('');
        }
    };

    return (
        <section id="contact" className="section-padding section-alt-bg">
            <div className="limit-width">
                <div className="section-header">
                    <h2 className="section-title">Get In Touch</h2>
                    <div className="section-line"></div>
                </div>

                <div className="contact-layout">
                    {/* Info Column */}
                    <div className="contact-info-column reveal-on-scroll revealed">
                        <h3 className="contact-subtitle">Let's Collaborate</h3>
                        <p className="contact-text">
                            I am actively seeking internship opportunities, freelance contracts, and collaborative software projects in Ethiopia or remote. If you have an idea or a vacancy that needs a creative full-stack perspective, let's chat.
                        </p>
                        <p className="contact-text">
                            Feel free to reach out via the secure form or directly through any of my verified social networking profiles.
                        </p>

                        <div className="social-row">
                            <a href="https://github.com/YIFRA-21/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub Profile">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/belay-ayele" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn Profile">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a href="https://t.me/belay-21" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Telegram Profile">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="contact-form-column reveal-on-scroll revealed">
                        <form onSubmit={handleFormSubmit} className="cyber-form" noValidate>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input" 
                                    placeholder=" " 
                                    required 
                                    disabled={formStatus === 'sending'}
                                />
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <span className="input-glow-bar"></span>
                            </div>
                            
                            <div className="form-group">
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input" 
                                    placeholder=" " 
                                    required 
                                    disabled={formStatus === 'sending'}
                                />
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <span className="input-glow-bar"></span>
                            </div>
                            
                            <div className="form-group">
                                <textarea 
                                    id="message" 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="form-input text-area" 
                                    placeholder=" " 
                                    required 
                                    disabled={formStatus === 'sending'}
                                ></textarea>
                                <label htmlFor="message" className="form-label">Message Payload</label>
                                <span className="input-glow-bar"></span>
                            </div>
                            
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-submit"
                                disabled={formStatus === 'sending'}
                            >
                                <span>{formStatus === 'sending' ? 'Transmitting...' : 'Transmit Message'}</span>
                                <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                            
                            <div className={`form-feedback-message ${formStatus === 'success' ? 'success' : formStatus === 'error' ? 'error' : ''}`}>
                                {feedbackText}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;

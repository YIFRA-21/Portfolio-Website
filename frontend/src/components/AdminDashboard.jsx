import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onExit }) => {
    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Dashboard State
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'projects', 'messages', 'profile'
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [lastCheckedTime, setLastCheckedTime] = useState(() => {
        const saved = localStorage.getItem('admin_messages_last_checked');
        return saved ? parseInt(saved, 10) : Date.now();
    });

    // Update last checked time for messages when entering the messages tab
    useEffect(() => {
        if (activeTab === 'messages') {
            const now = Date.now();
            localStorage.setItem('admin_messages_last_checked', now.toString());
            setLastCheckedTime(now);
        }
    }, [activeTab, messages]);

    const newMessagesCount = messages.filter(msg => {
        const msgTime = new Date(msg.timestamp).getTime();
        return msgTime > lastCheckedTime;
    }).length;

    // Administrator Identity Display State
    const [adminUsername, setAdminUsername] = useState('Administrator');
    const [adminAvatar, setAdminAvatar] = useState('');

    // Profile Settings Form State
    const [profileEdit, setProfileEdit] = useState({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });
    const [showProfilePassword, setShowProfilePassword] = useState(false);
    const [showProfilePasswordConfirm, setShowProfilePasswordConfirm] = useState(false);
    const [newAvatarBase64, setNewAvatarBase64] = useState('');
    const [profileUpdateStatus, setProfileUpdateStatus] = useState('idle'); // 'idle', 'updating', 'success', 'error'
    const [profileUpdateError, setProfileUpdateError] = useState('');

    // Project Form State
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        tags: '',
        github: '',
        demo: ''
    });
    const [projectSubmitStatus, setProjectSubmitStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
    const [projectSubmitError, setProjectSubmitError] = useState('');
    const [editingProject, setEditingProject] = useState(null);

    // Load session token from localStorage if exists
    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        const savedEmail = localStorage.getItem('admin_email');
        const savedUsername = localStorage.getItem('admin_username') || 'Administrator';
        const savedAvatar = localStorage.getItem('admin_avatar') || '';
        
        if (savedToken) {
            setToken(savedToken);
            setIsAuthenticated(true);
            setAdminUsername(savedUsername);
            setAdminAvatar(savedAvatar);
            setNewAvatarBase64(savedAvatar);
            setProfileEdit(prev => ({
                ...prev,
                username: savedUsername,
                email: savedEmail || ''
            }));
        }
    }, []);

    // Fetch projects and messages
    const fetchData = async (authToken) => {
        setIsLoadingData(true);
        const tokenToUse = authToken || token;
        try {
            // Fetch Projects
            const projResponse = await fetch('/api/projects/');
            if (projResponse.ok) {
                const projData = await projResponse.json();
                setProjects(projData);
            }

            // Fetch Messages
            const msgResponse = await fetch('/api/contact/messages/', {
                headers: {
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });
            if (msgResponse.ok) {
                const msgData = await msgResponse.json();
                setMessages(msgData);
            }
        } catch (error) {
            console.error('[Admin Dashboard Error]: Failed to fetch secure data.', error);
        } finally {
            setIsLoadingData(false);
        }
    };

    // Trigger fetch on auth change
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchData(token);
        }
    }, [isAuthenticated, token]);

    // Handle Login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsLoggingIn(true);

        if (!email.trim() || !password) {
            setLoginError('Error: Please fill in all credentials fields.');
            setIsLoggingIn(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.trim(), password })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_email', data.user.email);
                localStorage.setItem('admin_username', data.user.username);
                setToken(data.token);
                setAdminUsername(data.user.username);
                setProfileEdit({
                    username: data.user.username,
                    email: data.user.email,
                    password: '',
                    passwordConfirm: ''
                });
                setIsAuthenticated(true);
                setShowPassword(false);
            } else {
                setLoginError(data.message || 'Authentication refused. Check credentials.');
            }
        } catch (error) {
            setLoginError('Connection failed. Verify local Django API server is active on Port 8000.');
            console.error('[Admin Login Error]:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_username');
        localStorage.removeItem('admin_avatar');
        localStorage.removeItem('admin_messages_last_checked');
        setToken('');
        setIsAuthenticated(false);
        setProjects([]);
        setMessages([]);
        setAdminAvatar('');
        setNewAvatarBase64('');
        setActiveTab('overview');
        setShowPassword(false);
        setShowProfilePassword(false);
        setShowProfilePasswordConfirm(false);
        setLastCheckedTime(Date.now());
        setIsSidebarOpen(false);
    };

    // Handle Avatar File Upload Upload Change
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size limits to ensure localStorage is not saturated
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds the 2MB dashboard limit.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatarBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Profile & Credentials Update
    const handleProfileUpdateSubmit = async (e) => {
        e.preventDefault();
        setProfileUpdateError('');
        setProfileUpdateStatus('updating');

        const { username, email, password, passwordConfirm } = profileEdit;
        if (!username.trim() || !email.trim()) {
            setProfileUpdateError('Display name and email are required fields.');
            setProfileUpdateStatus('error');
            return;
        }

        if (password && password !== passwordConfirm) {
            setProfileUpdateError('New passwords do not match.');
            setProfileUpdateStatus('error');
            return;
        }

        try {
            const response = await fetch('/api/auth/profile/update/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setProfileUpdateStatus('success');
                setAdminUsername(data.user.username);
                localStorage.setItem('admin_username', data.user.username);
                localStorage.setItem('admin_email', data.user.email);
                
                // Save avatar if selected
                if (newAvatarBase64) {
                    localStorage.setItem('admin_avatar', newAvatarBase64);
                    setAdminAvatar(newAvatarBase64);
                }
                
                // reset password fields
                setProfileEdit(prev => ({
                    ...prev,
                    password: '',
                    passwordConfirm: ''
                }));
                setShowProfilePassword(false);
                setShowProfilePasswordConfirm(false);
                setTimeout(() => setProfileUpdateStatus('idle'), 3000);
            } else {
                setProfileUpdateError(data.message || 'Failed to update administrator profile.');
                setProfileUpdateStatus('error');
            }
        } catch (error) {
            setProfileUpdateError('Connection error. Server refused updates.');
            setProfileUpdateStatus('error');
        }
    };

    // Handle Create or Update Project
    const handleCreateProjectSubmit = async (e) => {
        e.preventDefault();
        setProjectSubmitError('');
        setProjectSubmitStatus('submitting');

        const { title, description, tags, github, demo } = newProject;
        if (!title.trim() || !description.trim()) {
            setProjectSubmitError('Title and description are required fields.');
            setProjectSubmitStatus('error');
            return;
        }

        const isEditing = editingProject !== null;
        const url = isEditing 
            ? `/api/projects/${editingProject.id}/update/`
            : '/api/projects/create/';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    tags: tags.trim(),
                    github: github.trim(),
                    demo: demo.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                setProjectSubmitStatus('success');
                // Reset form and editing state
                setNewProject({ title: '', description: '', tags: '', github: '', demo: '' });
                setEditingProject(null);
                // Re-fetch data
                fetchData(token);
                // Clear success message after delay
                setTimeout(() => setProjectSubmitStatus('idle'), 3000);
            } else {
                setProjectSubmitError(data.message || (isEditing ? 'Failed to update project.' : 'Failed to register project.'));
                setProjectSubmitStatus('error');
            }
        } catch (error) {
            setProjectSubmitError(isEditing ? 'Connection error. Server refused project update.' : 'Connection error. Server refused project registration.');
            setProjectSubmitStatus('error');
        }
    };

    // Handle Start Edit Project
    const handleStartEditProject = (project) => {
        setEditingProject(project);
        setNewProject({
            title: project.title,
            description: project.description,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''),
            github: project.github || '',
            demo: project.demo || ''
        });
        setProjectSubmitError('');
        setProjectSubmitStatus('idle');
    };

    // Handle Delete Project
    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('WARNING: Are you sure you want to permanently delete this project record?')) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // If the project we were editing is deleted, reset the form
                if (editingProject && editingProject.id === projectId) {
                    setEditingProject(null);
                    setNewProject({ title: '', description: '', tags: '', github: '', demo: '' });
                }
                // Re-fetch data
                fetchData(token);
            } else {
                alert('Error: Failed to delete project.');
            }
        } catch (error) {
            console.error('[Admin Project Delete Error]:', error);
            alert('Connection failed. Server refused deletion.');
        }
    };

    // Handle Delete Message
    const handleDeleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to permanently delete this message log?')) {
            return;
        }

        try {
            const response = await fetch(`/api/contact/messages/${messageId}/delete/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Re-fetch data
                fetchData(token);
            } else {
                alert('Error: Failed to delete message.');
            }
        } catch (error) {
            console.error('[Admin Message Delete Error]:', error);
            alert('Connection failed. Server refused deletion.');
        }
    };

    // Login Render
    if (!isAuthenticated) {
        return (
            <div className="admin-login-screen">
                <div className="login-glass-card">
                    <div className="login-card-header">
                        <div className="login-logo-accent">BA</div>
                        <h2 className="login-title">SECURE CONSOLE</h2>
                        <p className="login-subtitle">AUTHORIZED STAFF MEMBERS ONLY</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="login-fields-form">
                        <div className="login-form-group">
                            <label className="login-form-label">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login-form-input"
                                placeholder="email@portfolio.com"
                                required
                                disabled={isLoggingIn}
                            />
                        </div>

                        <div className="login-form-group">
                            <label className="login-form-label">Password</label>
                            <div className="password-input-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-form-input"
                                    placeholder="••••••••••••"
                                    required
                                    disabled={isLoggingIn}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {loginError && (
                            <div className="login-error-alert">
                                <span className="error-icon">⚠</span> {loginError}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="login-btn-submit"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'AUTHENTICATING...' : 'ACCESS CONSOLE'}
                        </button>
                    </form>

                    <button onClick={onExit} className="login-back-to-home">
                        ← Back to Public Website
                    </button>
                </div>
            </div>
        );
    }

    // Authenticated Dashboard Render
    return (
        <div className="admin-dashboard-layout">
            {/* Sidebar Left */}
            <aside className={`db-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <span className="sidebar-logo">BA</span>
                    <div className="sidebar-brand-text">
                        <span className="sidebar-title">PORTFOLIO</span>
                        <span className="sidebar-subtitle">CONTROL CENTRE</span>
                    </div>
                </div>

                <nav className="sidebar-navigation">
                    <button 
                        onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                        className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                            <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                            <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                            <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                            <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                        </svg>
                        <span>Overview</span>
                    </button>

                    <button 
                        onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}
                        className={`sidebar-nav-btn ${activeTab === 'projects' ? 'active' : ''}`}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span>Manage Projects</span>
                    </button>

                    {/* Messages Log Nav Button Deleted from Sidebar as per request */}

                    <button 
                        onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
                        className={`sidebar-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    >
                        <svg className="nav-icon" viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>Profile Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile-info">
                        {adminAvatar ? (
                            <img 
                                src={adminAvatar} 
                                alt="Admin Avatar" 
                                className="avatar-image-sidebar"
                                style={{ 
                                    width: '36px', 
                                    height: '36px', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover',
                                    border: '2px solid var(--accent-cyan)'
                                }} 
                            />
                        ) : (
                            <div className="avatar-placeholder">{adminUsername.charAt(0).toUpperCase()}</div>
                        )}
                        <div className="profile-text">
                            <span className="profile-name">{adminUsername}</span>
                            <span className="profile-role">Administrator</span>
                        </div>
                    </div>
                    
                    <button onClick={handleLogout} className="sidebar-logout-btn">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Access Logout</span>
                    </button>
                </div>
            </aside>
            {/* Mobile Sidebar overlay backdrop */}
            {isSidebarOpen && (
                <div 
                    className="sidebar-overlay" 
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Core Area Right */}
            <main className="db-main-content">
                <header className="db-top-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Sidebar toggle button (visible on mobile/tablet) */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="sidebar-toggle-btn-trigger"
                            title="Open Sidebar Menu"
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>

                        <div className="header-breadcrumbs">
                            <span className="breadcrumb-parent">Control Center</span>
                            <span className="breadcrumb-divider">/</span>
                            <span className="breadcrumb-active">
                                {activeTab === 'profile' ? 'Profile Settings' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="header-actions-row" style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={onExit} className="btn-view-live-site">
                            <span>View Live Website</span>
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('messages')} 
                            className="btn-header-messages-alert"
                            title="View Messages Log"
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '0.6rem',
                                borderRadius: 'var(--radius-btn)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'var(--transition-fast)',
                                position: 'relative',
                                marginLeft: '0.75rem'
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            {newMessagesCount > 0 && (
                                <span className="header-alert-badge" style={{
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    background: 'var(--accent-purple, #7F77DD)',
                                    color: '#FFFFFF',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--glow-purple-soft)'
                                }}>
                                    {newMessagesCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="db-scroll-body">
                    {/* TAB: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="db-tab-overview animate-fade-in">
                            <h1 className="db-tab-title">Overview Dashboard</h1>
                            
                            {/* Stats Rows */}
                            <div className="db-stats-row">
                                <div className="db-stat-card card-cyan">
                                    <div className="stat-card-glow"></div>
                                    <div className="stat-card-inner">
                                        <div className="stat-label">Total Projects Managed</div>
                                        <div className="stat-value">{projects.length}</div>
                                        <div className="stat-footer-text">SQLite active database records</div>
                                    </div>
                                </div>

                                <div className="db-stat-card card-purple">
                                    <div className="stat-card-glow"></div>
                                    <div className="stat-card-inner">
                                        <div className="stat-label">Messages Received</div>
                                        <div className="stat-value">{messages.length}</div>
                                        <div className="stat-footer-text">Secure customer transmissions logged</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Logs Split Grid */}
                            <div className="db-overview-split-grid">
                                {/* Recent Projects */}
                                <div className="db-grid-box">
                                    <div className="grid-box-header">
                                        <h3 className="grid-box-title">Recent Projects</h3>
                                        <button onClick={() => setActiveTab('projects')} className="box-action-btn">Manage</button>
                                    </div>
                                    <div className="grid-box-body">
                                        {projects.length === 0 ? (
                                            <div className="db-empty-state">No database records registered.</div>
                                        ) : (
                                            <div className="quick-list">
                                                {projects.slice(0, 3).map((p) => (
                                                    <div key={p.id || p.title} className="quick-list-item">
                                                        <div className="item-left">
                                                            <span className="item-title">{p.title}</span>
                                                            <div className="item-tags">
                                                                {Array.isArray(p.tags) ? p.tags.slice(0, 3).map(t => (
                                                                    <span key={t} className="tag-pill">{t}</span>
                                                                )) : null}
                                                            </div>
                                                        </div>
                                                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="item-link-btn">Code ↗</a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Recent Messages */}
                                <div className="db-grid-box">
                                    <div className="grid-box-header">
                                        <h3 className="grid-box-title">Recent Messages</h3>
                                        <button onClick={() => setActiveTab('messages')} className="box-action-btn">Read All</button>
                                    </div>
                                    <div className="grid-box-body">
                                        {messages.length === 0 ? (
                                            <div className="db-empty-state">No transmission packets stored yet.</div>
                                        ) : (
                                            <div className="quick-list">
                                                {messages.slice(0, 3).map((m) => (
                                                    <div key={m.id} className="quick-list-item msg-item">
                                                        <div className="item-left">
                                                            <span className="item-title">{m.name}</span>
                                                            <span className="item-desc">{m.message.slice(0, 60)}...</span>
                                                        </div>
                                                        <span className="item-date">{new Date(m.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MANAGE PROJECTS */}
                    {activeTab === 'projects' && (
                        <div className="db-tab-projects animate-fade-in">
                            <h1 className="db-tab-title">Portfolio Projects Registry</h1>

                            <div className="projects-tab-split">
                                {/* Current Projects Database */}
                                <div className="db-grid-box box-wide">
                                    <div className="grid-box-header">
                                        <h3 className="grid-box-title">Registered Projects Table</h3>
                                    </div>
                                    <div className="grid-box-body">
                                        {projects.length === 0 ? (
                                            <div className="db-empty-state">No database records found.</div>
                                        ) : (
                                            <div className="table-responsive-container">
                                                <table className="db-data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Title</th>
                                                            <th>Description Preview</th>
                                                            <th>Technologies</th>
                                                            <th className="align-center">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projects.map((p) => (
                                                            <tr key={p.id || p.title}>
                                                                <td className="bold-cell">{p.title}</td>
                                                                <td className="desc-cell">{p.description.slice(0, 100)}...</td>
                                                                <td>
                                                                    <div className="table-tags-row">
                                                                        {Array.isArray(p.tags) ? p.tags.map(t => (
                                                                            <span key={t} className="tag-pill">{t}</span>
                                                                        )) : null}
                                                                    </div>
                                                                </td>
                                                                <td className="align-center">
                                                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                        <button 
                                                                            onClick={() => handleStartEditProject(p)} 
                                                                            className="btn-edit-row"
                                                                            title="Edit Project details"
                                                                        >
                                                                            ✏️ Edit
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteProject(p.id)} 
                                                                            className="btn-delete-row"
                                                                            title="Delete Project permanently"
                                                                        >
                                                                            🗑 Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Register or Edit Project Form */}
                                <div className="db-grid-box box-sidebar">
                                    <div className="grid-box-header">
                                        <h3 className="grid-box-title">{editingProject ? 'Edit Project Details' : 'Register New Project'}</h3>
                                    </div>
                                    <div className="grid-box-body">
                                        <form onSubmit={handleCreateProjectSubmit} className="db-control-form">
                                            <div className="db-form-group">
                                                <label className="db-form-label">Project Title *</label>
                                                <input 
                                                    type="text" 
                                                    value={newProject.title}
                                                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="School Fee Management System"
                                                    required
                                                />
                                            </div>

                                            <div className="db-form-group">
                                                <label className="db-form-label">Description Payload *</label>
                                                <textarea 
                                                    value={newProject.description}
                                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                                    className="db-form-input text-area"
                                                    placeholder="Brief overview detailing architectural designs and components..."
                                                    required
                                                />
                                            </div>

                                            <div className="db-form-group">
                                                <label className="db-form-label">Technology Tags (Comma Separated)</label>
                                                <input 
                                                    type="text" 
                                                    value={newProject.tags}
                                                    onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="React, Django, PostgreSQL, Python"
                                                />
                                            </div>

                                            <div className="db-form-group">
                                                <label className="db-form-label">GitHub Repository Link</label>
                                                <input 
                                                    type="url" 
                                                    value={newProject.github}
                                                    onChange={(e) => setNewProject({...newProject, github: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>

                                            <div className="db-form-group">
                                                <label className="db-form-label">Live Demo Shortcut URL</label>
                                                <input 
                                                    type="text" 
                                                    value={newProject.demo}
                                                    onChange={(e) => setNewProject({...newProject, demo: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="http://localhost:3000/ or #"
                                                />
                                            </div>

                                            {projectSubmitError && (
                                                <div className="db-form-error-alert">
                                                    ⚠ {projectSubmitError}
                                                </div>
                                            )}

                                            {projectSubmitStatus === 'success' && (
                                                <div className="db-form-success-alert">
                                                    ✓ {editingProject ? 'Project successfully updated in SQLite database!' : 'Project successfully registered to SQLite database!'}
                                                </div>
                                            )}

                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                                <button 
                                                    type="submit" 
                                                    className="btn-db-submit"
                                                    disabled={projectSubmitStatus === 'submitting'}
                                                    style={{ flex: 1, marginTop: 0 }}
                                                >
                                                    {projectSubmitStatus === 'submitting' 
                                                        ? (editingProject ? 'UPDATING...' : 'REGISTERING...') 
                                                        : (editingProject ? 'SAVE' : 'REGISTER')}
                                                </button>
                                                {editingProject && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setEditingProject(null);
                                                            setNewProject({ title: '', description: '', tags: '', github: '', demo: '' });
                                                            setProjectSubmitError('');
                                                            setProjectSubmitStatus('idle');
                                                        }}
                                                        className="btn-delete-row"
                                                        style={{ flex: 1, padding: '0.8rem', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MESSAGES LOG */}
                    {activeTab === 'messages' && (
                        <div className="db-tab-messages animate-fade-in">
                            <h1 className="db-tab-title">Secured Transmissions Log</h1>
                            
                            <div className="db-grid-box box-wide">
                                <div className="grid-box-header">
                                    <h3 className="grid-box-title">Client Messages Stored ({messages.length})</h3>
                                </div>
                                <div className="grid-box-body">
                                    {messages.length === 0 ? (
                                        <div className="db-empty-state">No secured transmissions logged.</div>
                                    ) : (
                                        <div className="messages-grid-layout">
                                            {messages.map((m) => (
                                                <div key={m.id} className="msg-log-card">
                                                    <div className="msg-card-header">
                                                        <div className="sender-meta">
                                                            <span className="sender-name">{m.name}</span>
                                                            <a href={`mailto:${m.email}`} className="sender-email">{m.email}</a>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <span className="msg-date">
                                                                {new Date(m.timestamp).toLocaleString()}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleDeleteMessage(m.id)} 
                                                                className="btn-delete-row"
                                                                title="Delete Message permanently"
                                                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                                                            >
                                                                🗑 Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="msg-card-body">
                                                        <p className="msg-content-text">{m.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: PROFILE SETTINGS */}
                    {activeTab === 'profile' && (
                        <div className="db-tab-profile animate-fade-in">
                            <h1 className="db-tab-title">Administrator Profile Control</h1>
                            
                            <div className="db-grid-box" style={{ maxWidth: '600px' }}>
                                <div className="grid-box-header">
                                    <h3 className="grid-box-title">Security & Account Settings</h3>
                                </div>
                                <div className="grid-box-body">
                                    <form onSubmit={handleProfileUpdateSubmit} className="db-control-form">
                                        <div className="db-form-group">
                                            <label className="db-form-label">Profile Display Name (Username)</label>
                                            <input 
                                                type="text" 
                                                value={profileEdit.username}
                                                onChange={(e) => setProfileEdit({...profileEdit, username: e.target.value})}
                                                className="db-form-input"
                                                placeholder="Administrator"
                                                required
                                            />
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-form-label">Email Address (Login Username)</label>
                                            <input 
                                                type="email" 
                                                value={profileEdit.email}
                                                onChange={(e) => setProfileEdit({...profileEdit, email: e.target.value})}
                                                className="db-form-input"
                                                placeholder="admin@portfolio.com"
                                                required
                                            />
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-form-label">Profile Avatar Picture</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                                                {newAvatarBase64 ? (
                                                    <img 
                                                        src={newAvatarBase64} 
                                                        alt="Avatar preview" 
                                                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-cyan)' }} 
                                                    />
                                                ) : (
                                                    <div className="avatar-placeholder" style={{ width: '60px', height: '60px', fontSize: '1.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {profileEdit.username ? profileEdit.username.charAt(0).toUpperCase() : 'A'}
                                                    </div>
                                                )}
                                                <input 
                                                    type="file" 
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="db-form-input"
                                                    style={{ flexGrow: 1 }}
                                                />
                                            </div>
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-form-label">New Password (Leave blank to keep current)</label>
                                            <div className="password-input-wrapper">
                                                <input 
                                                    type={showProfilePassword ? "text" : "password"} 
                                                    value={profileEdit.password}
                                                    onChange={(e) => setProfileEdit({...profileEdit, password: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="••••••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowProfilePassword(!showProfilePassword)}
                                                    title={showProfilePassword ? "Hide password" : "Show password"}
                                                >
                                                    {showProfilePassword ? (
                                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                                        </svg>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="db-form-group">
                                            <label className="db-form-label">Confirm New Password</label>
                                            <div className="password-input-wrapper">
                                                <input 
                                                    type={showProfilePasswordConfirm ? "text" : "password"} 
                                                    value={profileEdit.passwordConfirm}
                                                    onChange={(e) => setProfileEdit({...profileEdit, passwordConfirm: e.target.value})}
                                                    className="db-form-input"
                                                    placeholder="••••••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle-btn"
                                                    onClick={() => setShowProfilePasswordConfirm(!showProfilePasswordConfirm)}
                                                    title={showProfilePasswordConfirm ? "Hide password" : "Show password"}
                                                >
                                                    {showProfilePasswordConfirm ? (
                                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                            <line x1="1" y1="1" x2="23" y2="23"></line>
                                                        </svg>
                                                    ) : (
                                                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {profileUpdateError && (
                                            <div className="db-form-error-alert">
                                                ⚠ {profileUpdateError}
                                            </div>
                                        )}

                                        {profileUpdateStatus === 'success' && (
                                            <div className="db-form-success-alert">
                                                ✓ Administrator profile successfully updated in SQLite!
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            className="btn-db-submit"
                                            disabled={profileUpdateStatus === 'updating'}
                                        >
                                            {profileUpdateStatus === 'updating' ? 'UPDATING...' : 'SAVE CHANGES'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

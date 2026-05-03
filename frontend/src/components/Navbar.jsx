import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="glass-nav">
            <div className="nav-brand">
                <Link to="/">
                    <h2>Skill-Bridge <span style={{color: "var(--primary-color)"}}>A.I.</span></h2>
                </Link>
            </div>
            <div className="nav-links" style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                <button onClick={toggleTheme} className="btn btn-secondary" style={{padding: "0.4rem 0.8rem", borderRadius: "50%"}}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                {user ? (
                    <>
                        <span style={{marginRight: "1rem", fontWeight: "600"}}>Hi, {user.name} ({user.role})</span>
                        <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{borderColor: "#ef4444", color: "#ef4444"}}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-secondary">Login</Link>
                        <Link to="/register" className="btn">Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

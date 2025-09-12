import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { Shield, Eye, EyeOff, AlertCircle, BadgeCheck } from 'lucide-react';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPoliceLogin, setShowPoliceLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = () => {
    signInWithGoogle();
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await signInWithCredentials(email, password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="login-card">
        {/* Header Section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Shield className="logo-shield" />
            </div>
            <div className="logo-text">
              <h1>MODUS-NEXUS</h1>
              <p>Law Enforcement Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="login-content">
          <div className="welcome-section">
            <h2>Secure Access Portal</h2>
            <p>Authenticate with your credentials to access the intelligence system</p>
          </div>

          {!showPoliceLogin ? (
            /* Google Login Section */
            <div className="google-section">
              <button 
                className="google-login-btn"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <div className="google-btn-content">
                  <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              </button>

              <div className="login-divider">
                <span>OR</span>
              </div>

              <button 
                className="police-login-toggle"
                onClick={() => setShowPoliceLogin(true)}
                disabled={isLoading}
              >
                <BadgeCheck className="badge-icon" />
                Police Officer Login
              </button>
            </div>
          ) : (
            /* Police Login Form */
            <form onSubmit={handleCredentialsLogin} className="police-login-form">
              <div className="form-header">
                <h3>Officer Authentication</h3>
                <p>Enter your police credentials</p>
              </div>

              <div className="form-group">
                <label htmlFor="email">Police Email</label>
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer.email@police.gov"
                    required
                    disabled={isLoading}
                    className={error ? 'error' : ''}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="police-login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Sign in as Police Officer'
                )}
              </button>

              <button 
                type="button"
                className="back-to-google"
                onClick={() => {
                  setShowPoliceLogin(false);
                  setError('');
                }}
                disabled={isLoading}
              >
                ← Back to Google Login
              </button>

              <div className="demo-credentials">
                <div className="demo-header">
                  <span>Demo Credentials</span>
                </div>
                <div className="demo-content">
                  <p>Email: <strong>officer.anderson@police.gov</strong></p>
                  <p>Password: <strong>password</strong></p>
                </div>
              </div>
            </form>
          )}

          <div className="security-notice">
            <div className="security-badge">
              <Shield size={14} />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="login-footer">
          <p>Authorized personnel only. All activities are monitored and logged.</p>
          <div className="footer-links">
            <span>v1.0.0 • MODUS-NEXUS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './hooks/useAuth';

const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Web Crawler Dashboard
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Please sign in to continue
        </p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              background: '#fee', 
              border: '1px solid #fcc', 
              padding: '10px', 
              borderRadius: '4px',
              marginBottom: '20px',
              color: '#c33'
            }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '15px' }}>
            <input
              type="text"
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '15px', 
            fontSize: '12px', 
            color: '#666' 
          }}>
            Default credentials: admin / password
          </div>
        </form>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginForm />;
  }
  
  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
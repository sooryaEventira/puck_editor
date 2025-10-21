import React, { useState, useEffect } from 'react';

interface ApiTestComponentProps {
  puck?: any;
}

const ApiTestComponent: React.FC<ApiTestComponentProps> = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [useCustomUrl, setUseCustomUrl] = useState<boolean>(false);

  // Load saved token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('apiTestToken');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('apiTestToken', token);
    } else {
      localStorage.removeItem('apiTestToken');
    }
  }, [token]);

  // Simple GET API call
  const testGetApi = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const url = useCustomUrl ? customUrl : 'https://jsonplaceholder.typicode.com/posts/1';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token is provided
      if (token.trim()) {
        headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
      
      const response = await fetch(url, { headers });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      console.log('GET API Success:', data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('GET API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simple POST API call
  const testPostApi = async () => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const url = useCustomUrl ? customUrl : 'https://jsonplaceholder.typicode.com/posts';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token is provided
      if (token.trim()) {
        headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Post',
          body: 'This is a test post from API Test Component',
          userId: 1,
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
      console.log('POST API Success:', data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('POST API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      backgroundColor: '#f9fafb'
    }}>
      <h2 style={{
        color: '#1f2937',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '24px'
      }}>
        🔗 API Test with Auth
      </h2>

      {/* Configuration Section */}
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #d1d5db'
      }}>
        <h3 style={{
          margin: '0 0 15px 0',
          color: '#374151',
          fontSize: '16px'
        }}>
          🔐 Authentication & URL Configuration
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Token Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '4px',
              fontWeight: '500'
            }}>
              Authorization Token:
            </label>
            <input
              type="password"
              placeholder="Enter your token (e.g., Bearer abc123 or just abc123)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
              <small style={{ color: '#9ca3af', fontSize: '11px' }}>
                Will automatically add "Bearer " prefix if not present
              </small>
              {token && (
                <button
                  onClick={() => setToken('')}
                  style={{
                    fontSize: '11px',
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear Token
                </button>
              )}
            </div>
          </div>

          {/* Custom URL Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="useCustomUrl"
              checked={useCustomUrl}
              onChange={(e) => setUseCustomUrl(e.target.checked)}
              style={{ margin: '0' }}
            />
            <label htmlFor="useCustomUrl" style={{
              fontSize: '12px',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              Use Custom API Endpoint
            </label>
          </div>

          {/* Custom URL Input */}
          {useCustomUrl && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#6b7280',
                marginBottom: '4px',
                fontWeight: '500'
              }}>
                Custom API URL:
              </label>
              <input
                type="url"
                placeholder="https://api.example.com/endpoint"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* API Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={testGetApi}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {loading ? 'Loading...' : 'GET API'}
        </button>
        
        <button
          onClick={testPostApi}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          {loading ? 'Loading...' : 'POST API'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '15px'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#0c4a6e',
            fontSize: '16px'
          }}>
            API Response:
          </h3>
          <pre style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#374151',
            overflow: 'auto',
            border: '1px solid #e5e7eb',
            margin: '0'
          }}>
            {result}
          </pre>
        </div>
      )}

      {/* API Info */}
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #e5e7eb'
      }}>
        <strong>Default Test API:</strong> JSONPlaceholder<br/>
        <strong>GET:</strong> /posts/1 | <strong>POST:</strong> /posts<br/>
        <strong>Features:</strong> Token Authentication | Custom URLs
      </div>
    </div>
  );
};

export default ApiTestComponent;

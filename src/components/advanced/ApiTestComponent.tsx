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
    <div className="p-5 max-w-[600px] mx-auto font-sans border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-gray-800 mb-5 text-center text-2xl">
        🔗 API Test with Auth
      </h2>

      {/* Configuration Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-5 border border-gray-300">
        <h3 className="m-0 mb-4 text-gray-700 text-base">
          🔐 Authentication & URL Configuration
        </h3>
        
        <div className="flex flex-col gap-2.5">
          {/* Token Input */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Authorization Token:
            </label>
            <input
              type="password"
              placeholder="Enter your token (e.g., Bearer abc123 or just abc123)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm box-border"
            />
            <div className="flex justify-between items-center mt-1">
              <small className="text-gray-400 text-[11px]">
                Will automatically add "Bearer " prefix if not present
              </small>
              {token && (
                <button
                  onClick={() => setToken('')}
                  className="text-[11px] text-red-600 bg-none border-none cursor-pointer underline"
                >
                  Clear Token
                </button>
              )}
            </div>
          </div>

          {/* Custom URL Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useCustomUrl"
              checked={useCustomUrl}
              onChange={(e) => setUseCustomUrl(e.target.checked)}
              className="m-0"
            />
            <label htmlFor="useCustomUrl" className="text-xs text-gray-500 cursor-pointer">
              Use Custom API Endpoint
            </label>
          </div>

          {/* Custom URL Input */}
          {useCustomUrl && (
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">
                Custom API URL:
              </label>
              <input
                type="url"
                placeholder="https://api.example.com/endpoint"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm box-border"
              />
            </div>
          )}
        </div>
      </div>

      {/* API Buttons */}
      <div className="flex gap-2.5 justify-center mb-5">
        <button
          onClick={testGetApi}
          disabled={loading}
          className={`py-3 px-6 text-white border-none rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} text-base font-medium`}
        >
          {loading ? 'Loading...' : 'GET API'}
        </button>
        
        <button
          onClick={testPostApi}
          disabled={loading}
          className={`py-3 px-6 text-white border-none rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 cursor-pointer'} text-base font-medium`}
        >
          {loading ? 'Loading...' : 'POST API'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-sky-50 border border-sky-200 rounded-md p-4 mb-4">
          <h3 className="m-0 mb-2.5 text-sky-900 text-base">
            API Response:
          </h3>
          <pre className="bg-white p-2.5 rounded text-xs text-gray-700 overflow-auto border border-gray-200 m-0">
            {result}
          </pre>
        </div>
      )}

      {/* API Info */}
      <div className="text-xs text-gray-500 text-center bg-white p-2.5 rounded border border-gray-200">
        <strong>Default Test API:</strong> JSONPlaceholder<br/>
        <strong>GET:</strong> /posts/1 | <strong>POST:</strong> /posts<br/>
        <strong>Features:</strong> Token Authentication | Custom URLs
      </div>
    </div>
  );
};

export default ApiTestComponent;

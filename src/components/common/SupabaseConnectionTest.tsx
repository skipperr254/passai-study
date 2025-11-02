import { useState } from 'react';
import { testConnection } from '../../lib/supabase';

/**
 * SupabaseConnectionTest Component
 *
 * This component tests the Supabase connection and displays the result.
 * Use this after setting up your .env.local file to verify everything works.
 *
 * To use:
 * 1. Import this component in any page (e.g., DashboardPage)
 * 2. Add <SupabaseConnectionTest /> to the JSX
 * 3. Click the "Test Connection" button
 * 4. Remove this component once verified
 */
export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleTest = async () => {
    setStatus('testing');
    setMessage('Testing connection...');

    try {
      const isConnected = await testConnection();

      if (isConnected) {
        setStatus('success');
        setMessage('✅ Successfully connected to Supabase!');
      } else {
        setStatus('error');
        setMessage('❌ Failed to connect to Supabase. Check console for details.');
      }
    } catch (error) {
      setStatus('error');
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'testing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg border-2 border-gray-200 max-w-sm z-50">
      <h3 className="font-semibold text-gray-900 mb-2">Supabase Connection Test</h3>

      <button
        onClick={handleTest}
        disabled={status === 'testing'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mb-3"
      >
        {status === 'testing' ? 'Testing...' : 'Test Connection'}
      </button>

      {message && (
        <div className={`p-3 rounded-lg border-2 ${getStatusColor()} text-sm`}>{message}</div>
      )}

      <p className="text-xs text-gray-500 mt-3">Remove this component after verification</p>
    </div>
  );
}

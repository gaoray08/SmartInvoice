import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';

export const ConnectXero = () => {
  const navigate = useNavigate();
  const { setXeroConnected } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsConnecting(false);
    setIsConnected(true);
    setXeroConnected(true);
  };

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <ExternalLink className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connect to Xero
            </h1>
            <p className="text-gray-600">
              Connect your Xero account to allow SmartInvoice to automatically upload invoices.
            </p>
          </div>

          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-2">Benefits:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Automatic invoice uploads</li>
                  <li>Real-time synchronization</li>
                  <li>Reduced manual data entry</li>
                  <li>Error-free bookkeeping</li>
                </ul>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Connect Now
                  </>
                )}
              </Button>

              <button
                onClick={() => navigate('/')}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Maybe later
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connected Successfully!
                </h2>
                <p className="text-gray-600">
                  Your Xero account is now linked to SmartInvoice.
                </p>
              </div>
              <Button onClick={handleReturn} className="w-full">
                Return to Uploads
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

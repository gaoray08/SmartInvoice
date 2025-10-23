import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FileText, CheckCircle, Loader2, ExternalLink, ArrowRight } from 'lucide-react';

export const Welcome = () => {
  const navigate = useNavigate();
  const { xeroConnected, setXeroConnected } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedConnection = localStorage.getItem('xeroConnected');
    if (storedConnection === 'true') {
      setXeroConnected(true);
      navigate('/upload');
    }
  }, [setXeroConnected, navigate]);

  const handleConnect = async () => {
    setIsConnecting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsConnecting(false);
    setShowSuccess(true);
    setXeroConnected(true);
    localStorage.setItem('xeroConnected', 'true');

    setTimeout(() => {
      navigate('/upload');
    }, 1000);
  };

  const handleContinue = () => {
    setXeroConnected(false);
    localStorage.setItem('xeroConnected', 'false');
    navigate('/upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to SmartInvoice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered invoice processing that extracts data automatically and syncs with Xero
          </p>
        </div>

        {!showSuccess ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 mx-auto">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                Connect to Xero
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Link your Xero account for automatic invoice uploads and real-time synchronization
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Automatic invoice uploads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Real-time synchronization
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Reduced manual data entry
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  Error-free bookkeeping
                </li>
              </ul>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting to Xero...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Connect Now
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-6 mx-auto">
                <ArrowRight className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                Continue Without Connecting
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Start using SmartInvoice immediately without Xero integration
              </p>
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  AI-powered data extraction
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  Manual review and editing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  Upload history tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  Export capabilities
                </li>
              </ul>
              <button
                onClick={handleContinue}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue Without Connecting
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Connected Successfully!
            </h2>
            <p className="text-gray-600">
              Your Xero account is now linked to SmartInvoice. Redirecting to dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

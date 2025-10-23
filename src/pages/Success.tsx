import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { CheckCircle, FileText } from 'lucide-react';

export const Success = () => {
  const navigate = useNavigate();
  const { extractedDataAgent1, finalData } = useAppContext();

  const displayData = finalData || extractedDataAgent1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="w-20 h-20 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Invoice Successfully Uploaded!
          </h1>

          <p className="text-gray-600 text-lg mb-6">
            Your invoice has been processed and uploaded to Xero.
          </p>

          {displayData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-semibold text-gray-900">{displayData.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="font-semibold text-gray-900">{displayData.vendor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">{displayData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-gray-900">{displayData.total}</span>
                </div>
              </div>
            </div>
          )}

          <Button onClick={() => navigate('/upload')}>
            Upload Another Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

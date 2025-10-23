import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { InvoiceHistoryTable } from '../components/InvoiceHistoryTable';
import { SummaryStats } from '../components/SummaryStats';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { FileText, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

export const Upload = () => {
  const navigate = useNavigate();
  const { setUploadedFile, setCurrentLogId, xeroConnected, setXeroConnected } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedConnection = localStorage.getItem('xeroConnected');
    if (storedConnection === 'true') {
      setXeroConnected(true);
    }
  }, [setXeroConnected]);

  const handleFileSelect = async (selectedFile: File) => {
    setIsUploading(true);
    setUploadedFile(selectedFile);

    try {
      const { data: logData, error: logError } = await supabase
        .from('invoice_logs')
        .insert({
          filename: selectedFile.name,
          file_size: selectedFile.size,
          status: 'uploading',
        })
        .select()
        .single();

      if (logError) throw logError;

      if (logData) {
        setCurrentLogId(logData.id);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigate('/progress');
    } catch (error) {
      console.error('Error:', error);
      setIsUploading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-12 h-12 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">SmartInvoice Dashboard</h1>
            </div>
            <p className="text-gray-600">
              Upload your invoice or purchase PDF and let AI extract the data for you
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {xeroConnected ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Connected to Xero</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-500 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-red-700">Not Connected</span>
                </div>
                <Link
                  to="/"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect Now
                </Link>
              </>
            )}
          </div>
        </div>

        <SummaryStats />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload New Document</h2>
          <FileUpload onFileSelect={handleFileSelect} />
          {isUploading && (
            <div className="mt-4 text-center text-blue-600 text-sm font-medium">
              Uploading invoice...
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload History</h2>
          <InvoiceHistoryTable />
        </div>
      </div>
    </div>
  );
};

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressLog } from '../components/ProgressLog';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Activity } from 'lucide-react';

export const Progress = () => {
  const navigate = useNavigate();
  const { setExtractedDataAgent1, setExtractedDataAgent2, currentLogId } = useAppContext();

  useEffect(() => {
    if (currentLogId) {
      supabase
        .from('invoice_logs')
        .update({ status: 'processing' })
        .eq('id', currentLogId)
        .then();
    }
  }, [currentLogId]);

  const handleComplete = async () => {
    const invoiceNum = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 999 + 1).toString().padStart(3, '0')}`;
    const vendors = ['ABC Pte Ltd', 'Tech Solutions Inc', 'Global Supplies Co', 'Prime Vendors Ltd', 'Elite Services'];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const amount = Math.floor(Math.random() * 4900 + 100);
    const documentType = Math.random() > 0.5 ? 'Sale Order' : 'Purchase Order';

    const agent1Data = {
      invoiceNumber: invoiceNum,
      vendor: vendor,
      date: new Date().toISOString().split('T')[0],
      total: `$${amount.toFixed(2)}`,
      taxAmount: `$${(amount * 0.1).toFixed(2)}`,
    };

    const agent2Data = {
      invoiceNumber: invoiceNum,
      vendor: vendor.replace('Pte Ltd', 'Private Ltd').replace('Inc', 'Incorporated'),
      date: new Date().toISOString().split('T')[0],
      total: `$${amount.toFixed(2)}`,
      taxAmount: `$${(amount * 0.1).toFixed(2)}`,
    };

    setExtractedDataAgent1(agent1Data);
    setExtractedDataAgent2(agent2Data);

    if (currentLogId) {
      await supabase
        .from('invoice_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          amount: amount,
          document_type: documentType,
          extracted_data: {
            agent1: agent1Data,
            agent2: agent2Data,
            final: agent1Data
          }
        })
        .eq('id', currentLogId);
    }

    navigate('/review');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-blue-600 animate-pulse" />
            <h1 className="text-3xl font-bold text-gray-900">Processing Invoice</h1>
          </div>
          <p className="text-gray-600">
            AI agents are analyzing your invoice...
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <ProgressLog onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};

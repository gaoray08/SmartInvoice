import { useEffect, useState } from 'react';
import { supabase, InvoiceLog } from '../lib/supabase';
import { FileText, CheckCircle, XCircle, DollarSign } from 'lucide-react';

export const SummaryStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    netAmount: 0,
  });

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_logs')
        .select('*');

      if (error) throw error;

      if (data) {
        const total = data.length;
        const completed = data.filter((log: InvoiceLog) => log.status === 'completed').length;
        const failed = data.filter((log: InvoiceLog) => log.status === 'failed').length;

        const netAmount = data.reduce((sum: number, log: InvoiceLog) => {
          const amount = log.amount || 0;
          return sum + (log.document_type === 'Sale Order' ? amount : -amount);
        }, 0);

        setStats({ total, completed, failed, netAmount });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();

    const channel = supabase
      .channel('stats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_logs',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 rounded-lg p-3">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Uploads</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 rounded-lg p-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 rounded-lg p-3">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-3 ${stats.netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <DollarSign className={`w-5 h-5 ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">Net Amount</p>
            <p className={`text-2xl font-bold ${stats.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatAmount(stats.netAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

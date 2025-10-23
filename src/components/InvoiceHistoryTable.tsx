import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, InvoiceLog } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Loader2, Clock, Edit, Search } from 'lucide-react';

export const InvoiceHistoryTable = () => {
  const navigate = useNavigate();
  const { setCurrentLogId, setExtractedDataAgent1, setExtractedDataAgent2, setFinalData } = useAppContext();
  const [logs, setLogs] = useState<InvoiceLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<InvoiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'Sale Order' | 'Purchase Order'>('all');

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
      setFilteredLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('invoice_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoice_logs',
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        log.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((log) => log.document_type === filterType);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, filterType, logs]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'uploading':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
      processing: 'bg-blue-100 text-blue-700',
      uploading: 'bg-yellow-100 text-yellow-700',
    };
    return statusConfig[status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-700';
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === 'Sale Order' ? '+' : '−';
    const color = type === 'Sale Order' ? 'text-green-600' : 'text-red-600';
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
    return <span className={`font-semibold ${color}`}>{prefix}{formatted}</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRowClick = (log: InvoiceLog, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (log.status === 'uploading' || log.status === 'processing') {
      setCurrentLogId(log.id);
      navigate('/progress');
    }
  };

  const handleEdit = async (log: InvoiceLog) => {
    if (log.extracted_data) {
      setExtractedDataAgent1(log.extracted_data.agent1);
      setExtractedDataAgent2(log.extracted_data.agent2);
      setFinalData(log.extracted_data.final);
      setCurrentLogId(log.id);
      navigate('/review');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('Sale Order')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'Sale Order'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sale Orders
          </button>
          <button
            onClick={() => setFilterType('Purchase Order')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'Purchase Order'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Purchase Orders
          </button>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No invoices found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">File Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={(e) => handleRowClick(log, e)}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    log.status === 'uploading' || log.status === 'processing'
                      ? 'cursor-pointer'
                      : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-gray-900">{log.filename}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(log.uploaded_at)}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.document_type === 'Sale Order'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.document_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {formatAmount(log.amount || 0, log.document_type)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {log.status === 'completed' && log.extracted_data && (
                      <button
                        onClick={() => handleEdit(log)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

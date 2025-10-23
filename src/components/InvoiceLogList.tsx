import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, InvoiceLog } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, Loader2, Clock } from 'lucide-react';

export const InvoiceLogList = () => {
  const navigate = useNavigate();
  const { setCurrentLogId } = useAppContext();
  const [logs, setLogs] = useState<InvoiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('invoice_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('invoice_logs_changes')
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'processing':
        return 'Processing';
      case 'uploading':
        return 'Uploading';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50';
      case 'failed':
        return 'text-red-700 bg-red-50';
      case 'processing':
        return 'text-blue-700 bg-blue-50';
      case 'uploading':
        return 'text-yellow-700 bg-yellow-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogClick = (log: InvoiceLog) => {
    if (log.status === 'uploading' || log.status === 'processing') {
      setCurrentLogId(log.id);
      navigate('/progress');
    }
  };

  const isClickable = (status: string) => {
    return status === 'uploading' || status === 'processing';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          onClick={() => handleLogClick(log)}
          className={`bg-white rounded-lg border border-gray-200 p-4 transition-all ${
            isClickable(log.status)
              ? 'hover:shadow-md hover:border-blue-300 cursor-pointer'
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="mt-0.5">{getStatusIcon(log.status)}</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {log.filename}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(log.file_size)} • {formatDate(log.uploaded_at)}
                </p>
                {log.error_message && (
                  <p className="text-sm text-red-600 mt-1">
                    {log.error_message}
                  </p>
                )}
                {isClickable(log.status) && (
                  <p className="text-xs text-blue-600 mt-1">
                    Click to view progress
                  </p>
                )}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                log.status
              )}`}
            >
              {getStatusText(log.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

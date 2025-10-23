import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditableTable } from '../components/EditableTable';
import { Button } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Review = () => {
  const navigate = useNavigate();
  const {
    extractedDataAgent1,
    extractedDataAgent2,
    setFinalData,
  } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataChange = (data: any) => {
    setFinalData(data);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    try {
      await fetch('https://example.com/webhook/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent1: extractedDataAgent1,
          agent2: extractedDataAgent2,
          final: extractedDataAgent1,
        }),
      });
    } catch (error) {
      console.log('Webhook call simulated');
    }

    setTimeout(() => {
      navigate('/success');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle2 className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Review & Edit</h1>
          </div>
          <p className="text-gray-600">
            Compare the results from both AI agents and edit the final values
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <EditableTable
            agent1Data={extractedDataAgent1}
            agent2Data={extractedDataAgent2}
            onDataChange={handleDataChange}
          />

          <div className="mt-8 flex justify-center">
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Confirm & Upload to Xero'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';

interface ExtractedData {
  invoiceNumber: string;
  vendor: string;
  date: string;
  total: string;
  taxAmount: string;
}

interface EditableTableProps {
  agent1Data: ExtractedData | null;
  agent2Data: ExtractedData | null;
  onDataChange: (data: ExtractedData) => void;
}

export const EditableTable = ({
  agent1Data,
  agent2Data,
  onDataChange,
}: EditableTableProps) => {
  const [finalData, setFinalData] = useState<ExtractedData>({
    invoiceNumber: agent1Data?.invoiceNumber || '',
    vendor: agent1Data?.vendor || '',
    date: agent1Data?.date || '',
    total: agent1Data?.total || '',
    taxAmount: agent1Data?.taxAmount || '',
  });

  useEffect(() => {
    onDataChange(finalData);
  }, [finalData]);

  const handleChange = (field: keyof ExtractedData, value: string) => {
    setFinalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fields: Array<{ key: keyof ExtractedData; label: string }> = [
    { key: 'invoiceNumber', label: 'Invoice Number' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'date', label: 'Date' },
    { key: 'total', label: 'Total' },
    { key: 'taxAmount', label: 'Tax Amount' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
              Field
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
              AI Agent 1
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
              AI Agent 2
            </th>
            <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
              Final (Editable)
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.key} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                {field.label}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">
                {agent1Data?.[field.key] || '-'}
              </td>
              <td className="border border-gray-300 px-4 py-3 text-gray-700">
                {agent2Data?.[field.key] || '-'}
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <input
                  type="text"
                  value={finalData[field.key]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

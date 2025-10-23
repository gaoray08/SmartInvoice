import { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-3">
          <FileText className="w-16 h-16 text-blue-600" />
          <div>
            <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <p className="text-sm text-blue-600 mt-2">Click to change file</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-16 h-16 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drag & drop your invoice PDF here
            </p>
            <p className="text-sm text-gray-500 mt-1">or click to select a file</p>
          </div>
        </div>
      )}
    </div>
  );
};

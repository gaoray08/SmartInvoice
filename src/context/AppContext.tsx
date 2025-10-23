import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ExtractedData {
  invoiceNumber: string;
  vendor: string;
  date: string;
  total: string;
  taxAmount: string;
}

interface AppContextType {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  extractedDataAgent1: ExtractedData | null;
  setExtractedDataAgent1: (data: ExtractedData | null) => void;
  extractedDataAgent2: ExtractedData | null;
  setExtractedDataAgent2: (data: ExtractedData | null) => void;
  finalData: ExtractedData | null;
  setFinalData: (data: ExtractedData | null) => void;
  currentLogId: string | null;
  setCurrentLogId: (id: string | null) => void;
  xeroConnected: boolean;
  setXeroConnected: (connected: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedDataAgent1, setExtractedDataAgent1] = useState<ExtractedData | null>(null);
  const [extractedDataAgent2, setExtractedDataAgent2] = useState<ExtractedData | null>(null);
  const [finalData, setFinalData] = useState<ExtractedData | null>(null);
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [xeroConnected, setXeroConnected] = useState<boolean>(() => {
    const stored = localStorage.getItem('xeroConnected');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('xeroConnected', xeroConnected.toString());
  }, [xeroConnected]);

  return (
    <AppContext.Provider
      value={{
        uploadedFile,
        setUploadedFile,
        extractedDataAgent1,
        setExtractedDataAgent1,
        extractedDataAgent2,
        setExtractedDataAgent2,
        finalData,
        setFinalData,
        currentLogId,
        setCurrentLogId,
        xeroConnected,
        setXeroConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

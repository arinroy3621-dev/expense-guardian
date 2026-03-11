import { useState } from 'react';
import { Camera, Upload, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExpenseEntry, ExpenseCategory } from '@/types/expense';

interface MockOCRResult {
  vendorName: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
}

const mockOCR = (): Promise<MockOCRResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: MockOCRResult[] = [
        { vendorName: 'HP Fuel Station', amount: 3150, date: '2025-03-11', category: 'fuel' },
        { vendorName: 'NHAI Toll Plaza', amount: 520, date: '2025-03-11', category: 'toll' },
        { vendorName: 'Highway Dhaba', amount: 380, date: '2025-03-11', category: 'food' },
      ];
      resolve(results[Math.floor(Math.random() * results.length)]);
    }, 2000);
  });
};

interface ReceiptUploadProps {
  onReceiptProcessed: (data: Partial<ExpenseEntry>) => void;
}

const ReceiptUpload = ({ onReceiptProcessed }: ReceiptUploadProps) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [result, setResult] = useState<MockOCRResult | null>(null);

  const handleUpload = async () => {
    setStatus('processing');
    const ocrResult = await mockOCR();
    setResult(ocrResult);
    setStatus('done');
    onReceiptProcessed({
      vendorName: ocrResult.vendorName,
      amount: ocrResult.amount,
      date: ocrResult.date,
      category: ocrResult.category,
    });
    setTimeout(() => {
      setStatus('idle');
      setResult(null);
    }, 3000);
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Upload Receipt
      </h3>

      {status === 'idle' && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleUpload}
            className="driver-btn flex-col gap-2 h-auto py-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="w-8 h-8" />
            <span>Camera</span>
          </Button>
          <Button
            onClick={handleUpload}
            variant="secondary"
            className="driver-btn flex-col gap-2 h-auto py-6"
          >
            <Upload className="w-8 h-8" />
            <span>Gallery</span>
          </Button>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center py-8 gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Scanning receipt with OCR...</p>
        </div>
      )}

      {status === 'done' && result && (
        <div className="space-y-2 py-2">
          <div className="flex items-center gap-2 text-success mb-3">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Receipt Scanned</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Vendor</span>
            <span className="font-mono font-semibold">{result.vendorName}</span>
            <span className="text-muted-foreground">Amount</span>
            <span className="font-mono font-semibold">₹{result.amount.toLocaleString('en-IN')}</span>
            <span className="text-muted-foreground">Date</span>
            <span className="font-mono">{result.date}</span>
            <span className="text-muted-foreground">Category</span>
            <span className="font-mono capitalize">{result.category}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReceiptUpload;

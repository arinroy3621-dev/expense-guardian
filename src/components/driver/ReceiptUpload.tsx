import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, Upload, Loader2, Check, RotateCcw, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExpenseEntry, ExpenseCategory } from '@/types/expense';

interface OCRResult {
  vendorName: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  rawText: string;
}

/** Try to extract structured data from raw OCR text */
function parseReceiptText(text: string): OCRResult {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Amount: look for ₹ or Rs or numbers near "total"
  let amount = 0;
  const amountPatterns = [
    /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:total|amount|grand\s*total)[:\s]*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]{3,}(?:\.\d{1,2})?)/,
  ];
  for (const pat of amountPatterns) {
    const m = text.match(pat);
    if (m) {
      amount = parseFloat(m[1].replace(/,/g, ''));
      if (amount > 0) break;
    }
  }

  // Date
  let date = new Date().toISOString().split('T')[0];
  const datePatterns = [
    /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/,
    /(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/,
  ];
  for (const pat of datePatterns) {
    const m = text.match(pat);
    if (m) {
      // Try to build a valid date
      const parts = m.slice(1).map(Number);
      if (parts[0] > 1000) {
        date = `${parts[0]}-${String(parts[1]).padStart(2, '0')}-${String(parts[2]).padStart(2, '0')}`;
      } else {
        const yr = parts[2] < 100 ? 2000 + parts[2] : parts[2];
        date = `${yr}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
      }
      break;
    }
  }

  // Category detection
  let category: ExpenseCategory = 'other';
  const lower = text.toLowerCase();
  if (/fuel|petrol|diesel|petroleum|oil|bharat|indian oil|hp |shell|reliance/i.test(lower)) {
    category = 'fuel';
  } else if (/toll|nhai|fastag/i.test(lower)) {
    category = 'toll';
  } else if (/food|restaurant|dhaba|hotel|meal|canteen/i.test(lower)) {
    category = 'food';
  } else if (/maintenance|repair|tyre|mechanic|service/i.test(lower)) {
    category = 'maintenance';
  }

  // Vendor: first meaningful line
  const vendorName = lines[0]?.substring(0, 40) || 'Unknown Vendor';

  return { vendorName, amount, date, category, rawText: text };
}

interface ReceiptUploadProps {
  onReceiptProcessed: (data: Partial<ExpenseEntry>) => void;
}

const ReceiptUpload = ({ onReceiptProcessed }: ReceiptUploadProps) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const processImage = async (file: File) => {
    setStatus('processing');
    setProgress(0);

    // Show preview
    const url = URL.createObjectURL(file);
    setPreview(url);

    try {
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round((m.progress || 0) * 100));
          }
        },
      });

      const parsed = parseReceiptText(data.text);
      setResult(parsed);
      setStatus('done');
      onReceiptProcessed({
        vendorName: parsed.vendorName,
        amount: parsed.amount,
        date: parsed.date,
        category: parsed.category,
      });
    } catch {
      setStatus('idle');
      setPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setProgress(0);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Scan Receipt
      </h3>

      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {status === 'idle' && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            className="driver-btn flex-col gap-2 h-auto py-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Camera className="w-8 h-8" />
            <span>Camera</span>
          </Button>
          <Button
            onClick={() => galleryInputRef.current?.click()}
            variant="secondary"
            className="driver-btn flex-col gap-2 h-auto py-6"
          >
            <Upload className="w-8 h-8" />
            <span>Gallery</span>
          </Button>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center py-6 gap-3">
          {preview && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border mb-2">
              <img src={preview} alt="Receipt" className="w-full h-full object-cover" />
            </div>
          )}
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Scanning with Tesseract OCR...</p>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground font-mono">{progress}%</p>
        </div>
      )}

      {status === 'done' && result && (
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-success">
              <Check className="w-5 h-5" />
              <span className="font-semibold text-sm">Receipt Scanned</span>
            </div>
            <Button size="sm" variant="ghost" onClick={reset} className="gap-1 h-7 text-xs">
              <RotateCcw className="w-3 h-3" /> New
            </Button>
          </div>

          {preview && (
            <div className="w-full h-32 rounded-lg overflow-hidden border border-border">
              <img src={preview} alt="Receipt" className="w-full h-full object-contain bg-secondary" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Vendor</span>
            <span className="font-mono font-semibold truncate">{result.vendorName}</span>
            <span className="text-muted-foreground">Amount</span>
            <span className="font-mono font-semibold">
              {result.amount > 0 ? `₹${result.amount.toLocaleString('en-IN')}` : 'Not detected'}
            </span>
            <span className="text-muted-foreground">Date</span>
            <span className="font-mono">{result.date}</span>
            <span className="text-muted-foreground">Category</span>
            <span className="font-mono capitalize">{result.category}</span>
          </div>

          {result.rawText && (
            <details className="text-xs">
              <summary className="text-muted-foreground cursor-pointer flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Raw OCR text
              </summary>
              <pre className="mt-2 p-2 bg-secondary rounded text-[10px] font-mono max-h-32 overflow-auto whitespace-pre-wrap">
                {result.rawText}
              </pre>
            </details>
          )}
        </div>
      )}
    </Card>
  );
};

export default ReceiptUpload;

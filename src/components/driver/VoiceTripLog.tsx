import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, MapPin, Fuel as FuelIcon, Route as RouteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExpenseCategory } from '@/types/expense';
import { toast } from '@/hooks/use-toast';

interface TripFormData {
  from: string;
  to: string;
  distanceKm: number;
  fuelLiters: number;
  fuelPricePerLiter: number;
  category: ExpenseCategory;
  vendorName: string;
  amount: number;
  notes: string;
}

const defaultForm: TripFormData = {
  from: '', to: '', distanceKm: 0, fuelLiters: 0,
  fuelPricePerLiter: 104.5, category: 'fuel', vendorName: '',
  amount: 0, notes: '',
};

/** Parse voice transcript into form fields */
function parseVoiceInput(text: string): Partial<TripFormData> {
  const result: Partial<TripFormData> = {};
  const lower = text.toLowerCase();

  // Route: "from X to Y" or "X to Y" or "X se Y"
  const routeMatch = text.match(/(?:from\s+|se\s+)?(\w[\w\s]*?)\s+(?:to|se|tak)\s+(\w[\w\s]*?)(?:\s*,|\s*\.|$)/i);
  if (routeMatch) {
    result.from = routeMatch[1].trim();
    result.to = routeMatch[2].trim();
  }

  // Distance: "300 km" or "300 kilometer"
  const distMatch = text.match(/(\d+)\s*(?:km|kilometer|kilometres|kilo)/i);
  if (distMatch) result.distanceKm = parseInt(distMatch[1]);

  // Fuel: "40 liters" or "40L"
  const fuelMatch = text.match(/(\d+)\s*(?:liters?|litres?|l\b)/i);
  if (fuelMatch) result.fuelLiters = parseInt(fuelMatch[1]);

  // Price per liter
  const priceMatch = text.match(/(?:price|rate|per liter|per litre)\s*(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)/i);
  if (priceMatch) result.fuelPricePerLiter = parseFloat(priceMatch[1]);

  // Amount: "₹3000" or "3000 rupees" or "total 3000"
  const amountMatch = text.match(/(?:₹|rs\.?|rupees?\s*|total\s*|amount\s*)(\d[\d,]*)/i);
  if (amountMatch) result.amount = parseInt(amountMatch[1].replace(/,/g, ''));

  // Category
  if (/fuel|petrol|diesel/i.test(lower)) result.category = 'fuel';
  else if (/toll/i.test(lower)) result.category = 'toll';
  else if (/food|khana|lunch|dinner|breakfast/i.test(lower)) result.category = 'food';
  else if (/repair|maintenance|tyre|mechanic/i.test(lower)) result.category = 'maintenance';

  return result;
}

// Check for SpeechRecognition support
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

interface VoiceTripLogProps {
  onTripLogged: (data: TripFormData) => void;
}

const VoiceTripLog = ({ onTripLogged }: VoiceTripLogProps) => {
  const [form, setForm] = useState<TripFormData>(defaultForm);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const updateField = <K extends keyof TripFormData>(key: K, value: TripFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      toast({ title: 'Voice not supported', description: 'Use Chrome or Edge on Android for voice input.', variant: 'destructive' });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interimText += result[0].transcript;
        }
      }
      const full = (finalText + interimText).trim();
      setTranscript(full);

      // Auto-parse final results
      if (finalText.trim()) {
        const parsed = parseVoiceInput(finalText);
        setForm((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(parsed).filter(([, v]) => v !== undefined && v !== '' && v !== 0)
          ),
        }));
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const handleSubmit = () => {
    if (!form.from || !form.to) {
      toast({ title: 'Missing route', description: 'Please enter From and To locations.', variant: 'destructive' });
      return;
    }
    // Auto-calculate amount if fuel data present
    const finalForm = { ...form };
    if (finalForm.category === 'fuel' && finalForm.fuelLiters > 0 && finalForm.amount === 0) {
      finalForm.amount = Math.round(finalForm.fuelLiters * finalForm.fuelPricePerLiter);
    }
    onTripLogged(finalForm);
    setForm(defaultForm);
    setTranscript('');
    toast({ title: 'Trip logged!', description: `${finalForm.from} → ${finalForm.to}` });
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Log Trip
      </h3>

      {/* Voice Button */}
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`driver-btn w-full mb-3 gap-3 ${
          isListening
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            <span>Stop Recording</span>
            <span className="ml-auto flex h-3 w-3">
              <span className="animate-ping absolute h-3 w-3 rounded-full bg-destructive-foreground/50" />
              <span className="relative h-3 w-3 rounded-full bg-destructive-foreground" />
            </span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>Tap to Speak</span>
          </>
        )}
      </Button>

      {/* Transcript */}
      {transcript && (
        <div className="mb-3 p-2 bg-secondary rounded-lg text-xs font-mono text-secondary-foreground">
          <span className="text-muted-foreground text-[10px] uppercase">Voice:</span> {transcript}
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">From</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={form.from}
                onChange={(e) => updateField('from', e.target.value)}
                className="pl-7 h-9 text-sm"
                placeholder="Delhi"
              />
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">To</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                value={form.to}
                onChange={(e) => updateField('to', e.target.value)}
                className="pl-7 h-9 text-sm"
                placeholder="Jaipur"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">Distance (km)</Label>
            <div className="relative">
              <RouteIcon className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="number"
                value={form.distanceKm || ''}
                onChange={(e) => updateField('distanceKm', Number(e.target.value))}
                className="pl-7 h-9 text-sm font-mono"
                placeholder="300"
              />
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">Fuel (L)</Label>
            <div className="relative">
              <FuelIcon className="absolute left-2 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                type="number"
                value={form.fuelLiters || ''}
                onChange={(e) => updateField('fuelLiters', Number(e.target.value))}
                className="pl-7 h-9 text-sm font-mono"
                placeholder="40"
              />
            </div>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">₹/Liter</Label>
            <Input
              type="number"
              value={form.fuelPricePerLiter || ''}
              onChange={(e) => updateField('fuelPricePerLiter', Number(e.target.value))}
              className="h-9 text-sm font-mono"
              step="0.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => updateField('category', v as ExpenseCategory)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fuel">Fuel</SelectItem>
                <SelectItem value="toll">Toll</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground uppercase">Amount (₹)</Label>
            <Input
              type="number"
              value={form.amount || ''}
              onChange={(e) => updateField('amount', Number(e.target.value))}
              className="h-9 text-sm font-mono"
              placeholder="Auto from fuel"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="driver-btn w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Send className="w-5 h-5" />
          Submit Trip
        </Button>
      </div>
    </Card>
  );
};

export default VoiceTripLog;

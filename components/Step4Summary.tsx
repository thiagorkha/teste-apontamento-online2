import React, { useState } from 'react';
import { ProductionData } from '../types';
import { Save, ClipboardList, PenTool, AlertTriangle } from 'lucide-react';
import { submitProductionData } from '../services/apiService';

interface Props {
  data: ProductionData;
  updateData: (updates: Partial<ProductionData>) => void;
  onNext: () => void;
  onBack: () => void; // To allow fixing setup/qty if needed, though simpler to just not go back to timer.
}

export const Step4Summary: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durationSeconds = (data.endTime && data.startTime) 
    ? Math.floor((data.endTime - data.startTime) / 1000) 
    : 0;
  
  const formatDuration = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleSave = async () => {
    if (data.quantity === undefined || data.quantity < 0 || isNaN(data.quantity)) {
      setError("Informe uma quantidade válida.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const success = await submitProductionData(data);
    
    if (success) {
      onNext(); // Go to success screen
    } else {
      // It failed network but saved to queue
      onNext(); // Still go to success screen, but maybe with a "Saved Offline" note? 
                // Ideally API service handles the "Saved to Queue" logic and returns false, 
                // but for UX, we treat "Saved to Queue" as a success state for the user flow.
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-500" />
        Resumo Final
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 space-y-2">
         <div className="flex justify-between border-b border-blue-100 pb-2">
             <span className="text-gray-500 text-sm">Tempo Total</span>
             <span className="font-mono font-bold text-gray-800">{formatDuration(durationSeconds)}</span>
         </div>
         <div className="flex justify-between pt-1">
             <span className="text-gray-500 text-sm">Operador</span>
             <span className="font-medium text-gray-800 text-right">{data.operador}</span>
         </div>
         <div className="flex justify-between">
             <span className="text-gray-500 text-sm">OP / CP</span>
             <span className="font-medium text-gray-800 text-right">{data.op} / {data.cp}</span>
         </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade Produzida <span className="text-red-500">*</span>
            </label>
            <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0"
                value={data.quantity || ''}
                onChange={(e) => updateData({ quantity: parseInt(e.target.value) || 0 })}
            />
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo de Setup (minutos)
            </label>
            <input
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ex: 15"
                value={data.setupTime || ''}
                onChange={(e) => updateData({ setupTime: parseInt(e.target.value) || 0 })}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Observação (Opcional)
            </label>
            <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder="Alguma parada ou problema?"
                value={data.observation}
                onChange={(e) => updateData({ observation: e.target.value })}
            />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors shadow-md flex items-center justify-center gap-2 ${
          isSubmitting 
            ? 'bg-blue-400 cursor-wait' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isSubmitting ? (
            <>Salvando...</>
        ) : (
            <>
                <Save className="w-5 h-5" />
                Salvar Dados
            </>
        )}
      </button>
    </div>
  );
};

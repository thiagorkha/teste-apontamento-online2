import React from 'react';
import { ProductionData } from '../types';
import { FileText, Tag, ArrowLeft } from 'lucide-react';

interface Props {
  data: ProductionData;
  updateData: (updates: Partial<ProductionData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Order: React.FC<Props> = ({ data, updateData, onNext, onBack }) => {
  const isValid = data.op.trim().length > 0 && data.cp.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      // Set start time if not already set (re-entry protection)
      if (!data.startTime) {
        updateData({ startTime: Date.now() });
      }
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Ordem de Produção
      </h2>

      <div className="mb-4">
        <label htmlFor="op" className="block text-sm font-medium text-gray-700 mb-1">
          Ordem de Produção (OP)
        </label>
        <div className="relative">
          <input
            type="text"
            id="op"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ex: 2024-12345"
            value={data.op}
            onChange={(e) => updateData({ op: e.target.value })}
            required
          />
          <FileText className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="cp" className="block text-sm font-medium text-gray-700 mb-1">
          Código do Produto (CP)
        </label>
        <div className="relative">
          <input
            type="text"
            id="cp"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Ex: PROD-A01"
            value={data.cp}
            onChange={(e) => updateData({ cp: e.target.value })}
            required
          />
          <Tag className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-1/3 py-3 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full sm:w-2/3 py-3 px-4 rounded-lg font-semibold text-white transition-colors shadow-md ${
            isValid 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Iniciar Produção
        </button>
      </div>
    </form>
  );
};

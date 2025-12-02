import React from 'react';
import { ProductionData } from '../types';
import { User, Settings } from 'lucide-react';

interface Props {
  data: ProductionData;
  updateData: (updates: Partial<ProductionData>) => void;
  onNext: () => void;
}

const MACHINES = [
  "Romi D1000",
  "Veker Mvk 1050",
  "Torno Cnc Cosmos",
  "Torno Convencional",
  "Torno Mascote",
  "Fresadora Ferramenteira"
];

export const Step1Setup: React.FC<Props> = ({ data, updateData, onNext }) => {
  const isValid = data.operador.trim().length > 0 && data.maquina !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-500" />
        Início do Turno
      </h2>
      
      <div className="mb-4">
        <label htmlFor="operador" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Operador
        </label>
        <input
          type="text"
          id="operador"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Ex: João Silva"
          value={data.operador}
          onChange={(e) => updateData({ operador: e.target.value })}
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="maquina" className="block text-sm font-medium text-gray-700 mb-1">
          Máquina / Linha
        </label>
        <div className="relative">
          <select
            id="maquina"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all"
            value={data.maquina}
            onChange={(e) => updateData({ maquina: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {MACHINES.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <Settings className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors shadow-md ${
          isValid 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        Próximo
      </button>
    </form>
  );
};

import React, { useEffect, useState } from 'react';
import { CheckCircle, WifiOff } from 'lucide-react';
import { getQueueCount } from '../services/dbService';

interface Props {
  onReset: () => void;
}

export const Step5Success: React.FC<Props> = ({ onReset }) => {
  const [offlineCount, setOfflineCount] = useState(0);

  useEffect(() => {
    getQueueCount().then(setOfflineCount);
  }, []);

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Dados Salvos!</h2>
      <p className="text-gray-600 mb-8">
        O apontamento de produção foi registrado com sucesso.
      </p>

      {offlineCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-8 inline-flex items-center gap-2 text-yellow-800 text-sm">
          <WifiOff className="w-4 h-4" />
          <span>{offlineCount} registros na fila offline (serão enviados quando online).</span>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 px-4 rounded-lg font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
      >
        Iniciar Novo Registro
      </button>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { ProductionData } from '../types';
import { Clock, Play, Pause, StopCircle } from 'lucide-react';

interface Props {
  data: ProductionData;
  updateData: (updates: Partial<ProductionData>) => void;
  onNext: () => void;
}

export const Step3Timer: React.FC<Props> = ({ data, updateData, onNext }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!data.startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - data.startTime!) / 1000);
      setElapsed(diffInSeconds);
    }, 1000);

    // Initial calculation
    setElapsed(Math.floor((Date.now() - data.startTime) / 1000));

    return () => clearInterval(interval);
  }, [data.startTime]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (elapsed < 1) {
      alert("Produção muito curta.");
      return;
    }
    updateData({ endTime: Date.now() });
    onNext();
  };

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center justify-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        Tempo em Produção
      </h2>

      <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200 shadow-inner">
        <div className="text-5xl md:text-6xl font-mono font-bold text-gray-800 tracking-wider mb-2">
          {formatTime(elapsed)}
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Produção em andamento
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-left mb-8 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100">
        <div>
          <span className="block font-semibold text-gray-400 text-xs">OPERADOR</span>
          {data.operador}
        </div>
        <div>
          <span className="block font-semibold text-gray-400 text-xs">MÁQUINA</span>
          {data.maquina}
        </div>
        <div>
          <span className="block font-semibold text-gray-400 text-xs">OP</span>
          {data.op}
        </div>
        <div>
          <span className="block font-semibold text-gray-400 text-xs">CP</span>
          {data.cp}
        </div>
      </div>

      <button
        onClick={handleFinish}
        className="w-full py-4 px-6 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-95"
      >
        <StopCircle className="w-6 h-6" />
        Finalizar Produção
      </button>
    </div>
  );
};

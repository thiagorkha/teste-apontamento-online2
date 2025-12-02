import { ProductionData } from '../types';
import { saveToQueue } from './dbService';

// REPLACE WITH YOUR GOOGLE SCRIPT URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQXPruL9fpi7bsbLcOmZsaqanwMgWbWzqnp64v_kmJ7xI3FJznelkHuVK3w1ZjWr8M/exec';

const formatDuration = (seconds: number): string => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDateTime = (timestamp: number | null): string => {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
};

export const submitProductionData = async (data: ProductionData): Promise<boolean> => {
  const durationSeconds = data.startTime && data.endTime 
    ? Math.floor((data.endTime - data.startTime) / 1000) 
    : 0;

  const payload = {
    Operador: data.operador,
    Maquina: data.maquina,
    OP: data.op,
    CP: data.cp,
    HoraInicio: formatDateTime(data.startTime),
    HoraFim: formatDateTime(data.endTime),
    Duracao: formatDuration(durationSeconds),
    Quantidade: data.quantity,
    Observacao: data.observation,
    SetupMinutos: data.setupTime,
  };

  try {
    if (!navigator.onLine) {
      throw new Error("Offline");
    }

    // Google Apps Script Web Apps often require no-cors for simple submission
    // Note: no-cors returns an opaque response, so we can't read the body.
    // We assume if fetch doesn't throw, it reached the server.
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    return true;
  } catch (error) {
    console.warn("Submission failed, saving to offline queue:", error);
    await saveToQueue(payload);
    return false; // Returns false to indicate it went to queue, not direct success
  }
};

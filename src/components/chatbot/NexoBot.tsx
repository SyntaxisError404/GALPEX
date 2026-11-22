import React, { useState, useRef, useEffect } from 'react';
import { useNexo } from '../../context/NexoContext';
import { useAuth } from '../../context/AuthContext';
import { queryLocalKnowledgeBase } from '../../data/botKnowledge';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Key
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const NexoBot: React.FC = () => {
  const { role } = useNexo();
  const { currentUser } = useAuth();
  const firstName = currentUser?.name.split(' ')[0] || '';
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [apiKey, setApiKey] = useState<string>(() => {
    return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('nexo_gemini_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hi = firstName ? `Hola ${firstName}.` : 'Hola.';
  const initialGreeting = role === 'dueno_galpon'
    ? `${hi} Detecté que el Lote SKU-8841 de TecnoParts vence en 48h. El Depósito Anti-Abandono de $30 cubre el flete de retorno automático si no retiran a tiempo, protegiendo tu espacio sin pérdidas.`
    : role === 'transportista'
    ? `${hi} Tienes asignado el despacho #NX-8492 hacia Ferretería El Tornillo en Naguanagua con tarifa garantizada en Escrow ($85 USD). ¿Deseas verificar la ruta o escanear QR de retiro?`
    : `${firstName ? '¡Hola ' + firstName + '!' : '¡Hola!'} Soy tu Copiloto Logístico KARGON. Puedes consultarme sobre cotizaciones por paleta, disponibilidad en Castillito o San Diego, o cómo funciona el depósito de garantía en custodia Escrow.`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: initialGreeting,
      timestamp: '10:42 AM'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const quickChips = [
    '¿Cómo funciona el Escrow?',
    'Calcular tarifa m²',
    'Reglas de compatibilidad',
    'Verificación 4 Candados',
    'Cláusula Anti-Abandono'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Call Gemini API if key is available, else use expert local engine
    if (apiKey.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `Eres NexoBot Copiloto, asesor logístico experto de KARGON para Venezuela. Responde de forma concisa, profesional y con datos concretos venezolanos (Zonas industriales de Valencia, San Diego, Los Guayos, Caracas; Código de Comercio, Guías SADA/SICA, Escrow en USD con tasa oficial BCV, y protocolo de 4 candados). Pregunta: ${query}`
                  }
                ]
              }
            ]
          })
        });

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || queryLocalKnowledgeBase(query);

        setMessages(prev => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local engine:', err);
      }
    }

    // Deterministic instant local response
    setTimeout(() => {
      const botReply = queryLocalKnowledgeBase(query);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsLoading(false);
    }, 400);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('nexo_gemini_key', key);
    setShowKeyModal(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 group transition-all duration-200 transform hover:scale-105"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
        <Bot className="w-5 h-5 text-blue-400" />
        <span className="text-xs font-bold pr-1">NexoBot Copiloto</span>
      </button>
    );
  }

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 sm:w-[400px] h-[520px]'
      }`}>
        {/* Header (Matches Screenshot 3) */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black flex items-center gap-1.5">
                <span>NexoBot Copiloto Logístico</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>En línea • IA Activa {apiKey ? '(Gemini)' : '(Motor Local)'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyModal(true)}
              title="Configurar Gemini API Key"
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition text-xs"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none whitespace-pre-line leading-relaxed'
                  }`}>
                    <div>{msg.text}</div>
                    <div className={`text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span>NexoBot analizando normativa...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips (Matches Screenshot 3) */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[10px] font-bold whitespace-nowrap transition border border-slate-200 shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe tu consulta a NexoBot..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white flex items-center justify-center transition shadow shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Conexión Gemini API (Opcional)
                </h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-slate-500 leading-relaxed">
              KARGON ya funciona 100% de manera autónoma con su motor de intenciones en TypeScript. Si deseas habilitar IA generativa abierta para consultas complejas, ingresa tu <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code>.
            </p>

            <div>
              <label className="font-bold text-slate-700 block mb-1">API Key de Gemini</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                defaultValue={apiKey}
                id="gemini-key-input"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('gemini-key-input') as HTMLInputElement;
                  handleSaveApiKey(input.value);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold"
              >
                Guardar Clave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

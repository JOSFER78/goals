/**
 * src/core/components/voice/VoiceConnectionsCenter.tsx
 * 
 * Centro de Conexiones de Voz Agéntica (BYOK - Bring Your Own Key).
 * Permite configurar y probar conexiones reales de Deepgram, Gemini Live, OpenAI Realtime,
 * Groq, ElevenLabs y Web Speech con enlaces directos en 1 clic y medición de latencia.
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ExternalLink, 
  Loader2, 
  Radio, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  Layers, 
  Eye, 
  EyeOff, 
  Clipboard, 
  Play
} from 'lucide-react';
import { 
  VoiceProviderId, 
  VoiceConnectionsState, 
  VoiceTestResult 
} from '../../types/voiceConnections';
import { 
  VoiceProviderService, 
  VOICE_PROVIDERS_METADATA 
} from '../../services/VoiceProviderService';

interface VoiceConnectionsCenterProps {
  onToast?: (message: string) => void;
}

export const VoiceConnectionsCenter: React.FC<VoiceConnectionsCenterProps> = ({ onToast }) => {
  const [configState, setConfigState] = useState<VoiceConnectionsState>(() => VoiceProviderService.loadState());
  const [selectedProviderId, setSelectedProviderId] = useState<VoiceProviderId>(configState.activeProviderId);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<VoiceTestResult | null>(null);

  // Sincronizar estado al cambiar externamente o tras Hot-Swap
  useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      if (e.detail) {
        setConfigState({ ...e.detail });
      }
    };
    const handleProviderSwapped = (e: any) => {
      if (e.detail?.state) {
        setConfigState({ ...e.detail.state });
      } else {
        setConfigState({ ...VoiceProviderService.getState() });
      }
    };

    window.addEventListener('goals_voice_config_updated', handleConfigUpdate);
    window.addEventListener('goals_voice_provider_swapped', handleProviderSwapped);
    return () => {
      window.removeEventListener('goals_voice_config_updated', handleConfigUpdate);
      window.removeEventListener('goals_voice_provider_swapped', handleProviderSwapped);
    };
  }, []);

  const activeProvider = VOICE_PROVIDERS_METADATA[selectedProviderId];
  const activeConfig = configState.providers[selectedProviderId];

  const handleSelectProvider = (id: VoiceProviderId) => {
    setSelectedProviderId(id);
    setTestResult(null);
    setShowApiKey(false);
  };

  const handleSetActive = (id: VoiceProviderId) => {
    VoiceProviderService.setActiveProvider(id);
    setConfigState(VoiceProviderService.getState());
    if (onToast) {
      onToast(`Proveedor de voz activo: ${VOICE_PROVIDERS_METADATA[id].name}`);
    }
  };

  const handleKeyChange = (newKey: string) => {
    VoiceProviderService.updateProviderConfig(selectedProviderId, { apiKey: newKey.trim() });
    setConfigState(VoiceProviderService.getState());
  };

  const handleModelChange = (modelId: string) => {
    VoiceProviderService.updateProviderConfig(selectedProviderId, { selectedModel: modelId });
    setConfigState(VoiceProviderService.getState());
  };

  const handleVoiceChange = (voiceId: string) => {
    VoiceProviderService.updateProviderConfig(selectedProviderId, { selectedVoice: voiceId });
    setConfigState(VoiceProviderService.getState());
  };

  const handlePasteKey = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleKeyChange(text);
        if (onToast) onToast('API Key pegada desde el portapapeles');
      }
    } catch {
      if (onToast) onToast('No se pudo acceder al portapapeles. Pégala manualmente.');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await VoiceProviderService.testConnection(selectedProviderId);
      setTestResult(res);
      setConfigState(VoiceProviderService.getState());
      if (res.status === 'connected') {
        if (onToast) onToast(`¡Conexión verificada! Latencia: ${res.latencyMs} ms`);
      } else {
        if (onToast) onToast(res.message);
      }
    } catch (e: any) {
      setTestResult({
        providerId: selectedProviderId,
        status: 'error',
        latencyMs: 0,
        message: e?.message || 'Error durante la prueba',
        timestamp: Date.now()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handlePlaySample = () => {
    VoiceProviderService.playSampleAudio(
      `¡Hola! Soy tu tutor en GOALS. El motor ${activeProvider.name} está conectado y listo.`,
      selectedProviderId,
      activeConfig.selectedVoice
    );
    if (onToast) onToast(`Reproduciendo muestra de voz neural (${activeProvider.name})`);
  };

  const allProvidersList = Object.keys(VOICE_PROVIDERS_METADATA) as VoiceProviderId[];

  return (
    <div className="space-y-5 text-left">
      {/* 1. Header de Estado Activo y Resumen */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-indigo-950/40 border border-indigo-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proveedor en Uso:</span>
              <span className="text-sm font-black text-white flex items-center gap-1.5">
                {VOICE_PROVIDERS_METADATA[configState.activeProviderId].name}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Voz en tiempo real y sintetizador agéntico para la mascota y lecciones interactivas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => {
              const nextVal = !configState.enableSmartFallback;
              VoiceProviderService.saveState({ enableSmartFallback: nextVal });
              setConfigState(VoiceProviderService.getState());
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              configState.enableSmartFallback 
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fallback Inteligente: {configState.enableSmartFallback ? 'ACTIVO' : 'MANUAL'}</span>
          </button>
        </div>
      </div>

      {/* 2. Grid Selector de Proveedores */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {allProvidersList.map((id) => {
          const prov = VOICE_PROVIDERS_METADATA[id];
          const provConfig = configState.providers[id];
          const isSelected = selectedProviderId === id;
          const isActive = configState.activeProviderId === id;
          const hasKey = !prov.requiresKey || !!provConfig.apiKey;
          const isConnected = provConfig.lastStatus === 'connected' || id === 'webspeech';

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleSelectProvider(id)}
              className={`p-3 rounded-xl text-left transition-all relative border cursor-pointer flex flex-col justify-between ${
                isSelected 
                  ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50' 
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-black text-white truncate">{prov.name}</span>
                  {isActive && (
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[9px] border border-emerald-500/40 shrink-0">
                      ACTIVO
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{prov.badge}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {prov.typicalLatencyMs > 0 ? `~${prov.typicalLatencyMs}ms` : '0ms local'}
                </span>
                <span className={`font-bold ${isConnected ? 'text-emerald-400' : hasKey ? 'text-cyan-400' : 'text-slate-500'}`}>
                  {isConnected ? '● Conectado' : hasKey ? '● Listo' : '○ Sin Clave'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Panel de Configuración del Proveedor Seleccionado */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-4">
        {/* Cabecera del proveedor */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">{activeProvider.name}</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                {activeProvider.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{activeProvider.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {configState.activeProviderId === selectedProviderId ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm shadow-emerald-500/10">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Proveedor Principal Activo</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleSetActive(selectedProviderId)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Usar como Principal</span>
              </button>
            )}
          </div>
        </div>

        {/* Campo de API Key (si aplica) */}
        {activeProvider.requiresKey && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>API Key de {activeProvider.name}</span>
              </label>

              <a
                href={activeProvider.apiKeyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors group"
              >
                <span>🔑 Conseguir Clave en 1 Clic</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={activeConfig.apiKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder={`Introduce tu clave de ${activeProvider.name}...`}
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono pr-20"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title={showApiKey ? 'Ocultar' : 'Mostrar'}
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handlePasteKey}
                  className="p-1.5 text-cyan-400 hover:text-cyan-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Pegar"
                >
                  <Clipboard className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              💡 {activeProvider.freeTierDesc} Tu clave se guarda exclusivamente en tu navegador de forma segura.
            </p>
          </div>
        )}

        {/* Selector de Modelo y Voz */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Selector de Modelo */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-indigo-400" />
              <span>Modelo de IA / Pipeline:</span>
            </label>
            <select
              value={activeConfig.selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {activeProvider.models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.recommended ? '⭐ (Recomendado)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Voz */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span>Voz Asignada:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {activeProvider.voices.length} disponibles (ES / EN)
              </span>
            </label>
            <select
              value={activeConfig.selectedVoice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {activeProvider.voices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones de Acción y Test de Conexión Real */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestConnection}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-2 cursor-pointer border border-slate-700 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Comprobando Ping...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Probar Conexión (Ping Real)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePlaySample}
              className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer border border-indigo-500/30"
            >
              <Play className="w-3 h-3 text-indigo-400" />
              <span>Escuchar Muestra</span>
            </button>
          </div>

          {testResult && (
            <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              testResult.status === 'connected'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {testResult.status === 'connected' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className="truncate max-w-xs">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Mini Guía Paso a Paso */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Guía Rápida para {activeProvider.name}:</span>
          </div>
          <ol className="list-decimal list-inside text-[11px] text-slate-300 space-y-1">
            {activeProvider.guideSteps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

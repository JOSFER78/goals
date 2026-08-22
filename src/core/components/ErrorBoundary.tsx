import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GOALS ErrorBoundary] Excepción capturada:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  private handleSoftRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#090d16] text-white flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-lg w-full bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto text-3xl">
              🪐
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                GOALS — Reintentar Carga
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ha ocurrido una excepción inesperada al cargar la interfaz. Puedes reintentar o restablecer los datos en caché.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-xl p-3 text-left overflow-auto max-h-36 scrollbar-thin">
                <p className="text-[11px] font-mono text-rose-400 font-bold mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[9px] font-mono text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleSoftRetry}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                🔄 Reintentar Renderizado
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                🧹 Limpiar Caché y Recargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

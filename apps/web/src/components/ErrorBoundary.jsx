
import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Global ErrorBoundary] Caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-950 flex flex-col items-center justify-center p-6 text-white font-sans">
          <div className="bg-red-900/40 border border-red-500/50 p-8 rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col items-center text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mb-6" />
            <h1 className="text-3xl font-bold text-red-100 mb-4">Ops! Algo deu errado.</h1>
            <p className="text-red-200 mb-6 text-lg">
              Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
            </p>
            
            <div className="w-full bg-black/40 rounded-xl p-4 mb-8 overflow-hidden text-left border border-red-900/50">
              <p className="text-red-400 font-mono text-sm font-bold mb-2">
                {this.state.error?.toString()}
              </p>
              <details className="text-red-300/70 font-mono text-xs">
                <summary className="cursor-pointer hover:text-red-300 mb-2 outline-none">Ver detalhes técnicos</summary>
                <pre className="mt-2 overflow-x-auto custom-scrollbar pb-2">
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-red-900/50 active:scale-95"
            >
              <RefreshCcw className="w-5 h-5" />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

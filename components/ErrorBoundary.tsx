import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical UI Error:", error, errorInfo);
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
          <div className="max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-red-100">
            <div className="text-6xl mb-6">🎤</div>
            <h1 className="text-3xl font-black text-brand-dark mb-4">Ups! Ceva nu a mers bine.</h1>
            <p className="text-gray-600 mb-8">Aplicația a întâmpinat o eroare neașteptată în timpul procesării.</p>
            <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-brand-purple text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-brand-dark transition-all"
                >
                  Înapoi la Pagina Principală
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-gray-500 font-bold hover:text-brand-purple transition-colors"
                >
                  Încearcă Refresh
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
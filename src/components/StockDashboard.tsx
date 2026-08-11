import { useState, useEffect } from 'react';
import StockCard from './StockCard';
import AddTickerForm from './AddTickerForm';
import CircuitStatus from './CircuitStatus';
import { Activity, WifiOff } from 'lucide-react';

const DEFAULT_TICKERS = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSLA'];

export default function StockDashboard() {
  const [tickers, setTickers] = useState<string[]>(DEFAULT_TICKERS);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAddTicker = (symbol: string) => {
    if (!tickers.includes(symbol)) {
      setTickers(prev => [symbol, ...prev]);
    }
  };

  const handleRemoveTicker = (symbol: string) => {
    setTickers(prev => prev.filter(t => t !== symbol));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Global Offline Network Alert */}
        {isOffline && (
          <div 
            className="bg-rose-950/80 border border-rose-500/50 rounded-xl p-4 flex items-center gap-3 text-rose-200 shadow-xl"
            role="alert"
          >
            <WifiOff className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold">Network Offline / Host Unreachable</h4>
              <p className="text-xs text-rose-300">Your device is currently offline. Real-time updates and API requests are suspended.</p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-slate-950 shadow-lg shadow-cyan-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                PULSE<span className="text-cyan-400">TICKER</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time stock dashboard with TanStack Query & Circuit Breaker fault tolerance
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Polling: <strong className="text-cyan-400">10s</strong></span>
            </div>
            <span className="text-slate-700">|</span>
            <div>Tracked: <strong className="text-white">{tickers.length}</strong></div>
          </div>
        </header>

        {/* Global Resilience Circuit Status Banner */}
        <CircuitStatus />

        {/* Add Ticker Input Control */}
        <section aria-label="Add Ticker Control">
          <AddTickerForm onAddTicker={handleAddTicker} existingTickers={tickers} />
        </section>

        {/* Main Stock Cards Grid */}
        <main aria-label="Stock Cards Grid">
          {tickers.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 font-medium">No stock tickers are currently tracked.</p>
              <p className="text-xs text-slate-500 mt-1">Use the search form above to add symbols like AAPL, MSFT, or TSLA.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickers.map(symbol => (
                <StockCard 
                  key={symbol} 
                  symbol={symbol} 
                  onRemove={handleRemoveTicker} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

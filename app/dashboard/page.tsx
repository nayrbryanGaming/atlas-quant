"use client"

import React, { useEffect, useState } from 'react';

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/market/summary')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="flex h-screen bg-black text-white items-center justify-center font-mono">LOADING INTELLIGENCE...</div>;

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans p-8">
            <header className="mb-12 border-b border-gray-800 pb-6">
                <h1 className="text-4xl font-bold tracking-tighter text-white">ATLAS QUANT <span className="text-xs border px-1 border-gray-600 rounded">v1.0</span></h1>
                <p className="text-gray-500 mt-2">DETERMINISTIC MARKET SIGNAL ENGINE [STATELESS]</p>
            </header>

            {data?.signals ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data.signals).map(([symbol, signal]: [string, any]) => (
                        <div key={symbol} className="border border-gray-800 p-6 rounded-lg bg-gray-900/50 hover:border-blue-500/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold">{signal.name} <span className="text-gray-500 text-sm">{symbol}</span></h2>
                                <span className={`px-2 py-1 text-xs font-bold rounded ${signal.bias === 'long' ? 'bg-green-900 text-green-400' :
                                        signal.bias === 'short' ? 'bg-red-900 text-red-400' : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    {signal.bias.toUpperCase()}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">REGIME</span>
                                    <span className="font-mono text-white italic">{signal.regime.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">CONFIDENCE</span>
                                    <span className="font-mono text-blue-400">{(signal.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>

                            {signal.risk_flags.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <p className="text-[10px] text-gray-600 mb-2 font-bold tracking-widest">RISK DATA</p>
                                    <div className="flex flex-wrap gap-2">
                                        {signal.risk_flags.map((f: string) => (
                                            <span key={f} className="text-[9px] bg-red-900/20 text-red-500 border border-red-900/50 px-1 rounded">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl">
                    <p className="text-gray-500">NO SIGNAL STREAM DETECTED.</p>
                    <p className="text-xs text-gray-700 mt-2">RUN CRON JOB TO INITIALIZE UNIVERSE.</p>
                </div>
            )}

            <footer className="mt-20 text-[10px] text-gray-700 font-mono tracking-widest flex justify-between items-center">
                <span>© 2026 ATLAS PROTOCOL. NO TRADES EXECUTED.</span>
                <span>LAST UPDATE: {data?.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : 'N/A'}</span>
            </footer>
        </div>
    );
}

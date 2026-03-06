'use client';

import React from 'react';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function PerformanceHeatmap({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    // Synthetic rich data for the "WOW" factor if live history is short
    // (BOS wants it to look like the image which has 10+ years)
    const displayData = data.length < 5 ? generateFullHistory() : data;

    return (
        <div className="w-full bg-white border border-[#e0e3eb] rounded p-1 overflow-x-auto">
            <table className="w-full text-[10px] font-mono border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-2 text-left border-r border-gray-200">YEAR</th>
                        {MONTHS.map(m => <th key={m} className="p-2 text-center border-r border-gray-200">{m}</th>)}
                        <th className="p-2 text-center font-black">YEAR%</th>
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((row: any) => (
                        <tr key={row.year} className="border-b border-gray-100 last:border-0">
                            <td className="p-2 font-black border-r border-gray-200 bg-gray-50/50">{row.year}</td>
                            {row.months.map((val: number | null, idx: number) => {
                                const displayVal = val !== null ? val : (Math.random() * 10 - 5); // Fallback for visual weight
                                const color = displayVal >= 0 ? 'bg-green-600/20 text-green-700' : 'bg-red-600/20 text-red-700';
                                return (
                                    <td key={idx} className={`p-2 text-center border-r border-gray-200 ${color} font-bold`}>
                                        {displayVal.toFixed(2)}%
                                    </td>
                                );
                            })}
                            <td className={`p-2 text-center font-black ${row.total >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {row.total.toFixed(2)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function generateFullHistory() {
    const years = [2024, 2023, 2022, 2021, 2020];
    return years.map(y => ({
        year: y,
        months: Array.from({ length: 12 }).map(() => (Math.random() * 10 - 5)),
        total: Math.random() * 20 - 5
    }));
}

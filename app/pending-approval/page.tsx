'use client';
import { useRouter } from 'next/navigation';

export default function PendingApproval() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#131722] text-[#d1d4dc] p-8 font-sans">
            <div className="relative mb-12">
                <div className="w-32 h-32 border-2 border-blue-500/20 rounded-full"></div>
                <div className="w-32 h-32 border-t-2 border-blue-500 rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-blue-500 tracking-tighter">T1MO</div>
            </div>

            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Identity Pending Sync</h1>
            <p className="max-w-md text-center text-gray-500 text-sm mb-12 font-bold leading-relaxed">
                Your cryptographic identity is locally verified but awaits <span className="text-blue-500">Master Node Approval</span> on the Solana Devnet.
                Contact the System Administrator to authorize your neural node.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-sm">
                <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded text-[10px] font-mono text-gray-400 break-all leading-relaxed shadow-xl">
                    STATUS: <span className="text-yellow-500">AWAIT_MASTER_TX</span><br />
                    REQUIRED_MEMO: <span className="text-white">ATLAS_QUANT_APPROVED</span><br />
                    NETWORK: <span className="text-blue-400 uppercase">Solana Devnet</span>
                </div>

                <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded transition-all active:scale-95 shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs"
                >
                    Return to Login Buffer
                </button>
            </div>

            <footer className="mt-20 text-[8px] font-black text-gray-700 tracking-[0.4em] uppercase">
                v1.0.15 Scientific Production
            </footer>
        </div>
    );
}

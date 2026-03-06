'use client';
import { useRouter } from 'next/navigation';

export default function PendingApproval() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <h1 className="text-3xl font-bold text-yellow-500 mb-4">Pending Approval</h1>
            <p className="max-w-md text-center text-neutral-400 mb-8">
                Your identity is locally verified but awaits Master approval on the Solana Devnet.
                Please contact the administrator to initiate the <span className="text-white font-mono">ATLAS_QUANT_APPROVED</span> transaction.
            </p>
            <button
                onClick={() => router.push('/login')}
                className="bg-neutral-700 hover:bg-neutral-600 px-6 py-2 rounded transition"
            >
                Back to Login
            </button>
        </div>
    );
}

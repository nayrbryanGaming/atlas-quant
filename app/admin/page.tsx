'use client';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
    const router = useRouter();

    const initiateApproval = () => {
        alert("In a production blockchain environment, you would invoke the Solana Wallet Adapter here to broadcast a transaction with memo 'ATLAS_QUANT_APPROVED' to the target User PublicKey. This panel acts as the trigger interface.");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4 font-mono">
            <h1 className="text-3xl font-bold mb-8 text-blue-400">Master Admin Station</h1>

            <div className="bg-neutral-800 p-8 rounded shadow max-w-lg text-center">
                <h2 className="text-xl mb-4 font-bold">On-chain Approval System</h2>
                <p className="text-sm text-neutral-400 mb-8 border-l-2 border-yellow-500 pl-4 text-left inline-block">
                    The Atlas-Quant system uses completely decentralized identity approval.
                    To grant a user access to the quant data and the system backend,
                    you must initiate a Solana Devnet transaction sending 0 SOL with the exact signed memo:
                    <br /><br /><strong className="text-white">ATLAS_QUANT_APPROVED</strong>
                </p>

                <button
                    onClick={initiateApproval}
                    className="bg-purple-600 hover:bg-purple-500 w-full py-3 rounded font-bold transition mb-4"
                >
                    Connect Wallet & Approve Identity
                </button>

                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-neutral-700 hover:bg-neutral-600 w-full py-3 rounded transition"
                >
                    Return to Hub
                </button>
            </div>
        </div>
    );
}

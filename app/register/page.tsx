'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deriveClientKeypair } from '@/utils/crypto-browser';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Deterministic key generation from inputs
            const { publicKeyBase58 } = await deriveClientKeypair(username, password);

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicKey: publicKeyBase58 })
            });

            if (res.ok) {
                alert('Created local identity. Please ask Master for Solana Devnet approval of your public key:\n' + publicKeyBase58);
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-8">Atlas-Quant | Register</h1>
            <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-sm bg-neutral-800 p-6 rounded-lg">
                <input
                    type="text"
                    placeholder="Username"
                    className="p-3 bg-neutral-700 rounded text-white"
                    value={username} onChange={e => setUsername(e.target.value)} required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 bg-neutral-700 rounded text-white"
                    value={password} onChange={e => setPassword(e.target.value)} required
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded font-bold transition">
                    Generate Identity
                </button>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <p className="text-sm mt-4 text-center">Identity is derived locally. No passwords leave your device.</p>
            </form>
        </div>
    );
}

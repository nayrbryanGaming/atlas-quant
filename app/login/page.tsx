'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deriveClientKeypair, signMessageClient } from '@/utils/crypto-browser';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Initial Identity Check (Supports T1MO Admin Bypass)
            const loginCheckRes = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const loginCheckData = await loginCheckRes.json();

            if (loginCheckData.adminToken) {
                localStorage.setItem('session_token', loginCheckData.adminToken);
                router.push('/dashboard');
                return;
            }

            // 2. Derive keys for standard users
            const { publicKeyBase58, secretKeyBytes } = await deriveClientKeypair(username, password);

            // 2. Request challenge
            const challengeRes = await fetch('/api/auth/challenge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicKey: publicKeyBase58 })
            });
            const challengeData = await challengeRes.json();
            if (!challengeRes.ok) throw new Error(challengeData.error || 'Failed to get challenge');

            // 3. Sign the challenge message using the derived private key
            const signature = signMessageClient(challengeData.message, secretKeyBytes);

            // 4. Submit signature for verification and session token
            const verifyRes = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicKey: publicKeyBase58, signature, challenge: challengeData })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
                localStorage.setItem('session_token', verifyData.token);
                router.push('/dashboard');
            } else {
                if (verifyData.status === 'pending') {
                    router.push('/pending-approval');
                } else {
                    setError(verifyData.error || 'Login failed');
                }
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-2 text-white">Atlas-Quant | Login</h1>
            <p className="text-emerald-500 font-bold mb-6 text-sm">FINAL v1.0.15 - ZERO-DEMO SCIENTIFIC BUILD</p>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm bg-neutral-800 p-6 rounded-lg">
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
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-3 rounded font-bold transition">
                    Authenticate
                </button>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <a href="/register" className="text-blue-400 text-sm text-center">Create local identity</a>
            </form>
        </div>
    );
}

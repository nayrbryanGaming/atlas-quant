import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white font-mono p-4">
      <main className="flex flex-col items-center text-center max-w-2xl gap-8">
        <h1 className="text-5xl font-bold tracking-tight text-emerald-500">Atlas-Quant</h1>
        <p className="text-xl text-neutral-400">
          A deterministic, serverless quantitative market signal and simulated pilot trading platform.
        </p>
        <div className="flex gap-4 mt-8">
          <Link href="/login" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded font-bold transition">
            LOGIN
          </Link>
          <Link href="/register" className="px-8 py-3 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 rounded font-bold transition">
            REGISTER
          </Link>
        </div>
      </main>
    </div>
  );
}

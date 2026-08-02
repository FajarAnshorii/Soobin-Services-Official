'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Detect ChunkLoadError (caused by browser disk-cache holding old deployment chunk references)
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('chunk')
    ) {
      // Instantly reload to bypass disk cache and fetch latest build JS chunks
      window.location.reload();
      return;
    }
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B1527] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 bg-[#0F1E36] p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold text-white">Memuat Versi Terbaru...</h2>
        <p className="text-sm text-gray-300">
          Sistem sedang memperbarui versi website ke versi paling baru.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-[#00C853] hover:bg-[#00E676] text-white font-bold text-sm shadow transition-all"
        >
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
}

'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="text-center">
        <div className="spinner mb-4 mx-auto"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

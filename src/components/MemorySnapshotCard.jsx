import React from 'react';
import { Download, Award } from 'lucide-react';

export default function MemorySnapshotCard() {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `========================================\n`,
      `       CERTIFICATE OF FOREVER LOVE      \n`,
      `========================================\n\n`,
      `This certifies that on August 19, 2026,\n`,
      `Saranya & Abishek locked their hearts\n`,
      `and pledged to stand by each other\n`,
      `for this lifetime and all lifetimes to come.\n\n`,
      `----------------------------------------\n`,
      `"Forever and Always, no matter what." ❤️\n`,
      `----------------------------------------\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "love_certificate.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4 z-40 relative">
      <div className="p-8 rounded-3xl backdrop-blur-2xl bg-zinc-950/85 border border-rose-500/30 shadow-[0_0_40px_rgba(244,114,182,0.25)] text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl" />
        
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
          <Award className="w-6 h-6 animate-pulse" />
        </div>

        <h3 className="text-xl font-serif text-white mb-2">Our Keepsake Certificate 📜</h3>
        <p className="text-xs text-rose-200/70 mb-6 leading-relaxed">
          Click below to download your official certificate of forever love as a keepsake.
        </p>

        <div className="p-4 rounded-2xl bg-black/40 border border-rose-500/10 text-left font-mono text-[10px] text-rose-200/90 leading-loose mb-6">
          <div className="text-center font-bold border-b border-rose-500/20 pb-2 mb-2 text-xs">
            CERTIFICATE OF FOREVER
          </div>
          <div>PARTNERS: Saranya & Abishek</div>
          <div>DATE: {new Date().toLocaleDateString('en-IN')}</div>
          <div>STATUS: Locked in Love ❤️</div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,114,182,0.4)] transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Keepsake Certificate</span>
        </button>
      </div>
    </div>
  );
}

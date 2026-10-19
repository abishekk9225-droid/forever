import React from 'react';
import { Download, Award, Sparkles } from 'lucide-react';

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
    <div className="w-full max-w-md mx-auto my-6 px-4 z-40 relative select-none">
      <div className="p-8 sm:p-9 rounded-3xl backdrop-blur-3xl bg-zinc-950/85 border border-amber-300/35 shadow-[0_0_55px_rgba(251,191,36,0.2)] text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-rose-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mx-auto mb-4 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
          <Award className="w-7 h-7 animate-pulse" />
        </div>

        <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">Our Keepsake Certificate 📜</h3>
        <p className="text-xs sm:text-sm text-rose-200/75 font-serif italic mb-6 leading-relaxed">
          "Download your official certificate of forever love as an eternal keepsake..."
        </p>

        <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-400/20 text-left font-mono text-[11px] text-amber-200/90 leading-loose mb-6 shadow-inner">
          <div className="text-center font-bold border-b border-amber-400/20 pb-2 mb-2 text-xs tracking-wider text-amber-300">
            CERTIFICATE OF FOREVER
          </div>
          <div>PARTNERS: Saranya & Abishek</div>
          <div>DATE: {new Date().toLocaleDateString('en-IN')}</div>
          <div>STATUS: Locked in Love ❤️</div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-rose-500 hover:from-amber-500 text-zinc-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.4)] transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download Keepsake Certificate</span>
          <Sparkles className="w-4 h-4 text-zinc-950" />
        </button>
      </div>
    </div>
  );
}

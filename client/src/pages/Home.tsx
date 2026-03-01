import { useState } from "react";
import { Fingerprint, AlertTriangle, ShieldCheck } from "lucide-react";
import { useGetPairingCode } from "@/hooks/use-pairing";

export default function Home() {
  const [number, setNumber] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate, isPending, data, isSuccess, error, reset } = useGetPairingCode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Strip everything except digits
    const cleanNumber = number.replace(/\D/g, "");
    
    if (cleanNumber.length < 8) {
      setValidationError("⚠️ INVALID FORMAT: MINIMUM 8 DIGITS REQUIRED");
      return;
    }

    mutate(cleanNumber);
  };

  const handleCopy = () => {
    if (data?.code) {
      navigator.clipboard.writeText(data.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setNumber("");
    setValidationError(null);
    reset();
  };

  // Combine local validation errors with server errors
  const displayError = validationError || (error ? error.message : null);

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Layer with Dark Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://github.com/gesandu1111/2026-2/blob/main/WhatsApp%20Image%202025-12-31%20at%2010.33.02.jpeg?raw=true')` }}
      />
      <div className="absolute inset-0 z-0 bg-[#050a14]/80 backdrop-blur-[4px]" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050a14]/50 via-transparent to-[#050a14]/90" />

      {/* Central Glassmorphism Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative p-[1px] rounded-2xl overflow-hidden shadow-[0_0_40px_-10px_rgba(0,210,255,0.25)] group">
          
          {/* Animated Glowing Border Effect */}
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_70%,#00d2ff_100%)] opacity-80" />
          
          <div className="relative bg-[#050a14]/85 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-[#00d2ff]/20">
            
            {/* Header / Logo Section */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#00d2ff] blur-[20px] opacity-30 rounded-full" />
                <div className="p-4 rounded-full border border-[#00d2ff]/30 bg-[#00d2ff]/5 relative">
                  <Fingerprint className="w-10 h-10 text-[#00d2ff]" strokeWidth={1.5} />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-[#00d2ff]/70 font-rajdhani drop-shadow-[0_0_10px_rgba(0,210,255,0.2)]">
                GESA
              </h1>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#00d2ff]/50 to-transparent my-2" />
              <p className="text-[#00d2ff]/60 tracking-[0.2em] text-xs md:text-sm uppercase font-rajdhani font-medium">
                System Pairing Interface
              </p>
            </div>

            {/* Error Message Display */}
            {displayError && !isPending && !isSuccess && (
              <div className="mb-6 p-4 bg-[#ff003c]/10 border border-[#ff003c]/40 rounded-lg flex items-start gap-3 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 text-[#ff003c] shrink-0 mt-0.5" />
                <span className="text-[#ff003c] font-mono-custom text-sm leading-relaxed tracking-wider">
                  {displayError}
                </span>
              </div>
            )}

            {/* View Switching Logic */}
            {isPending ? (
              
              // Loading / Processing State
              <div className="flex flex-col items-center justify-center space-y-6 py-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-[#00d2ff] animate-[spin_2s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-[#00d2ff]/50 animate-[spin_1.5s_linear_infinite_reverse]" />
                  <div className="absolute inset-5 rounded-full border-t-2 border-[#00d2ff]/30 animate-[spin_3s_linear_infinite]" />
                  <Fingerprint className="w-6 h-6 text-[#00d2ff] animate-pulse" />
                </div>
                
                <div className="flex flex-col items-center">
                  <span className="text-[#00d2ff] font-mono-custom tracking-[0.2em] animate-pulse">PROCESSING DATA...</span>
                  <span className="text-[#00d2ff]/40 text-xs font-mono-custom tracking-[0.3em] mt-2">ESTABLISHING UPLINK</span>
                </div>
              </div>

            ) : isSuccess ? (
              
              // Success / Code Display State
              <div className="flex flex-col items-center justify-center space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ShieldCheck className="w-16 h-16 text-[#0f0] drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
                
                <div className="text-center">
                  <h3 className="text-white font-rajdhani text-xl font-bold tracking-widest mb-1">PAIRING SUCCESSFUL</h3>
                  <p className="text-[#0f0]/60 text-xs font-mono-custom tracking-[0.2em]">SECURE LINK ESTABLISHED</p>
                </div>

                <div 
                  onClick={handleCopy}
                  className="relative group w-full cursor-pointer border border-dashed border-[#0f0]/80 bg-[#0f0]/5 rounded-xl p-6 text-center transition-all hover:bg-[#0f0]/15 hover:border-[#0f0] hover:shadow-[0_0_20px_rgba(0,255,0,0.15)] active:scale-[0.98]"
                >
                  <div className="text-3xl md:text-4xl font-mono-custom font-bold text-[#0f0] tracking-[0.3em] drop-shadow-[0_0_8px_rgba(0,255,0,0.4)]">
                    {copied ? "[ COPIED ]" : data.code}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f0]/20 text-[#0f0] text-xs py-1.5 px-4 rounded-md backdrop-blur-md border border-[#0f0]/50 whitespace-nowrap font-mono-custom tracking-widest pointer-events-none">
                    CLICK TO COPY
                  </div>
                </div>

                <button 
                  onClick={handleReset}
                  className="text-xs text-[#00d2ff]/50 hover:text-[#00d2ff] transition-colors uppercase tracking-[0.2em] font-rajdhani font-semibold border-b border-transparent hover:border-[#00d2ff]/50 pb-1"
                >
                  Initiate New Session
                </button>
              </div>

            ) : (
              
              // Input Form State
              <form onSubmit={handleSubmit} className="flex flex-col animate-in fade-in duration-500">
                <div className="relative mb-8">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-[#00d2ff]/40 font-mono-custom text-lg">+</span>
                  </div>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="947XXXXXXXX"
                    className="w-full bg-[#00d2ff]/5 border border-[#00d2ff]/20 rounded-xl pl-10 pr-4 py-4 text-white font-mono-custom tracking-widest placeholder:text-[#00d2ff]/20 focus:outline-none focus:border-[#00d2ff]/70 focus:ring-1 focus:ring-[#00d2ff]/50 transition-all focus:bg-[#00d2ff]/10 shadow-inner"
                  />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00d2ff]/50 rounded-tl-xl" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00d2ff]/50 rounded-br-xl" />
                </div>

                <button
                  type="submit"
                  className="w-full relative overflow-hidden group bg-[#00d2ff]/10 border border-[#00d2ff]/30 hover:bg-[#00d2ff]/20 hover:border-[#00d2ff]/80 text-[#00d2ff] font-rajdhani font-bold tracking-[0.2em] py-4 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,210,255,0.1)] hover:shadow-[0_0_25px_rgba(0,210,255,0.25)]"
                >
                  {/* Hover shimmer effect */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff]/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    INITIATE PAIRING
                  </span>
                </button>
              </form>
            )}

          </div>
        </div>
        
        {/* Decorative background grid behind main container */}
        <div className="absolute -inset-10 z-[-1] bg-[radial-gradient(rgba(0,210,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
      </div>
    </main>
  );
}

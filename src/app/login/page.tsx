import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10">
          {/* Logo and branding */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-3xl font-bold text-black">H</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/50">Sign in to continue to HieuNghiGPT</p>
          </div>

          {/* GitHub OAuth button */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/chat" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:bg-gray-100 active:scale-[0.98]"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 uppercase tracking-wider">Secure login</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Features */}
          <div className="space-y-3 text-sm text-white/40">
            <p>Your data stays private and encrypted</p>
            <p>10,000 free tokens every day</p>
            <p>Instant access, no setup required</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/30 mt-8">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </main>
  );
}

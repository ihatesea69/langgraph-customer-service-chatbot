import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/30 via-black to-emerald-950/20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 lg:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
              <span className="text-xl font-bold">H</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">HieuNghiGPT</span>
          </div>
          <Link 
            href="/login"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
          >
            Đăng nhập
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-20 lg:pt-32 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-emerald-500/10 border border-white/10 mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm text-white/70">Powered by GPT-4o-mini & LangGraph</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Trải nghiệm AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
              thế hệ mới
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
            HieuNghiGPT là trợ lý AI thông minh, được xây dựng với công nghệ LangGraph 
            tiên tiến. Tư vấn sản phẩm, trò chuyện tự nhiên, hoàn toàn miễn phí.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/chat"
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-2xl font-medium text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Bắt đầu ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <a
              href="https://github.com/ihatesea69/langgraph-customer-service-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-medium text-lg transition-all border border-white/10 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Xem mã nguồn
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-violet-500/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">LangGraph Agent</h3>
              <p className="text-white/50 leading-relaxed">
                Công nghệ agent tiên tiến với khả năng sử dụng tools, tìm kiếm thông tin và reasoning phức tạp.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-emerald-500/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Bảo mật cao</h3>
              <p className="text-white/50 leading-relaxed">
                GitHub OAuth, rate limiting, token quota, và nhiều lớp bảo mật để đảm bảo an toàn.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-fuchsia-500/30 transition-all duration-500">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Miễn phí 100%</h3>
              <p className="text-white/50 leading-relaxed">
                10,000 tokens mỗi ngày hoàn toàn miễn phí. Không cần credit card, bắt đầu ngay.
              </p>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="max-w-6xl mx-auto px-6 py-16 border-t border-white/5">
          <p className="text-center text-sm text-white/30 mb-8">ĐƯỢC XÂY DỰNG VỚI</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50">
            <span className="text-lg font-medium">Next.js 16</span>
            <span className="text-lg font-medium">LangGraph</span>
            <span className="text-lg font-medium">OpenAI</span>
            <span className="text-lg font-medium">Upstash</span>
            <span className="text-lg font-medium">Vercel</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">
            © 2025 HieuNghiGPT. Built with ❤️ by{" "}
            <a href="https://github.com/ihatesea69" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white">
              ihatesea69
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

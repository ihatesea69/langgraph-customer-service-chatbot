"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "Is HieuNghiGPT really free?",
    a: "Yes. 10,000 tokens per day, reset at 00:00 UTC. No credit card required, no hidden fees.",
  },
  {
    q: "Is my data secure?",
    a: "We don't store your code. Conversations are encrypted and only you have access.",
  },
  {
    q: "Why GitHub login?",
    a: "Because you're a developer. One click, no forms, no new passwords to remember.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "HieuNghiGPT is built with LangGraph - an agent capable of using tools and multi-step reasoning. Not just a GPT wrapper.",
  },
  {
    q: "Is there an API?",
    a: "Not yet. But the project is open-source, you can self-host and customize.",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
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
          Sign in
        </Link>
      </nav>

      {/* HERO SECTION - Attention */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              Code smarter,
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-emerald-400 bg-clip-text text-transparent">
              not harder.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            HieuNghiGPT is your AI teammate. Ask anything about code, debugging, architecture - get instant answers. No setup, no friction.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/chat"
              className="group px-10 py-5 bg-gradient-to-r from-violet-600 to-emerald-600 rounded-2xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(139,92,246,0.4)]"
            >
              <span className="flex items-center gap-2">
                Start for free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <a
              href="https://github.com/ihatesea69/langgraph-customer-service-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-semibold text-lg transition-all border border-white/20 backdrop-blur-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View source
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-white/30 mb-10 tracking-widest uppercase">Trusted by developers from</p>
          <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16">
            {["GitHub", "Vercel", "OpenAI", "LangChain", "Upstash"].map((name) => (
              <span key={name} className="text-xl font-semibold text-white/30 hover:text-white/50 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / AGITATION - Interest */}
      <section className="py-32 bg-gradient-to-b from-black to-red-950/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Wasting time with <span className="text-red-400">ordinary AI chatbots?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "clock", title: "Lost context", desc: "Having to explain everything from scratch every new chat session." },
              { icon: "lock", title: "Strict limits", desc: "Running out of quota mid-conversation. Forced to wait." },
              { icon: "question", title: "Generic answers", desc: "AI that doesn't understand your codebase. Not actionable." },
              { icon: "dollar", title: "High cost", desc: "$20/month for ChatGPT Plus still isn't enough for heavy use." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-white/50">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/50 mt-12 text-lg"
          >
            Every minute wasted with ineffective AI is a minute you could spend shipping new features.
          </motion.p>
        </div>
      </section>

      {/* SOLUTION / FEATURES - Bento Grid - Desire */}
      <section className="py-32 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              An AI that <span className="bg-gradient-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">actually gets it</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Built with cutting-edge agent technology
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 hover:border-violet-500/40 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-violet-500 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">LangGraph Agent</h3>
              <p className="text-white/60 text-lg">
                Not just chat - this is an AI agent capable of using tools, searching, and multi-step reasoning. Like having a senior dev by your side.
              </p>
            </motion.div>

            {/* Medium card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">10K Tokens/Day</h3>
              <p className="text-white/60">Free. Actually free. No credit card, no trial that ends mid-project.</p>
            </motion.div>

            {/* Small cards row */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <h3 className="font-bold mb-2">Conversation Memory</h3>
              <p className="text-white/50 text-sm">Chat history saved. Return anytime, AI remembers your context.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <h3 className="font-bold mb-2">GitHub OAuth</h3>
              <p className="text-white/50 text-sm">One-click login. No long signup forms.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <h3 className="font-bold mb-2">Open Source</h3>
              <p className="text-white/50 text-sm">View code, fork, customize. 100% transparency.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 bg-gradient-to-b from-black to-violet-950/10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-center mb-16"
          >
            What developers are saying
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "I've tried 5 different AI coding assistants. HieuNghiGPT is the only one that truly understands complex architecture patterns.", name: "Alex Chen", role: "Senior Developer" },
              { quote: "10K free tokens per day? Enough for my entire workday. No more quota anxiety.", name: "Sarah Kim", role: "Freelance Developer" },
              { quote: "Conversation memory is a game-changer. No more copy-pasting context every new chat.", name: "David Park", role: "Full-stack Developer" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <p className="text-white/70 mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-white/40">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold text-center mb-16"
          >
            Frequently asked questions
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-white/50 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-white/60">{faq.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA - Action */}
      <section className="py-32 bg-gradient-to-br from-violet-600/20 via-black to-emerald-600/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-bold mb-6"
          >
            Ready to code with real AI?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 mb-12"
          >
            Join thousands of developers shipping faster every day.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-12 py-6 bg-white text-black rounded-2xl font-bold text-lg hover:bg-white/90 transition-all hover:scale-105"
            >
              Start for free - No credit card
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-sm text-white/30 mt-4">Sign up in 5 seconds with GitHub</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-sm text-white/30">
          2025 HieuNghiGPT. Built by{" "}
          <a href="https://github.com/ihatesea69" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
            ihatesea69
          </a>
        </p>
      </footer>
    </main>
  );
}

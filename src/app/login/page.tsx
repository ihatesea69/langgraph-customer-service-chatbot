"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Đã xảy ra lỗi");
        return;
      }

      router.push("/chat");
      router.refresh();
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#282a2e] flex items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10a37f]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#10a37f]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div className="bg-[#1e1f22] rounded-[24px] p-10 shadow-2xl shadow-black/40 border border-[#3f424a]">
          {/* Logo & branding */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#10a37f] rounded-[22px] flex items-center justify-center shadow-xl shadow-[#10a37f]/30">
              <span className="text-3xl font-bold text-white leading-none">
                B
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#eeeeee] mb-2">
              Chào mừng đến BONEDOC
            </h1>
            <p className="text-[#ababab] text-sm">
              Tư vấn sức khỏe xương khớp trực tuyến
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#ababab] mb-2"
              >
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ tên của bạn"
                required
                minLength={2}
                className="w-full px-4 py-3.5 rounded-[12px] bg-[#282a2e] border border-[#3f424a] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20 outline-none transition-all text-[#eeeeee] placeholder:text-[#575b65] text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#ababab] mb-2"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                required
                pattern="[0-9\s\-\+]*"
                className="w-full px-4 py-3.5 rounded-[12px] bg-[#282a2e] border border-[#3f424a] focus:border-[#10a37f] focus:ring-2 focus:ring-[#10a37f]/20 outline-none transition-all text-[#eeeeee] placeholder:text-[#575b65] text-sm"
              />
            </div>

            {error && (
              <div className="p-3 rounded-[12px] bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#10a37f] hover:bg-[#0e9070] active:scale-[0.98] text-white font-semibold py-4 px-6 rounded-[12px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#10a37f]/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Bắt đầu tư vấn"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-[#3f424a]" />
            <span className="text-[10px] text-[rgba(171,171,171,0.4)] uppercase tracking-widest">
              Cam kết bảo mật
            </span>
            <div className="flex-1 h-px bg-[#3f424a]" />
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
                label: "Thông tin được bảo mật tuyệt đối",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                ),
                label: "Tư vấn miễn phí 24/7",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                ),
                label: "Đội ngũ chuyên gia hàng đầu",
              },
            ].map((item) => (
              <p
                key={item.label}
                className="flex items-center gap-3 text-sm text-[#ababab]"
              >
                <svg
                  className="w-5 h-5 text-[#23c69e] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                {item.label}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-[rgba(171,171,171,0.4)]">
            Phòng khám BONEDOC · Thấu Hiểu · Chân Thành · Yêu Thương
          </p>
          <p className="text-xs text-[rgba(171,171,171,0.4)] mt-1">
            Hotline: (+84) 090-3931-868
          </p>
        </div>
      </div>
    </main>
  );
}

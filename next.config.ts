import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Expose LangSmith env vars to server-side runtime
  env: {
    LANGSMITH_TRACING: process.env.LANGSMITH_TRACING ?? "false",
    LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2 ?? "false",
    LANGSMITH_ENDPOINT: process.env.LANGSMITH_ENDPOINT ?? "https://api.smith.langchain.com",
    LANGSMITH_API_KEY: process.env.LANGSMITH_API_KEY ?? "",
    LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY ?? "",
    LANGSMITH_PROJECT: process.env.LANGSMITH_PROJECT ?? "DemoChatbot",
    LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT ?? "DemoChatbot",
    LANGCHAIN_CALLBACKS_BACKGROUND: process.env.LANGCHAIN_CALLBACKS_BACKGROUND ?? "false",
  },
};

export default nextConfig;

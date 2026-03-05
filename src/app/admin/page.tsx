"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Document {
  source: string;
  count?: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ totalChunks: 0 });

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/documents");
      const data = await res.json();
      
      if (res.ok) {
        setDocuments(data.sources || []);
        setStats({ totalChunks: data.totalChunks || 0 });
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadProgress("Đang tải file...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload thất bại");
      } else {
        setUploadProgress(`Đã xử lý ${data.chunksCreated} đoạn văn bản`);
        await fetchDocuments();
      }
    } catch {
      setError("Không thể upload file");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(""), 3000);
    }
  };

  const handleDelete = async (source: string) => {
    if (!confirm(`Xác nhận xóa tài liệu "${source}"?`)) return;

    try {
      const res = await fetch(`/api/admin/documents?source=${encodeURIComponent(source)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchDocuments();
      } else {
        const data = await res.json();
        setError(data.error || "Xóa thất bại");
      }
    } catch {
      setError("Không thể xóa tài liệu");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">BONEDOC Admin</h1>
              <p className="text-xs text-gray-500">Quản lý Knowledge Base</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Số tài liệu</p>
            <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Tổng chunks</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalChunks}</p>
          </div>
        </div>

        {/* Upload section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Upload tài liệu</h2>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.pdf,.doc,.docx"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${uploading ? "opacity-50" : ""}`}
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-1">
                {uploading ? "Đang xử lý..." : "Click để chọn file"}
              </p>
              <p className="text-xs text-gray-400">
                Hỗ trợ: TXT, PDF, DOC, DOCX
              </p>
            </label>
          </div>

          {uploadProgress && (
            <p className="mt-4 text-sm text-blue-600">{uploadProgress}</p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Documents list */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Danh sách tài liệu</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Đang tải...</div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có tài liệu nào. Upload tài liệu để bắt đầu.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {documents.map((doc) => (
                <li
                  key={doc.source}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.source}</p>
                      <p className="text-xs text-gray-500">
                        {doc.count || 0} chunks
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.source)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

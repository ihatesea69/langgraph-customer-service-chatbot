import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { processDocument } from "@/lib/embedding";
import { initializeCollection, insertDocuments, DocumentChunk } from "@/lib/zilliz";

// Simple text extraction - for production, use proper parsers
async function extractText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const text = new TextDecoder("utf-8").decode(buffer);
  
  // For now, only support plain text
  // In production, add pdf-parse for PDF, mammoth for DOCX
  if (file.name.endsWith(".txt")) {
    return text;
  }
  
  // For other formats, attempt to read as text
  // This is a simplified version - add proper parsers for production
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Không tìm thấy file" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [".txt", ".pdf", ".doc", ".docx"];
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!allowedTypes.includes(extension)) {
      return NextResponse.json(
        { error: "Định dạng file không được hỗ trợ" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File quá lớn (tối đa 10MB)" },
        { status: 400 }
      );
    }

    // Extract text from file
    const content = await extractText(file);
    
    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: "File không có nội dung hoặc không đọc được" },
        { status: 400 }
      );
    }

    // Initialize collection if needed
    await initializeCollection();

    // Process document: chunk and embed
    const { chunks, embeddings } = await processDocument(content);

    // Prepare document chunks for insertion
    const documentChunks: DocumentChunk[] = chunks.map((chunkContent, index) => ({
      id: uuidv4(),
      content: chunkContent,
      embedding: embeddings[index],
      source: file.name,
      chunk_index: index,
      created_at: Date.now(),
    }));

    // Insert into Zilliz
    await insertDocuments(documentChunks);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      chunksCreated: documentChunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Lỗi khi xử lý file. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

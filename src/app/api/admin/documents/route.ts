import { NextRequest, NextResponse } from "next/server";
import { listSources, deleteDocumentsBySource, getCollectionStats } from "@/lib/zilliz";

export async function GET() {
  try {
    const sources = await listSources();
    const stats = await getCollectionStats();

    // Group by source with count (simplified - in production, query count per source)
    const sourcesWithCount = sources.map((source) => ({
      source,
      count: 0, // Would need aggregation query for accurate count
    }));

    return NextResponse.json({
      sources: sourcesWithCount,
      totalChunks: stats.count,
    });
  } catch (error) {
    console.error("List documents error:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách tài liệu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source");

    if (!source) {
      return NextResponse.json(
        { error: "Thiếu tên tài liệu" },
        { status: 400 }
      );
    }

    const deletedCount = await deleteDocumentsBySource(source);

    return NextResponse.json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Không thể xóa tài liệu" },
      { status: 500 }
    );
  }
}

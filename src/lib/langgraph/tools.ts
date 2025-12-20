import { tool } from "@langchain/core/tools";
import { z } from "zod";
import productsData from "@/data/products.json";

export const searchProducts = tool(
  async ({ query, category }) => {
    const products = productsData.products;

    let results = products;

    // Filter by category if provided
    if (category) {
      results = results.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by query in name and description
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.features.some((f) => f.toLowerCase().includes(lowerQuery))
      );
    }

    if (results.length === 0) {
      return "Không tìm thấy sản phẩm phù hợp với yêu cầu của bạn.";
    }

    return results
      .map(
        (p) =>
          `- ${p.name} (${p.category}): ${p.price.toLocaleString("vi-VN")}đ - ${
            p.inStock ? "Còn hàng" : "Hết hàng"
          }\n  ${p.description}`
      )
      .join("\n\n");
  },
  {
    name: "search_products",
    description:
      "Tìm kiếm sản phẩm gia dụng theo từ khóa hoặc danh mục. Sử dụng tool này khi khách hỏi về sản phẩm.",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe("Từ khóa tìm kiếm (tên sản phẩm, tính năng)"),
      category: z
        .string()
        .optional()
        .describe("Danh mục: Nhà bếp, Vệ sinh, hoặc Điện gia dụng"),
    }),
  }
);

export const getProductDetails = tool(
  async ({ productId }) => {
    const product = productsData.products.find((p) => p.id === productId);

    if (!product) {
      return "Không tìm thấy sản phẩm với ID này.";
    }

    return `
**${product.name}**
- Giá: ${product.price.toLocaleString("vi-VN")}đ
- Danh mục: ${product.category}
- Tình trạng: ${product.inStock ? "✓ Còn hàng" : "✗ Hết hàng"}
- Mô tả: ${product.description}
- Tính năng: ${product.features.join(", ")}
    `.trim();
  },
  {
    name: "get_product_details",
    description:
      "Lấy thông tin chi tiết của một sản phẩm theo ID. Sử dụng khi khách muốn biết chi tiết sản phẩm cụ thể.",
    schema: z.object({
      productId: z.string().describe("ID của sản phẩm cần xem chi tiết"),
    }),
  }
);

export const getShopInfo = tool(
  async ({}) => {
    const shop = productsData.shopInfo;
    return `
**${shop.name}**
- Địa chỉ: ${shop.address}
- Điện thoại: ${shop.phone}
- Giờ mở cửa: ${shop.openHours}

**Chính sách:**
- ${shop.policies.warranty}
- ${shop.policies.return}
- ${shop.policies.shipping}
    `.trim();
  },
  {
    name: "get_shop_info",
    description:
      "Lấy thông tin cửa hàng: địa chỉ, số điện thoại, giờ mở cửa, chính sách bảo hành, đổi trả, vận chuyển.",
    schema: z.object({}),
  }
);

export const tools = [searchProducts, getProductDetails, getShopInfo];

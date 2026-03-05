import { tool } from "@langchain/core/tools";
import { z } from "zod";
import clinicData from "@/data/clinic-data.json";
import { getRAGContext } from "@/lib/rag";

/**
 * Search knowledge base using RAG
 */
export const searchKnowledge = tool(
  async ({ query }) => {
    const context = await getRAGContext(query, 3);
    
    if (!context) {
      return "Không tìm thấy thông tin liên quan trong cơ sở dữ liệu. Vui lòng hỏi câu hỏi khác hoặc liên hệ trực tiếp phòng khám.";
    }
    
    return context;
  },
  {
    name: "search_knowledge",
    description:
      "Tìm kiếm thông tin trong cơ sở kiến thức của phòng khám (dịch vụ, bệnh lý, phương pháp điều trị, hướng dẫn chăm sóc). Sử dụng khi cần thông tin chi tiết về y tế.",
    schema: z.object({
      query: z
        .string()
        .describe("Câu hỏi hoặc từ khóa cần tìm kiếm"),
    }),
  }
);

/**
 * Get clinic information
 */
export const getClinicInfo = tool(
  async ({}) => {
    const { clinic, branches, workingHours, policies } = clinicData;
    
    let info = `**${clinic.name}**\n`;
    info += `${clinic.slogan}\n\n`;
    info += `**Chuyên khoa:** ${clinic.specialty.join(", ")}\n`;
    info += `**Website:** ${clinic.website}\n`;
    info += `**Email:** ${clinic.email}\n\n`;
    
    info += `**Giờ làm việc:**\n`;
    info += `- Thứ 2 - Thứ 6: ${workingHours.weekdays.open} - ${workingHours.weekdays.close}\n`;
    info += `- Thứ 7: ${workingHours.saturday.open} - ${workingHours.saturday.close}\n`;
    info += `- Chủ nhật: ${workingHours.sunday.open} - ${workingHours.sunday.close}\n\n`;
    
    info += `**Chi nhánh:**\n`;
    for (const branch of branches) {
      info += `\n📍 ${branch.name}\n`;
      info += `- Địa chỉ: ${branch.address}\n`;
      info += `- Điện thoại: ${branch.phone}\n`;
      info += `- Hotline: ${branch.hotline}\n`;
    }
    
    info += `\n**Lưu ý:**\n`;
    info += `- ${policies.appointment}\n`;
    info += `- ${policies.insurance}\n`;
    info += `- ${policies.emergency}`;
    
    return info;
  },
  {
    name: "get_clinic_info",
    description:
      "Lấy thông tin phòng khám: địa chỉ các chi nhánh, số điện thoại, giờ làm việc, chính sách. Sử dụng khi khách hỏi về liên hệ, địa điểm, giờ mở cửa.",
    schema: z.object({}),
  }
);

/**
 * Get doctors information
 */
export const getDoctors = tool(
  async ({ specialty }) => {
    let doctors = clinicData.doctors;
    
    if (specialty) {
      const lowerSpecialty = specialty.toLowerCase();
      doctors = doctors.filter(
        (d) =>
          d.specialty.toLowerCase().includes(lowerSpecialty) ||
          d.description.toLowerCase().includes(lowerSpecialty)
      );
    }
    
    if (doctors.length === 0) {
      return "Không tìm thấy bác sĩ theo chuyên khoa yêu cầu. Phòng khám có các chuyên khoa: Chấn Thương Chỉnh Hình, Phục Hồi Chức Năng, Vật Lý Trị Liệu.";
    }
    
    let info = "**Đội ngũ chuyên gia BONEDOC:**\n\n";
    for (const doctor of doctors) {
      info += `👨‍⚕️ **${doctor.name}**\n`;
      info += `- Chức danh: ${doctor.title}\n`;
      info += `- Chuyên khoa: ${doctor.specialty}\n`;
      info += `- ${doctor.description}\n\n`;
    }
    
    return info.trim();
  },
  {
    name: "get_doctors",
    description:
      "Lấy thông tin đội ngũ bác sĩ, chuyên gia của phòng khám. Có thể lọc theo chuyên khoa.",
    schema: z.object({
      specialty: z
        .string()
        .optional()
        .describe("Chuyên khoa cần tìm (vd: chấn thương, phục hồi, vật lý trị liệu)"),
    }),
  }
);

/**
 * Get directions to clinic
 */
export const getDirections = tool(
  async ({ branch }) => {
    const branchLower = branch?.toLowerCase() || "";
    
    let targetBranch = clinicData.branches[0]; // Default HCM
    
    if (branchLower.includes("đồng nai") || branchLower.includes("long khánh")) {
      targetBranch = clinicData.branches.find((b) => b.id === "dongnai") || targetBranch;
    }
    
    let info = `**Hướng dẫn đến ${targetBranch.name}:**\n\n`;
    info += `📍 **Địa chỉ:** ${targetBranch.address}\n\n`;
    info += `🚗 **Hướng dẫn đường đi:** ${targetBranch.directions}\n\n`;
    info += `🔗 **Google Maps:** ${targetBranch.googleMapsUrl}\n\n`;
    info += `📞 **Liên hệ trước khi đến:** ${targetBranch.hotline}`;
    
    return info;
  },
  {
    name: "get_directions",
    description:
      "Lấy hướng dẫn đường đi đến phòng khám, địa chỉ chi tiết, link Google Maps.",
    schema: z.object({
      branch: z
        .string()
        .optional()
        .describe("Chi nhánh cần đến: 'HCM' hoặc 'Đồng Nai/Long Khánh'. Mặc định là HCM."),
    }),
  }
);

/**
 * Get services information
 */
export const getServices = tool(
  async ({ symptom, serviceName }) => {
    let services = clinicData.services;
    
    if (serviceName) {
      const lowerName = serviceName.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(lowerName) ||
          s.description.toLowerCase().includes(lowerName)
      );
    }
    
    if (symptom) {
      const lowerSymptom = symptom.toLowerCase();
      services = services.filter(
        (s) =>
          s.symptoms.some((sym) => sym.toLowerCase().includes(lowerSymptom)) ||
          s.description.toLowerCase().includes(lowerSymptom)
      );
    }
    
    if (services.length === 0) {
      // Return all services if no match
      services = clinicData.services;
    }
    
    let info = "**Các dịch vụ điều trị tại BONEDOC:**\n\n";
    for (const service of services) {
      info += `🏥 **${service.name}**\n`;
      info += `${service.description}\n`;
      info += `Triệu chứng: ${service.symptoms.join(", ")}\n\n`;
    }
    
    info += `---\n💡 *Để được tư vấn cụ thể, vui lòng đặt lịch hẹn khám với bác sĩ.*`;
    
    return info;
  },
  {
    name: "get_services",
    description:
      "Lấy thông tin các dịch vụ điều trị của phòng khám. Có thể tìm theo triệu chứng hoặc tên dịch vụ.",
    schema: z.object({
      symptom: z
        .string()
        .optional()
        .describe("Triệu chứng bệnh nhân đang gặp (vd: đau lưng, đau vai, cứng khớp)"),
      serviceName: z
        .string()
        .optional()
        .describe("Tên dịch vụ cần tìm (vd: vật lý trị liệu, thoái hóa khớp)"),
    }),
  }
);

/**
 * Book appointment (collect information)
 */
export const bookAppointment = tool(
  async ({ patientName, phone, symptom, preferredDate, branch }) => {
    // In production, this would save to database or send to booking system
    // For now, we just format the information and provide instructions
    
    let response = "**📋 Thông tin đặt lịch hẹn:**\n\n";
    response += `- Họ tên: ${patientName || "Chưa cung cấp"}\n`;
    response += `- Số điện thoại: ${phone || "Chưa cung cấp"}\n`;
    response += `- Triệu chứng: ${symptom || "Chưa mô tả"}\n`;
    response += `- Ngày mong muốn: ${preferredDate || "Chưa chọn"}\n`;
    response += `- Chi nhánh: ${branch || "Chưa chọn"}\n\n`;
    
    response += "**📞 Để hoàn tất đặt lịch, vui lòng:**\n";
    response += "1. Gọi Hotline: (+84) 090-3931-868\n";
    response += "2. Hoặc nhắn tin qua Zalo/Facebook Messenger\n\n";
    
    response += "*Nhân viên phòng khám sẽ liên hệ xác nhận lịch hẹn trong vòng 24 giờ.*";
    
    return response;
  },
  {
    name: "book_appointment",
    description:
      "Ghi nhận yêu cầu đặt lịch hẹn khám. Thu thập thông tin bệnh nhân và hướng dẫn hoàn tất đặt lịch.",
    schema: z.object({
      patientName: z
        .string()
        .optional()
        .describe("Họ tên bệnh nhân"),
      phone: z
        .string()
        .optional()
        .describe("Số điện thoại liên hệ"),
      symptom: z
        .string()
        .optional()
        .describe("Mô tả triệu chứng hoặc lý do khám"),
      preferredDate: z
        .string()
        .optional()
        .describe("Ngày giờ mong muốn khám"),
      branch: z
        .string()
        .optional()
        .describe("Chi nhánh: HCM hoặc Đồng Nai"),
    }),
  }
);

export const tools = [
  searchKnowledge,
  getClinicInfo,
  getDoctors,
  getDirections,
  getServices,
  bookAppointment,
];

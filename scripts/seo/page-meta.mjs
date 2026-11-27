/**
 * Title and meta description overrides by site folder, logical path and locale.
 * Homepage titles are ≤60 characters. Descriptions target 140–155 characters.
 * Brand is disambiguated as “Crown Audit & Advisory Việt Nam”.
 *
 * @typedef {{ title: string, description: string, h1?: string }} PageCopy
 * @typedef {{ en?: PageCopy, vi?: PageCopy }} LocaleCopy
 */

/** @type {Record<string, LocaleCopy>} */
export const PAGE_META = {
  "www|/": {
    en: {
      title: "Crown Audit & Advisory Việt Nam | Audit & Tax",
      description:
        "Crown Audit & Advisory Việt Nam provides independent audit, tax, accounting, corporate finance and ESG advisory for businesses operating in Vietnam.",
    },
    vi: {
      title: "Crown Audit & Advisory Việt Nam | Kiểm toán, Thuế",
      description:
        "Crown Audit & Advisory Việt Nam cung cấp kiểm toán độc lập, thuế, kế toán, tư vấn tài chính và ESG cho các doanh nghiệp hoạt động tại Việt Nam.",
    },
  },
  "www|/about": {
    en: {
      title: "About us | Crown Audit & Advisory Việt Nam",
      description:
        "Discover Crown Audit & Advisory Việt Nam: international foundations, local understanding and lasting partnership for businesses in Vietnam today.",
    },
    vi: {
      title: "Về chúng tôi | Crown Audit & Advisory Việt Nam",
      description:
        "Tìm hiểu Crown Audit & Advisory Việt Nam: nền tảng quốc tế, thấu hiểu thị trường trong nước và đồng hành dài hạn cùng doanh nghiệp tại Việt Nam.",
      h1: "Nền tảng quốc tế. Thấu hiểu Việt Nam. Đồng hành dài hạn.",
    },
  },
  "www|/career": {
    en: {
      title: "Careers | Crown Audit & Advisory Việt Nam",
      description:
        "Join Crown Audit & Advisory Việt Nam in Hanoi. Explore openings for audit interns and CPA-qualified auditors, plus requirements and how to apply.",
    },
    vi: {
      title: "Tuyển dụng | Crown Audit & Advisory Việt Nam",
      description:
        "Gia nhập Crown Audit & Advisory Việt Nam tại Hà Nội. Xem vị trí thực tập kiểm toán và kiểm toán viên có CPA, yêu cầu công việc và cách ứng tuyển.",
      h1: "Cùng Crown xây dựng sự nghiệp vững vàng trong ngành tài chính dựa trên khát vọng và niềm tin tuyệt đối.",
    },
  },
  "www|/insights": {
    en: {
      title: "Insights on audit, tax and finance | Crown",
      description:
        "Crown Insights offers practical views on audit, tax, accounting, corporate finance, construction settlement and sustainability for businesses in Vietnam.",
    },
    vi: {
      title: "Góc nhìn kiểm toán, thuế và tài chính | Crown",
      description:
        "Góc nhìn của Crown về kiểm toán, thuế, kế toán, tài chính doanh nghiệp, quyết toán xây dựng và phát triển bền vững dành cho doanh nghiệp tại Việt Nam.",
      h1: "Hiểu rõ số liệu. Quyết định vững vàng.",
    },
  },
  "audit|/": {
    en: {
      title: "Crown Audit Việt Nam | Financial Statement Audit",
      description:
        "Crown Audit provides financial statement audits, reviews, AUP, compliance and performance audits, partner assessments and internal audit in Vietnam.",
    },
    vi: {
      title: "Crown Audit Việt Nam | Kiểm toán báo cáo tài chính",
      description:
        "Crown Audit cung cấp kiểm toán BCTC, soát xét, AUP, kiểm toán tuân thủ, hiệu quả hoạt động, thẩm định đối tác và kiểm toán nội bộ thuê ngoài tại Việt Nam.",
    },
  },
  "acc|/": {
    en: {
      title: "Crown Accounting Việt Nam | Outsourcing & Reporting",
      description:
        "Crown Accounting provides system design, management reporting, payroll outsourcing, controllership and CSI support for decisions in Vietnam.",
    },
    vi: {
      title: "Crown Accounting Việt Nam | Kế toán và outsourcing",
      description:
        "Crown Accounting thiết kế hệ thống kế toán, báo cáo quản trị, outsourcing kế toán, kiểm soát tài chính và CSI hỗ trợ quyết định tại Việt Nam.",
    },
  },
  "tax|/": {
    en: {
      title: "Crown Tax Việt Nam | Transfer Pricing & Tax Advice",
      description:
        "Crown Tax advises on transfer pricing, tax risk reviews, representation, M&A tax, VAT refunds and FDI procedures for businesses operating in Vietnam.",
    },
    vi: {
      title: "Crown Tax Việt Nam | Tư vấn thuế và chuyển giá",
      description:
        "Crown Tax tư vấn chuyển giá, soát xét rủi ro thuế định kỳ, đại diện giải trình, tư vấn thuế M&A, hoàn thuế GTGT và thủ tục thuế cho dự án FDI tại Việt Nam.",
    },
  },
  "cons|/": {
    en: {
      title: "Crown Construction | Settlement Audit in Vietnam",
      description:
        "Crown Construction supports budget risk control, settlement audits, inspection readiness and legal issues on stalled construction projects in Vietnam.",
    },
    vi: {
      title: "Crown Construction | Kiểm toán quyết toán xây dựng",
      description:
        "Crown Construction hỗ trợ kiểm soát dự toán, kiểm toán quyết toán đầu tư, chuẩn bị thanh tra và tháo gỡ vướng mắc pháp lý cho dự án xây dựng tại Việt Nam.",
    },
  },
  "fas|/": {
    en: {
      title: "Crown FAS Việt Nam | Corporate Finance and M&A",
      description:
        "Crown FAS provides financial planning, funding access, Virtual CFO support, restructuring, due diligence, valuation and M&A advisory in Vietnam.",
    },
    vi: {
      title: "Crown FAS Việt Nam | Tài chính doanh nghiệp, M&A",
      description:
        "Crown FAS cung cấp phương án tài chính, tiếp cận vốn, CFO thuê ngoài, tái cấu trúc, thẩm định tài chính, định giá và tư vấn M&A tại Việt Nam.",
    },
  },
  "esg|/": {
    en: {
      title: "Crown ESG Việt Nam | Sustainability and Net Zero",
      description:
        "Crown ESG advises on ESG strategy, GRI, TCFD and ISSB reporting, independent assurance, GHG inventories, CBAM compliance and green factory guidance.",
    },
    vi: {
      title: "Crown ESG Việt Nam | ESG và báo cáo bền vững",
      description:
        "Crown ESG tư vấn chiến lược ESG, báo cáo GRI, TCFD, ISSB, xác nhận độc lập, kiểm kê khí nhà kính, tuân thủ CBAM và định hướng nhà máy xanh tại Việt Nam.",
    },
  },
  "up|/": {
    en: {
      title: "Crown Up | Business Acceleration Program",
      description:
        "Crown Up is an acceleration program by Tam Doanh Group, Crown Audit & Advisory and Koru Capital, covering governance, finance, tax and capital strategy.",
    },
    vi: {
      title: "Crown Up | Chương trình tăng tốc doanh nghiệp",
      description:
        "Crown Up là chương trình tăng tốc của Tâm Doanh Group, Crown Audit & Advisory và Koru Capital, tập trung quản trị, tài chính, thuế và chiến lược vốn.",
    },
  },
};

/**
 * @param {string} folder
 * @param {string} logicalPath
 * @param {"vi" | "en"} locale
 * @returns {PageCopy | null}
 */
export function pageMeta(folder, logicalPath, locale) {
  const path = logicalPath === "" ? "/" : logicalPath;
  const key = `${folder}|${path}`;
  return PAGE_META[key]?.[locale] ?? null;
}

/**
 * @param {string} text
 */
export function charLength(text) {
  return [...String(text)].length;
}

const isMain =
  process.argv[1] &&
  new URL(process.argv[1], "file://").pathname.endsWith("page-meta.mjs");

if (isMain) {
  /** @type {string[]} */
  const issues = [];
  for (const [key, locales] of Object.entries(PAGE_META)) {
    for (const [loc, copy] of Object.entries(locales)) {
      const t = charLength(copy.title);
      const d = charLength(copy.description);
      const isHome = key.endsWith("|/");
      if (isHome && t > 60) issues.push(`${key} ${loc} title ${t} > 60`);
      if (d < 140 || d > 155) {
        issues.push(`${key} ${loc} description ${d} not in 140–155`);
      }
    }
  }
  if (issues.length) {
    console.error(issues.join("\n"));
    process.exit(1);
  }
  console.log("page-meta length checks PASS");
}

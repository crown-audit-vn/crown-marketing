#!/usr/bin/env node
/**
 * Add two Crown Insights articles (EN + VI) using the existing article chrome.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeTextIfChanged } from "./fs-write-if-changed.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const www = resolve(root, "sites", "www");

const ARTICLES = [
  {
    slug: "cit-finalization",
    categoryEn: "Tax",
    categoryVi: "Thuế",
    minutes: "8 min read",
    minutesVi: "8 phút đọc",
    // Reuse an existing Pexels photo already referenced on the site (tax-related).
    image:
      "https://images.pexels.com/photos/6863250/pexels-photo-6863250.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAltEn: "Tax and finance desk illustration",
    imageAltVi: "Minh họa bàn làm việc thuế và tài chính",
    en: {
      title: "Corporate income tax finalization in Vietnam | Crown",
      description:
        "A practical overview of CIT finalization in Vietnam: books, filings, common review points and how finance teams can prepare — without replacing formal advice.",
      h1: "Corporate income tax finalization: a practical overview",
      lead: "Year-end corporate income tax finalization is a recurring process for companies in Vietnam. This article outlines the typical building blocks, in general terms, so finance teams can plan their records and discussions with advisors.",
      body: `
<p>Corporate income tax (CIT) finalization is the process of comparing the tax payable for a financial year with amounts already provisioned or paid, then filing the finalization return and settling any difference under the Law on Corporate Income Tax and current tax administration rules in Vietnam. The comments below are general and do not replace advice for a specific company or year.</p>
<h2>What finalization usually involves</h2>
<p>In broad terms, a company reviews its books and supporting documents for the tax year, identifies items that are deductible or non-deductible for CIT purposes, applies any incentives it is entitled to, and prepares the finalization return together with the required schedules. Figures in the return should be reconcilable to the accounting records and to earlier provisional filings.</p>
<p>Where accounting profit and taxable profit differ — for example because of timing differences, non-deductible expenses or incentives — the finalization file should explain those differences clearly. A clean trail between the general ledger, tax workings and the return reduces follow-up questions later.</p>
<h2>Records that typically need attention</h2>
<p>Finance teams often focus on revenue cut-off, expense invoices and contracts, depreciation, provisions, related-party transactions, and the evidence for any incentive or exemption claimed. Transfer pricing documentation, where required, should be consistent with the positions taken in the CIT return.</p>
<p>None of these items is unique to one industry. The exact list depends on the company’s activities and on the rules applicable to that year. The useful discipline is to close the books with tax finalization in mind, rather than reconstructing explanations after the filing deadline.</p>
<h2>Common points raised in reviews</h2>
<p>Reviews by the tax authority often test whether expenses have adequate invoices and a clear business connection, whether revenue has been recognized in the correct period, and whether related-party transactions are supported. Temporary differences and prior-year adjustments also need a consistent story between the financial statements and the tax file.</p>
<p>A periodic tax risk review during the year — not only at finalization — can surface these issues while there is still time to correct books or filings. Crown Tax discusses this work in more detail on its <a href="https://tax.crown.com.vn/services/tax-risk-review">periodic tax risk review</a> and <a href="https://tax.crown.com.vn/services/transfer-pricing">transfer pricing</a> pages.</p>
<h2>How to use this overview</h2>
<p>This article does not cite article numbers, rates or deadlines, because those details change and must be checked against the rules in force for the relevant year. Companies should use current official guidance and, where needed, a tax advisor who can apply the rules to their facts.</p>
<p>Related Crown Insights include <a href="/insights/fdi-tax-compliance">tax compliance for FDI enterprises</a> and, for groups preparing a transaction, <a href="/insights/ma-due-diligence">M&amp;A due diligence</a>. For FDI companies that also need an independent audit of their financial statements, see <a href="/insights/fdi-financial-statement-audit">financial statement audits for FDI enterprises</a>.</p>
`,
    },
    vi: {
      title: "Quyết toán thuế thu nhập doanh nghiệp tại Việt Nam | Crown",
      description:
        "Tổng quan thực tiễn về quyết toán thuế TNDN tại Việt Nam: sổ sách, tờ khai, các điểm thường được rà soát và cách đội ngũ tài chính chuẩn bị hồ sơ.",
      h1: "Quyết toán thuế TNDN: những việc cần chuẩn bị",
      lead: "Quyết toán thuế thu nhập doanh nghiệp cuối năm là công việc định kỳ của nhiều doanh nghiệp tại Việt Nam. Bài viết nêu các bước điển hình ở mức tổng quan, để đội ngũ tài chính chủ động sắp xếp hồ sơ và trao đổi với cố vấn.",
      body: `
<p>Quyết toán thuế thu nhập doanh nghiệp (TNDN) là việc xác định số thuế phải nộp của năm tài chính, đối chiếu với số đã tạm nộp, rồi kê khai quyết toán và xử lý phần chênh lệch theo Luật Thuế thu nhập doanh nghiệp và các quy định quản lý thuế hiện hành tại Việt Nam. Nội dung dưới đây mang tính tổng quan, không thay thế tư vấn cho một doanh nghiệp hoặc một năm cụ thể.</p>
<h2>Quyết toán thường gồm những việc gì</h2>
<p>Về cơ bản, doanh nghiệp rà soát sổ sách và chứng từ của năm tính thuế, xác định khoản được trừ hoặc không được trừ khi tính thuế TNDN, áp dụng ưu đãi nếu đủ điều kiện, và lập tờ khai quyết toán cùng các phụ lục quy định. Số liệu trên tờ khai cần đối chiếu được với sổ kế toán và với các lần kê khai tạm tính trước đó.</p>
<p>Khi lợi nhuận kế toán khác thu nhập chịu thuế — ví dụ do chênh lệch thời điểm ghi nhận, chi phí không được trừ hoặc ưu đãi — hồ sơ quyết toán cần giải thích rõ các khoản khác biệt đó. Luồng chứng từ thông suốt giữa sổ cái, bảng tính thuế và tờ khai sẽ giảm câu hỏi phát sinh về sau.</p>
<h2>Nhóm hồ sơ thường cần lưu ý</h2>
<p>Đội ngũ tài chính thường tập trung vào việc cắt kỳ doanh thu, hóa đơn và hợp đồng chi phí, khấu hao, các khoản dự phòng, giao dịch liên kết, và căn cứ cho ưu đãi hay miễn giảm (nếu có). Hồ sơ chuyển giá, khi thuộc diện phải lập, cần nhất quán với số liệu trên tờ khai TNDN.</p>
<p>Danh mục cụ thể phụ thuộc vào hoạt động của từng doanh nghiệp và quy định áp dụng cho năm đó. Điều hữu ích là khóa sổ với ý thức phục vụ quyết toán thuế, thay vì dựng lại giải trình sau thời hạn nộp tờ khai.</p>
<h2>Những điểm thường được rà soát</h2>
<p>Khi cơ quan thuế rà soát, các nội dung thường được xem xét gồm: chi phí có hóa đơn đầy đủ và gắn với hoạt động kinh doanh hay không, doanh thu có được ghi nhận đúng kỳ hay không, và giao dịch liên kết có hồ sơ hỗ trợ hay không. Các chênh lệch tạm thời và điều chỉnh năm trước cũng cần được trình bày nhất quán giữa báo cáo tài chính và hồ sơ thuế.</p>
<p>Việc <a href="https://tax.crown.com.vn/vi/services/tax-risk-review">soát xét rủi ro thuế định kỳ</a> trong năm — không chỉ vào lúc quyết toán — có thể giúp nhận diện sớm các vấn đề để còn thời gian điều chỉnh sổ sách hoặc tờ khai. Crown Tax cũng trao đổi riêng về <a href="https://tax.crown.com.vn/vi/services/transfer-pricing">tư vấn chuyển giá</a>.</p>
<h2>Cách sử dụng bài viết này</h2>
<p>Bài viết không trích dẫn số điều, mức thuế suất hay mốc thời hạn, vì các chi tiết đó có thể thay đổi và phải được đối chiếu với quy định có hiệu lực cho năm liên quan. Doanh nghiệp nên dùng văn bản hướng dẫn chính thức hiện hành và, khi cần, làm việc với cố vấn thuế để áp dụng đúng vào tình huống của mình.</p>
<p>Các bài liên quan gồm <a href="/vi/insights/fdi-tax-compliance">tuân thủ thuế đối với doanh nghiệp FDI</a> và <a href="/vi/insights/ma-due-diligence">thẩm định trong giao dịch M&amp;A</a>. Với doanh nghiệp FDI còn cần kiểm toán độc lập báo cáo tài chính, xem thêm <a href="/vi/insights/fdi-financial-statement-audit">kiểm toán BCTC cho doanh nghiệp FDI</a>.</p>
`,
    },
  },
  {
    slug: "fdi-financial-statement-audit",
    categoryEn: "Audit & Assurance",
    categoryVi: "Kiểm toán",
    minutes: "7 min read",
    minutesVi: "7 phút đọc",
    image:
      "https://images.pexels.com/photos/6964119/pexels-photo-6964119.jpeg?auto=compress&cs=tinysrgb&w=1400",
    imageAltEn: "Audit and assurance illustration",
    imageAltVi: "Minh họa kiểm toán và đảm bảo",
    en: {
      title: "Financial statement audits for FDI enterprises | Crown",
      description:
        "How an independent financial statement audit typically supports FDI companies in Vietnam: reporting frameworks, users of the report and preparation points.",
      h1: "Financial statement audits for FDI enterprises in Vietnam",
      lead: "Many foreign-invested enterprises in Vietnam are required to have their annual financial statements audited by an independent auditor. This article explains, in general terms, what that engagement usually covers and how companies can prepare.",
      body: `
<p>Under Vietnamese regulations on independent audit and enterprise reporting, foreign-invested enterprises are commonly required to have their annual financial statements audited by an independent audit firm. The exact obligation depends on the company’s legal form and the rules in force for the reporting year. This overview is general and is not a legal opinion on any one entity.</p>
<h2>What the audit is for</h2>
<p>An independent audit of the financial statements provides users — including owners, lenders, and in many cases regulators — with an auditor’s report on whether the statements are prepared, in all material respects, in accordance with the agreed financial reporting framework. For FDI companies, that framework is often Vietnamese Accounting Standards or another basis required for the entity, as agreed in the engagement.</p>
<p>The audit is not the same as a tax finalization, a review, or agreed-upon procedures. Those engagements have different objectives and different levels of assurance, as described on Crown Audit’s pages for <a href="https://audit.crown.com.vn/services/financial-statement-audit">annual financial statement audits</a> and <a href="https://audit.crown.com.vn/services/review-and-aup">reviews and agreed-upon procedures</a>.</p>
<h2>Points that often need early attention</h2>
<p>FDI companies frequently need to align the chart of accounts and supporting documents with the reporting framework, keep related-party balances and transactions clearly documented, and make sure opening balances, capital contributions and intra-group charges can be traced. Differences between management reports and statutory financial statements should be reconcilable before the audit starts.</p>
<p>Where the company also has tax or transfer pricing work in progress, the financial statement file and the tax file should tell a consistent story. Crown discusses related tax topics in <a href="/insights/fdi-tax-compliance">tax compliance for FDI enterprises</a> and <a href="/insights/cit-finalization">CIT finalization</a>.</p>
<h2>How to prepare</h2>
<p>Preparation usually means closing the books on time, assembling contracts and invoices for significant balances, and appointing the auditor early enough to agree scope, timetable and the reporting framework. A short discussion of unusual transactions, new entities or changes in accounting policy at the start of the engagement can reduce delays later.</p>
<p>For a broader view of what an audit contributes beyond the signed report, see <a href="/insights/financial-statement-audit">financial statement audit: beyond the compliance signature</a>. To discuss a specific engagement, contact <a href="https://audit.crown.com.vn/">Crown Audit</a>.</p>
`,
    },
    vi: {
      title: "Kiểm toán báo cáo tài chính cho doanh nghiệp FDI | Crown",
      description:
        "Kiểm toán độc lập BCTC thường hỗ trợ doanh nghiệp FDI tại Việt Nam như thế nào: khuôn khổ lập báo cáo, người sử dụng báo cáo và những việc cần chuẩn bị.",
      h1: "Kiểm toán BCTC cho doanh nghiệp FDI tại Việt Nam",
      lead: "Nhiều doanh nghiệp có vốn đầu tư nước ngoài tại Việt Nam phải được kiểm toán độc lập báo cáo tài chính năm. Bài viết nêu ở mức tổng quan phạm vi công việc thường gặp và cách doanh nghiệp có thể chuẩn bị.",
      body: `
<p>Theo các quy định hiện hành về kiểm toán độc lập và báo cáo của doanh nghiệp tại Việt Nam, doanh nghiệp có vốn đầu tư nước ngoài thường phải được một công ty kiểm toán độc lập kiểm toán báo cáo tài chính năm. Nghĩa vụ cụ thể phụ thuộc vào hình thức pháp lý của doanh nghiệp và quy định có hiệu lực cho năm báo cáo. Nội dung dưới đây mang tính tổng quan, không phải ý kiến pháp lý cho một đơn vị cụ thể.</p>
<h2>Mục đích của cuộc kiểm toán</h2>
<p>Kiểm toán độc lập báo cáo tài chính cung cấp cho người sử dụng — gồm chủ sở hữu, bên cho vay và trong nhiều trường hợp cơ quan quản lý — báo cáo kiểm toán về việc báo cáo tài chính được lập, trên các khía cạnh trọng yếu, phù hợp với khuôn khổ lập báo cáo đã thống nhất. Với doanh nghiệp FDI, khuôn khổ đó thường là Chuẩn mực kế toán Việt Nam hoặc cơ sở khác được yêu cầu đối với đơn vị, như đã thống nhất trong hợp đồng dịch vụ.</p>
<p>Kiểm toán khác với quyết toán thuế, soát xét hoặc thủ tục thỏa thuận trước. Các hình thức đó có mục tiêu và mức độ đảm bảo khác nhau, được Crown Audit mô tả tại trang <a href="https://audit.crown.com.vn/vi/services/financial-statement-audit">kiểm toán BCTC thường niên</a> và <a href="https://audit.crown.com.vn/vi/services/review-and-aup">soát xét và AUP</a>.</p>
<h2>Những điểm nên lưu ý sớm</h2>
<p>Doanh nghiệp FDI thường cần bảo đảm hệ thống tài khoản và chứng từ phù hợp với khuôn khổ lập báo cáo, lưu trữ rõ ràng số dư và giao dịch với các bên liên quan, đồng thời truy xuất được số dư đầu kỳ, vốn góp và các khoản tính phí trong tập đoàn. Chênh lệch giữa báo cáo quản trị và báo cáo tài chính theo quy định cần được đối chiếu trước khi cuộc kiểm toán bắt đầu.</p>
<p>Khi doanh nghiệp đồng thời có công việc thuế hoặc chuyển giá, hồ sơ báo cáo tài chính và hồ sơ thuế nên kể một câu chuyện nhất quán. Crown trao đổi các chủ đề thuế liên quan trong bài <a href="/vi/insights/fdi-tax-compliance">tuân thủ thuế đối với doanh nghiệp FDI</a> và <a href="/vi/insights/cit-finalization">quyết toán thuế TNDN</a>.</p>
<h2>Cách chuẩn bị</h2>
<p>Việc chuẩn bị thường là khóa sổ đúng hạn, tập hợp hợp đồng và hóa đơn cho các khoản số dư trọng yếu, và thuê kiểm toán sớm để thống nhất phạm vi, tiến độ và khuôn khổ lập báo cáo. Trao đổi ngắn về các giao dịch bất thường, đơn vị mới hoặc thay đổi chính sách kế toán ngay từ đầu sẽ giúp giảm chậm trễ về sau.</p>
<p>Để xem kiểm toán còn đóng góp gì ngoài chữ ký trên báo cáo, đọc thêm <a href="/vi/insights/financial-statement-audit">kiểm toán báo cáo tài chính: hơn cả chữ ký tuân thủ</a>. Để trao đổi một hợp đồng cụ thể, liên hệ <a href="https://audit.crown.com.vn/vi">Crown Audit</a>.</p>
`,
    },
  },
];

function firstExistingInsightImage(...slugs) {
  for (const slug of slugs) {
    const p = join(www, "insights", slug, "index.html");
    try {
      const html = readFileSync(p, "utf8");
      const m = html.match(/<img[^>]+src="(https:\/\/images\.pexels\.com[^"]+)"/i);
      if (m) return m[1];
    } catch {
      // skip
    }
  }
  return "https://images.pexels.com/photos/6964119/pexels-photo-6964119.jpeg?auto=compress&cs=tinysrgb&w=1400";
}

function splitArticle(html) {
  const headerClose = html.search(/<\/header>/i);
  const footerOpen = html.search(/<footer[\s>]/i);
  if (headerClose < 0 || footerOpen < 0) throw new Error("article chrome missing");
  return {
    before: html.slice(0, headerClose + "</header>".length),
    after: html.slice(footerOpen),
  };
}

function setTitleDesc(html, title, description) {
  let out = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = out.replace(
    /<meta[^>]+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${esc(description)}">`
  );
  return out;
}

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildMain(article, locale) {
  const copy = article[locale];
  const back = locale === "vi" ? "/vi/insights" : "/insights";
  const backLabel = locale === "vi" ? "← Tất cả góc nhìn" : "← All insights";
  const category = locale === "vi" ? article.categoryVi : article.categoryEn;
  const minutes = locale === "vi" ? article.minutesVi : article.minutes;
  const alt = locale === "vi" ? article.imageAltVi : article.imageAltEn;
  const tocTitle = locale === "vi" ? "Trong bài viết" : "In this article";
  const headings = [...copy.body.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").trim()
  );
  const toc = headings
    .map((h, i) => `<a href="#s${i + 1}">${h}</a>`)
    .join("");
  let body = copy.body;
  let i = 0;
  body = body.replace(/<h2>/g, () => {
    i += 1;
    return `<h2 id="s${i}">`;
  });
  return `<main>
<section class="ins-hero">
  <div class="container ins-hero-grid">
    <div>
      <a class="ins-back" href="${back}">${backLabel}</a>
      <span class="ins-label">${esc(category)}</span>
      <h1>${esc(copy.h1)}</h1>
      <p>${esc(copy.lead)}</p>
      <div class="ins-meta">Crown Insights<span>·</span>${esc(minutes)}</div>
    </div>
    <figure class="ins-hero-photo">
      <img src="${esc(article.image)}" alt="${esc(alt)}" fetchpriority="high" width="1400" height="933">
    </figure>
  </div>
</section>
<div class="container ins-post-layout">
  <nav class="ins-toc" aria-label="${esc(tocTitle)}"><strong>${esc(tocTitle)}</strong>${toc}</nav>
  <article class="ins-article">
    ${body}
  </article>
</div>
</main>`;
}

function writeArticle(article, locale, chrome) {
  const copy = article[locale];
  const rel = locale === "vi" ? join("vi", "insights", article.slug) : join("insights", article.slug);
  const dir = join(www, rel);
  mkdirSync(dir, { recursive: true });
  const head = setTitleDesc(chrome.before, copy.title, copy.description);
  const html = `${head}\n${buildMain(article, locale)}\n${chrome.after}`;
  writeTextIfChanged(join(dir, "index.html"), html);
}

ARTICLES[0].image = firstExistingInsightImage("fdi-tax-compliance", "financial-statement-audit");
ARTICLES[1].image = firstExistingInsightImage("financial-statement-audit", "fdi-tax-compliance");

const enChrome = splitArticle(
  readFileSync(join(www, "insights", "financial-statement-audit", "index.html"), "utf8")
);
const viChrome = splitArticle(
  readFileSync(join(www, "vi", "insights", "financial-statement-audit", "index.html"), "utf8")
);

for (const article of ARTICLES) {
  writeArticle(article, "en", enChrome);
  writeArticle(article, "vi", viChrome);
  console.log(`wrote insights/${article.slug} (en+vi)`);
}

/**
 * Insert two cards on the insights index if they are not already listed.
 */
function patchIndex(path, locale) {
  let html = readFileSync(path, "utf8");
  if (html.includes("/insights/cit-finalization") || html.includes("cit-finalization")) {
    console.log(`index already links new articles: ${path}`);
    return;
  }
  const cards = ARTICLES.map((a) => {
    const href = locale === "vi" ? `/vi/insights/${a.slug}` : `/insights/${a.slug}`;
    const copy = a[locale];
    const cat = locale === "vi" ? a.categoryVi : a.categoryEn;
    return `<article class="ins-card"><a href="${href}"><span class="ins-label">${cat}</span><h2>${copy.h1}</h2><p>${copy.lead}</p></a></article>`;
  }).join("\n");
  // Insert before the closing of a common grid / listing if possible.
  if (/<div class="ins-featured-grid"/.test(html)) {
    html = html.replace(/<div class="ins-featured-grid"([^>]*)>/, `<div class="ins-featured-grid"$1>\n${cards}\n`);
    writeTextIfChanged(path, html);
    console.log(`patched listing ${path}`);
    return;
  }
  console.warn(`Could not find ins-featured-grid in ${path}; add cards manually.`);
}

patchIndex(join(www, "insights", "index.html"), "en");
patchIndex(join(www, "vi", "insights", "index.html"), "vi");


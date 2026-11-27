/**
 * Service-page catalog used by generate-service-pages.mjs.
 * Generated from scripts/seo/_catalog_data.py — edit the Python and re-run.
 * Copy is based on existing Crown site text. Do not invent clients, figures or licences.
 */

/** @typedef {{ title: string, description: string, h1: string, kicker: string, lead: string, sections: {h2: string, p: string}[], faqs: {q: string, a: string}[] }} LocaleService */
/** @typedef {{ slug: string, related: string[], en: LocaleService, vi: LocaleService }} ServiceEntry */
/** @typedef {{ folder: string, brandEn: string, brandVi: string, contactPath: string, services: ServiceEntry[] }} SiteServices */

/** @type {Record<string, SiteServices>} */
export const serviceCatalog = 
{
  "audit": {
    "folder": "audit",
    "brandEn": "Crown Audit",
    "brandVi": "Crown Audit",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "financial-statement-audit",
        "related": [
          "special-purpose-audit",
          "review-and-aup",
          "outsourced-internal-audit"
        ],
        "en": {
          "title": "Annual financial statement audit | Crown Audit",
          "description": "Crown Audit performs annual financial statement audits under applicable standards, for compliance and the information needs of report users in Vietnam.",
          "h1": "Annual financial statement audit",
          "kicker": "Crown Audit",
          "lead": "Annual financial statement audit under applicable standards for compliance and the information needs of report users.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Audit performs an audit of the annual financial statements under the applicable financial reporting framework and auditing standards agreed for the engagement. The work is scoped to the entity, the reporting period and the users of the report."
            },
            {
              "h2": "Value delivered",
              "p": "An audit report provides a basis for discussions with shareholders, banks and regulators. The engagement focuses on whether the financial statements are prepared, in all material respects, in accordance with the agreed reporting framework."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Who typically uses this service?",
              "a": "Businesses that need an independent audit of annual financial statements for shareholders, lenders, regulators or other report users."
            },
            {
              "q": "How is the scope agreed?",
              "a": "Scope, reporting framework and timeline are agreed with the client before work begins, so the report meets the intended users’ requirements."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán BCTC thường niên | Crown Audit",
          "description": "Crown Audit thực hiện kiểm toán báo cáo tài chính năm theo chuẩn mực áp dụng, phục vụ tuân thủ và nhu cầu thông tin của các bên sử dụng tại Việt Nam.",
          "h1": "Kiểm toán báo cáo tài chính thường niên",
          "kicker": "Crown Audit",
          "lead": "Kiểm toán báo cáo tài chính năm theo chuẩn mực áp dụng, phục vụ nhu cầu tuân thủ và cung cấp thông tin cho các bên sử dụng.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Audit thực hiện kiểm toán báo cáo tài chính năm theo khuôn khổ lập báo cáo và chuẩn mực kiểm toán được thống nhất cho hợp đồng. Phạm vi gắn với đơn vị, kỳ báo cáo và người sử dụng báo cáo."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Báo cáo kiểm toán làm cơ sở trao đổi với cổ đông, ngân hàng và cơ quan quản lý. Công việc tập trung vào việc báo cáo được lập, trên các khía cạnh trọng yếu, phù hợp với khuôn khổ đã thống nhất."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Doanh nghiệp nào thường sử dụng dịch vụ này?",
              "a": "Các doanh nghiệp cần kiểm toán độc lập báo cáo tài chính năm cho cổ đông, bên cho vay, cơ quan quản lý hoặc các bên sử dụng báo cáo khác."
            },
            {
              "q": "Phạm vi được thống nhất như thế nào?",
              "a": "Phạm vi, khuôn khổ lập báo cáo và tiến độ được thống nhất với khách hàng trước khi triển khai, để báo cáo đáp ứng yêu cầu của bên sử dụng."
            }
          ]
        }
      },
      {
        "slug": "special-purpose-audit",
        "related": [
          "financial-statement-audit",
          "review-and-aup"
        ],
        "en": {
          "title": "Special-purpose financial audit | Crown Audit",
          "description": "Crown Audit audits financial statements prepared for a defined purpose, using the reporting basis and requirements of the identified users in Vietnam.",
          "h1": "Financial statement audit for a special purpose",
          "kicker": "Crown Audit",
          "lead": "Audit financial statements prepared for a defined purpose, using the reporting basis and requirements of identified users.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "This engagement covers financial statements prepared for a defined purpose, using the reporting basis and requirements of identified users. Scope and report format are agreed in advance."
            },
            {
              "h2": "Value delivered",
              "p": "The work is designed to meet the intended purpose, with the scope and report format agreed before the engagement begins."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When is a special-purpose audit used?",
              "a": "When financial statements are prepared for a defined purpose and identified users, rather than for a general-purpose annual audit."
            },
            {
              "q": "What is agreed in advance?",
              "a": "The reporting basis, intended users, scope and report format are agreed before work starts."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán BCTC mục đích đặc biệt | Crown Audit",
          "description": "Crown Audit kiểm toán báo cáo tài chính lập cho mục đích cụ thể, theo cơ sở lập báo cáo và yêu cầu của các bên sử dụng đã xác định tại Việt Nam.",
          "h1": "Kiểm toán BCTC vì mục đích đặc biệt",
          "kicker": "Crown Audit",
          "lead": "Kiểm toán báo cáo tài chính lập cho mục đích cụ thể, theo cơ sở lập báo cáo và yêu cầu của các bên sử dụng đã xác định.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ này áp dụng cho báo cáo tài chính lập cho mục đích cụ thể, theo cơ sở lập báo cáo và yêu cầu của các bên sử dụng đã xác định. Phạm vi và hình thức báo cáo được thống nhất trước."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Công việc nhằm đáp ứng đúng mục đích sử dụng, với phạm vi và hình thức báo cáo được thống nhất trước khi triển khai."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Khi nào cần kiểm toán vì mục đích đặc biệt?",
              "a": "Khi báo cáo tài chính được lập cho một mục đích xác định và các bên sử dụng đã xác định, thay vì kiểm toán báo cáo năm cho mục đích chung."
            },
            {
              "q": "Những nội dung nào được thống nhất trước?",
              "a": "Cơ sở lập báo cáo, bên sử dụng, phạm vi và hình thức báo cáo được thống nhất trước khi bắt đầu công việc."
            }
          ]
        }
      },
      {
        "slug": "review-and-aup",
        "related": [
          "financial-statement-audit",
          "special-purpose-audit",
          "compliance-audit"
        ],
        "en": {
          "title": "Review and agreed-upon procedures | Crown Audit",
          "description": "Crown Audit offers financial statement reviews with limited assurance and agreed-upon procedures that report findings without providing assurance.",
          "h1": "Financial statement review and agreed-upon procedures",
          "kicker": "Crown Audit",
          "lead": "A review provides limited assurance; agreed-upon procedures perform agreed work and report findings without assurance.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "A review of financial statements provides limited assurance. An agreed-upon procedures (AUP) engagement performs procedures that have been agreed with the engaging party and reports factual findings, without providing assurance."
            },
            {
              "h2": "Value delivered",
              "p": "This allows the business to select the engagement that fits the review objective and the report recipient’s requirements."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "How does a review differ from an audit?",
              "a": "A review provides limited assurance and involves less extensive procedures than an audit of financial statements."
            },
            {
              "q": "Does AUP provide assurance?",
              "a": "No. An agreed-upon procedures engagement reports findings from the agreed procedures and does not provide assurance."
            }
          ]
        },
        "vi": {
          "title": "Soát xét BCTC và AUP | Crown Audit",
          "description": "Crown Audit cung cấp soát xét báo cáo tài chính với đảm bảo có giới hạn và thủ tục AUP, báo cáo phát hiện mà không đưa ra đảm bảo tại Việt Nam.",
          "h1": "Soát xét BCTC và thủ tục thỏa thuận trước",
          "kicker": "Crown Audit",
          "lead": "Soát xét BCTC cung cấp sự đảm bảo có giới hạn; AUP thực hiện thủ tục đã thống nhất và báo cáo phát hiện, không đưa ra đảm bảo.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Soát xét báo cáo tài chính cung cấp sự đảm bảo có giới hạn. Dịch vụ thủ tục thỏa thuận trước (AUP) thực hiện các thủ tục đã thống nhất với bên thuê và báo cáo các phát hiện, không đưa ra đảm bảo."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp có thể chọn hình thức phù hợp với mục tiêu rà soát và yêu cầu của bên nhận báo cáo."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Soát xét khác kiểm toán như thế nào?",
              "a": "Soát xét cung cấp sự đảm bảo có giới hạn và các thủ tục thường ít mở rộng hơn so với kiểm toán báo cáo tài chính."
            },
            {
              "q": "AUP có đưa ra đảm bảo không?",
              "a": "Không. Dịch vụ thủ tục thỏa thuận trước báo cáo các phát hiện từ thủ tục đã thống nhất và không đưa ra đảm bảo."
            }
          ]
        }
      },
      {
        "slug": "compliance-audit",
        "related": [
          "financial-statement-audit",
          "performance-audit",
          "outsourced-internal-audit"
        ],
        "en": {
          "title": "Compliance audit | Crown Audit",
          "description": "Crown Audit assesses compliance with defined legal, internal policy or contract criteria within an agreed scope, and identifies non-conformities for.",
          "h1": "Compliance audit",
          "kicker": "Crown Audit",
          "lead": "Assess compliance with defined legal, internal policy or contract criteria within the agreed scope of work.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "A compliance audit assesses whether the subject matter meets defined legal, internal policy or contract criteria, within the scope agreed with the business."
            },
            {
              "h2": "Value delivered",
              "p": "The work helps identify non-conformities and provides a basis for remedial recommendations."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What criteria can be used?",
              "a": "The criteria may be legal requirements, internal policies or contract conditions, as defined and agreed for the engagement."
            },
            {
              "q": "What does the business receive?",
              "a": "Findings on non-conformities within the agreed scope, together with a basis for remedial recommendations."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán tuân thủ | Crown Audit",
          "description": "Crown Audit đánh giá tuân thủ các tiêu chí về quy định, quy chế hoặc hợp đồng trong phạm vi đã thống nhất, và nhận diện điểm chưa phù hợp để khắc phục.",
          "h1": "Kiểm toán tuân thủ",
          "kicker": "Crown Audit",
          "lead": "Đánh giá việc đáp ứng các tiêu chí đã xác định về quy định, quy chế hoặc điều kiện hợp đồng, trong phạm vi được thống nhất.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Kiểm toán tuân thủ đánh giá việc đối tượng được kiểm toán đáp ứng các tiêu chí đã xác định về quy định pháp luật, quy chế nội bộ hoặc điều kiện hợp đồng, trong phạm vi thống nhất với doanh nghiệp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Công việc giúp nhận diện điểm chưa phù hợp và tạo cơ sở đề xuất biện pháp khắc phục."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Có thể dùng tiêu chí nào?",
              "a": "Tiêu chí có thể là quy định pháp luật, quy chế nội bộ hoặc điều kiện hợp đồng, được xác định và thống nhất cho hợp đồng dịch vụ."
            },
            {
              "q": "Doanh nghiệp nhận được gì?",
              "a": "Các phát hiện về điểm chưa phù hợp trong phạm vi đã thống nhất, cùng cơ sở để đề xuất biện pháp khắc phục."
            }
          ]
        }
      },
      {
        "slug": "performance-audit",
        "related": [
          "compliance-audit",
          "financial-statement-audit",
          "outsourced-internal-audit"
        ],
        "en": {
          "title": "Performance audit of operations | Crown Audit",
          "description": "Crown Audit assesses resource use, operational results and project progress against objectives and criteria agreed with the business in Vietnam.",
          "h1": "Performance audit of operations and projects",
          "kicker": "Crown Audit",
          "lead": "Assess resource use, operational results and project progress against objectives and criteria agreed with the business.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "A performance audit assesses resource use, operational results and project progress against objectives and criteria agreed with the business."
            },
            {
              "h2": "Value delivered",
              "p": "The work provides an independent perspective to help leadership prioritise actions and adjust implementation plans."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is assessed?",
              "a": "Resource use, operational results and project progress, measured against objectives and criteria agreed with the business."
            },
            {
              "q": "How are the criteria set?",
              "a": "Objectives and criteria are agreed with the business before the work is performed."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán hiệu quả hoạt động | Crown Audit",
          "description": "Crown Audit đánh giá sử dụng nguồn lực, kết quả hoạt động và tiến độ dự án theo mục tiêu và tiêu chí đã thống nhất với doanh nghiệp tại Việt Nam.",
          "h1": "Kiểm toán hiệu quả hoạt động và dự án",
          "kicker": "Crown Audit",
          "lead": "Đánh giá sử dụng nguồn lực, kết quả hoạt động và tiến độ dự án theo mục tiêu, tiêu chí đã thống nhất với doanh nghiệp.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Kiểm toán hiệu quả hoạt động đánh giá việc sử dụng nguồn lực, kết quả hoạt động và tiến độ thực hiện dự án theo các mục tiêu, tiêu chí đã thống nhất với doanh nghiệp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Công việc cung cấp góc nhìn độc lập để lãnh đạo xác định ưu tiên và điều chỉnh kế hoạch thực hiện."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Nội dung đánh giá gồm những gì?",
              "a": "Việc sử dụng nguồn lực, kết quả hoạt động và tiến độ dự án, đo lường theo mục tiêu và tiêu chí đã thống nhất với doanh nghiệp."
            },
            {
              "q": "Tiêu chí được xác định như thế nào?",
              "a": "Mục tiêu và tiêu chí được thống nhất với doanh nghiệp trước khi thực hiện công việc."
            }
          ]
        }
      },
      {
        "slug": "partner-assessment",
        "related": [
          "financial-statement-audit",
          "special-purpose-audit",
          "compliance-audit"
        ],
        "en": {
          "title": "Partner capability assessment | Crown Audit",
          "description": "Crown Audit reviews partner information, financial capacity and relevant records within an agreed scope before a contract or collaboration begins.",
          "h1": "Capability assessment of partners before collaboration",
          "kicker": "Crown Audit",
          "lead": "Review partner information, financial capacity and relevant records within the agreed scope before contracting or collaborating.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "This work reviews partner information, financial capacity and relevant records within the agreed scope before contracting or collaborating."
            },
            {
              "h2": "Value delivered",
              "p": "The review supports partner evaluation, risk identification and the selection of suitable collaboration terms."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When is this assessment useful?",
              "a": "Before signing a contract or starting a collaboration, when you need a structured review of a counterpart’s information and financial capacity."
            },
            {
              "q": "What is reviewed?",
              "a": "Partner information, financial capacity and other relevant records, limited to the scope agreed for the engagement."
            }
          ]
        },
        "vi": {
          "title": "Thẩm định năng lực đối tác | Crown Audit",
          "description": "Crown Audit rà soát thông tin, năng lực tài chính và hồ sơ liên quan của đối tác theo phạm vi thống nhất, trước khi ký kết hoặc bắt đầu hợp tác.",
          "h1": "Thẩm định năng lực đối tác trước hợp tác",
          "kicker": "Crown Audit",
          "lead": "Rà soát thông tin và năng lực tài chính, hồ sơ liên quan của đối tác theo phạm vi thống nhất trước khi ký kết hoặc triển khai hợp tác.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc rà soát thông tin, năng lực tài chính và hồ sơ liên quan của đối tác theo phạm vi đã thống nhất, trước khi ký kết hoặc triển khai hợp tác."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Kết quả bổ sung cơ sở đánh giá đối tác, nhận diện rủi ro và lựa chọn điều kiện hợp tác phù hợp."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Khi nào nên thực hiện thẩm định này?",
              "a": "Trước khi ký hợp đồng hoặc bắt đầu hợp tác, khi cần rà soát có hệ thống thông tin và năng lực tài chính của đối tác."
            },
            {
              "q": "Những nội dung nào được rà soát?",
              "a": "Thông tin đối tác, năng lực tài chính và hồ sơ liên quan, trong phạm vi đã thống nhất cho hợp đồng dịch vụ."
            }
          ]
        }
      },
      {
        "slug": "board-oversight",
        "related": [
          "outsourced-internal-audit",
          "compliance-audit",
          "financial-statement-audit"
        ],
        "en": {
          "title": "Board oversight of internal controls | Crown Audit",
          "description": "Crown Audit helps identify experienced audit professionals to serve as independent directors overseeing internal controls within their assigned roles.",
          "h1": "Independent board member overseeing internal controls",
          "kicker": "Crown Audit",
          "lead": "Help identify experienced audit professionals to serve as independent directors overseeing internal controls within assigned roles.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Audit helps identify experienced audit professionals to serve as independent directors overseeing internal controls, within the roles assigned by the business."
            },
            {
              "h2": "Value delivered",
              "p": "The arrangement brings an independent perspective and professional experience to board oversight of internal controls."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What support does Crown provide?",
              "a": "Support in identifying experienced audit professionals who can serve as independent directors overseeing internal controls, within assigned roles."
            },
            {
              "q": "Does this replace an internal audit function?",
              "a": "No. Board oversight of internal controls is distinct from an outsourced internal audit engagement, which Crown also offers separately."
            }
          ]
        },
        "vi": {
          "title": "HĐQT độc lập phụ trách KSNB | Crown Audit",
          "description": "Crown Audit hỗ trợ tìm kiếm nhân sự có kinh nghiệm kiểm toán để tham gia HĐQT độc lập, giám sát kiểm soát nội bộ theo vai trò được giao. Liên hệ Crown để.",
          "h1": "Thành viên HĐQT độc lập phụ trách kiểm soát nội bộ",
          "kicker": "Crown Audit",
          "lead": "Hỗ trợ tìm kiếm nhân sự có kinh nghiệm kiểm toán tham gia HĐQT độc lập, giám sát hệ thống kiểm soát nội bộ theo vai trò được giao.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Audit hỗ trợ tìm kiếm nhân sự có kinh nghiệm kiểm toán tham gia Hội đồng quản trị độc lập, giám sát hệ thống kiểm soát nội bộ theo vai trò được doanh nghiệp giao."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Cách làm này bổ sung góc nhìn độc lập và kinh nghiệm chuyên môn cho công tác giám sát của Hội đồng quản trị."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Crown hỗ trợ nội dung nào?",
              "a": "Hỗ trợ tìm kiếm nhân sự có kinh nghiệm kiểm toán để làm thành viên HĐQT độc lập, giám sát kiểm soát nội bộ theo vai trò được giao."
            },
            {
              "q": "Dịch vụ này có thay thế kiểm toán nội bộ không?",
              "a": "Không. Giám sát của HĐQT khác với dịch vụ phòng kiểm toán nội bộ thuê ngoài, vốn được Crown cung cấp riêng."
            }
          ]
        }
      },
      {
        "slug": "outsourced-internal-audit",
        "related": [
          "board-oversight",
          "compliance-audit",
          "financial-statement-audit"
        ],
        "en": {
          "title": "Outsourced internal audit | Crown Audit",
          "description": "Crown Audit plans and performs risk-based internal audits, and reports findings, recommendations and agreed remediation progress for the business.",
          "h1": "Outsourced internal audit department",
          "kicker": "Crown Audit",
          "lead": "Plan and perform risk-based internal audits; report findings, recommendations and agreed remediation progress.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The engagement covers planning and performing risk-based internal audits, then reporting findings, recommendations and the progress of agreed remediation."
            },
            {
              "h2": "Value delivered",
              "p": "This helps the business maintain internal audit capability suited to its scale without building the entire team internally."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does an outsourced internal audit include?",
              "a": "Risk-based planning and fieldwork, reporting of findings and recommendations, and follow-up of agreed remediation progress."
            },
            {
              "q": "Who is this suitable for?",
              "a": "Organisations that need an internal audit function suited to their scale without building the entire team in-house."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán nội bộ thuê ngoài | Crown Audit",
          "description": "Crown Audit lập kế hoạch và thực hiện kiểm toán nội bộ theo rủi ro, báo cáo phát hiện, khuyến nghị và theo dõi tiến độ khắc phục đã thống nhất.",
          "h1": "Phòng kiểm toán nội bộ thuê ngoài",
          "kicker": "Crown Audit",
          "lead": "Xây dựng kế hoạch và thực hiện kiểm toán nội bộ theo rủi ro; báo cáo phát hiện, khuyến nghị và theo dõi tiến độ khắc phục đã thống nhất.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ gồm lập kế hoạch và thực hiện kiểm toán nội bộ theo rủi ro, sau đó báo cáo phát hiện, khuyến nghị và tiến độ khắc phục đã thống nhất."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp duy trì chức năng kiểm toán nội bộ phù hợp quy mô mà không phải xây dựng toàn bộ bộ máy bên trong."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Kiểm toán nội bộ thuê ngoài gồm những gì?",
              "a": "Lập kế hoạch và thực hiện theo rủi ro, báo cáo phát hiện và khuyến nghị, đồng thời theo dõi tiến độ khắc phục đã thống nhất."
            },
            {
              "q": "Dịch vụ phù hợp với ai?",
              "a": "Các tổ chức cần chức năng kiểm toán nội bộ phù hợp quy mô mà không xây dựng toàn bộ đội ngũ ngay trong doanh nghiệp."
            }
          ]
        }
      }
    ]
  },
  "acc": {
    "folder": "acc",
    "brandEn": "Crown Accounting",
    "brandVi": "Crown Accounting",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "accounting-system-setup",
        "related": [
          "management-accounting",
          "system-standardization",
          "outsourced-accounting-payroll"
        ],
        "en": {
          "title": "Accounting system setup | Crown Accounting",
          "description": "Crown Accounting sets up accounts, codes, supporting documents and posting procedures from the outset, building a foundation for compliance and management.",
          "h1": "Accounting system setup for newly invested businesses",
          "kicker": "Crown Accounting",
          "lead": "Set up accounts, reference codes, supporting documents and posting procedures from the outset to create a foundation for compliance and management.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service sets up accounts, reference codes, supporting documents and posting procedures from the outset, so newly invested businesses have a foundation for both compliance and management reporting."
            },
            {
              "h2": "Value delivered",
              "p": "This reduces input errors and the need to reorganize systems as the business expands."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Who is this service for?",
              "a": "Newly invested businesses that need an accounting foundation set up correctly from day one."
            },
            {
              "q": "What is set up?",
              "a": "Accounts, reference codes, supporting documents and posting procedures, agreed to the business’s reporting needs."
            }
          ]
        },
        "vi": {
          "title": "Thiết lập hệ thống kế toán | Crown Accounting",
          "description": "Crown Accounting thiết lập tài khoản, mã quy chiếu, chứng từ và quy trình hạch toán từ đầu, tạo nền tảng tuân thủ và quản trị cho doanh nghiệp.",
          "h1": "Thiết lập hệ thống kế toán cho doanh nghiệp mới đầu tư",
          "kicker": "Crown Accounting",
          "lead": "Thiết lập tài khoản, mã quy chiếu, chứng từ và quy trình hạch toán ngay từ đầu để tạo nền tảng cho tuân thủ và quản trị.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ thiết lập tài khoản, mã quy chiếu, chứng từ và quy trình hạch toán ngay từ đầu, giúp doanh nghiệp mới đầu tư có nền tảng cho tuân thủ và báo cáo quản trị."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Cách làm này giảm sai sót đầu vào và hạn chế việc phải tổ chức lại hệ thống khi doanh nghiệp mở rộng."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Dịch vụ dành cho đối tượng nào?",
              "a": "Các doanh nghiệp mới đầu tư cần xây dựng nền tảng kế toán đúng từ ban đầu."
            },
            {
              "q": "Những gì được thiết lập?",
              "a": "Tài khoản, mã quy chiếu, chứng từ và quy trình hạch toán, thống nhất theo nhu cầu báo cáo của doanh nghiệp."
            }
          ]
        }
      },
      {
        "slug": "management-accounting",
        "related": [
          "accounting-system-setup",
          "financial-controller",
          "outsourced-accounting-payroll"
        ],
        "en": {
          "title": "Management accounting systems | Crown Accounting",
          "description": "Crown Accounting develops management reports and analyzes costs, break-even points and profitability by product, department or management unit.",
          "h1": "Management accounting system development",
          "kicker": "Crown Accounting",
          "lead": "Develop management reports and analyze costs, break-even points and profitability by product, department or management unit.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work develops management reports and analysis of costs, break-even points and profitability by product, department or another relevant management unit."
            },
            {
              "h2": "Value delivered",
              "p": "The reports provide data to assess performance, adjust prices, allocate resources and plan business activities."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What can the reports show?",
              "a": "Costs, break-even points and profitability, grouped by product, department or another management unit agreed with the business."
            },
            {
              "q": "How does this support decisions?",
              "a": "Management reports provide data to assess performance, review pricing, allocate resources and plan activities."
            }
          ]
        },
        "vi": {
          "title": "Hệ thống kế toán quản trị | Crown Accounting",
          "description": "Crown Accounting xây dựng báo cáo quản trị và phân tích chi phí, điểm hòa vốn, sinh lời theo sản phẩm, bộ phận hoặc đơn vị quản trị liên quan.",
          "h1": "Xây dựng hệ thống kế toán quản trị",
          "kicker": "Crown Accounting",
          "lead": "Xây dựng báo cáo quản trị và phân tích chi phí, điểm hòa vốn, khả năng sinh lời theo sản phẩm, bộ phận hoặc đơn vị quản trị.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc xây dựng báo cáo quản trị và phân tích chi phí, điểm hòa vốn và khả năng sinh lời theo sản phẩm, bộ phận hoặc đơn vị quản trị phù hợp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Báo cáo cung cấp dữ liệu để đánh giá hiệu quả, điều chỉnh giá, phân bổ nguồn lực và lập kế hoạch hoạt động."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Báo cáo có thể thể hiện những gì?",
              "a": "Chi phí, điểm hòa vốn và khả năng sinh lời, được nhóm theo sản phẩm, bộ phận hoặc đơn vị quản trị đã thống nhất."
            },
            {
              "q": "Dữ liệu hỗ trợ quyết định như thế nào?",
              "a": "Báo cáo quản trị giúp đánh giá hiệu quả, rà soát giá, phân bổ nguồn lực và lập kế hoạch hoạt động."
            }
          ]
        }
      },
      {
        "slug": "outsourced-accounting-payroll",
        "related": [
          "financial-controller",
          "accounting-system-setup",
          "crown-support-intelligence"
        ],
        "en": {
          "title": "Outsourced accounting and payroll | Crown Accounting",
          "description": "Crown Accounting handles accounting, invoicing, payroll and insurance within an agreed scope, with organized handover, processing and periodic reporting.",
          "h1": "Outsourced accounting and payroll",
          "kicker": "Crown Accounting",
          "lead": "Handle accounting, invoicing, payroll and insurance within the agreed scope, with organized handover, processing and periodic reporting.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The team handles accounting, invoicing, payroll and insurance within the agreed scope, including organized data handover, transaction processing and periodic reporting."
            },
            {
              "h2": "Value delivered",
              "p": "This adapts accounting resources to demand and clarifies shared responsibilities so the business can focus on operations."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What work can be outsourced?",
              "a": "Accounting, invoicing, payroll and insurance, within the scope agreed for the engagement, including periodic reporting."
            },
            {
              "q": "How is responsibility shared?",
              "a": "Handover, processing and reporting responsibilities are organized so the business and Crown each have a clear role."
            }
          ]
        },
        "vi": {
          "title": "Outsourcing kế toán và bảng lương | Crown Accounting",
          "description": "Crown Accounting thực hiện kế toán, hóa đơn, bảng lương và bảo hiểm trong phạm vi thống nhất, gồm bàn giao dữ liệu, xử lý nghiệp vụ và báo cáo định kỳ.",
          "h1": "Outsourcing kế toán và bảng lương",
          "kicker": "Crown Accounting",
          "lead": "Thực hiện kế toán, hóa đơn, bảng lương và bảo hiểm trong phạm vi thống nhất, với bàn giao dữ liệu, xử lý nghiệp vụ và báo cáo định kỳ.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Nhóm công tác thực hiện kế toán, hóa đơn, bảng lương và bảo hiểm trong phạm vi đã thống nhất, bao gồm bàn giao dữ liệu, xử lý giao dịch và báo cáo định kỳ."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp điều chỉnh nguồn lực kế toán theo nhu cầu và làm rõ trách nhiệm phối hợp để tập trung vào hoạt động kinh doanh."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những công việc nào có thể thuê ngoài?",
              "a": "Kế toán, hóa đơn, bảng lương và bảo hiểm, trong phạm vi đã thống nhất, kể cả báo cáo định kỳ."
            },
            {
              "q": "Trách nhiệm được phân chia như thế nào?",
              "a": "Việc bàn giao, xử lý và báo cáo được tổ chức để doanh nghiệp và Crown đều có vai trò rõ ràng."
            }
          ]
        }
      },
      {
        "slug": "financial-controller",
        "related": [
          "outsourced-accounting-payroll",
          "management-accounting",
          "competency-assessment"
        ],
        "en": {
          "title": "Outsourced financial controller | Crown Accounting",
          "description": "Crown Accounting assigns senior personnel as financial controller or chief accountant to review transactions, organize closing and sign reports.",
          "h1": "Outsourced financial controller and chief accountant",
          "kicker": "Crown Accounting",
          "lead": "Assign senior personnel as financial controller or chief accountant to review transactions, organize closing and sign reports in assigned roles.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Senior personnel can be assigned as financial controller or chief accountant to review transactions, organize period-end closing, and prepare and sign reports within their assigned roles."
            },
            {
              "h2": "Value delivered",
              "p": "This strengthens professional oversight, improves error controls and reduces the risk of losses during operations."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What roles can be assigned?",
              "a": "A financial controller or chief accountant role, with responsibilities limited to the functions assigned by the business."
            },
            {
              "q": "What work do they typically cover?",
              "a": "Reviewing transactions, organizing closing, and preparing and signing reports within the assigned role."
            }
          ]
        },
        "vi": {
          "title": "Kiểm soát tài chính thuê ngoài | Crown Accounting",
          "description": "Crown Accounting bố trí nhân sự cấp cao làm kiểm soát tài chính hoặc kế toán trưởng để rà soát giao dịch, tổ chức khóa sổ và ký báo cáo. Liên hệ Crown để.",
          "h1": "Kiểm soát tài chính và kế toán trưởng thuê ngoài",
          "kicker": "Crown Accounting",
          "lead": "Bố trí nhân sự cấp cao làm kiểm soát tài chính hoặc kế toán trưởng để rà soát giao dịch, tổ chức khóa sổ và ký báo cáo theo vai trò được giao.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Nhân sự cấp cao có thể được bố trí làm kiểm soát tài chính hoặc kế toán trưởng để rà soát giao dịch, tổ chức khóa sổ và lập, ký báo cáo theo vai trò được giao."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Cách làm này tăng cường giám sát chuyên môn, cải thiện kiểm soát sai sót và giảm rủi ro tổn thất trong quá trình vận hành."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Có thể đảm nhận vai trò nào?",
              "a": "Vai trò kiểm soát tài chính hoặc kế toán trưởng, với trách nhiệm giới hạn theo chức năng doanh nghiệp giao."
            },
            {
              "q": "Công việc thường gồm những gì?",
              "a": "Rà soát giao dịch, tổ chức khóa sổ, lập và ký báo cáo trong phạm vi vai trò được giao."
            }
          ]
        }
      },
      {
        "slug": "competency-assessment",
        "related": [
          "system-standardization",
          "financial-controller",
          "accounting-system-setup"
        ],
        "en": {
          "title": "Accounting competency assessment | Crown Accounting",
          "description": "Crown Accounting assesses accounting knowledge, transaction skills and regulatory awareness, then recommends measures to standardize the team.",
          "h1": "Accounting competency assessment and standardization",
          "kicker": "Crown Accounting",
          "lead": "Assess accounting knowledge, transaction-handling skills and regulatory awareness, then recommend standardization measures.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The assessment reviews accounting knowledge, transaction-handling skills and regulatory awareness, identifies competency gaps and recommends standardization measures."
            },
            {
              "h2": "Value delivered",
              "p": "Results provide a basis for work allocation, training and team development aligned with business management needs."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is assessed?",
              "a": "Accounting knowledge, transaction-handling skills and awareness of applicable requirements, within an agreed scope."
            },
            {
              "q": "How are the results used?",
              "a": "They support work allocation, training and team development in line with the business’s management needs."
            }
          ]
        },
        "vi": {
          "title": "Đánh giá năng lực kế toán | Crown Accounting",
          "description": "Crown Accounting đánh giá kiến thức kế toán, kỹ năng xử lý nghiệp vụ và nắm vững quy định, rồi đề xuất biện pháp chuẩn hóa đội ngũ. Liên hệ Crown để trao.",
          "h1": "Đánh giá năng lực và chuẩn hóa đội ngũ kế toán",
          "kicker": "Crown Accounting",
          "lead": "Đánh giá kiến thức kế toán, kỹ năng xử lý nghiệp vụ và nắm vững quy định, từ đó đề xuất biện pháp chuẩn hóa đội ngũ.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Việc đánh giá rà soát kiến thức kế toán, kỹ năng xử lý nghiệp vụ và mức độ nắm vững quy định, nhận diện khoảng trống năng lực và đề xuất biện pháp chuẩn hóa."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Kết quả là cơ sở để phân công công việc, đào tạo và phát triển đội ngũ phù hợp nhu cầu quản trị của doanh nghiệp."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những nội dung nào được đánh giá?",
              "a": "Kiến thức kế toán, kỹ năng xử lý nghiệp vụ và việc nắm vững các yêu cầu áp dụng, trong phạm vi đã thống nhất."
            },
            {
              "q": "Kết quả được dùng để làm gì?",
              "a": "Hỗ trợ phân công việc, đào tạo và phát triển đội ngũ phù hợp nhu cầu quản trị của doanh nghiệp."
            }
          ]
        }
      },
      {
        "slug": "system-standardization",
        "related": [
          "accounting-system-setup",
          "competency-assessment",
          "crown-support-intelligence"
        ],
        "en": {
          "title": "Accounting system standardization | Crown Accounting",
          "description": "Crown Accounting reviews books, balances, expenses and inventory, reconciles data and identifies discrepancies and tax risks to plan corrections.",
          "h1": "Accounting system standardization for operating businesses",
          "kicker": "Crown Accounting",
          "lead": "Review books, receivables and payables, expenses and inventory; reconcile data and identify discrepancies and tax risks.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "For operating businesses, the work reviews books, receivables and payables, expenses and inventory, reconciles data, and identifies discrepancies and tax risks in order to develop corrective actions."
            },
            {
              "h2": "Value delivered",
              "p": "This helps clarify unresolved balances and strengthen record reliability before explanations, fundraising or transactions."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is reviewed?",
              "a": "Books, receivables and payables, expenses and inventory, with reconciliations to identify discrepancies and tax risks."
            },
            {
              "q": "When is standardization useful?",
              "a": "When an operating business needs clearer balances and more reliable records before explanations, fundraising or a transaction."
            }
          ]
        },
        "vi": {
          "title": "Chuẩn hóa hệ thống kế toán | Crown Accounting",
          "description": "Crown Accounting rà soát sổ sách, công nợ, chi phí và tồn kho, đối chiếu dữ liệu, nhận diện chênh lệch và rủi ro thuế để xây dựng hướng xử lý.",
          "h1": "Chuẩn hóa hệ thống kế toán cho doanh nghiệp đang hoạt động",
          "kicker": "Crown Accounting",
          "lead": "Rà soát sổ sách, công nợ, chi phí và hàng tồn kho; đối chiếu dữ liệu, nhận diện chênh lệch và rủi ro thuế để xây dựng hướng xử lý.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Với doanh nghiệp đang hoạt động, công việc rà soát sổ sách, phải thu phải trả, chi phí và hàng tồn kho, đối chiếu dữ liệu, nhận diện chênh lệch và rủi ro thuế để xây dựng biện pháp xử lý."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp làm rõ số dư chưa được xử lý và tăng độ tin cậy của hồ sơ trước khi giải trình, gọi vốn hoặc thực hiện giao dịch."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những nội dung nào được rà soát?",
              "a": "Sổ sách, công nợ, chi phí và hàng tồn kho, kèm đối chiếu để nhận diện chênh lệch và rủi ro thuế."
            },
            {
              "q": "Khi nào nên chuẩn hóa hệ thống?",
              "a": "Khi doanh nghiệp đang hoạt động cần số dư rõ ràng và hồ sơ tin cậy hơn trước khi giải trình, gọi vốn hoặc giao dịch."
            }
          ]
        }
      },
      {
        "slug": "crown-support-intelligence",
        "related": [
          "system-standardization",
          "outsourced-accounting-payroll",
          "tax-risk-review"
        ],
        "en": {
          "title": "Crown Support Intelligence (CSI) | Crown Accounting",
          "description": "CSI is Crown Accounting’s recurring review for in-house teams: tax-risk alerts, guidance on new rules and an expert reference line, not day-to-day.",
          "h1": "Crown Support Intelligence (CSI)",
          "kicker": "Crown Accounting",
          "lead": "A recurring review for in-house accounting teams: risk alerts, guidance on new tax rules and an expert reference line — not a substitute for day-to-day execution.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Support Intelligence (CSI) is a recurring subscription for businesses with in-house accounting teams that want an additional layer of independent review and ongoing risk alerts. It is a direct line to Crown’s tax and accounting experts, not an outsourced accounting department. The principle is that CSI is a reference resource, never a substitute for day-to-day execution."
            },
            {
              "h2": "Value delivered",
              "p": "The service includes continuous review of business-provided reporting data, risk flags from a tax-authority perspective, explanations of newly issued tax rules for practical application, and access to a professional information network."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Does CSI replace the in-house accounting team?",
              "a": "No. CSI is an expert reference resource and an additional review layer. It is not a substitute for day-to-day accounting execution."
            },
            {
              "q": "What does the subscription include?",
              "a": "Recurring review of data the business provides, tax-risk alerts, explanations of new tax rules, and access to Crown’s expert reference line."
            }
          ]
        },
        "vi": {
          "title": "Crown Support Intelligence (CSI) | Crown Accounting",
          "description": "CSI là dịch vụ rà soát định kỳ của Crown Accounting cho đội ngũ nội bộ: cảnh báo rủi ro thuế, hướng dẫn quy định mới và đường dây chuyên môn, không phải.",
          "h1": "Crown Support Intelligence (CSI)",
          "kicker": "Crown Accounting",
          "lead": "Dịch vụ rà soát định kỳ cho đội ngũ kế toán nội bộ: cảnh báo rủi ro, hướng dẫn quy định thuế mới và đường dây chuyên môn — không thay thế việc thực hiện hàng ngày.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Support Intelligence (CSI) là dịch vụ đăng ký định kỳ dành cho doanh nghiệp có đội ngũ kế toán nội bộ, cần thêm một lớp rà soát độc lập và cảnh báo rủi ro thường xuyên. Đây là đường dây kết nối trực tiếp với chuyên gia thuế và kế toán của Crown, không phải bộ phận kế toán thuê ngoài. Nguyên tắc: CSI là nguồn tham chiếu chuyên môn, không thay thế việc thực hiện hàng ngày."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Dịch vụ gồm rà soát liên tục dữ liệu báo cáo do doanh nghiệp cung cấp, cảnh báo rủi ro dưới góc nhìn cơ quan thuế, giải thích quy định thuế mới để áp dụng đúng, và kết nối mạng thông tin chuyên môn."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "CSI có thay thế đội ngũ kế toán nội bộ không?",
              "a": "Không. CSI là nguồn tham chiếu chuyên môn và lớp rà soát bổ sung, không thay thế công việc kế toán hàng ngày."
            },
            {
              "q": "Gói dịch vụ gồm những gì?",
              "a": "Rà soát định kỳ dữ liệu do doanh nghiệp cung cấp, cảnh báo rủi ro thuế, giải thích quy định mới và đường dây chuyên môn của Crown."
            }
          ]
        }
      }
    ]
  },
  "tax": {
    "folder": "tax",
    "brandEn": "Crown Tax",
    "brandVi": "Crown Tax",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "transfer-pricing",
        "related": [
          "tax-risk-review",
          "ma-tax-advisory",
          "fdi-tax-procedures"
        ],
        "en": {
          "title": "Transfer pricing advisory | Crown Tax",
          "description": "Crown Tax reviews related-party transactions, advises on tax structures and prepares transfer pricing documentation under OECD guidance and Vietnamese.",
          "h1": "Transfer pricing and tax structuring advisory",
          "kicker": "Crown Tax",
          "lead": "Review related-party transactions, advise on tax structures and prepare transfer pricing documentation under OECD guidance and Vietnamese regulations.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work reviews related-party transactions, advises on tax structures and prepares transfer pricing documentation under OECD guidance and Vietnamese regulations."
            },
            {
              "h2": "Value delivered",
              "p": "This helps clarify pricing bases, identify risks and prepare documentation for explanations when requested."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does the documentation cover?",
              "a": "Transfer pricing documentation prepared under OECD guidance and Vietnamese regulations, within the agreed scope."
            },
            {
              "q": "What is the intended outcome?",
              "a": "A clearer pricing basis, identified risks, and records that can support explanations when requested."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn chuyển giá | Crown Tax",
          "description": "Crown Tax rà soát giao dịch liên kết, tư vấn cấu trúc thuế và lập hồ sơ chuyển giá theo hướng dẫn OECD và quy định hiện hành tại Việt Nam. Liên hệ Crown.",
          "h1": "Tư vấn chuyển giá và cấu trúc thuế",
          "kicker": "Crown Tax",
          "lead": "Rà soát giao dịch liên kết, tư vấn cấu trúc thuế và lập hồ sơ chuyển giá theo hướng dẫn OECD và quy định tại Việt Nam.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc rà soát giao dịch liên kết, tư vấn cấu trúc thuế và lập hồ sơ chuyển giá theo hướng dẫn OECD và quy định của Việt Nam."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp làm rõ cơ sở giá, nhận diện rủi ro và chuẩn bị hồ sơ giải trình khi được yêu cầu."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Hồ sơ gồm những nội dung nào?",
              "a": "Hồ sơ chuyển giá được lập theo hướng dẫn OECD và quy định của Việt Nam, trong phạm vi đã thống nhất."
            },
            {
              "q": "Kết quả hướng tới điều gì?",
              "a": "Cơ sở giá rõ hơn, rủi ro được nhận diện và hồ sơ sẵn sàng hỗ trợ giải trình khi có yêu cầu."
            }
          ]
        }
      },
      {
        "slug": "tax-risk-review",
        "related": [
          "transfer-pricing",
          "tax-representation",
          "vat-refunds"
        ],
        "en": {
          "title": "Periodic tax risk review | Crown Tax",
          "description": "Crown Tax reviews CIT, VAT and PIT quarterly or annually, reconciles filings with books and documents, and proposes corrections before reviews arise.",
          "h1": "Periodic tax risk review",
          "kicker": "Crown Tax",
          "lead": "Review corporate income tax, VAT and personal income tax quarterly or annually; reconcile filings with books and documents to identify errors.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The review covers corporate income tax, VAT and personal income tax on a quarterly or annual basis, reconciling filings with books and supporting documents to identify errors and propose corrections."
            },
            {
              "h2": "Value delivered",
              "p": "Businesses can resolve inconsistencies proactively and improve readiness for tax reviews or inspections."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Which taxes are typically reviewed?",
              "a": "Corporate income tax, value-added tax and personal income tax, at a quarterly or annual frequency agreed with the business."
            },
            {
              "q": "What is the aim of the review?",
              "a": "To identify errors early, propose corrections and improve readiness for a tax review or inspection."
            }
          ]
        },
        "vi": {
          "title": "Soát xét rủi ro thuế định kỳ | Crown Tax",
          "description": "Crown Tax soát xét thuế TNDN, GTGT và TNCN theo quý hoặc năm, đối chiếu tờ khai với sổ sách, chứng từ và đề xuất điều chỉnh kịp thời. Liên hệ Crown để.",
          "h1": "Soát xét rủi ro thuế định kỳ",
          "kicker": "Crown Tax",
          "lead": "Soát xét thuế TNDN, GTGT và TNCN theo quý hoặc năm; đối chiếu tờ khai với sổ sách và chứng từ để nhận diện sai sót và đề xuất điều chỉnh.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc soát xét thuế thu nhập doanh nghiệp, thuế GTGT và thuế thu nhập cá nhân theo quý hoặc năm, đối chiếu tờ khai với sổ sách và chứng từ để nhận diện sai sót và đề xuất điều chỉnh."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp xử lý sẵn các điểm chưa thống nhất và tăng mức độ sẵn sàng khi có rà soát hoặc thanh tra thuế."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những sắc thuế nào thường được soát xét?",
              "a": "Thuế thu nhập doanh nghiệp, thuế GTGT và thuế thu nhập cá nhân, với tần suất quý hoặc năm đã thống nhất."
            },
            {
              "q": "Mục tiêu của việc soát xét là gì?",
              "a": "Nhận diện sai sót sớm, đề xuất điều chỉnh và tăng mức sẵn sàng khi có rà soát hoặc thanh tra thuế."
            }
          ]
        }
      },
      {
        "slug": "tax-representation",
        "related": [
          "tax-risk-review",
          "vat-refunds",
          "ma-tax-advisory"
        ],
        "en": {
          "title": "Tax representation and disputes | Crown Tax",
          "description": "Crown Tax represents businesses before tax authorities, prepares arguments and evidence, and supports dispute resolution within an agreed scope.",
          "h1": "Tax representation and dispute support",
          "kicker": "Crown Tax",
          "lead": "Represent businesses before tax authorities, prepare arguments and evidence, and support dispute resolution within the agreed service scope.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Tax can represent a business before tax authorities, prepare arguments and evidence, and support dispute resolution within the agreed service scope."
            },
            {
              "h2": "Value delivered",
              "p": "The work aims to protect legitimate business interests with substantiated records and clear arguments concerning additional tax and penalties."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What support is provided?",
              "a": "Representation before tax authorities, preparation of arguments and evidence, and support for dispute resolution within the agreed scope."
            },
            {
              "q": "What records are needed?",
              "a": "Substantiated records and a clear argument relating to the additional tax or penalties under discussion, as agreed for the engagement."
            }
          ]
        },
        "vi": {
          "title": "Đại diện giải trình thuế | Crown Tax",
          "description": "Crown Tax đại diện doanh nghiệp trước cơ quan thuế, chuẩn bị luận cứ, chứng cứ và hỗ trợ giải quyết tranh chấp trong phạm vi đã thống nhất. Liên hệ Crown.",
          "h1": "Đại diện giải trình thuế và hỗ trợ tranh chấp",
          "kicker": "Crown Tax",
          "lead": "Đại diện doanh nghiệp làm việc với cơ quan thuế, chuẩn bị luận cứ và chứng cứ, hỗ trợ giải quyết tranh chấp trong phạm vi dịch vụ đã thống nhất.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Tax có thể đại diện doanh nghiệp làm việc với cơ quan thuế, chuẩn bị luận cứ và chứng cứ, đồng thời hỗ trợ giải quyết tranh chấp trong phạm vi dịch vụ đã thống nhất."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Công việc nhằm bảo vệ quyền lợi hợp pháp của doanh nghiệp với hồ sơ có căn cứ và luận cứ rõ ràng liên quan đến số thuế và tiền phạt truy thu."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Nội dung hỗ trợ gồm những gì?",
              "a": "Đại diện làm việc với cơ quan thuế, chuẩn bị luận cứ và chứng cứ, hỗ trợ giải quyết tranh chấp trong phạm vi đã thống nhất."
            },
            {
              "q": "Doanh nghiệp cần chuẩn bị hồ sơ nào?",
              "a": "Hồ sơ có căn cứ và luận cứ rõ ràng liên quan đến số thuế hoặc tiền phạt đang được trao đổi, theo phạm vi hợp đồng."
            }
          ]
        }
      },
      {
        "slug": "ma-tax-advisory",
        "related": [
          "transfer-pricing",
          "fdi-tax-procedures",
          "tax-risk-review"
        ],
        "en": {
          "title": "M&A and restructuring tax advice | Crown Tax",
          "description": "Crown Tax performs pre-transaction tax due diligence, assesses potential liabilities and advises on tax structures for acquisitions, mergers and.",
          "h1": "Tax advisory for M&A and corporate restructuring",
          "kicker": "Crown Tax",
          "lead": "Conduct pre-transaction tax due diligence, assess potential liabilities and advise on tax structures for acquisitions, mergers and restructuring.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service includes pre-transaction tax due diligence, an assessment of potential liabilities and advice on tax structures for acquisitions, mergers and corporate restructuring."
            },
            {
              "h2": "Value delivered",
              "p": "This helps identify risks before signing, clarify tax obligations and select an appropriate transaction structure."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When should tax due diligence take place?",
              "a": "Before signing, so potential tax liabilities and structuring options can be assessed in time to inform the transaction."
            },
            {
              "q": "What transactions does this cover?",
              "a": "Acquisitions, mergers and corporate restructuring, within the scope agreed for the engagement."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn thuế M&A và tái cấu trúc | Crown Tax",
          "description": "Crown Tax thẩm định thuế trước giao dịch, đánh giá nghĩa vụ tiềm ẩn và tư vấn cấu trúc thuế cho mua bán, sáp nhập và tái cấu trúc doanh nghiệp.",
          "h1": "Tư vấn thuế cho M&A và tái cấu trúc doanh nghiệp",
          "kicker": "Crown Tax",
          "lead": "Thực hiện thẩm định thuế trước giao dịch, đánh giá nghĩa vụ tiềm ẩn và tư vấn cấu trúc thuế cho mua bán, sáp nhập và tái cấu trúc doanh nghiệp.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ gồm thẩm định thuế trước giao dịch, đánh giá nghĩa vụ tiềm ẩn và tư vấn cấu trúc thuế cho mua lại, sáp nhập và tái cấu trúc doanh nghiệp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp nhận diện rủi ro trước khi ký, làm rõ nghĩa vụ thuế và lựa chọn cấu trúc giao dịch phù hợp."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Nên thẩm định thuế khi nào?",
              "a": "Trước khi ký kết, để đánh giá nghĩa vụ thuế tiềm ẩn và phương án cấu trúc kịp thời cho giao dịch."
            },
            {
              "q": "Dịch vụ áp dụng cho giao dịch nào?",
              "a": "Mua lại, sáp nhập và tái cấu trúc doanh nghiệp, trong phạm vi đã thống nhất."
            }
          ]
        }
      },
      {
        "slug": "vat-refunds",
        "related": [
          "tax-risk-review",
          "tax-representation",
          "fdi-tax-procedures"
        ],
        "en": {
          "title": "VAT refund support | Crown Tax",
          "description": "Crown Tax reviews VAT refund eligibility, standardizes applications, reconciles evidence, prepares explanations and tracks follow-up document requests.",
          "h1": "VAT refunds",
          "kicker": "Crown Tax",
          "lead": "Review VAT refund eligibility and standardize applications; reconcile evidence, prepare explanations and track requests for additional documents.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work reviews VAT refund eligibility and standardizes applications, including reconciling evidence, preparing explanations and tracking requests for additional documents."
            },
            {
              "h2": "Value delivered",
              "p": "This can reduce repeated document requests and support processing timelines and cash flow planning."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does the review include?",
              "a": "Eligibility for a VAT refund, standardization of the application, reconciliation of evidence and support with explanations or follow-up documents."
            },
            {
              "q": "How does this help cash flow?",
              "a": "Clearer applications and fewer repeated document requests can support processing timelines and cash-flow planning."
            }
          ]
        },
        "vi": {
          "title": "Hoàn thuế GTGT | Crown Tax",
          "description": "Crown Tax rà soát điều kiện hoàn thuế GTGT, chuẩn hóa hồ sơ, đối chiếu chứng từ, chuẩn bị giải trình và theo dõi yêu cầu bổ sung tài liệu. Liên hệ Crown.",
          "h1": "Hoàn thuế GTGT",
          "kicker": "Crown Tax",
          "lead": "Rà soát điều kiện hoàn thuế GTGT và chuẩn hóa hồ sơ; đối chiếu chứng từ, chuẩn bị giải trình và theo dõi yêu cầu bổ sung hồ sơ.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc rà soát điều kiện hoàn thuế GTGT và chuẩn hóa hồ sơ, bao gồm đối chiếu chứng từ, chuẩn bị giải trình và theo dõi các yêu cầu bổ sung tài liệu."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp giảm việc phải nộp lại hồ sơ nhiều lần, đồng thời hỗ trợ tiến độ xử lý và kế hoạch dòng tiền."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Nội dung rà soát gồm những gì?",
              "a": "Điều kiện hoàn thuế GTGT, chuẩn hóa hồ sơ, đối chiếu chứng từ và hỗ trợ giải trình hoặc bổ sung tài liệu."
            },
            {
              "q": "Việc này hỗ trợ dòng tiền như thế nào?",
              "a": "Hồ sơ rõ hơn và ít phải bổ sung nhiều lần có thể hỗ trợ tiến độ xử lý và việc hoạch định dòng tiền."
            }
          ]
        }
      },
      {
        "slug": "fdi-tax-procedures",
        "related": [
          "transfer-pricing",
          "tax-risk-review",
          "ma-tax-advisory"
        ],
        "en": {
          "title": "FDI tax and procedure advisory | Crown Tax",
          "description": "Crown Tax advises FDI projects on tax procedures and obligations, from incorporation and incentives through filing, operations and recurring compliance.",
          "h1": "Tax and procedural advisory for FDI projects",
          "kicker": "Crown Tax",
          "lead": "Advise FDI projects on tax procedures and obligations from incorporation and incentive identification to filing, operations and recurring compliance.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service advises FDI projects on tax procedures and obligations from incorporation and incentive identification through filing, operations and recurring compliance."
            },
            {
              "h2": "Value delivered",
              "p": "The work helps identify applicable incentives, prepare supported records and establish compliance processes from the project’s outset."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When can Crown support an FDI project?",
              "a": "From incorporation and identification of incentives through ongoing filing and recurring compliance, within the agreed scope."
            },
            {
              "q": "What is the intended outcome?",
              "a": "Applicable incentives identified where relevant, supported records, and compliance processes set up from the outset."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn thuế và thủ tục FDI | Crown Tax",
          "description": "Crown Tax tư vấn thủ tục và nghĩa vụ thuế cho dự án FDI, từ thành lập và xác định ưu đãi đến kê khai, vận hành và tuân thủ định kỳ. Liên hệ Crown để trao.",
          "h1": "Tư vấn thuế và thủ tục cho dự án FDI",
          "kicker": "Crown Tax",
          "lead": "Tư vấn thủ tục và nghĩa vụ thuế cho dự án FDI từ thành lập, xác định ưu đãi đến kê khai, vận hành và tuân thủ định kỳ.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ tư vấn thủ tục và nghĩa vụ thuế cho dự án FDI từ khi thành lập, xác định ưu đãi đến kê khai, vận hành và tuân thủ định kỳ."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp xác định ưu đãi áp dụng (nếu có), chuẩn bị hồ sơ có căn cứ và thiết lập quy trình tuân thủ ngay từ đầu dự án."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Crown có thể hỗ trợ dự án FDI khi nào?",
              "a": "Từ giai đoạn thành lập và xác định ưu đãi đến kê khai thường xuyên và tuân thủ định kỳ, trong phạm vi đã thống nhất."
            },
            {
              "q": "Kết quả hướng tới điều gì?",
              "a": "Xác định ưu đãi áp dụng khi có cơ sở, hồ sơ được hỗ trợ và quy trình tuân thủ được thiết lập từ đầu dự án."
            }
          ]
        }
      }
    ]
  },
  "cons": {
    "folder": "cons",
    "brandEn": "Crown Construction",
    "brandVi": "Crown Construction",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "budget-risk-control",
        "related": [
          "settlement-audit",
          "stalled-project-legal"
        ],
        "en": {
          "title": "Budget risk control | Crown Construction",
          "description": "Crown Construction reviews quantities, norms and budget assumptions, and compares design records with site conditions to support cost control before.",
          "h1": "Budget risk control and prevention of public fund losses",
          "kicker": "Crown Construction",
          "lead": "Review quantities, norms and budget assumptions; compare design records with site conditions within scope, supporting cost control before each disbursement.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Before and during construction, the work reviews quantities, norms and budget assumptions, and compares design records with site conditions within scope, supporting cost control before each disbursement."
            },
            {
              "h2": "Value delivered",
              "p": "The review helps identify unsupported costs or quantities, strengthen public investors’ explanations and support private investors’ payment controls."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When is this work performed?",
              "a": "Before and during construction, to support cost control before disbursements, within the agreed scope."
            },
            {
              "q": "Who is it for?",
              "a": "Public investors that need budget control and private investors that need tighter payment and quantity control."
            }
          ]
        },
        "vi": {
          "title": "Kiểm soát rủi ro dự toán | Crown Construction",
          "description": "Crown Construction rà soát khối lượng, định mức và giả định dự toán, đối chiếu hồ sơ thiết kế với hiện trường để hỗ trợ kiểm soát chi phí trước khi giải.",
          "h1": "Kiểm soát rủi ro dự toán và phòng ngừa thất thoát ngân sách",
          "kicker": "Crown Construction",
          "lead": "Rà soát khối lượng, định mức và giả định dự toán; đối chiếu hồ sơ thiết kế với điều kiện thi công trong phạm vi công việc, hỗ trợ kiểm soát chi phí trước từng đợt giải ngân.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Trước và trong thi công, công việc rà soát khối lượng, định mức và giả định dự toán, đối chiếu hồ sơ thiết kế với điều kiện hiện trường trong phạm vi thống nhất, hỗ trợ kiểm soát chi phí trước từng đợt giải ngân."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Việc rà soát giúp nhận diện chi phí hoặc khối lượng chưa có căn cứ, tăng cường giải trình của chủ đầu tư nhà nước và kiểm soát thanh toán của chủ đầu tư tư nhân."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Công việc được thực hiện khi nào?",
              "a": "Trước và trong quá trình thi công, nhằm hỗ trợ kiểm soát chi phí trước các đợt giải ngân, trong phạm vi đã thống nhất."
            },
            {
              "q": "Dịch vụ dành cho đối tượng nào?",
              "a": "Chủ đầu tư nhà nước cần kiểm soát dự toán và chủ đầu tư tư nhân cần kiểm soát khối lượng và thanh toán chặt hơn."
            }
          ]
        }
      },
      {
        "slug": "settlement-audit",
        "related": [
          "budget-risk-control",
          "stalled-project-legal"
        ],
        "en": {
          "title": "Settlement audit and inspection | Crown Construction",
          "description": "Crown Construction audits investment settlement, quantities, costs and records, and identifies items that need more evidence, adjustment or explanation.",
          "h1": "Settlement audit and inspection preparedness",
          "kicker": "Crown Construction",
          "lead": "Audit investment settlement, quantities, costs and supporting records; identify items needing additional evidence, adjustment or explanation.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "At completion, the work audits investment settlement, quantities, costs and supporting records, and identifies items that need additional evidence, adjustment or explanation."
            },
            {
              "h2": "Value delivered",
              "p": "This clarifies settlement grounds and outstanding issues so investors can prepare for inspection, supervision or audit."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is reviewed in a settlement audit?",
              "a": "Investment settlement, quantities, costs and supporting records, to identify items needing evidence, adjustment or explanation."
            },
            {
              "q": "How does this help with inspections?",
              "a": "Clearer settlement grounds and a list of outstanding issues help the investor prepare for inspection, supervision or audit."
            }
          ]
        },
        "vi": {
          "title": "Kiểm toán quyết toán và thanh tra | Crown Construction",
          "description": "Crown Construction kiểm toán quyết toán vốn đầu tư, khối lượng, chi phí và hồ sơ, đồng thời nhận diện hạng mục cần bổ sung căn cứ, điều chỉnh hoặc giải.",
          "h1": "Kiểm toán quyết toán và chuẩn bị thanh tra",
          "kicker": "Crown Construction",
          "lead": "Kiểm toán quyết toán vốn đầu tư, khối lượng, chi phí và hồ sơ hỗ trợ; nhận diện hạng mục cần bổ sung căn cứ, điều chỉnh hoặc giải trình.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Ở giai đoạn hoàn thành, công việc kiểm toán quyết toán vốn đầu tư, khối lượng, chi phí và hồ sơ hỗ trợ, đồng thời nhận diện các hạng mục cần bổ sung căn cứ, điều chỉnh hoặc giải trình."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Chủ đầu tư làm rõ căn cứ quyết toán và các vấn đề còn tồn tại để chuẩn bị cho thanh tra, giám sát hoặc kiểm toán."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Kiểm toán quyết toán rà soát những gì?",
              "a": "Quyết toán vốn đầu tư, khối lượng, chi phí và hồ sơ hỗ trợ, để nhận diện hạng mục cần căn cứ, điều chỉnh hoặc giải trình."
            },
            {
              "q": "Việc này hỗ trợ thanh tra như thế nào?",
              "a": "Căn cứ quyết toán rõ hơn và danh mục vấn đề còn tồn tại giúp chủ đầu tư chuẩn bị cho thanh tra, giám sát hoặc kiểm toán."
            }
          ]
        }
      },
      {
        "slug": "stalled-project-legal",
        "related": [
          "settlement-audit",
          "budget-risk-control"
        ],
        "en": {
          "title": "Stalled project legal issues | Crown Construction",
          "description": "Crown Construction reviews projects stalled by policy changes, missing records or acceptance disputes, identifies gaps and coordinates solutions with.",
          "h1": "Resolving legal bottlenecks in stalled projects",
          "kicker": "Crown Construction",
          "lead": "Review projects stalled by policy changes, missing records or acceptance disputes; identify gaps and coordinate solutions with stakeholders.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "This special service reviews projects stalled by policy changes, missing records or acceptance disputes, identifies gaps and coordinates solutions with the relevant stakeholders."
            },
            {
              "h2": "Value delivered",
              "p": "The aim is to gradually complete substantiated records, resolve issues and prepare subsequent settlement, disbursement and funding steps."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What kinds of stalling issues are reviewed?",
              "a": "Issues such as policy changes, missing records or acceptance disputes, as they appear in the project under review."
            },
            {
              "q": "What is the intended next step?",
              "a": "Completing substantiated records, resolving outstanding issues and preparing later settlement, disbursement or funding steps."
            }
          ]
        },
        "vi": {
          "title": "Tháo gỡ dự án treo | Crown Construction",
          "description": "Crown Construction rà soát dự án bị dừng do thay đổi chính sách, thiếu hồ sơ hoặc tranh chấp nghiệm thu, nhận diện khoảng trống và phối hợp phương án xử.",
          "h1": "Tháo gỡ vướng mắc pháp lý cho dự án treo",
          "kicker": "Crown Construction",
          "lead": "Rà soát dự án bị dừng do thay đổi chính sách, thiếu hồ sơ hoặc tranh chấp nghiệm thu; nhận diện khoảng trống và phối hợp phương án với các bên liên quan.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ chuyên biệt này rà soát các dự án bị dừng do thay đổi chính sách, thiếu hồ sơ hoặc tranh chấp nghiệm thu, nhận diện khoảng trống và phối hợp phương án với các bên liên quan."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Mục tiêu là từng bước hoàn thiện hồ sơ có căn cứ, xử lý vướng mắc và chuẩn bị các bước quyết toán, giải ngân và bố trí vốn tiếp theo."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những vướng mắc nào thường được rà soát?",
              "a": "Các vấn đề như thay đổi chính sách, thiếu hồ sơ hoặc tranh chấp nghiệm thu, như thực tế của dự án đang được xem xét."
            },
            {
              "q": "Bước tiếp theo hướng tới điều gì?",
              "a": "Hoàn thiện hồ sơ có căn cứ, xử lý vấn đề còn tồn tại và chuẩn bị các bước quyết toán, giải ngân hoặc bố trí vốn."
            }
          ]
        }
      }
    ]
  },
  "fas": {
    "folder": "fas",
    "brandEn": "Crown FAS",
    "brandVi": "Crown FAS",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "financial-planning-funding",
        "related": [
          "virtual-cfo",
          "financial-restructuring",
          "business-valuation"
        ],
        "en": {
          "title": "Financial planning and funding access | Crown FAS",
          "description": "Crown FAS turns business plans into funding proposals, clarifying needs, cash flow and repayment capacity, and prepares records for banks and financiers.",
          "h1": "Financial planning and funding access",
          "kicker": "Crown FAS",
          "lead": "Translate business plans into financial proposals, clarify funding needs, cash flow and repayment capacity, and prepare records suited to banks and financial institutions.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work translates business plans into financial proposals, clarifies funding needs, cash flow and repayment capacity, and prepares records suited to banks and financial institutions."
            },
            {
              "h2": "Value delivered",
              "p": "Businesses can build a clear funding plan and documentation to engage financiers and assess financing costs and terms."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does a funding proposal typically include?",
              "a": "A translation of the business plan into financial terms, including funding needs, cash flow and repayment capacity, plus records suited to financiers."
            },
            {
              "q": "Who is this for?",
              "a": "Businesses that need a clear funding plan and documentation before discussions with banks or other financial institutions."
            }
          ]
        },
        "vi": {
          "title": "Phương án tài chính và tiếp cận vốn | Crown FAS",
          "description": "Crown FAS chuyển kế hoạch kinh doanh thành phương án vốn, làm rõ nhu cầu, dòng tiền và khả năng trả nợ, đồng thời chuẩn bị hồ sơ cho tổ chức tài chính.",
          "h1": "Lập phương án tài chính và tiếp cận nguồn vốn",
          "kicker": "Crown FAS",
          "lead": "Chuyển kế hoạch kinh doanh thành phương án tài chính, làm rõ nhu cầu vốn, dòng tiền và khả năng trả nợ, đồng thời chuẩn bị hồ sơ phù hợp với ngân hàng và tổ chức tài chính.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc chuyển kế hoạch kinh doanh thành phương án tài chính, làm rõ nhu cầu vốn, dòng tiền và khả năng trả nợ, và chuẩn bị hồ sơ phù hợp với ngân hàng cùng tổ chức tài chính."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp có phương án và hồ sơ rõ ràng để làm việc với bên cấp vốn và đánh giá chi phí, điều kiện tài trợ."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Phương án vốn thường gồm những gì?",
              "a": "Việc chuyển kế hoạch kinh doanh sang ngôn ngữ tài chính, gồm nhu cầu vốn, dòng tiền và khả năng trả nợ, kèm hồ sơ phù hợp với bên cấp vốn."
            },
            {
              "q": "Dịch vụ dành cho đối tượng nào?",
              "a": "Doanh nghiệp cần phương án và hồ sơ rõ ràng trước khi làm việc với ngân hàng hoặc tổ chức tài chính khác."
            }
          ]
        }
      },
      {
        "slug": "virtual-cfo",
        "related": [
          "financial-planning-funding",
          "financial-restructuring",
          "ma-advisory"
        ],
        "en": {
          "title": "Virtual CFO | Crown FAS",
          "description": "Crown FAS advises boards and management on financial strategy, capital allocation, cash forecasts and lender or investor engagement as a Virtual CFO.",
          "h1": "Outsourced Chief Financial Officer (Virtual CFO)",
          "kicker": "Crown FAS",
          "lead": "Advise boards and management on financial strategy, capital allocation, cash forecasts and lender or investor engagement, alongside daily accounting operations.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "A Virtual CFO advises boards and management on financial strategy, capital allocation, cash forecasts and engagement with lenders or investors, focusing on strategic decisions alongside daily accounting operations."
            },
            {
              "h2": "Value delivered",
              "p": "The business adds senior financial advisory capacity as needed so leaders can assess capital decisions before acting."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "How does a Virtual CFO differ from bookkeeping?",
              "a": "The role focuses on financial strategy, capital allocation, cash forecasts and engagement with lenders or investors, alongside daily accounting operations."
            },
            {
              "q": "When is this useful?",
              "a": "When leadership needs senior financial advisory capacity without building a full-time CFO function immediately."
            }
          ]
        },
        "vi": {
          "title": "Giám đốc tài chính thuê ngoài | Crown FAS",
          "description": "Crown FAS tư vấn HĐQT và ban lãnh đạo về chiến lược tài chính, phân bổ vốn, dự báo dòng tiền và làm việc với bên cho vay hoặc nhà đầu tư, ở vai trò.",
          "h1": "Giám đốc tài chính thuê ngoài (Virtual CFO)",
          "kicker": "Crown FAS",
          "lead": "Tư vấn hội đồng quản trị và ban lãnh đạo về chiến lược tài chính, phân bổ vốn, dự báo dòng tiền và làm việc với bên cho vay hoặc nhà đầu tư, song song với công tác kế toán hàng ngày.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Virtual CFO tư vấn hội đồng quản trị và ban lãnh đạo về chiến lược tài chính, phân bổ vốn, dự báo dòng tiền và việc làm việc với bên cho vay hoặc nhà đầu tư, tập trung vào quyết định chiến lược bên cạnh công tác kế toán hàng ngày."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp bổ sung năng lực tư vấn tài chính cấp cao khi cần, để lãnh đạo đánh giá quyết định về vốn trước khi triển khai."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Virtual CFO khác công việc ghi sổ như thế nào?",
              "a": "Vai trò tập trung vào chiến lược tài chính, phân bổ vốn, dự báo dòng tiền và làm việc với bên cho vay hoặc nhà đầu tư, bên cạnh kế toán hàng ngày."
            },
            {
              "q": "Khi nào nên sử dụng dịch vụ này?",
              "a": "Khi lãnh đạo cần năng lực tư vấn tài chính cấp cao mà chưa xây dựng ngay chức năng CFO toàn thời gian."
            }
          ]
        }
      },
      {
        "slug": "financial-restructuring",
        "related": [
          "financial-planning-funding",
          "virtual-cfo",
          "financial-due-diligence"
        ],
        "en": {
          "title": "Financial restructuring and cash flow | Crown FAS",
          "description": "Crown FAS reviews assets, liabilities and performance, plans debt maturities, addresses underperforming activities and restores capital management.",
          "h1": "Financial restructuring and cash flow optimization",
          "kicker": "Crown FAS",
          "lead": "Review assets, liabilities and business performance; plan debt maturities, address underperforming activities and restore capital management discipline.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work reviews assets, liabilities and business performance, plans debt maturities, addresses underperforming activities and helps restore capital management discipline."
            },
            {
              "h2": "Value delivered",
              "p": "This clarifies restructuring priorities, eases cash flow pressure and strengthens the ability to meet financial obligations."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is reviewed?",
              "a": "Assets, liabilities and business performance, including debt maturities and activities that are not performing as needed."
            },
            {
              "q": "What is the intended outcome?",
              "a": "Clearer restructuring priorities, less cash-flow pressure and a stronger ability to meet financial obligations."
            }
          ]
        },
        "vi": {
          "title": "Tái cấu trúc tài chính và dòng tiền | Crown FAS",
          "description": "Crown FAS rà soát tài sản, nợ phải trả và kết quả kinh doanh, sắp xếp kỳ hạn nợ, xử lý hoạt động kém hiệu quả và khôi phục kỷ luật quản trị vốn.",
          "h1": "Tái cấu trúc tài chính và tối ưu dòng tiền",
          "kicker": "Crown FAS",
          "lead": "Rà soát tài sản, nợ phải trả và kết quả kinh doanh; sắp xếp kỳ hạn nợ, xử lý hoạt động kém hiệu quả và khôi phục kỷ luật quản trị vốn.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc rà soát tài sản, nợ phải trả và kết quả kinh doanh, sắp xếp kỳ hạn nợ, xử lý các hoạt động kém hiệu quả và hỗ trợ khôi phục kỷ luật quản trị vốn."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp làm rõ thứ tự ưu tiên tái cấu trúc, giảm áp lực dòng tiền và tăng khả năng đáp ứng nghĩa vụ tài chính."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những nội dung nào được rà soát?",
              "a": "Tài sản, nợ phải trả và kết quả kinh doanh, gồm kỳ hạn nợ và các hoạt động chưa đạt yêu cầu."
            },
            {
              "q": "Kết quả hướng tới điều gì?",
              "a": "Thứ tự ưu tiên tái cấu trúc rõ hơn, áp lực dòng tiền giảm và khả năng đáp ứng nghĩa vụ tài chính được củng cố."
            }
          ]
        }
      },
      {
        "slug": "financial-due-diligence",
        "related": [
          "business-valuation",
          "ma-advisory",
          "financial-restructuring"
        ],
        "en": {
          "title": "Financial due diligence (FDD) | Crown FAS",
          "description": "Crown FAS analyzes financial statements and data to assess earnings quality, debts, costs and potential obligations before an M&A transaction.",
          "h1": "Financial due diligence and risk analysis (FDD)",
          "kicker": "Crown FAS",
          "lead": "Analyze financial statements and data to assess earnings quality, debts, costs and potential obligations before an M&A transaction.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Financial due diligence analyzes financial statements and data to assess earnings quality, debts, costs and potential obligations before an M&A transaction."
            },
            {
              "h2": "Value delivered",
              "p": "The findings provide a basis for risk assessment, identify matters needing clarification and support negotiation of price and transaction terms."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "When is FDD typically performed?",
              "a": "Before an M&A transaction, so earnings quality, debts, costs and potential obligations can be assessed in time."
            },
            {
              "q": "How are the findings used?",
              "a": "They support risk assessment, highlight matters needing clarification and inform price and term negotiations."
            }
          ]
        },
        "vi": {
          "title": "Thẩm định tài chính (FDD) | Crown FAS",
          "description": "Crown FAS phân tích báo cáo tài chính và dữ liệu để đánh giá chất lượng lợi nhuận, nợ, chi phí và nghĩa vụ tiềm ẩn trước giao dịch M&A. Liên hệ Crown để.",
          "h1": "Thẩm định tài chính và phân tích rủi ro (FDD)",
          "kicker": "Crown FAS",
          "lead": "Phân tích báo cáo tài chính và dữ liệu để đánh giá chất lượng lợi nhuận, nợ, chi phí và nghĩa vụ tiềm ẩn trước giao dịch M&A.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Thẩm định tài chính phân tích báo cáo và dữ liệu để đánh giá chất lượng lợi nhuận, nợ, chi phí và nghĩa vụ tiềm ẩn trước giao dịch M&A."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Kết quả tạo cơ sở đánh giá rủi ro, nhận diện vấn đề cần làm rõ và hỗ trợ đàm phán giá cùng điều kiện giao dịch."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "FDD thường được thực hiện khi nào?",
              "a": "Trước giao dịch M&A, để đánh giá kịp thời chất lượng lợi nhuận, nợ, chi phí và nghĩa vụ tiềm ẩn."
            },
            {
              "q": "Kết quả được sử dụng như thế nào?",
              "a": "Hỗ trợ đánh giá rủi ro, nêu rõ các vấn đề cần làm rõ và phục vụ đàm phán giá cũng như điều kiện giao dịch."
            }
          ]
        }
      },
      {
        "slug": "business-valuation",
        "related": [
          "financial-due-diligence",
          "ma-advisory",
          "financial-planning-funding"
        ],
        "en": {
          "title": "Business valuation and deal structuring | Crown FAS",
          "description": "Crown FAS applies appropriate valuation methods and advises on payment structures, taking transaction cash flows and tax costs into account.",
          "h1": "Business valuation and deal structuring",
          "kicker": "Crown FAS",
          "lead": "Apply appropriate valuation methods and advise on payment structures, considering transaction cash flows and tax costs.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service applies appropriate valuation methods and advises on payment structures, considering transaction cash flows and tax costs."
            },
            {
              "h2": "Value delivered",
              "p": "This establishes a basis for price negotiations and for comparing transaction options, reducing unsupported acquisition or disposal decisions."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does valuation advice consider?",
              "a": "Appropriate valuation methods, payment structures, transaction cash flows and tax costs, within the agreed scope."
            },
            {
              "q": "How does this support a deal?",
              "a": "It provides a basis for price negotiations and for comparing transaction options before an acquisition or disposal."
            }
          ]
        },
        "vi": {
          "title": "Định giá doanh nghiệp và cấu trúc deal | Crown FAS",
          "description": "Crown FAS áp dụng phương pháp định giá phù hợp và tư vấn cấu trúc thanh toán, có xét đến dòng tiền của giao dịch và chi phí thuế liên quan. Liên hệ Crown.",
          "h1": "Định giá doanh nghiệp và cấu trúc giao dịch",
          "kicker": "Crown FAS",
          "lead": "Áp dụng phương pháp định giá phù hợp và tư vấn cấu trúc thanh toán, có xét đến dòng tiền giao dịch và chi phí thuế.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ áp dụng phương pháp định giá phù hợp và tư vấn cấu trúc thanh toán, có xét đến dòng tiền giao dịch và chi phí thuế."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp có cơ sở để đàm phán giá và so sánh các phương án giao dịch, hạn chế quyết định mua hoặc bán thiếu căn cứ."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Tư vấn định giá xem xét những yếu tố nào?",
              "a": "Phương pháp định giá phù hợp, cấu trúc thanh toán, dòng tiền giao dịch và chi phí thuế, trong phạm vi đã thống nhất."
            },
            {
              "q": "Việc này hỗ trợ giao dịch như thế nào?",
              "a": "Tạo cơ sở đàm phán giá và so sánh các phương án trước khi thực hiện mua hoặc bán."
            }
          ]
        }
      },
      {
        "slug": "ma-advisory",
        "related": [
          "financial-due-diligence",
          "business-valuation",
          "virtual-cfo"
        ],
        "en": {
          "title": "Strategic M&A advisory | Crown FAS",
          "description": "Crown FAS coordinates deals from documentation and confidentiality to negotiation and closing, and works with Crown Tax on tax structures through one.",
          "h1": "Strategic M&A advisory",
          "kicker": "Crown FAS",
          "lead": "Coordinate deals from documentation and confidentiality to negotiation and closing; Crown FAS works with Crown Tax on tax structures through one contact point.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Strategic M&A advisory coordinates deals from documentation and confidentiality through negotiation and closing. Crown FAS works with Crown Tax on tax structures through one contact point."
            },
            {
              "h2": "Value delivered",
              "p": "This maintains coordination among parties, supports timeline management and helps protect business interests throughout the transaction."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What stages can Crown FAS support?",
              "a": "From documentation and confidentiality arrangements through negotiation and closing, within the agreed scope."
            },
            {
              "q": "How does tax advice fit in?",
              "a": "Crown FAS works with Crown Tax on tax structures, so the business has one contact point during the transaction."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn chiến lược M&A | Crown FAS",
          "description": "Crown FAS điều phối giao dịch từ hồ sơ và bảo mật đến đàm phán, hoàn tất, đồng thời phối hợp Crown Tax về cấu trúc thuế qua một đầu mối. Liên hệ Crown để.",
          "h1": "Tư vấn chiến lược M&A",
          "kicker": "Crown FAS",
          "lead": "Điều phối giao dịch từ hồ sơ, bảo mật đến đàm phán và hoàn tất; Crown FAS phối hợp với Crown Tax về cấu trúc thuế qua một đầu mối liên hệ.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Tư vấn chiến lược M&A điều phối giao dịch từ hồ sơ và bảo mật đến đàm phán và hoàn tất. Crown FAS phối hợp với Crown Tax về cấu trúc thuế qua một đầu mối liên hệ."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Các bên được điều phối thống nhất, tiến độ được hỗ trợ và lợi ích của doanh nghiệp được bảo vệ xuyên suốt giao dịch."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Crown FAS có thể hỗ trợ những giai đoạn nào?",
              "a": "Từ hồ sơ và thỏa thuận bảo mật đến đàm phán và hoàn tất, trong phạm vi đã thống nhất."
            },
            {
              "q": "Tư vấn thuế được phối hợp như thế nào?",
              "a": "Crown FAS làm việc với Crown Tax về cấu trúc thuế, để doanh nghiệp có một đầu mối trong giao dịch."
            }
          ]
        }
      }
    ]
  },
  "esg": {
    "folder": "esg",
    "brandEn": "Crown ESG",
    "brandVi": "Crown ESG",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "esg-strategy",
        "related": [
          "sustainability-reporting",
          "ghg-inventory",
          "green-factory"
        ],
        "en": {
          "title": "ESG strategy and sustainability roadmaps | Crown ESG",
          "description": "Crown ESG assesses current practices, identifies material issues and develops an ESG roadmap suited to the business’s industry and size in Vietnam.",
          "h1": "ESG strategy advisory and sustainability roadmaps",
          "kicker": "Crown ESG",
          "lead": "Assess current practices, identify material issues and develop an ESG roadmap suited to your industry and business size.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work assesses current practices, identifies material issues and develops an ESG roadmap suited to the industry and size of the business."
            },
            {
              "h2": "Value delivered",
              "p": "The business gets a clear roadmap and priorities, which helps avoid unfocused investment."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does the roadmap start from?",
              "a": "An assessment of current practices and material issues, then a roadmap suited to the industry and size of the business."
            },
            {
              "q": "What is the intended outcome?",
              "a": "A clear set of priorities and a roadmap, so ESG effort is not spread too thinly."
            }
          ]
        },
        "vi": {
          "title": "Chiến lược ESG và lộ trình bền vững | Crown ESG",
          "description": "Crown ESG đánh giá thực tiễn hiện tại, xác định vấn đề trọng yếu và xây dựng lộ trình ESG phù hợp ngành nghề cũng như quy mô doanh nghiệp tại Việt Nam.",
          "h1": "Tư vấn chiến lược ESG và lộ trình phát triển bền vững",
          "kicker": "Crown ESG",
          "lead": "Đánh giá thực tiễn hiện tại, xác định vấn đề trọng yếu và xây dựng lộ trình ESG phù hợp ngành nghề và quy mô doanh nghiệp.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc đánh giá thực tiễn hiện tại, xác định các vấn đề trọng yếu và xây dựng lộ trình ESG phù hợp với ngành nghề và quy mô doanh nghiệp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp có lộ trình và thứ tự ưu tiên rõ ràng, tránh đầu tư dàn trải."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Lộ trình được xây dựng từ đâu?",
              "a": "Từ đánh giá thực tiễn hiện tại và các vấn đề trọng yếu, sau đó lập lộ trình phù hợp ngành nghề và quy mô doanh nghiệp."
            },
            {
              "q": "Kết quả hướng tới điều gì?",
              "a": "Một bộ ưu tiên và lộ trình rõ ràng, để nỗ lực ESG không bị dàn trải."
            }
          ]
        }
      },
      {
        "slug": "sustainability-reporting",
        "related": [
          "sustainability-assurance",
          "esg-strategy",
          "ghg-inventory"
        ],
        "en": {
          "title": "Sustainability reporting (GRI, TCFD, ISSB) | Crown ESG",
          "description": "Crown ESG develops sustainability reports under GRI, TCFD and ISSB to support disclosures and meet partner and investor requirements in Vietnam.",
          "h1": "Sustainability reporting to international standards",
          "kicker": "Crown ESG",
          "lead": "Develop reports under GRI, TCFD and ISSB to support disclosures and meet partner requirements.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service develops sustainability reports under GRI, TCFD and ISSB to support disclosures and meet partner requirements."
            },
            {
              "h2": "Value delivered",
              "p": "Transparent information helps the business respond to partner and investor expectations."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Which reporting frameworks are used?",
              "a": "Reports can be developed under GRI, TCFD and ISSB, as agreed for the engagement."
            },
            {
              "q": "Who typically uses the report?",
              "a": "Partners and investors that request transparent sustainability information, as well as the company’s own disclosure needs."
            }
          ]
        },
        "vi": {
          "title": "Báo cáo bền vững GRI, TCFD, ISSB | Crown ESG",
          "description": "Crown ESG xây dựng báo cáo phát triển bền vững theo GRI, TCFD và ISSB để phục vụ công bố thông tin và đáp ứng yêu cầu của đối tác, nhà đầu tư.",
          "h1": "Lập báo cáo phát triển bền vững theo chuẩn mực quốc tế",
          "kicker": "Crown ESG",
          "lead": "Xây dựng báo cáo theo GRI, TCFD và ISSB, phục vụ công bố thông tin và đáp ứng yêu cầu từ các đối tác.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ xây dựng báo cáo phát triển bền vững theo GRI, TCFD và ISSB, phục vụ công bố thông tin và đáp ứng yêu cầu từ đối tác."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Thông tin minh bạch giúp doanh nghiệp đáp ứng kỳ vọng của đối tác và nhà đầu tư."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Báo cáo được lập theo khung nào?",
              "a": "Báo cáo có thể được xây dựng theo GRI, TCFD và ISSB, như đã thống nhất cho hợp đồng dịch vụ."
            },
            {
              "q": "Ai thường sử dụng báo cáo?",
              "a": "Đối tác và nhà đầu tư có yêu cầu thông tin bền vững minh bạch, cũng như nhu cầu công bố thông tin của chính doanh nghiệp."
            }
          ]
        }
      },
      {
        "slug": "sustainability-assurance",
        "related": [
          "sustainability-reporting",
          "esg-strategy",
          "ghg-inventory"
        ],
        "en": {
          "title": "Independent sustainability assurance | Crown ESG",
          "description": "Crown ESG provides independent review and assurance of sustainability reports to strengthen the reliability of information presented to third parties.",
          "h1": "Independent review and assurance of sustainability reports",
          "kicker": "Crown ESG",
          "lead": "Independent ESG assurance strengthens the reliability and transparency of information presented to third parties.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Independent review and assurance of sustainability reports (ESG assurance) is intended to strengthen the reliability and transparency of information presented to third parties."
            },
            {
              "h2": "Value delivered",
              "p": "Greater reliability of reported information can support partner and investor confidence."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What is the purpose of ESG assurance?",
              "a": "To strengthen the reliability and transparency of sustainability information presented to third parties."
            },
            {
              "q": "How does this relate to report preparation?",
              "a": "Assurance is an independent review of a sustainability report. Crown also offers report preparation as a separate service."
            }
          ]
        },
        "vi": {
          "title": "Xác nhận độc lập báo cáo bền vững | Crown ESG",
          "description": "Crown ESG thực hiện đánh giá và xác nhận độc lập báo cáo phát triển bền vững nhằm tăng độ tin cậy của thông tin cung cấp cho bên thứ ba. Liên hệ Crown để.",
          "h1": "Đánh giá và xác nhận độc lập báo cáo phát triển bền vững",
          "kicker": "Crown ESG",
          "lead": "Xác nhận độc lập báo cáo ESG nhằm tăng độ tin cậy và minh bạch của thông tin trước bên thứ ba.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Đánh giá và xác nhận độc lập báo cáo phát triển bền vững (ESG assurance) nhằm tăng độ tin cậy và minh bạch của thông tin trình bày trước bên thứ ba."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Độ tin cậy cao hơn của thông tin đã báo cáo có thể củng cố niềm tin của đối tác và nhà đầu tư."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Mục đích của xác nhận ESG là gì?",
              "a": "Tăng độ tin cậy và minh bạch của thông tin phát triển bền vững trình bày trước bên thứ ba."
            },
            {
              "q": "Dịch vụ này khác lập báo cáo như thế nào?",
              "a": "Xác nhận là việc rà soát độc lập một báo cáo phát triển bền vững. Crown cũng cung cấp dịch vụ lập báo cáo riêng."
            }
          ]
        }
      },
      {
        "slug": "ghg-inventory",
        "related": [
          "esg-strategy",
          "cbam-compliance",
          "green-factory"
        ],
        "en": {
          "title": "GHG inventories and Net Zero roadmaps | Crown ESG",
          "description": "Crown ESG measures and inventories greenhouse gases under ISO 14064 and develops an emissions reduction roadmap toward Net Zero for the business.",
          "h1": "Greenhouse gas inventories and emissions reduction roadmaps",
          "kicker": "Crown ESG",
          "lead": "Measure and inventory greenhouse gases under ISO 14064 and develop an emissions reduction roadmap toward Net Zero.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service measures and inventories greenhouse gases under ISO 14064 and develops an emissions reduction roadmap toward Net Zero."
            },
            {
              "h2": "Value delivered",
              "p": "The business can prepare compliance and data before requests from partners or regulators."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Which standard is used for the inventory?",
              "a": "Greenhouse gas inventories are prepared under ISO 14064, as agreed for the engagement."
            },
            {
              "q": "What does the roadmap support?",
              "a": "An emissions reduction path toward Net Zero, and readiness of data before partners or regulators request it."
            }
          ]
        },
        "vi": {
          "title": "Kiểm kê khí nhà kính và Net Zero | Crown ESG",
          "description": "Crown ESG đo lường và kiểm kê khí nhà kính theo ISO 14064, đồng thời xây dựng lộ trình giảm phát thải hướng tới mục tiêu Net Zero cho doanh nghiệp.",
          "h1": "Kiểm kê khí nhà kính và lộ trình giảm phát thải",
          "kicker": "Crown ESG",
          "lead": "Đo lường, kiểm kê khí nhà kính theo ISO 14064 và xây dựng lộ trình giảm phát thải hướng tới mục tiêu Net Zero.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ đo lường, kiểm kê khí nhà kính theo ISO 14064 và xây dựng lộ trình giảm phát thải hướng tới mục tiêu Net Zero."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp chủ động có dữ liệu và phương án tuân thủ trước khi đối tác hoặc cơ quan quản lý yêu cầu."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Kiểm kê được thực hiện theo chuẩn nào?",
              "a": "Kiểm kê khí nhà kính được thực hiện theo ISO 14064, như đã thống nhất cho hợp đồng dịch vụ."
            },
            {
              "q": "Lộ trình hỗ trợ điều gì?",
              "a": "Đường hướng giảm phát thải tới Net Zero, và sự sẵn sàng của dữ liệu trước khi đối tác hoặc cơ quan quản lý yêu cầu."
            }
          ]
        }
      },
      {
        "slug": "cbam-compliance",
        "related": [
          "ghg-inventory",
          "esg-strategy",
          "sustainability-reporting"
        ],
        "en": {
          "title": "CBAM and supply chain ESG advisory | Crown ESG",
          "description": "Crown ESG supports emissions calculations, CBAM documentation and ESG requirements coming from international supply chains and export markets.",
          "h1": "CBAM compliance and supply chain ESG requirements",
          "kicker": "Crown ESG",
          "lead": "Support emissions calculations, CBAM documentation and ESG requirements from international supply chains.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The work supports emissions calculations, CBAM documentation and ESG requirements arising from international supply chains."
            },
            {
              "h2": "Value delivered",
              "p": "This helps protect orders and prepare for export-market ESG requirements."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What does CBAM support include?",
              "a": "Support with emissions calculations and CBAM documentation, together with related supply-chain ESG requirements, within the agreed scope."
            },
            {
              "q": "Who typically needs this advice?",
              "a": "Exporters and suppliers facing ESG or CBAM requirements from international customers or supply chains."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn tuân thủ CBAM và ESG chuỗi cung ứng | Crown ESG",
          "description": "Crown ESG hỗ trợ tính toán phát thải, lập hồ sơ CBAM và đáp ứng các yêu cầu ESG đến từ chuỗi cung ứng quốc tế cũng như thị trường xuất khẩu.",
          "h1": "Tuân thủ CBAM và yêu cầu ESG của chuỗi cung ứng",
          "kicker": "Crown ESG",
          "lead": "Hỗ trợ tính toán phát thải, chuẩn bị hồ sơ CBAM và đáp ứng yêu cầu ESG từ các chuỗi cung ứng quốc tế.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Công việc hỗ trợ tính toán phát thải, chuẩn bị hồ sơ CBAM và đáp ứng yêu cầu ESG phát sinh từ các chuỗi cung ứng quốc tế."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp bảo vệ đơn hàng và chủ động trước yêu cầu ESG của thị trường xuất khẩu."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Hỗ trợ CBAM gồm những gì?",
              "a": "Hỗ trợ tính toán phát thải và hồ sơ CBAM, cùng các yêu cầu ESG liên quan của chuỗi cung ứng, trong phạm vi đã thống nhất."
            },
            {
              "q": "Đối tượng nào thường cần tư vấn này?",
              "a": "Doanh nghiệp xuất khẩu và nhà cung cấp đang gặp yêu cầu ESG hoặc CBAM từ khách hàng hay chuỗi cung ứng quốc tế."
            }
          ]
        }
      },
      {
        "slug": "green-factory",
        "related": [
          "esg-strategy",
          "ghg-inventory",
          "cbam-compliance"
        ],
        "en": {
          "title": "Green factory advisory (LEED, EDGE, LOTUS) | Crown ESG",
          "description": "Crown ESG guides factory design and operations under LEED, EDGE and LOTUS, in line with the business’s green building goals in Vietnam. Contact Crown to.",
          "h1": "Green factory advisory to sustainable building standards",
          "kicker": "Crown ESG",
          "lead": "Guide factory design and operations under LEED, EDGE and LOTUS in line with business green building goals.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The service guides factory design and operations under LEED, EDGE and LOTUS, in line with the business’s green building goals."
            },
            {
              "h2": "Value delivered",
              "p": "This can strengthen brand image and support longer-term energy cost optimization."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Which standards can be considered?",
              "a": "Guidance can be aligned with LEED, EDGE and LOTUS, according to the business’s green building goals and the agreed scope."
            },
            {
              "q": "What does the advice cover?",
              "a": "Guidance on factory design and operations, so they can be aligned with the chosen sustainable building standard."
            }
          ]
        },
        "vi": {
          "title": "Tư vấn nhà máy xanh LEED, EDGE, LOTUS | Crown ESG",
          "description": "Crown ESG định hướng thiết kế và vận hành nhà máy theo LEED, EDGE và LOTUS, phù hợp mục tiêu công trình xanh của doanh nghiệp tại Việt Nam. Liên hệ Crown.",
          "h1": "Tư vấn nhà máy xanh theo chuẩn công trình bền vững",
          "kicker": "Crown ESG",
          "lead": "Định hướng thiết kế và vận hành nhà máy theo LEED, EDGE và LOTUS, phù hợp mục tiêu công trình xanh của doanh nghiệp.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Dịch vụ định hướng thiết kế và vận hành nhà máy theo LEED, EDGE và LOTUS, phù hợp mục tiêu công trình xanh của doanh nghiệp."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Doanh nghiệp có thể nâng cao hình ảnh thương hiệu và tối ưu chi phí năng lượng trong dài hạn."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Có thể tham chiếu những chuẩn nào?",
              "a": "Việc định hướng có thể bám LEED, EDGE và LOTUS, theo mục tiêu công trình xanh của doanh nghiệp và phạm vi đã thống nhất."
            },
            {
              "q": "Tư vấn gồm những nội dung nào?",
              "a": "Định hướng thiết kế và vận hành nhà máy để phù hợp với chuẩn công trình bền vững được lựa chọn."
            }
          ]
        }
      }
    ]
  },
  "up": {
    "folder": "up",
    "brandEn": "Crown Up",
    "brandVi": "Crown Up",
    "contactPath": "/#tuvan",
    "services": [
      {
        "slug": "three-systems",
        "related": [
          "four-stages",
          "capabilities",
          "who-it-is-for"
        ],
        "en": {
          "title": "Three specialist systems | Crown Up",
          "description": "Crown Up brings together Tam Doanh Group, Crown Audit & Advisory and Koru Capital in one program covering governance, finance, tax and capital strategy.",
          "h1": "Three specialist systems, one integrated program",
          "kicker": "Crown Up",
          "lead": "Crown Up is delivered by Tam Doanh Group, Crown Audit & Advisory and Koru Capital — one coordinated program rather than separate, disconnected workstreams.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Up is a business acceleration program in which Tam Doanh Group, Crown Audit & Advisory and Koru Capital work together. Tam Doanh builds management foundations. Crown strengthens financial standards and transparency, including audit, tax and financial advisory. Koru focuses on capital strategy and investment. All three contribute throughout the Crown Up journey."
            },
            {
              "h2": "Value delivered",
              "p": "A multi-disciplinary team sits down together to address the root of the business’s issues, instead of leaving governance, finance and capital work in separate silos."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Who delivers Crown Up?",
              "a": "Tam Doanh Group, Crown Audit & Advisory and Koru Capital work together in one coordinated program."
            },
            {
              "q": "How are the three roles described?",
              "a": "Tam Doanh builds management foundations; Crown strengthens financial standards and transparency; Koru focuses on capital strategy and investment."
            }
          ]
        },
        "vi": {
          "title": "Ba hệ thống chuyên môn | Crown Up",
          "description": "Crown Up quy tụ Tâm Doanh Group, Crown Audit & Advisory và Koru Capital trong một chương trình gồm quản trị, tài chính, thuế và chiến lược vốn.",
          "h1": "Ba hệ thống chuyên môn, một chương trình tích hợp",
          "kicker": "Crown Up",
          "lead": "Crown Up được triển khai bởi Tâm Doanh Group, Crown Audit & Advisory và Koru Capital — một chương trình phối hợp, không phải các công việc rời rạc.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Up là chương trình tăng tốc doanh nghiệp trong đó Tâm Doanh Group, Crown Audit & Advisory và Koru Capital làm việc cùng nhau. Tâm Doanh kiến tạo nền tảng quản trị. Crown nâng chuẩn tài chính và minh bạch, gồm kiểm toán, thuế và tư vấn tài chính. Koru tập trung chiến lược vốn và đầu tư. Cả ba cùng hiện diện trong hành trình Crown Up."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Một đội ngũ đa chuyên môn ngồi lại với nhau để xử lý đúng gốc rễ vấn đề của doanh nghiệp, thay vì để quản trị, tài chính và vốn vận hành tách rời."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Ai triển khai Crown Up?",
              "a": "Tâm Doanh Group, Crown Audit & Advisory và Koru Capital phối hợp trong một chương trình thống nhất."
            },
            {
              "q": "Ba vai trò được mô tả như thế nào?",
              "a": "Tâm Doanh kiến tạo nền tảng quản trị; Crown nâng chuẩn tài chính và minh bạch; Koru tập trung chiến lược vốn và đầu tư."
            }
          ]
        }
      },
      {
        "slug": "four-stages",
        "related": [
          "three-systems",
          "capabilities",
          "who-it-is-for"
        ],
        "en": {
          "title": "Four stages to investment-ready | Crown Up",
          "description": "Crown Up follows four stages, from diagnosis to investment readiness, so governance, finance and capital work move forward in a coordinated sequence.",
          "h1": "Four stages, from diagnosis to investment-ready",
          "kicker": "Crown Up",
          "lead": "Crown Up is structured in four stages, taking a business from diagnosis through to being ready to raise capital, with clear coordination at each step.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The program is organized in four stages, from diagnosis to investment-ready. The sequence is designed so that issues are identified first, then standards and systems are strengthened, before the business is prepared for capital discussions."
            },
            {
              "h2": "Value delivered",
              "p": "A staged path helps the business see where it stands, what needs to be improved and when it is ready to engage investors or financiers."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Where does the program start?",
              "a": "It starts with diagnosis, then proceeds through the remaining stages toward investment readiness."
            },
            {
              "q": "What is the end point of the four stages?",
              "a": "A business that is better prepared for capital discussions, after issues have been identified and standards strengthened."
            }
          ]
        },
        "vi": {
          "title": "Bốn chặng đến sẵn sàng gọi vốn | Crown Up",
          "description": "Crown Up diễn ra theo bốn chặng, từ chẩn đoán đến sẵn sàng gọi vốn, để quản trị, tài chính và chiến lược vốn được triển khai theo một trình tự thống nhất.",
          "h1": "Bốn chặng, từ chẩn đoán đến sẵn sàng gọi vốn",
          "kicker": "Crown Up",
          "lead": "Crown Up được tổ chức thành bốn chặng, đưa doanh nghiệp từ chẩn đoán đến trạng thái sẵn sàng gọi vốn, với sự phối hợp rõ ràng ở từng bước.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Chương trình được tổ chức thành bốn chặng, từ chẩn đoán đến sẵn sàng gọi vốn. Trình tự này nhằm xác định vấn đề trước, sau đó nâng chuẩn và hệ thống, rồi mới chuẩn bị cho các cuộc trao đổi về vốn."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Lộ trình theo chặng giúp doanh nghiệp thấy rõ mình đang ở đâu, việc nào cần cải thiện và khi nào đã sẵn sàng làm việc với nhà đầu tư hoặc bên cấp vốn."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Chương trình bắt đầu từ đâu?",
              "a": "Bắt đầu bằng chẩn đoán, sau đó đi tiếp các chặng còn lại hướng tới sự sẵn sàng gọi vốn."
            },
            {
              "q": "Điểm đến của bốn chặng là gì?",
              "a": "Một doanh nghiệp được chuẩn bị tốt hơn cho trao đổi về vốn, sau khi đã nhận diện vấn đề và nâng cao các chuẩn mực."
            }
          ]
        }
      },
      {
        "slug": "capabilities",
        "related": [
          "three-systems",
          "four-stages",
          "who-it-is-for"
        ],
        "en": {
          "title": "Capabilities for growth | Crown Up",
          "description": "Crown Up brings together strategy, governance, accounting, tax, capital readiness, sustainability, operations, digital systems and leadership to support.",
          "h1": "Capabilities that move a business from potential to scale",
          "kicker": "Crown Up",
          "lead": "Crown Up draws on capabilities in strategy, governance and compliance, accounting, tax and financial clarity, capital and investor readiness, sustainability, operations, digital systems and leadership.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "The program draws on a set of capabilities that help a business move from potential to scale: strategic direction; governance and compliance; accounting, tax and financial clarity; capital strategy and investor readiness; sustainability and long-term value; operational performance; digital systems and data management; and human capital and leadership."
            },
            {
              "h2": "Value delivered",
              "p": "These capabilities are applied together, so the business is not asked to raise its standard in one area while leaving related gaps unaddressed."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "Which capability areas are included?",
              "a": "Strategy, governance and compliance, accounting, tax and financial clarity, capital and investor readiness, sustainability, operations, digital systems and leadership."
            },
            {
              "q": "Why are they combined?",
              "a": "So the business can raise standards in related areas together, rather than improving only one function in isolation."
            }
          ]
        },
        "vi": {
          "title": "Năng lực tăng trưởng | Crown Up",
          "description": "Crown Up kết hợp chiến lược, quản trị, kế toán, thuế, sẵn sàng gọi vốn, bền vững, vận hành, hệ thống số và lãnh đạo để hỗ trợ doanh nghiệp lớn mạnh.",
          "h1": "Những năng lực đưa doanh nghiệp từ tiềm năng đến lớn mạnh",
          "kicker": "Crown Up",
          "lead": "Crown Up huy động các năng lực về chiến lược, quản trị và tuân thủ, kế toán, thuế và minh bạch tài chính, chiến lược vốn và sẵn sàng đầu tư, bền vững, vận hành, hệ thống số và lãnh đạo.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Chương trình huy động một nhóm năng lực giúp doanh nghiệp đi từ tiềm năng đến lớn mạnh: định hướng chiến lược; quản trị và tuân thủ; kế toán, thuế và minh bạch tài chính; chiến lược vốn và sẵn sàng đầu tư; bền vững và giá trị dài hạn; hiệu quả vận hành; hệ thống số và quản trị dữ liệu; nhân lực và năng lực lãnh đạo."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Các năng lực này được áp dụng cùng nhau, để doanh nghiệp không phải nâng chuẩn ở một mảng trong khi các khoảng trống liên quan vẫn còn."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Những nhóm năng lực nào được bao gồm?",
              "a": "Chiến lược, quản trị và tuân thủ, kế toán, thuế và minh bạch tài chính, chiến lược vốn và sẵn sàng đầu tư, bền vững, vận hành, hệ thống số và lãnh đạo."
            },
            {
              "q": "Vì sao chúng được kết hợp?",
              "a": "Để doanh nghiệp nâng chuẩn ở các mảng liên quan cùng lúc, thay vì chỉ cải thiện một chức năng đơn lẻ."
            }
          ]
        }
      },
      {
        "slug": "who-it-is-for",
        "related": [
          "three-systems",
          "four-stages",
          "capabilities"
        ],
        "en": {
          "title": "Who Crown Up is for | Crown Up",
          "description": "Crown Up is for businesses with real potential that are not yet at the standard needed to be seen, and that are ready to strengthen governance, finance.",
          "h1": "Businesses Crown Up is a fit for",
          "kicker": "Crown Up",
          "lead": "Crown Up is built for businesses that already have real potential but are not yet at the standard needed to be seen — and that are ready to break through.",
          "sections": [
            {
              "h2": "What this service covers",
              "p": "Crown Up is built for businesses that are ready to break through: they have real potential, but are not yet standard enough to be seen. Typical starting points include a governance system that still runs on instinct, finances that are not transparent enough, or a brand that has not caught up with the scale of the business."
            },
            {
              "h2": "Value delivered",
              "p": "The program is a fit when the business is prepared to work on foundations and standards — not only on a one-off transaction — with a multi-disciplinary team."
            },
            {
              "h2": "How we work",
              "p": "Crown discusses your needs, agrees the scope and timeline, performs the work and reports findings in line with the agreed engagement terms."
            }
          ],
          "faqs": [
            {
              "q": "What kind of business is Crown Up designed for?",
              "a": "Businesses with real potential that are not yet at the standard needed to be seen, and that are ready to break through."
            },
            {
              "q": "What issues often appear at the start?",
              "a": "Governance that still runs on instinct, finances that are not transparent enough, or a brand that has not caught up with the business’s scale."
            }
          ]
        },
        "vi": {
          "title": "Doanh nghiệp phù hợp với Crown Up | Crown Up",
          "description": "Crown Up dành cho doanh nghiệp có tiềm năng thật nhưng chưa đủ chuẩn để được nhìn thấy, và sẵn sàng củng cố quản trị, tài chính cũng như sự sẵn sàng về.",
          "h1": "Doanh nghiệp phù hợp với Crown Up",
          "kicker": "Crown Up",
          "lead": "Crown Up được thiết kế cho những doanh nghiệp đã có tiềm năng thật nhưng chưa đủ chuẩn để được nhìn thấy — và đã sẵn sàng bứt phá.",
          "sections": [
            {
              "h2": "Phạm vi dịch vụ",
              "p": "Crown Up được xây dựng cho những doanh nghiệp đã sẵn sàng bứt phá: có tiềm năng thật, nhưng chưa đủ chuẩn để được nhìn thấy. Điểm xuất phát thường gặp gồm hệ thống quản trị còn tùy hứng, tài chính chưa đủ minh bạch, hoặc thương hiệu chưa xứng tầm quy mô."
            },
            {
              "h2": "Giá trị mang lại",
              "p": "Chương trình phù hợp khi doanh nghiệp sẵn sàng làm việc với nền tảng và các chuẩn mực — không chỉ một giao dịch đơn lẻ — cùng một đội ngũ đa chuyên môn."
            },
            {
              "h2": "Cách chúng tôi làm việc",
              "p": "Crown trao đổi nhu cầu, thống nhất phạm vi và tiến độ, thực hiện công việc và báo cáo kết quả theo các điều khoản đã thống nhất."
            }
          ],
          "faqs": [
            {
              "q": "Crown Up hướng tới loại hình doanh nghiệp nào?",
              "a": "Doanh nghiệp có tiềm năng thật nhưng chưa đủ chuẩn để được nhìn thấy, và đã sẵn sàng bứt phá."
            },
            {
              "q": "Những vấn đề nào thường xuất hiện lúc bắt đầu?",
              "a": "Quản trị còn tùy hứng, tài chính chưa đủ minh bạch, hoặc thương hiệu chưa theo kịp quy mô doanh nghiệp."
            }
          ]
        }
      }
    ]
  }
};

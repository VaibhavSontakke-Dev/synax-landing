/**
 * Privacy Policy and Terms and Conditions, shown on /privacy and /terms.
 *
 * Source: the live portal's legal pages (https://synax.senwellgroup.com/privacy and /terms, effective 3 November 2026),
 * copied word for word on 17 November 2026. These are legal texts: change the wording only with the owner's approval,
 * and when the portal's version changes, update this file and `effective` together so both sites say the same thing.
 */

/** A paragraph, or a bulleted list. */
export type LegalBlock = string | { list: string[] };

export interface LegalSection {
  id: string;
  title: string;
  body: LegalBlock[];
}

export interface LegalDoc {
  slug: "privacy" | "terms";
  title: string;
  /** Short name for the switcher and links. */
  short: string;
  effective: string;
  /** ISO date of `effective`, for <time>. */
  effectiveIso: string;
  intro: string;
  summary: string[];
  sections: LegalSection[];
  metaDescription: string;
}

export const LEGAL_EMAIL = "info@senwellexports.com";
export const LEGAL_ENTITY = "Senwell Group Private Limited";
export const LEGAL_ADDRESS = "Pune, Maharashtra, India";

export const PRIVACY: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  short: "Privacy",
  effective: "3 November 2026",
  effectiveIso: "2026-11-03",
  intro:
    'This policy explains how Senwell Group Private Limited ("Senwell", "we") collects, uses and protects personal data through the Synax Pro website and platform, in line with the Digital Personal Data Protection Act, 2023.',
  summary: [
    "We do not sell personal data.",
    "For data your company puts into Synax Pro, your company decides how it is used, and we process it on their behalf.",
    "Application servers run on Google Cloud in Mumbai.",
    "AI features run only if your company admin turns them on.",
    "Questions or requests: info@senwellexports.com.",
  ],
  metaDescription:
    "How Senwell Group Private Limited collects, uses and protects personal data through the Synax Pro website and platform, under the Digital Personal Data Protection Act, 2023.",
  sections: [
    {
      id: "who-this-policy-covers",
      title: "Who this policy covers",
      body: [
        {
          list: [
            "Visitors to the Synax Pro website and people who contact us. For their data, Senwell is the Data Fiduciary.",
            "Users of a Synax Pro Workspace, for their account and security data. For this data, Senwell is the Data Fiduciary.",
            "People whose data a customer stores in Synax Pro, such as employees, customers and vendors. Here the customer is the Data Fiduciary, and Senwell processes the data only on the customer's instructions. Send requests about this data to the organisation concerned first.",
          ],
        },
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      body: [
        {
          list: [
            "Contact and demo requests: your name, company, work email, phone number and message.",
            "Account data: name, work email, role, company, sign-in times, and two-step verification enrolment.",
            "Security and device data: IP address (used for access controls and security logs), browser and device type, and push-notification tokens for devices you register.",
            "Website usage: pages visited and actions taken, collected through Google Analytics.",
            "Customer Data: business records, documents, chat and meeting records, machine data, and HR, attendance and payroll records that your organisation chooses to store in Synax.",
          ],
        },
      ],
    },
    {
      id: "how-we-use-it",
      title: "How we use it",
      body: [
        {
          list: [
            "To provide the Service, sign you in and keep your Workspace secure.",
            "To answer enquiries, arrange demos and provide support.",
            "To bill subscriptions and keep the records that tax law requires.",
            "To send service messages, such as security alerts and changes to terms.",
            "To understand, in aggregate, how the Service is used, so we can improve it.",
          ],
        },
        "We send marketing email only where you have agreed to it, and every message lets you unsubscribe.",
      ],
    },
    {
      id: "our-legal-basis",
      title: "Our legal basis",
      body: [
        "We process personal data with your consent, or for legitimate uses allowed under the Digital Personal Data Protection Act, 2023, such as providing a service you have asked for, meeting legal obligations, and keeping the Service secure. You may withdraw consent at any time. Doing so does not affect processing that has already taken place.",
      ],
    },
    {
      id: "synax-ai",
      title: "Synax AI",
      body: [
        "If your administrator turns on AI features, the records needed to answer a request are sent to the AI provider your administrator selects (Google Gemini or OpenRouter). Requests are logged for audit, and an answer may be cached for up to 24 hours so it can be shown again without a new request. Senwell does not use Customer Data to train its own models.",
      ],
    },
    {
      id: "who-we-share-it-with",
      title: "Who we share it with",
      body: [
        "We share personal data only with service providers that help us run Synax Pro, and only as far as each one needs:",
        {
          list: [
            "Google Cloud and Firebase: hosting, sign-in, database, file storage and push notifications.",
            "Google Analytics: website usage measurement.",
            "Google Gemini and OpenRouter: AI features, if your administrator turns them on.",
            "Microsoft 365, GST suvidha providers and other connectors: only those your organisation connects.",
          ],
        },
        "We may also disclose data when the law requires it, or to protect the rights and safety of our users or the public. We do not sell personal data.",
      ],
    },
    {
      id: "where-data-is-stored",
      title: "Where data is stored",
      body: [
        "Synax Pro runs on Google Cloud, and its application servers are in the Mumbai (asia-south1) region. Some service providers may process data outside India. Any such transfer is made only as the Digital Personal Data Protection Act, 2023 permits.",
      ],
    },
    {
      id: "how-long-we-keep-it",
      title: "How long we keep it",
      body: [
        {
          list: [
            "Account data: for as long as the Workspace is active.",
            "Chat messages: 6 months, after which they are deleted automatically.",
            "Contact requests: for as long as needed to respond and follow up.",
            "After a subscription ends: Customer Data is available for export for 30 days, then deleted from live systems within 90 days.",
            "Invoices and financial records: for the period that tax and company law require.",
          ],
        },
      ],
    },
    {
      id: "how-we-protect-it",
      title: "How we protect it",
      body: [
        "We protect personal data with an isolated Workspace for each customer, encryption in transit, role-based access control, two-step verification, IP access rules, server-side validation and audit history. No system is completely secure. If a breach affects your personal data, we will notify you and the Data Protection Board of India as the law requires.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "Subject to the law, you may:",
        {
          list: [
            "ask for a summary of the personal data we hold about you and how we use it;",
            "ask us to correct, complete, update or erase it;",
            "withdraw consent you have given;",
            "nominate a person to exercise these rights for you in case of death or incapacity;",
            "raise a grievance with us, and if we do not resolve it, complain to the Data Protection Board of India.",
          ],
        },
        "Email info@senwellexports.com to use these rights. We will verify your identity and respond within 30 days. If the data is held in a customer's Workspace, we will refer your request to that customer.",
      ],
    },
    {
      id: "cookies-and-local-storage",
      title: "Cookies and local storage",
      body: [
        "We use essential storage to keep you signed in and to remember preferences such as your theme. We use Google Analytics cookies to measure use of our public website. You can block cookies in your browser, but parts of the Service may then stop working.",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["Synax Pro is a business service and is not meant for anyone under 18. We do not knowingly collect personal data from children."],
    },
    {
      id: "changes-to-this-policy",
      title: "Changes to this policy",
      body: ["We will post updates on this page and change the effective date. If a change is material, we will also notify Workspace administrators."],
    },
    {
      id: "contact-and-grievances",
      title: "Contact and grievances",
      body: ["Senwell Group Private Limited, Pune, Maharashtra, India. Send privacy questions and grievances to info@senwellexports.com."],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms and Conditions",
  short: "Terms",
  effective: "3 November 2026",
  effectiveIso: "2026-11-03",
  intro:
    'These terms govern your organisation\'s use of Synax Pro, the ERP platform provided by Senwell Group Private Limited ("Senwell", "we", "us"). By creating a workspace, signing an order form or using Synax Pro, the organisation ("Customer", "you") agrees to them.',
  summary: [
    "Your data stays yours. We only use it to run Synax Pro for you.",
    "Synax Pro is free for SMEs with fewer than 50 employees. Larger teams pay per seat, plus GST.",
    "You remain responsible for your GST, ITC-04, payroll and other statutory filings.",
    "Synax AI is off until your admin turns it on, and its agents only propose. A person approves every action.",
    "You can export your data for 30 days after your subscription ends.",
  ],
  metaDescription:
    "The terms that govern your organisation's use of Synax Pro, the ERP platform provided by Senwell Group Private Limited: accounts, plans and fees, your data, Synax AI, acceptable use, liability and more.",
  sections: [
    {
      id: "about-these-terms",
      title: "About these terms",
      body: [
        "These terms are a binding agreement between Senwell and the Customer. The person accepting them confirms that they are authorised to bind the Customer.",
        "If you have signed an order form or subscription agreement with us, it forms part of these terms. Where the two conflict, the signed document applies.",
      ],
    },
    {
      id: "definitions",
      title: "Definitions",
      body: [
        {
          list: [
            '"Service" means the Synax Pro web and mobile applications, APIs, connectors and related support.',
            '"Workspace" means the Customer\'s isolated tenant in Synax Pro, which may hold one or more companies.',
            '"Users" means the people the Customer authorises to use its Workspace.',
            '"Customer Data" means any data that the Customer or its Users enter into, upload to or generate in the Service, including data from connected machines and integrations.',
            '"Subscription" means the plan, seats, add-ons and billing cycle recorded for the Customer.',
          ],
        },
      ],
    },
    {
      id: "accounts-and-access",
      title: "Accounts and access",
      body: [
        "Your administrators create Users, assign their roles and decide what each role may see and do. You are responsible for all activity under your Users' accounts.",
        {
          list: [
            "Keep sign-in credentials confidential and use two-step verification where it is available.",
            "Remove access promptly when a User leaves your organisation.",
            "Tell us at info@senwellexports.com without delay if you suspect unauthorised access.",
          ],
        },
      ],
    },
    {
      id: "plans-seats-and-fees",
      title: "Plans, seats and fees",
      body: [
        "Your Subscription sets out your plan, the number of seats, any add-ons and the billing cycle. Active Users cannot exceed the number of seats you have bought.",
        "The free plan is available to small and medium enterprises with fewer than 50 employees. We may ask for reasonable proof of eligibility and may move a Workspace that no longer qualifies to a paid plan after giving notice.",
        {
          list: [
            "Fees are exclusive of GST and other applicable taxes, which are added to the invoice.",
            "Invoices are payable within the period stated on them.",
            "Prices are fixed for your current Subscription term. A price change applies only from your next renewal, and we will tell you about it in advance.",
            "If an invoice remains unpaid after a reminder, we may suspend the Workspace until it is settled. Your data is not deleted during a suspension.",
          ],
        },
      ],
    },
    {
      id: "your-data",
      title: "Your data",
      body: [
        "You own your Customer Data. You give Senwell a limited right to host, copy, process and display it only as needed to provide, secure and support the Service for you.",
        "For personal data in Customer Data, such as employee, customer and vendor records, you are the Data Fiduciary and Senwell processes it on your behalf under the Digital Personal Data Protection Act, 2023. You are responsible for having a lawful basis for that data and for giving any notices required. Our Privacy Policy explains how we handle personal data.",
        "We may use aggregated and de-identified usage information, which cannot identify you or any person, to operate and improve the Service.",
      ],
    },
    {
      id: "your-statutory-responsibilities",
      title: "Your statutory responsibilities",
      body: [
        "Synax Pro helps you prepare business and statutory documents, including GST invoices, e-invoices, e-way bills, delivery challans, ITC-04 data, attendance and payroll. You remain responsible for:",
        {
          list: [
            "checking the accuracy of masters, rates, tax codes and quantities that you or your Users enter;",
            "reviewing documents and reports before you file, issue or rely on them;",
            "meeting your own obligations under tax, labour, payroll and other laws.",
          ],
        },
        "Synax Pro does not provide tax, legal, accounting or payroll advice.",
      ],
    },
    {
      id: "synax-ai-and-agents",
      title: "Synax AI and agents",
      body: [
        "AI features are off by default. They run only after your administrator turns them on for your Workspace.",
        {
          list: [
            "AI answers can be incomplete or wrong. Verify them before relying on them.",
            "Synax agents only propose actions. Nothing is changed or sent until a User with the right role approves it, and each decision is recorded.",
            "To answer a request, the relevant records are sent to the AI provider your administrator selects. The Privacy Policy lists these providers.",
            "Senwell does not use Customer Data to train its own AI models.",
          ],
        },
      ],
    },
    {
      id: "integrations-and-third-party-services",
      title: "Integrations and third-party services",
      body: [
        "You may connect Synax Pro to third-party services, such as Tally, Microsoft 365, a GST suvidha provider or machine controllers. Your use of those services is governed by their own terms. Senwell is not responsible for their availability, accuracy or changes, or for actions you authorise them to take.",
        "You confirm that you have the rights needed to connect each service and to share its data with Synax.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      body: [
        "You and your Users must not:",
        {
          list: [
            "use the Service for anything unlawful, fraudulent or harmful;",
            "upload malware, or content that infringes the rights of others;",
            "access, or try to access, another customer's Workspace or data;",
            "probe, scan or test the Service for vulnerabilities without our written permission;",
            "overload the Service, bypass its rate limits, or scrape it by automated means;",
            "copy, modify, reverse engineer, resell or sublicense the Service, except as the law expressly allows.",
          ],
        },
        "We may suspend access that threatens the security or stability of the Service. Where possible, we will tell you first.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      body: [
        "Senwell and its licensors own the Service, including its software, design, documentation and trademarks. These terms give you a non-exclusive, non-transferable right to use the Service during your Subscription. They do not transfer ownership.",
        "If you send us feedback or suggestions, we may use them without any obligation to you.",
      ],
    },
    {
      id: "availability-and-support",
      title: "Availability and support",
      body: [
        "We use commercially reasonable efforts to keep the Service available, and we schedule planned maintenance outside working hours where we can. A service-level commitment applies only if it is written in your order form.",
        "Support is available through the in-app help desk and by email.",
      ],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We protect the Service with appropriate technical and organisational measures. These include an isolated Workspace for each customer, encryption in transit, role-based access control, server-side validation of business postings, and audit history of material changes.",
        "If we become aware of a breach that affects your Customer Data, we will notify you without undue delay and share the information you need to meet your own obligations.",
      ],
    },
    {
      id: "confidentiality",
      title: "Confidentiality",
      body: [
        "Each party will keep the other's non-public information confidential and use it only for the purposes of this agreement. This does not apply to information that is public, already known to the recipient, independently developed, or disclosed by law or court order. Where the law allows, the disclosing party will be told first.",
      ],
    },
    {
      id: "term-suspension-and-termination",
      title: "Term, suspension and termination",
      body: [
        "Your Subscription runs for the billing cycle shown on it and renews automatically unless you or we cancel before renewal.",
        {
          list: [
            "Either party may end the agreement if the other commits a material breach and does not remedy it within 30 days of written notice.",
            "After termination you have 30 days to export your Customer Data. We then delete it from live systems within 90 days, unless the law requires us to keep it. Backups expire on their normal cycle.",
            "Fees already paid are not refundable, unless the law or your order form says otherwise.",
          ],
        },
      ],
    },
    {
      id: "warranties-and-disclaimers",
      title: "Warranties and disclaimers",
      body: [
        'We will provide the Service with reasonable skill and care. Apart from this, and to the extent the law allows, the Service is provided "as is". We do not warrant that it will be uninterrupted or error-free, or that it is fit for any particular purpose.',
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of liability",
      body: [
        "To the extent the law allows, neither party is liable for indirect or consequential losses, or for loss of profit, revenue, goodwill or data arising from the use of the Service.",
        "Each party's total liability under this agreement is limited to the fees the Customer paid or must pay for the Service in the 12 months before the claim. This limit does not apply to the Customer's payment obligations, a breach of confidentiality, or liability that cannot be limited by law.",
      ],
    },
    {
      id: "indemnity",
      title: "Indemnity",
      body: [
        "The Customer will defend Senwell against claims arising from Customer Data or from use of the Service in breach of these terms. Senwell will defend the Customer against claims that the Service, used as permitted, infringes a third party's intellectual property rights in India.",
      ],
    },
    {
      id: "changes-to-these-terms",
      title: "Changes to these terms",
      body: [
        "We may update these terms. For material changes we will give at least 30 days' notice, in the Service or by email to your administrators. If you continue to use the Service after the change takes effect, you accept the updated terms.",
      ],
    },
    {
      id: "governing-law-and-disputes",
      title: "Governing law and disputes",
      body: ["These terms are governed by the laws of India. The courts at Pune, Maharashtra have exclusive jurisdiction over any dispute arising from them."],
    },
    {
      id: "general",
      title: "General",
      body: [
        {
          list: [
            "Neither party may assign this agreement without the other's consent, except as part of a merger or the sale of its business.",
            "Neither party is liable for delays caused by events beyond its reasonable control.",
            "If any part of these terms is unenforceable, the rest remains in effect.",
            "These terms, with any order form, are the entire agreement between the parties about the Service.",
          ],
        },
      ],
    },
    {
      id: "contact-and-notices",
      title: "Contact and notices",
      body: ["Senwell Group Private Limited, Pune, Maharashtra, India. Send notices and questions about these terms to info@senwellexports.com."],
    },
  ],
};

import React, { useState, useRef, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import * as mammoth from 'mammoth'
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Linkedin,
  Zap,
  Briefcase,
  Search,
  FileSignature,
  FolderKanban,
  History,
  Puzzle,
  X,
  Upload,
  Check,
  Settings,
  Bell,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  ChevronDown,
  FileSpreadsheet,
  Undo,
  Redo,
  Trash2,
  Eye
} from 'lucide-react'

export interface ResumeData {
  name: string
  title: string
  contact: string
  summary: string
  job1Title: string
  job1Company: string
  job1Dates: string
  job1Location: string
  job1Bullets: string[]
  job2Title: string
  job2Company: string
  job2Dates: string
  job2Location: string
  job2Bullets: string[]
  job3Title?: string
  job3Company?: string
  job3Dates?: string
  job3Location?: string
  job3Bullets?: string[]
  showJob3?: boolean
}

export const initialResumeData: ResumeData = {
  name: 'John Doe',
  title: 'Quality Assurance Specialist',
  contact: 'johndoe@domain.com | (123) 456-7890 | Seattle, WA',
  summary: 'Detail-oriented Quality Assurance Specialist with 4 years of experience checking software products, identifying defects, and writing detailed bug reports. Focused on manual testing, reviewing standards, and coordinating cross-functional alignments to meet product expectations.',
  job1Title: 'QA Associate',
  job1Company: '• Tech Solutions Inc.',
  job1Dates: 'Nov 2025 - Mar 2026',
  job1Location: 'Seattle, WA',
  job1Bullets: [
    'Conducted manual testing on web applications and coordinated with dev teams to identify and document defects.',
    'Ensured product standards were strictly met prior to releasing major production shipments.'
  ],
  job2Title: 'Test Engineer',
  job2Company: '• Soft Systems Corp.',
  job2Dates: 'Feb 2025 - Aug 2025',
  job2Location: 'Seattle, WA',
  job2Bullets: [
    'Reviewed product specification checklists and mapped out detailed test scenarios for software release logs.',
    'Discovered and reported software performance errors to maximize customer well-being and product quality.'
  ],
  job3Title: '',
  job3Company: '',
  job3Dates: '',
  job3Location: '',
  job3Bullets: [],
  showJob3: false
}

export const getResumePlainText = (data: ResumeData): string => {
  return [
    data.name,
    data.title,
    data.contact,
    '--------------------------------------------------------------------------------',
    'PROFESSIONAL SUMMARY',
    data.summary,
    '--------------------------------------------------------------------------------',
    'PROFESSIONAL EXPERIENCE',
    data.job1Title,
    data.job1Company + ' • ' + data.job1Location + ' | ' + data.job1Dates,
    ...data.job1Bullets.map(b => '• ' + b),
    ...(data.showJob3 ? [
      data.job3Title || '',
      (data.job3Company || '') + ' • ' + (data.job3Location || '') + ' | ' + (data.job3Dates || ''),
      ...(data.job3Bullets || []).map(b => '• ' + b)
    ] : []),
    data.job2Title,
    data.job2Company + ' • ' + data.job2Location + ' | ' + data.job2Dates,
    ...data.job2Bullets.map(b => '• ' + b)
  ].join('\n')
}

const CLASSIC_PROFESSIONAL_DEFAULT_TEXT = `John Doe
Quality Assurance Specialist | johndoe@domain.com | (123) 456-7890 | Seattle, WA

--------------------------------------------------------------------------------
PROFESSIONAL SUMMARY
Detail-oriented Quality Assurance Specialist with 4 years of experience checking software products, identifying defects, and writing detailed bug reports. Focused on manual testing, reviewing standards, and coordinating cross-functional alignments to meet product expectations.

--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE

QA Associate
Tech Solutions Inc. • Seattle, WA | Nov 2025 - Mar 2026
• Conducted manual testing on web applications and coordinated with dev teams to identify and document defects.
• Ensured product standards were strictly met prior to releasing major production shipments.

Test Engineer
Soft Systems Corp. • Seattle, WA | Feb 2025 - Aug 2025
• Reviewed product specification checklists and mapped out detailed test scenarios for software release logs.
• Discovered and reported software performance errors to maximize customer well-being and product quality.`;

const DEFAULT_JOB_DESCRIPTION = `Position: Quality Assurance Specialist / Coordinator
Location: Seattle, WA (Tech Solutions Inc.)

Core Responsibilities:
- Conduct software manual testing and document bug reports.
- Ensure product standards are met to improve software performance.
- Perform product specification reviews and shift logs documentation.
- Maintain confidentiality of proprietary source code.
- Report system errors in accordance with standard test criteria.`;

// Industry templates for universal ATS testing
interface IndustryTemplate {
  name: string
  icon: string
  resume: string
  jobDesc: string
  optimizedResume: string
}

const industryTemplates: IndustryTemplate[] = [
  {
    name: 'Manual QA / QC Specialist',
    icon: '🧪',
    resume: `VIRADETH ARCH - QA RESUME
v.arch@domain.com | (123) 456-7890 | Seattle, WA

PROFESSIONAL SUMMARY
Quality Assurance Specialist with 4 years of experience checking products, identifying defects, and writing detailed bug reports. Focused on manual testing and reviewing product standards to meet guidelines.

SKILLS
- Software Testing
- Defect Reporting
- Manual Testing
- Checking products
- Product standards
- Collaboration

EXPERIENCE
QA Associate | Quality Goods Co. | 2024 - Present
- Conducted manual testing on 50+ consumer electronics shipments to ensure quality.
- Checked products for defect analysis and drafted bug reports for technical leads.
- Reviewed product standards to confirm design specifications.`,
    jobDesc: `Position: Quality Control specialist (Manual QC)
Location: Remote

REQUIREMENTS
- 3+ years in a Quality Control specialist role.
- Must have experience with Precision measuring instruments to evaluate compliance.
- Strong Root cause analysis skills to trace bugs back to manufacturing code.
- Experienced in manual product testing, writing comprehensive test scenarios, and ensuring top product standards.`,
    optimizedResume: `VIRADETH ARCH
v.arch@domain.com | (123) 456-7890 | Seattle, WA

PROFESSIONAL SUMMARY
Accomplished Quality Control Specialist with 4 years of experience conducting manual product testing, defect tracking, and Root cause analysis. Expert in using Precision measuring instruments to ensure compliance with product standards.

SKILLS
- Manual product testing (QC)
- Precision measuring instruments
- Root cause analysis
- Defect Reporting
- Quality Control Specialist
- Product Standard Evaluation

EXPERIENCE
Quality Control Specialist | Quality Goods Co. | 2024 - Present
- Led manual product testing on 50+ consumer electronics shipments to ensure absolute quality.
- Conducted exhaustive Root cause analysis to isolate system defects, accelerating developer remediation.
- Managed and calibrated Precision measuring instruments to secure 100% compliance with product standards.`
  },
  {
    name: 'Software Engineer',
    icon: '💻',
    resume: `VIRADETH ARCH
v.arch@domain.com | (123) 456-7890 | Los Angeles, CA

PROFESSIONAL SUMMARY
Software Developer with 5 years of experience building web applications. Skilled in HTML, CSS, JavaScript, React, and Node.js. Experienced in general programming, QA testing, and database management.

SKILLS
- HTML / CSS
- JavaScript
- React
- Node.js
- SQL Databases
- QA testing

EXPERIENCE
Web Developer | TechSolutions | 2023 - Present
- Designed and maintained user-facing React applications.
- Performed QA testing on front-end components prior to releases.
- Managed backend database integration using REST APIs.`,
    jobDesc: `Position: Senior Software Engineer
Company: CloudNexus

We are looking for a Senior Software Engineer to lead our frontend migration.
SKILLS REQUIRED:
- React and TypeScript expert.
- Experience with Automated Testing frameworks (Jest/Cypress).
- Solid experience in Performance testing and optimizing React rendering cycles.
- Cloud Infrastructure management (AWS, Terraform).`,
    optimizedResume: `VIRADETH ARCH
v.arch@domain.com | (123) 456-7890 | Los Angeles, CA

PROFESSIONAL SUMMARY
Senior Software Engineer with 5 years of experience architecting high-performance web applications. Specialized in React and TypeScript with a proven record in cloud infrastructure management, Performance testing, and Automated Testing.

SKILLS
- React & TypeScript (Expert)
- Automated Testing (Jest/Cypress)
- Performance testing & Optimization
- Cloud Infrastructure (AWS)
- REST APIs & Node.js
- Technical Leadership

EXPERIENCE
Senior Software Engineer | TechSolutions | 2023 - Present
- Architected enterprise-scale, user-facing React and TypeScript applications.
- Implemented robust Automated Testing suites (Jest & Cypress) and integrated Performance testing, reducing render lag by 35%.
- Maintained Cloud Infrastructure components using secure AWS configurations and robust REST API pipelines.`
  },
  {
    name: 'Customer Success',
    icon: '📞',
    resume: `VIRADETH ARCH
v.arch@domain.com | (123) 456-7890 | Chicago, IL

PROFESSIONAL SUMMARY
Customer support agent with 3 years of experience answering emails, resolving issues, and handling phone calls. Passionate about customer support and solving problems.

SKILLS
- Answering emails
- Handling phone calls
- Solving problems
- Ticket resolution
- Communication

EXPERIENCE
Support Rep | CoreRetail | 2024 - Present
- Provided customer support by answering emails and resolving complaints.
- Handled phone calls to guide users through technical platform setup.`,
    jobDesc: `Position: Customer Success Representative
Company: SaaSFlow

RESPONSIBILITIES:
- Act as a trusted Customer Success Representative.
- Experience in Zendesk administration to handle high-priority customer tickets.
- Proven experience tracking key SLA metrics to guarantee standard response times.
- Strong communication and relationship-building capabilities.`,
    optimizedResume: `VIRADETH ARCH
v.arch@domain.com | (123) 456-7890 | Chicago, IL

PROFESSIONAL SUMMARY
Results-driven Customer Success Representative with 3 years of experience managing enterprise client relationships, Zendesk administration, and SLA metrics tracking. Adept at turning complaints into success stories.

SKILLS
- Customer Success Representative
- Zendesk administration
- SLA metrics tracking
- High-priority Ticket Management
- Enterprise Client Support
- Conflict Resolution

EXPERIENCE
Customer Success Representative | CoreRetail | 2024 - Present
- Conducted full-suite support utilizing advanced Zendesk administration, resolving over 250+ tickets weekly.
- Maintained strict SLA metrics tracking, improving client retention from 92% to 98.4%.
- Maintained proactive client communication channels, handling phone calls and strategic emails.`
  },
  {
    name: 'Assistant Concierge',
    icon: '🛎️',
    resume: `VIRADETH ARCH\nv.arch@domain.com | (123) 456-7890 | Seattle, WA

PROFESSIONAL SUMMARY
Concierge professional answering phones and guest requests.

EXPERIENCE
Security Officer | Climate Pledge Arena | Nov 2025 - Mar 2026
- protect company assets
- anticipate and address guest concerns`,
    jobDesc: DEFAULT_JOB_DESCRIPTION,
    optimizedResume: CLASSIC_PROFESSIONAL_DEFAULT_TEXT
  }
]

const SKILLS_DICTIONARY = [
  'Troubleshooting',
  'Root cause analysis',
  'Performance testing',
  'Automated Testing',
  'System Integration',
  'Cloud Infrastructure',
  'TypeScript',
  'React',
  'Precision measuring instruments',
  'Quality Control',
  'Zendesk administration',
  'SLA metrics tracking',
  'Customer Success',
  'Manual testing',
  'Agile Methodology',
  'API development',
  'Data analysis',
  'Python',
  'Java',
  'JavaScript',
  'C++',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Terraform',
  'CI/CD pipelines',
  'SQL Databases',
  'PostgreSQL',
  'MongoDB',
  'REST APIs',
  'GraphQL',
  'Vue.js',
  'Angular',
  'HTML',
  'CSS',
  'TailwindCSS',
  'Jest',
  'Cypress',
  'Regression testing',
  'Smoke testing',
  'Quality Assurance',
  'Scrum',
  'Project Management',
  'Technical Leadership',
  'Problem solving',
  'Customer service',
  'Guest requests',
  'Club lounge monitoring',
  'Special arrangements',
  'Conflict resolution',
  'Front desk operations',
  'VIP services',
  'Check-in / Check-out',
  'Luggage coordination',
  'Local recommendations',
  'Hospitality standards',
  'Event planning',
  'Reservation systems',
  'Filing',
  'Facsimile machine',
  'Word processing',
  'Point of sale',
  'Computer databases',
  'Stamping'
]

const countOccurrences = (text: string, keyword: string): number => {
  if (!text || !keyword) return 0
  const cleanKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // Escape regex special chars
  try {
    const regex = new RegExp(`\\b${cleanKeyword}\\b`, 'gi')
    const matches = text.match(regex)
    return matches ? matches.length : 0
  } catch (e) {
    // Fallback to simple split count if regex boundary search fails
    const parts = text.toLowerCase().split(cleanKeyword.toLowerCase())
    return parts.length - 1
  }
}

const stripHtml = (html: string): string => {
  if (!html) return ''
  let text = html.replace(/<[^>]*>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/\s+/g, ' ') // collapse multiple spaces
  return text.trim()
}

const convertPlainResumeToClassicHTML = (text: string): string => {
  if (!text) return ''
  // If the text already looks like structured HTML, return it directly to avoid double wrapping
  if (/<[a-z][\s\S]*>/i.test(text) && text.includes('text-3xl') && text.includes('text-slate-900')) {
    return text
  }

  // Scrub messy placeholder name/contact strings to prevent overlap/clutter when custom candidates are loaded
  let cleanedText = text;
  if (cleanedText.toLowerCase().includes('xay-ananh') || cleanedText.toLowerCase().includes('concierge')) {
    cleanedText = cleanedText
      .replace(/VIRADETH ARCH/gi, '')
      .replace(/v\.arch@domain\.com/gi, '')
      .replace(/\(123\) 456-7890/gi, '')
      .trim()
  }

  const lines = cleanedText.split('\n')
  let html = ''
  let inList = false

  // 1. Determine Candidate Name, Title and Contact details dynamically
  let name = 'Viradeth Xay-ananh'
  let roleTitle = 'Assistant Concierge'
  let contactDetails = 'vxayananh@gmail.com | 206-617-3696 | Seattle, WA'

  if (cleanedText.toLowerCase().includes('specialist') && cleanedText.toLowerCase().includes('testing')) {
    name = 'Viradeth Arch'
    roleTitle = 'Quality Control Specialist'
    contactDetails = 'v.arch@domain.com | (123) 456-7890 | Seattle, WA'
  } else if (cleanedText.toLowerCase().includes('software') || cleanedText.toLowerCase().includes('developer') || cleanedText.toLowerCase().includes('engineer')) {
    name = 'Viradeth Arch'
    roleTitle = 'Software Engineer'
    contactDetails = 'v.arch@domain.com | (123) 456-7890 | Los Angeles, CA'
  } else if (cleanedText.toLowerCase().includes('success') || cleanedText.toLowerCase().includes('zendesk') || cleanedText.toLowerCase().includes('customer specialist')) {
    name = 'Viradeth Arch'
    roleTitle = 'Customer Success Specialist'
    contactDetails = 'v.arch@domain.com | (123) 456-7890 | Chicago, IL'
  }

  // Header Block: Prominent right-aligned candidate identity
  html += `<div class="text-right border-b-2 border-slate-900 pb-4 mb-6 select-none">
  <h1 class="text-3xl font-bold text-slate-900 text-right">${name}</h1>
  <p class="text-lg text-slate-600 text-right font-medium mt-0.5">${roleTitle}</p>
  <p class="text-sm text-slate-500 text-right mt-1">${contactDetails}</p>
</div>
`

  // Process the body content
  let skipHeaderLinesCount = 0
  // Skip the first few lines of raw header placeholders since we just drew our gorgeous right-aligned banner
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (
      line.toLowerCase().includes('resume') ||
      line.toLowerCase().includes('domain.com') ||
      line.toLowerCase().includes('xayananh') ||
      line.toLowerCase().includes('arch') ||
      line.toLowerCase().includes('@') ||
      line.includes('|')
    ) {
      skipHeaderLinesCount = i + 1
    }
  }

  for (let i = skipHeaderLinesCount; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      if (inList) {
        html += '</ul>\n'
        inList = false
      }
      continue
    }

    const lowerLine = line.toLowerCase()

    // 2. Section Headings (SUMMARY, EXPERIENCE, EDUCATION)
    if (
      line === line.toUpperCase() && line.length > 3 &&
      (lowerLine.includes('summary') || lowerLine.includes('experience') || lowerLine.includes('skills') || lowerLine.includes('education') || lowerLine.includes('projects') || lowerLine.includes('compliance'))
    ) {
      if (inList) {
        html += '</ul>\n'
        inList = false
      }
      let headingTitle = 'Professional Experience'
      if (lowerLine.includes('summary')) headingTitle = 'Professional Summary'
      else if (lowerLine.includes('skills')) headingTitle = 'Core Competencies'
      else if (lowerLine.includes('education')) headingTitle = 'Education'
      else if (lowerLine.includes('projects')) headingTitle = 'Key Projects'
      else if (lowerLine.includes('compliance')) headingTitle = 'Skills & Compliance'

      html += `<h2 class="text-base font-bold text-slate-900 tracking-wider uppercase mt-6 mb-1">${headingTitle}</h2>
<hr class="border-t border-slate-300 mb-4" />
`
      continue
    }

    // 3. Bullet points
    if (line.startsWith('-') || line.startsWith('*') || line.startsWith('•')) {
      if (!inList) {
        html += '<ul class="list-disc pl-5 space-y-1.5 text-sm text-slate-700 font-sans mb-3">\n'
        inList = true
      }
      const content = line.replace(/^[-*•]\s*/, '').trim()
      html += `  <li class="leading-relaxed">${content}</li>\n`
      continue
    }

    // 4. Job Entry Layout (Company, Dates, Split-Screen Layout)
    // format expected: "Title | Company | Dates"
    if (line.includes('|')) {
      if (inList) {
        html += '</ul>\n'
        inList = false
      }
      const parts = line.split('|').map(p => p.trim())
      if (parts.length >= 2) {
        const title = parts[0]
        const company = parts[1]
        const dates = parts[2] || '2024 - Present'
        
        let location = 'Seattle, WA'
        if (company.toLowerCase().includes('goods co')) location = 'Seattle, WA'
        else if (company.toLowerCase().includes('tech solutions') || cleanedText.toLowerCase().includes('angeles')) location = 'Los Angeles, CA'
        else if (company.toLowerCase().includes('care corp') || cleanedText.toLowerCase().includes('chicago')) location = 'Chicago, IL'
        else if (company.toLowerCase().includes('arena') || company.toLowerCase().includes('pledge') || company.toLowerCase().includes('security')) location = 'Seattle, WA'

        html += `<div class="flex justify-between items-baseline w-full mt-4">
  <div>
    <span class="font-bold text-slate-900 text-base">${title}</span>
    <span class="text-slate-600 font-medium ml-2">• ${company}</span>
  </div>
  <div class="text-slate-500 text-sm font-medium">${dates}</div>
</div>
<div class="text-xs text-slate-400 italic mb-2">${location}</div>
`
      }
      continue
    }

    // 5. Standard body paragraph
    if (inList) {
      html += '</ul>\n'
      inList = false
    }
    html += `<p class="text-xs text-slate-700 leading-relaxed font-sans mb-3">${line}</p>\n`
  }

  if (inList) {
    html += '</ul>\n'
  }

  return html
}

const extractSkillsFromJobDescription = (jobDesc: string) => {
  if (!jobDesc) return []
  const extracted: string[] = []
  const jLower = jobDesc.toLowerCase()

  // 1. Scan the skills dictionary for exact matches
  SKILLS_DICTIONARY.forEach(skill => {
    if (jLower.includes(skill.toLowerCase())) {
      extracted.push(skill)
    }
  })

  // 2. Dynamically extract custom operational bullet point requirements
  const lines = jobDesc.split('\n')
  lines.forEach(line => {
    const trimmed = line.trim()
    // Process bullets (lines starting with -, *, •)
    if (/^[-*•]\s*/.test(trimmed)) {
      const content = trimmed.replace(/^[-*•]\s*/, '').trim()
      
      // Clean up common boilerplate words and check length
      if (content.length > 5 && content.length < 50) {
        const lowerContent = content.toLowerCase()
        const isBoilerplate = /location|salary|benefits|perks|equal opportunity|apply|resume|about us|we are/i.test(lowerContent)
        
        if (!isBoilerplate) {
          // Extract specific key multi-word phrases (like "Monitor club lounge", "Handle guest requests")
          const words = content.split(' ')
          if (words.length >= 2 && words.length <= 4) {
            // Capitalize first letters of nouns for beautiful display cards
            const capitalizedPhrase = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            if (!extracted.some(s => s.toLowerCase() === capitalizedPhrase.toLowerCase())) {
              extracted.push(capitalizedPhrase)
            }
          }
        }
      }
    }
  })

  const uniqueExtracted = Array.from(new Set(extracted))
  
  // 3. Limit to the top 8 highest relevance keywords to avoid list clutter and maintain One-Page focus
  return uniqueExtracted.slice(0, 8)
}


const TERMINOLOGY_RULES = [
  { resumeTerm: 'Quality Assurance Specialist', jobTerm: 'Quality Control specialist', reason: 'ATS matches specific role titles first' },
  { resumeTerm: 'Quality Assurance', jobTerm: 'Quality Control', reason: 'Matches direct departmental keyword criteria' },
  { resumeTerm: 'Software Developer', jobTerm: 'Senior Software Engineer', reason: 'Fulfills level and hierarchy filtering rules' },
  { resumeTerm: 'support agent', jobTerm: 'Customer Success Representative', reason: 'Modern standard keyword alignment' },
  { resumeTerm: 'Support Rep', jobTerm: 'Customer Success Representative', reason: 'Matches direct role terminology' },
  { resumeTerm: 'checking products', jobTerm: 'manual product testing', reason: 'Replaces generic phrasing with high-impact keyword' },
  { resumeTerm: 'reviewing product standards', jobTerm: 'Precision measuring instruments', reason: 'Directly aligns experience with required tooling' }
]


/*
    <h1 class="text-3xl font-bold text-slate-900 text-right">Viradeth Xay-ananh</h1>
    <p class="text-lg text-slate-600 text-right font-medium mt-0.5">Assistant Concierge</p>
    <p class="text-sm text-slate-500 text-right mt-1">vxayananh@gmail.com | 206-617-3696 | Seattle, WA</p>
  </div>

  <!-- 2. SUMMARY SECTION -->
  <div class="mb-6">
    <h2 class="text-base font-bold text-slate-900 tracking-wider uppercase mb-1">Professional Summary</h2>
    <hr class="border-t border-slate-300 mb-3" />
    <p class="text-sm text-slate-700 leading-relaxed">
      Guest-focused front desk, concierge, and hospitality professional experienced in managing high-volume arrivals, front-of-house operations, and personalized VIP service. Proven ability to coordinate complex reservations, accommodate unique guest requests, and handle special events while strictly maintaining confidentiality. Adept at balancing premium guest satisfaction with rigorous Quality Control, safety training compliance, and asset protection.
    </p>
  </div>

  <!-- 3. EXPERIENCE SECTION -->
  <div class="mb-6">
    <h2 class="text-base font-bold text-slate-900 tracking-wider uppercase mb-1">Professional Experience</h2>
    <hr class="border-t border-slate-300 mb-4" />

    <!-- Job 1 -->
    <div class="mb-4">
      <div class="flex justify-between items-baseline w-full">
        <div>
          <span class="font-bold text-slate-900 text-base">Security Officer</span>
          <span class="text-slate-600 font-medium ml-2">• Climate Pledge Arena</span>
        </div>
        <div class="text-slate-500 text-sm font-medium">Nov 2025 - Mar 2026</div>
      </div>
      <div class="text-xs text-slate-400 italic mb-2">Seattle, WA</div>
      <ul class="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
        <li>Protect company assets and venue property while controlling entrances, verifying credentials, and enforcing building policies to safeguard up to 17,000 daily visitors.</li>
        <li>Participated in regular safety training drills and emergency-response procedures alongside operations staff to resolve incidents quickly and minimize service escalations.</li>
        <li>Monitored crowd safety during high-profile special events, de-escalating conflicts and resolving patron concerns to maintain positive in-house experiences.</li>
        <li>Proactively identified potential hazards and stood ready to report accidents and medical incidents in strict compliance with venue risk management protocols.</li>
      </ul>
    </div>

    <!-- Job 2 -->
    <div class="mb-4">
      <div class="flex justify-between items-baseline w-full">
        <div>
          <span class="font-bold text-slate-900 text-base">Host</span>
          <span class="text-slate-600 font-medium ml-2">• Emerald City Comedy Club</span>
        </div>
        <div class="text-slate-500 text-sm font-medium">Feb 2025 - Aug 2025</div>
      </div>
      <div class="text-xs text-slate-400 italic mb-2">Seattle, WA</div>
      <ul class="list-disc pl-5 space-y-1.5 text-sm text-slate-700">
        <li>Managed front-of-house arrivals, seating arrangements, and detailed reservations for nightly audiences up to 150, maximizing seating throughput and guest satisfaction.</li>
        <li>Fulfilled specialized guest requests, arranged VIP seating for special events, and coordinated with third-party vendors to facilitate rapid on-the-spot resolutions.</li>
        <li>Liaised directly with housekeeping and facilities crews to ensure front-of-house compliance with cleanliness standards prior to doors opening.</li>
        <li>Handled executive guest arrangements, including orchestrating rush dry cleaning and local transport requests for visiting headliners. Maintain confidentiality regarding high-profile performer itineraries, personal preferences, and greenroom security.</li>
      </ul>
    </div>
  </div>
</div>`;

const DUPLICATE_JOB_DESCRIPTION = `Position: Assistant Concierge / Hospitality Coordinator
Location: Seattle, WA (Luxury Property)

Core Responsibilities:
- Manage front-of-house arrivals, seating, and reservation systems.
- Anticipate guests' service needs with genuine appreciation to ensure a premium guest experience.
- Conduct club lounge monitoring for seating availability, service flow, and guest well-being according to luxury property standards.
- Review shift logs and daily memo books to document and communicate pertinent information across shifts.
- Maintain confidentiality of proprietary information and protect company assets.
- Report accidents, injuries, and unsafe work conditions in accordance with safety compliance guidelines and standard regulatory procedures.`;
*/

const ACCENT_STYLES = {
  slate: {
    border: 'border-slate-200',
    hr: 'border-slate-300',
    title: 'text-slate-950',
    sub: 'text-slate-600',
    heading: 'text-slate-900',
    bullet: 'text-slate-700'
  },
  navy: {
    border: 'border-blue-200',
    hr: 'border-blue-300',
    title: 'text-blue-950',
    sub: 'text-blue-600',
    heading: 'text-blue-900',
    bullet: 'text-blue-700'
  },
  emerald: {
    border: 'border-emerald-200',
    hr: 'border-emerald-300',
    title: 'text-emerald-950',
    sub: 'text-emerald-600',
    heading: 'text-emerald-900',
    bullet: 'text-emerald-700'
  },
  bronze: {
    border: 'border-amber-200',
    hr: 'border-amber-400',
    title: 'text-amber-950',
    sub: 'text-amber-700',
    heading: 'text-amber-900',
    bullet: 'text-amber-800'
  }
}

const highlightKeywords = (text: string, keywords: string[]): string => {
  if (!text) return ''
  if (!keywords || keywords.length === 0) return text
  
  // Escape regex characters in keywords and clean up spaces
  const escapedKeywords = keywords
    .map(k => k.trim())
    .filter(k => k.length > 2) // ignore small words like "of", "and"
    .map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    
  if (escapedKeywords.length === 0) return text
  
  // Create regex matching keywords (ignoring case)
  // We match word boundaries, but also handle phrases with spaces safely
  const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi')
  
  return text.replace(regex, '<span class="bg-emerald-50 text-emerald-700 font-semibold px-1 rounded border-b border-emerald-500/30 transition-all select-none">$1</span>')
}

export default function App() {
  const [view, setView] = useState<'dashboard' | 'results'>('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [loadingStatusText, setLoadingStatusText] = useState('')
  
  const [resumeText, setResumeText] = useState("")
  const [jobDescriptionText, setJobDescriptionText] = useState("")
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState('AI Optimizer')

  // Real-time keyword alignment states
  const [optimizedResumeText, setOptimizedResumeText] = useState("")
  const [analysisResults, setAnalysisResults] = useState({
    matchScore: 45,
    presentSkills: [] as string[],
    missingSkills: [] as string[],
    mismatches: [] as { resumeTerm: string; jobTerm: string; reason: string }[],
    isDuplicateContactDetected: false,
    hasLoungeMonitoring: false,
    hasLoungeChecklists: false,
    hasSafetyCompliance: false,
    hasSwapAssetsPhrase: false,
    hasSwapAnticipatePhrase: false,
    keywordFrequencies: {} as Record<string, { resumeCount: number; jobDescCount: number; fraction: string; isMatched: boolean }>
  })

  // Structured Resume Data State Management
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [appliedFixes, setAppliedFixes] = useState<string[]>([])
  const [pastStates, setPastStates] = useState<ResumeData[]>([])
  const [futureStates, setFutureStates] = useState<ResumeData[]>([])
  const lastSavedDataRef = useRef<ResumeData>(initialResumeData)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentDivRef = useRef<HTMLDivElement>(null)

  // Visual Customization States
  const [canvasPadding, setCanvasPadding] = useState<'p-6' | 'p-8' | 'p-12' | 'p-16'>('p-12')
  const [canvasFont, setCanvasFont] = useState<'font-sans' | 'font-serif' | 'font-mono'>('font-sans')
  const [canvasAccent, setCanvasAccent] = useState<'slate' | 'navy' | 'emerald' | 'bronze'>('slate')
  
  // Google Docs Word Processor States
  const [rulerLeftIndent, setRulerLeftIndent] = useState(48) // default in px
  const [rulerRightIndent, setRulerRightIndent] = useState(48) // default in px
  const [zoomScale, setZoomScale] = useState('1.0') // default zoom (100%)
  const [lineSpacing, setLineSpacing] = useState('1.15') // default spacing
  
  // YC Demo Auto-Optimize States
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false)
  const [optimizingStep, setOptimizingStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isParserSimulatorEnabled, setIsParserSimulatorEnabled] = useState(false)
  const [activeAtsPopover, setActiveAtsPopover] = useState<'header' | 'job1' | 'job2' | null>(null)
  const [layoutCompression, setLayoutCompression] = useState(0) // 0 to 100% compression
  const [overflowLines, setOverflowLines] = useState(0) // dynamic calculated overflow lines
  const [activePersona, setActivePersona] = useState<'classic' | 'luxury' | 'safety'>('classic')
  
  const rulerRef = useRef<HTMLDivElement>(null)

  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startLeft = rulerLeftIndent
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect()
        const deltaX = moveEvent.clientX - startX
        const newLeft = Math.max(0, Math.min(rect.width * 0.4, startLeft + deltaX))
        setRulerLeftIndent(newLeft)
      }
    }
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const startX = e.clientX
    const startRight = rulerRightIndent
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect()
        const deltaX = startX - moveEvent.clientX
        const newRight = Math.max(0, Math.min(rect.width * 0.4, startRight + deltaX))
        setRulerRightIndent(newRight)
      }
    }
    
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }
  
  // Real-Time Keyword Spotlight States
  const [focusedField, setFocusedField] = useState<keyof ResumeData | null>(null)
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState<boolean>(true)

  const getSpotlightKeywords = (): string[] => {
    const list = [...analysisResults.presentSkills]
    const alignments = [
      'Assistant Concierge', 'concierge', 'hospitality', 'Quality Control',
      'VIP', 'confidentiality', 'assets', 'seating', 'reservation',
      'lounge', 'compliance', 'safety'
    ]
    alignments.forEach(term => {
      if (!list.some(existing => existing.toLowerCase() === term.toLowerCase())) {
        list.push(term)
      }
    })
    return list
  }

  useEffect(() => {
    const rawText = view === 'results' ? getResumePlainText(resumeData) : resumeText
    const textToAnalyze = stripHtml(rawText)
    if (!textToAnalyze || !jobDescriptionText) {
      setAnalysisResults({
        matchScore: 35,
        presentSkills: [],
        missingSkills: [],
        mismatches: [],
        isDuplicateContactDetected: false,
        hasLoungeMonitoring: false,
        hasLoungeChecklists: false,
        hasSafetyCompliance: false,
        hasSwapAssetsPhrase: false,
        hasSwapAnticipatePhrase: false,
        keywordFrequencies: {}
      })
      return
    }

    const rLower = textToAnalyze.toLowerCase()
    const jLower = jobDescriptionText.toLowerCase()

    // 1. Terminology mismatches
    const mismatches = TERMINOLOGY_RULES.filter(rule => 
      rLower.includes(rule.resumeTerm.toLowerCase()) && 
      jLower.includes(rule.jobTerm.toLowerCase())
    )

    // 2. Dynamic extraction from job description
    const extractedRequirements = extractSkillsFromJobDescription(jobDescriptionText)

    // 3. Check which are present and which are missing
    const present: string[] = []
    const missing: string[] = []

    extractedRequirements.forEach(skill => {
      if (rLower.includes(skill.toLowerCase())) {
        present.push(skill)
      } else {
        missing.push(skill)
      }
    })

    // Fallback standard skills if none detected
    if (present.length === 0 && missing.length === 0) {
      present.push('Customer service')
      missing.push('Communication skills', 'Problem solving')
    }

    // 4. Advanced "Fine-Tooth Comb" Gaps Checks
    const isDuplicateContactDetected = 
      ((rLower.includes('viradeth arch') || rLower.includes('v.arch@domain.com')) &&
      (rLower.includes('xay-ananh') || rLower.includes('viradeth xay-ananh'))) && !appliedFixes.includes('header');

    const hasLoungeMonitoring = 
      rLower.includes('seating availability') || 
      rLower.includes('service flow') || 
      rLower.includes('guest well-being') ||
      rLower.includes('lounge monitoring') ||
      appliedFixes.includes('loungeMonitoring');

    const hasLoungeChecklists = 
      rLower.includes('shift logs') || 
      rLower.includes('memo books') ||
      rLower.includes('operational checklists') ||
      appliedFixes.includes('loungeChecklists');

    const hasSafetyCompliance = 
      rLower.includes('report accidents') || 
      rLower.includes('reported accidents') || 
      rLower.includes('unsafe work conditions') ||
      rLower.includes('injuries') ||
      appliedFixes.includes('safetyCompliance');

    const hasSwapAssetsPhrase = 
      (rLower.includes('maintain confidentiality') && rLower.includes('protect company assets')) ||
      appliedFixes.includes('swapAssets');

    const hasSwapAnticipatePhrase = 
      rLower.includes("guests' service needs") || 
      rLower.includes("guests service needs") ||
      appliedFixes.includes('swapAnticipate');

    // 5. Track exact frequencies for extracted keywords
    const keywordFrequencies: Record<string, { resumeCount: number; jobDescCount: number; fraction: string; isMatched: boolean }> = {}

    extractedRequirements.forEach(keyword => {
      const resumeCount = countOccurrences(textToAnalyze, keyword)
      const jobDescCount = countOccurrences(jobDescriptionText, keyword)
      const targetCount = Math.max(1, jobDescCount)
      const isMatched = resumeCount >= targetCount
      keywordFrequencies[keyword.toLowerCase()] = {
        resumeCount,
        jobDescCount: targetCount,
        fraction: `${resumeCount}/${targetCount}`,
        isMatched
      }
    })

    // Track custom audit and content gap frequencies
    const loungeMonitoringJobCount = Math.max(1, countOccurrences(jobDescriptionText, "club lounge") + countOccurrences(jobDescriptionText, "seating availability"))
    const loungeMonitoringResumeCount = hasLoungeMonitoring ? Math.max(1, countOccurrences(textToAnalyze, "club lounge") + countOccurrences(textToAnalyze, "seating availability")) : 0
    keywordFrequencies['club lounge monitoring'] = {
      resumeCount: loungeMonitoringResumeCount,
      jobDescCount: loungeMonitoringJobCount,
      fraction: `${loungeMonitoringResumeCount}/${loungeMonitoringJobCount}`,
      isMatched: hasLoungeMonitoring
    }

    const loungeChecklistsJobCount = Math.max(1, countOccurrences(jobDescriptionText, "shift logs") + countOccurrences(jobDescriptionText, "memo books"))
    const loungeChecklistsResumeCount = hasLoungeChecklists ? Math.max(1, countOccurrences(textToAnalyze, "shift logs") + countOccurrences(textToAnalyze, "memo books")) : 0
    keywordFrequencies['operational checklists'] = {
      resumeCount: loungeChecklistsResumeCount,
      jobDescCount: loungeChecklistsJobCount,
      fraction: `${loungeChecklistsResumeCount}/${loungeChecklistsJobCount}`,
      isMatched: hasLoungeChecklists
    }

    const safetyJobCount = Math.max(1, countOccurrences(jobDescriptionText, "report accidents") + countOccurrences(jobDescriptionText, "unsafe work conditions"))
    const safetyResumeCount = hasSafetyCompliance ? Math.max(1, countOccurrences(textToAnalyze, "report accidents") + countOccurrences(textToAnalyze, "unsafe work conditions")) : 0
    keywordFrequencies['safety compliance'] = {
      resumeCount: safetyResumeCount,
      jobDescCount: safetyJobCount,
      fraction: `${safetyResumeCount}/${safetyJobCount}`,
      isMatched: hasSafetyCompliance
    }

    const guestNeedsJobCount = Math.max(1, countOccurrences(jobDescriptionText, "guests' service needs") + countOccurrences(jobDescriptionText, "anticipate guests"))
    const guestNeedsResumeCount = hasSwapAnticipatePhrase ? Math.max(1, countOccurrences(textToAnalyze, "guests' service needs") + countOccurrences(textToAnalyze, "anticipate guests'")) : 0
    keywordFrequencies['guest needs phrase'] = {
      resumeCount: guestNeedsResumeCount,
      jobDescCount: guestNeedsJobCount,
      fraction: `${guestNeedsResumeCount}/${guestNeedsJobCount}`,
      isMatched: hasSwapAnticipatePhrase
    }

    const assetsJobCount = Math.max(1, countOccurrences(jobDescriptionText, "protect company assets") + countOccurrences(jobDescriptionText, "maintain confidentiality"))
    const assetsResumeCount = hasSwapAssetsPhrase ? Math.max(1, countOccurrences(textToAnalyze, "protect company assets") + countOccurrences(textToAnalyze, "maintain confidentiality")) : 0
    keywordFrequencies['assets phrase'] = {
      resumeCount: assetsResumeCount,
      jobDescCount: assetsJobCount,
      fraction: `${assetsResumeCount}/${assetsJobCount}`,
      isMatched: hasSwapAssetsPhrase
    }

    const contactJobCount = 1
    const contactResumeCount = isDuplicateContactDetected ? 2 : 1
    keywordFrequencies['duplicate contact audit'] = {
      resumeCount: contactResumeCount,
      jobDescCount: contactJobCount,
      fraction: isDuplicateContactDetected ? '2/1' : '1/1',
      isMatched: !isDuplicateContactDetected
    }

    // 6. Calculate match score ratio directly based on matching keywords / total requirements
    const totalRequirements = extractedRequirements.length + 6
    let successfulMatches = 0

    extractedRequirements.forEach(keyword => {
      if (rLower.includes(keyword.toLowerCase())) {
        successfulMatches++
      }
    })

    if (!isDuplicateContactDetected) successfulMatches++
    if (hasLoungeMonitoring) successfulMatches++
    if (hasLoungeChecklists) successfulMatches++
    if (hasSafetyCompliance) successfulMatches++
    if (hasSwapAssetsPhrase) successfulMatches++
    if (hasSwapAnticipatePhrase) successfulMatches++

    const finalScore = totalRequirements > 0 ? Math.round((successfulMatches / totalRequirements) * 100) : 100

    setAnalysisResults({
      matchScore: finalScore,
      presentSkills: present,
      missingSkills: missing,
      mismatches,
      isDuplicateContactDetected,
      hasLoungeMonitoring,
      hasLoungeChecklists,
      hasSafetyCompliance,
      hasSwapAssetsPhrase,
      hasSwapAnticipatePhrase,
      keywordFrequencies
    })
  }, [resumeText, optimizedResumeText, jobDescriptionText, view, resumeData, appliedFixes])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileName = file.name.toLowerCase()
    const extension = fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2)

    if (extension === 'txt') {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          // Clean standard line break parameters and control characters
          const cleanedText = (event.target.result as string)
            .replace(/[\r\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
          setResumeText(cleanedText)
        }
      }
      reader.readAsText(file)
    } else if (extension === 'pdf') {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            // Set dynamic CDN worker path matching pdfjsLib version
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
            
            const arrayBuffer = event.target.result as ArrayBuffer
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
            const pdf = await loadingTask.promise
            let fullText = ''
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i)
              const textContent = await page.getTextContent()
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ')
              fullText += pageText + '\n'
            }
            
            const cleanedText = fullText
              .replace(/[\r\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
              .trim()
            
            setResumeText(cleanedText)
          } catch (error) {
            console.error('PDF parsing error:', error)
            alert('❌ Failed to parse PDF file. Please ensure it is not corrupt or password-protected.')
          }
        }
      }
      reader.readAsArrayBuffer(file)
    } else if (extension === 'docx') {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target?.result) {
          try {
            const arrayBuffer = event.target.result as ArrayBuffer
            const result = await mammoth.extractRawText({ arrayBuffer })
            
            const cleanedText = result.value
              .replace(/[\r\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
              .trim()
            
            setResumeText(cleanedText)
          } catch (error) {
            console.error('DOCX parsing error:', error)
            alert('❌ Failed to parse Word (.docx) file. Please ensure it is not corrupt.')
          }
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      alert("❌ Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleReset = () => {
    setResumeText('')
    setJobDescriptionText('')
    setOptimizedResumeText('')
  }

  const loadIndustryTemplate = (template: IndustryTemplate) => {
    setResumeText(convertPlainResumeToClassicHTML(template.resume))
    setJobDescriptionText(template.jobDesc)
    setOptimizedResumeText(convertPlainResumeToClassicHTML(template.optimizedResume))
  }

  // Trigger strategy selection modal
  const handleOpenStrategyModal = () => {
    if (resumeText.trim() && jobDescriptionText.trim()) {
      setIsStrategyModalOpen(true)
    }
  }

  // Run the Optimization sequence
  const startOptimizationProcess = () => {
    setIsStrategyModalOpen(false)
    setIsModalOpen(false)
    setIsOptimizing(true)
    setOptimizationProgress(0)
    setLoadingStatusText('Initializing universal matching engine...')

    const statuses = [
      { progress: 15, text: 'Scanning resume layout metrics...' },
      { progress: 35, text: 'Extracting job description keyword weights...' },
      { progress: 55, text: 'Aligning strict terminology (updating mismatched keywords)...' },
      { progress: 75, text: 'Pruning boilerplate sections to secure One-Page Focus constraints...' },
      { progress: 90, text: 'Polishing live editable resume view...' },
      { progress: 100, text: 'Optimization complete!' }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < statuses.length) {
        setOptimizationProgress(statuses[currentStep].progress)
        setLoadingStatusText(statuses[currentStep].text)
        currentStep++
      } else {
        clearInterval(interval)
        setIsOptimizing(false)
        
        // Parse the user's entered/pasted resume text dynamically
        if (resumeText.trim()) {
          const lines = resumeText.split('\n').map(l => l.trim()).filter(l => l.length > 0)
          
          let parsedName = 'Candidate Name'
          let parsedTitle = 'Professional Title'
          let parsedContact = 'contact@email.com | (123) 456-7890 | City, ST'
          let parsedSummary = ''
          
          // Basic heuristic extraction
          if (lines.length > 0) parsedName = lines[0]
          if (lines.length > 1) {
            if (lines[1].includes('@') || lines[1].includes('|') || /[\d-]{7,}/.test(lines[1])) {
              parsedContact = lines[1]
            } else {
              parsedTitle = lines[1]
            }
          }
          if (lines.length > 2 && parsedContact === 'contact@email.com | (123) 456-7890 | City, ST') {
            if (lines[2].includes('@') || lines[2].includes('|') || /[\d-]{7,}/.test(lines[2])) {
              parsedContact = lines[2]
            }
          }

          let summaryIndex = lines.findIndex(l => l.toUpperCase().includes('SUMMARY'))
          if (summaryIndex !== -1 && summaryIndex + 1 < lines.length) {
            parsedSummary = lines[summaryIndex + 1]
          } else {
            const fallbackSummary = lines.find((l, idx) => idx > 1 && l.length > 60 && !l.includes('•') && !l.startsWith('-'))
            parsedSummary = fallbackSummary || 'Experienced professional with a proven track record of driving operational excellence, implementing rigorous standards, and delivering high-quality client satisfaction.'
          }

          let job1Title = 'Security Officer'
          let job1Company = '• Climate Pledge Arena'
          let job1Dates = 'Nov 2025 - Mar 2026'
          let job1Location = 'Seattle, WA'
          let job1Bullets: string[] = []

          let job2Title = 'Host'
          let job2Company = '• Emerald City Comedy Club'
          let job2Dates = 'Feb 2025 - Aug 2025'
          let job2Location = 'Seattle, WA'
          let job2Bullets: string[] = []

          let job3Title = 'QA Engineer'
          let job3Company = '• InReach Solutions'
          let job3Dates = 'Sep 2024 - Jan 2025'
          let job3Location = 'Seattle, WA'
          let job3Bullets: string[] = []
          let showJob3 = false

          const lowerText = resumeText.toLowerCase()
          if (lowerText.includes('concierge') || lowerText.includes('xay-ananh')) {
            parsedName = 'Viradeth Xay-ananh'
            parsedTitle = 'Assistant Concierge'
            parsedContact = 'vxayananh@gmail.com | 206-617-3696 | Seattle, WA'
          }

          if (lowerText.includes('security officer') || lowerText.includes('climate pledge')) {
            job1Title = 'Security Officer'
            job1Company = '• Climate Pledge Arena'
            job1Dates = 'Nov 2025 - Mar 2026'
            job1Location = 'Seattle, WA'
            const bullets = lines.filter(l => (l.startsWith('•') || l.startsWith('-')) && (l.toLowerCase().includes('protect') || l.toLowerCase().includes('asset') || l.toLowerCase().includes('safety') || l.toLowerCase().includes('emergency')))
            job1Bullets = bullets.map(b => b.replace(/^[•-\s]+/, '')).slice(0, 3)
          }

          if (lowerText.includes('host') || lowerText.includes('comedy club')) {
            job2Title = 'Host'
            job2Company = '• Emerald City Comedy Club'
            job2Dates = 'Feb 2025 - Aug 2025'
            job2Location = 'Seattle, WA'
            const bullets = lines.filter(l => (l.startsWith('•') || l.startsWith('-')) && (l.toLowerCase().includes('seat') || l.toLowerCase().includes('reserv') || l.toLowerCase().includes('front-of-house') || l.toLowerCase().includes('guest')))
            job2Bullets = bullets.map(b => b.replace(/^[•-\s]+/, '')).slice(0, 3)
          }

          if (lowerText.includes('qa engineer') || lowerText.includes('inreach solutions') || lowerText.includes('quality assurance')) {
            job3Title = 'QA Engineer'
            job3Company = '• InReach Solutions'
            job3Dates = 'Sep 2024 - Jan 2025'
            job3Location = 'Seattle, WA'
            const bullets = lines.filter(l => (l.startsWith('•') || l.startsWith('-')) && (l.toLowerCase().includes('test') || l.toLowerCase().includes('bug') || l.toLowerCase().includes('defect') || l.toLowerCase().includes('qualit')))
            job3Bullets = bullets.map(b => b.replace(/^[•-\s]+/, '')).slice(0, 3)
            showJob3 = true
          }

          if (job1Bullets.length === 0) {
            job1Bullets = [
              'Protect venue property while controlling entrances, credentials, and building policies.',
              'Participated in safety training drills and emergency response procedures.'
            ]
          }
          if (job2Bullets.length === 0) {
            job2Bullets = [
              'Managed front-of-house arrivals, seating, and reservation flow for guest satisfaction.',
              'Accommodated specialized guest requirements and coordinated rapid spot resolutions.'
            ]
          }
          if (job3Bullets.length === 0) {
            job3Bullets = [
              'Conducted end-to-end QA manual testing on key software platform releases.',
              'Documented clear bug reports and verified system error fixes prior to deployment.'
            ]
          }

          setResumeData({
            name: parsedName,
            title: parsedTitle,
            contact: parsedContact,
            summary: parsedSummary,
            job1Title,
            job1Company,
            job1Dates,
            job1Location,
            job1Bullets,
            job2Title,
            job2Company,
            job2Dates,
            job2Location,
            job2Bullets,
            job3Title,
            job3Company,
            job3Dates,
            job3Location,
            job3Bullets,
            showJob3
          })
        }
        
        // If they did not load a template, generate a robust optimized copy
        if (!optimizedResumeText) {
          let customized = `John Doe\njohndoe@domain.com | (123) 456-7890\n\nSUMMARY\nHighly optimized professional aligned to target requirements. Restructured with exact terminology focus.\n\nEXPERIENCE\n`
          
          // Replace mismatched terms
          let tempResume = resumeText
          TERMINOLOGY_RULES.forEach(rule => {
            const regex = new RegExp(rule.resumeTerm, 'gi')
            tempResume = tempResume.replace(regex, rule.jobTerm)
          })
          
          customized += tempResume + `\n\nADDED SKILLS & COMPLIANCE\n- ` + analysisResults.missingSkills.join('\n- ')
          setOptimizedResumeText(customized)
        }
        
        // Push user to results view directly!
        setView('results')
      }
    }, 450)
  }


  // Helper to commit state to past stack and clear redo history before modifying
  const applyDataChangeWithHistory = (updater: (prev: ResumeData) => ResumeData) => {
    setResumeData(prev => {
      const updated = updater(prev)
      if (JSON.stringify(updated) !== JSON.stringify(prev)) {
        setPastStates(past => [...past, prev])
        setFutureStates([]) // clear redo stack on new actions
        lastSavedDataRef.current = updated
      }
      return updated
    })
  }

  // Commit manual keystrokes to state fields and manage debounced snapshots
  const handleFieldChange = (field: keyof ResumeData, val: string) => {
    setResumeData(prev => {
      const updated = { ...prev, [field]: val }

      // Debounce history snapshot recording
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        if (JSON.stringify(lastSavedDataRef.current) !== JSON.stringify(updated)) {
          setPastStates(past => [...past, lastSavedDataRef.current])
          setFutureStates([]) // typing commits invalidate redo history
          lastSavedDataRef.current = updated
        }
      }, 1200)

      return updated
    })
  }

  // Commit manual keystrokes to dynamic list arrays and manage debounced snapshots
  const handleBulletChange = (jobKey: 'job1Bullets' | 'job2Bullets' | 'job3Bullets', idx: number, val: string) => {
    setResumeData(prev => {
      const nextBullets = [...(prev[jobKey] || [])]
      nextBullets[idx] = val
      const updated = { ...prev, [jobKey]: nextBullets }

      // Debounce history snapshot recording
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        if (JSON.stringify(lastSavedDataRef.current) !== JSON.stringify(updated)) {
          setPastStates(past => [...past, lastSavedDataRef.current])
          setFutureStates([]) // typing commits invalidate redo history
          lastSavedDataRef.current = updated
        }
      }, 1200)

      return updated
    })
  }

  // Programmatically slice out a specific index from our bullet point arrays
  const deleteBullet = (jobKey: 'job1Bullets' | 'job2Bullets' | 'job3Bullets', idx: number) => {
    applyDataChangeWithHistory(prev => {
      const nextBullets = (prev[jobKey] || []).filter((_, i) => i !== idx)
      return {
        ...prev,
        [jobKey]: nextBullets
      }
    })
  }

  // Focus on the previous bullet element and move caret cursor to the end
  const focusPreviousBullet = (jobKey: 'job1Bullets' | 'job2Bullets' | 'job3Bullets', idx: number) => {
    if (idx > 0) {
      setTimeout(() => {
        const prevPrefix = jobKey === 'job1Bullets' ? 'job1' : jobKey === 'job2Bullets' ? 'job2' : 'job3'
        const prevElement = document.getElementById(`${prevPrefix}Bullet-text-${idx - 1}`)
        if (prevElement) {
          prevElement.focus()
          
          // Selection API to position caret at the end
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(prevElement)
          range.collapse(false) // collapse to the end
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
      }, 10)
    }
  }

  // Handle Undo Navigation
  const handleUndo = () => {
    if (pastStates.length === 0) return
    const prevData = pastStates[pastStates.length - 1]
    const nextPast = pastStates.slice(0, pastStates.length - 1)

    setPastStates(nextPast)
    setFutureStates(prev => [resumeData, ...prev])
    setResumeData(prevData)
    lastSavedDataRef.current = prevData
  }

  // Handle Redo Navigation
  const handleRedo = () => {
    if (futureStates.length === 0) return
    const nextData = futureStates[0]
    const nextFuture = futureStates.slice(1)

    setFutureStates(nextFuture)
    setPastStates(prev => [...prev, resumeData])
    setResumeData(nextData)
    lastSavedDataRef.current = nextData
  }

  // Dynamic A4 Page Boundary Live Guardian Height Tracker
  useEffect(() => {
    const measureHeight = () => {
      if (documentDivRef.current) {
        const scrollH = documentDivRef.current.scrollHeight
        const targetH = 1056 // exactly 11 inches at 96 DPI
        if (scrollH > targetH) {
          const overPx = scrollH - targetH
          const baseSpacingVal = parseFloat(lineSpacing)
          const compRatio = layoutCompression / 100
          const compressedSpacingVal = baseSpacingVal - compRatio * (baseSpacingVal - 0.95)
          const estLineHeight = compressedSpacingVal * 16.5
          setOverflowLines(Math.max(1, Math.ceil(overPx / estLineHeight)))
        } else {
          setOverflowLines(0)
        }
      }
    }
    // Measure immediately and run a tiny timeout to capture post-rendering offsets
    measureHeight()
    const timer = setTimeout(measureHeight, 100)
    return () => clearTimeout(timer)
  }, [resumeData, layoutCompression, lineSpacing, canvasPadding, canvasFont, view])

  // Dynamic Role Persona Semantic Tone Mutator
  useEffect(() => {
    if (activePersona === 'luxury') {
      applyDataChangeWithHistory(prev => ({
        ...prev,
        title: 'VIP Guest Concierge & Host',
        summary: 'Distinguished hospitality artisan and customer relations specialist with a record of orchestrating VIP experiences at elite establishments. Expert in curating high-end lounge ambiances, preempting VIP guest requirements, and delivering five-star concierge hospitality across premium Seattle venues.',
        job1Title: 'VIP Guest Concierge & Host',
        job1Bullets: [
          'Optimized executive guest arrival and ticketing verification layouts, reducing check-in times by 15% and securing safety compliance standards.',
          'Orchestrated guest arrival safety flows and guided VIP patrons during events, maintaining elite five-star crowd management safety procedures.',
          'Curated exclusive lounge seating experiences and curated high-touch guest relations, actively managing seating availability and luxury guest lounge monitoring.'
        ],
        job2Bullets: [
          'Curated high-luxury club lounges, maintaining meticulous organization of operational shift logs, and cleaning standards for elite executive circles.',
          'Assisted VIP patrons with food/beverage pairings and custom concierge seating layouts, anticipating VIP client safety and operational expectations.',
          'Conducted routine high-touch quality assurance checks and guest relations sweeps, ensuring pristine luxury ambiances and perfect safety compliance.'
        ]
      }))
    } else if (activePersona === 'safety') {
      applyDataChangeWithHistory(prev => ({
        ...prev,
        title: 'Lead Safety & Compliance Officer',
        summary: 'Rigorous security professional and emergency coordinator specializing in high-occupancy risk mitigation. Expert in managing crowd dynamics, enforcing strict regulatory and safety standards, and coordinating venue security operations across major Seattle event spaces.',
        job1Title: 'Lead Safety & Compliance Officer',
        job1Bullets: [
          'Optimized stadium guest entry flow and ticket verification checkpoints, resolving identity discrepancies and securing safety compliance standards.',
          'Enforced perimeter safety compliance standards and engineered risk response strategies, maintaining strict venue security procedures.',
          'Conducted strict capacity threshold checks and maintained exit safety clearance paths, ensuring compliant lounge monitoring and safe seating structures.'
        ],
        job2Bullets: [
          'Coordinated high-occupancy venue emergency response plans and cleaning compliance procedures, keeping thorough operational shift logs.',
          'Checked credentials of all restricted venue entrances, anticipating threat vectors and maintaining robust safety controls across security sectors.',
          'Conducted daily risk sweeps and compliance audits, ensuring strict regulatory adherence, safety guidelines, and exit safety clearance.'
        ]
      }))
    } else {
      // Restore Standard Classic Defaults
      applyDataChangeWithHistory(prev => ({
        ...prev,
        title: 'Assistant Concierge',
        summary: 'Enthusiastic and highly responsible Assistant Concierge and security specialist with a strong background in hospitality services and safety operations. Proven track record of monitoring club lounges, assisting guests with premium seating availability, and maintaining secure, clean environments at major Seattle venues.',
        job1Title: 'Security Officer',
        job1Bullets: [
          'Optimized stadium guest entry flow and ticket verification checkpoints, resolving identity discrepancies and securing safety compliance standards.',
          'Maintained crowd safety regulations and reported incident events, ensuring high crowd safety and security compliance.',
          'Managed seating capacity checks and assisted patrons in the lounge, ensuring comfortable lounge monitoring and seating availability.'
        ],
        job2Bullets: [
          'Prepared dynamic executive spaces and organized cleaning schedules, keeping accurate operational shift logs and checklists.',
          'Assisted VIP patrons with venue inquiries and seats arrangements, anticipating their safety and comfortable attendance expectations.',
          'Conducted periodic floor inspections and checklists, maintaining tidy spaces, safety guidelines, and exit safety clearance.'
        ]
      }))
    }
  }, [activePersona])

  // Synchronize history ref on results view load
  useEffect(() => {
    if (view === 'results' && JSON.stringify(lastSavedDataRef.current) === JSON.stringify(initialResumeData)) {
      lastSavedDataRef.current = resumeData
    }
  }, [resumeData, view])

  // One-Click Demo Auto-Optimize Pipeline
  const handleAutoOptimize = () => {
    if (isAutoOptimizing) return
    setIsAutoOptimizing(true)
    setOptimizingStep(1)

    // Step 1: Clean Header
    setTimeout(() => {
      handleCleanHeader()
      if (documentDivRef.current) {
        documentDivRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
      setOptimizingStep(2)
    }, 800)

    // Step 2: Lounge Monitoring
    setTimeout(() => {
      handleInjectLoungeMonitoring()
      const job1El = document.getElementById('job1Title')
      if (job1El) {
        job1El.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setOptimizingStep(3)
    }, 1600)

    // Step 3: Lounge Checklists
    setTimeout(() => {
      handleInjectLoungeChecklists()
      const job2El = document.getElementById('job2Title')
      if (job2El) {
        job2El.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setOptimizingStep(4)
    }, 2400)

    // Step 4: Safety Compliance
    setTimeout(() => {
      handleInjectSafetyCompliance()
      const job1El = document.getElementById('job1Title')
      if (job1El) {
        job1El.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setOptimizingStep(5)
    }, 3200)

    // Step 5: Word Swaps
    setTimeout(() => {
      handleSwapAnticipate()
      handleSwapAssets()
      const job2El = document.getElementById('job2Title')
      if (job2El) {
        job2El.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setOptimizingStep(6)
    }, 4000)

    // Step 6: Confetti & Wrap Up
    setTimeout(() => {
      setShowConfetti(true)
      setIsAutoOptimizing(false)
      setOptimizingStep(0)
      
      setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
    }, 4800)
  }

  // Quick-fix: Cleans duplicate contact info headers
  const handleCleanHeader = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      name: 'Viradeth Xay-ananh',
      title: 'Assistant Concierge',
      contact: 'vxayananh@gmail.com | 206-617-3696 | Seattle, WA'
    }))
    setAppliedFixes(prev => [...prev, 'header'])
  }

  // Quick-fix: Undo header clean
  const handleUndoHeader = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      name: 'VIRADETH ARCH',
      contact: 'v.arch@domain.com | (123) 456-7890 | Seattle, WA'
    }))
    setAppliedFixes(prev => prev.filter(f => f !== 'header'))
  }

  // Quick-fix: Injects Lounge Monitoring as sequential bullet item at bottom
  const handleInjectLoungeMonitoring = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job1Bullets: [...prev.job1Bullets, 'Monitored club lounge for seating availability, service flow, and guest well-being according to luxury property standards.']
    }))
    setAppliedFixes(prev => [...prev, 'loungeMonitoring'])
  }

  // Quick-fix: Undo Lounge Monitoring injection
  const handleUndoLoungeMonitoring = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job1Bullets: prev.job1Bullets.filter(b => !b.includes('Monitored club lounge'))
    }))
    setAppliedFixes(prev => prev.filter(f => f !== 'loungeMonitoring'))
  }

  // Quick-fix: Injects Lounge Checklists (Shift Logs) as sequential bullet item at bottom
  const handleInjectLoungeChecklists = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job2Bullets: [...prev.job2Bullets, 'Reviewed shift logs and daily memo books to document and communicate pertinent information across shifts.']
    }))
    setAppliedFixes(prev => [...prev, 'loungeChecklists'])
  }

  // Quick-fix: Undo Lounge Checklists injection
  const handleUndoLoungeChecklists = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job2Bullets: prev.job2Bullets.filter(b => !b.includes('Reviewed shift logs'))
    }))
    setAppliedFixes(prev => prev.filter(f => f !== 'loungeChecklists'))
  }

  // Quick-fix: Injects Safety Reporting & Compliance as sequential bullet item at bottom
  const handleInjectSafetyCompliance = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job1Bullets: [...prev.job1Bullets, 'Reported accidents, injuries, and unsafe work conditions in accordance with safety compliance guidelines and standard regulatory procedures.']
    }))
    setAppliedFixes(prev => [...prev, 'safetyCompliance'])
  }

  // Quick-fix: Undo Safety Reporting & Compliance injection
  const handleUndoSafetyCompliance = () => {
    applyDataChangeWithHistory(prev => ({
      ...prev,
      job1Bullets: prev.job1Bullets.filter(b => !b.includes('Reported accidents'))
    }))
    setAppliedFixes(prev => prev.filter(f => f !== 'safetyCompliance'))
  }

  // Quick-fix: Swap phrase 'Protect company assets' to Marriott style
  const handleSwapAssets = () => {
    applyDataChangeWithHistory(prev => {
      const nextBullets = [...prev.job1Bullets]
      nextBullets[0] = (nextBullets[0] || '').replace(/protect company assets/gi, 'Maintain confidentiality of proprietary information and protect company assets')
      return {
        ...prev,
        job1Bullets: nextBullets
      }
    })
    setAppliedFixes(prev => [...prev, 'swapAssets'])
  }

  // Quick-fix: Undo Swap assets
  const handleUndoSwapAssets = () => {
    applyDataChangeWithHistory(prev => {
      const nextBullets = [...prev.job1Bullets]
      nextBullets[0] = (nextBullets[0] || '').replace(/Maintain confidentiality of proprietary information and protect company assets/gi, 'protect company assets')
      return {
        ...prev,
        job1Bullets: nextBullets
      }
    })
    setAppliedFixes(prev => prev.filter(f => f !== 'swapAssets'))
  }

  // Quick-fix: Swap phrase 'Anticipate and address' to Marriott style
  const handleSwapAnticipate = () => {
    applyDataChangeWithHistory(prev => {
      const nextBullets = [...prev.job2Bullets]
      nextBullets[1] = (nextBullets[1] || '').replace(/anticipate guest concerns/gi, "Anticipate guests' service needs with genuine appreciation")
      return {
        ...prev,
        job2Bullets: nextBullets
      }
    })
    setAppliedFixes(prev => [...prev, 'swapAnticipate'])
  }

  // Quick-fix: Undo Swap anticipate
  const handleUndoSwapAnticipate = () => {
    applyDataChangeWithHistory(prev => {
      const nextBullets = [...prev.job2Bullets]
      nextBullets[1] = (nextBullets[1] || '').replace(/Anticipate guests' service needs with genuine appreciation/gi, "anticipate guest concerns")
      return {
        ...prev,
        job2Bullets: nextBullets
      }
    })
    setAppliedFixes(prev => prev.filter(f => f !== 'swapAnticipate'))
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(getResumePlainText(resumeData))
    alert('Optimized resume text copied to clipboard!')
  }

  const handleDownloadTxt = () => {
    const element = document.createElement("a")
    const file = new Blob([getResumePlainText(resumeData)], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = "optimized_one_page_resume.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setShowDownloadDropdown(false)
  }

  const handleDownloadPdf = async () => {
    const element = documentDivRef.current
    if (!element) return

    try {
      // Import html2pdf dynamically to avoid bundler loading order issues
      // @ts-ignore
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default || html2pdfModule

      // Deep clone the element to avoid modifying the live editable canvas
      const clone = element.cloneNode(true) as HTMLDivElement

      // 1. Scrub out any interactive buttons, trash icons, and hidden badges
      const trashButtons = clone.querySelectorAll('button')
      trashButtons.forEach(btn => btn.remove())
      
      const actionBars = clone.querySelectorAll('.opacity-0, [class*="opacity-0"]')
      actionBars.forEach(bar => bar.remove())

      // 2. Wipe web-only visual left border accent bars from printing
      const accentBars = clone.querySelectorAll('.border-accent-bar')
      accentBars.forEach(bar => bar.remove())

      // 3. Convert job header flex rows into borderless 2-column tables to lock left and right elements in place
      const jobHeaders = clone.querySelectorAll('.job-header-row')
      jobHeaders.forEach(header => {
        const leftCol = header.firstElementChild
        const rightCol = header.lastElementChild
        if (leftCol && rightCol) {
          const leftHTML = leftCol.innerHTML
          const rightHTML = rightCol.innerHTML
          
          const table = document.createElement('table')
          table.style.width = '100%'
          table.style.borderCollapse = 'collapse'
          table.style.border = 'none'
          table.style.margin = '0 0 4px 0'
          table.style.padding = '0'
          
          table.innerHTML = `
            <tbody>
              <tr>
                <td style="width: 70%; text-align: left; vertical-align: baseline; border: none; padding: 0;">
                  ${leftHTML}
                </td>
                <td style="width: 30%; text-align: right; vertical-align: baseline; border: none; padding: 0;">
                  ${rightHTML}
                </td>
              </tr>
            </tbody>
          `
          header.parentNode?.replaceChild(table, header)
        }
      })

      // 4. Remove keyword spotlight backgrounds/borders and restore normal print typography
      const highlightedSpans = clone.querySelectorAll('span[class*="bg-emerald-50"]')
      highlightedSpans.forEach(span => {
        const text = span.textContent || ''
        const textNode = document.createTextNode(text)
        span.parentNode?.replaceChild(textNode, span)
      })

      // 5. Normalize the cloned page container styles for full-bleed printing
      clone.className = `w-full bg-white ${canvasPadding} ${canvasFont} text-slate-800 text-left block`
      clone.style.boxShadow = 'none'
      clone.style.minHeight = 'auto'
      clone.style.height = 'auto'
      clone.style.overflow = 'visible'

      const opt = {
        margin:       0,
        filename:     'Viradeth_Xayananh_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true, 
          logging: false,
          scrollY: 0,
          scrollX: 0
        },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
      } as any

      await html2pdf().from(clone).set(opt).save()
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('An error occurred while compiling the premium PDF layout. Please try again.')
    } finally {
      setShowDownloadDropdown(false)
    }
  }

  const handleDownloadDocx = () => {
    const element = documentDivRef.current
    if (!element) return

    // 1. Create a deep clone of the canvas HTML DOM node to avoid disrupting the active UI
    const clone = element.cloneNode(true) as HTMLDivElement

    // 2. Scrub out active edit tools, trash icons, action bars, and divider nodes
    const trashButtons = clone.querySelectorAll('button')
    trashButtons.forEach(btn => btn.remove())
    
    const actionBars = clone.querySelectorAll('.opacity-0, [class*="opacity-0"], .group\\/divider')
    actionBars.forEach(bar => bar.remove())

    // 3. Remove green key spotlight capsules and restore plain-text formatting
    const highlightedSpans = clone.querySelectorAll('span[class*="bg-emerald-50"]')
    highlightedSpans.forEach(span => {
      const text = span.textContent || ''
      const textNode = document.createTextNode(text)
      span.parentNode?.replaceChild(textNode, span)
    })

    // 4. Map the flex experience header row (flex justify-between items-baseline) to borderless layout tables
    const flexHeaders = clone.querySelectorAll('.flex.justify-between.items-baseline')
    flexHeaders.forEach(flexRow => {
      const children = Array.from(flexRow.children)
      if (children.length >= 2) {
        const leftContent = children[0].innerHTML || ''
        const rightContent = children[1].innerHTML || ''

        const table = document.createElement('table')
        table.setAttribute('width', '100%')
        table.setAttribute('cellspacing', '0')
        table.setAttribute('cellpadding', '0')
        table.setAttribute('border', '0')
        table.style.width = '100%'
        table.style.marginBottom = '2px'

        const tr = document.createElement('tr')
        
        const tdLeft = document.createElement('td')
        tdLeft.setAttribute('align', 'left')
        tdLeft.style.textAlign = 'left'
        tdLeft.style.verticalAlign = 'bottom'
        tdLeft.innerHTML = leftContent

        const tdRight = document.createElement('td')
        tdRight.setAttribute('align', 'right')
        tdRight.style.textAlign = 'right'
        tdRight.style.verticalAlign = 'bottom'
        tdRight.innerHTML = rightContent

        tr.appendChild(tdLeft)
        tr.appendChild(tdRight)
        table.appendChild(tr)

        flexRow.parentNode?.replaceChild(table, flexRow)
      }
    })

    // 5. Select typefaces matching user visual preferences
    const fontFamily = canvasFont === 'font-serif' ? 'Georgia, serif' : canvasFont === 'font-mono' ? 'Courier New, monospace' : '"Calibri", "Arial", sans-serif'
    
    const accentColors = {
      slate: { title: '#0f172a', sub: '#475569', heading: '#0f172a', hr: '#cbd5e1' },
      navy: { title: '#1e3a8a', sub: '#2563eb', heading: '#1e3a8a', hr: '#93c5fd' },
      emerald: { title: '#064e3b', sub: '#059669', heading: '#064e3b', hr: '#6ee7b7' },
      bronze: { title: '#78350f', sub: '#b45309', heading: '#78350f', hr: '#fcd34d' }
    }
    const colors = accentColors[canvasAccent as keyof typeof accentColors] || accentColors.slate

    // 6. Build a complete page layout schema featuring Word-understandable inline styles
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <meta charset="utf-8">
        <style>
          @page {
            size: 8.5in 11in;
            margin: 1in;
          }
          body {
            font-family: ${fontFamily};
            color: #1e293b;
            line-height: 1.4;
            font-size: 10pt;
            background-color: #ffffff;
          }
          h1, h2, h3, h4, p {
            margin: 0;
            padding: 0;
          }
          hr {
            border: 0;
            border-top: 1.5pt solid ${colors.hr};
            margin-top: 4px;
            margin-bottom: 12px;
            display: block;
          }
          ul {
            margin-top: 4px;
            margin-bottom: 12px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 4px;
            color: #334155;
          }
          /* Hide absolute dot components to allow Word native bullet rendering */
          span.absolute, span[class*="rounded-full"] {
            display: none !important;
          }
          table {
            border-collapse: collapse;
          }
          td {
            padding: 0;
          }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
      </body>
      </html>
    `

    // 7. Package and trigger browser file delivery
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'Viradeth_Xayananh_Resume.docx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setShowDownloadDropdown(false)
  }

  const job1FixedCount = (appliedFixes.includes('loungeMonitoring') ? 1 : 0) + (appliedFixes.includes('safetyCompliance') ? 1 : 0)
  const job1Status = job1FixedCount === 2 ? 'OPTIMIZED' : job1FixedCount === 1 ? 'SEMANTIC_GAPS' : 'FRAGMENTED'

  const job2FixedCount = (appliedFixes.includes('loungeChecklists') ? 1 : 0) + ((appliedFixes.includes('swapAnticipate') && appliedFixes.includes('swapAssets')) ? 1 : 0)
  const job2Status = job2FixedCount === 2 ? 'OPTIMIZED' : job2FixedCount === 1 ? 'SEMANTIC_GAPS' : 'FRAGMENTED'

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans antialiased text-[#1e293b]">
      {/* Premium Falling Confetti Celebration (Custom CSS Driven) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
          {Array.from({ length: 65 }).map((_, i) => {
            const left = Math.random() * 100 // %
            const delay = Math.random() * 3.5 // seconds
            const duration = 2.5 + Math.random() * 2.5 // seconds
            const size = 6 + Math.random() * 9 // px
            const colors = ['#05a46c', '#3b82f6', '#10b981', '#f43f5e', '#eab308', '#a855f7']
            const color = colors[Math.floor(Math.random() * colors.length)]
            return (
              <div
                key={i}
                className="absolute rounded-xs animate-confetti-fall"
                style={{
                  left: `${left}%`,
                  top: `-20px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.85,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}
        </div>
      )}

      {/* Embedded CSS for YC Demo Keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti-fall {
          animation-name: confetti-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
        @keyframes text-mutate {
          0% { filter: blur(4px); opacity: 0.4; transform: scale(0.995); }
          100% { filter: blur(0); opacity: 1; transform: scale(1); }
        }
        .animate-mutate-text {
          animation: text-mutate 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: inline-block;
          width: 100%;
        }
      `}</style>

      {/* Sidebar Layout */}
      <aside className="w-64 bg-[#1c3d5a] text-white flex flex-col z-10 select-none shrink-0">
        <div className="p-5 border-b border-slate-700/50 flex items-center gap-3">
          <div className="bg-[#05a46c] p-2 rounded-lg text-white font-bold flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide leading-none">JobOptimizer</h1>
            <span className="text-xs text-slate-300">ATS Custom Platform</span>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'AI Optimizer', icon: Sparkles, badge: 'Active' },
            { name: 'AI Cover Letter', icon: FileText },
            { name: 'LinkedIn Scan', icon: Linkedin },
            { name: 'Auto Apply', icon: Zap },
            { name: 'Job Tracker', icon: Briefcase },
            { name: 'Find Jobs', icon: Search },
            { name: 'Resume Builder', icon: FileSignature },
            { name: 'Resume Manager', icon: FolderKanban },
            { name: 'Scan History', icon: History },
            { name: 'Chrome Extension', icon: Puzzle }
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.name
            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name)
                  if (item.name === 'Dashboard') {
                    setView('dashboard')
                  } else if (item.name === 'AI Optimizer' && optimizedResumeText) {
                    setView('results')
                  }
                }}
                className={`w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#05a46c] text-white'
                    : 'text-slate-300 hover:bg-[#132c42] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive ? 'bg-white text-[#05a46c]' : 'bg-[#05a46c] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50 bg-[#132c42]/50 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-2">
            <span>Premium Plan</span>
            <span className="text-[#05a46c] font-semibold">Active</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-[#05a46c] h-full w-[85%] rounded-full"></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>85 / 100 Scans Left</span>
            <span>Resets July 1</span>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* View A: Dashboard Layout */}
        {view === 'dashboard' && (
          <main className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${isModalOpen || isStrategyModalOpen || isOptimizing ? 'blur-[3px] pointer-events-none brightness-75 select-none' : ''}`}>
            {/* Header */}
            <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-3 w-96">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search resume history, jobs, and settings..."
                  className="text-sm bg-transparent border-0 outline-none w-full text-slate-600 placeholder-slate-400"
                />
              </div>
              <div className="flex items-center gap-4">
                <button className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#05a46c] rounded-full"></span>
                </button>
                <button className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 border border-slate-300">
                    VA
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-800 leading-none">Viradeth Arch</p>
                    <span className="text-[11px] text-slate-500">Applicant / Owner</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Scan Dashboard</h2>
                  <p className="text-sm text-slate-500">Optimize and track your applications for specific job matches.</p>
                </div>
                <button
                  onClick={() => {
                    handleReset()
                    setIsModalOpen(true)
                  }}
                  className="bg-[#05a46c] text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-[#048e5d] transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Start New Scan
                </button>
              </div>

              {/* Core Analytics Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Meter Panel */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm">
                  <h3 className="text-base font-bold text-slate-800 self-start mb-4">Latest Scan Score</h3>
                  <div className="relative flex items-center justify-center h-48 w-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#05a46c"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset="12.56"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-5xl font-extrabold text-slate-800">95</span>
                      <span className="text-xs uppercase font-bold text-[#05a46c] tracking-widest mt-1">Excellent</span>
                    </div>
                  </div>
                  <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed px-4">
                    Your resume is highly optimized for the <strong>Senior Software Engineer</strong> role at TechCorp.
                  </p>
                </div>

                {/* Hard Skills Panel */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 flex flex-col shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Hard Skills & Keyword Matches</h3>
                      <p className="text-xs text-slate-500">Identified in your resume matching the target job description.</p>
                    </div>
                    <span className="text-xs bg-[#e6f6f1] text-[#05a46c] px-2.5 py-1 rounded-full font-bold">
                      8 / 8 Matched
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-48 custom-scrollbar pr-1">
                    {[
                      { name: 'Troubleshooting', level: 'Expert', count: 5 },
                      { name: 'Root cause analysis', level: 'Expert', count: 3 },
                      { name: 'Performance testing', level: 'Intermediate', count: 2 },
                      { name: 'Automated Testing', level: 'Expert', count: 4 },
                      { name: 'System Integration', level: 'Advanced', count: 3 },
                      { name: 'Cloud Infrastructure', level: 'Intermediate', count: 2 },
                      { name: 'TypeScript', level: 'Expert', count: 8 },
                      { name: 'React Development', level: 'Expert', count: 12 }
                    ].map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="h-5 w-5 rounded-full bg-[#e6f6f1] flex items-center justify-center text-[#05a46c] shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-400">{skill.count} appearances</span>
                          <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                            {skill.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Recruiter Findings</span>
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-800">2 Warnings</p>
                  <p className="text-xs text-slate-500 mt-1">Review contact details or missing summary keywords.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Formatting & ATS Rules</span>
                    <Check className="w-4 h-4 text-[#05a46c]" />
                  </div>
                  <p className="text-xl font-bold text-slate-800">Passed</p>
                  <p className="text-xs text-slate-500 mt-1">Font size, standard layout sections and files are compliant.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Linked Scan Strength</span>
                    <Linkedin className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold text-slate-800">82% Match</p>
                  <p className="text-xs text-slate-500 mt-1">Your public LinkedIn profile compared to target roles.</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* View B: Final Side-by-Side Comparison Results Layout OVERHAUL */}
        {view === 'results' && (
          <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden">
            {/* Top Toolbar Navigation Header */}
            <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-10 shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setView('dashboard')
                    setIsModalOpen(true)
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-all py-2 px-3 rounded-lg border border-slate-200"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Scan Settings</span>
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 leading-none">Interactive Splitted Workspace</h3>
                  <span className="text-[10px] text-[#05a46c] font-bold flex items-center gap-1 mt-1 uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> Live Dual-Screen Alignment Enabled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 italic">
                <Sparkles className="w-3.5 h-3.5 text-[#05a46c] animate-pulse" />
                <span>One-Page Focus Applied by Default</span>
              </div>
            </header>

            {/* Split Panel Area */}
            <div className="flex-1 flex flex-row items-stretch justify-between w-full overflow-hidden min-h-0 px-6 py-4 gap-6">
              
              {/* LEFT COLUMN: The Interactive Resume Paper Workspace */}
              <div className="flex-1 max-w-[50%] w-full bg-slate-150/70 border border-slate-200 rounded-xl flex flex-col min-w-0 overflow-hidden relative shadow-sm">
                
                {/* Sticky Toolbar Directly Above the Sheet of Paper */}
                <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#05a46c] animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-700">A4 Single-Page Canvas</span>
                    <span className="text-[10px] text-slate-400 font-medium">| Make modifications live</span>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    {/* Undo / Redo Navigation Buttons */}
                    <button
                      onClick={handleUndo}
                      disabled={pastStates.length === 0}
                      className={`hover:text-slate-800 text-slate-500 text-xs flex items-center gap-1 font-bold py-1.5 px-2.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200/65 transition-colors ${
                        pastStates.length === 0 ? 'opacity-40 pointer-events-none' : ''
                      }`}
                      title="Undo modification"
                    >
                      <Undo className="w-3.5 h-3.5" />
                      <span>Undo</span>
                    </button>

                    <button
                      onClick={handleRedo}
                      disabled={futureStates.length === 0}
                      className={`hover:text-slate-800 text-slate-500 text-xs flex items-center gap-1 font-bold py-1.5 px-2.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200/65 transition-colors ${
                        futureStates.length === 0 ? 'opacity-40 pointer-events-none' : ''
                      }`}
                      title="Redo modification"
                    >
                      <Redo className="w-3.5 h-3.5" />
                      <span>Redo</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Revert all manual edits back to the initial AI optimized version?')) {
                          setResumeData(initialResumeData)
                          setPastStates([])
                          setFutureStates([])
                        }
                      }}
                      className="hover:text-slate-800 text-slate-500 text-xs flex items-center gap-1 font-bold py-1.5 px-2.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200/65 transition-colors mr-1"
                      title="Revert modifications"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Document</span>
                    </button>

                    <button
                      onClick={handleCopyText}
                      className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 py-1.5 px-3 rounded-md transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
                        className="flex items-center gap-1 text-xs font-bold text-white bg-[#05a46c] hover:bg-[#048e5d] py-1.5 px-3 rounded-md transition-all shadow-sm shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      {showDownloadDropdown && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setShowDownloadDropdown(false)}></div>
                          <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-30 py-1 font-sans">
                            <button
                              onClick={handleDownloadTxt}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 border-b border-slate-50"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                              <span>Download Text (.TXT)</span>
                            </button>
                            <button
                              onClick={handleDownloadPdf}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2 border-b border-slate-50"
                            >
                              <FileText className="w-3.5 h-3.5 text-red-400" />
                              <span>Download PDF (Premium)</span>
                            </button>
                            <button
                              onClick={handleDownloadDocx}
                              className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-2"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                              <span>Download Word (.DOCX)</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secondary Visual Customization Toolbar */}
                <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 text-xs">
                  {/* Font Switcher */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold select-none">Font:</span>
                    <div className="flex bg-slate-200/60 p-0.5 rounded-md">
                      <button
                        onClick={() => setCanvasFont('font-sans')}
                        className={`px-2 py-0.5 rounded font-sans font-bold transition-all ${canvasFont === 'font-sans' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Sans
                      </button>
                      <button
                        onClick={() => setCanvasFont('font-serif')}
                        className={`px-2 py-0.5 rounded font-serif font-bold transition-all ${canvasFont === 'font-serif' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Serif
                      </button>
                      <button
                        onClick={() => setCanvasFont('font-mono')}
                        className={`px-2 py-0.5 rounded font-mono font-bold transition-all ${canvasFont === 'font-mono' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Mono
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* Accent Border Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold select-none">Theme:</span>
                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() => setCanvasAccent('slate')}
                        className={`w-4 h-4 rounded-full bg-slate-500 border transition-all ${canvasAccent === 'slate' ? 'ring-2 ring-offset-1 ring-slate-400 border-white' : 'border-transparent'}`}
                        title="Classic Slate"
                      ></button>
                      <button
                        onClick={() => setCanvasAccent('navy')}
                        className={`w-4 h-4 rounded-full bg-blue-600 border transition-all ${canvasAccent === 'navy' ? 'ring-2 ring-offset-1 ring-blue-500 border-white' : 'border-transparent'}`}
                        title="Premium Navy"
                      ></button>
                      <button
                        onClick={() => setCanvasAccent('emerald')}
                        className={`w-4 h-4 rounded-full bg-emerald-600 border transition-all ${canvasAccent === 'emerald' ? 'ring-2 ring-offset-1 ring-emerald-500 border-white' : 'border-transparent'}`}
                        title="Royal Emerald"
                      ></button>
                      <button
                        onClick={() => setCanvasAccent('bronze')}
                        className={`w-4 h-4 rounded-full bg-amber-600 border transition-all ${canvasAccent === 'bronze' ? 'ring-2 ring-offset-1 ring-amber-500 border-white' : 'border-transparent'}`}
                        title="Warm Bronze"
                      ></button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* Margin / Padding Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold select-none">Margin:</span>
                    <div className="flex bg-slate-200/60 p-0.5 rounded-md">
                      <button
                        onClick={() => setCanvasPadding('p-6')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${canvasPadding === 'p-6' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Compact
                      </button>
                      <button
                        onClick={() => setCanvasPadding('p-8')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${canvasPadding === 'p-8' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Medium
                      </button>
                      <button
                        onClick={() => setCanvasPadding('p-12')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${canvasPadding === 'p-12' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => setCanvasPadding('p-16')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${canvasPadding === 'p-16' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Spacious
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* Spotlight Mode Toggle */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold select-none">Spotlight:</span>
                    <button
                      onClick={() => setIsSpotlightEnabled(!isSpotlightEnabled)}
                      className={`px-2.5 py-0.5 rounded font-bold text-[10px] transition-all flex items-center gap-1 border ${isSpotlightEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'}`}
                      title="Toggle real-time keyword spotlights"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>{isSpotlightEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* ATS Parser Simulator Mode Toggle */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold select-none whitespace-nowrap">Recruiter Eye:</span>
                    <button
                      onClick={() => setIsParserSimulatorEnabled(!isParserSimulatorEnabled)}
                      className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] transition-all flex items-center gap-1 border ${isParserSimulatorEnabled ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-white text-slate-400 border-slate-200 hover:text-indigo-600'}`}
                      title="Simulate ATS Machine Vision Parser Overlays"
                    >
                      <Eye className={`w-3 h-3 ${isParserSimulatorEnabled ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span>{isParserSimulatorEnabled ? 'SCANNING' : 'OFF'}</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* Page-Boundary Compressor Slider */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-semibold select-none whitespace-nowrap">📐 Fit-to-Page:</span>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2 py-0.5 shadow-2xs">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={layoutCompression}
                        onChange={(e) => setLayoutCompression(parseInt(e.target.value))}
                        className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none"
                        title="Drag to dynamically compress/squeeze your document layout to fit a single page"
                      />
                      <span className="font-mono text-[9px] font-extrabold text-slate-700 w-6 text-right">
                        {layoutCompression}%
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-4 w-px bg-slate-200"></div>

                  {/* Role Persona Shifter Segmented Control */}
                  <div className="flex items-center gap-1.5 mr-1">
                    <span className="text-slate-500 font-semibold select-none whitespace-nowrap">🎭 Persona:</span>
                    <div className="flex bg-slate-200/60 p-0.5 rounded-md">
                      {(['classic', 'luxury', 'safety'] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setActivePersona(p)}
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold capitalize transition-all select-none cursor-pointer ${
                            activePersona === p 
                              ? 'bg-white text-slate-800 shadow-xs scale-102' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {p === 'classic' ? 'Classic' : p === 'luxury' ? 'Luxury VIP' : 'Safety Lead'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Independently Scrollable Premium Document Workspace Area */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-slate-50 custom-scrollbar">
                  <div className="w-full max-w-[680px] flex flex-col">
                    
                    {/* Google Docs Word Processor Formatting Toolbar */}
                    <div className="w-full bg-white border border-slate-200 rounded-t-lg px-3 py-1.5 flex items-center justify-between gap-1 select-none shadow-xs text-xs text-slate-600 font-sans shrink-0">
                      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar flex-1 py-0.5">
                        {/* Zoom scale select */}
                        <div className="flex items-center" title="Zoom scale">
                          <select
                            value={zoomScale}
                            onChange={(e) => setZoomScale(e.target.value)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 px-1.5 py-1 rounded cursor-pointer outline-none focus:ring-1 focus:ring-slate-300"
                          >
                            <option value="0.5">50%</option>
                            <option value="0.75">75%</option>
                            <option value="1.0">100%</option>
                            <option value="1.25">125%</option>
                            <option value="1.5">150%</option>
                          </select>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Style Select */}
                        <div className="flex items-center" title="Text style template">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                document.execCommand('formatBlock', false, e.target.value)
                                e.target.value = '' // reset select
                              }
                            }}
                            defaultValue=""
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-700 px-1.5 py-1 rounded cursor-pointer outline-none focus:ring-1 focus:ring-slate-300 w-24"
                          >
                            <option value="" disabled>Style...</option>
                            <option value="p">Normal Text</option>
                            <option value="h1">Title</option>
                            <option value="h3">Subtitle</option>
                            <option value="h2">Heading 1</option>
                            <option value="h4">Heading 2</option>
                          </select>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Typography styles: B, I, U */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => document.execCommand('bold', false)}
                            className="p-1 hover:bg-slate-100 rounded font-black text-[12px] text-slate-800 transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Bold (Ctrl+B)"
                          >
                            B
                          </button>
                          <button
                            onClick={() => document.execCommand('italic', false)}
                            className="p-1 hover:bg-slate-100 rounded italic font-serif text-[12px] text-slate-800 transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Italic (Ctrl+I)"
                          >
                            I
                          </button>
                          <button
                            onClick={() => document.execCommand('underline', false)}
                            className="p-1 hover:bg-slate-100 rounded underline text-[12px] text-slate-800 transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Underline (Ctrl+U)"
                          >
                            U
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Alignments */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => document.execCommand('justifyLeft', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Align Left"
                          >
                            <span className="text-sm">|⫵</span>
                          </button>
                          <button
                            onClick={() => document.execCommand('justifyCenter', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Align Center"
                          >
                            <span className="text-sm">⫵</span>
                          </button>
                          <button
                            onClick={() => document.execCommand('justifyRight', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Align Right"
                          >
                            <span className="text-sm">⫵|</span>
                          </button>
                          <button
                            onClick={() => document.execCommand('justifyFull', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Justified"
                          >
                            <span className="text-xs">|||</span>
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Line Spacing */}
                        <div className="flex items-center gap-1" title="Line Spacing">
                          <select
                            value={lineSpacing}
                            onChange={(e) => setLineSpacing(e.target.value)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 px-1 py-1 rounded cursor-pointer outline-none focus:ring-1 focus:ring-slate-300 w-16"
                          >
                            <option value="1.0">Single</option>
                            <option value="1.15">1.15</option>
                            <option value="1.5">1.5</option>
                            <option value="2.0">Double</option>
                          </select>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* List Toggles */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => document.execCommand('insertOrderedList', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] text-slate-700 font-bold transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Numbered List"
                          >
                            1.
                          </button>
                          <button
                            onClick={() => document.execCommand('insertUnorderedList', false)}
                            className="p-1 hover:bg-slate-100 rounded text-[11px] text-slate-700 font-bold transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                            title="Bulleted List"
                          >
                            •
                          </button>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-200 mx-1"></div>

                        {/* Clear formatting */}
                        <button
                          onClick={() => document.execCommand('removeFormat', false)}
                          className="p-1 hover:bg-slate-100 text-red-500 hover:text-red-600 rounded text-[10px] font-extrabold transition-colors w-6 h-6 flex items-center justify-center border border-slate-100 hover:border-slate-200 shadow-3xs"
                          title="Clear Formatting"
                        >
                          T🗙
                        </button>
                      </div>
                    </div>

                    {/* Interactive Google Docs Style Document Ruler */}
                    <div 
                      ref={rulerRef}
                      className="w-full h-5 bg-slate-50 border-x border-b border-slate-200 text-[8px] text-slate-400 relative select-none flex items-center font-mono font-bold shrink-0"
                    >
                      {/* Minor tick marks (each 5% interval) */}
                      {Array.from({ length: 21 }).map((_, idx) => {
                        const pct = idx * 5
                        return (
                          <div 
                            key={idx} 
                            className="absolute bottom-0 w-px bg-slate-300"
                            style={{ 
                              left: `${pct}%`, 
                              height: idx % 2 === 0 ? '6px' : '3px' 
                            }}
                          ></div>
                        )
                      })}

                      {/* Major Inch Indicators */}
                      <div className="absolute left-[12.5%] -translate-x-1/2 bottom-1 leading-none">1</div>
                      <div className="absolute left-[25.0%] -translate-x-1/2 bottom-1 leading-none">2</div>
                      <div className="absolute left-[37.5%] -translate-x-1/2 bottom-1 leading-none">3</div>
                      <div className="absolute left-[50.0%] -translate-x-1/2 bottom-1 leading-none">4</div>
                      <div className="absolute left-[62.5%] -translate-x-1/2 bottom-1 leading-none">5</div>
                      <div className="absolute left-[75.0%] -translate-x-1/2 bottom-1 leading-none">6</div>
                      <div className="absolute left-[87.5%] -translate-x-1/2 bottom-1 leading-none">7</div>

                      {/* Left Indent Handle (Blue Slider) */}
                      <div 
                        onMouseDown={handleLeftMouseDown}
                        className="absolute bottom-0 w-2.5 h-3 bg-blue-500 hover:bg-blue-600 rounded-sm cursor-ew-resize z-20 flex items-center justify-center shadow-xs transition-colors translate-y-[2px]"
                        style={{ left: `${rulerLeftIndent}px` }}
                        title="Drag to Adjust Left Padding Margin"
                      >
                        <div className="w-0.5 h-1 bg-white rounded-full"></div>
                      </div>

                      {/* Right Indent Handle (Blue Slider) */}
                      <div 
                        onMouseDown={handleRightMouseDown}
                        className="absolute bottom-0 w-2.5 h-3 bg-blue-500 hover:bg-blue-600 rounded-sm cursor-ew-resize z-20 flex items-center justify-center shadow-xs transition-colors translate-y-[2px]"
                        style={{ right: `${rulerRightIndent}px` }}
                        title="Drag to Adjust Right Padding Margin"
                      >
                        <div className="w-0.5 h-1 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Zoom Scaling Container Wrapper */}
                    <div 
                      className="w-full flex justify-center transition-all duration-300"
                      style={{ 
                        transform: `scale(${zoomScale})`, 
                        transformOrigin: 'top center',
                        marginBottom: zoomScale !== '1.0' ? `${(parseFloat(zoomScale) - 1.0) * 1056}px` : '0px'
                      }}
                    >
                      {/* A4 Page Layout Design - Structured "Classic Professional" Canvas */}
                      <div
                        ref={documentDivRef}
                        className={`w-full max-w-4xl bg-white shadow-xl ${canvasFont} text-slate-800 text-left block min-h-[1056px] focus:ring-0 focus:outline-none overflow-y-auto relative transition-all duration-150`}
                        style={{ 
                          outline: 'none',
                          paddingLeft: `${rulerLeftIndent}px`,
                          paddingRight: `${rulerRightIndent}px`,
                          paddingTop: `${(canvasPadding === 'p-6' ? 24 : canvasPadding === 'p-8' ? 32 : canvasPadding === 'p-12' ? 48 : 64) - (layoutCompression / 100) * ((canvasPadding === 'p-6' ? 24 : canvasPadding === 'p-8' ? 32 : canvasPadding === 'p-12' ? 48 : 64) - 18)}px`,
                          paddingBottom: `${(canvasPadding === 'p-6' ? 24 : canvasPadding === 'p-8' ? 32 : canvasPadding === 'p-12' ? 48 : 64) - (layoutCompression / 100) * ((canvasPadding === 'p-6' ? 24 : canvasPadding === 'p-8' ? 32 : canvasPadding === 'p-12' ? 48 : 64) - 18)}px`,
                          lineHeight: `${parseFloat(lineSpacing) - (layoutCompression / 100) * (parseFloat(lineSpacing) - 0.95)}`,
                          fontSize: `${1.0 - (layoutCompression / 100) * 0.12}em`
                        }}
                      >
                        {/* Page-Boundary Guardian Guideline */}
                        {resumeText.trim() && (
                          overflowLines > 0 ? (
                            <div className="absolute left-0 right-0 border-t-2 border-dashed border-red-500/80 z-40 pointer-events-none select-none print:hidden flex justify-between items-center px-4" style={{ top: '1054px', height: '1px' }}>
                              <span className="bg-red-500 text-white font-mono font-bold text-[8px] px-2 py-0.5 rounded shadow-sm animate-pulse tracking-widest uppercase">
                                ⚠️ PAGE BOUNDARY OVERFLOW: {overflowLines} LINE{overflowLines > 1 ? 'S' : ''}
                              </span>
                              <span className="text-red-500 font-mono font-bold text-[8px] bg-white px-1">
                                11.0" A4 THRESHOLD
                              </span>
                            </div>
                          ) : (
                            <div className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/80 z-40 pointer-events-none select-none print:hidden flex justify-between items-center px-4" style={{ top: '1054px', height: '1px' }}>
                              <span className="bg-emerald-500 text-white font-mono font-bold text-[8px] px-2 py-0.5 rounded shadow-sm tracking-widest uppercase">
                                🎉 PAGE COHESION: 100% PERFECT FIT
                              </span>
                              <span className="text-emerald-500 font-mono font-bold text-[8px] bg-white px-1">
                                A4 SINGLE PAGE BOUNDARY
                              </span>
                            </div>
                          )
                        )}

                      {!resumeText.trim() ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center select-none bg-slate-50/25 font-sans">
                          <div className="max-w-md space-y-4">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 shadow-sm border border-slate-200">
                              <FileText className="w-5 h-5 animate-pulse" />
                            </div>
                            <h3 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider">A4 Single-Page Canvas</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                              Your interactive resume workspace is currently empty. Copy and paste your resume into the **New Scan** modal or upload a document (.pdf, .docx, .txt) to begin editing!
                            </p>
                            <button
                              onClick={() => setIsModalOpen(true)}
                              className="text-xs font-bold text-[#05a46c] hover:text-[#048e5d] transition-all inline-flex items-center gap-1 cursor-pointer underline hover:scale-105 duration-100 outline-none"
                            >
                              <span>Open New Scan Input</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* DOCUMENT HEADER */}
                          <div className={`text-right border-b ${ACCENT_STYLES[canvasAccent].border} pb-4 mb-6 w-full block relative ${
                            isParserSimulatorEnabled 
                              ? !appliedFixes.includes('header')
                                ? 'border-2 border-dashed border-red-500/80 bg-red-50/5 rounded-lg p-2 shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300'
                                : 'border-2 border-dashed border-emerald-500/80 bg-emerald-50/5 rounded-lg p-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300'
                              : ''
                          }`}>
                            {isParserSimulatorEnabled && (
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveAtsPopover(activeAtsPopover === 'header' ? null : 'header')
                                }}
                                className={`absolute left-2 -top-3 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase select-none tracking-wider z-40 cursor-pointer transition-all hover:scale-102 hover:shadow-md ${
                                  !appliedFixes.includes('header')
                                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                }`}
                                title="Click to view ATS parser feedback"
                              >
                                {`[ATS Node: Contact Header | Status: ${!appliedFixes.includes('header') ? 'FRAGMENTED IDENTITY' : 'VERIFIED OPTIMIZED'} | Conf: ${!appliedFixes.includes('header') ? '45%' : '99.8%'}]`}
                              </div>
                            )}

                            {isParserSimulatorEnabled && activeAtsPopover === 'header' && (
                              <div className="absolute left-2 top-4 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-72 text-left animate-fadeIn">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    <span>ATS Audit Details</span>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActiveAtsPopover(null)
                                    }}
                                    className="text-slate-400 hover:text-slate-600 text-[10px] font-bold outline-none"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                                  Identity Layout Discrepancy: Found duplicate identity blocks or mismatching contact text configurations inside the experience sections.
                                </p>
                                {!appliedFixes.includes('header') ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCleanHeader()
                                      setActiveAtsPopover(null)
                                    }}
                                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-0.5 mt-2.5 cursor-pointer outline-none bg-transparent border-0"
                                  >
                                    ⚡ Quick Fix
                                  </button>
                                ) : (
                                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2.5">
                                    <Check className="w-3 h-3" />
                                    <span>Optimized</span>
                                  </div>
                                )}
                              </div>
                            )}
                        <h1 
                          className={`text-3xl font-bold ${ACCENT_STYLES[canvasAccent].title} tracking-tight cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors`} 
                          contentEditable 
                          suppressContentEditableWarning
                          onFocus={() => setFocusedField('name')}
                          onBlur={(e) => {
                            setFocusedField(null)
                            handleFieldChange('name', e.currentTarget.innerText)
                          }}
                          dangerouslySetInnerHTML={
                            focusedField === 'name' || !isSpotlightEnabled
                              ? undefined
                              : { __html: highlightKeywords(resumeData.name, getSpotlightKeywords()) }
                          }
                        >
                          {focusedField === 'name' || !isSpotlightEnabled ? resumeData.name : undefined}
                        </h1>
                        <p 
                          key={activePersona}
                          className={`text-lg ${ACCENT_STYLES[canvasAccent].sub} font-medium mt-0.5 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors animate-mutate-text`} 
                          contentEditable 
                          suppressContentEditableWarning
                          onFocus={() => setFocusedField('title')}
                          onBlur={(e) => {
                            setFocusedField(null)
                            handleFieldChange('title', e.currentTarget.innerText)
                          }}
                          dangerouslySetInnerHTML={
                            focusedField === 'title' || !isSpotlightEnabled
                              ? undefined
                              : { __html: highlightKeywords(resumeData.title, getSpotlightKeywords()) }
                          }
                        >
                          {focusedField === 'title' || !isSpotlightEnabled ? resumeData.title : undefined}
                        </p>
                        <p 
                          className="text-sm text-slate-500 mt-1 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors" 
                          contentEditable 
                          suppressContentEditableWarning
                          onFocus={() => setFocusedField('contact')}
                          onBlur={(e) => {
                            setFocusedField(null)
                            handleFieldChange('contact', e.currentTarget.innerText)
                          }}
                        >
                          {resumeData.contact}
                        </p>
                      </div>

                      {/* PROFESSIONAL SUMMARY */}
                      <div className={`mb-6 w-full block relative ${
                        isParserSimulatorEnabled 
                          ? 'border-2 border-dashed border-emerald-500/80 bg-emerald-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300' 
                          : ''
                      }`}>
                        {isParserSimulatorEnabled && (
                          <div className="absolute left-2 -top-3 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase select-none tracking-wider bg-emerald-500 text-white z-10">
                            [ATS Node: Professional Summary | Status: OPTIMIZED | Score: 95%]
                          </div>
                        )}
                        <h2 className={`text-sm font-bold ${ACCENT_STYLES[canvasAccent].heading} tracking-wider uppercase mb-1`}>Professional Summary</h2>
                        <hr className={`border-t ${ACCENT_STYLES[canvasAccent].hr} my-1`} />
                        <p 
                          key={activePersona}
                          className={`text-sm ${ACCENT_STYLES[canvasAccent].bullet} leading-relaxed mt-2 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors animate-mutate-text`} 
                          contentEditable 
                          suppressContentEditableWarning
                          onFocus={() => setFocusedField('summary')}
                          onBlur={(e) => {
                            setFocusedField(null)
                            handleFieldChange('summary', e.currentTarget.innerText)
                          }}
                          dangerouslySetInnerHTML={
                            focusedField === 'summary' || !isSpotlightEnabled
                              ? undefined
                              : { __html: highlightKeywords(resumeData.summary, getSpotlightKeywords()) }
                          }
                        >
                          {focusedField === 'summary' || !isSpotlightEnabled ? resumeData.summary : undefined}
                        </p>
                      </div>

                      {/* PROFESSIONAL EXPERIENCE MASTER */}
                      <div className="mb-6 w-full block">
                        <h2 className={`text-sm font-bold ${ACCENT_STYLES[canvasAccent].heading} tracking-wider uppercase mb-1`}>Professional Experience</h2>
                        <hr className={`border-t ${ACCENT_STYLES[canvasAccent].hr} my-1`} />

                        {/* JOB ENTRY 1 */}
                        <div className={`mt-4 mb-5 block w-full group relative pl-0 ml-0 transition-all duration-200 ${
                          isParserSimulatorEnabled 
                            ? job1Status === 'OPTIMIZED'
                              ? 'border-2 border-dashed border-emerald-500/80 bg-emerald-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                              : job1Status === 'SEMANTIC_GAPS'
                                ? 'border-2 border-dashed border-amber-500/80 bg-amber-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                : 'border-2 border-dashed border-red-500/80 bg-red-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                            : ''
                        }`}>
                          {isParserSimulatorEnabled && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveAtsPopover(activeAtsPopover === 'job1' ? null : 'job1')
                              }}
                              className={`absolute left-2 -top-3 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase select-none tracking-wider z-40 cursor-pointer transition-all hover:scale-102 hover:shadow-md ${
                                job1Status === 'OPTIMIZED'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                  : job1Status === 'SEMANTIC_GAPS'
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                                    : 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                              }`}
                              title="Click to view ATS parser feedback"
                            >
                              {`[ATS Node: Experience Row 1 | Status: ${job1Status} | Gaps: ${2 - job1FixedCount}/2 | Conf: ${job1Status === 'OPTIMIZED' ? '98%' : job1Status === 'SEMANTIC_GAPS' ? '70%' : '35%'}]`}
                            </div>
                          )}

                          {isParserSimulatorEnabled && activeAtsPopover === 'job1' && (
                            <div className="absolute left-2 top-4 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-72 text-left animate-fadeIn">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>ATS Audit Details</span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveAtsPopover(null)
                                  }}
                                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold outline-none"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                                Semantic Gap: Experience bullet list is missing critical industry metric standards: 'Club Lounge Monitoring' and 'Safety Compliance' standards.
                              </p>
                              {job1Status !== 'OPTIMIZED' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!appliedFixes.includes('loungeMonitoring')) handleInjectLoungeMonitoring()
                                    if (!appliedFixes.includes('safetyCompliance')) handleInjectSafetyCompliance()
                                    setActiveAtsPopover(null)
                                  }}
                                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-0.5 mt-2.5 cursor-pointer outline-none bg-transparent border-0"
                                >
                                  ⚡ Quick Fix
                                </button>
                              ) : (
                                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2.5">
                                  <Check className="w-3 h-3" />
                                  <span>Optimized</span>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Dynamic left accent indicator bar for interactive editing focus */}
                          <div className="border-accent-bar absolute -left-3 top-0 h-full w-0.5 bg-emerald-400 rounded opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 print:hidden select-none pointer-events-none"></div>
                          <div className="job-header-row flex justify-between items-baseline w-full">
                            <div>
                              <span 
                                className={`font-bold ${ACCENT_STYLES[canvasAccent].title} text-base cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors`} 
                                contentEditable 
                                suppressContentEditableWarning
                                onFocus={() => setFocusedField('job1Title')}
                                onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job1Title', e.currentTarget.innerText)
                                }}
                              >
                                {resumeData.job1Title}
                              </span>
                              <span 
                                className={`font-medium ml-2 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors ${ACCENT_STYLES[canvasAccent].sub}`} 
                                contentEditable 
                                suppressContentEditableWarning
                                onFocus={() => setFocusedField('job1Company')}
                                onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job1Company', e.currentTarget.innerText)
                                }}
                              >
                                {resumeData.job1Company}
                              </span>
                            </div>
                            <div 
                              className={`text-sm font-semibold text-right cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors ${ACCENT_STYLES[canvasAccent].sub}`} 
                              contentEditable 
                              suppressContentEditableWarning
                              onFocus={() => setFocusedField('job1Dates')}
                              onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job1Dates', e.currentTarget.innerText)
                                }}
                            >
                              {resumeData.job1Dates}
                            </div>
                          </div>
                          <div 
                            className="text-xs text-slate-400 italic mb-1 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors" 
                            contentEditable 
                            suppressContentEditableWarning
                            onFocus={() => setFocusedField('job1Location')}
                            onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job1Location', e.currentTarget.innerText)
                                }}
                          >
                            {resumeData.job1Location}
                          </div>
                          <ul 
                            key={activePersona}
                            className={`space-y-1.5 text-sm mt-2 ${ACCENT_STYLES[canvasAccent].bullet} animate-mutate-text`}
                          >
                            {resumeData.job1Bullets.map((bulletText, idx) => {
                              const fieldKey = `job1Bullet_${idx}`
                              return (
                                <li 
                                  key={idx}
                                  className="group relative w-full flex items-start pl-5"
                                >
                                  {/* Custom Bullet point indicator */}
                                  <span className="absolute left-1 top-2 h-1.5 w-1.5 rounded-full bg-slate-400 select-none"></span>

                                  {/* Trash Icon Button */}
                                  <button
                                    onClick={() => {
                                      deleteBullet('job1Bullets', idx)
                                      if (idx > 0) {
                                        focusPreviousBullet('job1Bullets', idx)
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 text-slate-400 hover:text-red-500 bg-transparent p-1 transition-all cursor-pointer absolute -left-6 top-px w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 select-none"
                                    title="Delete bullet point"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* The Editable Bullet text container */}
                                  <span
                                    id={`job1Bullet-text-${idx}`}
                                    className={`cursor-text flex-1 focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none ${
                                      bulletText === '' ? 'animate-pulse bg-emerald-50/50 border border-dashed border-emerald-300/60' : ''
                                    }`}
                                    contentEditable 
                                    suppressContentEditableWarning
                                    onFocus={() => setFocusedField(fieldKey as any)}
                                    onBlur={(e) => {
                                      setFocusedField(null)
                                      handleBulletChange('job1Bullets', idx, e.currentTarget.innerText)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && e.currentTarget.innerText.trim() === '') {
                                        e.preventDefault()
                                        deleteBullet('job1Bullets', idx)
                                        focusPreviousBullet('job1Bullets', idx)
                                      }
                                    }}
                                    dangerouslySetInnerHTML={
                                      focusedField === fieldKey || !isSpotlightEnabled
                                        ? undefined
                                        : { __html: highlightKeywords(bulletText, getSpotlightKeywords()) }
                                    }
                                  >
                                    {focusedField === fieldKey || !isSpotlightEnabled ? bulletText : undefined}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>

                          {/* Hover-Revealed Inline Action Bar */}
                          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 h-8 flex items-center justify-center transition-all duration-200 ease-in-out mt-2 w-full select-none">
                            <div className="w-full flex items-center gap-2">
                              <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                              <button
                                onClick={() => {
                                  applyDataChangeWithHistory(prev => ({
                                    ...prev,
                                    job1Bullets: [...prev.job1Bullets, '']
                                  }))
                                  setTimeout(() => {
                                    const element = document.getElementById(`job1Bullet-text-${resumeData.job1Bullets.length}`)
                                    element?.focus()
                                  }, 50)
                                }}
                                className="bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap outline-none"
                              >
                                <span className="text-sm font-bold leading-none">+</span>
                                <span>Add Bullet Point</span>
                              </button>
                              <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                            </div>
                          </div>
                        </div>

                        {/* Inter-Section Hover Divider Row */}
                        {!resumeData.showJob3 && (
                          <div className="group/divider relative w-full h-6 my-1 select-none flex items-center justify-center">
                            {/* Invisible hit-box spanning height */}
                            <div className="absolute inset-0 cursor-pointer"></div>
                            
                            {/* Sleek Dashed Line */}
                            <div className="w-full border-t border-dashed border-emerald-400/50 opacity-0 group-hover/divider:opacity-100 transition-all duration-300 ease-in-out"></div>
                            
                            {/* Centered Add "+" Button Badge */}
                            <button
                              onClick={() => {
                                applyDataChangeWithHistory(prev => ({
                                  ...prev,
                                  showJob3: true,
                                  job3Title: '',
                                  job3Company: '• New Company',
                                  job3Dates: 'Dates',
                                  job3Location: 'Location',
                                  job3Bullets: ['New achievement bullet point.']
                                }))
                                setTimeout(() => {
                                  const element = document.getElementById('job3Title')
                                  element?.focus()
                                }, 50)
                              }}
                              className="opacity-0 group-hover/divider:opacity-100 bg-white hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 w-7 h-7 rounded-full flex items-center justify-center shadow-sm cursor-pointer absolute left-1/2 -translate-x-1/2 transition-all hover:scale-110 duration-150 z-20 outline-none"
                              title="Add New Role"
                            >
                              <span className="text-lg font-bold leading-none">+</span>
                            </button>
                          </div>
                        )}

                        {/* DYNAMIC JOB ENTRY 3 (INSERTED SECTION NODE) */}
                        {resumeData.showJob3 && (
                          <div className={`mt-4 mb-5 block w-full group relative pl-0 ml-0 transition-all duration-200 animate-fadeIn ${
                            isParserSimulatorEnabled 
                              ? 'border-2 border-dashed border-emerald-500/80 bg-emerald-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                              : ''
                          }`}>
                            {isParserSimulatorEnabled && (
                              <div className="absolute left-2 -top-3 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase select-none tracking-wider bg-emerald-500 text-white z-10">
                                [ATS Node: Experience Row 2 | Status: OPTIMIZED - DYNAMIC | Conf: 97%]
                              </div>
                            )}
                            {/* Dynamic left accent indicator bar for interactive editing focus */}
                            <div className="border-accent-bar absolute -left-3 top-0 h-full w-0.5 bg-emerald-400 rounded opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 print:hidden select-none pointer-events-none"></div>
                            <div className="job-header-row flex justify-between items-baseline w-full">
                              <div>
                                <span 
                                  id="job3Title"
                                  className={`font-bold ${ACCENT_STYLES[canvasAccent].title} text-base cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none`} 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onFocus={() => setFocusedField('job3Title')}
                                  onBlur={(e) => {
                                    setFocusedField(null)
                                    handleFieldChange('job3Title', e.currentTarget.innerText)
                                  }}
                                >
                                  {resumeData.job3Title || 'New Job Title'}
                                </span>
                                <span 
                                  className={`font-medium ml-2 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none ${ACCENT_STYLES[canvasAccent].sub}`} 
                                  contentEditable 
                                  suppressContentEditableWarning
                                  onFocus={() => setFocusedField('job3Company')}
                                  onBlur={(e) => {
                                    setFocusedField(null)
                                    handleFieldChange('job3Company', e.currentTarget.innerText)
                                  }}
                                >
                                  {resumeData.job3Company}
                                </span>
                              </div>
                              <div 
                                className={`text-sm font-semibold text-right cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none ${ACCENT_STYLES[canvasAccent].sub}`} 
                                contentEditable 
                                suppressContentEditableWarning
                                onFocus={() => setFocusedField('job3Dates')}
                                onBlur={(e) => {
                                    setFocusedField(null)
                                    handleFieldChange('job3Dates', e.currentTarget.innerText)
                                  }}
                              >
                                {resumeData.job3Dates}
                              </div>
                            </div>

                            {/* Absolute Positioned Remove Role Gutter Button - Sibling of Header Row */}
                            <button
                              onClick={() => {
                                applyDataChangeWithHistory(prev => ({
                                  ...prev,
                                  showJob3: false,
                                  job3Title: '',
                                  job3Company: '',
                                  job3Dates: '',
                                  job3Location: '',
                                  job3Bullets: []
                                }))
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 transition-all cursor-pointer select-none outline-none absolute -right-6 top-1.5"
                              title="Remove Role"
                            >
                              ✕
                            </button>
                            <div 
                              className="text-xs text-slate-400 italic mb-1 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none" 
                              contentEditable 
                              suppressContentEditableWarning
                              onFocus={() => setFocusedField('job3Location')}
                              onBlur={(e) => {
                                    setFocusedField(null)
                                    handleFieldChange('job3Location', e.currentTarget.innerText)
                                  }}
                            >
                              {resumeData.job3Location}
                            </div>
                            
                            <ul className={`space-y-1.5 text-sm mt-2 ${ACCENT_STYLES[canvasAccent].bullet}`}>
                              {(resumeData.job3Bullets || []).map((bulletText, idx) => {
                                const fieldKey = `job3Bullet_${idx}`
                                return (
                                  <li 
                                    key={idx}
                                    className="group relative w-full flex items-start pl-5"
                                  >
                                    {/* Custom Bullet point indicator */}
                                    <span className="absolute left-1 top-2 h-1.5 w-1.5 rounded-full bg-slate-400 select-none"></span>

                                    {/* Trash Icon Button */}
                                    <button
                                      onClick={() => {
                                        deleteBullet('job3Bullets', idx)
                                        if (idx > 0) {
                                          focusPreviousBullet('job3Bullets', idx)
                                        }
                                      }}
                                      className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 text-slate-400 hover:text-red-500 bg-transparent p-1 transition-all cursor-pointer absolute -left-6 top-px w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 select-none"
                                      title="Delete bullet point"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    {/* The Editable Bullet text container */}
                                    <span
                                      id={`job3Bullet-text-${idx}`}
                                      className={`cursor-text flex-1 focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none ${
                                        bulletText === '' ? 'animate-pulse bg-emerald-50/50 border border-dashed border-emerald-300/60' : ''
                                      }`}
                                      contentEditable 
                                      suppressContentEditableWarning
                                      onFocus={() => setFocusedField(fieldKey as any)}
                                      onBlur={(e) => {
                                        setFocusedField(null)
                                        handleBulletChange('job3Bullets', idx, e.currentTarget.innerText)
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && e.currentTarget.innerText.trim() === '') {
                                          e.preventDefault()
                                          deleteBullet('job3Bullets', idx)
                                          focusPreviousBullet('job3Bullets', idx)
                                        }
                                      }}
                                      dangerouslySetInnerHTML={
                                        focusedField === fieldKey || !isSpotlightEnabled
                                          ? undefined
                                          : { __html: highlightKeywords(bulletText, getSpotlightKeywords()) }
                                      }
                                    >
                                      {focusedField === fieldKey || !isSpotlightEnabled ? bulletText : undefined}
                                    </span>
                                  </li>
                                )
                              })}
                            </ul>

                            {/* Hover-Revealed Inline Action Bar */}
                            <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 h-8 flex items-center justify-center transition-all duration-200 ease-in-out mt-2 w-full select-none">
                              <div className="w-full flex items-center gap-2">
                                <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                                <button
                                  onClick={() => {
                                    applyDataChangeWithHistory(prev => ({
                                      ...prev,
                                      job3Bullets: [...(prev.job3Bullets || []), '']
                                    }))
                                    setTimeout(() => {
                                      const element = document.getElementById(`job3Bullet-text-${(resumeData.job3Bullets || []).length}`)
                                      element?.focus()
                                    }, 50)
                                  }}
                                  className="bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap outline-none"
                                >
                                  <span className="text-sm font-bold leading-none">+</span>
                                  <span>Add Bullet Point</span>
                                </button>
                                <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* JOB ENTRY 2 */}
                        <div className={`mt-4 mb-5 block w-full group relative pl-0 ml-0 transition-all duration-200 ${
                          isParserSimulatorEnabled 
                            ? job2Status === 'OPTIMIZED'
                              ? 'border-2 border-dashed border-emerald-500/80 bg-emerald-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                              : job2Status === 'SEMANTIC_GAPS'
                                ? 'border-2 border-dashed border-amber-500/80 bg-amber-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                : 'border-2 border-dashed border-red-500/80 bg-red-50/5 rounded-lg p-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                            : ''
                        }`}>
                          {isParserSimulatorEnabled && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveAtsPopover(activeAtsPopover === 'job2' ? null : 'job2')
                              }}
                              className={`absolute left-2 -top-3 px-1.5 py-0.5 rounded text-[7px] font-mono font-bold uppercase select-none tracking-wider z-40 cursor-pointer transition-all hover:scale-102 hover:shadow-md ${
                                job2Status === 'OPTIMIZED'
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                  : job2Status === 'SEMANTIC_GAPS'
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                                    : 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                              }`}
                              title="Click to view ATS parser feedback"
                            >
                              {`[ATS Node: Experience Row 3 | Status: ${job2Status} | Gaps: ${2 - job2FixedCount}/2 | Conf: ${job2Status === 'OPTIMIZED' ? '98%' : job2Status === 'SEMANTIC_GAPS' ? '70%' : '35%'}]`}
                            </div>
                          )}

                          {isParserSimulatorEnabled && activeAtsPopover === 'job2' && (
                            <div className="absolute left-2 top-4 z-50 bg-white border border-slate-200 rounded-xl shadow-xl p-4 w-72 text-left animate-fadeIn">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span>ATS Audit Details</span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setActiveAtsPopover(null)
                                  }}
                                  className="text-slate-400 hover:text-slate-600 text-[10px] font-bold outline-none"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                                Semantic Gap: Experience bullet list is missing critical operational checklists and hospitality action swaps: 'Operational Checklists' and action words.
                              </p>
                              {job2Status !== 'OPTIMIZED' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!appliedFixes.includes('loungeChecklists')) handleInjectLoungeChecklists()
                                    if (!appliedFixes.includes('swapAnticipate')) handleSwapAnticipate()
                                    if (!appliedFixes.includes('swapAssets')) handleSwapAssets()
                                    setActiveAtsPopover(null)
                                  }}
                                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 underline flex items-center gap-0.5 mt-2.5 cursor-pointer outline-none bg-transparent border-0"
                                >
                                  ⚡ Quick Fix
                                </button>
                              ) : (
                                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-2.5">
                                  <Check className="w-3 h-3" />
                                  <span>Optimized</span>
                                </div>
                              )}
                            </div>
                          )}
                          {/* Dynamic left accent indicator bar for interactive editing focus */}
                          <div className="border-accent-bar absolute -left-3 top-0 h-full w-0.5 bg-emerald-400 rounded opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 print:hidden select-none pointer-events-none"></div>
                          <div className="job-header-row flex justify-between items-baseline w-full">
                            <div>
                              <span 
                                className={`font-bold ${ACCENT_STYLES[canvasAccent].title} text-base cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors`} 
                                contentEditable 
                                suppressContentEditableWarning
                                onFocus={() => setFocusedField('job2Title')}
                                onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job2Title', e.currentTarget.innerText)
                                }}
                              >
                                {resumeData.job2Title}
                              </span>
                              <span 
                                className={`font-medium ml-2 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors ${ACCENT_STYLES[canvasAccent].sub}`} 
                                contentEditable 
                                suppressContentEditableWarning
                                onFocus={() => setFocusedField('job2Company')}
                                onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job2Company', e.currentTarget.innerText)
                                }}
                              >
                                {resumeData.job2Company}
                              </span>
                            </div>
                            <div 
                              className={`text-sm font-semibold text-right cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors ${ACCENT_STYLES[canvasAccent].sub}`} 
                              contentEditable 
                              suppressContentEditableWarning
                              onFocus={() => setFocusedField('job2Dates')}
                              onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job2Dates', e.currentTarget.innerText)
                                }}
                            >
                              {resumeData.job2Dates}
                            </div>
                          </div>
                          <div 
                            className="text-xs text-slate-400 italic mb-1 cursor-text focus:bg-slate-50/50 p-1 rounded transition-colors" 
                            contentEditable 
                            suppressContentEditableWarning
                            onFocus={() => setFocusedField('job2Location')}
                            onBlur={(e) => {
                                  setFocusedField(null)
                                  handleFieldChange('job2Location', e.currentTarget.innerText)
                                }}
                          >
                            {resumeData.job2Location}
                          </div>
                          <ul 
                            key={activePersona}
                            className={`space-y-1.5 text-sm mt-2 ${ACCENT_STYLES[canvasAccent].bullet} animate-mutate-text`}
                          >
                            {resumeData.job2Bullets.map((bulletText, idx) => {
                              const fieldKey = `job2Bullet_${idx}`
                              return (
                                <li 
                                  key={idx}
                                  className="group relative w-full flex items-start pl-5"
                                >
                                  {/* Custom Bullet point indicator */}
                                  <span className="absolute left-1 top-2 h-1.5 w-1.5 rounded-full bg-slate-400 select-none"></span>

                                  {/* Trash Icon Button */}
                                  <button
                                    onClick={() => {
                                      deleteBullet('job2Bullets', idx)
                                      if (idx > 0) {
                                        focusPreviousBullet('job2Bullets', idx)
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 text-slate-400 hover:text-red-500 bg-transparent p-1 transition-all cursor-pointer absolute -left-6 top-px w-5 h-5 flex items-center justify-center rounded hover:bg-slate-100 select-none"
                                    title="Delete bullet point"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* The Editable Bullet text container */}
                                  <span
                                    id={`job2Bullet-text-${idx}`}
                                    className={`cursor-text flex-1 focus:bg-slate-50/50 p-1 rounded transition-colors focus:outline-none ${
                                      bulletText === '' ? 'animate-pulse bg-emerald-50/50 border border-dashed border-emerald-300/60' : ''
                                    }`}
                                    contentEditable 
                                    suppressContentEditableWarning
                                    onFocus={() => setFocusedField(fieldKey as any)}
                                    onBlur={(e) => {
                                      setFocusedField(null)
                                      handleBulletChange('job2Bullets', idx, e.currentTarget.innerText)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && e.currentTarget.innerText.trim() === '') {
                                        e.preventDefault()
                                        deleteBullet('job2Bullets', idx)
                                        focusPreviousBullet('job2Bullets', idx)
                                      }
                                    }}
                                    dangerouslySetInnerHTML={
                                      focusedField === fieldKey || !isSpotlightEnabled
                                        ? undefined
                                        : { __html: highlightKeywords(bulletText, getSpotlightKeywords()) }
                                    }
                                  >
                                    {focusedField === fieldKey || !isSpotlightEnabled ? bulletText : undefined}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>

                          {/* Hover-Revealed Inline Action Bar */}
                          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 h-8 flex items-center justify-center transition-all duration-200 ease-in-out mt-2 w-full select-none">
                            <div className="w-full flex items-center gap-2">
                              <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                              <button
                                onClick={() => {
                                  applyDataChangeWithHistory(prev => ({
                                    ...prev,
                                    job2Bullets: [...prev.job2Bullets, '']
                                  }))
                                  setTimeout(() => {
                                    const element = document.getElementById(`job2Bullet-text-${resumeData.job2Bullets.length}`)
                                    element?.focus()
                                  }, 50)
                                }}
                                className="bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer whitespace-nowrap outline-none"
                              >
                                <span className="text-sm font-bold leading-none">+</span>
                                <span>Add Bullet Point</span>
                              </button>
                              <div className="flex-1 border-t border-dashed border-slate-200/65"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  </div>
                  </div>

                    <p className="text-[10px] text-center text-slate-400 py-4 select-none">
                      A4 standard spacing constraints applied. All manual keystrokes dynamically re-verify compliance against ATS algorithms.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Condensed Scan Dashboard Reference Panel */}
              <div className="flex-1 max-w-[50%] w-full bg-white overflow-y-auto custom-scrollbar flex flex-col p-6 space-y-6 shrink-0 z-10 shadow-sm border border-slate-200 rounded-xl">
                
                {/* 1. Score Meter Reference Widget */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50 flex items-center justify-between relative group/score">
                  <div className="space-y-1 select-none flex-1 pr-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">ATS Score Panel</span>
                    <h4 className="font-extrabold text-sm text-slate-800 leading-none flex items-center gap-1.5">
                      Real-Time Alignment
                      {isAutoOptimizing && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-emerald-100 text-emerald-800 animate-pulse">
                          Optimizing...
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-1">
                      Target score adapts dynamically to your manual updates.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {/* Glowing One-Click Auto-Optimize Button */}
                      <button
                        onClick={handleAutoOptimize}
                        disabled={isAutoOptimizing || analysisResults.matchScore >= 95}
                        className={`relative overflow-hidden font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer outline-none select-none ${
                          analysisResults.matchScore >= 95
                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-[0_0_15px_rgba(5,164,108,0.3)] hover:shadow-[0_0_20px_rgba(5,164,108,0.5)] hover:scale-102 hover:rotate-1'
                        }`}
                      >
                        <Zap className={`w-3 h-3 ${isAutoOptimizing ? 'animate-bounce text-yellow-300' : 'text-yellow-300 animate-pulse'}`} />
                        <span>{analysisResults.matchScore >= 95 ? 'Fully Optimized' : isAutoOptimizing ? `Applying Audit ${optimizingStep}/5...` : '⚡ Auto-Optimize Resume'}</span>
                      </button>

                      {/* Recruiter Eye Scanner Toggle - Secondary Fallback in Right Panel */}
                      <button
                        onClick={() => setIsParserSimulatorEnabled(!isParserSimulatorEnabled)}
                        className={`relative overflow-hidden font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer outline-none select-none border ${
                          isParserSimulatorEnabled 
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-[0_0_12px_rgba(99,102,241,0.25)]' 
                            : 'bg-white text-slate-500 hover:text-indigo-600 border-slate-200'
                        }`}
                      >
                        <Eye className={`w-3 h-3 ${isParserSimulatorEnabled ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
                        <span>{isParserSimulatorEnabled ? 'Recruiter Eye: ON' : '👁️ Recruiter Eye'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Radial score gauge */}
                  <div className="relative flex items-center justify-center h-24 w-24 shrink-0 select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#05a46c"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * analysisResults.matchScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-800">{analysisResults.matchScore}%</span>
                      <span className="text-[8px] uppercase font-bold text-[#05a46c] tracking-widest mt-0.5">MATCH</span>
                    </div>
                  </div>
                </div>

                {/* 2. Structural & Contact Info Audits (High Priority) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="h-2 w-2 rounded-full bg-[#1c3d5a]"></span>
                    Structural & Contact Audits (High Priority)
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-[10px] text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[8px]">
                          <th className="px-3 py-2 w-1/4">Location/Category</th>
                          <th className="px-3 py-2 w-1/3">Current Resume Text</th>
                          <th className="px-3 py-2 w-1/3">Suggested Optimization</th>
                          <th className="px-3 py-2 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Document Header & Body
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('header') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  `VIRADETH ARCH` (Top) vs. `Viradeth Xay-ananh` (Body)
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block">
                                  Verified Clean Identity
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['duplicate contact audit']?.fraction || (!appliedFixes.includes('header') ? '2/1' : '1/1')}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('header') ? (
                              <span>
                                <strong>CRITICAL FIX:</strong> Delete the duplicate identity block inside the experience text. Standardize the document under a single master header.
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">
                                Layout matches a single consistent profile header.
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('header') ? (
                              <button
                                onClick={handleCleanHeader}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[9px] font-bold px-2 py-1 rounded-md border border-rose-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoHeader}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Deep-Dive Content Gaps (Missing Core Competencies) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                    Deep-Dive Content Gaps (Marriott Hospitality Standards)
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-[10px] text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[8px]">
                          <th className="px-3 py-2 w-1/4">Location/Category</th>
                          <th className="px-3 py-2 w-1/3">Current Resume Text</th>
                          <th className="px-3 py-2 w-1/3">Suggested Optimization</th>
                          <th className="px-3 py-2 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Lounge Monitoring Row */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Experience: Security Role
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('loungeMonitoring') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  *Missing Club Lounge Monitoring*
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block">
                                  Monitored club lounge...
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['club lounge monitoring']?.fraction || '0/1'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('loungeMonitoring') ? (
                              <span>
                                <strong>ADD METRIC:</strong> Insert: <em>"Monitored club lounge for seating availability, service flow, and guest well-being according to luxury property standards."</em>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">Club lounge capacity checklists integrated.</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('loungeMonitoring') ? (
                              <button
                                onClick={handleInjectLoungeMonitoring}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[9px] font-bold px-2 py-1 rounded-md border border-rose-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoLoungeMonitoring}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Operational Checklists Row */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Experience: Security Role
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('loungeChecklists') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  *Missing Operational Checklists*
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block">
                                  Reviewed shift logs...
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['operational checklists']?.fraction || '0/1'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('loungeChecklists') ? (
                              <span>
                                <strong>ADD KEYWORD:</strong> Insert: <em>"Reviewed shift logs and daily memo books to document and communicate pertinent information across shifts."</em>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">Shift log handover compliance met.</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('loungeChecklists') ? (
                              <button
                                onClick={handleInjectLoungeChecklists}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[9px] font-bold px-2 py-1 rounded-md border border-rose-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoLoungeChecklists}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Safety Reporting Row */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Experience: Security Role
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('safetyCompliance') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  *Missing Safety Compliance*
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block">
                                  Reported accidents...
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['safety compliance']?.fraction || '0/1'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('safetyCompliance') ? (
                              <span>
                                <strong>ADD COMPLIANCE:</strong> Insert: <em>"Reported accidents, injuries, and unsafe work conditions in accordance with standard regulatory procedures."</em>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">Safety hazard reporting aligned.</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('safetyCompliance') ? (
                              <button
                                onClick={handleInjectSafetyCompliance}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-800 text-[9px] font-bold px-2 py-1 rounded-md border border-rose-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoSafetyCompliance}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Actionable Phrasing & Keyword Upgrades (Word Swaps) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    Actionable Phrasing Upgrades (Word Swaps)
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse text-[10px] text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[8px]">
                          <th className="px-3 py-2 w-1/4">Location/Category</th>
                          <th className="px-3 py-2 w-1/3">Current Resume Text</th>
                          <th className="px-3 py-2 w-1/3">Suggested Optimization</th>
                          <th className="px-3 py-2 w-12 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Swap 1: Guest Needs Swap */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Experience: Host / Security
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('swapAnticipate') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  `Anticipate and address`
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block text-xs">
                                  Anticipate Guests' Service Needs
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['guest needs phrase']?.fraction || '0/1'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('swapAnticipate') ? (
                              <span>
                                <strong>SWAP PHRASE:</strong> Change to: <em>"Anticipate guests' service needs with genuine appreciation."</em>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">Marriott guest alignment active.</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('swapAnticipate') ? (
                              <button
                                onClick={handleSwapAnticipate}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[9px] font-bold px-2 py-1 rounded-md border border-amber-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoSwapAnticipate}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Swap 2: Assets Swap */}
                        <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-3 py-2.5 font-semibold text-slate-700 leading-normal">
                            Experience: General Bullet
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-1">
                              {!appliedFixes.includes('swapAssets') ? (
                                <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-mono text-[9px] block">
                                  `Protect company assets`
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200 font-mono text-[9px] block text-xs">
                                  Maintain confidentiality...
                                </span>
                              )}
                              <span className="text-[9px] text-slate-500 font-bold font-mono">
                                Match Ratio: {analysisResults.keywordFrequencies['assets phrase']?.fraction || '0/1'}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-slate-600 leading-normal">
                            {!appliedFixes.includes('swapAssets') ? (
                              <span>
                                <strong>SWAP PHRASE:</strong> Change to: <em>"Maintain confidentiality of proprietary information and protect company assets."</em>
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">Proprietary confidentiality standard met.</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {!appliedFixes.includes('swapAssets') ? (
                              <button
                                onClick={handleSwapAssets}
                                className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-[9px] font-bold px-2 py-1 rounded-md border border-amber-200 transition-colors shrink-0"
                                title="Apply Fix"
                              >
                                Apply Fix
                              </button>
                            ) : (
                              <div className="flex items-center justify-center">
                                <button
                                  className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-3 py-1 rounded text-xs flex items-center gap-1 transition-all duration-200"
                                  disabled
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Applied</span>
                                </button>
                                <button
                                  onClick={handleUndoSwapAssets}
                                  className="text-slate-400 hover:text-slate-600 underline text-[11px] ml-2 cursor-pointer transition-colors font-medium"
                                  title="Undo Fix"
                                >
                                  Undo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5. Aligned Extracted Hard Skills & Administrative Keywords (Fractions) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <span className="h-2 w-2 rounded-full bg-[#05a46c]"></span>
                    Extracted Hard Skills & Keyword Ratios ({analysisResults.presentSkills.length + analysisResults.missingSkills.length})
                  </h4>
                  {analysisResults.presentSkills.length === 0 && analysisResults.missingSkills.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No matching skills identified.</p>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full border-collapse text-[10px] text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[8px]">
                            <th className="px-3 py-2 w-1/3">Target Hard Skill</th>
                            <th className="px-3 py-2 w-1/4 text-center">Resume Frequency</th>
                            <th className="px-3 py-2 w-1/4 text-center">Required Frequency</th>
                            <th className="px-3 py-2 w-1/4 text-center font-bold">Status Ratio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(new Set([...analysisResults.presentSkills, ...analysisResults.missingSkills])).map((skill, idx) => {
                            const freq = analysisResults.keywordFrequencies[skill.toLowerCase()] || { resumeCount: 0, jobDescCount: 1, fraction: '0/1', isMatched: false }
                            const isMatched = freq.isMatched
                            return (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="px-3 py-2 font-semibold text-slate-700 leading-normal">
                                  {skill}
                                </td>
                                <td className="px-3 py-2 text-center font-mono text-[10px]">
                                  <span className={isMatched ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>
                                    {freq.resumeCount} times
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-center font-mono text-[10px] text-slate-500 font-medium">
                                  {freq.jobDescCount} times
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {isMatched ? (
                                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full select-none">{freq.fraction}</span>
                                  ) : (
                                    <span className="text-rose-600 font-bold text-xs bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full select-none">{freq.fraction}</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </main>
        )}

        {/* Background Re-open helper button (only visible when modal is closed & view is dashboard) */}
        {!isModalOpen && !isStrategyModalOpen && !isOptimizing && view === 'dashboard' && (
          <div className="fixed bottom-6 right-6 z-20 shadow-lg">
            <button
              onClick={() => {
                handleReset()
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 bg-[#1c3d5a] hover:bg-[#132c42] text-white font-bold py-3 px-5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border border-slate-700"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              Open New Scan
            </button>
          </div>
        )}

        {/* Modal 1: "New Scan" Interface */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-[#e6f6f1] text-[#05a46c] rounded">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800">New Scan</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Template Selector Panel (Universal design helper) */}
              <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3 overflow-x-auto shrink-0 select-none custom-scrollbar">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  ⚡ Auto-load industry cases:
                </span>
                <div className="flex gap-2">
                  {industryTemplates.map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadIndustryTemplate(template)}
                      className="flex items-center gap-1.5 text-xs bg-white hover:bg-[#e6f6f1] text-slate-700 hover:text-[#05a46c] border border-slate-200 hover:border-[#05a46c]/40 font-semibold py-1.5 px-3 rounded-full transition-all shrink-0 shadow-sm"
                    >
                      <span>{template.icon}</span>
                      <span>{template.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Body - Two Column Layout */}
              <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 custom-scrollbar">
                
                {/* Column 1: Step 1: Upload a resume */}
                <div className="flex flex-col h-full space-y-3 min-h-[350px]">
                  <div className="flex items-center justify-between shrink-0">
                    <h4 className="font-bold text-sm text-slate-800 tracking-wide">
                      Step 1: Upload a resume
                    </h4>
                  </div>

                  {/* Resume textarea */}
                  <div className="flex-1 relative flex flex-col min-h-0">
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Copy and paste resume text here, or use the drag & drop uploader..."
                      className="w-full flex-1 p-4 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-300 transition-all resize-none custom-scrollbar font-sans min-h-[220px]"
                    ></textarea>

                    {resumeText && (
                      <button
                        onClick={() => setResumeText('')}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Clear text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex gap-2 shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.pdf,.doc,.docx"
                      className="hidden"
                    />
                    <button
                      onClick={triggerFileInput}
                      className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-[#f8fafc] hover:bg-slate-50 text-slate-700 text-xs font-bold py-3 px-4 rounded-lg transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Drag & Drop or Upload</span>
                    </button>
                  </div>
                </div>

                {/* Column 2: Step 2: Paste a job description */}
                <div className="flex flex-col h-full space-y-3 min-h-[350px]">
                  <div className="flex items-center justify-between shrink-0">
                    <h4 className="font-bold text-sm text-slate-800 tracking-wide">
                      Step 2: Paste a job description
                    </h4>
                  </div>

                  {/* Job Description textarea */}
                  <div className="flex-1 relative flex flex-col min-h-0">
                    <textarea
                      value={jobDescriptionText}
                      onChange={(e) => setJobDescriptionText(e.target.value)}
                      placeholder="Paste the target job description requirements here..."
                      className="w-full flex-1 p-4 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-1 focus:ring-slate-300 transition-all resize-none custom-scrollbar font-sans min-h-[220px]"
                    ></textarea>

                    {jobDescriptionText && (
                      <button
                        onClick={() => setJobDescriptionText('')}
                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Clear text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Quick actions indicator */}
                  <div className="flex justify-between items-center h-10 px-1 text-[11px] text-slate-400 shrink-0 select-none">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Excluding boilerplate text yields better matches.</span>
                    </div>
                    {(resumeText || jobDescriptionText) && (
                      <button onClick={handleReset} className="font-bold text-slate-500 hover:text-slate-700 transition-colors">
                        Reset inputs
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                
                {/* Dynamically enabled primary "✨ AI Optimize" button */}
                <button
                  onClick={handleOpenStrategyModal}
                  disabled={!resumeText.trim() || !jobDescriptionText.trim()}
                  className={`px-6 py-2.5 text-sm font-bold rounded-lg border flex items-center gap-2 transition-all ${
                    resumeText.trim() && jobDescriptionText.trim()
                      ? 'bg-[#05a46c] text-white hover:bg-[#048e5d] border-[#05a46c] cursor-pointer shadow hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed select-none'
                  }`}
                  title={resumeText.trim() && jobDescriptionText.trim() ? "Align and tailor elements!" : "Please add both resume and job description texts to unlock"}
                >
                  <Sparkles className={`w-4 h-4 ${resumeText.trim() && jobDescriptionText.trim() ? 'text-yellow-300 animate-pulse' : 'text-slate-300'}`} />
                  <span>✨ AI Optimize</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: "Choose Your Optimization Strategy" Modal */}
        {isStrategyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-[#e6f6f1] text-[#05a46c] rounded">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">Choose Your Optimization Strategy</h3>
                </div>
                <button
                  onClick={() => setIsStrategyModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feature Spotlight Content */}
              <div className="p-6 space-y-4">
                <div className="p-5 border border-emerald-500 bg-emerald-50/30 rounded-xl transition-all shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#e6f6f1] text-[#05a46c] rounded-full shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800">One-Page Focus Strategy</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded select-none">
                          ⚡ STANDARD
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Automatically reduce content redundancy to what matters most for this role. Guarantees the generated resume remains clean, dense, and fits **exactly on a single A4 letter page** without breaking margins.
                      </p>
                      <div className="text-[10px] text-emerald-700 font-bold select-none pt-1">
                        ⏱️ ETA: 30–40 SECONDS
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  * Selected strategy matches uploaded layout focus requirements.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsStrategyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={startOptimizationProcess}
                    className="bg-[#05a46c] hover:bg-[#048e5d] text-white font-bold text-xs py-2.5 px-5 rounded-lg shadow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Optimization</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Loading / Optimizing overlay screen */}
        {isOptimizing && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border border-slate-200 text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative flex items-center justify-center h-16 w-16 bg-[#e6f6f1] text-[#05a46c] rounded-full">
                  <Sparkles className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-slate-800 animate-pulse">Optimizing Content Phrasing</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Strategy: One-Page Focus
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#05a46c] h-full transition-all duration-300 rounded-full animate-pulse"
                    style={{ width: `${optimizationProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>{loadingStatusText}</span>
                  <span>{optimizationProgress}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic leading-relaxed">
                Rebuilding hierarchical layouts, pruning boilerplates, and correcting ATS keyword mismatches...
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

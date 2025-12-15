// Mock data storage for owned details (Bank Details, Company Details, Company Process)

export interface BankDetail {
  id: string
  bankName: string
  accountNumber: string
  accountHolderName: string
  ifscCode: string
  branch: string
  accountType: string
  createdAt: string
  updatedAt: string
}

export interface CompanyDetail {
  id: string
  companyName: string
  registrationNumber: string
  gstNumber: string
  panNumber: string
  incorporationDate: string
  registeredAddress: string
  contactEmail: string
  contactPhone: string
  website?: string
  createdAt: string
  updatedAt: string
}

export interface CompanyProcess {
  id: string
  processName: string
  description: string
  steps: string[]
  department: string
  owner: string
  status: "active" | "inactive" | "draft"
  createdAt: string
  updatedAt: string
}

// Mock data
const bankDetails: BankDetail[] = [
  {
    id: "1",
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    accountHolderName: "ABC Finance Ltd",
    ifscCode: "HDFC0001234",
    branch: "MG Road Branch",
    accountType: "Current Account",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    bankName: "ICICI Bank",
    accountNumber: "02340056789123",
    accountHolderName: "ABC Finance Ltd",
    ifscCode: "ICIC0002340",
    branch: "Corporate Branch",
    accountType: "Current Account",
    createdAt: "2024-02-20T11:30:00Z",
    updatedAt: "2024-02-20T11:30:00Z",
  },
]

const companyDetails: CompanyDetail[] = [
  {
    id: "1",
    companyName: "ABC Finance Limited",
    registrationNumber: "U67190KA2020PTC123456",
    gstNumber: "29AABCU9603R1ZX",
    panNumber: "AABCU9603R",
    incorporationDate: "2020-03-15",
    registeredAddress: "456 Finance Street, Bangalore, Karnataka 560001",
    contactEmail: "contact@abcfinance.com",
    contactPhone: "+91 80 1234 5678",
    website: "https://www.abcfinance.com",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-12-01T14:20:00Z",
  },
]

const companyProcesses: CompanyProcess[] = [
  {
    id: "1",
    processName: "Lead Onboarding",
    description: "Process for onboarding new leads into the system",
    steps: [
      "Receive lead information from marketing",
      "Verify contact details and documentation",
      "Assign to appropriate vendor based on loan type",
      "Schedule initial consultation",
      "Update status in CRM",
    ],
    department: "Sales",
    owner: "Sales Manager",
    status: "active",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-11-15T16:30:00Z",
  },
  {
    id: "2",
    processName: "Loan Approval Workflow",
    description: "Complete workflow for loan application approval",
    steps: [
      "Document collection and verification",
      "Credit score check",
      "Financial assessment",
      "Risk analysis",
      "Management approval",
      "Disbursement processing",
    ],
    department: "Operations",
    owner: "Operations Head",
    status: "active",
    createdAt: "2024-03-05T11:20:00Z",
    updatedAt: "2024-12-10T09:45:00Z",
  },
  {
    id: "3",
    processName: "Vendor Commission Calculation",
    description: "Monthly process for calculating and disbursing vendor commissions",
    steps: [
      "Collect approved loan data for the month",
      "Calculate commissions based on bank-wise rates",
      "Generate commission reports",
      "Get finance approval",
      "Process payments",
      "Send commission statements to vendors",
    ],
    department: "Finance",
    owner: "Finance Manager",
    status: "active",
    createdAt: "2024-03-10T14:00:00Z",
    updatedAt: "2024-12-28T11:15:00Z",
  },
]

// CRUD for Bank Details
export function getBankDetails(): BankDetail[] {
  return [...bankDetails]
}

export function addBankDetail(detail: Omit<BankDetail, "id" | "createdAt" | "updatedAt">): BankDetail {
  const newDetail: BankDetail = {
    ...detail,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  bankDetails.push(newDetail)
  return newDetail
}

export function updateBankDetail(
  id: string,
  updates: Partial<Omit<BankDetail, "id" | "createdAt">>,
): BankDetail | null {
  const index = bankDetails.findIndex((d) => d.id === id)
  if (index === -1) return null
  bankDetails[index] = { ...bankDetails[index], ...updates, updatedAt: new Date().toISOString() }
  return bankDetails[index]
}

export function deleteBankDetail(id: string): boolean {
  const index = bankDetails.findIndex((d) => d.id === id)
  if (index === -1) return false
  bankDetails.splice(index, 1)
  return true
}

// CRUD for Company Details
export function getCompanyDetails(): CompanyDetail[] {
  return [...companyDetails]
}

export function addCompanyDetail(detail: Omit<CompanyDetail, "id" | "createdAt" | "updatedAt">): CompanyDetail {
  const newDetail: CompanyDetail = {
    ...detail,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  companyDetails.push(newDetail)
  return newDetail
}

export function updateCompanyDetail(
  id: string,
  updates: Partial<Omit<CompanyDetail, "id" | "createdAt">>,
): CompanyDetail | null {
  const index = companyDetails.findIndex((d) => d.id === id)
  if (index === -1) return null
  companyDetails[index] = { ...companyDetails[index], ...updates, updatedAt: new Date().toISOString() }
  return companyDetails[index]
}

export function deleteCompanyDetail(id: string): boolean {
  const index = companyDetails.findIndex((d) => d.id === id)
  if (index === -1) return false
  companyDetails.splice(index, 1)
  return true
}

// CRUD for Company Processes
export function getCompanyProcesses(): CompanyProcess[] {
  return [...companyProcesses]
}

export function addCompanyProcess(process: Omit<CompanyProcess, "id" | "createdAt" | "updatedAt">): CompanyProcess {
  const newProcess: CompanyProcess = {
    ...process,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  companyProcesses.push(newProcess)
  return newProcess
}

export function updateCompanyProcess(
  id: string,
  updates: Partial<Omit<CompanyProcess, "id" | "createdAt">>,
): CompanyProcess | null {
  const index = companyProcesses.findIndex((p) => p.id === id)
  if (index === -1) return null
  companyProcesses[index] = { ...companyProcesses[index], ...updates, updatedAt: new Date().toISOString() }
  return companyProcesses[index]
}

export function deleteCompanyProcess(id: string): boolean {
  const index = companyProcesses.findIndex((p) => p.id === id)
  if (index === -1) return false
  companyProcesses.splice(index, 1)
  return true
}

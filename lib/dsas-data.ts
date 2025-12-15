// Mock data storage for DSAs
export interface BankCommission {
  bankId: string
  bankName: string
  commissionRate: number // percentage
}

export interface DSA {
  id: string
  ownerName: string
  companyName: string
  gstNumber: string
  officeAddress: string
  loanTypes: string[] // Array of loan type names
  bankCommissions: BankCommission[]
  createdAt: string
  updatedAt: string
}

// Mock DSAs data
const dsas: DSA[] = [
  {
    id: "dsa-1",
    ownerName: "Suresh Reddy",
    companyName: "Prime Loan Services Pvt Ltd",
    gstNumber: "29ABCDE1234F1Z5",
    officeAddress: "45 Business Park, Bangalore, Karnataka 560078",
    loanTypes: ["Home Loan", "Mortgage Loan"],
    bankCommissions: [
      { bankId: "1", bankName: "HDFC Bank", commissionRate: 2.5 },
      { bankId: "2", bankName: "ICICI Bank", commissionRate: 2.0 },
    ],
    createdAt: "2024-12-01T09:00:00Z",
    updatedAt: "2025-01-10T14:30:00Z",
  },
  {
    id: "dsa-2",
    ownerName: "Meera Joshi",
    companyName: "Capital Finance Solutions",
    gstNumber: "27FGHIJ5678K2L6",
    officeAddress: "128 Market Street, Mumbai, Maharashtra 400001",
    loanTypes: ["Personal Loan", "Home Loan"],
    bankCommissions: [
      { bankId: "3", bankName: "State Bank of India", commissionRate: 1.8 },
      { bankId: "4", bankName: "Axis Bank", commissionRate: 2.2 },
    ],
    createdAt: "2024-11-15T11:20:00Z",
    updatedAt: "2025-01-08T10:15:00Z",
  },
]

// CRUD operations for DSAs
export function getDSAs(): DSA[] {
  return [...dsas]
}

export function getDSAById(id: string): DSA | undefined {
  return dsas.find((dsa) => dsa.id === id)
}

export function addDSA(dsa: Omit<DSA, "id" | "createdAt" | "updatedAt">): DSA {
  const newDSA: DSA = {
    ...dsa,
    id: `dsa-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  dsas.push(newDSA)
  return newDSA
}

export function updateDSA(id: string, updates: Partial<Omit<DSA, "id" | "createdAt">>): DSA | null {
  const index = dsas.findIndex((dsa) => dsa.id === id)
  if (index === -1) return null
  dsas[index] = {
    ...dsas[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return dsas[index]
}

export function deleteDSA(id: string): boolean {
  const index = dsas.findIndex((dsa) => dsa.id === id)
  if (index === -1) return false
  dsas.splice(index, 1)
  return true
}

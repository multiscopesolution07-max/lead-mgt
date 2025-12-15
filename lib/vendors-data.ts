// Mock data storage for vendors
export interface BankCommission {
  bankId: string
  bankName: string
  commissionRate: number // percentage
}

export interface Vendor {
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

// Mock vendors data
const vendors: Vendor[] = [
  {
    id: "vendor-1",
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
    id: "vendor-2",
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

// CRUD operations for Vendors
export function getVendors(): Vendor[] {
  return [...vendors]
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((vendor) => vendor.id === id)
}

export function addVendor(vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Vendor {
  const newVendor: Vendor = {
    ...vendor,
    id: `vendor-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  vendors.push(newVendor)
  return newVendor
}

export function updateVendor(id: string, updates: Partial<Omit<Vendor, "id" | "createdAt">>): Vendor | null {
  const index = vendors.findIndex((vendor) => vendor.id === id)
  if (index === -1) return null
  vendors[index] = {
    ...vendors[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return vendors[index]
}

export function deleteVendor(id: string): boolean {
  const index = vendors.findIndex((vendor) => vendor.id === id)
  if (index === -1) return false
  vendors.splice(index, 1)
  return true
}

// Mock data storage for settings
export interface LoanType {
  id: string
  name: string
  description: string
}

export interface EmployeeType {
  id: string
  name: string
  description: string
}

export interface AddressType {
  id: string
  name: string
}

export interface BankName {
  id: string
  name: string
  code: string
}

// Initialize with default data
const loanTypes: LoanType[] = [
  { id: "1", name: "Home Loan", description: "Loans for purchasing residential property" },
  { id: "2", name: "Mortgage Loan", description: "Property-backed financing" },
  { id: "3", name: "Personal Loan", description: "Unsecured personal financing" },
]

const employeeTypes: EmployeeType[] = [
  { id: "1", name: "Salaried", description: "Regular salaried employees" },
  { id: "2", name: "Self Employed", description: "Business owners and freelancers" },
  { id: "3", name: "Professional", description: "Doctors, Lawyers, CAs, etc." },
]

const addressTypes: AddressType[] = [
  { id: "1", name: "Home" },
  { id: "2", name: "Office" },
  { id: "3", name: "Temporary" },
]

const bankNames: BankName[] = [
  { id: "1", name: "HDFC Bank", code: "HDFC0001234" },
  { id: "2", name: "ICICI Bank", code: "ICIC0001234" },
  { id: "3", name: "State Bank of India", code: "SBIN0001234" },
  { id: "4", name: "Axis Bank", code: "UTIB0001234" },
]

// CRUD operations for Loan Types
export function getLoanTypes(): LoanType[] {
  return [...loanTypes]
}

export function addLoanType(loanType: Omit<LoanType, "id">): LoanType {
  const newLoanType = { ...loanType, id: Date.now().toString() }
  loanTypes.push(newLoanType)
  return newLoanType
}

export function updateLoanType(id: string, updates: Partial<Omit<LoanType, "id">>): LoanType | null {
  const index = loanTypes.findIndex((lt) => lt.id === id)
  if (index === -1) return null
  loanTypes[index] = { ...loanTypes[index], ...updates }
  return loanTypes[index]
}

export function deleteLoanType(id: string): boolean {
  const index = loanTypes.findIndex((lt) => lt.id === id)
  if (index === -1) return false
  loanTypes.splice(index, 1)
  return true
}

// CRUD operations for Employee Types
export function getEmployeeTypes(): EmployeeType[] {
  return [...employeeTypes]
}

export function addEmployeeType(employeeType: Omit<EmployeeType, "id">): EmployeeType {
  const newEmployeeType = { ...employeeType, id: Date.now().toString() }
  employeeTypes.push(newEmployeeType)
  return newEmployeeType
}

export function updateEmployeeType(id: string, updates: Partial<Omit<EmployeeType, "id">>): EmployeeType | null {
  const index = employeeTypes.findIndex((et) => et.id === id)
  if (index === -1) return null
  employeeTypes[index] = { ...employeeTypes[index], ...updates }
  return employeeTypes[index]
}

export function deleteEmployeeType(id: string): boolean {
  const index = employeeTypes.findIndex((et) => et.id === id)
  if (index === -1) return false
  employeeTypes.splice(index, 1)
  return true
}

// CRUD operations for Address Types
export function getAddressTypes(): AddressType[] {
  return [...addressTypes]
}

export function addAddressType(addressType: Omit<AddressType, "id">): AddressType {
  const newAddressType = { ...addressType, id: Date.now().toString() }
  addressTypes.push(newAddressType)
  return newAddressType
}

export function updateAddressType(id: string, updates: Partial<Omit<AddressType, "id">>): AddressType | null {
  const index = addressTypes.findIndex((at) => at.id === id)
  if (index === -1) return null
  addressTypes[index] = { ...addressTypes[index], ...updates }
  return addressTypes[index]
}

export function deleteAddressType(id: string): boolean {
  const index = addressTypes.findIndex((at) => at.id === id)
  if (index === -1) return false
  addressTypes.splice(index, 1)
  return true
}

// CRUD operations for Bank Names
export function getBankNames(): BankName[] {
  return [...bankNames]
}

export function addBankName(bankName: Omit<BankName, "id">): BankName {
  const newBankName = { ...bankName, id: Date.now().toString() }
  bankNames.push(newBankName)
  return newBankName
}

export function updateBankName(id: string, updates: Partial<Omit<BankName, "id">>): BankName | null {
  const index = bankNames.findIndex((bn) => bn.id === id)
  if (index === -1) return null
  bankNames[index] = { ...bankNames[index], ...updates }
  return bankNames[index]
}

export function deleteBankName(id: string): boolean {
  const index = bankNames.findIndex((bn) => bn.id === id)
  if (index === -1) return false
  bankNames.splice(index, 1)
  return true
}

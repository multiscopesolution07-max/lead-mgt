// Mock data storage for leads
export interface Lead {
  id: string
  name: string
  mobileNumber: string
  email: string
  fullAddress: string
  addressType: string
  employeeType: string
  loanType: string
  loanAmount: number
  dsaPartnerId?: string
  assignedDsaId?: string
  assignedTeamMemberId?: string
  finalStatus?: "approved" | "rejected" | "pending" | null
  status: "pending" | "in_progress" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

// Mock leads data
const leads: Lead[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    mobileNumber: "+91 98765 43210",
    email: "rajesh.kumar@example.com",
    fullAddress: "123 MG Road, Bangalore, Karnataka 560001",
    addressType: "Home",
    employeeType: "Salaried",
    loanType: "Home Loan",
    loanAmount: 5000000,
    dsaPartnerId: "dsa-1",
    assignedDsaId: "dsa-1",
    assignedTeamMemberId: "team-1",
    finalStatus: null,
    status: "in_progress",
    createdAt: "2025-01-10T10:30:00Z",
    updatedAt: "2025-01-11T14:20:00Z",
  },
  {
    id: "2",
    name: "Priya Sharma",
    mobileNumber: "+91 87654 32109",
    email: "priya.sharma@example.com",
    fullAddress: "45 Park Street, Kolkata, West Bengal 700016",
    addressType: "Office",
    employeeType: "Self Employed",
    loanType: "Mortgage Loan",
    loanAmount: 3500000,
    status: "pending",
    createdAt: "2025-01-12T09:15:00Z",
    updatedAt: "2025-01-12T09:15:00Z",
  },
  {
    id: "3",
    name: "Amit Patel",
    mobileNumber: "+91 76543 21098",
    email: "amit.patel@example.com",
    fullAddress: "78 Nehru Nagar, Mumbai, Maharashtra 400001",
    addressType: "Home",
    employeeType: "Professional",
    loanType: "Personal Loan",
    loanAmount: 1500000,
    dsaPartnerId: "dsa-2",
    assignedDsaId: "dsa-2",
    assignedTeamMemberId: "team-2",
    finalStatus: "approved",
    status: "approved",
    createdAt: "2025-01-08T11:45:00Z",
    updatedAt: "2025-01-11T16:30:00Z",
  },
]

// CRUD operations for Leads
export function getLeads(): Lead[] {
  return [...leads]
}

export function getLeadById(id: string): Lead | undefined {
  return leads.find((lead) => lead.id === id)
}

export function getLeadsByDSAPartner(dsaPartnerId: string): Lead[] {
  return leads.filter((lead) => lead.dsaPartnerId === dsaPartnerId)
}

export function addLead(lead: Omit<Lead, "id" | "createdAt" | "updatedAt">): Lead {
  const newLead: Lead = {
    ...lead,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  leads.push(newLead)
  return newLead
}

export function updateLead(id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>): Lead | null {
  const index = leads.findIndex((lead) => lead.id === id)
  if (index === -1) return null
  leads[index] = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return leads[index]
}

export function deleteLead(id: string): boolean {
  const index = leads.findIndex((lead) => lead.id === id)
  if (index === -1) return false
  leads.splice(index, 1)
  return true
}

export function assignLeadToDSAPartner(leadId: string, dsaPartnerId: string): Lead | null {
  return updateLead(leadId, { dsaPartnerId, status: "in_progress" })
}

export function assignLeadToDsa(leadId: string, dsaId: string): Lead | null {
  return updateLead(leadId, { assignedDsaId: dsaId, status: "in_progress" })
}

export function assignLeadToTeamMember(leadId: string, teamMemberId: string): Lead | null {
  return updateLead(leadId, { assignedTeamMemberId: teamMemberId, status: "in_progress" })
}

export function updateFinalStatus(leadId: string, finalStatus: "approved" | "rejected" | "pending"): Lead | null {
  return updateLead(leadId, { finalStatus })
}

export function getLeadsByDsa(dsaId: string): Lead[] {
  return leads.filter((lead) => lead.assignedDsaId === dsaId)
}

export function getLeadsByTeamMember(teamMemberId: string): Lead[] {
  return leads.filter((lead) => lead.assignedTeamMemberId === teamMemberId)
}

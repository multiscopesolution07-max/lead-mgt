import type { UserRole } from "./auth-context"

export interface UserData {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  status: "active" | "inactive"
  createdAt: string
  vendorId?: string
  dsaId?: string
}

// Mock users data
const users: UserData[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "super_admin",
    phone: "+91 98765 43210",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    role: "lead_systems_manager",
    phone: "+91 98765 43211",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    name: "Vendor User",
    email: "vendor@example.com",
    role: "vendor",
    phone: "+91 98765 43212",
    status: "active",
    createdAt: "2024-01-03",
    vendorId: "vendor-1",
  },
  {
    id: "4",
    name: "DSA User",
    email: "dsa@example.com",
    role: "dsa",
    phone: "+91 98765 43213",
    status: "active",
    createdAt: "2024-01-04",
  },
  {
    id: "5",
    name: "DSA Team Member",
    email: "dsateam@example.com",
    role: "dsa_team_member",
    phone: "+91 98765 43214",
    status: "active",
    createdAt: "2024-01-05",
    dsaId: "4",
  },
  {
    id: "6",
    name: "Lead Creator User",
    email: "leadcreator@example.com",
    role: "lead_creator",
    phone: "+91 98765 43215",
    status: "active",
    createdAt: "2024-01-06",
  },
]

export function getAllUsers(): UserData[] {
  return users
}

export function getUserById(id: string): UserData | undefined {
  return users.find((user) => user.id === id)
}

export function getUsersByRole(role: UserRole): UserData[] {
  return users.filter((user) => user.role === role)
}

export function addUser(user: Omit<UserData, "id" | "createdAt">): UserData {
  const newUser: UserData = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
  }
  users.push(newUser)
  return newUser
}

export function updateUser(id: string, updates: Partial<UserData>): UserData | null {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  return users[index]
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex((user) => user.id === id)
  if (index === -1) return false

  users.splice(index, 1)
  return true
}

export function getRoleLabel(role: UserRole): string {
  const roleLabels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    lead_systems_manager: "Lead Systems Manager",
    vendor: "Vendor",
    dsa: "DSA",
    dsa_team_member: "DSA Team Member",
    lead_creator: "Lead Creator",
  }
  return roleLabels[role]
}

export function getRoleColor(role: UserRole): string {
  const roleColors: Record<UserRole, string> = {
    super_admin: "bg-red-100 text-red-800",
    lead_systems_manager: "bg-blue-100 text-blue-800",
    vendor: "bg-green-100 text-green-800",
    dsa: "bg-purple-100 text-purple-800",
    dsa_team_member: "bg-indigo-100 text-indigo-800",
    lead_creator: "bg-orange-100 text-orange-800",
  }
  return roleColors[role]
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole =
  | "super_admin"
  | "lead_systems_manager"
  | "dsa_partner"
  | "dsa"
  | "dsa_team_member"
  | "lead_creator"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  dsaPartnerId?: string // Only for DSA partner users
  dsaId?: string // Only for DSA team members
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "super_admin",
  },
  {
    id: "2",
    name: "Manager User",
    email: "manager@example.com",
    password: "manager123",
    role: "lead_systems_manager",
  },
  {
    id: "3",
    name: "DSA Partner User",
    email: "dsapartner@example.com",
    password: "dsapartner123",
    role: "dsa_partner",
    dsaPartnerId: "dsa-1",
  },
  {
    id: "4",
    name: "DSA User",
    email: "dsa@example.com",
    password: "dsa123",
    role: "dsa",
  },
  {
    id: "5",
    name: "DSA Team Member",
    email: "dsateam@example.com",
    password: "dsateam123",
    role: "dsa_team_member",
    dsaId: "4", // Belongs to DSA with id "4"
  },
  {
    id: "6",
    name: "Lead Creator User",
    email: "leadcreator@example.com",
    password: "leadcreator123",
    role: "lead_creator",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Role-based access control helper
export function hasAccess(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

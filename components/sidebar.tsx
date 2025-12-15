"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth, hasAccess } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Building2, FileText, Settings, Database, Wrench, UserCog } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: Array<"super_admin" | "lead_systems_manager" | "dsa_partner" | "dsa" | "dsa_team_member">
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "lead_systems_manager", "dsa_partner", "dsa", "dsa_team_member"],
  },
  {
    title: "Leads",
    href: "/leads",
    icon: Users,
    roles: ["super_admin", "lead_systems_manager", "dsa_partner","dsa", "dsa_team_member"],
  },
  {
    title: "DSA Partners",
    href: "/dsa-partners",
    icon: Building2,
    roles: ["super_admin"],
  },
  {
    title: "My Team",
    href: "/my-team",
    icon: Users,
    roles: ["dsa"],
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["super_admin", "lead_systems_manager", "dsa_partner"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
  {
    title: "Owned Details",
    href: "/owned-details",
    icon: Database,
    roles: ["super_admin"],
  },
  {
    title: "Setup Guide",
    href: "/setup",
    icon: Wrench,
    roles: ["super_admin"],
  },
  {
    title: "User Management",
    href: "/users",
    icon: UserCog,
    roles: ["super_admin"],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null
  
  const filteredNavItems = navItems.filter((item) => hasAccess(user.role, item.roles))

  return (
    <aside className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

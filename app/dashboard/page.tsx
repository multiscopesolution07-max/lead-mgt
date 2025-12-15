"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  UserCheck,
  DollarSign,
} from "lucide-react"
import { getLeads, getLeadsByDsa, getLeadsByTeamMember, getLeadsByDSAPartner } from "@/lib/leads-data"
import { getDSAs } from "@/lib/dsas-data"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const allLeads = getLeads()
  const dsaPartners = getDSAs()

  let userLeads = allLeads
  if (user.role === "dsa") {
    userLeads = getLeadsByDsa(user.id)
  } else if (user.role === "dsa_team_member") {
    userLeads = getLeadsByTeamMember(user.id)
  } else if (user.role === "dsa_partner") {
    userLeads = getLeadsByDSAPartner(user.dsaPartnerId!)
  }

  const totalLeads =
    user.role === "super_admin" || user.role === "lead_systems_manager" ? allLeads.length : userLeads.length
  const pendingLeads = userLeads.filter((lead) => lead.status === "pending").length
  const inProgressLeads = userLeads.filter((lead) => lead.status === "in_progress").length
  const approvedLeads = userLeads.filter((lead) => lead.status === "approved").length
  const rejectedLeads = userLeads.filter((lead) => lead.status === "rejected").length
  const conversionRate = totalLeads > 0 ? ((approvedLeads / totalLeads) * 100).toFixed(1) : "0"

  const totalLoanAmount = userLeads.reduce((sum, lead) => sum + lead.loanAmount, 0)
  const approvedLoanAmount = userLeads
    .filter((lead) => lead.status === "approved")
    .reduce((sum, lead) => sum + lead.loanAmount, 0)

  const dsaStats =
    user.role === "super_admin"
      ? (() => {
          const dsaLeads = new Map<
            string,
            { total: number; pending: number; inProgress: number; approved: number; rejected: number; dsaName: string }
          >()

          allLeads.forEach((lead) => {
            if (lead.assignedDsaId) {
              if (!dsaLeads.has(lead.assignedDsaId)) {
                dsaLeads.set(lead.assignedDsaId, {
                  total: 0,
                  pending: 0,
                  inProgress: 0,
                  approved: 0,
                  rejected: 0,
                  dsaName: `DSA ${lead.assignedDsaId}`,
                })
              }

              const stats = dsaLeads.get(lead.assignedDsaId)!
              stats.total++

              if (lead.status === "pending") stats.pending++
              else if (lead.status === "in_progress") stats.inProgress++
              else if (lead.status === "approved") stats.approved++
              else if (lead.status === "rejected") stats.rejected++
            }
          })

          return Array.from(dsaLeads.entries()).map(([id, stats]) => ({
            id,
            ...stats,
          }))
        })()
      : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}!</h2>
              <p className="text-muted-foreground mt-1">Complete overview of your business performance</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">All leads in system</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{pendingLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting assignment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{inProgressLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Being processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully converted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{rejectedLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Not processed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">Success ratio</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Loan Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{(totalLoanAmount / 10000000).toFixed(2)}Cr</div>
                  <p className="text-xs text-muted-foreground mt-1">Total value</p>
                </CardContent>
              </Card>

              {(user.role === "super_admin" || user.role === "lead_systems_manager") && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active DSA Partners</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dsaPartners.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Registered DSA partners</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {user.role === "super_admin" && dsaStats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    DSA-wise Lead Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">DSA</th>
                          <th className="text-right py-3 px-4 font-medium">Total</th>
                          <th className="text-right py-3 px-4 font-medium">Pending</th>
                          <th className="text-right py-3 px-4 font-medium">In Progress</th>
                          <th className="text-right py-3 px-4 font-medium">Approved</th>
                          <th className="text-right py-3 px-4 font-medium">Rejected</th>
                          <th className="text-right py-3 px-4 font-medium">Success Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsaStats.map((dsa) => (
                          <tr key={dsa.id} className="border-b">
                            <td className="py-3 px-4 font-medium">{dsa.dsaName}</td>
                            <td className="text-right py-3 px-4">{dsa.total}</td>
                            <td className="text-right py-3 px-4 text-amber-600">{dsa.pending}</td>
                            <td className="text-right py-3 px-4 text-blue-600">{dsa.inProgress}</td>
                            <td className="text-right py-3 px-4 text-green-600">{dsa.approved}</td>
                            <td className="text-right py-3 px-4 text-red-600">{dsa.rejected}</td>
                            <td className="text-right py-3 px-4 font-medium">
                              {dsa.total > 0 ? ((dsa.approved / dsa.total) * 100).toFixed(1) : "0"}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{pendingLeads}</span>
                        <span className="text-xs text-muted-foreground">
                          ({totalLeads > 0 ? ((pendingLeads / totalLeads) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{inProgressLeads}</span>
                        <span className="text-xs text-muted-foreground">
                          ({totalLeads > 0 ? ((inProgressLeads / totalLeads) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Approved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{approvedLeads}</span>
                        <span className="text-xs text-muted-foreground">
                          ({totalLeads > 0 ? ((approvedLeads / totalLeads) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Rejected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{rejectedLeads}</span>
                        <span className="text-xs text-muted-foreground">
                          ({totalLeads > 0 ? ((rejectedLeads / totalLeads) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Loan Applications</span>
                      <span className="text-sm font-medium">₹{(totalLoanAmount / 10000000).toFixed(2)} Crores</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Approved Loan Amount</span>
                      <span className="text-sm font-medium text-green-600">
                        ₹{(approvedLoanAmount / 10000000).toFixed(2)} Crores
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Loan Size</span>
                      <span className="text-sm font-medium">
                        ₹{totalLeads > 0 ? (totalLoanAmount / totalLeads / 100000).toFixed(2) : 0} Lakhs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Approval Rate</span>
                      <span className="text-sm font-medium">
                        {totalLeads > 0 ? ((approvedLeads / totalLeads) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                  {user.role === "super_admin" && (
                    <>
                      <li>Manage leads and assign them to DSAs</li>
                      <li>Monitor DSA performance and team assignments</li>
                      <li>Configure system settings and manage DSA partners</li>
                      <li>View comprehensive reports and final status approvals</li>
                      <li>Manage owned details including bank and company information</li>
                    </>
                  )}
                  {user.role === "lead_systems_manager" && (
                    <>
                      <li>View and manage all leads in the system</li>
                      <li>Track lead progress and status updates</li>
                      <li>Generate comprehensive lead reports</li>
                      <li>Monitor DSA partner performance</li>
                    </>
                  )}
                  {user.role === "dsa" && (
                    <>
                      <li>View and manage your assigned leads</li>
                      <li>Assign leads to your team members</li>
                      <li>Track team performance and lead status</li>
                      <li>Manage your team members</li>
                    </>
                  )}
                  {user.role === "dsa_team_member" && (
                    <>
                      <li>View your assigned leads</li>
                      <li>Update lead status and progress</li>
                      <li>Process loan applications</li>
                    </>
                  )}
                  {user.role === "dsa_partner" && (
                    <>
                      <li>View assigned leads</li>
                      <li>Update lead status</li>
                      <li>Generate DSA partner reports</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

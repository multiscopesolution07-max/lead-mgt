"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, TrendingUp, Users, DollarSign, Building2 } from "lucide-react"
import { getLeads, getLeadsByDSAPartner } from "@/lib/leads-data"
import { getDSAs } from "@/lib/dsas-data"
import type { Lead } from "@/lib/leads-data"

export default function ReportsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedDSAPartner, setSelectedDSAPartner] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user?.role === "dsa_partner" && user.dsaPartnerId) {
      setLeads(getLeadsByDSAPartner(user.dsaPartnerId))
    } else {
      setLeads(getLeads())
    }
  }, [user])

  const dsaPartners = getDSAs()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: Lead["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      in_progress: "bg-blue-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
    }

    return <Badge className={colors[status]}>{status.replace("_", " ").toUpperCase()}</Badge>
  }

  const filteredLeads = leads.filter((lead) => {
    const dsaPartnerMatch = selectedDSAPartner === "all" || lead.dsaPartnerId === selectedDSAPartner
    const monthMatch = lead.createdAt.startsWith(selectedMonth)
    return dsaPartnerMatch && monthMatch
  })

  const stats = {
    totalLeads: filteredLeads.length,
    pendingLeads: filteredLeads.filter((l) => l.status === "pending").length,
    approvedLeads: filteredLeads.filter((l) => l.status === "approved").length,
    totalAmount: filteredLeads.reduce((sum, lead) => sum + lead.loanAmount, 0),
  }

  const loanTypeStats = filteredLeads.reduce(
    (acc, lead) => {
      if (!acc[lead.loanType]) {
        acc[lead.loanType] = { count: 0, amount: 0 }
      }
      acc[lead.loanType].count++
      acc[lead.loanType].amount += lead.loanAmount
      return acc
    },
    {} as Record<string, { count: number; amount: number }>,
  )

  const dsaPartnerStats = dsaPartners.map((dsaPartner) => {
    const dsaPartnerLeads = filteredLeads.filter((l) => l.dsaPartnerId === dsaPartner.id)
    return {
      dsaPartnerName: dsaPartner.companyName,
      totalLeads: dsaPartnerLeads.length,
      approvedLeads: dsaPartnerLeads.filter((l) => l.status === "approved").length,
      totalAmount: dsaPartnerLeads.reduce((sum, lead) => sum + lead.loanAmount, 0),
    }
  })

  const handleExport = () => {
    alert("Export functionality would generate CSV/PDF report here")
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
                <p className="text-muted-foreground mt-1">View analytics and generate reports</p>
              </div>
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="flex gap-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-01">January 2025</SelectItem>
                  <SelectItem value="2024-12">December 2024</SelectItem>
                  <SelectItem value="2024-11">November 2024</SelectItem>
                </SelectContent>
              </Select>

              {user.role !== "dsa_partner" && (
                <Select value={selectedDSAPartner} onValueChange={setSelectedDSAPartner}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select DSA partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All DSA Partners</SelectItem>
                    {dsaPartners.map((dsaPartner) => (
                      <SelectItem key={dsaPartner.id} value={dsaPartner.id}>
                        {dsaPartner.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">For selected period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.approvedLeads}</div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully approved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Combined loan value</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="leads" className="space-y-4">
              <TabsList>
                <TabsTrigger value="leads">Lead Reports</TabsTrigger>
                <TabsTrigger value="loan-types">Loan Type Analysis</TabsTrigger>
                {user.role === "super_admin" && <TabsTrigger value="dsa-partners">DSA Partner Reports</TabsTrigger>}
              </TabsList>

              <TabsContent value="leads">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Details</CardTitle>
                    <CardDescription>Detailed breakdown of all leads in the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Loan Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                              No leads found for this period
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredLeads.map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell className="font-medium">{lead.name}</TableCell>
                              <TableCell>{lead.loanType}</TableCell>
                              <TableCell className="font-medium">{formatCurrency(lead.loanAmount)}</TableCell>
                              <TableCell>{getStatusBadge(lead.status)}</TableCell>
                              <TableCell>{new Date(lead.createdAt).toLocaleDateString("en-IN")}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loan-types">
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Type Analysis</CardTitle>
                    <CardDescription>Performance breakdown by loan type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Loan Type</TableHead>
                          <TableHead className="text-right">Number of Leads</TableHead>
                          <TableHead className="text-right">Total Amount</TableHead>
                          <TableHead className="text-right">Average Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.keys(loanTypeStats).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              No data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          Object.entries(loanTypeStats).map(([loanType, data]) => (
                            <TableRow key={loanType}>
                              <TableCell className="font-medium">{loanType}</TableCell>
                              <TableCell className="text-right">{data.count}</TableCell>
                              <TableCell className="text-right font-medium">{formatCurrency(data.amount)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(data.amount / data.count)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {user.role === "super_admin" && (
                <TabsContent value="dsa-partners">
                  <Card>
                    <CardHeader>
                      <CardTitle>DSA Partner Performance</CardTitle>
                      <CardDescription>Performance metrics for each DSA partner</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                DSA Partner Name
                              </div>
                            </TableHead>
                            <TableHead className="text-right">Total Leads</TableHead>
                            <TableHead className="text-right">Approved</TableHead>
                            <TableHead className="text-right">Total Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {dsaPartnerStats.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                No DSA partner data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            dsaPartnerStats.map((dsaPartner) => (
                              <TableRow key={dsaPartner.dsaPartnerName}>
                                <TableCell className="font-medium">{dsaPartner.dsaPartnerName}</TableCell>
                                <TableCell className="text-right">{dsaPartner.totalLeads}</TableCell>
                                <TableCell className="text-right">{dsaPartner.approvedLeads}</TableCell>
                                <TableCell className="text-right font-medium">
                                  {formatCurrency(dsaPartner.totalAmount)}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

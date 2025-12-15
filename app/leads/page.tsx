"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, Eye, Pencil, Trash2, CalendarIcon } from "lucide-react"
import type { Lead } from "@/lib/leads-data"
import { getLeads, deleteLead, getLeadsByDsa, getLeadsByTeamMember } from "@/lib/leads-data"
import Link from "next/link"
import { format } from "date-fns"

export default function LeadsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [leads, setLeads] = useState<Lead[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [monthFilter, setMonthFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()

  useEffect(() => {
    if (
      !isLoading &&
      (!user || !["super_admin", "lead_systems_manager", "dsa_partner","dsa", "dsa_team_member"].includes(user.role))
    ) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadLeads()
  }, [user])

  const loadLeads = () => {
    if (!user) return

    if (user.role === "dsa") {
      setLeads(getLeadsByDsa(user.id))
    } else if (user.role === "dsa_team_member") {
      setLeads(getLeadsByTeamMember(user.id))
    } else {
      setLeads(getLeads())
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead(id)
      loadLeads()
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.mobileNumber.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter

    const leadDate = new Date(lead.createdAt)
    const matchesMonth = monthFilter === "all" || leadDate.getMonth() === Number.parseInt(monthFilter)

    let matchesDateRange = true
    if (dateFrom) {
      matchesDateRange = leadDate >= new Date(dateFrom.setHours(0, 0, 0, 0))
    }
    if (dateTo && matchesDateRange) {
      matchesDateRange = leadDate <= new Date(dateTo.setHours(23, 59, 59, 999))
    }

    return matchesSearch && matchesStatus && matchesMonth && matchesDateRange
  })

  const getStatusBadge = (status: Lead["status"]) => {
    const variants = {
      pending: "secondary",
      in_progress: "default",
      approved: "default",
      rejected: "destructive",
    } as const

    const colors = {
      pending: "bg-yellow-500",
      in_progress: "bg-blue-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
    }

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const canAddLead = user.role === "super_admin" || user.role === "lead_systems_manager"

  const canDelete = user.role === "super_admin" || user.role === "lead_systems_manager"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Leads Management</h2>
                <p className="text-muted-foreground mt-1">
                  {user.role === "dsa" && "View and manage leads assigned to you"}
                  {user.role === "dsa_team_member" && "View leads assigned to you"}
                  {(user.role === "super_admin" || user.role === "lead_systems_manager") &&
                    "View and manage all leads in the system"}
                </p>
              </div>
              {canAddLead && (
                <Link href="/leads/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                </Link>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  {user.role === "dsa" && "My Assigned Leads"}
                  {user.role === "dsa_team_member" && "My Leads"}
                  {(user.role === "super_admin" || user.role === "lead_systems_manager") && "All Leads"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4">
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        <SelectItem value="0">January</SelectItem>
                        <SelectItem value="1">February</SelectItem>
                        <SelectItem value="2">March</SelectItem>
                        <SelectItem value="3">April</SelectItem>
                        <SelectItem value="4">May</SelectItem>
                        <SelectItem value="5">June</SelectItem>
                        <SelectItem value="6">July</SelectItem>
                        <SelectItem value="7">August</SelectItem>
                        <SelectItem value="8">September</SelectItem>
                        <SelectItem value="9">October</SelectItem>
                        <SelectItem value="10">November</SelectItem>
                        <SelectItem value="11">December</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-60 justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "From Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-60 justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "To Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                      </PopoverContent>
                    </Popover>

                    {(dateFrom || dateTo || monthFilter !== "all") && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setDateFrom(undefined)
                          setDateTo(undefined)
                          setMonthFilter("all")
                        }}
                      >
                        Clear Dates
                      </Button>
                    )}
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Loan Type</TableHead>
                        <TableHead>Loan Amount</TableHead>
                        <TableHead>Status</TableHead>
                        {user.role === "super_admin" && <TableHead>Final Status</TableHead>}
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={user.role === "super_admin" ? 7 : 6}
                            className="text-center text-muted-foreground py-8"
                          >
                            No leads found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredLeads.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.name}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{lead.email}</div>
                                <div className="text-muted-foreground">{lead.mobileNumber}</div>
                              </div>
                            </TableCell>
                            <TableCell>{lead.loanType}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(lead.loanAmount)}</TableCell>
                            <TableCell>{getStatusBadge(lead.status)}</TableCell>
                            {user.role === "super_admin" && (
                              <TableCell>
                                {lead.finalStatus ? (
                                  <Badge
                                    variant={lead.finalStatus === "approved" ? "default" : "destructive"}
                                    className={lead.finalStatus === "approved" ? "bg-green-600" : "bg-red-600"}
                                  >
                                    {lead.finalStatus.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Pending</Badge>
                                )}
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex gap-1">
                                <Link href={`/leads/${lead.id}`}>
                                  <Button size="icon" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                {canDelete && (
                                  <>
                                    <Link href={`/leads/${lead.id}/edit`}>
                                      <Button size="icon" variant="ghost">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(lead.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

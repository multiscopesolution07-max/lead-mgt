"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, User2, UserPlus } from "lucide-react"
import Link from "next/link"
import type { Lead } from "@/lib/leads-data"
import { getLeadById, assignLeadToDsa, assignLeadToTeamMember, updateFinalStatus } from "@/lib/leads-data"
import { getTeamMembersByDsa } from "@/lib/dsa-team-data"

export default function LeadDetailPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [lead, setLead] = useState<Lead | null>(null)
  const [selectedDsa, setSelectedDsa] = useState("")
  const [selectedTeamMember, setSelectedTeamMember] = useState("")
  const [selectedFinalStatus, setSelectedFinalStatus] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isTeamAssignDialogOpen, setIsTeamAssignDialogOpen] = useState(false)
  const [isFinalStatusDialogOpen, setIsFinalStatusDialogOpen] = useState(false)

  useEffect(() => {
    if (
      !isLoading &&
      (!user || !["super_admin", "lead_systems_manager", "dsa_partner" , "dsa", "dsa_team_member"].includes(user.role))
    ) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadLead()
  }, [params.id])

  const loadLead = () => {
    if (params.id) {
      const foundLead = getLeadById(params.id as string)
      setLead(foundLead || null)
    }
  }

  // Mock DSAs - In real app, fetch from database
  const mockDsas = [
    { id: "4", name: "DSA User" },
    { id: "dsa-1", name: "John DSA" },
    { id: "dsa-2", name: "Sarah DSA" },
  ]

  const handleAssignToDsa = () => {
    if (selectedDsa && lead) {
      assignLeadToDsa(lead.id, selectedDsa)
      setIsAssignDialogOpen(false)
      loadLead()
    }
  }

  const handleAssignToTeamMember = () => {
    if (selectedTeamMember && lead) {
      assignLeadToTeamMember(lead.id, selectedTeamMember)
      setIsTeamAssignDialogOpen(false)
      loadLead()
    }
  }

  const handleUpdateFinalStatus = () => {
    if (selectedFinalStatus && lead) {
      updateFinalStatus(lead.id, selectedFinalStatus as "approved" | "rejected" | "pending")
      setIsFinalStatusDialogOpen(false)
      loadLead()
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">Lead not found</p>
                  <Link href="/leads">
                    <Button className="mt-4">Back to Leads</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const teamMembers = user.role === "dsa" ? getTeamMembersByDsa(user.id) : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Leads
                </Button>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">{lead.name}</h2>
                  <p className="text-muted-foreground mt-1">Lead Details</p>
                </div>
                <div className="flex gap-2">
                  {(user.role === "super_admin" || user.role === "lead_systems_manager") && (
                    <>
                      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Assign to DSA
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Lead to DSA</DialogTitle>
                            <DialogDescription>Select a DSA to assign this lead to</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Select value={selectedDsa} onValueChange={setSelectedDsa}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select DSA" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDsas.map((dsa) => (
                                  <SelectItem key={dsa.id} value={dsa.id}>
                                    {dsa.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button onClick={handleAssignToDsa} className="w-full">
                              Assign Lead
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Link href={`/leads/${lead.id}/edit`}>
                        <Button>Edit Lead</Button>
                      </Link>
                    </>
                  )}

                  {user.role === "dsa" && (
                    <Dialog open={isTeamAssignDialogOpen} onOpenChange={setIsTeamAssignDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign to Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Lead to Team Member</DialogTitle>
                          <DialogDescription>Select a team member to assign this lead to</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Team Member" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button onClick={handleAssignToTeamMember} className="w-full">
                            Assign Lead
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {user.role === "super_admin" && (
                    <Dialog open={isFinalStatusDialogOpen} onOpenChange={setIsFinalStatusDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Update Final Status</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Final Status</DialogTitle>
                          <DialogDescription>Set the final approval status for this lead</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Select value={selectedFinalStatus} onValueChange={setSelectedFinalStatus}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Final Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button onClick={handleUpdateFinalStatus} className="w-full">
                            Update Status
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <div className="flex gap-2">
                    {getStatusBadge(lead.status)}
                    {user.role === "super_admin" && lead.finalStatus && (
                      <Badge
                        variant={lead.finalStatus === "approved" ? "default" : "destructive"}
                        className={lead.finalStatus === "approved" ? "bg-green-600" : "bg-red-600"}
                      >
                        Final: {lead.finalStatus.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <User2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{lead.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">{lead.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <p className="font-medium">{lead.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Type</p>
                      <p className="font-medium">{lead.employeeType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address ({lead.addressType})</p>
                      <p className="font-medium">{lead.fullAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Type</p>
                      <p className="font-medium">{lead.loanType}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-medium text-lg">{formatCurrency(lead.loanAmount)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created Date</p>
                      <p className="font-medium">{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{formatDate(lead.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(lead.assignedDsaId || lead.assignedTeamMemberId) && (
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lead.assignedDsaId && (
                    <div className="flex items-start gap-3">
                      <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned DSA</p>
                        <p className="font-medium">DSA ID: {lead.assignedDsaId}</p>
                      </div>
                    </div>
                  )}
                  {lead.assignedTeamMemberId && (
                    <div className="flex items-start gap-3">
                      <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Team Member</p>
                        <p className="font-medium">Team Member ID: {lead.assignedTeamMemberId}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

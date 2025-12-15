"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { addLead } from "@/lib/leads-data"
import { getLoanTypes, getEmployeeTypes, getAddressTypes } from "@/lib/settings-data"

export default function NewLeadPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    fullAddress: "",
    addressType: "",
    employeeType: "",
    loanType: "",
    loanAmount: "",
  })

  const [loanTypes, setLoanTypes] = useState(getLoanTypes())
  const [employeeTypes, setEmployeeTypes] = useState(getEmployeeTypes())
  const [addressTypes, setAddressTypes] = useState(getAddressTypes())

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "super_admin" && user.role !== "lead_systems_manager"))) {
      router.push("/")
    }
  }, [user, isLoading, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newLead = {
      ...formData,
      loanAmount: Number.parseFloat(formData.loanAmount),
      status: "pending" as const,
    }

    addLead(newLead)
    router.push("/leads")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Leads
                </Button>
              </Link>
              <h2 className="text-3xl font-bold tracking-tight">Add New Lead</h2>
              <p className="text-muted-foreground mt-1">Enter lead details to add to the system</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
                <CardDescription>Fill in all required fields marked with *</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">
                        Mobile Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="mobileNumber"
                        required
                        value={formData.mobileNumber}
                        onChange={(e) => handleChange("mobileNumber", e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addressType">
                        Address Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.addressType}
                        onValueChange={(value) => handleChange("addressType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select address type" />
                        </SelectTrigger>
                        <SelectContent>
                          {addressTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullAddress">
                      Full Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="fullAddress"
                      required
                      value={formData.fullAddress}
                      onChange={(e) => handleChange("fullAddress", e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="employeeType">
                        Employee Type <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.employeeType}
                        onValueChange={(value) => handleChange("employeeType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee type" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loanType">
                        Loan Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.loanType} onValueChange={(value) => handleChange("loanType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">
                        Loan Amount <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="loanAmount"
                        type="number"
                        required
                        value={formData.loanAmount}
                        onChange={(e) => handleChange("loanAmount", e.target.value)}
                        placeholder="5000000"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Link href="/leads">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit">Create Lead</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

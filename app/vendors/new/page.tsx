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
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { addVendor } from "@/lib/vendors-data"
import type { BankCommission } from "@/lib/vendors-data"
import { getLoanTypes, getBankNames } from "@/lib/settings-data"

export default function NewVendorPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    ownerName: "",
    companyName: "",
    gstNumber: "",
    officeAddress: "",
    loanTypes: [] as string[],
    bankCommissions: [] as BankCommission[],
  })

  const [loanTypes] = useState(getLoanTypes())
  const [banks] = useState(getBankNames())

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "super_admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  // Initialize bank commissions with all banks at 0%
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      bankCommissions: banks.map((bank) => ({
        bankId: bank.id,
        bankName: bank.name,
        commissionRate: 0,
      })),
    }))
  }, [banks])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out banks with 0% commission
    const activeCommissions = formData.bankCommissions.filter((bc) => bc.commissionRate > 0)

    const newVendor = {
      ...formData,
      bankCommissions: activeCommissions,
    }

    addVendor(newVendor)
    router.push("/vendors")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleLoanType = (loanType: string) => {
    setFormData((prev) => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(loanType)
        ? prev.loanTypes.filter((t) => t !== loanType)
        : [...prev.loanTypes, loanType],
    }))
  }

  const updateCommissionRate = (bankId: string, rate: number) => {
    setFormData((prev) => ({
      ...prev,
      bankCommissions: prev.bankCommissions.map((bc) => (bc.bankId === bankId ? { ...bc, commissionRate: rate } : bc)),
    }))
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <Link href="/vendors">
                <Button variant="ghost" size="sm" className="mb-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Vendors
                </Button>
              </Link>
              <h2 className="text-3xl font-bold tracking-tight">Add New Vendor</h2>
              <p className="text-muted-foreground mt-1">Enter vendor details to add to the system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                  <CardDescription>Fill in all required fields marked with *</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">
                        Owner Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="ownerName"
                        required
                        value={formData.ownerName}
                        onChange={(e) => handleChange("ownerName", e.target.value)}
                        placeholder="Enter owner's full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleChange("companyName", e.target.value)}
                        placeholder="Enter company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gstNumber">
                        GST Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="gstNumber"
                        required
                        value={formData.gstNumber}
                        onChange={(e) => handleChange("gstNumber", e.target.value)}
                        placeholder="29ABCDE1234F1Z5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officeAddress">
                      Office Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="officeAddress"
                      required
                      value={formData.officeAddress}
                      onChange={(e) => handleChange("officeAddress", e.target.value)}
                      placeholder="Enter complete office address"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Loan Types</CardTitle>
                  <CardDescription>Select the loan types this vendor handles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loanTypes.map((loanType) => (
                      <div key={loanType.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`loan-${loanType.id}`}
                          checked={formData.loanTypes.includes(loanType.name)}
                          onCheckedChange={() => toggleLoanType(loanType.name)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor={`loan-${loanType.id}`} className="cursor-pointer font-medium">
                            {loanType.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{loanType.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Wise Commission</CardTitle>
                  <CardDescription>Set commission rates for each bank (in percentage)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bank Name</TableHead>
                        <TableHead>Bank Code</TableHead>
                        <TableHead className="w-48">Commission Rate (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.bankCommissions.map((commission) => (
                        <TableRow key={commission.bankId}>
                          <TableCell className="font-medium">{commission.bankName}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {banks.find((b) => b.id === commission.bankId)?.code}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={commission.commissionRate}
                              onChange={(e) =>
                                updateCommissionRate(commission.bankId, Number.parseFloat(e.target.value) || 0)
                              }
                              placeholder="0.0"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Link href="/vendors">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Create Vendor</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

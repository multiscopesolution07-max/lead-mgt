"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { BankDetail, CompanyDetail, CompanyProcess } from "@/lib/owned-details-data"
import {
  getBankDetails,
  addBankDetail,
  updateBankDetail,
  deleteBankDetail,
  getCompanyDetails,
  addCompanyDetail,
  updateCompanyDetail,
  deleteCompanyDetail,
  getCompanyProcesses,
  addCompanyProcess,
  updateCompanyProcess,
  deleteCompanyProcess,
} from "@/lib/owned-details-data"

export default function OwnedDetailsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [bankDetails, setBankDetails] = useState<BankDetail[]>([])
  const [companyDetails, setCompanyDetails] = useState<CompanyDetail[]>([])
  const [companyProcesses, setCompanyProcesses] = useState<CompanyProcess[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "super_admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setBankDetails(getBankDetails())
    setCompanyDetails(getCompanyDetails())
    setCompanyProcesses(getCompanyProcesses())
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
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Owned Details</h2>
              <p className="text-muted-foreground mt-1">
                Manage company information, bank accounts, and business processes
              </p>
            </div>

            <Tabs defaultValue="bank-details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
                <TabsTrigger value="company-details">Company Details</TabsTrigger>
                <TabsTrigger value="company-processes">Company Processes</TabsTrigger>
              </TabsList>

              <TabsContent value="bank-details">
                <BankDetailsSection bankDetails={bankDetails} onUpdate={loadData} />
              </TabsContent>

              <TabsContent value="company-details">
                <CompanyDetailsSection companyDetails={companyDetails} onUpdate={loadData} />
              </TabsContent>

              <TabsContent value="company-processes">
                <CompanyProcessesSection companyProcesses={companyProcesses} onUpdate={loadData} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function BankDetailsSection({ bankDetails, onUpdate }: { bankDetails: BankDetail[]; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BankDetail | null>(null)
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    branch: "",
    accountType: "",
  })

  const handleSubmit = () => {
    if (editingItem) {
      updateBankDetail(editingItem.id, formData)
    } else {
      addBankDetail(formData)
    }
    resetForm()
    onUpdate()
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingItem(null)
    setFormData({
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      branch: "",
      accountType: "",
    })
  }

  const handleEdit = (item: BankDetail) => {
    setEditingItem(item)
    setFormData({
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      accountHolderName: item.accountHolderName,
      ifscCode: item.ifscCode,
      branch: item.branch,
      accountType: item.accountType,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bank detail?")) {
      deleteBankDetail(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bank Details</CardTitle>
            <CardDescription>Manage company bank account information</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Detail
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Bank Detail</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the bank account details" : "Add a new bank account"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ifscCode: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => setFormData((prev) => ({ ...prev, branch: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={formData.accountType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, accountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Current Account">Current Account</SelectItem>
                      <SelectItem value="Savings Account">Savings Account</SelectItem>
                      <SelectItem value="Overdraft Account">Overdraft Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bank Name</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>IFSC Code</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bankDetails.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.bankName}</TableCell>
                <TableCell className="font-mono">{item.accountNumber}</TableCell>
                <TableCell className="font-mono text-sm">{item.ifscCode}</TableCell>
                <TableCell>{item.accountType}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CompanyDetailsSection({
  companyDetails,
  onUpdate,
}: {
  companyDetails: CompanyDetail[]
  onUpdate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CompanyDetail | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    gstNumber: "",
    panNumber: "",
    incorporationDate: "",
    registeredAddress: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
  })

  const handleSubmit = () => {
    if (editingItem) {
      updateCompanyDetail(editingItem.id, formData)
    } else {
      addCompanyDetail(formData)
    }
    resetForm()
    onUpdate()
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingItem(null)
    setFormData({
      companyName: "",
      registrationNumber: "",
      gstNumber: "",
      panNumber: "",
      incorporationDate: "",
      registeredAddress: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
    })
  }

  const handleEdit = (item: CompanyDetail) => {
    setEditingItem(item)
    setFormData({
      companyName: item.companyName,
      registrationNumber: item.registrationNumber,
      gstNumber: item.gstNumber,
      panNumber: item.panNumber,
      incorporationDate: item.incorporationDate,
      registeredAddress: item.registeredAddress,
      contactEmail: item.contactEmail,
      contactPhone: item.contactPhone,
      website: item.website || "",
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this company detail?")) {
      deleteCompanyDetail(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Company Details</CardTitle>
            <CardDescription>Manage company registration and contact information</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company Detail
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Company Detail</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the company details" : "Add new company information"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, gstNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, panNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="incorporationDate">Incorporation Date</Label>
                  <Input
                    id="incorporationDate"
                    type="date"
                    value={formData.incorporationDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, incorporationDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="registeredAddress">Registered Address</Label>
                  <Textarea
                    id="registeredAddress"
                    value={formData.registeredAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, registeredAddress: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companyDetails.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{item.companyName}</CardTitle>
                    <CardDescription className="mt-1">Registration: {item.registrationNumber}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">GST Number</p>
                    <p className="font-mono font-medium">{item.gstNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PAN Number</p>
                    <p className="font-mono font-medium">{item.panNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Incorporation Date</p>
                    <p className="font-medium">{new Date(item.incorporationDate).toLocaleDateString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-medium">{item.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{item.contactEmail}</p>
                  </div>
                  {item.website && (
                    <div>
                      <p className="text-muted-foreground">Website</p>
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {item.website}
                      </a>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Registered Address</p>
                    <p className="font-medium">{item.registeredAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function CompanyProcessesSection({
  companyProcesses,
  onUpdate,
}: {
  companyProcesses: CompanyProcess[]
  onUpdate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CompanyProcess | null>(null)
  const [formData, setFormData] = useState({
    processName: "",
    description: "",
    steps: "",
    department: "",
    owner: "",
    status: "active" as "active" | "inactive" | "draft",
  })

  const handleSubmit = () => {
    const processData = {
      ...formData,
      steps: formData.steps.split("\n").filter((s) => s.trim() !== ""),
    }

    if (editingItem) {
      updateCompanyProcess(editingItem.id, processData)
    } else {
      addCompanyProcess(processData)
    }
    resetForm()
    onUpdate()
  }

  const resetForm = () => {
    setIsOpen(false)
    setEditingItem(null)
    setFormData({
      processName: "",
      description: "",
      steps: "",
      department: "",
      owner: "",
      status: "active",
    })
  }

  const handleEdit = (item: CompanyProcess) => {
    setEditingItem(item)
    setFormData({
      processName: item.processName,
      description: item.description,
      steps: item.steps.join("\n"),
      department: item.department,
      owner: item.owner,
      status: item.status,
    })
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this process?")) {
      deleteCompanyProcess(id)
      onUpdate()
    }
  }

  const getStatusBadge = (status: CompanyProcess["status"]) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      draft: "outline",
    } as const

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Company Processes</CardTitle>
            <CardDescription>Document and manage business processes and workflows</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Process
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Company Process</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the process details" : "Add a new business process"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="processName">Process Name</Label>
                  <Input
                    id="processName"
                    value={formData.processName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, processName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="steps">Process Steps (one per line)</Label>
                  <Textarea
                    id="steps"
                    value={formData.steps}
                    onChange={(e) => setFormData((prev) => ({ ...prev, steps: e.target.value }))}
                    rows={6}
                    placeholder="Step 1&#10;Step 2&#10;Step 3"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="owner">Process Owner</Label>
                    <Input
                      id="owner"
                      value={formData.owner}
                      onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive" | "draft") =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {companyProcesses.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{item.processName}</CardTitle>
                      {getStatusBadge(item.status)}
                    </div>
                    <CardDescription className="mt-2">{item.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Department</p>
                      <p className="font-medium">{item.department}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Process Owner</p>
                      <p className="font-medium">{item.owner}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Process Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {item.steps.map((step, index) => (
                        <li key={index} className="text-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

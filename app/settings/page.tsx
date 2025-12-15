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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import type { LoanType, EmployeeType, AddressType, BankName } from "@/lib/settings-data"
import {
  getLoanTypes,
  addLoanType,
  updateLoanType,
  deleteLoanType,
  getEmployeeTypes,
  addEmployeeType,
  updateEmployeeType,
  deleteEmployeeType,
  getAddressTypes,
  addAddressType,
  updateAddressType,
  deleteAddressType,
  getBankNames,
  addBankName,
  updateBankName,
  deleteBankName,
} from "@/lib/settings-data"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [loanTypes, setLoanTypes] = useState<LoanType[]>([])
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>([])
  const [addressTypes, setAddressTypes] = useState<AddressType[]>([])
  const [bankNames, setBankNames] = useState<BankName[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "super_admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setLoanTypes(getLoanTypes())
    setEmployeeTypes(getEmployeeTypes())
    setAddressTypes(getAddressTypes())
    setBankNames(getBankNames())
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
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground mt-1">Manage system configuration and master data</p>
            </div>

            <Tabs defaultValue="loan-types" className="space-y-4">
              <TabsList>
                <TabsTrigger value="loan-types">Loan Types</TabsTrigger>
                <TabsTrigger value="employee-types">Employee Types</TabsTrigger>
                <TabsTrigger value="address-types">Address Types</TabsTrigger>
                <TabsTrigger value="bank-names">Bank Names</TabsTrigger>
              </TabsList>

              <TabsContent value="loan-types">
                <LoanTypesSection loanTypes={loanTypes} onUpdate={loadData} />
              </TabsContent>

              <TabsContent value="employee-types">
                <EmployeeTypesSection employeeTypes={employeeTypes} onUpdate={loadData} />
              </TabsContent>

              <TabsContent value="address-types">
                <AddressTypesSection addressTypes={addressTypes} onUpdate={loadData} />
              </TabsContent>

              <TabsContent value="bank-names">
                <BankNamesSection bankNames={bankNames} onUpdate={loadData} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

function LoanTypesSection({ loanTypes, onUpdate }: { loanTypes: LoanType[]; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<LoanType | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (editingItem) {
      updateLoanType(editingItem.id, { name, description })
    } else {
      addLoanType({ name, description })
    }
    setIsOpen(false)
    setEditingItem(null)
    setName("")
    setDescription("")
    onUpdate()
  }

  const handleEdit = (item: LoanType) => {
    setEditingItem(item)
    setName(item.name)
    setDescription(item.description)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this loan type?")) {
      deleteLoanType(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Loan Types</CardTitle>
            <CardDescription>Manage available loan types in the system</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setName("")
                  setDescription("")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Loan Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Loan Type</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the loan type details" : "Add a new loan type to the system"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loanTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
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

function EmployeeTypesSection({ employeeTypes, onUpdate }: { employeeTypes: EmployeeType[]; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EmployeeType | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (editingItem) {
      updateEmployeeType(editingItem.id, { name, description })
    } else {
      addEmployeeType({ name, description })
    }
    setIsOpen(false)
    setEditingItem(null)
    setName("")
    setDescription("")
    onUpdate()
  }

  const handleEdit = (item: EmployeeType) => {
    setEditingItem(item)
    setName(item.name)
    setDescription(item.description)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this employee type?")) {
      deleteEmployeeType(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Employee Types</CardTitle>
            <CardDescription>Manage employee classification types</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setName("")
                  setDescription("")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Employee Type</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the employee type details" : "Add a new employee type to the system"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeeTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
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

function AddressTypesSection({ addressTypes, onUpdate }: { addressTypes: AddressType[]; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AddressType | null>(null)
  const [name, setName] = useState("")

  const handleSubmit = () => {
    if (editingItem) {
      updateAddressType(editingItem.id, { name })
    } else {
      addAddressType({ name })
    }
    setIsOpen(false)
    setEditingItem(null)
    setName("")
    onUpdate()
  }

  const handleEdit = (item: AddressType) => {
    setEditingItem(item)
    setName(item.name)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this address type?")) {
      deleteAddressType(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Address Types</CardTitle>
            <CardDescription>Manage address classification types</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setName("")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Address Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Address Type</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the address type" : "Add a new address type to the system"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
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
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addressTypes.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
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

function BankNamesSection({ bankNames, onUpdate }: { bankNames: BankName[]; onUpdate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BankName | null>(null)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")

  const handleSubmit = () => {
    if (editingItem) {
      updateBankName(editingItem.id, { name, code })
    } else {
      addBankName({ name, code })
    }
    setIsOpen(false)
    setEditingItem(null)
    setName("")
    setCode("")
    onUpdate()
  }

  const handleEdit = (item: BankName) => {
    setEditingItem(item)
    setName(item.name)
    setCode(item.code)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this bank?")) {
      deleteBankName(id)
      onUpdate()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bank Names</CardTitle>
            <CardDescription>Manage banks available in the system</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setName("")
                  setCode("")
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bank
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit" : "Add"} Bank</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update the bank details" : "Add a new bank to the system"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Bank Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="code">Bank Code</Label>
                  <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="HDFC0001234" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
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
              <TableHead>Bank Code</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bankNames.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="font-mono text-sm">{item.code}</TableCell>
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

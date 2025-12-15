"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react"
import type { Vendor } from "@/lib/vendors-data"
import { getVendors, deleteVendor } from "@/lib/vendors-data"
import Link from "next/link"

export default function VendorsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [vendors, setVendors] = useState<Vendor[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "super_admin")) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = () => {
    setVendors(getVendors())
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor? This action cannot be undone.")) {
      deleteVendor(id)
      loadVendors()
    }
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <h2 className="text-3xl font-bold tracking-tight">Vendor Management</h2>
                <p className="text-muted-foreground mt-1">View and manage all vendors in the system</p>
              </div>
              <Link href="/vendors/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vendor
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Vendors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name, owner, or GST number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Owner Name</TableHead>
                        <TableHead>GST Number</TableHead>
                        <TableHead>Loan Types</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No vendors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVendors.map((vendor) => (
                          <TableRow key={vendor.id}>
                            <TableCell className="font-medium">{vendor.companyName}</TableCell>
                            <TableCell>{vendor.ownerName}</TableCell>
                            <TableCell className="font-mono text-sm">{vendor.gstNumber}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {vendor.loanTypes.map((type) => (
                                  <Badge key={type} variant="secondary">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Link href={`/vendors/${vendor.id}`}>
                                  <Button size="icon" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href={`/vendors/${vendor.id}/edit`}>
                                  <Button size="icon" variant="ghost">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(vendor.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
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

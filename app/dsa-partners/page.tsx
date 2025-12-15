"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import type { DSA } from "@/lib/dsas-data"
import { getDSAs, deleteDSA } from "@/lib/dsas-data"

export default function DSAPartnersPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [dsaPartners, setDSAPartners] = useState<DSA[]>([])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    loadDSAPartners()
  }, [])

  const loadDSAPartners = () => {
    setDSAPartners(getDSAs())
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this DSA partner? This action cannot be undone.")) {
      deleteDSA(id)
      loadDSAPartners()
    }
  }

  const filteredDSAPartners = dsaPartners.filter(
    (dsaPartner) =>
      dsaPartner.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsaPartner.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dsaPartner.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()),
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
                <h2 className="text-3xl font-bold tracking-tight">DSA Partner Management</h2>
                <p className="text-muted-foreground mt-1">View and manage all DSA partners in the system</p>
              </div>
              <Link href="/dsa-partners/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add DSA Partner
                </Button>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All DSA Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by company name, owner, or GST number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Owner Name</TableHead>
                      <TableHead>GST Number</TableHead>
                      <TableHead>Loan Types</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDSAPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No DSA partners found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDSAPartners.map((dsaPartner) => (
                        <TableRow key={dsaPartner.id}>
                          <TableCell className="font-medium">{dsaPartner.companyName}</TableCell>
                          <TableCell>{dsaPartner.ownerName}</TableCell>
                          <TableCell className="font-mono text-sm">{dsaPartner.gstNumber}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {dsaPartner.loanTypes.map((type) => (
                                <Badge key={type} variant="secondary">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Link href={`/dsa-partners/${dsaPartner.id}`}>
                                <Button size="icon" variant="ghost">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link href={`/dsa-partners/${dsaPartner.id}/edit`}>
                                <Button size="icon" variant="ghost">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button size="icon" variant="ghost" onClick={() => handleDelete(dsaPartner.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

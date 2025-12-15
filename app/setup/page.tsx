"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Database, Settings, Users, PlayCircle, Copy, Check } from "lucide-react"

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [copiedSql, setCopiedSql] = useState<number | null>(null)

  const steps = [
    {
      title: "Database Setup",
      icon: Database,
      description: "Create your PostgreSQL database and run the schema script",
      status: currentStep > 0 ? "completed" : currentStep === 0 ? "active" : "pending",
    },
    {
      title: "Initial Data",
      icon: Settings,
      description: "Seed your database with initial configuration data",
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending",
    },
    {
      title: "User Setup",
      icon: Users,
      description: "Create your first admin user and test login",
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending",
    },
  ]

  const handleCopySql = (sqlNumber: number) => {
    setCopiedSql(sqlNumber)
    setTimeout(() => setCopiedSql(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Lead Management System Setup</h1>
          <p className="text-muted-foreground text-lg">Follow these steps to get your system up and running</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-full p-3 ${
                      step.status === "completed"
                        ? "bg-green-500 text-white"
                        : step.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-xs mt-2 text-center max-w-[100px]">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > index ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 1: Database Schema */}
        {currentStep === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Step 1: Create Database Schema
              </CardTitle>
              <CardDescription>
                Run this SQL script in your PostgreSQL database to create all necessary tables
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(`-- Copy the SQL from scripts/001_create_database_schema.sql`)
                    handleCopySql(1)
                  }}
                >
                  {copiedSql === 1 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="text-xs overflow-x-auto">
                  {`-- Database Schema for Lead Management System
-- Run this in your PostgreSQL database

-- See scripts/001_create_database_schema.sql for complete SQL`}
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Open the file <code className="bg-muted px-1 rounded">scripts/001_create_database_schema.sql</code>
                  </li>
                  <li>Copy all the SQL content</li>
                  <li>Connect to your PostgreSQL database using pgAdmin, DBeaver, or psql</li>
                  <li>Execute the SQL script to create all tables and relationships</li>
                  <li>Verify all tables were created successfully</li>
                </ol>
              </div>
              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Schema Created - Continue <PlayCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Seed Data */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Step 2: Seed Initial Data
              </CardTitle>
              <CardDescription>
                Run this SQL script to populate your database with initial configuration and sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg relative">
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-transparent"
                  onClick={() => {
                    navigator.clipboard.writeText(`-- Copy the SQL from scripts/002_seed_initial_data.sql`)
                    handleCopySql(2)
                  }}
                >
                  {copiedSql === 2 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="text-xs overflow-x-auto">
                  {`-- Initial Data Seed Script
-- Includes settings, sample users, and demo data

-- See scripts/002_seed_initial_data.sql for complete SQL`}
                </pre>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Open the file <code className="bg-muted px-1 rounded">scripts/002_seed_initial_data.sql</code>
                  </li>
                  <li>Copy all the SQL content</li>
                  <li>Execute the SQL script in your database</li>
                  <li>This will create default settings, sample users, and demo data</li>
                  <li>Verify data was inserted successfully</li>
                </ol>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(0)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(2)} className="flex-1">
                  Data Seeded - Continue <PlayCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: User Setup & Login */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 3: Test Your Setup
              </CardTitle>
              <CardDescription>Use these credentials to test your installation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Super Admin Account</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> admin@example.com
                    </p>
                    <p>
                      <strong>Password:</strong> admin123
                    </p>
                    <p className="text-muted-foreground text-xs mt-2">Full system access including final approvals</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">DSA Account</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> dsa@example.com
                    </p>
                    <p>
                      <strong>Password:</strong> dsa123
                    </p>
                    <p className="text-muted-foreground text-xs mt-2">Can receive and assign leads to team</p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Lead Entry Account</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Email:</strong> manager@example.com
                    </p>
                    <p>
                      <strong>Password:</strong> manager123
                    </p>
                    <p className="text-muted-foreground text-xs mt-2">Can view and manage all leads</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Navigate to the login page</li>
                  <li>Test login with the Super Admin credentials</li>
                  <li>Explore the dashboard and verify all features work</li>
                  <li>Create new users as needed from the Users section</li>
                  <li>Configure settings in the Settings page</li>
                  <li>Start adding leads and vendors</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => (window.location.href = "/")} className="flex-1 bg-green-600 hover:bg-green-700">
                  Go to Login <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installation Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Installation Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "PostgreSQL database created and accessible",
                "Database schema script executed successfully",
                "Initial data seed script executed successfully",
                "Can connect to database from application",
                "Super Admin login working correctly",
                "Dashboard displaying correctly",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {currentStep > 2 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>If you encounter any issues during setup:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check that PostgreSQL is running and accessible</li>
              <li>Verify database connection credentials are correct</li>
              <li>Ensure all SQL scripts ran without errors</li>
              <li>Check browser console for any JavaScript errors</li>
              <li>Verify all required tables were created</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

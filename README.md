# Lead Management System

A comprehensive role-based lead management system for loan processing with DSA management, vendor tracking, and detailed reporting.

## Features

- **Role-Based Access Control**: Super Admin, Lead Systems Manager, DSA, DSA Team Member, and Vendor roles
- **Lead Management**: Complete lead lifecycle from entry to final approval
- **DSA Team Management**: DSAs can manage their own teams and assign leads
- **Vendor Management**: Track vendors with loan types and bank commission rates
- **Comprehensive Dashboard**: Real-time statistics with DSA-wise lead status tracking
- **Reports**: Detailed analytics for leads, vendors, and loan types
- **Settings**: Configure loan types, employee types, address types, and bank names
- **Owned Details**: Manage company information, bank details, and processes

## Quick Start - One-Click Setup

### Prerequisites

- PostgreSQL database (version 12 or higher)
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone or download this project**

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up your database**
   
   Create a PostgreSQL database:
   \`\`\`bash
   createdb lead_management_system
   \`\`\`

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   \`\`\`env
   DATABASE_URL=postgresql://username:password@localhost:5432/lead_management_system
   \`\`\`

5. **Run database setup scripts**
   
   Execute the SQL scripts in order:
   
   **Step 1: Create Schema**
   \`\`\`bash
   psql -d lead_management_system -f scripts/001_create_database_schema.sql
   \`\`\`
   
   **Step 2: Seed Data**
   \`\`\`bash
   psql -d lead_management_system -f scripts/002_seed_initial_data.sql
   \`\`\`

6. **Start the application**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Access the setup guide**
   
   Navigate to `http://localhost:3000/setup` for a step-by-step guided setup with instructions.

## Default Login Credentials

After running the seed script, you can log in with these accounts:

### Super Admin
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full system access including final approvals

### Lead Systems Manager
- **Email**: manager@example.com
- **Password**: manager123
- **Access**: View and manage all leads

### DSA
- **Email**: dsa@example.com
- **Password**: dsa123
- **Access**: Manage assigned leads and team members

### DSA Team Member
- **Email**: dsateam@example.com
- **Password**: team123
- **Access**: Process assigned leads

### Vendor
- **Email**: vendor@example.com
- **Password**: vendor123
- **Access**: View assigned leads and reports

**Important**: Change these default passwords immediately after first login in a production environment!

## User Roles & Permissions

### Super Admin
- Full system access
- Assign leads to DSAs
- View and update final status of all leads
- Manage vendors and settings
- View all reports
- Manage owned details

### Lead Systems Manager
- View and manage all leads
- Generate reports
- Track lead progress
- Cannot assign leads to DSAs

### DSA (Direct Selling Agent)
- Receive lead assignments from admin
- Assign leads to team members
- Manage team members
- View team performance
- Cannot see final approval status

### DSA Team Member
- View assigned leads only
- Update lead status and progress
- Process loan applications
- Limited system access

### Vendor
- View leads assigned to them
- Update lead status
- Generate vendor-specific reports

## Database Schema

The system uses PostgreSQL with the following main tables:

- `users` - User accounts with role-based access
- `leads` - Lead information and tracking
- `vendors` - Vendor details and commission rates
- `dsa_team_members` - DSA team structure
- `settings_*` - Configuration tables (loan types, employee types, etc.)
- `bank_details` - Company bank information
- `company_details` - Company registration details
- `company_processes` - Business process documentation

## Lead Assignment Workflow

1. **Lead Entry**: Lead Systems Manager or Super Admin creates a new lead
2. **DSA Assignment**: Super Admin assigns the lead to a DSA
3. **Team Assignment**: DSA assigns the lead to a team member
4. **Processing**: Team member processes the lead through various stages
5. **Final Approval**: Only Super Admin can see and approve final status

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: PostgreSQL with SQL scripts
- **Authentication**: Role-based access control
- **State Management**: React Context API

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard with statistics
│   ├── leads/             # Lead management pages
│   ├── vendors/           # Vendor management
│   ├── my-team/           # DSA team management
│   ├── reports/           # Analytics and reports
│   ├── settings/          # System configuration
│   ├── owned-details/     # Company information
│   └── setup/             # Setup guide
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Top navigation
│   └── sidebar.tsx       # Side navigation
├── lib/                   # Utility functions and data
│   ├── auth-context.tsx  # Authentication logic
│   ├── leads-data.ts     # Lead data management
│   ├── vendors-data.ts   # Vendor data management
│   └── dsa-team-data.ts  # Team management
└── scripts/               # Database setup scripts
    ├── 001_create_database_schema.sql
    └── 002_seed_initial_data.sql
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Security Notes

- All passwords should be hashed using bcrypt in production
- Implement proper session management
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting for API routes
- Add CSRF protection
- Regular security audits

## Support

For issues or questions:
1. Check the setup guide at `/setup`
2. Review the database logs for SQL errors
3. Verify all environment variables are set correctly
4. Ensure PostgreSQL is running and accessible

## License

This is a proprietary lead management system. All rights reserved.

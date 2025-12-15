// Mock data storage for DSA team members
export interface DsaTeamMember {
  id: string
  name: string
  email: string
  mobileNumber: string
  dsaId: string
  createdAt: string
}

const teamMembers: DsaTeamMember[] = [
  {
    id: "5",
    name: "DSA Team Member",
    email: "dsateam@example.com",
    mobileNumber: "+91 99999 99999",
    dsaId: "4",
    createdAt: "2025-01-01T00:00:00Z",
  },
]

export function getTeamMembersByDsa(dsaId: string): DsaTeamMember[] {
  return teamMembers.filter((member) => member.dsaId === dsaId)
}

export function addTeamMember(member: Omit<DsaTeamMember, "id" | "createdAt">): DsaTeamMember {
  const newMember: DsaTeamMember = {
    ...member,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  teamMembers.push(newMember)
  return newMember
}

export function deleteTeamMember(id: string): boolean {
  const index = teamMembers.findIndex((member) => member.id === id)
  if (index === -1) return false
  teamMembers.splice(index, 1)
  return true
}

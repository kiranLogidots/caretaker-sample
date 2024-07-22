export function capitalizeWords(s: string): string {
  // Replace underscores with spaces
  s = s.replace(/_/g, ' ');
  // Capitalize each word
  s = s.replace(/\b\w/g, (char) => char.toUpperCase());
  return s;
}

interface UserRole {
  id: number;
  name: string;
  created_at: string;
}

export const getUserRoles = (): UserRole[] => {
  const roles = sessionStorage.getItem('userRoles');
  return roles ? (JSON.parse(roles) as UserRole[]) : [];
};

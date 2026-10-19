import { ROLES } from '@/lib/roles';
import RoleIcon from './RoleIcon';

export default function RoleTag({ role, className = '' }) {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <span className={`role-tag tone-${r.tone} ${className}`}>
      <RoleIcon role={role} /> {r.label}
    </span>
  );
}

interface RoleToggleProps {
  role: 'student' | 'teacher'
  onChange: (role: 'student' | 'teacher') => void
}

const RoleToggle = ({ role, onChange }: RoleToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-subtle">Role</span>
      <div className="p-1 bg-surface-muted rounded-xl inline-flex">
        <button
          className={`px-3 py-1.5 text-sm rounded-lg ${role==='student'?'bg-primary-500 text-white':'text-text'}`}
          onClick={() => onChange('student')}
        >Student</button>
        <button
          className={`px-3 py-1.5 text-sm rounded-lg ${role==='teacher'?'bg-primary-500 text-white':'text-text'}`}
          onClick={() => onChange('teacher')}
        >Teacher</button>
      </div>
    </div>
  )
}

export default RoleToggle



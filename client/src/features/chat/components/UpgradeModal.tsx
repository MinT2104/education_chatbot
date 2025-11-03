interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  onUpgrade: () => void
}

const UpgradeModal = ({ open, onClose, onUpgrade }: UpgradeModalProps) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-surface p-6 shadow-[0_8px_24px_rgba(0,0,0,.4),inset_0_0_0_1px_var(--border)]">
        <h2 className="text-lg font-semibold text-text">Upgrade to Go</h2>
        <p className="text-sm text-text-subtle mt-1">You've reached the Free plan limit (25 messages). Unlock unlimited usage.</p>
        <div className="mt-4 flex gap-2 justify-end">
          <button className="px-3 py-2 rounded-xl bg-surface-muted" onClick={onClose}>Maybe later</button>
          <button className="px-3 py-2 rounded-xl bg-primary-500 text-white" onClick={onUpgrade}>Upgrade</button>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal



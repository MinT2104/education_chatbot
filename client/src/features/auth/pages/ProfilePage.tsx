import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Plan = 'Free' | 'Go'

const getPlan = (): Plan => (localStorage.getItem('plan') as Plan) || 'Free'
const getQuota = () => ({ limit: 25, used: parseInt(localStorage.getItem('quota_used') || '0', 10) })

const ProfilePage = () => {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<Plan>(getPlan())
  const [quota, setQuota] = useState(getQuota())

  useEffect(() => {
    setPlan(getPlan())
    setQuota(getQuota())
  }, [])

  const handleUpgrade = () => navigate('/upgrade')
  const handleCancel = () => {
    if (confirm('Cancel subscription and switch to Free?')) {
      localStorage.setItem('plan', 'Free')
      // keep used, enforce limit 25
      setPlan('Free')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6 text-text">Profile</h1>
        <div className="rounded-2xl bg-surface p-6 shadow-[inset_0_0_0_1px_var(--border)]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-text-subtle">Plan</div>
              <div className="text-lg font-medium text-text">{plan}</div>
              {plan === 'Free' ? (
                <div className="text-sm text-text-subtle mt-1">{quota.used}/25 messages used</div>
              ) : (
                <div className="text-sm text-text-subtle mt-1">Unlimited messages</div>
              )}
            </div>
            {plan === 'Free' ? (
              <button onClick={handleUpgrade} className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600">Upgrade</button>
            ) : (
              <button onClick={handleCancel} className="px-4 py-2 rounded-xl bg-surface-muted hover:bg-primary-500/10">Cancel subscription</button>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-surface p-6 shadow-[inset_0_0_0_1px_var(--border)]">
          <div className="text-lg font-medium text-text mb-2">Order logs (mock)</div>
          <div className="text-sm text-text-subtle">No orders yet.</div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage



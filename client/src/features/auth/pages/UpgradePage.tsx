import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Plan = 'Free' | 'Go'

const getStoredPlan = (): Plan => {
  return (localStorage.getItem('plan') as Plan) || 'Free'
}

const Feature = ({ children }: { children: string }) => (
  <li className="flex items-start gap-2 text-sm text-text">
    <svg className="w-4 h-4 mt-0.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span className="text-text-subtle">{children}</span>
  </li>
)

const UpgradePage = () => {
  const navigate = useNavigate()
  const [plan, setPlan] = useState<Plan>(getStoredPlan())

  useEffect(() => {
    setPlan(getStoredPlan())
  }, [])

  const handleMockPayPal = () => {
    localStorage.setItem('plan', 'Go')
    localStorage.removeItem('quota_used')
    setPlan('Go')
    navigate('/profile')
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-text text-center">Upgrade your plan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Card */}
          <div className={`rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8`}> 
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Free</h2>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">₹0<span className="text-base font-normal text-text-subtle ml-1">/ month</span></div>
            <p className="mt-2 text-sm text-text-subtle">Intelligence for everyday tasks</p>
            <button className="mt-5 w-full px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-primary-500/10" disabled>
              Your current plan
            </button>
            <ul className="mt-6 space-y-3">
              <Feature>Access to GPT-5</Feature>
              <Feature>Limited file uploads</Feature>
              <Feature>Limited and slower image generation</Feature>
              <Feature>Limited memory and context</Feature>
              <Feature>Limited deep research</Feature>
            </ul>
            <p className="mt-6 text-xs text-text-subtle">Have an existing plan? <button className="underline hover:text-primary-600">See billing help</button></p>
          </div>

          {/* Go Card */}
          <div className={`rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 relative ${plan==='Go' ? 'ring-2 ring-primary-500/30' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Go</h2>
              <span className="text-2xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">NEW</span>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">₹399<span className="text-base font-normal text-text-subtle ml-1">/ month</span></div>
            <p className="mt-2 text-sm text-text-subtle">More access to popular features</p>
            <button onClick={handleMockPayPal} className="mt-5 w-full px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600">
              Upgrade to Go
            </button>
            <ul className="mt-6 space-y-3">
              <Feature>Expanded Access to GPT-5</Feature>
              <Feature>Expanded messaging and uploads</Feature>
              <Feature>Expanded and faster image creation</Feature>
              <Feature>Longer memory and context</Feature>
              <Feature>Limited deep research</Feature>
              <Feature>Projects, tasks, custom GPTs</Feature>
            </ul>
            <p className="mt-6 text-xs text-text-subtle">Only available in certain regions. <button className="underline hover:text-primary-600">Limits apply</button></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpgradePage



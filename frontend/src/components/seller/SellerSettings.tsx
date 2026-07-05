import { useState, useEffect } from 'react'
import { Settings, Mail, Phone, User } from 'lucide-react'
import { getProfile, updateProfile } from '../../services/api'

export default function SellerSettings() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadProfile = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) return

    try {
      const profileData = await getProfile(Number(userId))

      setProfile({
        username: profileData.username || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
      })
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const saveProfile = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) return

    setIsSaving(true)

    try {
      await updateProfile({
        user: Number(userId),
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
      })

      localStorage.setItem('userEmail', profile.email)

      alert('Profile updated successfully!')
    } catch (err) {
      console.log(err)
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const loadInitialProfile = async () => {
      await loadProfile()
    }

    loadInitialProfile()
  }, [])

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <p className="text-slate-400">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings Card */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-pink-500/20 p-3">
            <Settings className="h-6 w-6 text-pink-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <User className="h-4 w-4 text-pink-400" />
              Full Name
            </label>
            <input
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Mail className="h-4 w-4 text-pink-400" />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
              <Phone className="h-4 w-4 text-pink-400" />
              Phone Number
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder="Enter your phone number"
              className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 transition focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="w-full rounded-lg bg-pink-500 px-6 py-3 font-semibold text-white transition hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl border border-blue-500/50 bg-blue-500/10 p-4 text-sm text-blue-300">
        <p>
          <strong>Note:</strong> Keep your profile information up to date so
          customers can easily reach you. Your email will be updated in the
          system as well.
        </p>
      </div>
    </div>
  )
}

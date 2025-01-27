import { useState, useEffect } from "react"

interface ReferralSystemProps {
  initData: string
  userId: string
  startParam: string
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({ initData, userId, startParam }) => {
  const [referrals, setReferrals] = useState<any[]>([]) // تحديث نوع الإحالات ليكون متوافقاً مع البيانات في قاعدة البيانات
  const [referrer, setReferrer] = useState<string | null>(null)
  const INVITE_URL = "https://t.me/foragge_bot/force_gge/start?startapp="

  useEffect(() => {
    // فحص الإحالة
    const checkReferral = async () => {
      if (startParam && userId) {
        try {
          const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, referrerId: startParam }), // إرسال بيانات الإحالة إلى السيرفر
          })
          if (!response.ok) throw new Error('Failed to save referral')
        } catch (error) {
          console.error('Error saving referral:', error)
        }
      }
    }

    // جلب الإحالات
    const fetchReferrals = async () => {
      if (userId) {
        try {
          const response = await fetch(`/api/referrals?userId=${userId}`)
          if (!response.ok) throw new Error('Failed to fetch referrals')
          const data = await response.json()
          setReferrals(data.referrals)
          setReferrer(data.referrer) // جلب المعرف المحيل (referrer)
        } catch (error) {
          console.error('Error fetching referrals:', error)
        }
      }
    }

    checkReferral()
    fetchReferrals()
  }, [userId, startParam])

  // وظيفة لفتح رابط الدعوة عبر تلغرام
  const handleInviteFriend = () => {
    const inviteLink = `${INVITE_URL}${userId}`
    const shareText = `Join me on this awesome Telegram mini app!`
    const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`
    window.open(fullUrl, "_blank") // فتح رابط في نافذة جديدة
  }

  // وظيفة لنسخ رابط الدعوة
  const handleCopyLink = () => {
    const inviteLink = `${INVITE_URL}${userId}`
    navigator.clipboard.writeText(inviteLink)
    alert('Invite link copied to clipboard!')
  }

  return (
    <div className="w-full max-w-md">
      {referrer && (
        <p className="text-green-500 mb-4">You were referred by user {referrer}</p>
      )}
      <div className="flex flex-col space-y-4">
        <button
          onClick={handleInviteFriend}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Invite Friend
        </button>
        <button
          onClick={handleCopyLink}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Copy Invite Link
        </button>
      </div>
      {referrals.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
          <ul>
            {referrals.map((referral) => (
              <li key={referral.id} className="bg-gray-100 p-2 mb-2 rounded">
                <strong>User:</strong> {referral.referredId} | <strong>Status:</strong> {referral.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ReferralSystem

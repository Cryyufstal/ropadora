"use client";
import { useState, useEffect } from "react";

interface Referral {
  id: string;
  userId: string;
  referredId: string;
  status: string;
  createdAt: string;
}

export default function ReferralPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [telegramId, setTelegramId] = useState<string | null>(null);

  // جلب telegramId تلقائيًا من الـ API عند تحميل الصفحة
  useEffect(() => {
    const fetchTelegramId = async () => {
      try {
        const response = await fetch("/api/user"); // استعلام الـ API للحصول على telegramId
        const data = await response.json();
        setTelegramId(data.telegramId); // تخزين telegramId في الحالة
      } catch (error) {
        console.error("Failed to fetch Telegram ID", error);
      }
    };

    fetchTelegramId();
  }, []);

  // بناء رابط الإحالة باستخدام telegramId
  const referralLink = telegramId
    ? `https://t.me/foragge_bot/force_gge/start?startapp=${telegramId}`
    : "";

  // جلب الإحالات
  const fetchReferrals = async () => {
    if (!telegramId) {
      alert("Telegram ID is missing.");
      return;
    }

    try {
      const response = await fetch(`/api/referrals/${telegramId}`);
      if (!response.ok) throw new Error("Failed to fetch referrals.");
      const data: Referral[] = await response.json();
      setReferrals(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch referrals.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Referral System</h1>

      {/* رابط الإحالة */}
      {telegramId && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Your Referral Link:</h2>
          <p
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            <a
              href={referralLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff" }}
            >
              {referralLink}
            </a>
          </p>
        </div>
      )}

      {/* زر جلب الإحالات */}
      {telegramId && (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={fetchReferrals}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fetch Referrals
          </button>
        </div>
      )}

      {/* قائمة الأشخاص الذين تمت إحالتهم */}
      <div>
        <h2>Referred Users:</h2>
        {referrals.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {referrals.map((referral) => (
              <li
                key={referral.id}
                style={{
                  backgroundColor: "#f9f9f9",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <strong>Referred User ID:</strong> {referral.referredId} |{" "}
                <strong>Status:</strong> {referral.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No referrals found.</p>
        )}
      </div>
    </div>
  );
}

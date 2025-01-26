import { useState } from "react";

interface Referral {
  id: string;
  userId: string;
  referredId: string;
  status: string;
  createdAt: string;
}

export default function ReferralPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [userId, setUserId] = useState<string>("");

  const fetchReferrals = async () => {
    if (!userId) {
      alert("Please enter your User ID.");
      return;
    }

    try {
      const response = await fetch(`/api/referrals/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch referrals.");
      const data: Referral[] = await response.json();
      setReferrals(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch referrals.");
    }
  };

  const referralLink = `t.me/foragge_bot/force_gge${userId}`;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Referral System</h1>

      {/* إدخال معرف المستخدم */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter your User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "300px" }}
        />
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

      {/* رابط الإحالة */}
      {userId && (
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
            <a href={`https://${referralLink}`} target="_blank" rel="noopener noreferrer">
              {referralLink}
            </a>
          </p>
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

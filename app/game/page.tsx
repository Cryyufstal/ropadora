'use client';
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
    const response = await fetch(`/api/referrals/${userId}`);
    const data: Referral[] = await response.json();
    setReferrals(data);
  };

  return (
    <div>
      <h1>Referral System</h1>
      <input
        type="text"
        placeholder="Enter your user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={fetchReferrals}>Fetch Referrals</button>

      <ul>
        {referrals.map((referral) => (
          <li key={referral.id}>
            Referred User ID: {referral.referredId} | Status: {referral.status}
          </li>
        ))}
      </ul>
    </div>
  );
}


import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // إضافة إحالة جديدة
    const { userId, referrerId } = req.body;

    if (!userId || !referrerId) {
      return res.status(400).json({ error: "userId and referrerId are required." });
    }

    try {
      // تحقق إذا كانت الإحالة موجودة مسبقًا
      const existingReferral = await prisma.referral.findFirst({
        where: {
          userId,
          referredId: referrerId,
        },
      });

      if (existingReferral) {
        return res.status(409).json({ message: "Referral already exists." });
      }

      // إضافة الإحالة
      const newReferral = await prisma.referral.create({
        data: {
          userId: referrerId, // المستخدم المحيل
          referredId: userId, // المستخدم المُحال
          status: "pending",
        },
      });

      return res.status(201).json(newReferral);
    } catch (error) {
      console.error("Error saving referral:", error);
      return res.status(500).json({ error: "Failed to save referral." });
    }
  } else if (req.method === "GET") {
    // جلب الإحالات لمستخدم معين
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required." });
    }

    try {
      // جلب الإحالات للمستخدم الحالي
      const referrals = await prisma.referral.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          referredId: true,
          status: true,
          createdAt: true,
        },
      });

      // جلب المستخدم المحيل إذا كان موجودًا
      const referrer = await prisma.referral.findFirst({
        where: {
          referredId: userId,
        },
        select: {
          userId: true,
        },
      });

      return res.status(200).json({
        referrals,
        referrer: referrer ? referrer.userId : null,
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
      return res.status(500).json({ error: "Failed to fetch referrals." });
    }
  } else {
    // الرد على الطلبات غير المدعومة
    return res.setHeader("Allow", ["POST", "GET"]).status(405).end("Method Not Allowed");
  }
}

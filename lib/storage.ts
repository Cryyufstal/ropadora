import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveReferral(userId: string, referrerId: string): Promise<void> {
  // تحقق من وجود المستخدمين
  const referrer = await prisma.user.findUnique({ where: { id: referrerId } });
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!referrer || !user) {
    throw new Error("User or referrer not found");
  }

  // تحديث بيانات الإحالة
  await prisma.referral.create({
    data: {
      referredId: userId,
      userId: referrerId,
      status: "pending", // يمكنك تحديث الحالة حسب الحاجة
    },
  });
}

export async function getReferrals(userId: string): Promise<string[]> {
  // استرجاع المستخدمين المُحالين
  const referrals = await prisma.referral.findMany({
    where: { userId },
    select: { referredId: true },
  });

  return referrals.map((referral) => referral.referredId);
}

export async function getReferrer(userId: string): Promise<string | null> {
  // استرجاع المحيل
  const referral = await prisma.referral.findUnique({
    where: { referredId: userId },
    select: { userId: true },
  });

  return referral ? referral.userId : null;
}

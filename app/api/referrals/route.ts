import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: إضافة إحالة جديدة
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, referrerId } = body;

  if (!userId || !referrerId) {
    return NextResponse.json({ error: "userId and referrerId are required." }, { status: 400 });
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
      return NextResponse.json({ message: "Referral already exists." }, { status: 409 });
    }

    // إضافة الإحالة
    const newReferral = await prisma.referral.create({
      data: {
        userId: referrerId, // المستخدم المحيل
        referredId: userId, // المستخدم المُحال
        status: "pending",
      },
    });

    return NextResponse.json(newReferral, { status: 201 });
  } catch (error) {
    console.error("Error saving referral:", error);
    return NextResponse.json({ error: "Failed to save referral." }, { status: 500 });
  }
}

// GET: جلب الإحالات لمستخدم معين
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
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

    return NextResponse.json({
      referrals,
      referrer: referrer ? referrer.userId : null,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json({ error: "Failed to fetch referrals." }, { status: 500 });
  }
}
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
  } finally {
    await prisma.$disconnect();
  }
}


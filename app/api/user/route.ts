import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
    });

    // إذا لم يكن المستخدم موجودًا، قم بإنشائه
    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: userData.id,
          username: userData.username || '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
        },
      });

      // إذا كان هناك referrerId في البيانات، أضف المستخدم إلى جدول الإحالات
      if (userData.referrerId) {
        await prisma.referral.create({
          data: {
            userId: userData.referrerId, // معرف المستخدم الذي قام بالإحالة
            referredId: user.id,         // معرف المستخدم المُحال
            status: 'pending',
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error processing user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

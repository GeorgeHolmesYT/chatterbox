import { NextRequest, NextResponse } from 'next/server';
import { verifyCaptcha } from '../../../lib/captcha';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Captcha token is required' },
        { status: 400 }
      );
    }

    const isValid = await verifyCaptcha(token);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in captcha verification API:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

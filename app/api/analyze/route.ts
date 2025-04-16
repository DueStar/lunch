import { NextResponse } from 'next/server';
import { analyzeUserInput } from '@/lib/openai';
import { z } from 'zod';

const requestSchema = z.object({
  userInput: z.string().min(1, '입력값을 입력해주세요.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userInput } = requestSchema.parse(body);

    const analysis = await analyzeUserInput(userInput);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '잘못된 입력값입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 
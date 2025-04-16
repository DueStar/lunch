import OpenAI from 'openai';
import { AnalysisResponse } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeUserInput(input: string): Promise<AnalysisResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `당신은 사용자의 기분과 상황을 분석하여 적절한 음식을 추천하는 전문가입니다.
다음 입력을 분석하여 가장 적절한 음식 키워드 1개와 공감적이고 따뜻한 추천 멘트를 생성해주세요.`
        },
        {
          role: "user",
          content: input
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('No response from OpenAI');
    }

    const parsedResult = JSON.parse(result) as AnalysisResponse;
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing user input:', error);
    throw error;
  }
} 
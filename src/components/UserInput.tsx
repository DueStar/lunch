'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { AnalysisResponse } from '@/types';

export default function UserInput() {
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('입력값을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 오류가 발생했습니다.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">오늘 점심 뭐 먹지?</h2>
        <div className="space-y-4">
          <Textarea
            placeholder="지금 기분이나 생각, 먹고 싶은 음식을 자유롭게 입력해주세요..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '분석 중...' : '추천 받기'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-md">
            <h3 className="font-semibold text-lg mb-2">
              추천 음식: {result.foodKeyword}
            </h3>
            <p className="text-gray-700">{result.recommendationMessage}</p>
          </div>
        )}
      </Card>
    </div>
  );
} 
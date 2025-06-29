
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

interface UserCommentSectionProps {
  userComment: string;
  onUserCommentChange: (comment: string) => void;
}

const UserCommentSection = ({ userComment, onUserCommentChange }: UserCommentSectionProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-blue-500" />
        💬 현장 의견 입력
      </h4>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <Textarea
          value={userComment}
          onChange={(e) => onUserCommentChange(e.target.value)}
          placeholder="현장에서 확인된 추가 정보나 의견을 입력해주세요..."
          className="min-h-[80px] resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          이 의견은 PDF 리포트와 Make.com 전송에 포함됩니다.
        </p>
      </div>
    </div>
  );
};

export default UserCommentSection;

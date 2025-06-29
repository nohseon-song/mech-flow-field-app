
import React from 'react';

interface WebhookResponseSectionProps {
  webhookResponse: any;
}

const WebhookResponseSection = ({ webhookResponse }: WebhookResponseSectionProps) => {
  if (!webhookResponse) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
      <h4 className="font-semibold text-sm text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-2">
        🔗 Make.com 처리 결과
      </h4>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <pre className="text-xs text-blue-800 dark:text-blue-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
          {JSON.stringify(webhookResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WebhookResponseSection;

import { useState, useCallback } from 'react';

export const useAiConcierge = (initialMessage = '') => {
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState(initialMessage);

  const toggleAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(prev => !prev);
  }, []);

  const handleCloseAiConcierge = useCallback(() => {
    setIsAiConciergeOpen(false);
  }, []);

  const updateAiMessage = useCallback((newMessage) => {
    setAiMessage(newMessage);
    setIsAiConciergeOpen(true); // メッセージ更新時にコンシェルジュを開く
  }, []);

  return {
    isAiConciergeOpen,
    aiMessage,
    toggleAiConcierge,
    handleCloseAiConcierge,
    updateAiMessage,
    // Note: setAiMessage is intentionally not exposed directly to enforce usage of updateAiMessage
  };
}; 
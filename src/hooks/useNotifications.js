import { useState, useCallback } from 'react';
import {
  notificationListHtml,
  kawagoeSupportDetailHtml,
  medicalExpenseDetailHtml
} from '../constants/aiContent'; // Corrected the import path again

export const useNotifications = (updateAiMessage, customer) => {
  const [notificationCount, setNotificationCount] = useState(2);
  const [areNotificationsUnread, setAreNotificationsUnread] = useState(true);

  const handleShowNotifications = useCallback(() => {
    const listContent = notificationListHtml(customer?.address || '不明');
    updateAiMessage(listContent);
    setNotificationCount(0);
    setAreNotificationsUnread(false);
  }, [updateAiMessage, customer?.address]);

  const handleShowNotificationDetail = useCallback((detailType) => {
    let detailContent = '';
    if (detailType === 'kawagoe') {
      detailContent = kawagoeSupportDetailHtml;
    } else if (detailType === 'medical') {
      detailContent = medicalExpenseDetailHtml;
    }
    if (detailContent) {
      updateAiMessage(detailContent);
    }
  }, [updateAiMessage]);

  // Renamed from showNotificationList in App.js for clarity within hook context
  const showNotificationListHandler = useCallback(() => {
      const listContent = notificationListHtml(customer?.address || '不明');
      updateAiMessage(listContent);
      // Optionally, reset count/unread status again if needed when going back
      // setNotificationCount(0);
      // setAreNotificationsUnread(false);
  }, [updateAiMessage, customer?.address]);


  return {
    notificationCount,
    areNotificationsUnread,
    handleShowNotifications,
    handleShowNotificationDetail,
    showNotificationListHandler, // Renamed return value
    // setNotificationCount and setAreNotificationsUnread are not exposed
  };
}; 
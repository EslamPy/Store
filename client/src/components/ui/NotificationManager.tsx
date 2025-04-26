import React, { useState, useCallback } from 'react';
import { CustomToast, ToastType } from './CustomToast';

interface Notification {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface NotificationManagerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  notifications, 
  removeNotification 
}) => {
  return (
    <div className="notifications-container fixed top-0 right-0 p-6 z-50 flex flex-col gap-3 items-end max-w-md w-full pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto w-full">
          <CustomToast
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Notification context to easily show notifications from anywhere in the app
type NotificationContextType = {
  showNotification: (message: string, type: ToastType, duration?: number) => void;
};

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationManager 
        notifications={notifications} 
        removeNotification={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 
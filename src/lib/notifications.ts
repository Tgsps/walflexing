// إشعارات محلية — تشتغل بأفضل شكل عند تثبيت التطبيق كـ PWA.

export function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function notificationsSupported(): boolean {
  return 'Notification' in window;
}

export function notificationPermission(): NotificationPermission {
  return notificationsSupported() ? Notification.permission : 'denied';
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  if (Notification.permission === 'default') {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }
  return Notification.permission;
}

export function showNotification(title: string, body: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/pwa-192x192.png', badge: '/pwa-192x192.png', dir: 'rtl', lang: 'ar' });
  } catch {
    /* بعض المتصفحات تتطلب ServiceWorkerRegistration.showNotification */
  }
}

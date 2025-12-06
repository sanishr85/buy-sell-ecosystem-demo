export const mockNotifications = [
  {
    id: 'notif-1',
    type: 'offer_received',
    title: 'New Offer Received',
    message: 'John the Plumber made an offer on your plumbing need',
    read: false,
    timestamp: '2025-11-28T11:00:00Z',
    actionUrl: '/offers',
    data: { offerId: 'offer-1', needId: '1' }
  },
  {
    id: 'notif-2',
    type: 'offer_accepted',
    title: 'Offer Accepted!',
    message: 'Your offer for Garage door repair was accepted',
    read: false,
    timestamp: '2025-11-27T10:05:00Z',
    actionUrl: '/orders/order-1',
    data: { orderId: 'order-1' }
  },
  {
    id: 'notif-3',
    type: 'message',
    title: 'New Message',
    message: 'Garage Door Experts sent you a message',
    read: true,
    timestamp: '2025-11-29T15:30:00Z',
    actionUrl: '/chat/chat-1',
    data: { chatId: 'chat-1' }
  }
];

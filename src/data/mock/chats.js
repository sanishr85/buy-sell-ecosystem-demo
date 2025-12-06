export const mockChats = [
  {
    id: 'chat-1',
    userId: 'seller-3',
    userName: 'Garage Door Experts',
    userAvatar: null,
    lastMessage: 'I can start working tomorrow at 9am',
    lastMessageTime: '2025-11-29T15:30:00Z',
    unreadCount: 2,
    orderId: 'order-1',
    needTitle: 'Garage door repair'
  },
  {
    id: 'chat-2',
    userId: 'seller-1',
    userName: 'John the Plumber',
    userAvatar: null,
    lastMessage: 'What time works best for you?',
    lastMessageTime: '2025-11-28T14:00:00Z',
    unreadCount: 0,
    orderId: null,
    needTitle: 'Need a plumber'
  }
];

export const mockMessages = {
  'chat-1': [
    {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'buyer-1',
      senderName: 'Sandeep Mishra',
      message: 'Hi, when can you start the repair?',
      timestamp: '2025-11-29T15:00:00Z',
      read: true
    },
    {
      id: 'msg-2',
      chatId: 'chat-1',
      senderId: 'seller-3',
      senderName: 'Garage Door Experts',
      message: 'I can start working tomorrow at 9am',
      timestamp: '2025-11-29T15:30:00Z',
      read: false
    }
  ]
};

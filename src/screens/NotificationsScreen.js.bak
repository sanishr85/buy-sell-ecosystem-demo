import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const mockNotifications = [
  {
    id: '1',
    type: 'offer',
    title: 'New offer received',
    message: 'Mike Wilson made an offer of $150 for your plumbing need',
    time: '5 minutes ago',
    read: false,
    icon: '💰',
  },
  {
    id: '2',
    type: 'message',
    title: 'New message',
    message: 'Sarah Chen: "I can start tomorrow morning"',
    time: '1 hour ago',
    read: false,
    icon: '💬',
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment confirmed',
    message: 'Your payment of $157.50 is now held in escrow',
    time: '2 hours ago',
    read: true,
    icon: '💳',
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsContainer}>
          {filteredNotifications.map(notification => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread
              ]}
            >
              <View style={styles.notificationIcon}>
                <Text style={styles.notificationIconText}>{notification.icon}</Text>
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.notificationTitleUnread
                  ]}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 24, color: colors.text },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: colors.textSecondary },
  markAllButton: { backgroundColor: colors.backgroundSecondary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  markAllText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  filterContainer: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.backgroundSecondary, marginRight: 8 },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTabTextActive: { color: colors.white },
  content: { flex: 1 },
  notificationsContainer: { paddingHorizontal: 20, paddingTop: 16 },
  notificationCard: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 12, padding: 16, marginBottom: 12 },
  notificationCardUnread: { backgroundColor: '#f5f3ff', borderLeftWidth: 4, borderLeftColor: colors.primary },
  notificationIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  notificationIconText: { fontSize: 24 },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  notificationTitle: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  notificationTitleUnread: { fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginLeft: 8 },
  notificationMessage: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 6 },
  notificationTime: { fontSize: 12, color: colors.textSecondary },
});

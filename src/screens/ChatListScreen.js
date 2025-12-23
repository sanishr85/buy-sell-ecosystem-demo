import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../theme/colors';

const mockChats = [
  {
    id: '1',
    otherUser: {
      name: 'Mike Wilson',
      avatar: 'M',
      role: 'seller',
    },
    lastMessage: {
      text: 'I can start working on your sink tomorrow morning.',
      time: '2m ago',
      unread: true,
    },
    orderId: 'ORD-12345',
    orderTitle: 'Plumber for kitchen sink',
  },
  {
    id: '2',
    otherUser: {
      name: 'Sarah Chen',
      avatar: 'S',
      role: 'seller',
    },
    lastMessage: {
      text: 'Thanks! I received the payment.',
      time: '1h ago',
      unread: false,
    },
    orderId: 'ORD-12346',
    orderTitle: 'Logo design',
  },
];

export default function ChatListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.orderTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = mockChats.filter(chat => chat.lastMessage.unread).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `₹{unreadCount} unread` : 'All caught up'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.chatsContainer}>
          {filteredChats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={styles.emptyTitle}>No messages found</Text>
              <Text style={styles.emptyText}>
                {searchQuery ? 'Try a different search' : 'Your conversations will appear here'}
              </Text>
            </View>
          ) : (
            filteredChats.map(chat => (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatCard}
                onPress={() => navigation.navigate('Chat', { chat })}
              >
                <View style={styles.chatAvatar}>
                  <Text style={styles.chatAvatarText}>{chat.otherUser.avatar}</Text>
                  {chat.lastMessage.unread && <View style={styles.unreadDot} />}
                </View>

                <View style={styles.chatContent}>
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{chat.otherUser.name}</Text>
                    <Text style={styles.chatTime}>{chat.lastMessage.time}</Text>
                  </View>
                  <Text style={styles.chatOrderTitle} numberOfLines={1}>
                    {chat.orderTitle}
                  </Text>
                  <Text 
                    style={[
                      styles.chatMessage,
                      chat.lastMessage.unread && styles.chatMessageUnread
                    ]} 
                    numberOfLines={1}
                  >
                    {chat.lastMessage.text}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  content: { flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: 20, marginTop: 20, marginBottom: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.text },
  chatsContainer: { paddingHorizontal: 20 },
  chatCard: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  chatAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12, position: 'relative' },
  chatAvatarText: { fontSize: 24, fontWeight: '700', color: colors.white },
  unreadDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444', position: 'absolute', top: 0, right: 0, borderWidth: 2, borderColor: colors.white },
  chatContent: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: '700', color: colors.text },
  chatTime: { fontSize: 12, color: colors.textSecondary },
  chatOrderTitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  chatMessage: { fontSize: 14, color: colors.textSecondary },
  chatMessageUnread: { fontWeight: '600', color: colors.text },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});

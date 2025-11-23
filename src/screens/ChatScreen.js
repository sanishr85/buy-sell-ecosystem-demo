import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../theme/colors';

const mockMessages = [
  {
    id: '1',
    senderId: 'other',
    text: 'Hi! I saw your need for a plumber. I can help with that.',
    time: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Great! When would you be available?',
    time: '10:32 AM',
    isMe: true,
  },
  {
    id: '3',
    senderId: 'other',
    text: 'I can come tomorrow morning around 9 AM. Does that work for you?',
    time: '10:35 AM',
    isMe: false,
  },
];

export default function ChatScreen({ route, navigation }) {
  const { chat } = route.params;
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        text: inputText.trim(),
        time: 'Just now',
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>{chat.otherUser.avatar}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{chat.otherUser.name}</Text>
          <Text style={styles.headerSubtitle}>{chat.orderTitle}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.isMe ? styles.messageWrapperMe : styles.messageWrapperOther
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.isMe ? styles.messageBubbleMe : styles.messageBubbleOther
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isMe ? styles.messageTextMe : styles.messageTextOther
                ]}
              >
                {message.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  message.isMe ? styles.messageTimeMe : styles.messageTimeOther
                ]}
              >
                {message.time}
              </Text>
            </View>
          </View>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 16, paddingTop: 60, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { marginRight: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { fontSize: 20, color: colors.text },
  userAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  userAvatarText: { fontSize: 18, fontWeight: '700', color: colors.white },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: colors.textSecondary },
  messagesContainer: { flex: 1 },
  messagesContent: { paddingHorizontal: 16, paddingTop: 16 },
  messageWrapper: { marginBottom: 12, maxWidth: '80%' },
  messageWrapperMe: { alignSelf: 'flex-end' },
  messageWrapperOther: { alignSelf: 'flex-start' },
  messageBubble: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
  messageBubbleMe: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  messageBubbleOther: { backgroundColor: colors.white, borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 20, marginBottom: 4 },
  messageTextMe: { color: colors.white },
  messageTextOther: { color: colors.text },
  messageTime: { fontSize: 11, marginTop: 4 },
  messageTimeMe: { color: 'rgba(255, 255, 255, 0.7)', textAlign: 'right' },
  messageTimeOther: { color: colors.textSecondary, textAlign: 'left' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.white, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.backgroundSecondary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: colors.text, maxHeight: 100, marginRight: 8 },
  sendButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: colors.border },
  sendButtonText: { fontSize: 18, color: colors.white },
});

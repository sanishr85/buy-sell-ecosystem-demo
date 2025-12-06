import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';

export default function RateSellerScreen({ route, navigation }) {
  const { order } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const ratingLabels = {
    1: { label: 'Poor', emoji: '😞' },
    2: { label: 'Fair', emoji: '😕' },
    3: { label: 'Good', emoji: '😊' },
    4: { label: 'Great', emoji: '😃' },
    5: { label: 'Excellent', emoji: '🤩' },
  };

  const positiveTags = [
    'Professional',
    'On time',
    'Great quality',
    'Good communication',
    'Fair pricing',
    'Would hire again',
  ];

  const negativeTags = [
    'Late arrival',
    'Poor quality',
    'Bad communication',
    'Overpriced',
    'Unprofessional',
  ];

  const displayTags = rating >= 4 ? positiveTags : rating > 0 ? negativeTags : [];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating');
      return;
    }

    Alert.alert(
      'Submit Rating?',
      `You're rating ${order.sellerName} ${rating} stars. This cannot be changed later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            Alert.alert('Thank You!', 'Your rating has been submitted.', [
              { text: 'OK', onPress: () => navigation.navigate('PostNeed') }
            ]);
          }
        }
      ]
    );
  };

  const currentRatingLabel = ratingLabels[rating];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Rate Seller</Text>
          <Text style={styles.headerSubtitle}>Share your experience</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sellerSection}>
          <View style={styles.sellerAvatar}>
            <Text style={styles.sellerAvatarText}>{order.sellerName.charAt(0)}</Text>
          </View>
          <Text style={styles.sellerName}>{order.sellerName}</Text>
          <Text style={styles.orderTitle}>{order.needTitle}</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed · ${order.amount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}
              >
                <Text style={[styles.star, rating >= star && styles.starFilled]}>
                  {rating >= star ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {currentRatingLabel && (
            <View style={styles.ratingLabelContainer}>
              <Text style={styles.ratingEmoji}>{currentRatingLabel.emoji}</Text>
              <Text style={styles.ratingLabel}>{currentRatingLabel.label}</Text>
            </View>
          )}
        </View>

        {displayTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What stood out?</Text>
            <View style={styles.tagsContainer}>
              {displayTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a review (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share more details about your experience..."
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
            maxLength={500}
          />
          <Text style={styles.charCount}>{review.length}/500</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmitRating}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.goBack()}>
            <Text style={styles.skipButtonText}>Skip for Now</Text>
          </TouchableOpacity>
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
  sellerSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: colors.white },
  sellerAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  sellerAvatarText: { fontSize: 36, fontWeight: '700', color: colors.white },
  sellerName: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  orderTitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, marginBottom: 12 },
  completedBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  completedText: { fontSize: 13, fontWeight: '700', color: '#059669' },
  section: { paddingHorizontal: 20, paddingVertical: 24, backgroundColor: colors.white, marginBottom: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16 },
  starButton: { paddingHorizontal: 8 },
  star: { fontSize: 48, color: '#d1d5db' },
  starFilled: { color: '#fbbf24' },
  ratingLabelContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 16 },
  ratingEmoji: { fontSize: 32, marginRight: 12 },
  ratingLabel: { fontSize: 20, fontWeight: '700', color: colors.text },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.backgroundSecondary, borderWidth: 2, borderColor: 'transparent' },
  tagSelected: { borderColor: colors.primary, backgroundColor: '#f5f3ff' },
  tagText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tagTextSelected: { color: colors.primary },
  textArea: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16, fontSize: 15, color: colors.text, height: 140 },
  charCount: { fontSize: 12, color: colors.textSecondary, textAlign: 'right', marginTop: 8 },
  actionSection: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  submitButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  submitButtonDisabled: { backgroundColor: colors.border },
  submitButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  skipButton: { backgroundColor: colors.backgroundSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  skipButtonText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
});

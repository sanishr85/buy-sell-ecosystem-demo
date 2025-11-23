import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors } from '../theme/colors';

export default function RateBuyerScreen({ route, navigation }) {
  const { offer } = route.params;
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const ratingLabels = {
    1: { label: 'Poor', emoji: '😞', color: '#ef4444' },
    2: { label: 'Fair', emoji: '😕', color: '#f59e0b' },
    3: { label: 'Good', emoji: '😊', color: '#eab308' },
    4: { label: 'Great', emoji: '😃', color: '#10b981' },
    5: { label: 'Excellent', emoji: '🤩', color: '#059669' },
  };

  const positiveTags = [
    'Easy to work with',
    'Clear communication',
    'Timely responses',
    'Professional',
    'Respectful',
    'Flexible',
    'Paid promptly',
    'Good instructions',
  ];

  const negativeTags = [
    'Poor communication',
    'Unrealistic expectations',
    'Late responses',
    'Changed requirements',
    'Payment issues',
    'Rude behavior',
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
      `You're rating ${offer.buyerName} ${rating} stars. This cannot be changed later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: () => {
            // TODO: API call to submit rating
            Alert.alert('Thank You!', 'Your rating has been submitted.', [
              { text: 'OK', onPress: () => navigation.navigate('MyOffers') }
            ]);
          }
        }
      ]
    );
  };

  const currentRatingLabel = ratingLabels[hoverRating || rating];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Rate Buyer</Text>
          <Text style={styles.headerSubtitle}>Share your experience</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buyer Info */}
        <View style={styles.buyerSection}>
          <View style={styles.buyerAvatar}>
            <Text style={styles.buyerAvatarText}>{offer.buyerName.charAt(0)}</Text>
          </View>
          <Text style={styles.buyerName}>{offer.buyerName}</Text>
          <Text style={styles.offerTitle}>{offer.needTitle}</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed · ${offer.amount}</Text>
          </View>
        </View>

        {/* Star Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                onPressIn={() => setHoverRating(star)}
                onPressOut={() => setHoverRating(0)}
                style={styles.starButton}
              >
                <Text style={[
                  styles.star,
                  (hoverRating >= star || rating >= star) && styles.starFilled
                ]}>
                  {(hoverRating >= star || rating >= star) ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {currentRatingLabel && (
            <View style={styles.ratingLabelContainer}>
              <Text style={styles.ratingEmoji}>{currentRatingLabel.emoji}</Text>
              <Text style={[styles.ratingLabel, { color: currentRatingLabel.color }]}>
                {currentRatingLabel.label}
              </Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {displayTags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What stood out? (Optional)</Text>
            <Text style={styles.sectionDescription}>Select all that apply</Text>
            <View style={styles.tagsContainer}>
              {displayTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected,
                    rating >= 4 && selectedTags.includes(tag) && styles.tagPositiveSelected,
                    rating < 4 && rating > 0 && selectedTags.includes(tag) && styles.tagNegativeSelected,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected
                  ]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write a review (Optional)</Text>
          <Text style={styles.sectionDescription}>Share more details about your experience</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What would you like other sellers to know about this buyer?"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textSecondary}
            maxLength={500}
          />
          <Text style={styles.charCount}>{review.length}/500 characters</Text>
        </View>

        {/* Privacy Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>🔒</Text>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Your rating is anonymous</Text>
            <Text style={styles.noticeText}>
              Buyers won't know who left specific ratings. Your rating helps maintain quality in the marketplace.
            </Text>
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Rating Guidelines</Text>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineBullet}>•</Text>
            <Text style={styles.guidelineText}>Be honest and fair in your assessment</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineBullet}>•</Text>
            <Text style={styles.guidelineText}>Focus on the transaction experience</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineBullet}>•</Text>
            <Text style={styles.guidelineText}>Avoid personal attacks or offensive language</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Text style={styles.guidelineBullet}>•</Text>
            <Text style={styles.guidelineText}>Ratings cannot be edited after submission</Text>
          </View>
        </View>

        {/* Submit Button */}
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
  
  buyerSection: { alignItems: 'center', paddingVertical: 32, backgroundColor: colors.white },
  buyerAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  buyerAvatarText: { fontSize: 36, fontWeight: '700', color: colors.white },
  buyerName: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  offerTitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32, marginBottom: 12 },
  completedBadge: { backgroundColor: '#d1fae5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  completedText: { fontSize: 13, fontWeight: '700', color: '#059669' },
  
  section: { paddingHorizontal: 20, paddingVertical: 24, backgroundColor: colors.white, marginBottom: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 6 },
  sectionDescription: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
  
  starsContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 16 },
  starButton: { paddingHorizontal: 8 },
  star: { fontSize: 48, color: '#d1d5db' },
  starFilled: { color: '#fbbf24' },
  
  ratingLabelContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 16 },
  ratingEmoji: { fontSize: 32, marginRight: 12 },
  ratingLabel: { fontSize: 20, fontWeight: '700' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: colors.backgroundSecondary, borderWidth: 2, borderColor: 'transparent' },
  tagSelected: { borderColor: colors.primary },
  tagPositiveSelected: { backgroundColor: '#d1fae5', borderColor: '#10b981' },
  tagNegativeSelected: { backgroundColor: '#fee2e2', borderColor: '#ef4444' },
  tagText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tagTextSelected: { color: colors.text },
  
  textArea: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16, fontSize: 15, color: colors.text, height: 140, borderWidth: 2, borderColor: 'transparent' },
  charCount: { fontSize: 12, color: colors.textSecondary, textAlign: 'right', marginTop: 8 },
  
  noticeCard: { flexDirection: 'row', backgroundColor: '#eff6ff', marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#dbeafe' },
  noticeIcon: { fontSize: 24, marginRight: 12 },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 14, fontWeight: '700', color: '#1e40af', marginBottom: 4 },
  noticeText: { fontSize: 13, color: '#1e3a8a', lineHeight: 18 },
  
  guidelinesCard: { backgroundColor: colors.white, marginHorizontal: 20, marginTop: 16, padding: 20, borderRadius: 12 },
  guidelinesTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 16 },
  guidelineItem: { flexDirection: 'row', marginBottom: 12 },
  guidelineBullet: { fontSize: 16, color: colors.textSecondary, marginRight: 8, width: 20 },
  guidelineText: { flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  
  actionSection: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  submitButton: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitButtonDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
  submitButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  skipButton: { backgroundColor: colors.backgroundSecondary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  skipButtonText: { color: colors.textSecondary, fontSize: 16, fontWeight: '600' },
});

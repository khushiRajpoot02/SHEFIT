import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { colours, spacing, fontSizes, fontWeights, radius, shadows } from '../../../theme';
import { WorkoutPlan } from '../../../types';


interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  onPress: (plan: WorkoutPlan) => void;
}

const LEVEL_COLORS = {
  beginner: colours.success,
  intermediate: colours.primary,
  advanced: colours.error,
};

export const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({ plan, onPress }) => {
  const levelColor = LEVEL_COLORS[plan.level];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(plan)}
      activeOpacity={0.85}>

      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        {plan.thumbnailUrl ? (
          <Image source={{ uri: plan.thumbnailUrl }} style={styles.thumbnail} />
        ) : (
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.thumbnailPlaceholderIcon}>🏋️</Text>
          </View>
        )}

        {/* Category tag overlaid on image */}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryTagText}>{plan.category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title row + level badge */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{plan.title}</Text>
          <View style={[styles.levelBadge, { borderColor: levelColor }]}>
            <Text style={[styles.levelText, { color: levelColor }]}>
              {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>{plan.description}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statIcon}>⏱</Text>
            <Text style={styles.statText}>{plan.durationInMinutes} mins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statText}>{plan.caloriesBurn} kcal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statText}>{plan.excercises.length} exercises</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.border,
    overflow: 'hidden',
    marginBottom: spacing[4],
    ...shadows.md,
  },
  thumbnailContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colours.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPlaceholderIcon: {
    fontSize: 48,
  },
  categoryTag: {
    position: 'absolute',
    top: spacing[3],
    left: spacing[3],
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  categoryTagText: {
    color: colours.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    padding: spacing[4],
    gap: spacing[2],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  title: {
    flex: 1,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
  },
  levelBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.xs,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  levelText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    lineHeight: fontSizes.sm * 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 12,
  },
  statText: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: colours.border,
    marginHorizontal: spacing[3],
  },
});

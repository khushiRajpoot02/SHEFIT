import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colours, spacing, fontSizes, fontWeights, radius } from '../../../theme';

export type WorkoutExercise = {
  exercise: {
    id: string;
    name: string;
    muscleGroups: string[];
    equipment: string;
    instructions: string[];
  };
  order: number;
  sets: number;
  reps?: number;
  duration?: number;  // seconds, for timed exercises
  restTime: number;
  notes?: string;
};

interface ExerciseRowProps {
  item: WorkoutExercise;
  isLast?: boolean;
}

export const ExerciseRow: React.FC<ExerciseRowProps> = ({ item, isLast }) => {
  const repOrTime = item.reps
    ? `${item.sets} × ${item.reps} reps`
    : `${item.sets} × ${item.duration}s`;

  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      {/* Order number badge */}
      <View style={styles.orderBadge}>
        <Text style={styles.orderText}>{item.order}</Text>
      </View>

      {/* Exercise info */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.exercise.name}</Text>

        {/* Muscle groups */}
        <View style={styles.tagsRow}>
          {item.exercise.muscleGroups.map(m => (
            <View key={m} style={styles.muscleTag}>
              <Text style={styles.muscleTagText}>{m}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Sets × reps + rest */}
      <View style={styles.right}>
        <Text style={styles.repText}>{repOrTime}</Text>
        <Text style={styles.restText}>Rest {item.restTime}s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border,
  },
  orderBadge: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colours.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orderText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colours.primary,
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semiBold,
    color: colours.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  muscleTag: {
    backgroundColor: colours.surfaceAlt,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colours.border,
  },
  muscleTagText: {
    fontSize: fontSizes.xs,
    color: colours.textMuted,
    textTransform: 'capitalize',
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  repText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colours.primary,
  },
  restText: {
    fontSize: fontSizes.xs,
    color: colours.textMuted,
  },
});

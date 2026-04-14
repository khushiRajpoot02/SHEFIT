import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colours, spacing, fontSizes, fontWeights, radius, shadows } from '../../../theme';
import { AppButton } from '../../../components/ui/AppButton';
import { ExerciseRow } from '../components/ExerciseRow';
import type { WorkoutPlan } from '../components/WorkoutPlanCard';

interface WorkoutDetailScreenProps {
  navigation: any;
  route: any;
}

const LEVEL_COLORS = {
  beginner: colours.success,
  intermediate: colours.primary,
  advanced: colours.error,
};

const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({ navigation: _navigation, route }) => {

  // TODO: get selected plan from Redux (workouts.selectedPlan) instead of route.params
  const plan: WorkoutPlan = route.params?.plan;

  if (!plan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Plan not found.</Text>
      </SafeAreaView>
    );
  }

  const levelColor = LEVEL_COLORS[plan.level];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero image ───────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          {plan.thumbnailUrl ? (
            <Image source={{ uri: plan.thumbnailUrl }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderIcon}>🏋️‍♀️</Text>
            </View>
          )}

          <View style={styles.heroOverlay} />

          {/* TODO: navigation.goBack() on press */}
          <TouchableOpacity style={styles.backButton} onPress={() => {}} activeOpacity={0.8}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={[styles.levelBadge, { borderColor: levelColor }]}>
              <Text style={[styles.levelText, { color: levelColor }]}>
                {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
              </Text>
            </View>
            <Text style={styles.heroTitle}>{plan.title}</Text>
            <Text style={styles.heroDescription}>{plan.description}</Text>
          </View>
        </View>

        {/* ── Stats bar ────────────────────────────────────────── */}
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.durationMins}</Text>
            <Text style={styles.statLabel}>mins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.caloriesBurn}</Text>
            <Text style={styles.statLabel}>kcal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{plan.exercises.length}</Text>
            <Text style={styles.statLabel}>exercises</Text>
          </View>
        </View>

        {/* ── Exercises list ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          <View style={styles.exerciseList}>
            {plan.exercises.length > 0 ? (
              plan.exercises.map((item, index) => (
                <ExerciseRow
                  key={item.exercise?.id ?? index}
                  item={item}
                  isLast={index === plan.exercises.length - 1}
                />
              ))
            ) : (
              <View style={styles.emptyExercises}>
                <Text style={styles.emptyText}>No exercises added yet.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: spacing[20] }} />
      </ScrollView>

      {/* ── Sticky Start Workout button ──────────────────────── */}
      <View style={styles.stickyFooter}>
        {/* TODO: dispatch(startWorkout(plan)) then navigate to ActiveWorkout */}
        <AppButton title="▶  Start Workout" onPress={() => {}} size="lg" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  errorText: {
    color: colours.textMuted,
    textAlign: 'center',
    marginTop: spacing[16],
  },
  heroContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colours.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 64,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  backButton: {
    position: 'absolute',
    top: spacing[12],
    left: spacing[5],
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: colours.white,
    fontSize: fontSizes.xl,
    lineHeight: 22,
  },
  heroContent: {
    position: 'absolute',
    bottom: spacing[5],
    left: spacing[5],
    right: spacing[5],
    gap: spacing[2],
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 3,
    borderRadius: radius.xs,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  levelText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colours.white,
    letterSpacing: -0.5,
  },
  heroDescription: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: fontSizes.sm * 1.5,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colours.surface,
    borderBottomWidth: 1,
    borderBottomColor: colours.border,
    paddingVertical: spacing[4],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colours.primary,
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: colours.border,
    marginVertical: spacing[1],
  },
  section: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    marginBottom: spacing[2],
  },
  exerciseList: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.border,
    paddingHorizontal: spacing[4],
    ...shadows.sm,
  },
  emptyExercises: {
    paddingVertical: spacing[6],
    alignItems: 'center',
  },
  emptyText: {
    color: colours.textMuted,
    fontSize: fontSizes.sm,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colours.background,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colours.border,
  },
});

export default WorkoutDetailScreen;

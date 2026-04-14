import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colours, spacing, fontSizes, fontWeights, radius, shadows } from '../../../theme';
import { AppButton } from '../../../components/ui/AppButton';
import type { WorkoutPlan } from '../components/WorkoutPlanCard';
import type { WorkoutExercise } from '../components/ExerciseRow';

interface ActiveWorkoutScreenProps {
  navigation: any;
  route: any;
}

const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({ navigation: _navigation, route }) => {

  // TODO: get session from Redux (activeWorkout slice) instead of route.params
  const plan: WorkoutPlan = route.params?.plan;

  // TODO: get these from Redux session state
  const currentIndex = 0;
  const currentSet = 1;
  // TODO: get phase from Redux session state
  const phase = 'exercise' as 'exercise' | 'rest' | 'completed';

  if (!plan || plan.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>No exercises found.</Text>
      </SafeAreaView>
    );
  }

  const totalExercises = plan.exercises.length;
  const currentItem: WorkoutExercise = plan.exercises[currentIndex];
  const exercise = currentItem.exercise;
  const progressPercent = (currentIndex / totalExercises) * 100;

  // ── Completed screen ────────────────────────────────────────────
  if (phase === 'completed') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colours.background} />
        <View style={styles.completedContainer}>
          <Text style={styles.completedIcon}>🎉</Text>
          <Text style={styles.completedTitle}>Workout Complete!</Text>
          <Text style={styles.completedSubtitle}>
            You crushed {totalExercises} exercises in {plan.title}
          </Text>
          <View style={styles.completedStats}>
            <View style={styles.completedStatItem}>
              <Text style={styles.completedStatValue}>{plan.durationMins}</Text>
              <Text style={styles.completedStatLabel}>mins</Text>
            </View>
            <View style={styles.completedStatItem}>
              <Text style={styles.completedStatValue}>{plan.caloriesBurn}</Text>
              <Text style={styles.completedStatLabel}>kcal</Text>
            </View>
            <View style={styles.completedStatItem}>
              <Text style={styles.completedStatValue}>{totalExercises}</Text>
              <Text style={styles.completedStatLabel}>exercises</Text>
            </View>
          </View>
          {/* TODO: dispatch(endWorkout()) then navigate back */}
          <AppButton title="Back to Workouts" onPress={() => {}} size="lg" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Rest screen ─────────────────────────────────────────────────
  if (phase === 'rest') {
    const nextItem: WorkoutExercise | undefined = plan.exercises[currentIndex + 1];
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colours.background} />

        {/* TODO: dispatch(endWorkout()) then navigate back on quit */}
        <TouchableOpacity style={styles.quitButton} onPress={() => {}}>
          <Text style={styles.quitText}>✕ Quit</Text>
        </TouchableOpacity>

        <View style={styles.restContainer}>
          <Text style={styles.restLabel}>REST</Text>
          {/* TODO: show live countdown timer from Redux */}
          <Text style={styles.restTimer}>{currentItem.restTime}s</Text>
          <Text style={styles.restHint}>Catch your breath</Text>

          {nextItem && (
            <View style={styles.upNextCard}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextName}>{nextItem.exercise?.name}</Text>
              <Text style={styles.upNextSets}>
                {`${nextItem.sets} sets × ${nextItem.reps ?? `${nextItem.duration}s`}`}
              </Text>
            </View>
          )}

          {/* TODO: dispatch(setPhase('exercise')) on skip */}
          <AppButton
            title="Skip Rest →"
            onPress={() => {}}
            variant="outline"
            size="md"
            style={styles.skipButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Exercise screen ─────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background} />

      {/* ── Top bar ──────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>
            Exercise {currentIndex + 1} of {totalExercises}
          </Text>
          <Text style={styles.planName}>{plan.title}</Text>
        </View>
        {/* TODO: dispatch(endWorkout()) then navigate back on quit */}
        <TouchableOpacity style={styles.quitButtonInline} onPress={() => {}}>
          <Text style={styles.quitText}>✕ Quit</Text>
        </TouchableOpacity>
      </View>

      {/* ── Progress bar ─────────────────────────────────────── */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.exerciseContent} showsVerticalScrollIndicator={false}>

        {/* ── Exercise name + set indicator ─────────────────── */}
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise?.name ?? '—'}</Text>
          <View style={styles.setIndicator}>
            <Text style={styles.setIndicatorText}>
              Set {currentSet} / {currentItem.sets}
            </Text>
          </View>
        </View>

        {/* ── Reps / duration target ────────────────────────── */}
        <View style={styles.targetCard}>
          <Text style={styles.targetValue}>
            {currentItem.reps ?? `${currentItem.duration}s`}
          </Text>
          <Text style={styles.targetUnit}>
            {currentItem.reps ? 'reps' : 'seconds'}
          </Text>
        </View>

        {/* ── Muscle groups ─────────────────────────────────── */}
        {exercise?.muscleGroups?.length > 0 && (
          <View style={styles.musclesRow}>
            {exercise.muscleGroups.map((m: string) => (
              <View key={m} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{m}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Instructions ──────────────────────────────────── */}
        {exercise?.instructions?.length > 0 && (
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to perform</Text>
            {exercise.instructions.map((step: string, i: number) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Set progress dots ─────────────────────────────── */}
        <View style={styles.setDots}>
          {Array.from({ length: currentItem.sets }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.setDot,
                i < currentSet - 1 && styles.setDotDone,
                i === currentSet - 1 && styles.setDotActive,
              ]}
            />
          ))}
        </View>

        <View style={{ height: spacing[16] }} />
      </ScrollView>

      {/* ── Sticky CTA ───────────────────────────────────────── */}
      <View style={styles.stickyFooter}>
        {/* TODO: dispatch(nextSet()) or dispatch(nextExercise()) based on current progress */}
        <AppButton title="Done — Next Set" onPress={() => {}} size="lg" />
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  progressInfo: {
    gap: 2,
  },
  progressLabel: {
    fontSize: fontSizes.xs,
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  planName: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semiBold,
    color: colours.textSecondary,
  },
  quitButton: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    alignSelf: 'flex-end',
  },
  quitButtonInline: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.sm,
    backgroundColor: colours.surfaceAlt,
    borderWidth: 1,
    borderColor: colours.border,
  },
  quitText: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    fontWeight: fontWeights.medium,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: colours.surfaceAlt,
    marginHorizontal: spacing[5],
    borderRadius: radius.full,
    marginBottom: spacing[5],
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colours.primary,
    borderRadius: radius.full,
  },
  exerciseContent: {
    paddingHorizontal: spacing[5],
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[5],
  },
  exerciseName: {
    flex: 1,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    letterSpacing: -0.5,
  },
  setIndicator: {
    backgroundColor: colours.primaryFaded,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.primary,
  },
  setIndicatorText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colours.primary,
  },
  targetCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colours.border,
    paddingVertical: spacing[10],
    alignItems: 'center',
    marginBottom: spacing[5],
    ...shadows.md,
  },
  targetValue: {
    fontSize: 80,
    fontWeight: fontWeights.extraBold,
    color: colours.primary,
    lineHeight: 88,
  },
  targetUnit: {
    fontSize: fontSizes.lg,
    color: colours.textMuted,
    marginTop: spacing[1],
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  muscleTag: {
    backgroundColor: colours.surfaceAlt,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.border,
  },
  muscleTagText: {
    fontSize: fontSizes.xs,
    color: colours.textSecondary,
    textTransform: 'capitalize',
  },
  instructionsCard: {
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.border,
    padding: spacing[4],
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  instructionsTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colours.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: spacing[3],
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colours.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumber: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colours.primary,
  },
  stepText: {
    flex: 1,
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    lineHeight: fontSizes.sm * 1.6,
  },
  setDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  setDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colours.surfaceAlt,
    borderWidth: 1,
    borderColor: colours.border,
  },
  setDotDone: {
    backgroundColor: colours.primaryDark,
    borderColor: colours.primaryDark,
  },
  setDotActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
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
  restContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[5],
  },
  restLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  restTimer: {
    fontSize: 96,
    fontWeight: fontWeights.extraBold,
    color: colours.primary,
    lineHeight: 104,
  },
  restHint: {
    fontSize: fontSizes.base,
    color: colours.textSecondary,
  },
  upNextCard: {
    width: '100%',
    backgroundColor: colours.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colours.border,
    padding: spacing[4],
    gap: spacing[1],
  },
  upNextLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  upNextName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
  },
  upNextSets: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
  },
  skipButton: {
    width: '100%',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[5],
  },
  completedIcon: {
    fontSize: 72,
  },
  completedTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  completedSubtitle: {
    fontSize: fontSizes.base,
    color: colours.textSecondary,
    textAlign: 'center',
    lineHeight: fontSizes.base * 1.5,
  },
  completedStats: {
    flexDirection: 'row',
    gap: spacing[8],
    paddingVertical: spacing[4],
  },
  completedStatItem: {
    alignItems: 'center',
    gap: 2,
  },
  completedStatValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colours.primary,
  },
  completedStatLabel: {
    fontSize: fontSizes.xs,
    color: colours.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});

export default ActiveWorkoutScreen;

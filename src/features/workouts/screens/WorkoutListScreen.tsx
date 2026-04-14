import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colours, spacing, fontSizes, fontWeights, radius } from '../../../theme';
import { WorkoutPlanCard, WorkoutPlan } from '../components/WorkoutPlanCard';

const FILTERS = ['All', 'Legs', 'Upper Body', 'Core', 'Full Body'];

interface WorkoutListScreenProps {
  navigation: any;
}

const WorkoutListScreen: React.FC<WorkoutListScreenProps> = ({ navigation: _navigation }) => {

  // TODO: get plans and loading state from Redux (workouts slice)
  const plans: WorkoutPlan[] = [];

  // TODO: track active filter in local state and filter plans by category
  const activeFilter = 'All';
  const filteredPlans = plans;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Workouts</Text>
          {/* TODO: show plans.length here */}
          <Text style={styles.headerSubtitle}>0 plans available</Text>
        </View>
      </View>

      {/* ── Filter chips ───────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter}
            // TODO: on press update activeFilter state
            onPress={() => {}}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.filterChipActive,
            ]}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.filterChipTextActive,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Plans list ─────────────────────────────────────────── */}
      <FlatList
        data={filteredPlans}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <WorkoutPlanCard
            plan={item}
            // TODO: dispatch selectPlan(item) then navigate to WorkoutDetail
            onPress={() => {}}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyText}>No plans in this category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colours.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[4],
  },
  headerTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    color: colours.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: colours.textSecondary,
    marginTop: 2,
  },
  filtersContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colours.border,
    backgroundColor: colours.surface,
  },
  filterChipActive: {
    backgroundColor: colours.primary,
    borderColor: colours.primary,
  },
  filterChipText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colours.textSecondary,
  },
  filterChipTextActive: {
    color: colours.white,
    fontWeight: fontWeights.semiBold,
  },
  listContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: spacing[16],
    gap: spacing[3],
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: fontSizes.base,
    color: colours.textMuted,
  },
});

export default WorkoutListScreen;

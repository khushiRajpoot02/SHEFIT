import firestore from '@react-native-firebase/firestore';

const seedData = [
  {
    title: 'Glutes & Legs',
    description: 'Focus on explosive movements and form.',
    level: 'intermediate',
    category: 'Legs',
    durationMins: 60,
    caloriesBurn: 450,
    thumbnailUrl: '',
    tags: ['legs', 'strength', 'glutes'],
    exercises: [
      {
        exercise: {
          id: 'ex1',
          name: 'Barbell Back Squat',
          muscleGroups: ['glutes', 'quads'],
          equipment: 'Barbell',
          instructions: ['Stand with feet shoulder width', 'Lower until thighs parallel'],
        },
        order: 1,
        sets: 4,
        reps: 12,
        restTime: 60,
      },
      {
        exercise: {
          id: 'ex2',
          name: 'Romanian Deadlift',
          muscleGroups: ['hamstrings', 'glutes'],
          equipment: 'Barbell',
          instructions: ['Hinge at hips', 'Keep back straight'],
        },
        order: 2,
        sets: 3,
        reps: 10,
        restTime: 90,
      },
    ],
    createdAt: firestore.FieldValue.serverTimestamp(),
  },
];

export const seedWorkouts = async () => {
  for (const plan of seedData) {
    await firestore().collection('workoutPlans').add(plan);
  }
  console.log('Seeded!');
};



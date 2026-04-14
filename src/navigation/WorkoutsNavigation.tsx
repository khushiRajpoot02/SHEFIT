import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutListScreen from '../features/workouts/screens/WorkoutListScreen';
import WorkoutDetailScreen from '../features/workouts/screens/WorkoutDetailScreen';
import ActiveWorkoutScreen from '../features/workouts/screens/ActiveWorkoutScreen';


const Stack = createNativeStackNavigator();

const WorkoutNavigation  = ()=>{
    return(
     <Stack.Navigator screenOptions={{headerShown : false}}>
        <Stack.Screen name="Workout List" component={WorkoutListScreen}/>
        <Stack.Screen name="Workout DetailScreen" component={WorkoutDetailScreen}/>
        <Stack.Screen name="Active Workout" component={ActiveWorkoutScreen}/>
     </Stack.Navigator>
    )
}

export default WorkoutNavigation;
type Excercise = {
    id: string,
    name: string,
    description : string,
    muscelGroups:string[],
    equipments:[],
    videoUrl: string,
    thumbnailUrl:string,
    instructions:string[],
}
type WorkoutExcercise = {
    excercises: Excercise,
    order: number,
    sets: number,
    reps: number,
    duration: number,
    restTime: number,
    notes?: string
} 
type WorkoutPlan={
    id: string,
    title:string,
    description:string,
    level:'beginer' | 'intermediate' | 'advanced',
    category: string,
    durationInMinutes : number,
    caloriesBurn : number,
    thumbnailUrl: string,
    excercises: WorkoutExcercise[],
    tags:string[],
    createdAt:string
}
type ActiveWorkoutSession = {
    plan: WorkoutPlan,
    currentExcerciseIndex: number,
    currentSet: number,
    phase:'excercise' | 'rest' | 'completed',
    timerSeconds: number,
    startedAt: number,
    completedExcerciseIndex: number
}
type Wrokoutlogs = {
    id: string,
    userId: string,
    planId: string,
    planTitle: string,
    completedAt: string,
    actualDurationMinuts : number,
    excercisesCompleted: number,
    totalExcercises: number,
    caloriesBurned: number
}

// till 10 complete this
// how will I access this ?
// git pe push kr and vhaa jake khud se try krte h 

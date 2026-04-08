import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Authentication from '../features/auth/Authentication';


const AuthNavigator = ()=>{
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="Auth" component={Authentication}/>
        </Stack.Navigator>

    )
}
export default AuthNavigator;
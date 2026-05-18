import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Authentication from '../features/auth/Authentication';
import PostScreen from "../practice/screens/PostScreen";


const AuthNavigator = ()=>{
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator screenOptions={{headerShown : false}}>
            <Stack.Screen name="Auth" component={Authentication}/>

            {/* <Stack.Screen name ="Post" component={PostScreen} /> */}
        </Stack.Navigator>

    )
}
export default AuthNavigator;
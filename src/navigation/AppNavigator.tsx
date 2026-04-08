import { NavigationAction, NavigationContainer } from "@react-navigation/native";
import { createStaticNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../features/auth/screens/HomeScreen";
import { useAuth } from "../hooks/useAuth";
import { ActivityIndicator } from "react-native";
const AppNavigator = ()=>{

    const {logout, loading} = useAuth();

    if(loading) return <ActivityIndicator size ="large" color="blue"/>

const handleLogout = async ()=>{
   const logoutresult = await logout();
   console.log("logoutresult--", logoutresult);

}

const Tab = createBottomTabNavigator();
return (
    <Tab.Navigator>
        <Tab.Screen  name="Home">
            {(props)=>(
                <HomeScreen
                {...props}
                handleLogout={handleLogout}
                ></HomeScreen>
            )}
            </Tab.Screen>
    </Tab.Navigator>
  )
}

// ab tk kya kya kiaa hai 
// called firebase API for login, signup , created hook for user status 
// used hook inside auth 
// signup and login on clik of the btn 
// now based on login and signup status show error , loading and naviagtion 

export default AppNavigator;
import { Button, Text, View } from "react-native"
import NativeGymGirlDeviceInfo from "../../../native/NativeGymGirlDeviceInfo";
import { useEffect, useState } from "react";

 type homescreenProp = {
    handleLogout :()=> void,
 }
const HomeScreen = ({handleLogout}:homescreenProp)=>{

const[deviceInfo, setDeviceInfo] = useState({
 model:'',
 version:'',
 isEmulator:true,

});

useEffect(()=>{
    const loadDeviceInfo = async()=>{
        const model = await NativeGymGirlDeviceInfo.getDeviceModel();
        const version = await NativeGymGirlDeviceInfo.getSystemVersion();
        const emulator = await NativeGymGirlDeviceInfo.isEmulator();
        setDeviceInfo(prev=>({
            ...prev,
            model : model,
            version:version,
            isEmulator: emulator
        }))   
        console.log("modalllll",model);    // "vivo V2030"
        console.log("versionnnn",version);  // "14"
        console.log("emulator",emulator); // false
    };
    loadDeviceInfo();

}, [])
    return(
        <View><Text>Welcom to home screen</Text>
        
        <Button title="logout"
        onPress={()=>handleLogout()}
        
        />
        </View>
    )
}

export default HomeScreen;
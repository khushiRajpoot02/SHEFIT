import auth from '@react-native-firebase/auth';

export const login = async(email:string, password:string) => {
    try{
       const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential;
    }
    catch(error:any){
        console.log("errorr-1--", error);
        console.error(error.message);
        throw error;
    }
}

export const signup = async (email:string, password: string)=>{
    try{
       const registerCredentials = await auth().createUserWithEmailAndPassword(email, password);
       return registerCredentials;

    } catch(error:any){
        console.log("errorrr---2", error);
        console.error(error.messgae);
        throw error;

    }
}
// khushi+test123@gmail.com


export const logout = async()=>{
    return await auth().signOut();
}

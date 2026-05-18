import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import Toast from "react-native-toast-message";
import { Provider } from 'react-redux';
import { store } from './src/practice/store';

function App(): React.JSX.Element {
  return (
    <Provider store ={store}>
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <RootNavigator/>
      <Toast />
    </SafeAreaProvider>
    </Provider>
  );
}
export default App;

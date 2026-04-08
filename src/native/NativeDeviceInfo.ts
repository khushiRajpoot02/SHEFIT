import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// export interface Spec extends TurboModule {
//   getDeviceModel(): Promise<string>;
//   getSystemVersion(): Promise<string>;
//   isEmulator(): Promise<boolean>;
// }

// export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfo');
// //                                                      ↑
//                          this string must match getName() in Kotlin
//                          and the name in your ObjC bridge file


// file name must start with Native
// must use Turbomoduleregistry.getEnforcing
// string name must match what kotlin/swift registers


export interface Spec extends TurboModule{
    getDeviceModel():Promise<string>;
    getSystemVersion():Promise<string>;
    isEmulator():Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('DeviceInfo');
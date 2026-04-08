import Foundation
import UIKit

@objc(DeviceInfoModule)
class DeviceInfoModule: NSObject {

  @objc static func requiresMainQueueSetup() -> Bool {
    return false // no UI work, safe to run on background thread
  }

  @objc func getDeviceModel(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    // UIDevice gives us hardware info on iOS
    resolve(UIDevice.current.model) // → "iPhone", "iPad"
  }

  @objc func getSystemVersion(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    resolve(UIDevice.current.systemVersion) // → "17.0"
  }

  @objc func isEmulator(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    // TARGET_OS_SIMULATOR is a compile-time flag set by Xcode
    #if targetEnvironment(simulator)
      resolve(true)
    #else
      resolve(false)
    #endif
  }
}

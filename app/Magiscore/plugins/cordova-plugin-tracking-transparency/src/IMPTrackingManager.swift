//
//  IMPTrackingManager.swift
//  Cordova Tracking Transparency
//
//  Created by Felix Nievelstein on 10.05.21.
//

import UIKit
import AppTrackingTransparency

@available(iOS 14, *)
class IMPTrackingManager: InfoViewControllerDelegate {
    
    static let shared: IMPTrackingManager = IMPTrackingManager()
    
    private init() {}
    
    var trackingStatus: ATTrackingManager.AuthorizationStatus {
        get {
            ATTrackingManager.trackingAuthorizationStatus
        }
    }
    
    var trackingAvailable: Bool {
        get {
            return ATTrackingManager.trackingAuthorizationStatus == .authorized
        }
    }
    
    var canRequestTracking: Bool {
        get {
            return ATTrackingManager.trackingAuthorizationStatus == .notDetermined
        }
    }
    
    var requestCompletion: ((Bool) -> ())? = nil
    var viewController: InfoViewController? = nil
        
    func requestTracking(completion: @escaping (Bool) -> (), info: TrackingRequestInfo? = nil) {
        if let mInfo = info {
            viewController = InfoViewController(info: mInfo, nibName: "InfoViewController", bundle: nil)
            viewController!.delegate = self
            requestCompletion = completion
            viewController!.modalPresentationStyle = .overFullScreen
            if !present(viewController: viewController!) {
                ATTrackingManager.requestTrackingAuthorization {[weak self] status in
                    guard let strongSelf = self else { return }
                    completion(strongSelf.trackingAvailable)
                }
            }
        } else {
            ATTrackingManager.requestTrackingAuthorization {[weak self] status in
                guard let strongSelf = self else { return }
                completion(strongSelf.trackingAvailable)
            }
        }
    }
    
    private func present(viewController: UIViewController) -> Bool {
        if let topVC = getCurrentViewController() {
            topVC.present(viewController, animated: true, completion: nil)
            return true
        } else {
            print("cordova-plugin-tracking-transparency: Could not get view controller")
            return false
        }
    }
    
    func onButtonPressed() {
        ATTrackingManager.requestTrackingAuthorization {[weak self] status in
            guard let strongSelf = self else { return }
            if let mCompletion = strongSelf.requestCompletion {
                mCompletion(strongSelf.trackingAvailable)
            }
            strongSelf.requestCompletion = nil
            DispatchQueue.main.async {
                strongSelf.viewController?.dismiss(animated: true, completion: nil)
            }
        }
    }
    
    private func getCurrentViewController() -> UIViewController? {
        var currentVC: UIViewController? = nil
        if let viewController = getRootVC() {
            currentVC = viewController
            while currentVC?.presentedViewController != nil
            {
                currentVC = currentVC?.presentedViewController;
            }
        }
        return currentVC
    }
    
    private func getRootVC() -> UIViewController? {
        if let rootViewController = UIApplication.shared.connectedScenes.filter({$0.activationState == .foregroundActive}).map({$0 as? UIWindowScene}).compactMap({$0}).first?.windows.filter({$0.isKeyWindow}).first?.rootViewController {
            return rootViewController
        } else {
            return UIApplication.shared.windows.first?.rootViewController
        }
    }
}

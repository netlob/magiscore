//
//  TrackingRequestInfo.swift
//  Cordova Tracking Transparency
//
//  Created by Felix Nievelstein on 11.05.21.
//

import UIKit

struct TrackingRequestInfo: Decodable {
    /**
     Hex value of the background color
     */
    let primaryColor: UIColor
    let secondaryColor: UIColor
    let onPrimaryColor: UIColor
    let onSecondaryColor: UIColor
    let title: String
    let text: String?
    let reasons: [TrackingRequestReason]
    let subText: String
    let buttonTitle: String
    
    enum CodingKeys: String, CodingKey {
        case primaryColor
        case secondaryColor
        case onPrimaryColor
        case onSecondaryColor
        case title
        case text
        case reasons
        case subText
        case buttonTitle
    }
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        title = try values.decode(String.self, forKey: .title)
        do {
            text = try values.decode(String.self, forKey: .text)
        } catch {
            text = nil
        }
        subText = try values.decode(String.self, forKey: .subText)
        buttonTitle = try values.decode(String.self, forKey: .buttonTitle)
        reasons = try values.decode([TrackingRequestReason].self, forKey: .reasons)
        primaryColor = TrackingRequestInfo.colorFrom(string: try values.decode(String.self, forKey: .primaryColor))
        secondaryColor = TrackingRequestInfo.colorFrom(string: try values.decode(String.self, forKey: .secondaryColor))
        onPrimaryColor = TrackingRequestInfo.colorFrom(string: try values.decode(String.self, forKey: .onPrimaryColor))
        onSecondaryColor = TrackingRequestInfo.colorFrom(string: try values.decode(String.self, forKey: .onSecondaryColor))
    }
    
    private static func colorFrom(string: String?) -> UIColor {
        if let hexColor = string, let uiColor = UIColor(hex: hexColor) {
            return uiColor
        } else {
            return UIColor.white
        }
    }
}

struct TrackingRequestReason: Decodable {
    let text: String
    let image: UIImage
    let tintImage: Bool
    
    enum CodingKeys: String, CodingKey {
        case text
        case image
        case tintImage
    }
    
    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        text = try values.decode(String.self, forKey: .text)
        tintImage = try values.decode(Bool.self, forKey: .tintImage)
        let imageString = try values.decode(String.self, forKey: .image)
        if #available(iOS 13.0, *) {
            if let mImage = TrackingRequestReason.imageForBase64String(imageString) {
                if tintImage {
                    image = mImage.withRenderingMode(.alwaysTemplate)
                } else {
                    image = mImage.withRenderingMode(.alwaysOriginal)
                }
            } else if let mImage = UIImage(systemName: imageString) {
                image = mImage
            } else {
                image = UIImage()
            }
        } else {
            if let mImage = TrackingRequestReason.imageForBase64String(imageString) {
                if tintImage {
                    image = mImage.withRenderingMode(.alwaysTemplate)
                } else {
                    image = mImage.withRenderingMode(.alwaysOriginal)
                }
            } else {
                image = UIImage()
            }
        }
    }
    
    static func imageForBase64String(_ strBase64: String) -> UIImage? {
        do{
            let imageData = try Data(contentsOf: URL(string: strBase64)!)
            let image = UIImage(data: imageData)
            return image!
        }
        catch{
            return nil
        }
    }
    
    
}

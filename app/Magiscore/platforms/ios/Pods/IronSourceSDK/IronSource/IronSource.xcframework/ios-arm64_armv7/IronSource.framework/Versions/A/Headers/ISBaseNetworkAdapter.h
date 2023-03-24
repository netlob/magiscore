//
//  ISBaseNetworkAdapter.h
//  IronSource
//
//  Created by Guy Lis on 05/07/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ISAdapterBaseProtocol.h"
#import "ISAdapterDebugProtocol.h"
#import "ISAdapterConsentProtocol.h"
#import "ISAdapterMetaDataProtocol.h"

NS_ASSUME_NONNULL_BEGIN

@interface ISBaseNetworkAdapter : NSObject<ISAdapterBaseProtocol, ISAdapterDebugProtocol, ISAdapterConsentProtocol, ISAdapterMetaDataProtocol>

@end

NS_ASSUME_NONNULL_END

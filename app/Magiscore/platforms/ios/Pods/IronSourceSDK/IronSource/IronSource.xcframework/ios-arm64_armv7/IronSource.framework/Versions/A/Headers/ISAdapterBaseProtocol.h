//
//  ISAdapterBaseInterface.h
//  IronSource
//
//  Created by Yonti Makmel on 27/04/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "ISAdData.h"
#import "ISNetworkInitializationDelegate.h"

#ifndef ISAdapterBaseProtocol_h
#define ISAdapterBaseProtocol_h

//@protocol ISAdapterBaseInterface;

@protocol ISAdapterBaseProtocol <NSObject>

-(void)init:(ISAdData*)adData delegate:(id<ISNetworkInitializationDelegate>)delegate;
-(NSString*)networkSDKVersion;
-(NSString*)adapterVersion;

@end

#endif /* ISAdapterBaseInterface_h */

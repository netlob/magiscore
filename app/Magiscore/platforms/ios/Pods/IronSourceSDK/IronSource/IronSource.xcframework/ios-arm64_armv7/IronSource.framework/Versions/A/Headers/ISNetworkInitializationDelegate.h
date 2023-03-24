//
//  ISNetworkInitializationDelegate.h
//  IronSource
//
//  Created by Yonti Makmel on 07/06/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//
#import <Foundation/Foundation.h>

#ifndef ISNetworkInitializationDelegate_h
#define ISNetworkInitializationDelegate_h


@protocol ISNetworkInitializationDelegate<NSObject>

- (void)onInitDidSucceed;
- (void)onInitDidFailWithErrorCode:(int)errorCode errorMessage:(NSString*)errorMessage;

@end

#endif /* ISNetworkInitializationDelegate_h */

//
//  ISAdapterAdDelegate.h
//  IronSource
//
//  Created by Yonti Makmel on 28/04/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//


#ifndef ISAdapterAdDelegate_h
#define ISAdapterAdDelegate_h

#import "ISAdapterErrorType.h"

@protocol ISAdapterAdDelegate <NSObject>

-(void)adDidLoad;
-(void)adDidFailToLoadWithErrorType:(ISAdapterErrorType)errorType errorCode:(int)errorCode errorMessage:(NSString*)errorMessage;
-(void)adDidOpen;
-(void)adDidClose;
-(void)adDidFailToShowWithErrorCode:(int)errorCode errorMessage:(NSString*)errorMessage;
-(void)adDidShowSucceed;
-(void)adDidClick;

@end

#endif /* ISAdapterAdDelegate_h */

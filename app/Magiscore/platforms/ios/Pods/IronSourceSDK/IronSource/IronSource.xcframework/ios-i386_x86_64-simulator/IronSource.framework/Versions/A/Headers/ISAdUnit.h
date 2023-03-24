//
//  ISAdUnit.h
//  IronSource
//
//  Created by Yonti Makmel on 18/04/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ISAdUnit : NSObject


@property (strong, nonatomic) NSString *value;

+(ISAdUnit*)REWARDED_VIDEO;
+(ISAdUnit*)INTERSTITIAL;
+(ISAdUnit*)OFFERWALL;
+(ISAdUnit*)BANNER;

- (instancetype)initWithValue:(NSString*)value;

@end

NS_ASSUME_NONNULL_END

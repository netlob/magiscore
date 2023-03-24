//
//  ISAdapterConfig.m
//  IronSource
//
//  Created by Gili Ariel on 8/1/15.
//  Copyright (c) 2015 IronSource. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "ISAdUnit.h"

#define DEFAULT_CAPPING_PER_DAY 99
#define DEFAULT_CAPPING_PER_SESSION 99
#define DEFAULT_CAPPING_PER_ITERATION 99


@interface ISAdapterConfig : NSObject

@property (strong, nonatomic, readonly) NSDictionary  *settings;
@property (strong, nonatomic, readonly) NSString      *providerName; /* Name from waterfall */
@property (strong, nonatomic, readonly) NSString      *reflectionName; /* Name of Adapter class to load */
@property (strong, nonatomic, readonly) NSString      *name; /* name of adapter in mediation cycle' */
@property (strong, nonatomic, readonly) NSString      *requestUrl;
@property (strong, nonatomic, readonly) NSString      *subAdapterId;
@property (strong, nonatomic, readonly) NSString      *instanceId;
@property (strong, nonatomic, readonly) NSNumber      *maxAdsPerIteration;
@property (strong, nonatomic, readonly) NSNumber      *maxAdsPerSession;
@property (strong, nonatomic, readonly) NSString      *instanceType;
@property (assign, nonatomic, readonly) NSInteger     maxAdsPerDay;
@property (assign, nonatomic, readonly) double        loadTimeOutSec;
@property (assign, nonatomic, readonly) BOOL          isMultiProviderInstance;
@property (strong, nonatomic, readonly) NSString      *adSourceNameForEvent; // name from adSourceName property on init
@property (assign, nonatomic, readonly) BOOL          isBidder;
@property (strong, nonatomic, readonly) ISAdUnit      *adUnit;
@property (strong, nonatomic, readonly) NSDictionary  *appSettings;
@property (strong, nonatomic, readonly) NSDictionary  *interstitialSettings;
@property (strong, nonatomic, readonly) NSDictionary  *rewardedVideoSettings;
@property (strong, nonatomic, readonly) NSDictionary  *bannerSettings;

@property (strong, nonatomic, readonly) NSString      *providerDefaultInstance; /* Name of Adapter class to load (fallback to reflectionName) */
@property (strong, nonatomic, readonly) NSString      *customNetwork; /* name of the custom network is exists */
@property (assign, nonatomic, readonly) BOOL          isCustomNetwork; /* whether the configuration is for a custom network*/


- (instancetype)initWithProviderName:(NSString *)providerName;

- (void)setSettings:(NSDictionary *)settings;
- (void)setReflectionName:(NSString *)reflectionName;
- (void)setLoadTimeOut:(double)loadTimeOut;
- (void)setAdUnit:(ISAdUnit *)adUnit;
- (BOOL)isIronSource;
- (void)setAppSettings:(NSDictionary *)appSettings;
- (void)setInterstitialSettings:(NSDictionary *)interstitialSettings;
- (void)setRewardedVideoSettings:(NSDictionary *)rewardedVideoSettings;
- (void)setBannerSettings:(NSDictionary *)bannerSettings;
- (void)setProviderDefaultInstance:(NSString *)providerDefaultInstance;
- (void)setCustomNetwork:(NSString *)customNetwork;
- (NSString *)customNetworkAdapterNameForAdUnit:(ISAdUnit *)adUnit;
@end

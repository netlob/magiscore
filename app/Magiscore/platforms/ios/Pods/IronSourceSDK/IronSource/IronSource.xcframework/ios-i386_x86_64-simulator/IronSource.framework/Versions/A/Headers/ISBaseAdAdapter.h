//
//  ISBaseAdAdapter.h
//  IronSource
//
//  Created by Yonti Makmel on 27/04/2021.
//  Copyright © 2021 ironSource. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ISAdUnit.h"
#import "ISAdapterConfig.h"
#import "ISAdapterBaseProtocol.h"
#import "ISAdData.h"
#import "ISAdapterAdDelegate.h"
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@protocol ISBaseAdAdapterProtocol <NSObject>

- (void)loadAdWithAdData:(ISAdData*)adData delegate:(id<ISAdapterAdDelegate>)delegate;
- (void)showAdWithViewController:(UIViewController *)viewController adData:(ISAdData*)adData delegate:(id<ISAdapterAdDelegate>)delegate;
- (BOOL)isAdAvailableWithAdData:(ISAdData*)adData;

@end

@interface ISBaseAdAdapter : NSObject<ISBaseAdAdapterProtocol>

@property (nonatomic, readonly) ISAdUnit                    *adUnit;
@property (nonatomic, readonly) ISAdapterConfig             *adapterConfig;

- (instancetype)initWithAdUnit:(ISAdUnit*)adUnit
                 adapterConfig:(ISAdapterConfig*)adapterConfig;

-(id<ISAdapterBaseProtocol>)getNetworkAdapter;

/**
     * When the adapter needs to release certain elements to avoid memory leaks before being destroyed
 */
- (void) releaseMemory;

@end

NS_ASSUME_NONNULL_END

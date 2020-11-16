//
//  CDVPurchase.h
//
//  Created by Jean-Christophe Hoelt on 01/03/2019.
//  Copyright 2019 Jean-Christophe Hoelt. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#import <Cordova/CDVPlugin.h>

#ifndef __CORDOVA_4_0_0
    #import <Cordova/NSData+Base64.h>
#endif

#import "SKProduct+LocalizedPrice.h"
#import "FileUtility.h"

@interface CDVPurchase : CDVPlugin <SKPaymentTransactionObserver> {
    NSMutableDictionary *products;
    NSMutableDictionary *retainer;
    NSMutableDictionary *unfinishedTransactions;
    NSMutableDictionary *currentDownloads;
    NSMutableArray      *pendingTransactionUpdates;
    NSString            *loggerCallback;
    NSUserDefaults      *userDefaults;
    int                  verbosityLevel;
}

@property (nonatomic, retain) NSString* loggerCallback;
@property (nonatomic) int verbosityLevel;
@property (nonatomic, retain) NSUserDefaults *userDefaults;
@property (nonatomic, retain) NSMutableDictionary *products;
@property (nonatomic, retain) NSMutableDictionary *retainer;
@property (nonatomic, retain) NSMutableDictionary *currentDownloads;
@property (nonatomic, retain) NSMutableDictionary *unfinishedTransactions;
@property (nonatomic, retain) NSMutableArray *pendingTransactionUpdates;

- (void) debug:(NSString*)message { [self log:VERBOSITY_DEBUG message:message]; }
- (void) info:(NSString*)message { [self log:VERBOSITY_INFO message:message]; }
- (void) warn:(NSString*)message { [self log:VERBOSITY_WARN message:message]; }
- (void) error:(NSString*)message { [self log:VERBOSITY_ERROR message:message]; }
- (void) log:(int)level message:(NSString*)message;

- (void) canMakePayments: (CDVInvokedUrlCommand*)command;

- (void) setup: (CDVInvokedUrlCommand*)command;
- (void) load: (CDVInvokedUrlCommand*)command;
- (void) purchase: (CDVInvokedUrlCommand*)command;
- (void) appStoreReceipt: (CDVInvokedUrlCommand*)command;
- (void) appStoreRefreshReceipt: (CDVInvokedUrlCommand*)command;

- (void) pause: (CDVInvokedUrlCommand*)command;
- (void) resume: (CDVInvokedUrlCommand*)command;
- (void) cancel: (CDVInvokedUrlCommand*)command;

- (void) paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions;
- (void) paymentQueue:(SKPaymentQueue *)queue restoreCompletedTransactionsFailedWithError:(NSError *)error;
- (void) paymentQueueRestoreCompletedTransactionsFinished:(SKPaymentQueue *)queue;
- (void) paymentQueue:(SKPaymentQueue *)queue updatedDownloads:(NSArray *)downloads;

- (void) debug: (CDVInvokedUrlCommand*)command;
- (void) autoFinish: (CDVInvokedUrlCommand*)command;
- (void) finishTransaction: (CDVInvokedUrlCommand*)command;

- (void) onReset;
- (void) processPendingTransactionUpdates;
- (void) processTransactionUpdate:(SKPaymentTransaction*)transaction withArgs:(NSArray*)callbackArgs;
@end

@interface BatchProductsRequestDelegate : NSObject <SKProductsRequestDelegate> {
    InAppPurchase        *plugin;
    CDVInvokedUrlCommand *command;
}

@property (nonatomic,retain) InAppPurchase* plugin;
@property (nonatomic,retain) CDVInvokedUrlCommand* command;
@end;

@interface RefreshReceiptDelegate : NSObject <SKRequestDelegate> {
    InAppPurchase        *plugin;
    CDVInvokedUrlCommand *command;
}

@property (nonatomic,retain) InAppPurchase* plugin;
@property (nonatomic,retain) CDVInvokedUrlCommand* command;
@end


#import "CDVSharedPreferences.h"
#import "NSUserDefaults+CDVSharedPreferences.h"

static const int kArgumentIndexName = 0;
static const int kArgumentIndexKey = 1;
static const int kArgumentIndexValue = 2;

static NSString* const kErrorMessageMissingKey = @"Missing key";
static NSString* const kErrorMessageFailedToWrite = @"Failed to write";

@implementation CDVSharedPreferences
-(void)getBoolean:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;

        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];

        if([sharedPreferences containsKey:key]) {
            BOOL boolValue = [sharedPreferences boolForKey:key];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:boolValue];
            
            
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageMissingKey];
        }

        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)putBoolean:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        BOOL boolValue = [[args objectAtIndex:kArgumentIndexValue] boolValue];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        [sharedPreferences setBool:boolValue forKey:key];
        BOOL success = [sharedPreferences synchronize];
        if (success) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageFailedToWrite];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)getNumber:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];

        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];

        if([sharedPreferences containsKey:key]) {
            double doubleValue = [sharedPreferences doubleForKey:key];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:doubleValue];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageMissingKey];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)putNumber:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        double doubleValue = [[args objectAtIndex:kArgumentIndexValue] doubleValue];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        [sharedPreferences setDouble:doubleValue forKey:key];
        BOOL success = [sharedPreferences synchronize];
        if (success) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageFailedToWrite];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)getString:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        

        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];

        if([sharedPreferences containsKey:key]) {
            NSString* stringValue = [sharedPreferences stringForKey:key];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:stringValue];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageMissingKey];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)putString:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        NSString* stringValue = [args objectAtIndex:kArgumentIndexValue];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        [sharedPreferences setObject:stringValue forKey:key];
        BOOL success = [sharedPreferences synchronize];
        if (success) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageFailedToWrite];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)del:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        [sharedPreferences removeObjectForKey:key];
        BOOL success = [sharedPreferences synchronize];
        if (success) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageFailedToWrite];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)has:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        NSString* key = [args objectAtIndex:kArgumentIndexKey];

        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        BOOL result = [[[sharedPreferences dictionaryRepresentation] allKeys] containsObject:key];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:result];
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)keys:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];
        
        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        NSArray* keys = [[sharedPreferences dictionaryRepresentation] allKeys];
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:keys];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(void)clear:(CDVInvokedUrlCommand *)command
{
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult;
        
        NSArray* args = command.arguments;
        NSString* name = [args objectAtIndex:kArgumentIndexName];

        NSUserDefaults* sharedPreferences = [self sharedPreferencesWithName:name];
        
        NSArray* keys = [[sharedPreferences dictionaryRepresentation] allKeys];
        
        for (NSString* key in keys) {
            [sharedPreferences removeObjectForKey:key];
        }
        BOOL success = [sharedPreferences synchronize];
        if (success) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:kErrorMessageFailedToWrite];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

-(NSUserDefaults *)sharedPreferencesWithName:(NSString *)aName
{
    id _Nullable name = [aName isEqualToString:@""] ? nil : aName;
    return [[NSUserDefaults alloc] initWithSuiteName:name];
}
@end

#import <Cordova/CDVPlugin.h>

@interface CDVSharedPreferences : CDVPlugin
-(void)getBoolean:(CDVInvokedUrlCommand*)command;
-(void)putBoolean:(CDVInvokedUrlCommand*)command;
-(void)getNumber:(CDVInvokedUrlCommand *)command;
-(void)putNumber:(CDVInvokedUrlCommand *)command;
-(void)getString:(CDVInvokedUrlCommand*)command;
-(void)putString:(CDVInvokedUrlCommand*)command;
-(void)del:(CDVInvokedUrlCommand *)command;
-(void)has:(CDVInvokedUrlCommand *)command;
-(void)keys:(CDVInvokedUrlCommand *)command;
-(void)clear:(CDVInvokedUrlCommand *)command;
@end

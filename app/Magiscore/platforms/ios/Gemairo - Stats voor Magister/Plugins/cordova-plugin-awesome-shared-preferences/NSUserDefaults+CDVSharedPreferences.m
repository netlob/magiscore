#import "NSUserDefaults+CDVSharedPreferences.h"

@implementation NSUserDefaults(Preferences)
-(BOOL)containsKey:(NSString *)defaultName
{
    return [[[self dictionaryRepresentation] allKeys] containsObject:defaultName];
}
@end

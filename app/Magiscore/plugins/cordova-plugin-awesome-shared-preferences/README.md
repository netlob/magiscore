# Shared preferences for Cordova

[![Build Status](https://travis-ci.org/adriano-di-giovanni/cordova-plugin-shared-preferences.svg?branch=master)](https://travis-ci.org/adriano-di-giovanni/cordova-plugin-shared-preferences)

This plugin provides the ability to save and retrieve persistent key-value pairs of any Javascript data type. You can use this plugin to save any data: arrays, booleans, numbers, strings and objects. This data will persist across user sessions.

This plugin uses [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences.html) on Android and [NSUserDefaults](https://developer.apple.com/documentation/foundation/nsuserdefaults?language=objc) on iOS.

### Highlights

* save and retrieve key-value pairs of any Javascript data type using JSON serialization and parsing with `.put()` and `.get()`;
* also save and retrieve key-value pairs of booleans, numbers and strings mapping to native data types with `.putBoolean()`, `.getBoolean()`, `.putNumber()`, `.getNumber()`, `.putString()`, `.getString()`;
* fallback to user-defined default value if the key doesn't exist;
* manage multiple sets of preferences;
* well-tested cross-browser implementation.

Please, refer to [Installation](#installation), [Usage](#usage) and [API reference](#api_reference) sections for more information.

## Supported platforms

* Android
* iOS

## Installation <a name="installation"></a>

```bash
npm install cordova-plugin-awesome-shared-preferences
```

## Usage <a name="usage"></a>

Invoke `SharedPreferences.getInstance()` to retrieve the instance for the default set of preferences:

```javascript
var sharedPreferences = window.plugins.SharedPreferences.getInstance()
```

You can manage than one set of preferences. Invoke `SharePreferences.getInstance(name)` to retrieve an instance for a specific set:

```javascripts
var sharedPreferences = window.plugins.SharedPreferences.getInstance('settings')
```

Set a new preference using `.put()`:

```javascript
var key = 'fruits'
var value = ['Apple', 'Banana']
var successCallback = function() {
    console.log('OK')
}
var errorCallback = function(err) {
    console.error(err)
}

sharedPreferences.put(key, value, successCallback, errorCallback)
```

Retrieve a value from the preferences using `.get()`:

```javascript
var key = 'fruits'
var successCallback = function(value) {
    console.log(value)
}
var errorCallback = function(err) {
    console.log(err)
}

sharedPreferences.get(key, successCallback, errorCallback)
```

If the key doesn't exist, the `errorCallback` will be invoked. You can override this behavior providing a default value:

```javascript
var key = 'animals' // the key doesn't exist
var defaultValue = 'Dog'
var successCallback = function(value) {
    console.log(value) // Dog
}
var errorCallback = function(err) {
    console.error(err)
}

sharedPreferences.get(key, defaultValue, successCallback, errorCallback)
```

Delete a key-value pair from the preferences using `.del()`:

```javascript
var key = 'fruits'
var successCallback = function() {
    console.log('OK')
}
var errorCallback = function(err) {
    console.error(err)
}

sharedPreferences.del(key, successCallback, errorCallback)
```

## API reference <a name="api_reference"></a>


* [SharedPreferences](#window.plugins.module_SharedPreferences)
    * _static_
        * [.getInstance([name])](#window.plugins.module_SharedPreferences.getInstance) ⇒ <code>SharedPreferences</code>
    * _inner_
        * [~SharedPreferences](#window.plugins.module_SharedPreferences..SharedPreferences)
            * [new SharedPreferences([name])](#new_window.plugins.module_SharedPreferences..SharedPreferences_new)
            * [.getBoolean(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getBoolean)
            * [.putBoolean(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putBoolean)
            * [.getNumber(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getNumber)
            * [.putNumber(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putNumber)
            * [.getString(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getString)
            * [.putString(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putString)
            * [.get(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+get)
            * [.put(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+put)
            * [.del(key, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+del)
            * [.has(key, successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+has)
            * [.keys([successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+keys)
            * [.clear([successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+clear)

<a name="window.plugins.module_SharedPreferences.getInstance"></a>

### SharedPreferences.getInstance([name]) ⇒ <code>SharedPreferences</code>
Returns a SharedPreferences instance

**Kind**: static method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the preferences file. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences"></a>

### SharedPreferences~SharedPreferences
**Kind**: inner class of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences)  

* [~SharedPreferences](#window.plugins.module_SharedPreferences..SharedPreferences)
    * [new SharedPreferences([name])](#new_window.plugins.module_SharedPreferences..SharedPreferences_new)
    * [.getBoolean(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getBoolean)
    * [.putBoolean(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putBoolean)
    * [.getNumber(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getNumber)
    * [.putNumber(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putNumber)
    * [.getString(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+getString)
    * [.putString(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+putString)
    * [.get(key, [defaultValue], successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+get)
    * [.put(key, value, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+put)
    * [.del(key, [successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+del)
    * [.has(key, successCallback, [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+has)
    * [.keys([successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+keys)
    * [.clear([successCallback], [errorCallback])](#window.plugins.module_SharedPreferences..SharedPreferences+clear)

<a name="new_window.plugins.module_SharedPreferences..SharedPreferences_new"></a>

#### new SharedPreferences([name])
Creates a `SharedPreferences` instance


| Param | Type | Description |
| --- | --- | --- |
| [name] | <code>String</code> | The name of the preferences file |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+getBoolean"></a>

#### sharedPreferences.getBoolean(key, [defaultValue], successCallback, [errorCallback])
Retrieves a boolean value from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to retrieve. |
| [defaultValue] | <code>Boolean</code> | The value to return if the key doesn't exist. If omitted, `errorCallback` will be invoked if key is missing. |
| successCallback | <code>function</code> | A callback which is called if the key exists. Invoked with `(value)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`. |

**Example**  
```js
// Retrieve the value for a key that doesn't exist. No default value provided.

var key = 'missingKey' // the key doesn't exist
var successCallback = function(value) {
  // it won't be invoked
}
var errorCallback = function(err) {
  expect(err).toBeDefined()
  expect(err instanceof Error).toBe(true)
  expect(err.message).toMatch(/missing key/i)
}

sharedPreferences.getBoolean(key, successCallback, errorCallback)
```
**Example**  
```js
// Retrieve the value for a key that doesn't exist. Default value provided.

var key = 'missingKey' // the key doesn't exist
var defaultValue = false
var successCallback = function(value) {
  expect(value).toBe(defaultValue)
}
var errorCallback = function(err) {
  // it won't be invoked
}

sharedPreferences.getBoolean(key, defaultValue, successCallback, errorCallback)
```
<a name="window.plugins.module_SharedPreferences..SharedPreferences+putBoolean"></a>

#### sharedPreferences.putBoolean(key, value, [successCallback], [errorCallback])
Sets a boolean value in the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to set. |
| value | <code>Boolean</code> | The new value for the preference. |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+getNumber"></a>

#### sharedPreferences.getNumber(key, [defaultValue], successCallback, [errorCallback])
Retrieves a number from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to retrieve. |
| [defaultValue] | <code>Boolean</code> | The value to return if the key doesn't exist. If omitted, `errorCallback` will be invoked if key is missing. |
| successCallback | <code>function</code> | A callback which is called if the key exists. Invoked with `(value)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`. |

**Example**  
```js
// Retrieve the value for a key that doesn't exist. No default value provided.

var key = 'missingKey' // the key doesn't exist
var successCallback = function(value) {
  // it won't be invoked
}
var errorCallback = function(err) {
  expect(err).toBeDefined()
  expect(err instanceof Error).toBe(true)
  expect(err.message).toMatch(/missing key/i)
}

sharedPreferences.getNumber(key, successCallback, errorCallback)
```
**Example**  
```js
// Retrieve the value for a key that doesn't exist. Default value provided.

var key = 'missingKey' // the key doesn't exist
var defaultValue = false
var successCallback = function(value) {
  expect(value).toBe(defaultValue)
}
var errorCallback = function(err) {
  // it won't be invoked
}

sharedPreferences.getNumber(key, defaultValue, successCallback, errorCallback)
```
<a name="window.plugins.module_SharedPreferences..SharedPreferences+putNumber"></a>

#### sharedPreferences.putNumber(key, value, [successCallback], [errorCallback])
Sets a number in the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to set. |
| value | <code>Boolean</code> | The new value for the preference. |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+getString"></a>

#### sharedPreferences.getString(key, [defaultValue], successCallback, [errorCallback])
Retrieves a string value from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to retrieve. |
| [defaultValue] | <code>Boolean</code> | The value to return if the key doesn't exist. If omitted, `errorCallback` will be invoked if key is missing. |
| successCallback | <code>function</code> | A callback which is called if the key exists. Invoked with `(value)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`. |

**Example**  
```js
// Retrieve the value for a key that doesn't exist. No default value provided.

var key = 'missingKey' // the key doesn't exist
var successCallback = function(value) {
  // it won't be invoked
}
var errorCallback = function(err) {
  expect(err).toBeDefined()
  expect(err instanceof Error).toBe(true)
  expect(err.message).toMatch(/missing key/i)
}

sharedPreferences.getString(key, successCallback, errorCallback)
```
**Example**  
```js
// Retrieve the value for a key that doesn't exist. Default value provided.

var key = 'missingKey' // the key doesn't exist
var defaultValue = false
var successCallback = function(value) {
  expect(value).toBe(defaultValue)
}
var errorCallback = function(err) {
  // it won't be invoked
}

sharedPreferences.getString(key, defaultValue, successCallback, errorCallback)
```
<a name="window.plugins.module_SharedPreferences..SharedPreferences+putString"></a>

#### sharedPreferences.putString(key, value, [successCallback], [errorCallback])
Sets a string in the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to set. |
| value | <code>Boolean</code> | The new value for the preference. |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+get"></a>

#### sharedPreferences.get(key, [defaultValue], successCallback, [errorCallback])
Retrieves a value from the preferences using JSON parsing.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to retrieve. |
| [defaultValue] |  | The value to return if the key doesn't exist. If omitted, `errorCallback` will be invoked if key is missing. |
| successCallback | <code>function</code> | A callback which is called if the key exists. Invoked with `(value)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. If `defaultValue` is omitted, it will be invoked if the key is missing. Invoked with `(err)`. |

**Example**  
```js
// Retrieve the value for a key that doesn't exist. No default value provided.

var key = 'missingKey' // the key doesn't exist
var successCallback = function(value) {
  // it won't be invoked
}
var errorCallback = function(err) {
  expect(err).toBeDefined()
  expect(err instanceof Error).toBe(true)
  expect(err.message).toMatch(/missing key/i)
}

sharedPreferences.get(key, successCallback, errorCallback)
```
**Example**  
```js
// Retrieve the value for a key that doesn't exist. Default value provided.

var key = 'missingKey' // the key doesn't exist
var defaultValue = false
var successCallback = function(value) {
  expect(value).toBe(defaultValue)
}
var errorCallback = function(err) {
  // it won't be invoked
}

sharedPreferences.get(key, defaultValue, successCallback, errorCallback)
```
<a name="window.plugins.module_SharedPreferences..SharedPreferences+put"></a>

#### sharedPreferences.put(key, value, [successCallback], [errorCallback])
Sets a value in the preferences using JSON serialization.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to set. |
| value |  | The new value for the preference. |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+del"></a>

#### sharedPreferences.del(key, [successCallback], [errorCallback])
Removes a value from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to remove. |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+has"></a>

#### sharedPreferences.has(key, successCallback, [errorCallback])
Checks whether the preferences contains a preference.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The name of the preference to check. |
| successCallback | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `(result)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+keys"></a>

#### sharedPreferences.keys([successCallback], [errorCallback])
Retrieves all keys from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `(keys)`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |

<a name="window.plugins.module_SharedPreferences..SharedPreferences+clear"></a>

#### sharedPreferences.clear([successCallback], [errorCallback])
Removes all values from the preferences.

**Kind**: instance method of [<code>SharedPreferences</code>](#window.plugins.module_SharedPreferences..SharedPreferences)  

| Param | Type | Description |
| --- | --- | --- |
| [successCallback] | <code>function</code> | A callback which is called if the operation is completed successfully. Invoked with `()`. |
| [errorCallback] | <code>function</code> | A callback which is called if an error occurs. Invoked with `(err)`. |


## License

This project is licensed under the MIT license.

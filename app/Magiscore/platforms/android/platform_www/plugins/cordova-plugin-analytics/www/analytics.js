cordova.define("cordova-plugin-analytics.GAPlugin", function(require, exports, module) {
/*
 analytics.js
 Copyright 2014 AppFeel. All rights reserved.
 http://www.appfeel.com
 
 Google Analytics Cordova Plugin (com.analytics.google)
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var analytics = window.analytics || {};

analytics.DEFAULT_EVENTS = {
  ADD_PAYMENT_INFO: 'add_payment_info',
  ADD_TO_CART: 'add_to_cart',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  APP_OPEN: 'app_open',
  BEGIN_CHECKOUT: 'begin_checkout',
  CAMPAIGN_DETAILS: 'campaign_details',
  CHECKOUT_PROGRESS: 'checkout_progress',
  EARN_VIRTUAL_CURRENCY: 'earn_virtual_currency',
  ECOMMERCE_PURCHASE: 'ecommerce_purchase',
  GENERATE_LEAD: 'generate_lead',
  JOIN_GROUP: 'join_group',
  LEVEL_END: 'level_end',
  LEVEL_START: 'level_start',
  LEVEL_UP: 'level_up',
  LOGIN: 'login',
  POST_SCORE: 'post_score',
  PRESENT_OFFER: 'present_offer',
  PURCHASE_REFUND: 'purchase_refund',
  REMOVE_FROM_CART: 'remove_from_cart',
  SEARCH: 'search',
  SELECT_CONTENT: 'select_content',
  SET_CHECKOUT_OPTION: 'set_checkout_option',
  SHARE: 'share',
  SIGN_UP: 'sign_up',
  SPEND_VIRTUAL_CURRENCY: 'spend_virtual_currency',
  TUTORIAL_BEGIN: 'tutorial_begin',
  TUTORIAL_COMPLETE: 'tutorial_complete',
  UNLOCK_ACHIEVEMENT: 'unlock_achievement',
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  VIEW_SEARCH_RESULTS: 'view_search_results'
}

analytics.DEFAULT_PARAMS = {
  ACHIEVEMENT_ID: 'achievement_id',
  ACLID: 'aclid',
  AFFILIATION: 'affiliation',
  CAMPAIGN: 'campaign',
  CHARACTER: 'character',
  CHECKOUT_OPTION: 'checkout_option',
  CHECKOUT_STEP: 'checkout_step',
  CONTENT: 'content',
  CONTENT_TYPE: 'content_type',
  COUPON: 'coupon',
  CP1: 'cp1',
  CREATIVE_NAME: 'creative_name',
  CREATIVE_SLOT: 'creative_slot',
  CURRENCY: 'currency',
  DESTINATION: 'destination',
  END_DATE: 'end_date',
  FLIGHT_NUMBER: 'flight_number',
  GROUP_ID: 'group_id',
  INDEX: 'index',
  ITEM_BRAND: 'item_brand',
  ITEM_CATEGORY: 'item_category',
  ITEM_ID: 'item_id',
  ITEM_LIST: 'item_list',
  ITEM_LOCATION_ID: 'item_location_id',
  ITEM_NAME: 'item_name',
  ITEM_VARIANT: 'item_variant',
  LEVEL: 'level',
  LEVEL_NAME: 'level_name',
  LOCATION: 'location',
  MEDIUM: 'medium',
  METHOD: 'method',
  NUMBER_OF_NIGHTS: 'number_of_nights',
  NUMBER_OF_PASSENGERS: 'number_of_passengers',
  NUMBER_OF_ROOMS: 'number_of_rooms',
  ORIGIN: 'origin',
  PRICE: 'price',
  QUANTITY: 'quantity',
  SCORE: 'score',
  SEARCH_TERM: 'search_term',
  SHIPPING: 'shipping',
  SOURCE: 'source',
  START_DATE: 'start_date',
  SUCCESS: 'success',
  TAX: 'tax',
  TERM: 'term',
  TRANSACTION_ID: 'transaction_id',
  TRAVEL_CLASS: 'travel_class',
  VALUE: 'value',
  VIRTUAL_CURRENCY_NAME: 'virtual_currency_name'
};

analytics.OPTIONS = {
  EVENT_NAME: 'eventName',
  EVENT_PARAMS: 'eventParams',
  USER_PROPERTY_NAME: 'userPropertyName',
  USER_PROPERTY_VALUE: 'userPropertyValue',
};

/**
 * Track an event
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#logEvent
 *
 * @param {string} eventName The event name
 * @param {object} eventParams The event params
 * @param {function()} successCallback The function to call if the event has tracked successfully
 * @param {function()} failureCallback The function to call if the event has failed to be tracked
 */
analytics.logEvent = function (eventName, eventParams, success, error) {
  if (typeof eventParams === 'function') {
    error = success;
    success = eventParams;
    eventParams = {};
  }
  var options = {};
  options[analytics.OPTIONS.EVENT_NAME] = eventName;
  options[analytics.OPTIONS.EVENT_PARAMS] = eventParams;
  cordova.exec(success, error, 'GAPlugin', 'logEvent', [options]);
};

/**
 * Reset the analytics data
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#resetAnalyticsData
 *
 * @param {function()} successCallback The function to call if the analytics data has restarted successfully
 * @param {function()} failureCallback The function to call if the analytics data has failed to be restarted
 */
analytics.resetAnalyticsData = function (success, error) {
  cordova.exec(success, error, 'GAPlugin', 'resetAnalyticsData', []);
};

/**
 * Set the analytics data collection enabled
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setAnalyticsCollectionEnabled
 *
 * @param {boolean} enabled The value of collection enabled
 * @param {function()} successCallback The function to call if the collection enabled value has setted successfully
 * @param {function()} failureCallback The function to call if the collection enabled value has failed to be setted
 */
analytics.setAnalyticsCollectionEnabled = function (enabled, success, error) {
  cordova.exec(success, error, 'GAPlugin', 'setAnalyticsCollectionEnabled', [enabled]);
};

/**
 * Track the current screen
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setCurrentScreen
 *
 * @param {string} screenName The screen name
 * @param {function()} successCallback The function to call if the screen has setted successfully
 * @param {function()} failureCallback The function to call if the screen has failed to be setted
 */
analytics.setCurrentScreen = function (screenName, success, error) {
  cordova.exec(success, error, 'GAPlugin', 'setCurrentScreen', [screenName]);
};

/**
 * Set minimum session duration duration
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setMinimumSessionDuration
 *
 * @param {number} milliseconds The timeout in milliseconds
 * @param {function()} successCallback The function to call if the timeout has setted successfully
 * @param {function()} failureCallback The function to call if the timeout has failed to be setted
 */
analytics.setMinimumSessionDuration = function (milliseconds, success, error) {
  cordova.exec(success, error, 'GAPlugin', 'setMinimumSessionDuration', [milliseconds]);
}

/**
 * Set session timeout duration
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setSessionTimeoutDuration
 *
 * @param {number} milliseconds The timeout in milliseconds
 * @param {function()} successCallback The function to call if the timeout has setted successfully
 * @param {function()} failureCallback The function to call if the timeout has failed to be setted
 */
analytics.setSessionTimeoutDuration = function (milliseconds, success, error) {
  cordova.exec(success, error, 'GAPlugin', 'setSessionTimeoutDuration', [milliseconds]);
}

/**
 * Sets the user ID property
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setUserId
 *
 * @param {string} userId The user id
 * @param {function()} successCallback The function to call if the user id has setted successfully
 * @param {function()} failureCallback The function to call if the user id has failed to be setted
 */
analytics.setUserId = function (userId, success, error) {
  cordova.exec(success, error, 'GAPlugin', 'setUserId', [userId]);
};

/**
 * Sets the user ID property
 * Reference: https://firebase.google.com/docs/reference/android/com/google/firebase/analytics/FirebaseAnalytics.html#setUserProperty
 *
 * @param {string} userPropertyName The user property name
 * @param {string} userPropertyValue The user property value
 * @param {function()} successCallback The function to call if the user property has setted successfully
 * @param {function()} failureCallback The function to call if the user property has failed to be setted
 */
analytics.setUserProperty = function (userPropertyName, userPropertyValue, success, error) {
  var options = {};
  options[analytics.OPTIONS.USER_PROPERTY_NAME] = userPropertyName;
  options[analytics.OPTIONS.USER_PROPERTY_VALUE] = userPropertyValue;
  cordova.exec(success, error, 'GAPlugin', 'setUserProperty', [options]);
};

if (typeof module !== 'undefined') {
  // Export analytics
  module.exports = analytics;
}

window.analytics = analytics;

});

exports.defineAutoTests = function() {
    var sharedPreferences = window.plugins.SharedPreferences.getInstance()

    var now = Date.now()
    var booleanKey = 'boolean@' + now
    var booleanValue = true
    var numberKey = 'number@' + now
    var numberValue = 1
    var stringKey = 'string@' + now
    var stringValue = 'value'
    var objectKey = 'object@' + now
    var objectValue = {
        key: 'value',
    }

    describe('getBoolean', function() {
        beforeAll(function(done) {
            sharedPreferences.putBoolean(booleanKey, booleanValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(booleanKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getBoolean(key, successCallback, errorCallback)
        })

        it('should fail when default value is not a boolean', function(done) {
            var key = 'any'
            var defaultValue = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getBoolean(key, defaultValue, successCallback, errorCallback)
        })

        it('should throw when success callback is missing', function() {
            var key = 'any'

            expect(function() {
                sharedPreferences.getBoolean(key)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getBoolean(key, defaultValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getBoolean(key, defaultValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should fallback to default value when key is missing', function(done) {
            var key = 'missing'
            var defaultValue = true

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toBe(defaultValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getBoolean(key, defaultValue, successCallback, errorCallback)
        })

        it('should fail when no default value and key is missing', function(done) {
            var key = 'missing'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof Error).toBe(true)
                    expect(err.message).toMatch(/missing key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getBoolean(key, successCallback, errorCallback)
        })

        it('should retrieve a value', function(done) {
            var key = booleanKey
            var expectedValue = booleanValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toEqual(expectedValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getBoolean(key, successCallback, errorCallback)
        })
    })

    describe('putBoolean', function() {
        afterAll(function(done) {
            sharedPreferences.del(booleanKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1
            var expectedValue = true

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.putBoolean(key, expectedValue, successCallback, errorCallback)
        })

        it('should fail when value is not a boolean', function(done) {
            var key = 'any'
            var expectedValue = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getBoolean(key, expectedValue, successCallback, errorCallback)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getBoolean(key, expectedValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getBoolean(key, expectedValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should put', function(done) {
            var key = booleanKey
            var expectedValue = booleanValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function() {
                    sharedPreferences.getBoolean(
                        key,
                        function(value) {
                            expect(value).toBe(expectedValue)
                            teardown()
                        },
                        teardown
                    )
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.putBoolean(key, expectedValue, successCallback, errorCallback)
        })
    })

    describe('getString', function() {
        beforeAll(function(done) {
            sharedPreferences.putString(stringKey, stringValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(stringKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getString(key, successCallback, errorCallback)
        })

        it('should fail when default value is not a string', function(done) {
            var key = 'any'
            var defaultValue = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getString(key, defaultValue, successCallback, errorCallback)
        })

        it('should throw when success callback is missing', function() {
            var key = 'any'

            expect(function() {
                sharedPreferences.getString(key)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getString(key, defaultValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getString(key, defaultValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should fallback to default value when key is missing', function(done) {
            var key = 'missing'
            var defaultValue = 'value'

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toBe(defaultValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getString(key, defaultValue, successCallback, errorCallback)
        })

        it('should fail when no default value and key is missing', function(done) {
            var key = 'missing'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof Error).toBe(true)
                    expect(err.message).toMatch(/missing key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getString(key, successCallback, errorCallback)
        })

        it('should retrieve a value', function(done) {
            var key = stringKey
            var expectedValue = stringValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toEqual(expectedValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getString(key, successCallback, errorCallback)
        })
    })

    describe('putString', function() {
        afterAll(function(done) {
            sharedPreferences.del(stringKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1
            var expectedValue = true

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.putString(key, expectedValue, successCallback, errorCallback)
        })

        it('should fail when value is not a string', function(done) {
            var key = 'any'
            var expectedValue = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getString(key, expectedValue, successCallback, errorCallback)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getString(key, expectedValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getString(key, expectedValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should put', function(done) {
            var key = stringKey
            var expectedValue = stringValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function() {
                    sharedPreferences.getString(
                        key,
                        function(value) {
                            expect(value).toBe(expectedValue)
                            teardown()
                        },
                        teardown
                    )
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.putString(key, expectedValue, successCallback, errorCallback)
        })
    })

    describe('getNumber', function() {
        beforeAll(function(done) {
            sharedPreferences.putNumber(numberKey, numberValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(numberKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getNumber(key, successCallback, errorCallback)
        })

        it('should fail when default value is not a number', function(done) {
            var key = 'any'
            var defaultValue = true

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getNumber(key, defaultValue, successCallback, errorCallback)
        })

        it('should throw when success callback is missing', function() {
            var key = 'any'

            expect(function() {
                sharedPreferences.getNumber(key)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getNumber(key, defaultValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getNumber(key, defaultValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should fallback to default value when key is missing', function(done) {
            var key = 'missing'
            var defaultValue = -1

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toBe(defaultValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getNumber(key, defaultValue, successCallback, errorCallback)
        })

        it('should fail when no default value and key is missing', function(done) {
            var key = 'missing'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof Error).toBe(true)
                    expect(err.message).toMatch(/missing key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getNumber(key, successCallback, errorCallback)
        })

        it('should retrieve a value', function(done) {
            var key = numberKey
            var expectedValue = numberValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toEqual(expectedValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.getNumber(key, successCallback, errorCallback)
        })
    })

    describe('putNumber', function() {
        afterAll(function(done) {
            sharedPreferences.del(numberKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1
            var expectedValue = true

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.putNumber(key, expectedValue, successCallback, errorCallback)
        })

        it('should fail when value is not a number', function(done) {
            var key = 'any'
            var expectedValue = '1'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/defaultValue/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.getNumber(key, expectedValue, successCallback, errorCallback)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.getNumber(key, expectedValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.getNumber(key, expectedValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should put', function(done) {
            var key = numberKey
            var expectedValue = numberValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function() {
                    sharedPreferences.getNumber(
                        key,
                        function(value) {
                            expect(value).toBe(expectedValue)
                            teardown()
                        },
                        teardown
                    )
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.putNumber(key, expectedValue, successCallback, errorCallback)
        })
    })

    describe('get', function() {
        beforeAll(function(done) {
            sharedPreferences.put(objectKey, objectValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(objectKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.get(key, successCallback, errorCallback)
        })

        it('should throw when success callback is missing', function() {
            var key = 'any'

            expect(function() {
                sharedPreferences.get(key)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.get(key, defaultValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var defaultValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.get(key, defaultValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should fallback to default value when key is missing', function(done) {
            var key = 'missing'
            var defaultValue = 'can be any type'

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toBe(defaultValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.get(key, defaultValue, successCallback, errorCallback)
        })

        it('should fail when no default value and key is missing', function(done) {
            var key = 'missing'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof Error).toBe(true)
                    expect(err.message).toMatch(/missing key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.get(key, successCallback, errorCallback)
        })

        it('should retrieve a value', function(done) {
            var key = objectKey
            var expectedValue = objectValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(value) {
                    expect(value).toEqual(expectedValue)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.get(key, successCallback, errorCallback)
        })
    })

    describe('put', function() {
        afterAll(function(done) {
            sharedPreferences.del(objectKey, done)
        })

        it('should fail when key is not a string', function(done) {
            var key = 1
            var expectedValue = 'can be any type'

            var teardown = function() {
                expect(successCallback).not.toHaveBeenCalled()
                expect(errorCallback).toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine.createSpy('successCallback', teardown).and.callThrough()
            var errorCallback = jasmine
                .createSpy('errorCallback', function(err) {
                    expect(err).toBeDefined()
                    expect(err instanceof TypeError)
                    expect(err.message).toMatch(/key/i)
                    teardown()
                })
                .and.callThrough()

            sharedPreferences.put(key, expectedValue, successCallback, errorCallback)
        })

        it('should throw when success callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = 1
            expect(function() {
                sharedPreferences.get(key, expectedValue, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw when error callback is invalid', function() {
            var key = 'any'
            var expectedValue = true
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.get(key, expectedValue, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should put', function(done) {
            var key = objectKey
            var expectedValue = objectValue

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function() {
                    sharedPreferences.get(
                        key,
                        function(value) {
                            expect(value).toEqual(expectedValue)
                            teardown()
                        },
                        teardown
                    )
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.put(key, expectedValue, successCallback, errorCallback)
        })
    })

    describe('has', function() {
        beforeAll(function(done) {
            sharedPreferences.put(objectKey, objectValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(objectKey, done)
        })

        it('should throw if success callback is missing', function() {
            var key = 'any'
            expect(function() {
                sharedPreferences.has(key)
            }).toThrowError(/successCallback/i)
        })

        it('should throw if success callback is invalid', function() {
            var key = 'any'
            var successCallback = 1
            expect(function() {
                sharedPreferences.has(key, successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw if error callback is invalid', function() {
            var key = 'any'
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.has(key, successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it("should return false when key doesn't exist", function(done) {
            var key = 'missing'

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(result) {
                    expect(result).toBe(false)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.has(key, successCallback, errorCallback)
        })

        it('should return true when key exists', function(done) {
            var key = objectKey

            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(result) {
                    expect(result).toBe(true)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.has(key, successCallback, errorCallback)
        })
    })

    describe('keys', function() {
        beforeAll(function(done) {
            sharedPreferences.put(objectKey, objectValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(objectKey, done)
        })

        it('should throw if success callback is missing', function() {
            expect(function() {
                sharedPreferences.keys()
            }).toThrowError(/successCallback/i)
        })

        it('should throw if success callback is invalid', function() {
            var successCallback = 1
            expect(function() {
                sharedPreferences.keys(successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw if error callback is invalid', function() {
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.keys(successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should return an array', function(done) {
            var teardown = function() {
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function(keys) {
                    expect(/^\[object Array\]$/.test(Object.prototype.toString(keys)))
                    expect(keys.length).toBeGreaterThan(0)
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.keys(successCallback, errorCallback)
        })
    })

    describe('clear', function() {
        beforeAll(function(done) {
            sharedPreferences.put(objectKey, objectValue, done)
        })

        afterAll(function(done) {
            sharedPreferences.del(objectKey, done)
        })

        it('should throw if success callback is missing', function() {
            expect(function() {
                sharedPreferences.clear()
            }).toThrowError(/successCallback/i)
        })

        it('should throw if success callback is invalid', function() {
            var successCallback = 1
            expect(function() {
                sharedPreferences.clear(successCallback)
            }).toThrowError(/successCallback/i)
        })

        it('should throw if error callback is invalid', function() {
            var successCallback = function() {}
            var errorCallback = 1
            expect(function() {
                sharedPreferences.clear(successCallback, errorCallback)
            }).toThrowError(/errorCallback/i)
        })

        it('should remove all preferences', function(done) {
            var teardown = function(err) {
                expect(err).not.toBeDefined()
                expect(successCallback).toHaveBeenCalled()
                expect(errorCallback).not.toHaveBeenCalled()
                done()
            }
            var successCallback = jasmine
                .createSpy('successCallback', function() {
                    // The preference set on iOS always contains preferences that are not deletable
                    // Thus, we skip checking against preference set to be empty
                    if (/android/i.test(window.device.platform)) {
                        sharedPreferences.keys(function(result) {
                            expect(result).toEqual([])
                            teardown()
                        }, teardown)
                        return
                    }
                    teardown()
                })
                .and.callThrough()
            var errorCallback = jasmine.createSpy('errorCallback', teardown).and.callThrough()

            sharedPreferences.clear(successCallback, errorCallback)
        })
    })

    it('should manage multiple preference sets', function(done) {
        var SharedPreferences = window.plugins.SharedPreferences
        var sharedPreferences1 = SharedPreferences.getInstance('1')
        var sharedPreferences2 = SharedPreferences.getInstance('2')

        var key = 'anotherBooleanKey' + Date.now()
        var value = true

        sharedPreferences1.putBoolean(key, value, function() {
            sharedPreferences2.getBoolean(key, false, function(value) {
                expect(value).toBe(false)
                done()
            })
        })
    })
}

/*
  Copyright 2016 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// This is a test and we want descriptions to be useful, if this
// breaks the max-length, it's ok.

/* eslint-disable max-len, no-unused-expressions */
/* eslint-env browser, mocha */

'use strict';

describe('Test PushClient Constructor', function() {
  if (!window.isPropelClientSupported) {
    return;
  }

  const EMPTY_SW_PATH = '/test/browser-tests/push-client/empty-sw.js';
  const ERROR_MESSAGES = {
    'bad factory': 'The PushClient.createClient() method expects a service ' +
      'worker path and an option scope string.',
    'bad constructor': 'The PushClient constructor expects a service ' +
      'worker registration. Alternatively, you can use ' +
      'PropelClient.createClient() to create a PropelClient with a service ' +
      'worker path string and an optional scope string.',
    'redundant worker': 'Worker became redundant'
  };

  const getUrlAndScope = function(client) {
    return client.getRegistration().then(reg => {
      const sw = reg.installing || reg.waiting || reg.active;
      return {url: sw.scriptURL, scope: reg.scope};
    });
  };

  it('should throw an error for no constructor arguments', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient();
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw an error for Object in the constructor', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient({});
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw an error for Array in the constructor', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient([]);
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw an error for null in the constructor', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient(null);
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw an error for an empty string in the constructor', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient('');
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw when testing the factory method API on the constructor, path', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient('/sw.js');
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should throw when testing the factory method API on the constructor, path + scope', function() {
    window.chai.expect(() => {
      /* eslint no-unused-vars: 0 */
      var client = new window.goog.propel.PropelClient('/sw.js', null);
    }).to.throw(ERROR_MESSAGES['bad constructor']);
  });

  it('should be able to create a new push client with a service worker registration', function(done) {
    navigator.serviceWorker.register(EMPTY_SW_PATH)
    .then(registration => {
      const pushClient = new window.goog.propel.PropelClient(registration);

      return getUrlAndScope(pushClient).then(result => {
        window.chai.expect(result.url).to.contain(EMPTY_SW_PATH);
        window.chai.expect(result.scope).to.contain('/test/browser-tests/push-client');

        done();
      }).catch(done);
    })
    .catch(done);
  });
});

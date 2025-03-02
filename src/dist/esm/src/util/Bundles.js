import config from '../config/config.json.js';
import fetch from 'cross-fetch';
import country from '../../packages/@okta/i18n/src/json/country.json.js';
import login from '../../packages/@okta/i18n/src/json/login.json.js';
import Q from 'q';
import '../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/handle-url.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-base64.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-i18n.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-img.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-markdown.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-xsrfTokenInput.js';
import '../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import oktaUnderscore from '../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import fn from './BrowserFeatures.js';
import Logger from './Logger.js';

/*!
 * Copyright (c) 2015-2016, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
const STORAGE_KEY = 'osw.languages';
/**
 * Converts options to our internal format, which distinguishes between
 * login and country bundles.
 *
 * Example options.i18n passed in by the developer:
 * {
 *   'en': {
 *     'needhelp': 'need help override',
 *     'primaryauth.title': 'new sign in text',
 *     'country.JP' = 'Japan, Japan'
 *   }
 * }
 *
 * Parsed:
 * {
 *  'en': {
 *    'login': {
 *      'needhelp': 'need help override',
 *      'primaryauth.title': 'new sign in text',
 *    },
 *    'country': {
 *      'JP': 'Japan, Japan'
 *    }
 *  }
 * }
 */
function parseOverrides(i18n) {
  if (!i18n) {
    return {};
  }
  const i18nWithLowerCaseKeys = {};
  oktaUnderscore.each(oktaUnderscore.keys(i18n), function (key) {
    i18nWithLowerCaseKeys[key.toLowerCase()] = i18n[key];
  });
  return oktaUnderscore.mapObject(i18nWithLowerCaseKeys, function (props) {
    const mapped = {
      login: {},
      country: {}
    };
    if (!oktaUnderscore.isObject(props)) {
      throw new Error('Invalid format for "i18n"');
    }
    oktaUnderscore.each(props, function (val, key) {
      const split = key.split(/^country\./);
      if (split.length > 1) {
        mapped.country[split[1]] = val;
      } else {
        mapped.login[split[0]] = val;
      }
    });
    return mapped;
  });
}

// Caching: We only bundle English by default in the Sign-In Widget. Other
// languages are loaded on demand and cached in localStorage. These languages
// are tied to the version of the widget - when it bumps, we reset the cache.

function getCachedLanguages() {
  let storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!storage || storage.version !== config.version) {
    storage = {
      version: config.version
    };
  }
  return storage;
}
function addLanguageToCache(language, loginJson, countryJson) {
  const current = getCachedLanguages();
  current[language] = {
    login: loginJson,
    country: countryJson
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

// By default, the assets.bundleUrl is tied to the Okta CDN.
//
// There are two overrides available for modifying where we load the asset
// bundles from:
//
// 1. assets.baseUrl
//
//    This is the base path the OSW pulls assets from, which in this case is
//    the Okta CDN. Override this config option if you want to host the
//    files on your own domain, or if you're using a new version of the
//    widget whose language files haven't been published to the CDN yet.
//
// 2. assets.rewrite
//
//    This is a function that can be used to modify the path + fileName of
//    the bundle we're loading, relative to the baseUrl. When called, it
//    will pass the current path, and expect the new path to be returned.
//    This is useful, for example, if your build process has an extra
//    cachebusting step, i.e:
//
//    function rewrite(file) {
//      // file: /labels/json/login_ja.json
//      return file.replace('.json', '.' + md5file(file) + '.json');
//    }
//
// Note: Most developers will not need to use these overrides - the default
// is to use the Okta CDN and to use the same path + file structure the
// widget module publishes by default.
function fetchJson(bundle, language, assets) {
  // Our bundles use _ to separate country and region, i.e:
  // zh-CN -> zh_CN
  const languageCode = language.replace('-', '_');
  const path = assets.rewrite(encodeURI(`/labels/json/${bundle}_${languageCode}.json`));
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'text/plain'
  };
  const mode = 'no-cors';
  return fetch(assets.baseUrl + path, {
    method: 'GET',
    headers: headers,
    mode: mode
  }).then(res => res.text()).then(txt => JSON.parse(txt));
}
function getBundles(language, assets, supportedLanguages) {
  // Two special cases:
  // 1. Default language is already bundled with the widget
  // 2. If the language is not in our config file, it means that they've
  //    probably defined it on their own.
  if (language === config.defaultLanguage || !oktaUnderscore.contains(supportedLanguages, language)) {
    return Q({});
  }

  //local storage does not work correctly with android web views (embeded browers)
  //so skip the caching and just make the request to get the local info
  const localStorageIsSupported = !fn.localStorageIsNotSupported();
  if (localStorageIsSupported) {
    const cached = getCachedLanguages();
    if (cached[language]) {
      return Q(cached[language]);
    }
  }
  return Q.all([fetchJson('login', language, assets), fetchJson('country', language, assets)]).spread(function (loginJson, countryJson) {
    if (localStorageIsSupported) {
      addLanguageToCache(language, loginJson, countryJson);
    }
    return {
      login: loginJson,
      country: countryJson
    };
  }).catch(function () {
    // If there is an error, this will default to the bundled language and
    // we will no longer try to load the language this session.
    Logger.warn('Unable to load language: ' + language);
    return {};
  });
}
var Bundles = {
  login: login,
  country: country,
  // Courage components within the sign in widget point to courage bundle to look
  // up i18nkeys. Since we dont have courage.properties inside the sign in widget
  // we are pointing courage bundle to login.
  courage: login,
  currentLanguage: null,
  isLoaded: function (language) {
    return this.currentLanguage === language;
  },
  remove: function () {
    this.currentLanguage = null;
  },
  loadLanguage: function (language, overrides, assets, supportedLanguages) {
    const parsedOverrides = parseOverrides(overrides);
    const lowerCaseLanguage = language.toLowerCase();
    return getBundles(language, assets, supportedLanguages).then(bundles => {
      // Always extend from the built in defaults in the event that some
      // properties are not translated
      this.login = oktaUnderscore.extend({}, login, bundles.login);
      this.country = oktaUnderscore.extend({}, country, bundles.country);
      this.courage = oktaUnderscore.extend({}, login, bundles.login);
      if (parsedOverrides[lowerCaseLanguage]) {
        oktaUnderscore.extend(this.login, parsedOverrides[lowerCaseLanguage]['login']);
        oktaUnderscore.extend(this.country, parsedOverrides[lowerCaseLanguage]['country']);
        oktaUnderscore.extend(this.courage, parsedOverrides[lowerCaseLanguage]['login']);
      }
      this.currentLanguage = language;
    });
  }
};

export { Bundles as default };
//# sourceMappingURL=Bundles.js.map

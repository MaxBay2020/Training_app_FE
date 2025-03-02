import { loc } from '../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
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
import Bundles from './Bundles.js';
import countryCallingCodes from './countryCallingCodes.js';

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
const fn = {};

// () => [{ countryCode: countryName }], sorted by countryName
fn.getCountries = function () {
  const countries = oktaUnderscore.omit(Bundles.country, 'HM', 'BV', 'TF');
  // HM, BV, and TF do not have phone prefixes, so don't give the
  // user the option to choose these countries. FYI it appears that these
  // countries do not have calling codes because they are ~~uninhabited~~

  let collection = oktaUnderscore.map(countries, function (name, code) {
    return {
      name: name,
      code: code
    };
  });

  // Sort it; figure out if there is a better way to do this (best would
  // be to sort it in the properties file!!)

  collection = oktaUnderscore.sortBy(collection, 'name');
  const sorted = {};
  oktaUnderscore.each(collection, function (country) {
    sorted[country.code] = country.name;
  });
  return sorted;
};
fn.getCountryCode = function () {
  const countries = oktaUnderscore.omit(Bundles.country, 'HM', 'BV', 'TF');
  // HM, BV, and TF do not have phone prefixes, so don't give the
  // user the option to choose these countries. FYI it appears that these
  // countries do not have calling codes because they are ~~uninhabited~~

  let collection = oktaUnderscore.map(countries, function (name, code) {
    return {
      name: name,
      code: code
    };
  });
  collection = oktaUnderscore.sortBy(collection, 'name');
  const sorted = {};
  oktaUnderscore.each(collection, function (country) {
    sorted[country.code] = loc('country.option.label', 'login', [country.name, country.code]);
  });
  return sorted;
};
fn.getCallingCodeForCountry = function (countryCode) {
  return countryCallingCodes[countryCode];
};

export { fn as default };
//# sourceMappingURL=CountryUtil.js.map

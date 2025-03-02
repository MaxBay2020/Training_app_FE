import { loc } from '../../../packages/@okta/courage-dist/esm/src/CourageForSigninWidget.js';
import '../../../packages/@okta/courage-dist/esm/lib/handlebars/dist/cjs/handlebars.runtime.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/handle-url.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-base64.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-i18n.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-img.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-markdown.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/handlebars/helper-xsrfTokenInput.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/vendor/lib/backbone.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/jquery-wrapper.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/util/underscore-wrapper.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/Model.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/models/BaseModel.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/framework/View.js';
import '../../../packages/@okta/courage-dist/esm/src/courage/views/Backbone.ListView.js';
import PrimaryAuthModel from './PrimaryAuth.js';
import fn from '../../util/CookieUtil.js';
import Enums from '../../util/Enums.js';
import Util from '../../util/Util.js';

/*!
 * Copyright (c) 2015-2017, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */
var IDPDiscoveryModel = PrimaryAuthModel.extend({
  props: function () {
    const cookieUsername = fn.getCookieUsername();
    const properties = this.getUsernameAndRemember(cookieUsername);
    return {
      username: ['string', true, properties.username],
      lastUsername: ['string', false, cookieUsername],
      context: ['object', false],
      remember: ['boolean', true, properties.remember]
    };
  },
  local: {},
  save: function () {
    const username = this.settings.transformUsername(this.get('username'), Enums.IDP_DISCOVERY);
    const remember = this.get('remember');
    const lastUsername = this.get('lastUsername');
    const resource = 'okta:acct:' + username;
    const requestContext = this.get('requestContext');
    this.setUsernameCookie(username, remember, lastUsername);

    //the 'save' event here is triggered and used in the BaseLoginController
    //to disable the primary button
    this.trigger('save');
    this.appState.trigger('loading', true);
    const webfingerArgs = {
      resource: resource,
      requestContext: requestContext
    };
    const authClient = this.appState.settings.getAuthClient();
    authClient.webfinger(webfingerArgs).then(res => {
      if (res && res.links && res.links[0]) {
        if (res.links[0].properties['okta:idp:type'] === 'OKTA') {
          this.trigger('goToPrimaryAuth');
        } else if (res.links[0].href) {
          const redirectFn = res.links[0].href.includes('OKTA_INVALID_SESSION_REPOST%3Dtrue') ? Util.redirectWithFormGet.bind(Util) : this.settings.get('redirectUtilFn');
          //override redirectFn to only use Util.redirectWithFormGet if OKTA_INVALID_SESSION_REPOST is included
          //it will be encoded since it will be included in the encoded fromURI

          redirectFn(res.links[0].href);
        }
      }
    }).catch(() => {
      // webfinger request might fail when corporate proxy checks if request is 'authenticated' using cookies
      const error = {
        errorSummary: loc('oform.error.webfinger', 'login')
      };
      this.trigger('error', this, {
        responseJSON: error
      });
      // Specific event handled by the Header for the case where the security image is not
      // enabled and we want to show a spinner. (Triggered only here and handled only by Header).
      this.appState.trigger('removeLoading');
      fn.removeUsernameCookie();
    }).finally(() => {
      this.appState.trigger('loading', false);
    });
  }
});

export { IDPDiscoveryModel as default };
//# sourceMappingURL=IDPDiscovery.js.map

// jscs:disable
/**
 * Render login form functionality
 *
 * @module client-login
 *
 */
// jscs:enable

var formPlaceholders = {
    email: function() {
        return __('login-form-email-placeholder');
    },
    password: function() {
        return __('login-form-password-placeholder');
    }
};

// Success callback when using loginStyle: redirect
Accounts.onLogin(function() {
    if (Router) Router.go('discover');
});

// Failure callback when using loginStyle: redirect
Accounts.onLoginFailure(function() {
    if (Router) Router.go('discover');
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.Login.helpers({
    formSchema: Partup.schemas.forms.login,
    placeholders: formPlaceholders
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.Login.events({
    'click [data-createaccount]': function(event) {
        event.preventDefault();
        Intent.go({route: 'register'}, function() {
            if (Meteor.user()) {
                continueLogin();
            } else {
                this.back();
            }
        }, {prevent_going_back: true});
    },
    'click [data-loginfacebook]': function(event) {
        event.preventDefault();

        Meteor.loginWithFacebook({
            requestPermissions: ['email'],
            loginStyle: navigator.userAgent.match('CriOS') ? 'redirect' : 'popup'
        }, function(error) {
            if (error) {
                Partup.client.notify.error(__('login-error_' + Partup.client.strings.slugify(error.reason)));
                return;
            }

            continueLogin();
        });
    },
    'click [data-loginlinkedin]': function(event) {
        event.preventDefault();

        Meteor.loginWithLinkedin({
            requestPermissions: ['r_emailaddress'],
            loginStyle: navigator.userAgent.match('CriOS') ? 'redirect' : 'popup'
        }, function(error) {
            if (error) {
                Partup.client.notify.error(__('login-error_' + Partup.client.strings.slugify(error.reason)));
                return false;
            }

            continueLogin();
        });
    }
});

/*************************************************************/
/* Widget functions */
/*************************************************************/
var continueLogin = function() {
    var user = Meteor.user();
    if (!user) return;

    var partupId = Session.get('partup_access_token_for_partup');
    var partupAccessToken = Session.get('partup_access_token');
    if (partupId && partupAccessToken) {
        Meteor.call('partups.convert_access_token_to_invite', partupId, partupAccessToken);
    }

    var networkSlug = Session.get('network_access_token_for_network');
    var networkAccessToken = Session.get('network_access_token');
    if (networkSlug && networkAccessToken) {
        Meteor.call('networks.convert_access_token_to_invite', networkSlug, networkAccessToken);
    }

    // Return if intent callback is present
    Intent.return('login', {
        arguments: [user],
        fallback_action: function() {
            if (mout.object.get(user, 'profile.settings.optionalDetailsCompleted')) {
                this.back();
            } else {
                Intent.go({route: 'register-details'});
            }
        }
    });
};

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    loginForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;

            Meteor.loginWithPassword(insertDoc.email, insertDoc.password, function(error) {

                // Error cases
                if (error && error.message) {
                    switch (error.message) {
                        case 'User not found [403]':
                            Partup.client.forms.addStickyFieldError(self, 'email', 'emailNotFound');
                            break;
                        case 'Incorrect password [403]':
                            Partup.client.forms.addStickyFieldError(self, 'password', 'passwordIncorrect');
                            break;
                        default:
                            Partup.client.notify.error(__('login-error_' + Partup.client.strings.slugify(error.reason)));
                    }
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return false;
                }

                // Success
                self.done();
                continueLogin();
            });

            return false;
        }
    }
});

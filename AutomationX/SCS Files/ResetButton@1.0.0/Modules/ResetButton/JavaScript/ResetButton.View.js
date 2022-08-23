
/**
 * @type CORE
 * @module ResetButton.View
 * @desc require standard Profile.UpdatePassword.View
 */
define(
    'ResetButton.View',
    [
        'Profile.UpdatePassword.View',
        'underscore',
        'Utils',
        'jQuery'
    ],
    function(
        ProfileUpdatePasswordView,
        _,
        Utils,
        jQuery

    ) {
        'use strict';

        _.extend(ProfileUpdatePasswordView.prototype, {

            resetForm: _.wrap(ProfileUpdatePasswordView.prototype.resetForm, function (fn) {



                var ret = fn.apply(this, _.toArray(arguments).slice(1));

                jQuery('#current_password').val("");
                jQuery('#password').val("");
                jQuery('#confirm_password').val("");

                return ret;

            })
        });
    });

// Model.js
// -----------------------
// @module Case
define("Tavano.ResetButton.ResetButton.SS2Model", ["Backbone", "Utils"], function(
    Backbone,
    Utils
) {
    "use strict";

    // @class Case.Fields.Model @extends Backbone.Model
    return Backbone.Model.extend({
        //@property {String} urlRoot
        urlRoot: Utils.getAbsoluteUrl(
            getExtensionAssetsPath(
                "Modules/ResetButton/SuiteScript2/ResetButton.Service.ss"
            ),
            true
        )
});
});

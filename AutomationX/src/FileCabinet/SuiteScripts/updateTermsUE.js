/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */

define (['N/runtime'],

    function(runtime) {
        
        /* Public */
        function beforeSubmit(context) {
            log.debug('UPDATE TERMS', '--- BEGIN ---');
            log.debug('TERMS', 'beforeSubmit() @runtime.executionContext: ' + runtime.executionContext);

            if (runtime.executionContext == runtime.ContextType.WEBSTORE) {

                context.newRecord.setValue({
                    fieldId: 'terms',
                    value: ''
                });

            }

            log.debug('UPDATE TERMS', '--- END ---');
        }

        return {
            beforeSubmit: beforeSubmit
        }
    }
);
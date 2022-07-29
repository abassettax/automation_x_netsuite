/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(
    [
        'N/render',
        'N/error'
    ],
    /**
     * @param {N_render} nsRender
     * @param {N_error} nsError
     */
    function (
        nsRender,
        nsError
    ) {
        /**
        * @param {ScheduledScriptContext.execute} context
        */
        function execute(context) {

            var i;
            var pdfFile;
            var salesOrders = [
                '3991329',
                '3913812',
                '3930963',
                '3932493',
                '3932491'
            ];

            for (i = 0; i < salesOrders.length; i += 1) {

                try {

                    pdfFile = nsRender.transaction({
                        entityId: +salesOrders[i],
                        printMode: nsRender.PrintMode.PDF,
                        inCustLocale: true
                    });

                    log.debug('pdf file generated', pdfFile);

                } catch (ex) {

                    log.error({
                        title: 'Error generating pdf file' + salesOrders[i],
                        details: { name: ex.name, message: ex.message, stack: ex.stack }
                    });
                }
            }
        }


        return {
            execute: execute
        };
    });

<div class="product-line-sku-container">
	<span class="product-line-sku-label">
		{{translate 'AX 5 code:'}}
	</span>
	<span class="product-line-sku-value" itemprop="sku">
		{{#if model.item.custitem35}}
			{{{model.item.custitem35}}}
		{{else}}
			{{custitem35}}
		{{/if}}
	</span>
	<div data-type="alert-placeholder">
		{{#if noLongerAvailable}}
			<div data-view="GlobalMessageNoLongerAvailable"></div>
		{{/if}}
	</div>
</div>



{{!----
Use the following context variables when customizing this template: 
	
	model (Object)
	model.item (Object)
	model.item.internalid (Number)
	model.item.type (String)
	model.quantity (Number)
	model.internalid (String)
	model.options (Array)
	model.shipaddress (undefined)
	model.shipmethod (undefined)
	model.location (String)
	model.fulfillmentChoice (String)
	sku (String)

----}}

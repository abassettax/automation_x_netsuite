<input class="custom-search-input" 
data-type="search-input"
placeholder="{{placeholderLabel}}"
type="search"
autocomplete="off"
{{#if showId}} id="{{id}}" {{/if}} {{#if showName}} name="{{name}}" {{/if}}
maxlength="{{maxLength}}"/>




{{!----
Use the following context variables when customizing this template: 
	
	placeholderLabel (String) placeholder{{placeholderLabel}}
	maxLength (Number)
	showId (Boolean)
	showName (Boolean)
	id (String)
	name (String)

----}}

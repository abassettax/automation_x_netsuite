{{#if ttStickyHeader.isEnabled}}
{{!--<!-- Scroll Header -->--}}
<div class="tt-ext-sticky-header">
	<div class="tt-ext-sticky-header-container">

		{{!--<!-- Logo -->--}}
		<div class="tt-ext-sticky-header-logo" data-view="Header.Logo" {{{ttStickyHeader.logoWidth}}}></div>
		
		{{#unless isStandalone}}
		<div class="tt-ext-sticky-header-icons">
			
			{{!--<!-- Search - Icon -->--}}
			<div class="tt-ext-sticky-header-search {{ttStickyHeader.searchClass}}">
				<button class="tt-ext-sticky-header-search-link" data-action="show-sitesearch" title="{{translate 'Search'}}">
					<i class="tt-ext-sticky-header-search-icon"></i>
				</button>
			</div>

			{{!--<!-- Cart -->--}}
			<div class="tt-ext-sticky-header-cart {{ttStickyHeader.cartClass}}" data-view="Header.MiniCart"></div>

		</div>
		{{/unless}}

		{{!--<!-- Main Menu -->--}}
		<div class="tt-ext-sticky-header-menu {{ttStickyHeader.navClasses}}" data-view="Header.Menu"></div>

	</div>
</div>
{{/if}}
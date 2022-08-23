<nav class="header-menu-secondary-nav tt-ext-header-menu-thumbnail">

	{{!--<!-- <div class="header-menu-search" data-view="SiteSearch.Button"></div> -->--}}

	<ul class="header-menu-level1">

		{{!--<!-- LEVEL 1 - CATEGORIES -->--}}
		{{#each categories}}
			{{#if text}}
				<li class="cms-menu {{parentclassnames}}" {{#if categories}}data-toggle="categories-menu"{{/if}}>
					
					<a class="header-menu-level1-anchor {{class}}" {{objectToAtrributes this}}>
						<span>{{translate text}}</span>
						{{#if categories}}<i class="header-menu-level1-anchor-icon"></i>{{/if}}
					</a>

					{{!-- <!-- THUMBNAIL MENU NAV - START --> --}}
					{{#if categories}}
					<div class="tt-ext-menu-full-width">
						<ul class="tt-ext-thumbnail-header-menu-level-container" {{{../menuNavTopOffset}}}>
							<li class="{{bannerContentClass}}">

								{{!--<!-- HTML CONTENT (TOP) -->--}}
								{{#if bannerContentAbove}} {{{bannerContent}}} {{/if}}

								{{!--<!-- LEVEL 2 - CATEGORIES -->--}}
								<ul class="tt-ext-header-menu-cetegories tt-ext-thumbnail-header-menu-level2">
									
									{{#each categories}}
									<li class="tt-ext-thumbnail-header-menu-block" {{{../../menuNavThumbnailStyle}}}>
										
										<a class="{{class}} tt-ext-thumbnail-header-menu-level2-anchor-thumbnail" {{objectToAtrributes this}}>
											<span>{{translate text}}</span>
											{{#if additionalFields.thumbnailurl}}<img src="{{additionalFields.thumbnailurl}}" alt="{{text}}">{{/if}}
										</a>

									</li>
									{{/each}}

								</ul>

								{{!--<!-- HTML CONTENT (BOTTOM) -->--}}
								{{#unless bannerContentAbove}} {{{bannerContent}}} {{/unless}}

							</li>

							{{!--<!-- 'SEE MORE' BUTTON - 2 LEVEL CATEGORIES -->--}}
							{{#if sliceCategoriesSecondLevel}}
							<div class="tt-ext-thumbnail-header-menu-level2-btn-conatiner">
								<a class="tt-ext-thumbnail-header-menu-level2-btn" data-hashtag="{{data.hashtag}}" data-touchpoint="home" href="{{href}}">
									{{#if ../secondLevelCategoriesButtonText}}
										{{../secondLevelCategoriesButtonText}}
									{{else}}
										SEE ALL {{text}}
									{{/if}}
								</a>
							</div>
							{{/if}}

						</ul>
					</div>
					{{/if}}
					{{!-- <!-- THUMBNAIL MENU NAV - END --> --}}

				</li>
			{{/if}}
		{{/each}}
	</ul>
</nav>

{{!----
Use the following context variables when customizing this template: 
	
	categories (Array)
	showExtendedMenu (Boolean)
	showLanguages (Boolean)
	showCurrencies (Boolean)

----}}

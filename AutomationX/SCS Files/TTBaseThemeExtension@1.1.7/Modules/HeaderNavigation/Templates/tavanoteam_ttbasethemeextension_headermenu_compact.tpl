<nav class="header-menu-secondary-nav tt-ext-header-menu-compact">

	{{!--<!-- <div class="header-menu-search" data-view="SiteSearch.Button"></div> -->--}}

	<ul class="header-menu-level1">

		{{!--<!-- LEVEL 1 - CATEGORIES -->--}}
		{{#each categories}}
			{{#if text}}
				<li class="cms-menu {{parentclassnames}}" {{#if categories}}data-toggle="categories-menu"{{/if}}>
					
					<a class="{{class}}" {{objectToAtrributes this}}>
						<span>{{translate text}}</span>
						{{#if categories}}<i class="header-menu-level1-anchor-icon"></i>{{/if}}
					</a>
					
					{{!-- <!-- COMPACT MENU NAV - START --> --}}
					{{#if categories}}
					<div class="tt-ext-compact-menu-position">
						<ul class="tt-ext-compact-header-menu-level-container" {{{../menuNavTopOffset}}}>
							<li class="{{bannerContentClass}}">

								{{!--<!-- HTML CONTENT (TOP) -->--}}
								{{#if bannerContentAbove}} {{{bannerContent}}} {{/if}}

								{{!--<!-- LEVEL 2 - CATEGORIES -->--}}
								<ul class="tt-ext-header-menu-cetegories tt-ext-compact-header-menu-level2">
									
									{{#each categories}}
									<li class="tt-ext-compact-header-menu-block {{#if ../../showCompactThumbnails}}tt-ext-compact-thumbnail{{/if}}">
										<a class="{{class}}" {{objectToAtrributes this}}>
											{{#if ../../showCompactThumbnails}}
												{{#if additionalFields.thumbnailurl}}<img src="{{additionalFields.thumbnailurl}}" alt="{{text}}" {{{../../menuNavCompactThumbnailStyle}}}>{{/if}}
											{{/if}}
											<span>{{translate text}}</span>
											{{#if categories}}
												<i class="tt-ext-compact-header-menu-level2-anchor-icon"></i>
											{{/if}}
										</a>

										{{!--<!-- LEVEL 3 - CATEGORIES -->--}}
										{{#if categories}}
										<div class="tt-ext-compact-header-menu-level3-wrapper">
											<ul class="tt-ext-compact-header-menu-level3">
												{{#each categories}}
												<li>
													<a class="{{class}}" {{objectToAtrributes this}}>
														{{#if ../../../showCompactThumbnails}}
															{{#if additionalFields.thumbnailurl}}<img src="{{additionalFields.thumbnailurl}}" alt="{{text}}" {{{../../../menuNavCompactThumbnailStyle}}}>{{/if}}
														{{/if}}
														<span>{{translate text}}</span>
													</a>
												</li>
												{{/each}}

												{{!--<!-- 'SEE MORE' BUTTON - 3 LEVEL CATEGORIES -->--}}
												{{#if sliceCategoriesThirdLevel}}
												<li>
													<a class="header-menu-level3-anchor" data-hashtag="{{data.hashtag}}" data-touchpoint="home" href="{{href}}">
														{{#if ../../thirdLevelCategoriesButtonText}}
															{{../../thirdLevelCategoriesButtonText}}
														{{else}}
															SEE {{text}}
														{{/if}}
													</a>
												<li>
												{{/if}}

											</ul>
										</div>
										{{/if}}
									</li>
									{{/each}}

									{{!--<!-- 'SEE MORE' BUTTON - 2 LEVEL CATEGORIES -->--}}
									{{#if sliceCategoriesSecondLevel}}
									<li class="tt-ext-compact-header-menu-block">
										<a class="header-menu-level2-anchor" data-hashtag="{{data.hashtag}}" data-touchpoint="home" href="{{href}}">
											{{#if ../secondLevelCategoriesButtonText}}
												{{../secondLevelCategoriesButtonText}}
											{{else}}
												SEE ALL {{text}}
											{{/if}}
										</a>
									</li>
									{{/if}}

								</ul>

								{{!--<!-- HTML CONTENT (BOTTOM) -->--}}
								{{#unless bannerContentAbove}} {{{bannerContent}}} {{/unless}}

							</li>
						</ul>
					</div>
					{{/if}}
					{{!-- <!-- COMPACT MENU NAV - END --> --}}

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

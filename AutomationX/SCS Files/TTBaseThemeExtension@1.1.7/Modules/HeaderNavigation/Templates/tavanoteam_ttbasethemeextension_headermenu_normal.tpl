<nav class="header-menu-secondary-nav tt-ext-header-menu-normal">

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

					{{!-- <!-- NORMAL MENU NAV - START --> --}}
					{{#if categories}}
					<div class="tt-ext-menu-full-width">
						<ul class="tt-ext-normal-header-menu-level-container" {{{../menuNavTopOffset}}}>
							<li class="{{bannerContentClass}}">

								{{!--<!-- HTML CONTENT (TOP) -->--}}
								{{#if bannerContentAbove}} {{{bannerContent}}} {{/if}}

								{{!--<!-- LEVEL 2 - CATEGORIES -->--}}
								<ul class="tt-ext-header-menu-cetegories tt-ext-normal-header-menu-level2">

									{{#each categories}}
									<li class="tt-ext-normal-header-menu-block">
										<a class="{{class}} tt-ext-normal-header-menu-level2-anchor" {{objectToAtrributes this}}>{{translate text}}</a>

										{{!--<!-- LEVEL 3 - CATEGORIES -->--}}
										{{#if categories}}
										<ul class="tt-ext-normal-header-menu-level3">
											
											{{#each categories}}
											<li>
												<a class="{{class}} tt-ext-normal-header-menu-level3-anchor" {{objectToAtrributes this}}>{{translate text}}</a>
											</li>
											{{/each}}
											
											{{!--<!-- 'SEE MORE' BUTTON - 3 LEVEL CATEGORIES -->--}}
											{{#if sliceCategoriesThirdLevel}}
											<li>
												<a class="tt-ext-normal-header-menu-level3-btn" data-hashtag="{{data.hashtag}}" data-touchpoint="home" href="{{href}}">
													{{#if ../../thirdLevelCategoriesButtonText}}
														{{../../thirdLevelCategoriesButtonText}}
													{{else}}
														SEE {{text}}
													{{/if}}
												</a>
											<li>
											{{/if}}

										</ul>
										{{/if}}

									</li>
									{{/each}}

								</ul>

								{{!--<!-- HTML CONTENT (BOTTOM) -->--}}
								{{#unless bannerContentAbove}} {{{bannerContent}}} {{/unless}}

							</li>

							{{!--<!-- 'SEE MORE' BUTTON - 2 LEVEL CATEGORIES -->--}}
							{{#if sliceCategoriesSecondLevel}}
							<div class="tt-ext-normal-header-menu-level2-btn-container">
								<a class="tt-ext-normal-header-menu-level2-btn" data-hashtag="{{data.hashtag}}" data-touchpoint="home" href="{{href}}">
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
					{{!-- <!-- NORMAL MENU NAV - END --> --}}

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

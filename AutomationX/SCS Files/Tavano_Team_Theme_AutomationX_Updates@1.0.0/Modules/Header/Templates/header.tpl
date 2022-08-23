<div class="header-main-container">

<div data-cms-area="tt-landmark_header_top-message" data-cms-area-filters="global"></div>

<div class="header-message" data-view="Message.Placeholder"></div>

	<div class="header-main-wrapper">
		<div class="header-main-nav">

			<div class="header-content">

				<div class="header-left-section">
					<div data-cms-area="tt-landmark_header_top-left-content" data-cms-area-filters="global"></div>
				</div>

				<div class="header-right-menu">

					<ul class="header-menu-actions">
						<li><a target="_blank" href="https://automation-x.com/" class="header-menu-actions-li-display-mobile">Return to Main Site</a></li>
						<li> | </li>
						<li data-view="RequestQuoteWizardHeaderLink"></li>
						<li data-view="QuickOrderHeaderLink"></li>
					</ul>

					<div class="header-menu-profile" data-view="Header.Profile"></div>

					{{#if showLanguagesOrCurrencies}}
					<ul class="header-subheader-options-lc">
						<li> | </li>
						<li class="header-subheader-settings">
							<a href="#" class="header-subheader-settings-link" data-toggle="dropdown" title="{{translate 'Settings'}}">
								<i class="header-menu-settings-icon"></i>
								<!--<i class="header-menu-settings-carret"></i>-->
							</a>
							<div class="header-menu-settings-dropdown">
								<h5 class="header-menu-settings-dropdown-title">{{translate 'Site Settings'}}</h5>
								{{#if showLanguages}}
									<div data-view="Global.HostSelector"></div>
								{{/if}}
								{{#if showCurrencies}}
									<div data-view="Global.CurrencySelector"></div>
								{{/if}}
							</div>
						</li>
						<li> | </li>
					</ul>
					{{/if}}

					<div class="header-menu-cart">
						<div class="header-menu-cart-dropdown">
							<div data-view="Header.MiniCart"></div>
						</div>
					</div>
				</div>
			</div>

		</div>

	</div>

	<div class="header-secondary-section">

		<!-- Start Mobile Toggle  -->
		<div class="header-sidebar-toggle-wrapper">
			<button class="header-sidebar-toggle" data-action="header-sidebar-show">
				<i class="header-sidebar-toggle-icon"></i>
			</button>
		</div>
		<!-- End Mobile Toggle -->

		<div class="header-logo-search-wrapper">
			
			<div class="header-logo-wrapper">
				<div data-view="Header.Logo"></div>
			</div>
			
			{{!--
			<!-- Header Center Message  -->
			<!--<div class="header-center-msg">
				<div data-cms-area="tt-landmark_header_center-msg" data-cms-area-filters="global"></div>
			</div>-->
			--}}

			<div class="search-container">
				<div class="header-site-search" data-view="SiteSearch" data-type="SiteSearch"></div>
			</div>

		</div>
		
		<!-- Start Main Menu -->
		<div class="header-secondary-wrapper" data-view="Header.Menu" data-phone-template="header_sidebar" data-tablet-template="header_sidebar"></div>

	</div>

	<div class="header-sidebar-overlay" data-action="header-sidebar-hide"></div>
</div>





<!-- Scroll Header -->
<div class="header-main-container header-scroll-fixed">

	<div class="header-secondary-section">

		<!-- Logo -->
		<div class="header-logo-wrapper">
			<div data-view="Header.Logo"></div>
		</div>
		
		<div class="header-scroll-right-icons">
			<div class="header-menu-search">
				<button class="header-menu-search-link" data-action="show-sitesearch" title="{{translate 'Search'}}">
					<i class="header-menu-search-icon"></i>
				</button>
			</div>

			<!-- Cart -->
			<div data-view="Header.MiniCart"></div>
		</div>

	</div>
</div>




{{!----
Use the following context variables when customizing this template: 
	
	profileModel (Object)
	profileModel.addresses (Array)
	profileModel.addresses.0 (Array)
	profileModel.creditcards (Array)
	profileModel.firstname (String)
	profileModel.paymentterms (undefined)
	profileModel.phoneinfo (undefined)
	profileModel.middlename (String)
	profileModel.vatregistration (undefined)
	profileModel.creditholdoverride (undefined)
	profileModel.lastname (String)
	profileModel.internalid (String)
	profileModel.addressbook (undefined)
	profileModel.campaignsubscriptions (Array)
	profileModel.isperson (undefined)
	profileModel.balance (undefined)
	profileModel.companyname (undefined)
	profileModel.name (undefined)
	profileModel.emailsubscribe (String)
	profileModel.creditlimit (undefined)
	profileModel.email (String)
	profileModel.isLoggedIn (String)
	profileModel.isRecognized (String)
	profileModel.isGuest (String)
	profileModel.priceLevel (String)
	profileModel.subsidiary (String)
	profileModel.language (String)
	profileModel.currency (Object)
	profileModel.currency.internalid (String)
	profileModel.currency.symbol (String)
	profileModel.currency.currencyname (String)
	profileModel.currency.code (String)
	profileModel.currency.precision (Number)
	showLanguages (Boolean)
	showCurrencies (Boolean)
	showLanguagesOrCurrencies (Boolean)
	showLanguagesAndCurrencies (Boolean)
	isHomeTouchpoint (Boolean)
	cartTouchPoint (String)

----}}

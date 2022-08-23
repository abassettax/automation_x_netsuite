// Tavanoteam.TTBaseThemeExtension.BannerView, this is the view your cct
// will load after dragged into the application

define('Tavanoteam.TTBaseThemeExtension.Banner.View'
	, [
		'CustomContentType.Base.View'

		, 'tavanoteam_ttbasethemeextension_banner.tpl'

		, 'jQuery'
		, 'underscore'
	]
	, function (
		CustomContentTypeBaseView

		, tavanoteam_ttbasethemeextension_banner_tpl

		, jQuery
		, _
	) {
		'use strict';

		return CustomContentTypeBaseView.extend({

			template: tavanoteam_ttbasethemeextension_banner_tpl

			// As an example of the 'install' method, we are going to emulate a fetch to a service
			// Until the promise is resolved, you won't be able to edit the settings of this CCT
			// The same could happen with the 'update' method
			, install: function (settings, context_data) {
				this._install(settings, context_data);

				// call some ajax here
				return jQuery.Deferred().resolve();
			}

			// The list of contexts that you may need to run the CCT
			, contextDataRequest: ['item']

			// By default when you drop a CCT in the SMT admin, it will run the 'validateContextDataRequest' method to check that you have
			// all the requested contexts and it will fail if some context is missing.
			, validateContextDataRequest: function validateContextDataRequest() {
				return true;
			}

			, getVerticalAlign: function(vertical_align) {
				vertical_align = parseInt(vertical_align);
				switch (vertical_align) {
					case 2: vertical_align = 'top'; break;
					case 3: vertical_align = 'bottom'; break;
					default: vertical_align = 'center';
				}
				return vertical_align;
			}

			, getHorizontalAlign: function(horizontal_align) {
				horizontal_align = parseInt(horizontal_align);
				switch (horizontal_align) {
					case 2: horizontal_align = 'left'; break;
					case 3: horizontal_align = 'right'; break;
					default: horizontal_align = 'center';
				}
				return horizontal_align;
			}

			, getColorText: function () {
				var textColor = parseInt(this.settings.custrecord_tt_banner_text_color);
				switch (textColor) {
					case 2: textColor = 'dark'; break;
					case 3: textColor = 'light'; break;
					default: textColor = 'default';
				}
				return textColor;
			}

			, getButtonClasses: function () {
				var buttonClass = parseInt(this.settings.custrecord_tt_banner_button_style);
				switch (buttonClass) {
					case 2: buttonClass = 'secondary'; break;
					case 3: buttonClass = 'tertiary'; break;
					case 4: buttonClass = 'quaternary'; break;
					case 5: buttonClass = 'link'; break;
					default: buttonClass = 'primary';
				}
				return ' tt-banner-content-button-' + buttonClass;
			}

			, getFontSize: function (textFontSize) {
				textFontSize = parseInt(textFontSize);
				switch (textFontSize) {
					case 1: textFontSize = 'xs'; break;
					case 2: textFontSize = 's'; break;
					case 3: textFontSize = 'm'; break;
					case 4: textFontSize = 'l'; break;
					case 5: textFontSize = 'xl'; break;
					case 6: textFontSize = 'xxl'; break;
					case 7: textFontSize = 'xxxl'; break;
					default: textFontSize = 'm';
				}
				return "font-size-" + textFontSize;
			}

			, getFontWeight: function (fontWeight) {
				fontWeight = parseInt(fontWeight);
				switch (fontWeight) {
					case 2: fontWeight = 'light'; break;
					case 3: fontWeight = 'semibold'; break;
					case 4: fontWeight = 'bold'; break;
					default: fontWeight = 'normal';

				}
				return "font-weight-" + fontWeight;
			}

			, getContainerClasses: function() {
				return this.settings.custrecord_tt_banner_fullwidth_container === "T" ? "tt-banner-content-fullwidth" : "tt-banner-content-container";
			}

			, getContentInfoClasses: function() {
				var contentInfoClasses = "";

				// Desktop Content Position
				contentInfoClasses += " tt-banner-content-position-desktop-" + this.getVerticalAlign(this.settings.custrecord_tt_banner_vert_pos) + "-" + this.getHorizontalAlign(this.settings.custrecord_tt_banner_horiz_pos);
				// Mobile Content Position
				contentInfoClasses += " tt-banner-content-position-mobile-" + this.getVerticalAlign(this.settings.custrecord_tt_banner_vert_pos_mb) + "-" + this.getHorizontalAlign(this.settings.custrecord_tt_banner_horiz_pos_mb);
				// Desktop Content Alignment
				contentInfoClasses += " tt-banner-content-alignment-desktop-" + this.getHorizontalAlign(this.settings.custrecord_tt_banner_horiz_align);
				// Mobile Content Alignment
				contentInfoClasses += " tt-banner-content-alignment-mobile-" + this.getHorizontalAlign(this.settings.custrecord_tt_banner_horiz_align_mb);
				// Border Radius
				contentInfoClasses += this.settings.custrecord_tt_banner_border_radius === "T" ? " tt-banner-content-border-radius" : "";
				// Text Color
				contentInfoClasses += " text-style-" + this.getColorText(this.settings.custrecord_tt_title_color);
				// Text Shadow
				contentInfoClasses += this.settings.custrecord_tt_banner_text_shadow === "T" ? " text-shadow" : "";

				return contentInfoClasses;
			}

			, getContentInfoStyles: function() {
				// content width
				var contentMinWidth = this.settings.custrecord_tt_banner_content_min_width;
				var contentMaxWidth = this.settings.custrecord_tt_banner_content_max_width;
				// content padding
				var contentPadding = this.settings.custrecord_tt_banner_content_padding;
				// content offest
				var contentOffsetVertical = this.settings.custrecord_tt_banner_cont_offset_vert != "" ? this.settings.custrecord_tt_banner_cont_offset_vert : 0;
				var contentOffsetHorizontal = this.settings.custrecord_tt_banner_cont_offset_hor != "" ? this.settings.custrecord_tt_banner_cont_offset_hor : 0;
				// background color
				var contentBackgroundColor = this.settings.custrecord_tt_banner_content_bg_color != "" ? this.settings.custrecord_tt_banner_content_bg_color : "transparent"
 				// create styles
				var styles = "style='";
				styles += contentMinWidth != "" ? "min-width: " + contentMinWidth + ";" : "";
				styles += contentMaxWidth != "" ? "max-width: " + contentMaxWidth + ";" : "";
				styles += contentPadding != "" ? "padding: " + contentPadding + "px;" : "";
				styles += "margin: " + contentOffsetVertical + "px " + contentOffsetHorizontal + "px;";
				styles += contentBackgroundColor != "transparent" ? "background-color: " + contentBackgroundColor + ";" : "";
				return styles + "'";
			}
			
			, getTextClasses: function (cms_font_size_value, cms_font_weight_value) {
				var classes = "";
				classes += this.getFontSize(cms_font_size_value) + " ";
				classes += this.getFontWeight(cms_font_weight_value) + " ";
				return classes;
			}

			, getTextStyles: function() {
				var textSpacing = this.settings.custrecord_tt_banner_text_spacing != "" ? this.settings.custrecord_tt_banner_text_spacing : 15;
				return "style='margin-bottom: " + textSpacing + "px;'";
			}
			, getButtonStyles: function() {
				var buttonSpacing = this.settings.custrecord_tt_banner_button_margin != "" ? this.settings.custrecord_tt_banner_button_margin : 15;
				return "style='margin-top: " + buttonSpacing + "px;'";
			}

			,getParallaxStyles: function() {
				var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

				var parallaxStyle = "style=\"";
				// Parallax Height
				var parallax_height = this.settings.custrecord_tt_banner_parallax_height ? this.settings.custrecord_tt_banner_parallax_height : "";
				// Parallax Positoin
				var parallax_position = parseInt(this.settings.custrecord_tt_banner_parallax_position);
				switch (parallax_position) {
					case 2:
						parallax_position = 'top';
						break;
					case 3:
						parallax_position = 'bottom';
						break;
					default:
						parallax_position = 'center';
				}
				// Create parallax styles
				parallaxStyle += "background-image: url('" + this.settings.custrecord_tt_banner_image_desktop + "'); ";
				if(isSafari) {
					parallaxStyle += "background-attachment: scroll; ";
					parallax_position = 'center';
				}
				parallaxStyle += "background-position: " + parallax_position + "; ";
				parallaxStyle += parallax_height != "" ? "height: " + parallax_height + "px; " : "";
				
				return parallaxStyle + "\"";
			}

			, getContext: function getContext() {
				
				// Button
				var buttonText = this.settings.custrecord_tt_banner_button_text;
				var buttonLink = this.settings.custrecord_tt_banner_button_link;
				var bannerLink = !buttonText && buttonLink ? true : false;
				
				// Parallax Validation
				var parallax = this.settings.custrecord_tt_banner_parallax === "T" ? true : false;

				return {
					// General
					bannerLink: bannerLink,
					contentContainerClasses: this.getContainerClasses(),
					contentInfoClasses: this.getContentInfoClasses(),
					contentInfoStyles: this.getContentInfoStyles(),
					
					// Images
					desktopImage: this.settings.custrecord_tt_banner_image_desktop,
					mobileImage: this.settings.custrecord_tt_banner_image_mobile,
					imageAlt: this.settings.custrecord_tt_banner_image_alt,
					
					// Imgage Parallax
					parallax: parallax,
					parallaxStyles: this.getParallaxStyles(),

					// Contents text
					upperTitle: this.settings.custrecord_tt_banner_uppertitle,
					title: this.settings.custrecord_tt_banner_title,
					descriptionDesktop: this.settings.custrecord_tt_banner_description,
					descriptionMobile: this.settings.custrecord_tt_banner_description_m,
					
					// Contents Classes & Styles
					upperTitleClasses: this.getTextClasses(this.settings.custrecord_tt_banner_uppertitle_fontsize, this.settings.custrecord_tt_banner_uppertitle_font_wgt),
					titleClasses: this.getTextClasses(this.settings.custrecord_tt_banner_title_font_size, this.settings.custrecord_tt_banner_title_font_wgt),
					descriptionClasses: this.getTextClasses(this.settings.custrecord_tt_banner_descrip_font_size, this.settings.custrecord_tt_banner_descrip_font_wgt),
					textStyles: this.getTextStyles(),
					
					// Button
					buttonText: buttonText,
					buttonLink: buttonLink,
					bottonStyles: this.getButtonStyles(),
					buttonClasses: this.getButtonClasses()
				};
			}
		});
	});
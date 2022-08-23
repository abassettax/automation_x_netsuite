// Tavanoteam.TTBaseThemeExtension.SliderView, this is the view your cct
// will load after dragged into the application

define('Tavanoteam.TTBaseThemeExtension.Slider.View',

    [
        'CustomContentType.Base.View',
        'tavanoteam_ttbasethemeextension_slider.tpl',
        'jQuery',
        'underscore',
        'jQuery.bxSlider@4.2.14'
    ],

    function (
        CustomContentTypeBaseView,
        tavanoteam_ttbasethemeextension_slider_tpl,
        jQuery,
        _
    ) {

        'use strict';

        return CustomContentTypeBaseView.extend({

            template: tavanoteam_ttbasethemeextension_slider_tpl,

            initialize: function initialize(options) {

                if (options) {
                    this.container = options.container;
                }
                
                this._initialize();
                
                // Load BxSlider - Start
                var self = this;
                this.on('afterViewRender', function () {
                    self.$('img').on('load', function () {
                        var hasMoreThanOneSlider = (self.$('.tt-slider-main').children().length > 1);
                        if (hasMoreThanOneSlider) {

                            if (!self.$('.bx-wrapper').length) {
                                self.sliderContainer = self.$('.tt-slider-main').bxSliderNew({
                                    auto: self.sliderAutoPlay(),
                                    pause: self.sliderSpeed(),
                                    controls: self.sliderArrowsControls(),
                                    pager: self.sliderPagerControls(),
                                    pagerCustom: self.sliderCustomPager(self.$('.tt-slider-custom-pager')),
                                    nextText: '<a class="tt-slider-next-icon"></a>',
                                    prevText: '<a class="tt-slider-prev-icon"></a>',
                                    touchEnabled: true,
                                    stopAutoOnClick: true,
                                    adaptiveHeight: true
                                });

                            } else {
                                if (self.sliderContainer) {
                                    self.sliderContainer.redrawSlider();
                                }
                            }
                        }
                    });
                });
                // Load BxSlider - End
            },

            install: function (settings, context_data) {
                this._install(settings, context_data);
                var promise = jQuery.Deferred();
                return promise.resolve();
            },

            contextDataRequest: ['item'],

            validateContextDataRequest: function validateContextDataRequest() {
                return true;
            },

            getContext: function getContext() {
                var sliderCollection = this.createSlideshowCollection();
                var slideCount = this.sliderOneSlide(sliderCollection.length);
                return {
                    oneSlide: slideCount,
                    sliderControlsClasses: this.sliderControlsClasses(),
                    slideshowList: sliderCollection,
                    showCustomPager: this.sliderShowCustomPager()
                }
            }

            //// Slider Controls ////

            , sliderAutoPlay: function() {
                return (this.settings.custrecord_tt_autoplay === "T");
            }

            , sliderSpeed: function() {
                return (this.settings.custrecord_tt_time || 5000);
            }

            , sliderArrowsControls: function () {
                return (this.settings.custrecord_tt_control === "T");
            }

            , sliderPagerControls: function () {
                var showPager = true;
				switch (parseInt(this.settings.custrecord_tt_pager_type)) {
					case 2: showPager = true; break; // Custom Pager
					case 3: showPager = false; break; // None Pager
					default: showPager = true; // Default Pager
                }
                return showPager;
            }

            , sliderShowCustomPager: function () {
                return (parseInt(this.settings.custrecord_tt_pager_type) === 2);
            }

            , sliderCustomPager: function (customPager) {
                return (parseInt(this.settings.custrecord_tt_pager_type) === 2) ? customPager : null;
            }
            
            , sliderControlsClasses: function () {
                var classes = "";
				classes += "tt-slider-controls-" + this.getColor(this.settings.custrecord_tt_controller_colors);
				classes += this.settings.custrecord_tt_controller_shadow_act === "T" ? ' tt-slider-controls-shadow' : '';
				return classes;
			}

            //// Get Slider Data ////

            , createSlideshowCollection: function () {
                var sliderShowCollection = [];
                var slideNumbers = 4;
                for (var i = 1; i < (slideNumbers + 1); i++) {
                    var slide = this.createSlide(i);
                    if (slide.showSlide) {
                        sliderShowCollection.push(slide);
                    }
                }
                return sliderShowCollection;
            }
            , sliderOneSlide: function (slideCount) {
                return slideCount === 1 ? 'tt-slider-one-slide' : '';
			}
            , createSlide: function (itemNumber) {
                var mediaData = this.mediaValidation(itemNumber);
                return {
                    showSlide: mediaData.showMedia,
                    slideContentStyles: this.slideContentStyles(itemNumber),
                    slideContentClasses: this.slideContentClasses(itemNumber),
                    // Video
                    videoURL: mediaData.desktopVideoURL,
                    desktopFileCabinetVideo: mediaData.desktopFileCabinetVideo,
                    videoMobileURL: mediaData.mobileVideoURL,
                    mobileFileCabinetVideo: mediaData.mobileFileCabinetVideo,
                    // Image
                    imageURL: mediaData.desktopImageURL,
                    imageMobileURL: mediaData.mobileImageURL,
                    imageAlt: this.settings['custrecord_tt_image' + itemNumber + '_alt'],
                    // Upper Title
                    upperTitle: this.settings['custrecord_tt_uppertitle' + itemNumber],
                    upperTitleClasses: this.slideUpperTitleClasses(itemNumber),
                    // Title
                    title: this.settings['custrecord_tt_title' + itemNumber],
                    titleClasses: this.slideTitleClasses(itemNumber),
                    // Description
                    descriptionDesktop: this.settings['custrecord_tt_description' + itemNumber],
                    descriptionMobile: this.settings['custrecord_tt_description' + itemNumber + '_m'],
                    descriptionClasses: this.slideDescriptionClasses(itemNumber),
                    // Button
                    buttonText: this.settings['custrecord_tt_button_text' + itemNumber],
                    buttonClasses: this.slideButtonClass(itemNumber),
                    link: this.settings['custrecord_tt_link' + itemNumber],
                    // Content Spacing
                    textSpacing: this.textSpacing(),
                    buttonSpacing: this.buttonSpacing(),
                    // Pager
                    customPagerText: (this.settings['custrecord_tt_cust_pager_text' + itemNumber]) || ('slide 0' + itemNumber)
                };
            }
            , existData: function (mainData) {
                return ((typeof mainData !== "undefined") && (mainData !== ""));
            }

            , mediaValidation: function (itemNumber) {
                // Desktop Video
                var desktopVideoURL = this.settings['custrecord_tt_video' + itemNumber + '_desktop'];
                desktopVideoURL = (typeof desktopVideoURL === "undefined") ? '' : desktopVideoURL;
                var desktopFileCabinetVideo = (desktopVideoURL.indexOf("http") < 0);
                // Mobile Video
                var mobileVideoURL = this.settings['custrecord_tt_video' + itemNumber + '_mobile'];
                mobileVideoURL = (typeof mobileVideoURL === "undefined") ? '' : mobileVideoURL;
                var mobileFileCabinetVideo = (mobileVideoURL.indexOf("http") < 0);
                // Images
                var desktopImageURL = desktopVideoURL === '' ? this.settings['custrecord_tt_image' + itemNumber + '_desktop'] : '';
                desktopImageURL = (typeof desktopImageURL === "undefined") ? '' : desktopImageURL;
                var mobileImageURL = mobileVideoURL === '' ? this.settings['custrecord_tt_image' + itemNumber + '_mobile'] : '';
                mobileImageURL = (typeof mobileImageURL === "undefined") ? '' : mobileImageURL;
                
                return {
                    showMedia: (desktopVideoURL != '' || mobileVideoURL != '' || desktopImageURL != '' || mobileImageURL != ''),
                    desktopVideoURL: desktopVideoURL,
                    desktopFileCabinetVideo: desktopFileCabinetVideo,
                    mobileVideoURL: mobileVideoURL,
                    mobileFileCabinetVideo: mobileFileCabinetVideo,
                    desktopImageURL: desktopImageURL,
                    mobileImageURL: mobileImageURL
                };
            }
            , slideContentStyles: function (itemNumber) {
                var styles = 'style="';
                // General Styles
                styles += 'padding: ' + this.settings.custrecord_tt_slider_padding + 'px;';
                var marginbottom = parseInt(this.settings.custrecord_tt_slider_offset_v) + 30;
                styles += 'margin: ' + this.settings.custrecord_tt_slider_offset_v + 'px ' + this.settings.custrecord_tt_slider_offset_h + 'px ' + marginbottom + 'px;';
                // Slide Styles
                var minwidth = this.settings['custrecord_tt_slider_minwidth_' + itemNumber];
                styles += this.existData(minwidth) ? 'min-width: ' + minwidth + ';' : '';
                var maxwidth = this.settings['custrecord_tt_slider_maxwidth_' + itemNumber];
                styles += this.existData(maxwidth) ? 'max-width: ' + maxwidth + ';' : '';
                var backgroundcolor = this.settings['custrecord_tt_slider_bg_' + itemNumber];
                styles += this.existData(backgroundcolor) ? 'background-color: ' + backgroundcolor + ';' : '';
                return styles + '"';
            }
            , slideContentClasses: function (itemNumber) {
                var classes = '';
                // General Classes
                classes += " tt-slider-slide-content-pos-desktop-" + this.getPositionValues(this.settings.custrecord_tt_vertical_align, this.settings.custrecord_tt_horizontal_align);
				classes += " tt-slider-slide-content-pos-mobile-" + this.getPositionValues(this.settings.custrecord_tt_vertical_align_mobile, this.settings.custrecord_tt_horizontal_align_mobile);
				classes += " tt-slider-slide-content-align-desktop-" + this.getHorizontalAlign(this.settings.custrecord_tt_slider_text_align);
				classes += " tt-slider-slide-content-align-mobile-" + this.getHorizontalAlign(this.settings.custrecord_tt_slider_text_align_m);
                classes += this.settings.custrecord_tt_slider_border_radius === "T" ? " tt-slider-slide-content-border-radius" : "";
                // Slide Classes
                classes += " " + this.getTextColor(this.settings['custrecord_tt_text_color_' + itemNumber]);
                classes += " " + this.getTextShadow(this.settings['custrecord_tt_text_shadow_' + itemNumber]);
                return classes;
            }
            , videoHeight: function (videoHeight) {
                return ((typeof videoHeight === "undefined") ? '' : 'style="height: ' + videoHeight + 'px;"');
            }
            , slideUpperTitleClasses: function (itemNumber) {
                var classes = '';
                classes += "tt-slider-font-size-" + this.getFontSize(this.settings['custrecord_tt_upper' + itemNumber + '_font_size']);
                classes += " tt-slider-font-weight-" + this.getFontWeight(this.settings['custrecord_tt_upper' + itemNumber + '_font_wgt']);
                return classes;
            }
            , slideTitleClasses: function (itemNumber) {
                var classes = '';
                classes += "tt-slider-font-size-" + this.getFontSize(this.settings['custrecord_tt_title' + itemNumber + '_font_size']);
                classes += " tt-slider-font-weight-" + this.getFontWeight(this.settings['custrecord_tt_title' + itemNumber + '_font_wgt']);
                return classes;
            }
            , slideDescriptionClasses: function (itemNumber) {
                var classes = '';
                classes += "tt-slider-font-size-" + this.getFontSize(this.settings['custrecord_tt_description' + itemNumber + '_font_size']);
                classes += " tt-slider-font-weight-" + this.getFontWeight(this.settings['custrecord_tt_description' + itemNumber + '_font_wgt']);
                return classes;
            }
            , slideButtonClass: function (itemNumber) {
				var buttonStyle = parseInt(this.settings['custrecord_tt_button_style' + itemNumber]);
				switch (buttonStyle) {
					case 2: buttonStyle = 'secondary'; break;
					case 3: buttonStyle = 'tertiary'; break;
					case 4: buttonStyle = 'quaternary'; break;
					case 5: buttonStyle = 'link'; break;
					default: buttonStyle = 'primary';
				}
				return 'tt-slider-button-' + buttonStyle;
            }
            , getPositionValues: function (vartical_setting, horizontal_setting) {
				var vertical_position = parseInt(vartical_setting);
				var horizontal_position = this.getHorizontalAlign(horizontal_setting);
				switch (vertical_position) {
					case 2: vertical_position = 'top'; break;
					case 3: vertical_position = 'bottom'; break;
					default: vertical_position = 'center'; // 1
				}
				return vertical_position + "-" + horizontal_position;
            }
            , getHorizontalAlign: function (horizontal_setting) {
				var horizontal_position = parseInt(horizontal_setting);
				switch (horizontal_position) {
					case 2: horizontal_position = 'left'; break;
					case 3: horizontal_position = 'right'; break;
					default: horizontal_position = 'center'; // 1 
				}
				return horizontal_position;
            }
            , getColor: function (color) {
				var textColor = parseInt(color);
				switch (textColor) {
					case 2: textColor = 'dark'; break;
					case 3: textColor = 'light'; break;
					default: textColor = 'default';
				}
				return textColor;
			}
            , getTextColor: function (textColor) {
				return "text-style-" + this.getColor(textColor);
			}
			, getTextShadow: function (textShadow) {
				return textShadow === "T" ? "text-shadow" : "";
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
				return textFontSize;
			}
			, getFontWeight: function (fontWeight) {
				fontWeight = parseInt(fontWeight);
				switch (fontWeight) {
					case 2: fontWeight = 'light'; break;
					case 3: fontWeight = 'semibold'; break;
					case 4: fontWeight = 'bold'; break;
					default: fontWeight = 'normal';
				}
				return fontWeight;
            }
            , textSpacing: function () {
                return 'style="margin-bottom:' + this.settings.custrecord_tt_slider_text_spacing + 'px"';
            }
            , buttonSpacing: function () {
                return 'style="margin-top:' + this.settings.custrecord_tt_buttons_spacing + 'px"';
            }

        });
    });
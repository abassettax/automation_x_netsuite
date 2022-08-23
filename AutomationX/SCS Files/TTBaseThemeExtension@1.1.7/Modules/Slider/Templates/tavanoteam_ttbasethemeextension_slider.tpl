<section class="tt-slider-section {{sliderControlsClasses}} {{oneSlide}}">
    <div class="tt-slider-main">
        {{#each slideshowList}}
            <div class="tt-slider-slide">

                {{!--<!-- Desktop - Video / Image -->--}}
                {{#if this.videoURL}}
                    {{#if this.desktopFileCabinetVideo}}
                    <video class="tt-slider-desktop" autoplay="true" muted="muted" loop=""><source src="{{this.videoURL}}" type="video/mp4"></video>
                    {{else}}
                    <iframe class="tt-slider-desktop tt-slider-video" src="{{this.videoURL}}"></iframe>
                    {{/if}}
                {{else}}
                    <img class="tt-slider-desktop" src="{{this.imageURL}}" alt="{{this.imageAlt}}" />
                {{/if}}
                {{!--<!-- Mobil - Video / Image -->--}}
                {{#if this.videoMobileURL}}
                    {{#if this.mobileFileCabinetVideo}}
                    <video class="tt-slider-mobile" autoplay="true" muted="muted" loop=""><source src="{{this.videoMobileURL}}" type="video/mp4"></video>
                    {{else}}
                    <iframe class="tt-slider-mobile tt-slider-video" src="{{this.videoMobileURL}}"></iframe>
                    {{/if}}
                {{else}}
                    <img class="tt-slider-mobile" src="{{this.imageMobileURL}}" alt="{{this.imageAlt}}" />
                {{/if}}

                <div class="tt-slider-slide-content-container">
                    <div class="tt-slider-slide-content {{slideContentClasses}}" {{{slideContentStyles}}}>
                        {{!--<!-- Upper Title -->--}}
                        {{#if this.upperTitle}}<h3 class="{{this.upperTitleClasses}}" {{{textSpacing}}}>{{this.upperTitle}}</h3>{{/if}}
                        {{!--<!-- Title -->--}}
                        {{#if this.title}}<h2 class="{{this.titleClasses}}" {{{textSpacing}}}>{{this.title}}</h2>{{/if}}
                        {{!--<!-- Description -->--}}
                        {{#if this.descriptionMobile}}
                        <p class="tt-slider-mobile {{this.descriptionClasses}}">{{this.descriptionMobile}}</p>
                        {{/if}}
                        {{#if this.descriptionDesktop}}
                        <p class="tt-slider-desktop {{this.descriptionClasses}}">{{this.descriptionDesktop}}</p>
                        {{/if}}
                        {{!--<!-- Button -->--}}
                        {{#if this.buttonText}}
                        <div {{{buttonSpacing}}}><a class="{{this.buttonClasses}}" href="{{this.link}}" target="blank">{{this.buttonText}}</a></div>
                        {{/if}}
                    </div>
                </div>
            </div>
        {{/each}}
    </div>

    {{!--<!-- Custom Pager -->--}}
    {{#if showCustomPager}}
    <div class="tt-slider-custom-pager">
        {{#each slideshowList}}
        <a data-slide-index="{{@index}}" href="" class="tt-slider-custom-pager-link {{#if @first}}active{{/if}}">
            <span>{{this.customPagerText}}</span>
        </a>
        {{/each}}
    </div>
    {{/if}}

</section>
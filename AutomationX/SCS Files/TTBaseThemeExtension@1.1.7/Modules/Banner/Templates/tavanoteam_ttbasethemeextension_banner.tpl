<section class="tt-banner-section {{#unless mobileImage}}tt-banner-no-image-mobile{{/unless}} {{#unless desktopImage}}tt-banner-no-image-desktop{{/unless}}">

  {{!--<!-- Images -->--}}
  {{#if mobileImage}}
    <img src="{{mobileImage}}" class="tt-banner-mobile" alt="{{imageAlt}}">
  {{/if}}
  {{#if desktopImage}}
    {{#if parallax}}
      <div class="tt-banner-desktop tt-banner-parallax" {{{parallaxStyles}}}></div>
    {{else}}
      <img src="{{desktopImage}}" class="tt-banner-desktop" alt="{{imageAlt}}">
    {{/if}}
  {{/if}}

  {{!--<!-- Content -->--}}
  <div class="tt-banner-wrapper">

    {{#if bannerLink}}<a href="{{buttonLink}}" class="tt-banner-content-link">{{/if}}
      
      <div class="tt-banner-content {{contentContainerClasses}}">
      
        <div class="tt-banner-content-info {{contentInfoClasses}}" {{{contentInfoStyles}}}>

          {{!--<!-- Upper Title -->--}}
          {{#if upperTitle}}
          <h3 class="tt-banner-content-uppertitle {{upperTitleClasses}}" {{{textStyles}}}>{{upperTitle}}</h3>
          {{/if}}

          {{!--<!-- Title -->--}}
          {{#if title}}
          <h2 class="tt-banner-content-title {{titleClasses}}" {{{textStyles}}}>{{title}}</h2>
          {{/if}}

          {{!--<!-- Description -->--}}
          {{#if descriptionDesktop}}
          <p class="tt-banner-desktop {{descriptionClasses}}">{{descriptionDesktop}}</p>
          {{/if}}
          {{#if descriptionMobile}}
          <p class="tt-banner-mobile {{descriptionClasses}}">{{descriptionMobile}}</p>
          {{/if}}

          {{!--<!-- Button -->--}}
          {{#if buttonText}}
          <div class="tt-banner-content-button-container" {{{bottonStyles}}}>
            <a href="{{buttonLink}}" target="blank" class="{{buttonClasses}}">{{buttonText}}</a>
          </div>
          {{/if}}

        </div>

      </div>

    {{#if bannerLink}}</a>{{/if}}

  </div>
  
</section>



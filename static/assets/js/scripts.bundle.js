//
// Global init of core components
//

// Init components
var KTComponents = function () {
    // Public methods
    return {
        init: function () {
            KTApp.init();
			KTDrawer.init();
			KTMenu.init();
			KTScroll.init();
			KTSticky.init();
			KTSwapper.init();
			KTToggle.init();
			KTScrolltop.init();
			KTDialer.init();	
			KTImageInput.init();
			KTPasswordMeter.init();	
        }
    }	
}();

// On document ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", function() {
		KTComponents.init();
	});
 } else {
	KTComponents.init();
 }

 // Init page loader
window.addEventListener("load", function() {
    KTApp.hidePageLoading();
});

// Declare KTApp for Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	window.KTComponents = module.exports = KTComponents;
}
"use strict";

// Class definition
var KTApp = function () {
    var initialized = false;
    var select2FocusFixInitialized = false;
    var countUpInitialized = false;

    var createBootstrapTooltip = function (el, options) {
        if (el.getAttribute("data-kt-initialized") === "1") {
            return;
        }

        var delay = {};

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Check dismiss options
        if (el.hasAttribute('data-bs-dismiss') && el.getAttribute('data-bs-dismiss') == 'click') {
            options['dismiss'] = 'click';
        }

        // Initialize popover
        var tp = new bootstrap.Tooltip(el, options);        

        // Handle dismiss
        if (options['dismiss'] && options['dismiss'] === 'click') {
            // Hide popover on element click
            el.addEventListener("click", function (e) {
                tp.hide();
            });
        }

        el.setAttribute("data-kt-initialized", "1");

        return tp;
    }

    var createBootstrapTooltips = function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            createBootstrapTooltip(tooltipTriggerEl, {});
        });
    }

    var createBootstrapPopover = function (el, options) {
        if (el.getAttribute("data-kt-initialized") === "1") {
            return;
        }

        var delay = {};

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Handle dismiss option
        if (el.getAttribute('data-bs-dismiss') == 'true') {
            options['dismiss'] = true;
        }

        if (options['dismiss'] === true) {
            options['template'] = '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }

        // Initialize popover
        var popover = new bootstrap.Popover(el, options);

        // Handle dismiss click
        if (options['dismiss'] === true) {
            var dismissHandler = function (e) {
                popover.hide();
            }

            el.addEventListener('shown.bs.popover', function () {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.addEventListener('click', dismissHandler);
            });

            el.addEventListener('hide.bs.popover', function () {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.removeEventListener('click', dismissHandler);
            });
        }

        el.setAttribute("data-kt-initialized", "1");

        return popover;
    }

    var createBootstrapPopovers = function () {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            createBootstrapPopover(popoverTriggerEl, {});
        });
    }

    var createBootstrapToasts = function () {
        var toastElList = [].slice.call(document.querySelectorAll('.toast'));
        var toastList = toastElList.map(function (toastEl) {
            if (toastEl.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            toastEl.setAttribute("data-kt-initialized", "1");

            return new bootstrap.Toast(toastEl, {})
        });
    }

    var createButtons = function () {
        var buttonsGroup = [].slice.call(document.querySelectorAll('[data-kt-buttons="true"]'));

        buttonsGroup.map(function (group) {
            if (group.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            var selector = group.hasAttribute('data-kt-buttons-target') ? group.getAttribute('data-kt-buttons-target') : '.btn';
            var activeButtons = [].slice.call(group.querySelectorAll(selector));

            // Toggle Handler
            KTUtil.on(group, selector, 'click', function (e) {
                activeButtons.map(function (button) {
                    button.classList.remove('active');
                });

                this.classList.add('active');
            });       

            group.setAttribute("data-kt-initialized", "1");
        });
    }

    var createDateRangePickers = function() {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if daterangepicker included
        if (typeof $.fn.daterangepicker === 'undefined') {
            return;
        }

        var elements = [].slice.call(document.querySelectorAll('[data-kt-daterangepicker="true"]'));
        var start = moment().subtract(29, 'days');
        var end = moment();
        
        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            var display = element.querySelector('div');
            var attrOpens  = element.hasAttribute('data-kt-daterangepicker-opens') ? element.getAttribute('data-kt-daterangepicker-opens') : 'left';
            var range = element.getAttribute('data-kt-daterangepicker-range');

            var cb = function(start, end) {
                var current = moment();

                if (display) {
                    if ( current.isSame(start, "day") && current.isSame(end, "day") ) {
                        display.innerHTML = start.format('D MMM YYYY');
                    } else {
                        display.innerHTML = start.format('D MMM YYYY') + ' - ' + end.format('D MMM YYYY');
                    }                    
                }
            }

            if ( range === "today" ) {
                start = moment();
                end = moment();
            }

            $(element).daterangepicker({
                startDate: start,
                endDate: end,
                opens: attrOpens,
                ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                }
            }, cb);

            cb(start, end);

            element.setAttribute("data-kt-initialized", "1");
        });
    }

    var createSelect2 = function () {
        // Check if jQuery included
        if (typeof jQuery == 'undefined') {
            return;
        }

        // Check if select2 included
        if (typeof $.fn.select2 === 'undefined') {
            return;
        }

        var elements = [].slice.call(document.querySelectorAll('[data-control="select2"], [data-kt-select2="true"]'));

        elements.map(function (element) {
            if (element.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            var options = {
                dir: document.body.getAttribute('direction')
            };

            if (element.getAttribute('data-hide-search') == 'true') {
                options.minimumResultsForSearch = Infinity;
            }

            $(element).select2(options);

            element.setAttribute("data-kt-initialized", "1");
        });

        /*
        * Hacky fix for a bug in select2 with jQuery 3.6.0's new nested-focus "protection"
        * see: https://github.com/select2/select2/issues/5993
        * see: https://github.com/jquery/jquery/issues/4382
        *
        * TODO: Recheck with the select2 GH issue and remove once this is fixed on their side
        */

        if (select2FocusFixInitialized === false) {
            select2FocusFixInitialized = true;
            
            $(document).on('select2:open', function(e) {
                var elements = document.querySelectorAll('.select2-container--open .select2-search__field');
                if (elements.length > 0) {
                    elements[elements.length - 1].focus();
                }                
            });
        }        
    }

    var createAutosize = function () {
        if (typeof autosize === 'undefined') {
            return;
        }

        var inputs = [].slice.call(document.querySelectorAll('[data-kt-autosize="true"]'));

        inputs.map(function (input) {
            if (input.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            autosize(input);

            input.setAttribute("data-kt-initialized", "1");
        });
    }

    var createCountUp = function () {
        if (typeof countUp === 'undefined') {
            return;
        }

        var elements = [].slice.call(document.querySelectorAll('[data-kt-countup="true"]:not(.counted)'));

        elements.map(function (element) {
            if (KTUtil.isInViewport(element) && KTUtil.visible(element)) {
                if (element.getAttribute("data-kt-initialized") === "1") {
                    return;
                }

                var options = {};

                var value = element.getAttribute('data-kt-countup-value');
                value = parseFloat(value.replace(/,/g, ""));

                if (element.hasAttribute('data-kt-countup-start-val')) {
                    options.startVal = parseFloat(element.getAttribute('data-kt-countup-start-val'));
                }

                if (element.hasAttribute('data-kt-countup-duration')) {
                    options.duration = parseInt(element.getAttribute('data-kt-countup-duration'));
                }

                if (element.hasAttribute('data-kt-countup-decimal-places')) {
                    options.decimalPlaces = parseInt(element.getAttribute('data-kt-countup-decimal-places'));
                }

                if (element.hasAttribute('data-kt-countup-prefix')) {
                    options.prefix = element.getAttribute('data-kt-countup-prefix');
                }

                if (element.hasAttribute('data-kt-countup-separator')) {
                    options.separator = element.getAttribute('data-kt-countup-separator');
                }

                if (element.hasAttribute('data-kt-countup-suffix')) {
                    options.suffix = element.getAttribute('data-kt-countup-suffix');
                }

                var count = new countUp.CountUp(element, value, options);

                count.start();

                element.classList.add('counted');

                element.setAttribute("data-kt-initialized", "1");
            }
        });
    }

    var createCountUpTabs = function () {
        if (typeof countUp === 'undefined') {
            return;
        }

        if (countUpInitialized === false) {
            // Initial call
            createCountUp();

            // Window scroll event handler
            window.addEventListener('scroll', createCountUp);
        }      

        // Tabs shown event handler
        var tabs = [].slice.call(document.querySelectorAll('[data-kt-countup-tabs="true"][data-bs-toggle="tab"]'));
        tabs.map(function (tab) {
            if (tab.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            tab.addEventListener('shown.bs.tab', createCountUp);

            tab.setAttribute("data-kt-initialized", "1");
        });

        countUpInitialized = true;
    }

    var createTinySliders = function () {
        if (typeof tns === 'undefined') {
            return;
        }

        // Sliders
        const elements = Array.prototype.slice.call(document.querySelectorAll('[data-tns="true"]'), 0);

        if (!elements && elements.length === 0) {
            return;
        }

        elements.forEach(function (el) {
            if (el.getAttribute("data-kt-initialized") === "1") {
                return;
            }

            initTinySlider(el);

            el.setAttribute("data-kt-initialized", "1");
        });
    }

    var initTinySlider = function (el) {
        if (!el) {
            return;
        }

        const tnsOptions = {};

        // Convert string boolean
        const checkBool = function (val) {
            if (val === 'true') {
                return true;
            }
            if (val === 'false') {
                return false;
            }
            return val;
        };

        // get extra options via data attributes
        el.getAttributeNames().forEach(function (attrName) {
            // more options; https://github.com/ganlanyuan/tiny-slider#options
            if ((/^data-tns-.*/g).test(attrName)) {
                let optionName = attrName.replace('data-tns-', '').toLowerCase().replace(/(?:[\s-])\w/g, function (match) {
                    return match.replace('-', '').toUpperCase();
                });

                if (attrName === 'data-tns-responsive') {
                    // fix string with a valid json
                    const jsonStr = el.getAttribute(attrName).replace(/(\w+:)|(\w+ :)/g, function (matched) {
                        return '"' + matched.substring(0, matched.length - 1) + '":';
                    });
                    try {
                        // convert json string to object
                        tnsOptions[optionName] = JSON.parse(jsonStr);
                    }
                    catch (e) {
                    }
                }
                else {
                    tnsOptions[optionName] = checkBool(el.getAttribute(attrName));
                }
            }
        });

        const opt = Object.assign({}, {
            container: el,
            slideBy: 'page',
            autoplay: true,
            center: true,
            autoplayButtonOutput: false,
        }, tnsOptions);

        if (el.closest('.tns')) {
            KTUtil.addClass(el.closest('.tns'), 'tns-initiazlied');
        }

        return tns(opt);
    }

    var initSmoothScroll = function () {
        if (initialized === true) {
            return;
        }

        if (typeof SmoothScroll === 'undefined') {
            return;
        }

        new SmoothScroll('a[data-kt-scroll-toggle][href*="#"]', {
            speed: 1000,
            speedAsDuration: true,
            offset: function (anchor, toggle) {
                // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
                // This example is a function, but you could do something as simple as `offset: 25`

                // An example returning different values based on whether the clicked link was in the header nav or not
                if (anchor.hasAttribute('data-kt-scroll-offset')) {
                    var val = KTUtil.getResponsiveValue(anchor.getAttribute('data-kt-scroll-offset'));
                    
                    return val;
                } else {
                    return 0;
                }
            }
        });
    }

    var initCard = function() {
        // Toggle Handler
        KTUtil.on(document.body, '[data-kt-card-action="remove"]', 'click', function (e) {
            e.preventDefault();
            
            const card = this.closest('.card');

            if (!card) {
                return;
            }

            const confirmMessage = this.getAttribute("data-kt-card-confirm-message");
            const confirm = this.getAttribute("data-kt-card-confirm") === "true";

            if (confirm) {
                // Show message popup. For more info check the plugin's official documentation: https://sweetalert2.github.io/
                Swal.fire({
                    text: confirmMessage ? confirmMessage : "Are you sure to remove ?",
                    icon: "warning",
                    buttonsStyling: false,
                    confirmButtonText: "Confirm",
                    denyButtonText: "Cancel",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        denyButton: "btn btn-danger"
                    }
                }).then(function (result) {
                    if (result.isConfirmed) { 
                        card.remove();
                    }
                });
            } else {
                card.remove();
            }            
        });        
    }

    var initModal = function() {
        var elements = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"));

        if (elements && elements.length > 0) {
            elements.forEach((element) => {
                if (element.getAttribute("data-kt-initialized") === "1") {
                    return;
                }
    
                element.setAttribute("data-kt-initialized", "1");
    
                element.addEventListener("click", function(e) {
                    e.preventDefault();
    
                    const modalEl = document.querySelector(this.getAttribute("data-bs-stacked-modal"));
    
                    if (modalEl) {
                        const modal = new bootstrap.Modal(modalEl);
                        modal.show();
                    }                
                }); 
            });
        }        
    }

    var initCheck = function () {
        if (initialized === true) {
            return;
        }

        // Toggle Handler
        KTUtil.on(document.body, '[data-kt-check="true"]', 'change', function (e) {
            var check = this;
            var targets = document.querySelectorAll(check.getAttribute('data-kt-check-target'));

            KTUtil.each(targets, function (target) {
                if (target.type == 'checkbox') {
                    target.checked = check.checked;
                } else {
                    target.classList.toggle('active');
                }
            });
        });
    }

    var initBootstrapCollapse = function() {
        if (initialized === true) {
            return;
        }

        KTUtil.on(document.body,  '.collapsible[data-bs-toggle="collapse"]', 'click', function(e) {
            if (this.classList.contains('collapsed')) {
                this.classList.remove('active');
                this.blur();
            } else {
                this.classList.add('active');
            }

            if (this.hasAttribute('data-kt-toggle-text')) {
                var text = this.getAttribute('data-kt-toggle-text');
                var target = this.querySelector('[data-kt-toggle-text-target="true"]');
                var target = target ? target : this;

                this.setAttribute('data-kt-toggle-text', target.innerText);
                target.innerText = text;
            }
        });
    }

    var initBootstrapRotate = function() {
        if (initialized === true) {
            return;
        }
        
        KTUtil.on(document.body,  '[data-kt-rotate="true"]', 'click', function(e) {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.blur();
            } else {
                this.classList.add('active');
            }
        });
    }

    var initLozad = function() {
        // Check if lozad included
        if (typeof lozad === 'undefined') {
            return;
        }

		const observer = lozad(); // lazy loads elements with default selector as '.lozad'
        observer.observe();
	}

    var showPageLoading = function() {
        document.body.classList.add('page-loading');
        document.body.setAttribute('data-kt-app-page-loading', "on");
    }

    var hidePageLoading = function() {
        // CSS3 Transitions only after page load(.page-loading or .app-page-loading class added to body tag and remove with JS on page load)
        document.body.classList.remove('page-loading');
        document.body.removeAttribute('data-kt-app-page-loading');
    }

    return {
        init: function () {
            initLozad();

            initSmoothScroll();

            initCard();

            initModal();

            initCheck();

            initBootstrapCollapse();

            initBootstrapRotate();            

            createBootstrapTooltips();

            createBootstrapPopovers();

            createBootstrapToasts();

            createDateRangePickers();

            createButtons();

            createSelect2();

            createCountUp();

            createCountUpTabs();

            createAutosize();

            createTinySliders();

            initialized = true;
        },

        initTinySlider: function(el) {
            initTinySlider(el);
        },

        showPageLoading: function () {
            showPageLoading();
        },

        hidePageLoading: function () {
            hidePageLoading();
        },

        createBootstrapPopover: function(el, options) {
            return createBootstrapPopover(el, options);
        },

        createBootstrapTooltip: function(el, options) {
            return createBootstrapTooltip(el, options);
        }
    };
}();

// Declare KTApp for Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTApp;
}
"use strict";

// Class definition
var KTBlockUI = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        zIndex: false,
        overlayClass: '',
        overflow: 'hidden',
        message: '<span class="spinner-border text-primary"></span>'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('blockui') ) {
            the = KTUtil.data(element).get('blockui');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.element = element;
        the.overlayElement = null;
        the.blocked = false;
        the.positionChanged = false;
        the.overflowChanged = false;

        // Bind Instance
        KTUtil.data(the.element).set('blockui', the);
    }

    var _block = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.blockui.block', the) === false ) {
            return;
        }

        var isPage = (the.element.tagName === 'BODY');
       
        var position = KTUtil.css(the.element, 'position');
        var overflow = KTUtil.css(the.element, 'overflow');
        var zIndex = isPage ? 10000 : 1;

        if (the.options.zIndex > 0) {
            zIndex = the.options.zIndex;
        } else {
            if (KTUtil.css(the.element, 'z-index') != 'auto') {
                zIndex = KTUtil.css(the.element, 'z-index');
            }
        }

        the.element.classList.add('blockui');

        if (position === "absolute" || position === "relative" || position === "fixed") {
            KTUtil.css(the.element, 'position', 'relative');
            the.positionChanged = true;
        }

        if (the.options.overflow === 'hidden' && overflow === 'visible') {           
            KTUtil.css(the.element, 'overflow', 'hidden');
            the.overflowChanged = true;
        }

        the.overlayElement = document.createElement('DIV');    
        the.overlayElement.setAttribute('class', 'blockui-overlay ' + the.options.overlayClass);
        
        the.overlayElement.innerHTML = the.options.message;

        KTUtil.css(the.overlayElement, 'z-index', zIndex);

        the.element.append(the.overlayElement);
        the.blocked = true;

        KTEventHandler.trigger(the.element, 'kt.blockui.after.blocked', the)
    }

    var _release = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.blockui.release', the) === false ) {
            return;
        }

        the.element.classList.add('blockui');
        
        if (the.positionChanged) {
            KTUtil.css(the.element, 'position', '');
        }

        if (the.overflowChanged) {
            KTUtil.css(the.element, 'overflow', '');
        }

        if (the.overlayElement) {
            KTUtil.remove(the.overlayElement);
        }        

        the.blocked = false;

        KTEventHandler.trigger(the.element, 'kt.blockui.released', the);
    }

    var _isBlocked = function() {
        return the.blocked;
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('blockui');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.block = function() {
        _block();
    }

    the.release = function() {
        _release();
    }

    the.isBlocked = function() {
        return _isBlocked();
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTBlockUI.getInstance = function(element) {
    if (element !== null && KTUtil.data(element).has('blockui')) {
        return KTUtil.data(element).get('blockui');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTBlockUI;
}
"use strict";
// DOCS: https://javascript.info/cookie

// Class definition
var KTCookie = function() {
    return {
        // returns the cookie with the given name,
        // or undefined if not found
        get: function(name) {
            var matches = document.cookie.match(new RegExp(
                "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));

            return matches ? decodeURIComponent(matches[1]) : null;
        },

        // Please note that a cookie value is encoded,
        // so getCookie uses a built-in decodeURIComponent function to decode it.
        set: function(name, value, options) {
            if ( typeof options === "undefined" || options === null ) {
                options = {};
            }

            options = Object.assign({}, {
                path: '/'
            }, options);

            if ( options.expires instanceof Date ) {
                options.expires = options.expires.toUTCString();
            }

            var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

            for ( var optionKey in options ) {
                if ( options.hasOwnProperty(optionKey) === false ) {
                    continue;
                }

                updatedCookie += "; " + optionKey;
                var optionValue = options[optionKey];

                if ( optionValue !== true ) {
                    updatedCookie += "=" + optionValue;
                }
            }

            document.cookie = updatedCookie;
        },

        // To remove a cookie, we can call it with a negative expiration date:
        remove: function(name) {
            this.set(name, "", {
                'max-age': -1
            });
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTCookie;
}

"use strict";

// Class definition
var KTDialer = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        min: null,
        max: null,
        step: 1,
        decimals: 0,
        prefix: "",
        suffix: ""
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    // Constructor
    var _construct = function() {
        if ( KTUtil.data(element).has('dialer') === true ) {
            the = KTUtil.data(element).get('dialer');
        } else {
            _init();
        }
    }

    // Initialize
    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);

        // Elements
        the.element = element;
        the.incElement = the.element.querySelector('[data-kt-dialer-control="increase"]');
        the.decElement = the.element.querySelector('[data-kt-dialer-control="decrease"]');
        the.inputElement = the.element.querySelector('input[type]'); 
        
        // Set Values
        if (_getOption('decimals')) {
            the.options.decimals = parseInt(_getOption('decimals'));
        }
        
        if (_getOption('prefix')) {
            the.options.prefix = _getOption('prefix');
        }
        
        if (_getOption('suffix')) {
            the.options.suffix = _getOption('suffix');
        }
        
        if (_getOption('step')) {
            the.options.step = parseFloat(_getOption('step'));
        }

        if (_getOption('min')) {
            the.options.min = parseFloat(_getOption('min'));
        }

        if (_getOption('max')) {
            the.options.max = parseFloat(_getOption('max'));
        }

        the.value = parseFloat(the.inputElement.value.replace(/[^\d.]/g, ''));  

        _setValue();

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('dialer', the);
    }

    // Handlers
    var _handlers = function() {
        KTUtil.addEvent(the.incElement, 'click', function(e) {
            e.preventDefault();
        
            _increase();
        });

        KTUtil.addEvent(the.decElement, 'click', function(e) {
            e.preventDefault();

            _decrease();
        });

        KTUtil.addEvent(the.inputElement, 'input', function(e) {
            e.preventDefault();

            _setValue();
        });
    }

    // Event handlers
    var _increase = function() {
        // Trigger "after.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.increase', the);

        the.inputElement.value = the.value + the.options.step;
        _setValue();

        // Trigger "before.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.increased', the);

        return the;
    }

    var _decrease = function() {
        // Trigger "after.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.decrease', the);

        the.inputElement.value = the.value - the.options.step;      

        _setValue();

        // Trigger "before.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.decreased', the);

        return the;
    }

    // Set Input Value
    var _setValue = function(value) {
        // Trigger "after.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.change', the);

        if (value !== undefined) {
            the.value = value;
        } else {
            the.value = _parse(the.inputElement.value); 
        }        
        
        if (the.options.min !== null && the.value < the.options.min) {
            the.value = the.options.min;
        }

        if (the.options.max !== null && the.value > the.options.max) {
            the.value = the.options.max;
        }

        the.inputElement.value = _format(the.value);

        // Trigger input change event
        the.inputElement.dispatchEvent(new Event('change'));

        // Trigger "after.dialer" event
        KTEventHandler.trigger(the.element, 'kt.dialer.changed', the);
    }

    var _parse = function(val) {
        val = val
            .replace(/[^0-9.-]/g, '')       // remove chars except number, hyphen, point. 
            .replace(/(\..*)\./g, '$1')     // remove multiple points.
            .replace(/(?!^)-/g, '')         // remove middle hyphen.
            .replace(/^0+(\d)/gm, '$1');    // remove multiple leading zeros. <-- I added this.

        val = parseFloat(val);

        if (isNaN(val)) {
            val = 0;
        } 

        return val;
    }

    // Format
    var _format = function(val){
        return the.options.prefix + parseFloat(val).toFixed(the.options.decimals) + the.options.suffix;              
    }

    // Get option
    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-dialer-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-dialer-' + name);
            var value = attr;            

            return value;
        } else {
            return null;
        }
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('dialer');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.setMinValue = function(value) {
        the.options.min = value;
    }

    the.setMaxValue = function(value) {
        the.options.max = value;
    }

    the.setValue = function(value) {
        _setValue(value);
    }

    the.getValue = function() {
        return the.inputElement.value;
    }    

    the.update = function() {
        _setValue();
    }

    the.increase = function() {
        return _increase();
    }

    the.decrease = function() {
        return _decrease();
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTDialer.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('dialer') ) {
        return KTUtil.data(element).get('dialer');
    } else {
        return null;
    }
}

// Create instances
KTDialer.createInstances = function(selector = '[data-kt-dialer="true"]') {
    // Get instances
    var elements = document.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTDialer(elements[i]);
        }
    }
}

// Global initialization
KTDialer.init = function() {
    KTDialer.createInstances();
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTDialer;
}
"use strict";

var KTDrawerHandlersInitialized = false; 

// Class definition
var KTDrawer = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        overlay: true,
        direction: 'end',
        baseClass: 'drawer',
        overlayClass: 'drawer-overlay'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('drawer') ) {
            the = KTUtil.data(element).get('drawer');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('drawer');
        the.element = element;
        the.overlayElement = null;
        the.name = the.element.getAttribute('data-kt-drawer-name');
        the.shown = false;
        the.lastWidth;
        the.toggleElement = null;

        // Set initialized
        the.element.setAttribute('data-kt-drawer', 'true');

        // Event Handlers
        _handlers();

        // Update Instance
        _update();

        // Bind Instance
        KTUtil.data(the.element).set('drawer', the);
    }

    var _handlers = function() {
        var togglers = _getOption('toggle');
        var closers = _getOption('close');

        if ( togglers !== null && togglers.length > 0 ) {
            KTUtil.on(document.body, togglers, 'click', function(e) {
                e.preventDefault();

                the.toggleElement = this;
                _toggle();
            });
        }

        if ( closers !== null && closers.length > 0 ) {
            KTUtil.on(document.body, closers, 'click', function(e) {
                e.preventDefault();

                the.closeElement = this;
                _hide();
            });
        }
    }

    var _toggle = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.drawer.toggle', the) === false ) {
            return;
        }

        if ( the.shown === true ) {
            _hide();
        } else {
            _show();
        }

        KTEventHandler.trigger(the.element, 'kt.drawer.toggled', the);
    }

    var _hide = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.drawer.hide', the) === false ) {
            return;
        }

        the.shown = false;

        _deleteOverlay();

        document.body.removeAttribute('data-kt-drawer-' + the.name, 'on');
        document.body.removeAttribute('data-kt-drawer');

        KTUtil.removeClass(the.element, the.options.baseClass + '-on');

        if ( the.toggleElement !== null ) {
            KTUtil.removeClass(the.toggleElement, 'active');
        }

        KTEventHandler.trigger(the.element, 'kt.drawer.after.hidden', the) === false
    }

    var _show = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.drawer.show', the) === false ) {
            return;
        }

        the.shown = true;

        _createOverlay();
        document.body.setAttribute('data-kt-drawer-' + the.name, 'on');
        document.body.setAttribute('data-kt-drawer', 'on');

        KTUtil.addClass(the.element, the.options.baseClass + '-on');

        if ( the.toggleElement !== null ) {
            KTUtil.addClass(the.toggleElement, 'active');
        }

        KTEventHandler.trigger(the.element, 'kt.drawer.shown', the);
    }

    var _update = function() {
        var width = _getWidth();
        var direction = _getOption('direction');

        var top = _getOption('top');
        var bottom = _getOption('bottom');
        var start = _getOption('start');
        var end = _getOption('end');

        // Reset state
        if ( KTUtil.hasClass(the.element, the.options.baseClass + '-on') === true && String(document.body.getAttribute('data-kt-drawer-' + the.name + '-')) === 'on' ) {
            the.shown = true;
        } else {
            the.shown = false;
        }       

        // Activate/deactivate
        if ( _getOption('activate') === true ) {
            KTUtil.addClass(the.element, the.options.baseClass);
            KTUtil.addClass(the.element, the.options.baseClass + '-' + direction);
            
            KTUtil.css(the.element, 'width', width, true);
            the.lastWidth = width;

            if (top) {
                KTUtil.css(the.element, 'top', top);
            }

            if (bottom) {
                KTUtil.css(the.element, 'bottom', bottom);
            }

            if (start) {
                if (KTUtil.isRTL()) {
                    KTUtil.css(the.element, 'right', start);
                } else {
                    KTUtil.css(the.element, 'left', start);
                }
            }

            if (end) {
                if (KTUtil.isRTL()) {
                    KTUtil.css(the.element, 'left', end);
                } else {
                    KTUtil.css(the.element, 'right', end);
                }
            }
        } else {
            KTUtil.removeClass(the.element, the.options.baseClass);
            KTUtil.removeClass(the.element, the.options.baseClass + '-' + direction);

            KTUtil.css(the.element, 'width', '');

            if (top) {
                KTUtil.css(the.element, 'top', '');
            }

            if (bottom) {
                KTUtil.css(the.element, 'bottom', '');
            }

            if (start) {
                if (KTUtil.isRTL()) {
                    KTUtil.css(the.element, 'right', '');
                } else {
                    KTUtil.css(the.element, 'left', '');
                }
            }

            if (end) {
                if (KTUtil.isRTL()) {
                    KTUtil.css(the.element, 'left', '');
                } else {
                    KTUtil.css(the.element, 'right', '');
                }
            }

            _hide();
        }
    }

    var _createOverlay = function() {
        if ( _getOption('overlay') === true ) {
            the.overlayElement = document.createElement('DIV');

            KTUtil.css(the.overlayElement, 'z-index', KTUtil.css(the.element, 'z-index') - 1); // update

            document.body.append(the.overlayElement);

            KTUtil.addClass(the.overlayElement, _getOption('overlay-class'));

            KTUtil.addEvent(the.overlayElement, 'click', function(e) {
                e.preventDefault();

                if ( _getOption('permanent') !== true ) {
                    _hide();
                }
            });
        }
    }

    var _deleteOverlay = function() {
        if ( the.overlayElement !== null ) {
            KTUtil.remove(the.overlayElement);
        }
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-drawer-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-drawer-' + name);
            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _getWidth = function() {
        var width = _getOption('width');

        if ( width === 'auto') {
            width = KTUtil.css(the.element, 'width');
        }

        return width;
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('drawer');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.toggle = function() {
        return _toggle();
    }

    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.isShown = function() {
        return the.shown;
    }

    the.update = function() {
        _update();
    }

    the.goElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTDrawer.getInstance = function(element) {
    if (element !== null && KTUtil.data(element).has('drawer')) {
        return KTUtil.data(element).get('drawer');
    } else {
        return null;
    }
}

// Hide all drawers and skip one if provided
KTDrawer.hideAll = function(skip = null, selector = '[data-kt-drawer="true"]') {
    var items = document.querySelectorAll(selector);

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var drawer = KTDrawer.getInstance(item);

            if (!drawer) {
                continue;
            }

            if ( skip ) {
                if ( item !== skip ) {
                    drawer.hide();
                }
            } else {
                drawer.hide();
            }
        }
    }
}

// Update all drawers
KTDrawer.updateAll = function(selector = '[data-kt-drawer="true"]') {
    var items = document.querySelectorAll(selector);

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var drawer = KTDrawer.getInstance(items[i]);

            if (drawer) {
                drawer.update();
            }
        }
    }
}

// Create instances
KTDrawer.createInstances = function(selector = '[data-kt-drawer="true"]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTDrawer(elements[i]);
        }
    }
}

// Toggle instances
KTDrawer.handleShow = function() {
    // External drawer toggle handler
    KTUtil.on(document.body,  '[data-kt-drawer-show="true"][data-kt-drawer-target]', 'click', function(e) {
        e.preventDefault();
        
        var element = document.querySelector(this.getAttribute('data-kt-drawer-target'));

        if (element) {
            KTDrawer.getInstance(element).show();
        } 
    });
}

// Dismiss instances
KTDrawer.handleDismiss = function() {
    // External drawer toggle handler
    KTUtil.on(document.body,  '[data-kt-drawer-dismiss="true"]', 'click', function(e) {
        var element = this.closest('[data-kt-drawer="true"]');

        if (element) {
            var drawer = KTDrawer.getInstance(element);
            if (drawer.isShown()) {
                drawer.hide();
            }
        } 
    });
}

// Handle resize
KTDrawer.handleResize = function() {
    // Window resize Handling
    window.addEventListener('resize', function() {
        var timer;

        KTUtil.throttle(timer, function() {
            // Locate and update drawer instances on window resize
            var elements = document.querySelectorAll('[data-kt-drawer="true"]');

            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var drawer = KTDrawer.getInstance(elements[i]);
                    if (drawer) {
                        drawer.update();
                    }
                }
            }
        }, 200);
    });
}

// Global initialization
KTDrawer.init = function() {
    KTDrawer.createInstances();

    if (KTDrawerHandlersInitialized === false) {
        KTDrawer.handleResize();
        KTDrawer.handleShow();
        KTDrawer.handleDismiss();

        KTDrawerHandlersInitialized = true;
    }
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTDrawer;
}
"use strict";

// Class definition
var KTEventHandler = function() {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var _handlers = {};

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////
    var _triggerEvent = function(element, name, target) {
        var returnValue = true;
        var eventValue;

        if ( KTUtil.data(element).has(name) === true ) {
            var handlerIds = KTUtil.data(element).get(name);
            var handlerId;

            for (var i = 0; i < handlerIds.length; i++) {
                handlerId = handlerIds[i];
                
                if ( _handlers[name] && _handlers[name][handlerId] ) {
                    var handler = _handlers[name][handlerId];
                    var value;
    
                    if ( handler.name === name ) {
                        if ( handler.one == true ) {
                            if ( handler.fired == false ) {
                                _handlers[name][handlerId].fired = true;
    
                                eventValue = handler.callback.call(this, target);
                            }
                        } else {
                            eventValue = handler.callback.call(this, target);
                        }

                        if ( eventValue === false ) {
                            returnValue = false;
                        }
                    }
                }
            }            
        }

        return returnValue;
    }

    var _addEvent = function(element, name, callback, one) {
        var handlerId = KTUtil.getUniqueId('event');
        var handlerIds = KTUtil.data(element).get(name);

        if ( !handlerIds ) {
            handlerIds = [];
        } 

        handlerIds.push(handlerId);

        KTUtil.data(element).set(name, handlerIds);

        if ( !_handlers[name] ) {
            _handlers[name] = {};
        }

        _handlers[name][handlerId] = {
            name: name,
            callback: callback,
            one: one,
            fired: false
        };

        return handlerId;
    }

    var _removeEvent = function(element, name, handlerId) {
        var handlerIds = KTUtil.data(element).get(name);
        var index = handlerIds && handlerIds.indexOf(handlerId);
        
        if (index !== -1) {
            handlerIds.splice(index, 1);
            KTUtil.data(element).set(name, handlerIds);
        }

        if (_handlers[name] && _handlers[name][handlerId]) {
            delete _handlers[name][handlerId];
        }
    }

    ////////////////////////////
    // ** Public Methods  ** //
    ////////////////////////////
    return {
        trigger: function(element, name, target) {
            return _triggerEvent(element, name, target);
        },

        on: function(element, name, handler) {
            return _addEvent(element, name, handler);
        },

        one: function(element, name, handler) {
            return _addEvent(element, name, handler, true);
        },

        off: function(element, name, handlerId) {
            return _removeEvent(element, name, handlerId);
        },

        debug: function() {
            for (var b in _handlers) {
                if ( _handlers.hasOwnProperty(b) ) console.log(b);
            }
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTEventHandler;
}

"use strict";

// Class definition
var KTFeedback = function(options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    // Default options
    var defaultOptions = {
        'width' : 100,
        'placement' : 'top-center',
        'content' : '',
        'type': 'popup'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        _init();
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('feedback');
        the.element;
        the.shown = false;

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('feedback', the);
    }

    var _handlers = function() {
        KTUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _show = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.feedback.show', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _showPopup();
        }

        KTEventHandler.trigger(the.element, 'kt.feedback.shown', the);

        return the;
    }

    var _hide = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.feedback.hide', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _hidePopup();
        }

        the.shown = false;

        KTEventHandler.trigger(the.element, 'kt.feedback.hidden', the);

        return the;
    }

    var _showPopup = function() {
        the.element = document.createElement("DIV");

        KTUtil.addClass(the.element, 'feedback feedback-popup');
        KTUtil.setHTML(the.element, the.options.content);

        if (the.options.placement == 'top-center') {
            _setPopupTopCenterPosition();
        }

        document.body.appendChild(the.element);

        KTUtil.addClass(the.element, 'feedback-shown');

        the.shown = true;
    }

    var _setPopupTopCenterPosition = function() {
        var width = KTUtil.getResponsiveValue(the.options.width);
        var height = KTUtil.css(the.element, 'height');

        KTUtil.addClass(the.element, 'feedback-top-center');

        KTUtil.css(the.element, 'width', width);
        KTUtil.css(the.element, 'left', '50%');
        KTUtil.css(the.element, 'top', '-' + height);
    }

    var _hidePopup = function() {
        the.element.remove();
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('feedback');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.isShown = function() {
        return the.shown;
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTFeedback;
}

"use strict";

// Class definition
var KTImageInput = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('image-input') === true ) {
            the = KTUtil.data(element).get('image-input');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('image-input');

        // Elements
        the.element = element;
        the.inputElement = KTUtil.find(element, 'input[type="file"]');
        the.wrapperElement = KTUtil.find(element, '.image-input-wrapper');
        the.cancelElement = KTUtil.find(element, '[data-kt-image-input-action="cancel"]');
        the.removeElement = KTUtil.find(element, '[data-kt-image-input-action="remove"]');
        the.hiddenElement = KTUtil.find(element, 'input[type="hidden"]');
        the.src = KTUtil.css(the.wrapperElement, 'backgroundImage');

        // Set initialized
        the.element.setAttribute('data-kt-image-input', 'true');

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('image-input', the);
    }

    // Init Event Handlers
    var _handlers = function() {
        KTUtil.addEvent(the.inputElement, 'change', _change);
        KTUtil.addEvent(the.cancelElement, 'click', _cancel);
        KTUtil.addEvent(the.removeElement, 'click', _remove);
    }

    // Event Handlers
    var _change = function(e) {
        e.preventDefault();

        if ( the.inputElement !== null && the.inputElement.files && the.inputElement.files[0] ) {
            // Fire change event
            if ( KTEventHandler.trigger(the.element, 'kt.imageinput.change', the) === false ) {
                return;
            }

            var reader = new FileReader();

            reader.onload = function(e) {
                KTUtil.css(the.wrapperElement, 'background-image', 'url('+ e.target.result +')');
            }

            reader.readAsDataURL(the.inputElement.files[0]);

            the.element.classList.add('image-input-changed');
            the.element.classList.remove('image-input-empty');

            // Fire removed event
            KTEventHandler.trigger(the.element, 'kt.imageinput.changed', the);
        }
    }

    var _cancel = function(e) {
        e.preventDefault();

        // Fire cancel event
        if ( KTEventHandler.trigger(the.element, 'kt.imageinput.cancel', the) === false ) {
            return;
        }

        the.element.classList.remove('image-input-changed');
        the.element.classList.remove('image-input-empty');

        if (the.src === 'none') {   
            KTUtil.css(the.wrapperElement, 'background-image', '');
            the.element.classList.add('image-input-empty');
        } else {
            KTUtil.css(the.wrapperElement, 'background-image', the.src);
        }
        
        the.inputElement.value = "";

        if ( the.hiddenElement !== null ) {
            the.hiddenElement.value = "0";
        }

        // Fire canceled event
        KTEventHandler.trigger(the.element, 'kt.imageinput.canceled', the);
    }

    var _remove = function(e) {
        e.preventDefault();

        // Fire remove event
        if ( KTEventHandler.trigger(the.element, 'kt.imageinput.remove', the) === false ) {
            return;
        }

        the.element.classList.remove('image-input-changed');
        the.element.classList.add('image-input-empty');

        KTUtil.css(the.wrapperElement, 'background-image', "none");
        the.inputElement.value = "";

        if ( the.hiddenElement !== null ) {
            the.hiddenElement.value = "1";
        }

        // Fire removed event
        KTEventHandler.trigger(the.element, 'kt.imageinput.removed', the);
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('image-input');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.getInputElement = function() {
        return the.inputElement;
    }

    the.getElement = function() {
        return the.element;
    }
    
    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTImageInput.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('image-input') ) {
        return KTUtil.data(element).get('image-input');
    } else {
        return null;
    }
}

// Create instances
KTImageInput.createInstances = function(selector = '[data-kt-image-input]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTImageInput(elements[i]);
        }
    }
}

// Global initialization
KTImageInput.init = function() {
    KTImageInput.createInstances();
};

// Webpack Support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTImageInput;
}

"use strict";

var KTMenuHandlersInitialized = false;

// Class definition
var KTMenu = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        dropdown: {
            hoverTimeout: 200,
            zindex: 107
        },

        accordion: {
            slideSpeed: 250,
            expand: false
        }
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('menu') === true ) {
            the = KTUtil.data(element).get('menu');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('menu');
        the.element = element;
        the.triggerElement;
        the.disabled = false;

        // Set initialized
        the.element.setAttribute('data-kt-menu', 'true');

        _setTriggerElement();
        _update();

        KTUtil.data(the.element).set('menu', the);
    }

    var _destroy = function() {  // todo

    }

    // Event Handlers
    // Toggle handler
    var _click = function(element, e) {
        e.preventDefault();

        if (the.disabled === true) {
            return;
        }

        var item = _getItemElement(element);

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'click' ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'toggle') === false ) {
            _show(item);
        } else {
            _toggle(item);
        }
    }

    // Link handler
    var _link = function(element, e) {
        if (the.disabled === true) {
            return;
        }
        
        if ( KTEventHandler.trigger(the.element, 'kt.menu.link.click', element) === false )  {
            return;
        }

        // Dismiss all shown dropdowns
        KTMenu.hideDropdowns();

        KTEventHandler.trigger(the.element, 'kt.menu.link.clicked', element);
    }

    // Dismiss handler
    var _dismiss = function(element, e) {
        var item = _getItemElement(element);
        var items = _getItemChildElements(item);

        if ( item !== null && _getItemSubType(item) === 'dropdown') {
            _hide(item); // hide items dropdown
            // Hide all child elements as well
            
            if ( items.length > 0 ) {
                for (var i = 0, len = items.length; i < len; i++) {
                    if ( items[i] !== null &&  _getItemSubType(items[i]) === 'dropdown') {
                        _hide(tems[i]);
                    }
                }
            }
        }
    }

    // Mouseover handle
    var _mouseover = function(element, e) {
        var item = _getItemElement(element);

        if (the.disabled === true) {
            return;
        }

        if ( item === null ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'hover' ) {
            return;
        }

        if ( KTUtil.data(item).get('hover') === '1' ) {
            clearTimeout(KTUtil.data(item).get('timeout'));
            KTUtil.data(item).remove('hover');
            KTUtil.data(item).remove('timeout');
        }

        _show(item);
    }

    // Mouseout handle
    var _mouseout = function(element, e) {
        var item = _getItemElement(element);

        if (the.disabled === true) {
            return;
        }

        if ( item === null ) {
            return;
        }

        if ( _getOptionFromElementAttribute(item, 'trigger') !== 'hover' ) {
            return;
        }

        var timeout = setTimeout(function() {
            if ( KTUtil.data(item).get('hover') === '1' ) {
                _hide(item);
            }
        }, the.options.dropdown.hoverTimeout);

        KTUtil.data(item).set('hover', '1');
        KTUtil.data(item).set('timeout', timeout);
    }

    // Toggle item sub
    var _toggle = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === true ) {
            _hide(item);
        } else {
            _show(item);
        }
    }

    // Show item sub
    var _show = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === true ) {
            return;
        }

        if ( _getItemSubType(item) === 'dropdown' ) {
            _showDropdown(item); // // show current dropdown
        } else if ( _getItemSubType(item) === 'accordion' ) {
            _showAccordion(item);
        }

        // Remember last submenu type
        KTUtil.data(item).set('type', _getItemSubType(item));  // updated
    }

    // Hide item sub
    var _hide = function(item) {
        if ( !item ) {
            item = the.triggerElement;
        }

        if ( _isItemSubShown(item) === false ) {
            return;
        }
        
        if ( _getItemSubType(item) === 'dropdown' ) {
            _hideDropdown(item);
        } else if ( _getItemSubType(item) === 'accordion' ) {
            _hideAccordion(item);
        }
    }

    // Reset item state classes if item sub type changed
    var _reset = function(item) {        
        if ( _hasItemSub(item) === false ) {
            return;
        }

        var sub = _getItemSubElement(item);

        // Reset sub state if sub type is changed during the window resize
        if ( KTUtil.data(item).has('type') && KTUtil.data(item).get('type') !== _getItemSubType(item) ) {  // updated
            KTUtil.removeClass(item, 'hover'); 
            KTUtil.removeClass(item, 'show'); 
            KTUtil.removeClass(sub, 'show'); 
        }  // updated
    }

    // Update all item state classes if item sub type changed
    var _update = function() {
        var items = the.element.querySelectorAll('.menu-item[data-kt-menu-trigger]');

        if ( items && items.length > 0 ) {
            for (var i = 0, len = items.length; i < len; i++) {
                _reset(items[i]);
            }
        }
    }

    // Set external trigger element
    var _setTriggerElement = function() {
        var target = document.querySelector('[data-kt-menu-target="#' + the.element.getAttribute('id')  + '"]');

        if ( target !== null ) {
            the.triggerElement = target;
        } else if ( the.element.closest('[data-kt-menu-trigger]') ) {
            the.triggerElement = the.element.closest('[data-kt-menu-trigger]');
        } else if ( the.element.parentNode && KTUtil.child(the.element.parentNode, '[data-kt-menu-trigger]')) {
            the.triggerElement = KTUtil.child(the.element.parentNode, '[data-kt-menu-trigger]');
        }

        if ( the.triggerElement ) {
            KTUtil.data(the.triggerElement).set('menu', the);
        }
    }

    // Test if menu has external trigger element
    var _isTriggerElement = function(item) {
        return ( the.triggerElement === item ) ? true : false;
    }

    // Test if item's sub is shown
    var _isItemSubShown = function(item) {
        var sub = _getItemSubElement(item);

        if ( sub !== null ) {
            if ( _getItemSubType(item) === 'dropdown' ) {
                if ( KTUtil.hasClass(sub, 'show') === true && sub.hasAttribute('data-popper-placement') === true ) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return KTUtil.hasClass(item, 'show');
            }
        } else {
            return false;
        }
    }

    // Test if item dropdown is permanent
    var _isItemDropdownPermanent = function(item) {
        return _getOptionFromElementAttribute(item, 'permanent') === true ? true : false;
    }

    // Test if item's parent is shown
    var _isItemParentShown = function(item) {
        return KTUtil.parents(item, '.menu-item.show').length > 0;
    }

    // Test of it is item sub element
    var _isItemSubElement = function(item) {
        return KTUtil.hasClass(item, 'menu-sub');
    }

    // Test if item has sub
    var _hasItemSub = function(item) {
        return (KTUtil.hasClass(item, 'menu-item') && item.hasAttribute('data-kt-menu-trigger'));
    }

    // Get link element
    var _getItemLinkElement = function(item) {
        return KTUtil.child(item, '.menu-link');
    }

    // Get toggle element
    var _getItemToggleElement = function(item) {
        if ( the.triggerElement ) {
            return the.triggerElement;
        } else {
            return _getItemLinkElement(item);
        }
    }

    // Get item sub element
    var _getItemSubElement = function(item) {
        if ( _isTriggerElement(item) === true ) {
            return the.element;
        } if ( item.classList.contains('menu-sub') === true ) {
            return item;
        } else if ( KTUtil.data(item).has('sub') ) {
            return KTUtil.data(item).get('sub');
        } else {
            return KTUtil.child(item, '.menu-sub');
        }
    }

    // Get item sub type
    var _getItemSubType = function(element) {
        var sub = _getItemSubElement(element);

        if ( sub && parseInt(KTUtil.css(sub, 'z-index')) > 0 ) {
            return "dropdown";
        } else {
            return "accordion";
        }
    }

    // Get item element
    var _getItemElement = function(element) {
        var item, sub;

        // Element is the external trigger element
        if (_isTriggerElement(element) ) {
            return element;
        }   

        // Element has item toggler attribute
        if ( element.hasAttribute('data-kt-menu-trigger') ) {
            return element;
        }

        // Element has item DOM reference in it's data storage
        if ( KTUtil.data(element).has('item') ) {
            return KTUtil.data(element).get('item');
        }

        // Item is parent of element
        if ( (item = element.closest('.menu-item[data-kt-menu-trigger]')) ) {
            return item;
        }

        // Element's parent has item DOM reference in it's data storage
        if ( (sub = element.closest('.menu-sub')) ) {
            if ( KTUtil.data(sub).has('item') === true ) {
                return KTUtil.data(sub).get('item')
            } 
        }
    }

    // Get item parent element
    var _getItemParentElement = function(item) {  
        var sub = item.closest('.menu-sub');
        var parentItem;

        if ( sub && KTUtil.data(sub).has('item') ) {
            return KTUtil.data(sub).get('item');
        }

        if ( sub && (parentItem = sub.closest('.menu-item[data-kt-menu-trigger]')) ) {
            return parentItem;
        }

        return null;
    }

    // Get item parent elements
    var _getItemParentElements = function(item) {
        var parents = [];
        var parent;
        var i = 0;

        do {
            parent = _getItemParentElement(item);
            
            if ( parent ) {
                parents.push(parent);
                item = parent;
            }           

            i++;
        } while (parent !== null && i < 20);

        if ( the.triggerElement ) {
            parents.unshift(the.triggerElement);
        }

        return parents;
    }

    // Get item child element
    var _getItemChildElement = function(item) {
        var selector = item;
        var element;

        if ( KTUtil.data(item).get('sub') ) {
            selector = KTUtil.data(item).get('sub');
        }

        if ( selector !== null ) {
            //element = selector.querySelector('.show.menu-item[data-kt-menu-trigger]');
            element = selector.querySelector('.menu-item[data-kt-menu-trigger]');

            if ( element ) {
                return element;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }   
    
    // Get item child elements
    var _getItemChildElements = function(item) {
        var children = [];
        var child;
        var i = 0;

        do {
            child = _getItemChildElement(item);
            
            if ( child ) {
                children.push(child);
                item = child;
            }           

            i++;
        } while (child !== null && i < 20);

        return children;
    }

    // Show item dropdown
    var _showDropdown = function(item) {
        // Handle dropdown show event
        if ( KTEventHandler.trigger(the.element, 'kt.menu.dropdown.show', item) === false )  {
            return;
        }

        // Hide all currently shown dropdowns except current one
        KTMenu.hideDropdowns(item); 

        var toggle = _isTriggerElement(item) ? item : _getItemLinkElement(item);
        var sub = _getItemSubElement(item);

        var width = _getOptionFromElementAttribute(item, 'width');
        var height = _getOptionFromElementAttribute(item, 'height');

        var zindex = the.options.dropdown.zindex; // update
        var parentZindex = KTUtil.getHighestZindex(item); // update

        // Apply a new z-index if dropdown's toggle element or it's parent has greater z-index // update
        if ( parentZindex !== null && parentZindex >= zindex ) {
            zindex = parentZindex + 1;
        }

        if ( zindex > 0 ) {
            KTUtil.css(sub, 'z-index', zindex);
        }

        if ( width !== null ) {
            KTUtil.css(sub, 'width', width);
        }

        if ( height !== null ) {
            KTUtil.css(sub, 'height', height);
        }

        KTUtil.css(sub, 'display', '');
        KTUtil.css(sub, 'overflow', '');

        // Init popper(new)
        _initDropdownPopper(item, sub); 

        KTUtil.addClass(item, 'show');
        KTUtil.addClass(item, 'menu-dropdown');
        KTUtil.addClass(sub, 'show');

        // Append the sub the the root of the menu
        if ( _getOptionFromElementAttribute(item, 'overflow') === true ) {
            document.body.appendChild(sub);
            KTUtil.data(item).set('sub', sub);
            KTUtil.data(sub).set('item', item);
            KTUtil.data(sub).set('menu', the);
        } else {
            KTUtil.data(sub).set('item', item);
        }

        // Handle dropdown shown event
        KTEventHandler.trigger(the.element, 'kt.menu.dropdown.shown', item);
    }

    // Hide item dropdown
    var _hideDropdown = function(item) {
        // Handle dropdown hide event
        if ( KTEventHandler.trigger(the.element, 'kt.menu.dropdown.hide', item) === false )  {
            return;
        }

        var sub = _getItemSubElement(item);

        KTUtil.css(sub, 'z-index', '');
        KTUtil.css(sub, 'width', '');
        KTUtil.css(sub, 'height', '');

        KTUtil.removeClass(item, 'show');
        KTUtil.removeClass(item, 'menu-dropdown');
        KTUtil.removeClass(sub, 'show');

        // Append the sub back to it's parent
        if ( _getOptionFromElementAttribute(item, 'overflow') === true ) {
            if (item.classList.contains('menu-item')) {
                item.appendChild(sub);
            } else {
                KTUtil.insertAfter(the.element, item);
            }
            
            KTUtil.data(item).remove('sub');
            KTUtil.data(sub).remove('item');
            KTUtil.data(sub).remove('menu');
        } 

        // Destroy popper(new)
        _destroyDropdownPopper(item);
        
        // Handle dropdown hidden event 
        KTEventHandler.trigger(the.element, 'kt.menu.dropdown.hidden', item);
    }

    // Init dropdown popper(new)
    var _initDropdownPopper = function(item, sub) {
        // Setup popper instance
        var reference;
        var attach = _getOptionFromElementAttribute(item, 'attach');

        if ( attach ) {
            if ( attach === 'parent') {
                reference = item.parentNode;
            } else {
                reference = document.querySelector(attach);
            }
        } else {
            reference = item;
        }

        var popper = Popper.createPopper(reference, sub, _getDropdownPopperConfig(item)); 
        KTUtil.data(item).set('popper', popper);
    }

    // Destroy dropdown popper(new)
    var _destroyDropdownPopper = function(item) {
        if ( KTUtil.data(item).has('popper') === true ) {
            KTUtil.data(item).get('popper').destroy();
            KTUtil.data(item).remove('popper');
        }
    }

    // Prepare popper config for dropdown(see: https://popper.js.org/docs/v2/)
    var _getDropdownPopperConfig = function(item) {
        // Placement
        var placement = _getOptionFromElementAttribute(item, 'placement');
        if (!placement) {
            placement = 'right';
        }

        // Offset
        var offsetValue = _getOptionFromElementAttribute(item, 'offset');
        var offset = offsetValue ? offsetValue.split(",") : [];
        
        if (offset.length === 2) {
            offset[0] = parseInt(offset[0]);
            offset[1] = parseInt(offset[1]);
        }

        // Strategy
        var strategy = _getOptionFromElementAttribute(item, 'overflow') === true ? 'absolute' : 'fixed';

        var altAxis = _getOptionFromElementAttribute(item, 'flip') !== false ? true : false;

        var popperConfig = {
            placement: placement,
            strategy: strategy,
            modifiers: [{
                name: 'offset',
                options: {
                    offset: offset
                }
            }, {
                name: 'preventOverflow',
                options: {
                    altAxis: altAxis
                }
            }, {
                name: 'flip', 
                options: {
                    flipVariations: false
                }
            }]
        };

        return popperConfig;
    }

    // Show item accordion
    var _showAccordion = function(item) {
        if ( KTEventHandler.trigger(the.element, 'kt.menu.accordion.show', item) === false )  {
            return;
        }

        var sub = _getItemSubElement(item);
        var expand = the.options.accordion.expand;
        
        if (_getOptionFromElementAttribute(item, 'expand') === true) {
            expand = true;
        } else if (_getOptionFromElementAttribute(item, 'expand') === false) {
            expand = false;
        } else if (_getOptionFromElementAttribute(the.element, 'expand') === true) {
            expand = true;
        }

        if ( expand === false ) {
            _hideAccordions(item);
        }

        if ( KTUtil.data(item).has('popper') === true ) {
            _hideDropdown(item);
        }

        KTUtil.addClass(item, 'hover');

        KTUtil.addClass(item, 'showing');

        KTUtil.slideDown(sub, the.options.accordion.slideSpeed, function() {
            KTUtil.removeClass(item, 'showing');
            KTUtil.addClass(item, 'show');
            KTUtil.addClass(sub, 'show');

            KTEventHandler.trigger(the.element, 'kt.menu.accordion.shown', item);
        });        
    }

    // Hide item accordion
    var _hideAccordion = function(item) {
        if ( KTEventHandler.trigger(the.element, 'kt.menu.accordion.hide', item) === false )  {
            return;
        }
        
        var sub = _getItemSubElement(item);

        KTUtil.addClass(item, 'hiding');

        KTUtil.slideUp(sub, the.options.accordion.slideSpeed, function() {
            KTUtil.removeClass(item, 'hiding');
            KTUtil.removeClass(item, 'show');
            KTUtil.removeClass(sub, 'show');

            KTUtil.removeClass(item, 'hover'); // update

            KTEventHandler.trigger(the.element, 'kt.menu.accordion.hidden', item);
        });
    }

    var _setActiveLink = function(link) {
        var item = _getItemElement(link);
        var parentItems = _getItemParentElements(item);
        var parentTabPane = link.closest('.tab-pane');

        var activeLinks = [].slice.call(the.element.querySelectorAll('.menu-link.active'));
        var activeParentItems = [].slice.call(the.element.querySelectorAll('.menu-item.here, .menu-item.show'));
        
        if (_getItemSubType(item) === "accordion") {
            _showAccordion(item);
        } else {
            item.classList.add("here");
        }

        if ( parentItems && parentItems.length > 0 ) {
            for (var i = 0, len = parentItems.length; i < len; i++) {
                var parentItem = parentItems[i];

                if (_getItemSubType(parentItem) === "accordion") {
                    _showAccordion(parentItem);
                } else {
                    parentItem.classList.add("here");
                }
            }
        }       
        
        activeLinks.map(function (activeLink) {
            activeLink.classList.remove("active");
        });

        activeParentItems.map(function (activeParentItem) {
            if (activeParentItem.contains(item) === false) {
                activeParentItem.classList.remove("here");
                activeParentItem.classList.remove("show");
            }
        });

        // Handle tab
        if (parentTabPane && bootstrap.Tab) {
            var tabEl = the.element.querySelector('[data-bs-target="#' + parentTabPane.getAttribute("id") + '"]');
            var tab = new bootstrap.Tab(tabEl);

            if (tab) {
                tab.show();
            }
        }

        link.classList.add("active");
    }

    var _getLinkByAttribute = function(value, name = "href") {
        var link = the.element.querySelector('a[' + name + '="' + value + '"]');

        if (link) {
            return link;
        } else {
            null;
        }
    }

    // Hide all shown accordions of item
    var _hideAccordions = function(item) {
        var itemsToHide = KTUtil.findAll(the.element, '.show[data-kt-menu-trigger]');
        var itemToHide;

        if (itemsToHide && itemsToHide.length > 0) {
            for (var i = 0, len = itemsToHide.length; i < len; i++) {
                itemToHide = itemsToHide[i];

                if ( _getItemSubType(itemToHide) === 'accordion' && itemToHide !== item && item.contains(itemToHide) === false && itemToHide.contains(item) === false ) {
                    _hideAccordion(itemToHide);
                }
            }
        }
    }

    // Get item option(through html attributes)
    var _getOptionFromElementAttribute = function(item, name) {
        var attr;
        var value = null;

        if ( item && item.hasAttribute('data-kt-menu-' + name) ) {
            attr = item.getAttribute('data-kt-menu-' + name);
            value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }
        }

        return value;
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('menu');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Event Handlers
    the.click = function(element, e) {
        return _click(element, e);
    }

    the.link = function(element, e) {
        return _link(element, e);
    }

    the.dismiss = function(element, e) {
        return _dismiss(element, e);
    }

    the.mouseover = function(element, e) {
        return _mouseover(element, e);
    }

    the.mouseout = function(element, e) {
        return _mouseout(element, e);
    }

    // General Methods
    the.getItemTriggerType = function(item) {
        return _getOptionFromElementAttribute(item, 'trigger');
    }

    the.getItemSubType = function(element) {
       return _getItemSubType(element);
    }

    the.show = function(item) {
        return _show(item);
    }

    the.hide = function(item) {
        return _hide(item);
    }

    the.toggle = function(item) {
        return _toggle(item);
    }

    the.reset = function(item) {
        return _reset(item);
    }

    the.update = function() {
        return _update();
    }

    the.getElement = function() {
        return the.element;
    }

    the.setActiveLink = function(link) {
        return _setActiveLink(link);
    }   

    the.getLinkByAttribute = function(value, name = "href") {
        return _getLinkByAttribute(value, name);
    }

    the.getItemLinkElement = function(item) {
        return _getItemLinkElement(item);
    }

    the.getItemToggleElement = function(item) {
        return _getItemToggleElement(item);
    }

    the.getItemSubElement = function(item) {
        return _getItemSubElement(item);
    }

    the.getItemParentElements = function(item) {
        return _getItemParentElements(item);
    }

    the.isItemSubShown = function(item) {
        return _isItemSubShown(item);
    }

    the.isItemParentShown = function(item) {
        return _isItemParentShown(item);
    }

    the.getTriggerElement = function() {
        return the.triggerElement;
    }

    the.isItemDropdownPermanent = function(item) {
        return _isItemDropdownPermanent(item);
    }

    the.destroy = function() {
        return _destroy();
    }

    the.disable = function() {
        the.disabled = true;
    }

    the.enable = function() {
        the.disabled = false;
    }

    // Accordion Mode Methods
    the.hideAccordions = function(item) {
        return _hideAccordions(item);
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }
};

// Get KTMenu instance by element
KTMenu.getInstance = function(element) {
    var menu;
    var item;

    if (!element) {
        return null;
    }

    // Element has menu DOM reference in it's DATA storage
    if ( KTUtil.data(element).has('menu') ) {
        return KTUtil.data(element).get('menu');
    }

    // Element has .menu parent 
    if ( menu = element.closest('.menu') ) {
        if ( KTUtil.data(menu).has('menu') ) {
            return KTUtil.data(menu).get('menu');
        }
    }
    
    // Element has a parent with DOM reference to .menu in it's DATA storage
    if ( KTUtil.hasClass(element, 'menu-link') ) {
        var sub = element.closest('.menu-sub');

        if ( KTUtil.data(sub).has('menu') ) {
            return KTUtil.data(sub).get('menu');
        }
    } 

    return null;
}

// Hide all dropdowns and skip one if provided
KTMenu.hideDropdowns = function(skip) {
    var items = document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var menu = KTMenu.getInstance(item);

            if ( menu && menu.getItemSubType(item) === 'dropdown' ) {
                if ( skip ) {
                    if ( menu.getItemSubElement(item).contains(skip) === false && item.contains(skip) === false &&  item !== skip ) {
                        menu.hide(item);
                    }
                } else {
                    menu.hide(item);
                }
            }
        }
    }
}

// Update all dropdowns popover instances
KTMenu.updateDropdowns = function() {
    var items = document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]');

    if (items && items.length > 0) {
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];

            if ( KTUtil.data(item).has('popper') ) {
                KTUtil.data(item).get('popper').forceUpdate();
            }
        }
    }
}

// Global handlers
KTMenu.initHandlers = function() {
    // Dropdown handler
    document.addEventListener("click", function(e) {
        var items = document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]:not([data-kt-menu-static="true"])');
        var menu;
        var item;
        var sub;
        var menuObj;

        if ( items && items.length > 0 ) {
            for ( var i = 0, len = items.length; i < len; i++ ) {
                item = items[i];
                menuObj = KTMenu.getInstance(item);

                if (menuObj && menuObj.getItemSubType(item) === 'dropdown') {
                    menu = menuObj.getElement();
                    sub = menuObj.getItemSubElement(item);

                    if ( item === e.target || item.contains(e.target) ) {
                        continue;
                    }
                    
                    if ( sub === e.target || sub.contains(e.target) ) {
                        continue;
                    }
                        
                    menuObj.hide(item);
                }
            }
        }
    });

    // Sub toggle handler(updated)
    KTUtil.on(document.body,  '.menu-item[data-kt-menu-trigger] > .menu-link, [data-kt-menu-trigger]:not(.menu-item):not([data-kt-menu-trigger="auto"])', 'click', function(e) {
        var menu = KTMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.click(this, e);
        }
    });

    // Link handler
    KTUtil.on(document.body,  '.menu-item:not([data-kt-menu-trigger]) > .menu-link', 'click', function(e) {
        var menu = KTMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.link(this, e);
        }
    });

    // Dismiss handler
    KTUtil.on(document.body,  '[data-kt-menu-dismiss="true"]', 'click', function(e) {
        var menu = KTMenu.getInstance(this);

        if ( menu !== null ) {
            return menu.dismiss(this, e);
        }
    });

    // Mouseover handler
    KTUtil.on(document.body,  '[data-kt-menu-trigger], .menu-sub', 'mouseover', function(e) {
        var menu = KTMenu.getInstance(this);

        if ( menu !== null && menu.getItemSubType(this) === 'dropdown' ) {
            return menu.mouseover(this, e);
        }
    });

    // Mouseout handler
    KTUtil.on(document.body,  '[data-kt-menu-trigger], .menu-sub', 'mouseout', function(e) {
        var menu = KTMenu.getInstance(this);

        if ( menu !== null && menu.getItemSubType(this) === 'dropdown' ) {
            return menu.mouseout(this, e);
        }
    });

    // Resize handler
    window.addEventListener('resize', function() {
        var menu;
        var timer;

        KTUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.querySelectorAll('[data-kt-menu="true"]');

            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    menu = KTMenu.getInstance(elements[i]);
                    if (menu) {
                        menu.update();
                    }
                }
            }
        }, 200);
    });
}

// Render menus by url
KTMenu.updateByLinkAttribute = function(value, name = "href") {
    // Set menu link active state by attribute value
    var elements = document.querySelectorAll('[data-kt-menu="true"]');

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            var menu = KTMenu.getInstance(elements[i]);

            if (menu) {
                var link = menu.getLinkByAttribute(value, name);
                if (link) {
                    menu.setActiveLink(link);
                }
            }
        }
    }
}

// Global instances
KTMenu.createInstances = function(selector = '[data-kt-menu="true"]') {
    // Initialize menus
    var elements = document.querySelectorAll(selector);
    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTMenu(elements[i]);
        }
    }
}

// Global initialization
KTMenu.init = function() {
    KTMenu.createInstances();

    if (KTMenuHandlersInitialized === false) {
        KTMenu.initHandlers();

        KTMenuHandlersInitialized = true;
    }    
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTMenu;
}

"use strict";

// Class definition
var KTPasswordMeter = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default Options
    var defaultOptions = {
        minLength: 8,
        checkUppercase: true,        
        checkLowercase: true,
        checkDigit: true,
        checkChar: true,
        scoreHighlightClass: 'active'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    // Constructor
    var _construct = function() {
        if ( KTUtil.data(element).has('password-meter') === true ) {
            the = KTUtil.data(element).get('password-meter');
        } else {
            _init();
        }
    }

    // Initialize
    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.score = 0;
        the.checkSteps = 5;

        // Elements
        the.element = element;
        the.inputElement = the.element.querySelector('input[type]');
        the.visibilityElement = the.element.querySelector('[data-kt-password-meter-control="visibility"]');
        the.highlightElement = the.element.querySelector('[data-kt-password-meter-control="highlight"]'); 

        // Set initialized
        the.element.setAttribute('data-kt-password-meter', 'true');
        
        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('password-meter', the);
    }

    // Handlers
    var _handlers = function() {
        if (the.highlightElement) {
            the.inputElement.addEventListener('input', function() {
                _check();
            });
        }

        if (the.visibilityElement) {
            the.visibilityElement.addEventListener('click', function() {
                _visibility();
            });
        }
    }   

    // Event handlers
    var _check = function() {
        var score = 0;
        var checkScore = _getCheckScore();
        
        if (_checkLength() === true) {
            score = score + checkScore;
        }

        if (the.options.checkUppercase === true && _checkLowercase() === true) {
            score = score + checkScore;
        }

        if (the.options.checkLowercase === true && _checkUppercase() === true ) {
            score = score + checkScore;
        }

        if (the.options.checkDigit === true && _checkDigit() === true ) {
            score = score + checkScore;
        }

        if (the.options.checkChar === true && _checkChar() === true ) {
            score = score + checkScore;
        }

        the.score = score;

        _highlight();
    }

    var _checkLength = function() {
        return the.inputElement.value.length >= the.options.minLength;  // 20 score
    }

    var _checkLowercase = function() {
        return /[a-z]/.test(the.inputElement.value);  // 20 score
    }

    var _checkUppercase = function() {
        return /[A-Z]/.test(the.inputElement.value);  // 20 score
    }

    var _checkDigit = function() {
        return /[0-9]/.test(the.inputElement.value);  // 20 score
    }

    var _checkChar = function() {
        return /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(the.inputElement.value);  // 20 score
    }    

    var _getCheckScore = function() {
        var count = 1;
        
        if (the.options.checkUppercase === true) {
            count++;
        }

        if (the.options.checkLowercase === true) {
            count++;
        }

        if (the.options.checkDigit === true) {
            count++;
        }

        if (the.options.checkChar === true) {
            count++;
        }

        the.checkSteps = count;

        return 100 / the.checkSteps;
    }
    
    var _highlight = function() {
        var items = [].slice.call(the.highlightElement.querySelectorAll('div'));
        var total = items.length;
        var index = 0;
        var checkScore = _getCheckScore();
        var score = _getScore();

        items.map(function (item) {
            index++;

            if ( (checkScore * index * (the.checkSteps / total)) <= score ) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }            
        });
    }

    var _visibility = function() {
        var visibleIcon = the.visibilityElement.querySelector(':scope > i:not(.d-none)');
        var hiddenIcon = the.visibilityElement.querySelector(':scope > i.d-none');
        
        if (the.inputElement.getAttribute('type').toLowerCase() === 'password' ) {
            the.inputElement.setAttribute('type', 'text');
        }  else {
            the.inputElement.setAttribute('type', 'password');
        }        

        visibleIcon.classList.add('d-none');
        hiddenIcon.classList.remove('d-none');

        the.inputElement.focus();
    }

    var _reset = function() {
        the.score = 0;

        _highlight();
    }

    // Gets current password score
    var _getScore = function() {
       return the.score;
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('password-meter');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.check = function() {
        return _check();
    }

    the.getScore = function() {
        return _getScore();
    }

    the.reset = function() {
        return _reset();
    }

    the.destroy = function() {
        return _destroy();
    }
};

// Static methods
KTPasswordMeter.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('password-meter') ) {
        return KTUtil.data(element).get('password-meter');
    } else {
        return null;
    }
}

// Create instances
KTPasswordMeter.createInstances = function(selector = '[data-kt-password-meter]') {
    // Get instances
    var elements = document.body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            // Initialize instances
            new KTPasswordMeter(elements[i]);
        }
    }
}

// Global initialization
KTPasswordMeter.init = function() {
    KTPasswordMeter.createInstances();
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTPasswordMeter;
}
"use strict";

var KTScrollHandlersInitialized = false;

// Class definition
var KTScroll = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default options
    var defaultOptions = {
        saveState: true
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('scroll') ) {
            the = KTUtil.data(element).get('scroll');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);

        // Elements
        the.element = element;        
        the.id = the.element.getAttribute('id');

        // Set initialized
        the.element.setAttribute('data-kt-scroll', 'true');

        // Update
        _update();

        // Bind Instance
        KTUtil.data(the.element).set('scroll', the);
    }

    var _setupHeight = function() {
        var heightType = _getHeightType();
        var height = _getHeight();

        // Set height
        if ( height !== null && height.length > 0 ) {
            KTUtil.css(the.element, heightType, height);
        } else {
            KTUtil.css(the.element, heightType, '');
        }
    }

    var _setupState = function () {
        var namespace = _getStorageNamespace();

        if ( _getOption('save-state') === true && the.id ) {
            if ( localStorage.getItem(namespace + the.id + 'st') ) {
                var pos = parseInt(localStorage.getItem(namespace + the.id + 'st'));

                if ( pos > 0 ) {
                    the.element.scroll({
                        top: pos,
                        behavior: 'instant'
                    });
                }
            }
        }
    }

    var _getStorageNamespace = function(postfix) {
        return document.body.hasAttribute("data-kt-name") ? document.body.getAttribute("data-kt-name") + "_" : "";
    }

    var _setupScrollHandler = function() {
        if ( _getOption('save-state') === true && the.id ) {
            the.element.addEventListener('scroll', _scrollHandler);
        } else {
            the.element.removeEventListener('scroll', _scrollHandler);
        }
    }

    var _destroyScrollHandler = function() {
        the.element.removeEventListener('scroll', _scrollHandler);
    }

    var _resetHeight = function() {
        KTUtil.css(the.element, _getHeightType(), '');
    }

    var _scrollHandler = function () {
        var namespace = _getStorageNamespace();
        localStorage.setItem(namespace + the.id + 'st', the.element.scrollTop);
    }

    var _update = function() {
        // Activate/deactivate
        if ( _getOption('activate') === true || the.element.hasAttribute('data-kt-scroll-activate') === false ) {
            _setupHeight();
            _setupStretchHeight();
            _setupScrollHandler();
            _setupState();
        } else {
            _resetHeight()
            _destroyScrollHandler();
        }        
    }

    var _setupStretchHeight = function() {
        var stretch = _getOption('stretch');

        // Stretch
        if ( stretch !== null ) {
            var elements = document.querySelectorAll(stretch);

            if ( elements && elements.length == 2 ) {
                var element1 = elements[0];
                var element2 = elements[1];
                var diff = _getElementHeight(element2) - _getElementHeight(element1);

                if (diff > 0) {
                    var height = parseInt(KTUtil.css(the.element, _getHeightType())) + diff;

                    KTUtil.css(the.element, _getHeightType(), String(height) + 'px');
                }
            }
        }
    }

    var _getHeight = function() {
        var height = _getOption(_getHeightType());

        if ( height instanceof Function ) {
            return height.call();
        } else if ( height !== null && typeof height === 'string' && height.toLowerCase() === 'auto' ) {
            return _getAutoHeight();
        } else {
            return height;
        }
    }

    var _getAutoHeight = function() {
        var height = KTUtil.getViewPort().height;
        var dependencies = _getOption('dependencies');
        var wrappers = _getOption('wrappers');
        var offset = _getOption('offset');

        // Spacings
        height = height - _getElementSpacing(the.element); 

        // Height dependencies
        //console.log('Q:' + JSON.stringify(dependencies));

        if ( dependencies !== null ) {
            var elements = document.querySelectorAll(dependencies);

            if ( elements && elements.length > 0 ) {
                for ( var i = 0, len = elements.length; i < len; i++ ) {
                    if ( KTUtil.visible(elements[i]) === false ) {
                        continue;
                    }

                    height = height - _getElementHeight(elements[i]);
                }
            }
        }

        // Wrappers
        if ( wrappers !== null ) {
            var elements = document.querySelectorAll(wrappers);
            if ( elements && elements.length > 0 ) {
                for ( var i = 0, len = elements.length; i < len; i++ ) {
                    if ( KTUtil.visible(elements[i]) === false ) {
                        continue;
                    }

                    height = height - _getElementSpacing(elements[i]);
                }
            }
        }

        // Custom offset
        if ( offset !== null && typeof offset !== 'object') {
            height = height - parseInt(offset);
        }

        return String(height) + 'px';
    }

    var _getElementHeight = function(element) {
        var height = 0;

        if (element !== null) {
            height = height + parseInt(KTUtil.css(element, 'height'));
            height = height + parseInt(KTUtil.css(element, 'margin-top'));
            height = height + parseInt(KTUtil.css(element, 'margin-bottom'));

            if (KTUtil.css(element, 'border-top')) {
                height = height + parseInt(KTUtil.css(element, 'border-top'));
            }

            if (KTUtil.css(element, 'border-bottom')) {
                height = height + parseInt(KTUtil.css(element, 'border-bottom'));
            }
        } 

        return height;
    }

    var _getElementSpacing = function(element) {
        var spacing = 0;

        if (element !== null) {
            spacing = spacing + parseInt(KTUtil.css(element, 'margin-top'));
            spacing = spacing + parseInt(KTUtil.css(element, 'margin-bottom'));
            spacing = spacing + parseInt(KTUtil.css(element, 'padding-top'));
            spacing = spacing + parseInt(KTUtil.css(element, 'padding-bottom'));

            if (KTUtil.css(element, 'border-top')) {
                spacing = spacing + parseInt(KTUtil.css(element, 'border-top'));
            }

            if (KTUtil.css(element, 'border-bottom')) {
                spacing = spacing + parseInt(KTUtil.css(element, 'border-bottom'));
            }
        } 

        return spacing;
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-scroll-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-scroll-' + name);

            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _getHeightType = function() {
        if (_getOption('height')) {
            return 'height';
        } if (_getOption('min-height')) {
            return 'min-height';
        } if (_getOption('max-height')) {
            return 'max-height';
        }
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('scroll');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    the.update = function() {
        return _update();
    }

    the.getHeight = function() {
        return _getHeight();
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }
};

// Static methods
KTScroll.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('scroll') ) {
        return KTUtil.data(element).get('scroll');
    } else {
        return null;
    }
}

// Create instances
KTScroll.createInstances = function(selector = '[data-kt-scroll="true"]') {
    // Initialize Menus
    var elements = document.body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTScroll(elements[i]);
        }
    }
}

// Window resize handling
KTScroll.handleResize = function() {
    window.addEventListener('resize', function() {
        var timer;
    
        KTUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.body.querySelectorAll('[data-kt-scroll="true"]');
    
            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var scroll = KTScroll.getInstance(elements[i]);
                    if (scroll) {
                        scroll.update();
                    }
                }
            }
        }, 200);
    });
}

// Global initialization
KTScroll.init = function() {
    KTScroll.createInstances();

    if (KTScrollHandlersInitialized === false) {
        KTScroll.handleResize();

        KTScrollHandlersInitialized = true;
    }    
};

// Webpack Support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTScroll;
}

"use strict";

// Class definition
var KTScrolltop = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 600
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if (KTUtil.data(element).has('scrolltop')) {
            the = KTUtil.data(element).get('scrolltop');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('scrolltop');
        the.element = element;

        // Set initialized
        the.element.setAttribute('data-kt-scrolltop', 'true');

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('scrolltop', the);
    }

    var _handlers = function() {
        var timer;

        window.addEventListener('scroll', function() {
            KTUtil.throttle(timer, function() {
                _scroll();
            }, 200);
        });

        KTUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _scroll = function() {
        var offset = parseInt(_getOption('offset'));

        var pos = KTUtil.getScrollTop(); // current vertical position

        if ( pos > offset ) {
            if ( document.body.hasAttribute('data-kt-scrolltop') === false ) {
                document.body.setAttribute('data-kt-scrolltop', 'on');
            }
        } else {
            if ( document.body.hasAttribute('data-kt-scrolltop') === true ) {
                document.body.removeAttribute('data-kt-scrolltop');
            }
        }
    }

    var _go = function() {
        var speed = parseInt(_getOption('speed'));

        window.scrollTo({top: 0, behavior: 'smooth'});
        //KTUtil.scrollTop(0, speed);
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-scrolltop-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-scrolltop-' + name);
            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('scrolltop');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.go = function() {
        return _go();
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }
};

// Static methods
KTScrolltop.getInstance = function(element) {
    if (element && KTUtil.data(element).has('scrolltop')) {
        return KTUtil.data(element).get('scrolltop');
    } else {
        return null;
    }
}

// Create instances
KTScrolltop.createInstances = function(selector = '[data-kt-scrolltop="true"]') {
    // Initialize Menus
    var elements = document.body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            new KTScrolltop(elements[i]);
        }
    }
}

// Global initialization
KTScrolltop.init = function() {
    KTScrolltop.createInstances();
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTScrolltop;
}

"use strict";

// Class definition
var KTSearch = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default Options
    var defaultOptions = {
        minLength: 2,  // Miniam text lenght to query search
        keypress: true,  // Enable search on keypress 
        enter: true,  // Enable search on enter key press
        layout: 'menu',  // Use 'menu' or 'inline' layout options to display search results
        responsive: null, // Pass integer value or bootstrap compatible breakpoint key(sm,md,lg,xl,xxl) to enable reponsive form mode for device width below the breakpoint value
        showOnFocus: true // Always show menu on input focus
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    // Construct
    var _construct = function() {
        if ( KTUtil.data(element).has('search') === true ) {
            the = KTUtil.data(element).get('search');
        } else {
            _init();
        }
    }

    // Init
    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.processing = false;

        // Elements
        the.element = element;               
        the.contentElement = _getElement('content');     
        the.formElement = _getElement('form');         
        the.inputElement = _getElement('input');
        the.spinnerElement = _getElement('spinner');
        the.clearElement = _getElement('clear');
        the.toggleElement = _getElement('toggle');   
        the.submitElement = _getElement('submit');
        the.toolbarElement = _getElement('toolbar');   

        the.resultsElement = _getElement('results');
        the.suggestionElement = _getElement('suggestion'); 
        the.emptyElement = _getElement('empty'); 

        // Set initialized
        the.element.setAttribute('data-kt-search', 'true');
        
        // Layout
        the.layout = _getOption('layout');
        
        // Menu
        if ( the.layout === 'menu' ) {
            the.menuObject = new KTMenu(the.contentElement);
        } else {
            the.menuObject = null;
        }

        // Update
        _update();

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('search', the);
    }

    // Handlera
    var _handlers = function() {
        // Focus
        the.inputElement.addEventListener('focus', _focus);

        // Blur
        the.inputElement.addEventListener('blur', _blur);

        // Keypress
        if ( _getOption('keypress') === true ) {
            the.inputElement.addEventListener('input', _input);
        }

        // Submit
        if ( the.submitElement ) {
            the.submitElement.addEventListener('click', _search);
        }

        // Enter
        if ( _getOption('enter') === true ) {
            the.inputElement.addEventListener('keypress', _enter);
        }

        // Clear 
        if ( the.clearElement ) {
            the.clearElement.addEventListener('click', _clear);
        }

        // Menu
        if ( the.menuObject ) {
            // Toggle menu
            if ( the.toggleElement ) {
                the.toggleElement.addEventListener('click', _show);

                the.menuObject.on('kt.menu.dropdown.show', function(item) {
                    if (KTUtil.visible(the.toggleElement)) {
                        the.toggleElement.classList.add('active');
                        the.toggleElement.classList.add('show');
                    } 
                });
    
                the.menuObject.on('kt.menu.dropdown.hide', function(item) {
                    if (KTUtil.visible(the.toggleElement)) {
                        the.toggleElement.classList.remove('active');
                        the.toggleElement.classList.remove('show');
                    }
                });
            }            

            the.menuObject.on('kt.menu.dropdown.shown', function() {
                the.inputElement.focus();
            });
        } 

        // Window resize handling
        window.addEventListener('resize', function() {
            var timer;

            KTUtil.throttle(timer, function() {
                _update();
            }, 200);
        });
    }

    // Focus
    var _focus = function() {
        the.element.classList.add('focus');

        if ( _getOption('show-on-focus') === true || the.inputElement.value.length >= minLength ) {
            _show();
        }        
    }

    // Blur
    var _blur = function() {        
        the.element.classList.remove('focus');
    }

    // Enter 
    var _enter = function(e) {
        var key = e.charCode || e.keyCode || 0;

        if (key == 13) {
            e.preventDefault();

            _search();
        }
    }

    // Input
    var _input = function() {
        if ( _getOption('min-length') )  {
            var minLength = parseInt(_getOption('min-length'));

            if ( the.inputElement.value.length >= minLength ) {
                _search();
            } else if ( the.inputElement.value.length === 0 ) {
                _clear();
            }
        }
    }

    // Search
    var _search = function() {
        if (the.processing === false) {
            // Show search spinner
            if (the.spinnerElement) {
                the.spinnerElement.classList.remove("d-none");
            }
            
            // Hide search clear button
            if (the.clearElement) {
                the.clearElement.classList.add("d-none");
            }

            // Hide search toolbar
            if (the.toolbarElement && the.formElement.contains(the.toolbarElement)) {
                the.toolbarElement.classList.add("d-none");
            }

            // Focus input
            the.inputElement.focus();

            the.processing = true;
            KTEventHandler.trigger(the.element, 'kt.search.process', the);
        }
    }

    // Complete
    var _complete = function() {
        if (the.spinnerElement) {
            the.spinnerElement.classList.add("d-none");
        }

        // Show search toolbar
        if (the.clearElement) {
            the.clearElement.classList.remove("d-none");
        }

        if ( the.inputElement.value.length === 0 ) {
            _clear();
        }

        // Focus input
        the.inputElement.focus();

        _show();

        the.processing = false;
    }

    // Clear
    var _clear = function() {
        if ( KTEventHandler.trigger(the.element, 'kt.search.clear', the) === false )  {
            return;
        }

        // Clear and focus input
        the.inputElement.value = "";
        the.inputElement.focus();

        // Hide clear icon
        if (the.clearElement) {
            the.clearElement.classList.add("d-none");
        }

        // Show search toolbar
        if (the.toolbarElement && the.formElement.contains(the.toolbarElement)) {
            the.toolbarElement.classList.remove("d-none");
        }

        // Hide menu
        if ( _getOption('show-on-focus') === false ) {
            _hide();
        }

        KTEventHandler.trigger(the.element, 'kt.search.cleared', the);
    }

    // Update
    var _update = function() {
        // Handle responsive form
        if (the.layout === 'menu') {
            var responsiveFormMode = _getResponsiveFormMode();

            if ( responsiveFormMode === 'on' && the.contentElement.contains(the.formElement) === false ) {
                the.contentElement.prepend(the.formElement);
                the.formElement.classList.remove('d-none');                
            } else if ( responsiveFormMode === 'off' && the.contentElement.contains(the.formElement) === true ) {
                the.element.prepend(the.formElement);
                the.formElement.classList.add('d-none');
            }
        }
    }

    // Show menu
    var _show = function() {
        if ( the.menuObject ) {
            _update();

            the.menuObject.show(the.element);
        }
    }

    // Hide menu
    var _hide = function() {
        if ( the.menuObject ) {
            _update();

            the.menuObject.hide(the.element);
        }
    }

    // Get option
    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-search-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-search-' + name);
            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    // Get element
    var _getElement = function(name) {
        return the.element.querySelector('[data-kt-search-element="' + name + '"]');
    }

    // Check if responsive form mode is enabled
    var _getResponsiveFormMode = function() {
        var responsive = _getOption('responsive');
        var width = KTUtil.getViewPort().width;

        if (!responsive) {
            return null;
        }

        var breakpoint = KTUtil.getBreakpoint(responsive);

        if (!breakpoint ) {
            breakpoint = parseInt(responsive);
        }

        if (width < breakpoint) {
            return "on";
        } else {
            return "off";
        }
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('search');
    }    

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.update = function() {
        return _update();
    }

    the.search = function() {
        return _search();
    }

    the.complete = function() {
        return _complete();
    }

    the.clear = function() {
        return _clear();
    }

    the.isProcessing = function() {
        return the.processing;
    }

    the.getQuery = function() {
        return the.inputElement.value;
    }    

    the.getMenu = function() {
        return the.menuObject;
    }

    the.getFormElement = function() {
        return the.formElement;
    }

    the.getInputElement = function() {
        return the.inputElement;
    }

    the.getContentElement = function() {
        return the.contentElement;
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }
};

// Static methods
KTSearch.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('search') ) {
        return KTUtil.data(element).get('search');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTSearch;
}

"use strict";

// Class definition
var KTStepper = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        startIndex: 1,
        animation: false,
        animationSpeed: '0.3s',
        animationNextClass: 'animate__animated animate__slideInRight animate__fast',
        animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('stepper') === true ) {
            the = KTUtil.data(element).get('stepper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('stepper');

        the.element = element;

        // Set initialized
        the.element.setAttribute('data-kt-stepper', 'true');

        // Elements
        the.steps = KTUtil.findAll(the.element, '[data-kt-stepper-element="nav"]');
        the.btnNext = KTUtil.find(the.element, '[data-kt-stepper-action="next"]');
        the.btnPrevious = KTUtil.find(the.element, '[data-kt-stepper-action="previous"]');
        the.btnSubmit = KTUtil.find(the.element, '[data-kt-stepper-action="submit"]');

        // Variables
        the.totalStepsNumber = the.steps.length;
        the.passedStepIndex = 0;
        the.currentStepIndex = 1;
        the.clickedStepIndex = 0;

        // Set Current Step
        if ( the.options.startIndex > 1 ) {
            _goTo(the.options.startIndex);
        }

        // Event listeners
        the.nextListener = function(e) {
            e.preventDefault();

            KTEventHandler.trigger(the.element, 'kt.stepper.next', the);
        };

        the.previousListener = function(e) {
            e.preventDefault();

            KTEventHandler.trigger(the.element, 'kt.stepper.previous', the);
        };

        the.stepListener = function(e) {
            e.preventDefault();

            if ( the.steps && the.steps.length > 0 ) {
                for (var i = 0, len = the.steps.length; i < len; i++) {
                    if ( the.steps[i] === this ) {
                        the.clickedStepIndex = i + 1;

                        KTEventHandler.trigger(the.element, 'kt.stepper.click', the);

                        return;
                    }
                }
            }
        };

        // Event Handlers
        KTUtil.addEvent(the.btnNext, 'click', the.nextListener);

        KTUtil.addEvent(the.btnPrevious, 'click', the.previousListener);

        the.stepListenerId = KTUtil.on(the.element, '[data-kt-stepper-action="step"]', 'click', the.stepListener);

        // Bind Instance
        KTUtil.data(the.element).set('stepper', the);
    }

    var _goTo = function(index) {
        // Trigger "change" event
        KTEventHandler.trigger(the.element, 'kt.stepper.change', the);

        // Skip if this step is already shown
        if ( index === the.currentStepIndex || index > the.totalStepsNumber || index < 0 ) {
            return;
        }

        // Validate step number
        index = parseInt(index);

        // Set current step
        the.passedStepIndex = the.currentStepIndex;
        the.currentStepIndex = index;

        // Refresh elements
        _refreshUI();

        // Trigger "changed" event
        KTEventHandler.trigger(the.element, 'kt.stepper.changed', the);

        return the;
    }

    var _goNext = function() {
        return _goTo( _getNextStepIndex() );
    }

    var _goPrevious = function() {
        return _goTo( _getPreviousStepIndex() );
    }

    var _goLast = function() {
        return _goTo( _getLastStepIndex() );
    }

    var _goFirst = function() {
        return _goTo( _getFirstStepIndex() );
    }

    var _refreshUI = function() {
        var state = '';

        if ( _isLastStep() ) {
            state = 'last';
        } else if ( _isFirstStep() ) {
            state = 'first';
        } else {
            state = 'between';
        }

        // Set state class
        KTUtil.removeClass(the.element, 'last');
        KTUtil.removeClass(the.element, 'first');
        KTUtil.removeClass(the.element, 'between');

        KTUtil.addClass(the.element, state);

        // Step Items
        var elements = KTUtil.findAll(the.element, '[data-kt-stepper-element="nav"], [data-kt-stepper-element="content"], [data-kt-stepper-element="info"]');

        if ( elements && elements.length > 0 ) {
            for (var i = 0, len = elements.length; i < len; i++) {
                var element = elements[i];
                var index = KTUtil.index(element) + 1;

                KTUtil.removeClass(element, 'current');
                KTUtil.removeClass(element, 'completed');
                KTUtil.removeClass(element, 'pending');

                if ( index == the.currentStepIndex ) {
                    KTUtil.addClass(element, 'current');

                    if ( the.options.animation !== false && element.getAttribute('data-kt-stepper-element') == 'content' ) {
                        KTUtil.css(element, 'animationDuration', the.options.animationSpeed);

                        var animation = _getStepDirection(the.passedStepIndex) === 'previous' ?  the.options.animationPreviousClass : the.options.animationNextClass;
                        KTUtil.animateClass(element, animation);
                    }
                } else {
                    if ( index < the.currentStepIndex ) {
                        KTUtil.addClass(element, 'completed');
                    } else {
                        KTUtil.addClass(element, 'pending');
                    }
                }
            }
        }
    }

    var _isLastStep = function() {
        return the.currentStepIndex === the.totalStepsNumber;
    }

    var _isFirstStep = function() {
        return the.currentStepIndex === 1;
    }

    var _isBetweenStep = function() {
        return _isLastStep() === false && _isFirstStep() === false;
    }

    var _getNextStepIndex = function() {
        if ( the.totalStepsNumber >= ( the.currentStepIndex + 1 ) ) {
            return the.currentStepIndex + 1;
        } else {
            return the.totalStepsNumber;
        }
    }

    var _getPreviousStepIndex = function() {
        if ( ( the.currentStepIndex - 1 ) > 1 ) {
            return the.currentStepIndex - 1;
        } else {
            return 1;
        }
    }

    var _getFirstStepIndex = function(){
        return 1;
    }

    var _getLastStepIndex = function() {
        return the.totalStepsNumber;
    }

    var _getTotalStepsNumber = function() {
        return the.totalStepsNumber;
    }

    var _getStepDirection = function(index) {
        if ( index > the.currentStepIndex ) {
            return 'next';
        } else {
            return 'previous';
        }
    }

    var _getStepContent = function(index) {
        var content = KTUtil.findAll(the.element, '[data-kt-stepper-element="content"]');

        if ( content[index-1] ) {
            return content[index-1];
        } else {
            return false;
        }
    }

    var _destroy = function() {
        // Event Handlers
        KTUtil.removeEvent(the.btnNext, 'click', the.nextListener);

        KTUtil.removeEvent(the.btnPrevious, 'click', the.previousListener);

        KTUtil.off(the.element, 'click', the.stepListenerId);

        KTUtil.data(the.element).remove('stepper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.getElement = function(index) {
        return the.element;
    }

    the.goTo = function(index) {
        return _goTo(index);
    }

    the.goPrevious = function() {
        return _goPrevious();
    }

    the.goNext = function() {
        return _goNext();
    }

    the.goFirst = function() {
        return _goFirst();
    }

    the.goLast = function() {
        return _goLast();
    }

    the.getCurrentStepIndex = function() {
        return the.currentStepIndex;
    }

    the.getNextStepIndex = function() {
        return _getNextStepIndex();
    }

    the.getPassedStepIndex = function() {
        return the.passedStepIndex;
    }

    the.getClickedStepIndex = function() {
        return the.clickedStepIndex;
    }

    the.getPreviousStepIndex = function() {
        return _getPreviousStepIndex();
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTStepper.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('stepper') ) {
        return KTUtil.data(element).get('stepper');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTStepper;
}

"use strict";

var KTStickyHandlersInitialized = false;

// Class definition
var KTSticky = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        offset: 200,
        reverse: false,
        release: null,
        animation: true,
        animationSpeed: '0.3s',
        animationClass: 'animation-slide-in-down'
    };
    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('sticky') === true ) {
            the = KTUtil.data(element).get('sticky');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.element = element;
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('sticky');
        the.name = the.element.getAttribute('data-kt-sticky-name');
        the.attributeName = 'data-kt-sticky-' + the.name;
        the.attributeName2 = 'data-kt-' + the.name;
        the.eventTriggerState = true;
        the.lastScrollTop = 0;
        the.scrollHandler;

        // Set initialized
        the.element.setAttribute('data-kt-sticky', 'true');

        // Event Handlers
        window.addEventListener('scroll', _scroll);

        // Initial Launch
        _scroll();

        // Bind Instance
        KTUtil.data(the.element).set('sticky', the);
    }

    var _scroll = function(e) {
        var offset = _getOption('offset');
        var release = _getOption('release');
        var reverse = _getOption('reverse');
        var st;
        var attrName;
        var diff;

        // Exit if false
        if ( offset === false ) {
            return;
        }

        offset = parseInt(offset);
        release = release ? document.querySelector(release) : null;

        st = KTUtil.getScrollTop();
        diff = document.documentElement.scrollHeight - window.innerHeight - KTUtil.getScrollTop();
        
        var proceed = (!release || (release.offsetTop - release.clientHeight) > st);

        if ( reverse === true ) {  // Release on reverse scroll mode
            if ( st > offset && proceed ) {
                if ( document.body.hasAttribute(the.attributeName) === false) {
                    
                    if (_enable() === false) {
                        return;
                    }

                    document.body.setAttribute(the.attributeName, 'on');
                    document.body.setAttribute(the.attributeName2, 'on');
                    the.element.setAttribute("data-kt-sticky-enabled", "true");
                }

                if ( the.eventTriggerState === true ) {
                    KTEventHandler.trigger(the.element, 'kt.sticky.on', the);
                    KTEventHandler.trigger(the.element, 'kt.sticky.change', the);

                    the.eventTriggerState = false;
                }
            } else { // Back scroll mode
                if ( document.body.hasAttribute(the.attributeName) === true) {
                    _disable();
                    document.body.removeAttribute(the.attributeName);
                    document.body.removeAttribute(the.attributeName2);
                    the.element.removeAttribute("data-kt-sticky-enabled");
                }

                if ( the.eventTriggerState === false ) {
                    KTEventHandler.trigger(the.element, 'kt.sticky.off', the);
                    KTEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = true;
                }
            }

            the.lastScrollTop = st;
        } else { // Classic scroll mode
            if ( st > offset && proceed ) {
                if ( document.body.hasAttribute(the.attributeName) === false) {
                    
                    if (_enable() === false) {
                        return;
                    } 
                    
                    document.body.setAttribute(the.attributeName, 'on');
                    document.body.setAttribute(the.attributeName2, 'on');
                    the.element.setAttribute("data-kt-sticky-enabled", "true");
                }

                if ( the.eventTriggerState === true ) {
                    KTEventHandler.trigger(the.element, 'kt.sticky.on', the);
                    KTEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = false;
                }
            } else { // back scroll mode
                if ( document.body.hasAttribute(the.attributeName) === true ) {
                    _disable();
                    document.body.removeAttribute(the.attributeName);
                    document.body.removeAttribute(the.attributeName2);
                    the.element.removeAttribute("data-kt-sticky-enabled");
                }

                if ( the.eventTriggerState === false ) {
                    KTEventHandler.trigger(the.element, 'kt.sticky.off', the);
                    KTEventHandler.trigger(the.element, 'kt.sticky.change', the);
                    the.eventTriggerState = true;
                }
            }
        }      

        if (release) {
            if ( release.offsetTop - release.clientHeight > st ) {
                the.element.setAttribute('data-kt-sticky-released', 'true');
            } else {
                the.element.removeAttribute('data-kt-sticky-released');
            }
        } 
    }

    var _enable = function(update) {
        var top = _getOption('top');
        top = top ? parseInt(top) : 0;

        var left = _getOption('left');
        var right = _getOption('right');
        var width = _getOption('width');
        var zindex = _getOption('zindex');
        var dependencies = _getOption('dependencies');
        var classes = _getOption('class');

        var height = _calculateHeight();
        var heightOffset = _getOption('height-offset');
        heightOffset = heightOffset ? parseInt(heightOffset) : 0;

        if (height + heightOffset + top > KTUtil.getViewPort().height) {
            return false;
        }
        
        if ( update !== true && _getOption('animation') === true ) {
            KTUtil.css(the.element, 'animationDuration', _getOption('animationSpeed'));
            KTUtil.animateClass(the.element, 'animation ' + _getOption('animationClass'));
        }

        if ( classes !== null ) {
            KTUtil.addClass(the.element, classes);
        }

        if ( zindex !== null ) {
            KTUtil.css(the.element, 'z-index', zindex);
            KTUtil.css(the.element, 'position', 'fixed');
        }

        if ( top >= 0 ) {
            KTUtil.css(the.element, 'top', String(top) + 'px');
        }

        if ( width !== null ) {
            if (width['target']) {
                var targetElement = document.querySelector(width['target']);
                if (targetElement) {
                    width = KTUtil.css(targetElement, 'width');
                }
            }

            KTUtil.css(the.element, 'width', width);
        }

        if ( left !== null ) {
            if ( String(left).toLowerCase() === 'auto' ) {
                var offsetLeft = KTUtil.offset(the.element).left;

                if ( offsetLeft >= 0 ) {
                    KTUtil.css(the.element, 'left', String(offsetLeft) + 'px');
                }
            } else {
                KTUtil.css(the.element, 'left', left);
            }
        }

        if ( right !== null ) {
            KTUtil.css(the.element, 'right', right);
        }        

        // Height dependencies
        if ( dependencies !== null ) {
            var dependencyElements = document.querySelectorAll(dependencies);
            
            if ( dependencyElements && dependencyElements.length > 0 ) {
                for ( var i = 0, len = dependencyElements.length; i < len; i++ ) {
                    KTUtil.css(dependencyElements[i], 'padding-top', String(height) + 'px');
                }
            }
        }
    }

    var _disable = function() {
        KTUtil.css(the.element, 'top', '');
        KTUtil.css(the.element, 'width', '');
        KTUtil.css(the.element, 'left', '');
        KTUtil.css(the.element, 'right', '');
        KTUtil.css(the.element, 'z-index', '');
        KTUtil.css(the.element, 'position', '');

        var dependencies = _getOption('dependencies');
        var classes = _getOption('class');

        if ( classes !== null ) {
            KTUtil.removeClass(the.element, classes);
        }

        // Height dependencies
        if ( dependencies !== null ) {
            var dependencyElements = document.querySelectorAll(dependencies);

            if ( dependencyElements && dependencyElements.length > 0 ) {
                for ( var i = 0, len = dependencyElements.length; i < len; i++ ) {
                    KTUtil.css(dependencyElements[i], 'padding-top', '');
                }
            }
        }
    }

    var _check = function() {

    }

    var _calculateHeight = function() {
        var height = parseFloat(KTUtil.css(the.element, 'height'));

        height = height + parseFloat(KTUtil.css(the.element, 'margin-top'));
        height = height + parseFloat(KTUtil.css(the.element, 'margin-bottom'));
        
        if (KTUtil.css(element, 'border-top')) {
            height = height + parseFloat(KTUtil.css(the.element, 'border-top'));
        }

        if (KTUtil.css(element, 'border-bottom')) {
            height = height + parseFloat(KTUtil.css(the.element, 'border-bottom'));
        }

        return height;
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-sticky-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-sticky-' + name);
            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _destroy = function() {
        window.removeEventListener('scroll', _scroll);
        KTUtil.data(the.element).remove('sticky');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Methods
    the.update = function() {
        if ( document.body.hasAttribute(the.attributeName) === true ) {
            _disable();
            document.body.removeAttribute(the.attributeName);
            document.body.removeAttribute(the.attributeName2);
            _enable(true);
            document.body.setAttribute(the.attributeName, 'on');
            document.body.setAttribute(the.attributeName2, 'on');
        }
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTSticky.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('sticky') ) {
        return KTUtil.data(element).get('sticky');
    } else {
        return null;
    }
}

// Create instances
KTSticky.createInstances = function(selector = '[data-kt-sticky="true"]') {
    // Initialize Menus
    var elements = document.body.querySelectorAll(selector);
    var sticky;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            sticky = new KTSticky(elements[i]);
        }
    }
}

// Window resize handler
KTSticky.handleResize = function() {
    window.addEventListener('resize', function() {
        var timer;
    
        KTUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.body.querySelectorAll('[data-kt-sticky="true"]');
    
            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var sticky = KTSticky.getInstance(elements[i]);
                    if (sticky) {
                        sticky.update();
                    }
                }
            }
        }, 200);
    });
}

// Global initialization
KTSticky.init = function() {
    KTSticky.createInstances();

    if (KTStickyHandlersInitialized === false) {
        KTSticky.handleResize();
        KTStickyHandlersInitialized = true;
    }    
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTSticky;
}

"use strict";

var KTSwapperHandlersInitialized = false;

// Class definition
var KTSwapper = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        mode: 'append'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('swapper') === true ) {
            the = KTUtil.data(element).get('swapper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.element = element;
        the.options = KTUtil.deepExtend({}, defaultOptions, options);

        // Set initialized
        the.element.setAttribute('data-kt-swapper', 'true');

        // Initial update
        _update();

        // Bind Instance
        KTUtil.data(the.element).set('swapper', the);
    }

    var _update = function(e) {
        var parentSelector = _getOption('parent');

        var mode = _getOption('mode');
        var parentElement = parentSelector ? document.querySelector(parentSelector) : null;
       

        if (parentElement && element.parentNode !== parentElement) {
            if (mode === 'prepend') {
                parentElement.prepend(element);
            } else if (mode === 'append') {
                parentElement.append(element);
            }
        }
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-kt-swapper-' + name) === true ) {
            var attr = the.element.getAttribute('data-kt-swapper-' + name);
            var value = KTUtil.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = KTUtil.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return KTUtil.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('swapper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Methods
    the.update = function() {
        _update();
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTSwapper.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('swapper') ) {
        return KTUtil.data(element).get('swapper');
    } else {
        return null;
    }
}

// Create instances
KTSwapper.createInstances = function(selector = '[data-kt-swapper="true"]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);
    var swapper;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            swapper = new KTSwapper(elements[i]);
        }
    }
}

// Window resize handler
KTSwapper.handleResize = function() {
    window.addEventListener('resize', function() {
        var timer;
    
        KTUtil.throttle(timer, function() {
            // Locate and update Offcanvas instances on window resize
            var elements = document.querySelectorAll('[data-kt-swapper="true"]');
    
            if ( elements && elements.length > 0 ) {
                for (var i = 0, len = elements.length; i < len; i++) {
                    var swapper = KTSwapper.getInstance(elements[i]);
                    if (swapper) {
                        swapper.update();
                    }                
                }
            }
        }, 200);
    });
};

// Global initialization
KTSwapper.init = function() {
    KTSwapper.createInstances();

    if (KTSwapperHandlersInitialized === false) {
        KTSwapper.handleResize();
        KTSwapperHandlersInitialized = true;
    }
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTSwapper;
}

"use strict";

// Class definition
var KTToggle = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;

    if (!element) {
        return;
    }

    // Default Options
    var defaultOptions = {
        saveState: true
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( KTUtil.data(element).has('toggle') === true ) {
            the = KTUtil.data(element).get('toggle');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = KTUtil.deepExtend({}, defaultOptions, options);
        the.uid = KTUtil.getUniqueId('toggle');

        // Elements
        the.element = element;

        the.target = document.querySelector(the.element.getAttribute('data-kt-toggle-target')) ? document.querySelector(the.element.getAttribute('data-kt-toggle-target')) : the.element;
        the.state = the.element.hasAttribute('data-kt-toggle-state') ? the.element.getAttribute('data-kt-toggle-state') : '';
        the.mode = the.element.hasAttribute('data-kt-toggle-mode') ? the.element.getAttribute('data-kt-toggle-mode') : '';
        the.attribute = 'data-kt-' + the.element.getAttribute('data-kt-toggle-name');

        // Event Handlers
        _handlers();

        // Bind Instance
        KTUtil.data(the.element).set('toggle', the);
    }

    var _handlers = function() {
        KTUtil.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            if ( the.mode !== '' ) {
                if ( the.mode === 'off' && _isEnabled() === false ) {
                    _toggle();
                } else if ( the.mode === 'on' && _isEnabled() === true ) {
                    _toggle();
                }
            } else {
                _toggle();
            }
        });
    }

    // Event handlers
    var _toggle = function() {
        // Trigger "after.toggle" event
        KTEventHandler.trigger(the.element, 'kt.toggle.change', the);

        if ( _isEnabled() ) {
            _disable();
        } else {
            _enable();
        }       

        // Trigger "before.toggle" event
        KTEventHandler.trigger(the.element, 'kt.toggle.changed', the);

        return the;
    }

    var _enable = function() {
        if ( _isEnabled() === true ) {
            return;
        }

        KTEventHandler.trigger(the.element, 'kt.toggle.enable', the);

        the.target.setAttribute(the.attribute, 'on');

        if (the.state.length > 0) {
            the.element.classList.add(the.state);
        }        

        if ( typeof KTCookie !== 'undefined' && the.options.saveState === true ) {
            KTCookie.set(the.attribute, 'on');
        }

        KTEventHandler.trigger(the.element, 'kt.toggle.enabled', the);

        return the;
    }

    var _disable = function() {
        if ( _isEnabled() === false ) {
            return;
        }

        KTEventHandler.trigger(the.element, 'kt.toggle.disable', the);

        the.target.removeAttribute(the.attribute);

        if (the.state.length > 0) {
            the.element.classList.remove(the.state);
        } 

        if ( typeof KTCookie !== 'undefined' && the.options.saveState === true ) {
            KTCookie.remove(the.attribute);
        }

        KTEventHandler.trigger(the.element, 'kt.toggle.disabled', the);

        return the;
    }

    var _isEnabled = function() {
        return (String(the.target.getAttribute(the.attribute)).toLowerCase() === 'on');
    }

    var _destroy = function() {
        KTUtil.data(the.element).remove('toggle');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.toggle = function() {
        return _toggle();
    }

    the.enable = function() {
        return _enable();
    }

    the.disable = function() {
        return _disable();
    }

    the.isEnabled = function() {
        return _isEnabled();
    }

    the.goElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return KTEventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return KTEventHandler.one(the.element, name, handler);
    }

    the.off = function(name, handlerId) {
        return KTEventHandler.off(the.element, name, handlerId);
    }

    the.trigger = function(name, event) {
        return KTEventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
KTToggle.getInstance = function(element) {
    if ( element !== null && KTUtil.data(element).has('toggle') ) {
        return KTUtil.data(element).get('toggle');
    } else {
        return null;
    }
}

// Create instances
KTToggle.createInstances = function(selector = '[data-kt-toggle]') {
    // Get instances
    var elements = document.body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            // Initialize instances
            new KTToggle(elements[i]);
        }
    }
}

// Global initialization
KTToggle.init = function() {
    KTToggle.createInstances();
};

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTToggle;
}
"use strict";

/**
 * @class KTUtil  base utilize class that privides helper functions
 */

// Polyfills

// Element.matches() polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches = function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
    };
}

/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var el = this;
		var ancestor = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (ancestor.matches(s)) return ancestor;
			ancestor = ancestor.parentElement;
		} while (ancestor !== null);
		return null;
	};
}

/**
 * ChildNode.remove() polyfill
 * https://gomakethings.com/removing-an-element-from-the-dom-the-es6-way/
 * @author Chris Ferdinandi
 * @license MIT
 */
(function (elem) {
	for (var i = 0; i < elem.length; i++) {
		if (!window[elem[i]] || 'remove' in window[elem[i]].prototype) continue;
		window[elem[i]].prototype.remove = function () {
			this.parentNode.removeChild(this);
		};
	}
})(['Element', 'CharacterData', 'DocumentType']);


//
// requestAnimationFrame polyfill by Erik Möller.
//  With fixes from Paul Irish and Tino Zijdel
//
//  http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//  http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
//
//  MIT license
//
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

// getAttributeNames
if (Element.prototype.getAttributeNames == undefined) {
  Element.prototype.getAttributeNames = function () {
    var attributes = this.attributes;
    var length = attributes.length;
    var result = new Array(length);
    for (var i = 0; i < length; i++) {
      result[i] = attributes[i].name;
    }
    return result;
  };
}

// Global variables
window.KTUtilElementDataStore = {};
window.KTUtilElementDataStoreID = 0;
window.KTUtilDelegatedEventHandlers = {};

var KTUtil = function() {
    var resizeHandlers = [];

    /**
     * Handle window resize event with some
     * delay to attach event handlers upon resize complete
     */
    var _windowResizeHandler = function() {
        var _runResizeHandlers = function() {
            // reinitialize other subscribed elements
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };

        var timer;

        window.addEventListener('resize', function() {
            KTUtil.throttle(timer, function() {
                _runResizeHandlers();
            }, 200);
        });
    };

    return {
        /**
         * Class main initializer.
         * @param {object} settings.
         * @returns null
         */
        //main function to initiate the theme
        init: function(settings) {
            _windowResizeHandler();
        },

        /**
         * Adds window resize event handler.
         * @param {function} callback function.
         */
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },

        /**
         * Removes window resize event handler.
         * @param {function} callback function.
         */
        removeResizeHandler: function(callback) {
            for (var i = 0; i < resizeHandlers.length; i++) {
                if (callback === resizeHandlers[i]) {
                    delete resizeHandlers[i];
                }
            }
        },

        /**
         * Trigger window resize handlers.
         */
        runResizeHandlers: function() {
            _runResizeHandlers();
        },

        resize: function() {
            if (typeof(Event) === 'function') {
                // modern browsers
                window.dispatchEvent(new Event('resize'));
            } else {
                // for IE and other old browsers
                // causes deprecation warning on modern browsers
                var evt = window.document.createEvent('UIEvents');
                evt.initUIEvent('resize', true, false, window, 0);
                window.dispatchEvent(evt);
            }
        },

        /**
         * Get GET parameter value from URL.
         * @param {string} paramName Parameter name.
         * @returns {string}
         */
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }

            return null;
        },

        /**
         * Checks whether current device is mobile touch.
         * @returns {boolean}
         */
        isMobileDevice: function() {
            var test = (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);

            if (test === false) {
                // For use within normal web clients
                test = navigator.userAgent.match(/iPad/i) != null;
            }

            return test;
        },

        /**
         * Checks whether current device is desktop.
         * @returns {boolean}
         */
        isDesktopDevice: function() {
            return KTUtil.isMobileDevice() ? false : true;
        },

        /**
         * Gets browser window viewport size. Ref:
         * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
         * @returns {object}
         */
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }

            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

		/**
         * Checks whether given device mode is currently activated.
         * @param {string} mode Responsive mode name(e.g: desktop,
         *     desktop-and-tablet, tablet, tablet-and-mobile, mobile)
         * @returns {boolean}
         */
        isBreakpointUp: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width >= breakpoint);
        },

		isBreakpointDown: function(mode) {
            var width = this.getViewPort().width;
			var breakpoint = this.getBreakpoint(mode);

			return (width < breakpoint);
        },

        getViewportWidth: function() {
            return this.getViewPort().width;
        },

        /**
         * Generates unique ID for give prefix.
         * @param {string} prefix Prefix for generated ID
         * @returns {boolean}
         */
        getUniqueId: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },

        /**
         * Gets window width for give breakpoint mode.
         * @param {string} mode Responsive mode name(e.g: xl, lg, md, sm)
         * @returns {number}
         */
        getBreakpoint: function(breakpoint) {
            var value = this.getCssVariableValue('--bs-' + breakpoint);

            if ( value ) {
                value = parseInt(value.trim());
            } 

            return value;
        },

        /**
         * Checks whether object has property matchs given key path.
         * @param {object} obj Object contains values paired with given key path
         * @param {string} keys Keys path seperated with dots
         * @returns {object}
         */
        isset: function(obj, keys) {
            var stone;

            keys = keys || '';

            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }

            keys = keys.split('.');

            do {
                if (obj === undefined) {
                    return false;
                }

                stone = keys.shift();

                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }

                obj = obj[stone];

            } while (keys.length);

            return true;
        },

        /**
         * Gets highest z-index of the given element parents
         * @param {object} el jQuery element object
         * @returns {number}
         */
        getHighestZindex: function(el) {
            var position, value;

            while (el && el !== document) {
                // Ignore z-index if position is set to a value where z-index is ignored by the browser
                // This makes behavior of this function consistent across browsers
                // WebKit always returns auto if the element is positioned
                position = KTUtil.css(el, 'position');

                if (position === "absolute" || position === "relative" || position === "fixed") {
                    // IE returns 0 when zIndex is not specified
                    // other browsers return a string
                    // we ignore the case of nested elements with an explicit value of 0
                    // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                    value = parseInt(KTUtil.css(el, 'z-index'));

                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }

                el = el.parentNode;
            }

            return 1;
        },

        /**
         * Checks whether the element has any parent with fixed positionfreg
         * @param {object} el jQuery element object
         * @returns {boolean}
         */
        hasFixedPositionedParent: function(el) {
            var position;

            while (el && el !== document) {
                position = KTUtil.css(el, 'position');

                if (position === "fixed") {
                    return true;
                }

                el = el.parentNode;
            }

            return false;
        },

        /**
         * Simulates delay
         */
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        },

        /**
         * Gets randomly generated integer value within given min and max range
         * @param {number} min Range start value
         * @param {number} max Range end value
         * @returns {number}
         */
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Checks whether Angular library is included
         * @returns {boolean}
         */
        isAngularVersion: function() {
            return window.Zone !== undefined ? true : false;
        },

        // Deep extend:  $.extend(true, {}, objA, objB);
        deepExtend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i];
                if (!obj) continue;

                for (var key in obj) {
                    if (!obj.hasOwnProperty(key)) {
                        continue;
                    }

                    // based on https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
                    if ( Object.prototype.toString.call(obj[key]) === '[object Object]' ) {
                        out[key] = KTUtil.deepExtend(out[key], obj[key]);
                        continue;
                    }

                    out[key] = obj[key];
                }
            }

            return out;
        },

        // extend:  $.extend({}, objA, objB);
        extend: function(out) {
            out = out || {};

            for (var i = 1; i < arguments.length; i++) {
                if (!arguments[i])
                    continue;

                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key))
                        out[key] = arguments[i][key];
                }
            }

            return out;
        },

        getBody: function() {
            return document.getElementsByTagName('body')[0];
        },

        /**
         * Checks whether the element has given classes
         * @param {object} el jQuery element object
         * @param {string} Classes string
         * @returns {boolean}
         */
        hasClasses: function(el, classes) {
            if (!el) {
                return;
            }

            var classesArr = classes.split(" ");

            for (var i = 0; i < classesArr.length; i++) {
                if (KTUtil.hasClass(el, KTUtil.trim(classesArr[i])) == false) {
                    return false;
                }
            }

            return true;
        },

        hasClass: function(el, className) {
            if (!el) {
                return;
            }

            return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
        },

        addClass: function(el, className) {
            if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    if (classNames[i] && classNames[i].length > 0) {
                        el.classList.add(KTUtil.trim(classNames[i]));
                    }
                }
            } else if (!KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className += ' ' + KTUtil.trim(classNames[x]);
                }
            }
        },

        removeClass: function(el, className) {
          if (!el || typeof className === 'undefined') {
                return;
            }

            var classNames = className.split(' ');

            if (el.classList) {
                for (var i = 0; i < classNames.length; i++) {
                    el.classList.remove(KTUtil.trim(classNames[i]));
                }
            } else if (KTUtil.hasClass(el, className)) {
                for (var x = 0; x < classNames.length; x++) {
                    el.className = el.className.replace(new RegExp('\\b' + KTUtil.trim(classNames[x]) + '\\b', 'g'), '');
                }
            }
        },

        triggerCustomEvent: function(el, eventName, data) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, {
                    detail: data
                });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, data);
            }

            el.dispatchEvent(event);
        },

        triggerEvent: function(node, eventName) {
            // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
            var doc;

            if (node.ownerDocument) {
                doc = node.ownerDocument;
            } else if (node.nodeType == 9) {
                // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                doc = node;
            } else {
                throw new Error("Invalid node passed to fireEvent: " + node.id);
            }

            if (node.dispatchEvent) {
                // Gecko-style approach (now the standard) takes more work
                var eventClass = "";

                // Different events have different event classes.
                // If this switch statement can't map an eventName to an eventClass,
                // the event firing is going to fail.
                switch (eventName) {
                case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    eventClass = "MouseEvents";
                    break;

                case "focus":
                case "change":
                case "blur":
                case "select":
                    eventClass = "HTMLEvents";
                    break;

                default:
                    throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                    break;
                }
                var event = doc.createEvent(eventClass);

                var bubbles = eventName == "change" ? false : true;
                event.initEvent(eventName, bubbles, true); // All events created as bubbling and cancelable.

                event.synthetic = true; // allow detection of synthetic events
                // The second parameter says go ahead with the default action
                node.dispatchEvent(event, true);
            } else if (node.fireEvent) {
                // IE-old school style
                var event = doc.createEventObject();
                event.synthetic = true; // allow detection of synthetic events
                node.fireEvent("on" + eventName, event);
            }
        },

        index: function( el ){
            var c = el.parentNode.children, i = 0;
            for(; i < c.length; i++ )
                if( c[i] == el ) return i;
        },

        trim: function(string) {
            return string.trim();
        },

        eventTriggered: function(e) {
            if (e.currentTarget.dataset.triggered) {
                return true;
            } else {
                e.currentTarget.dataset.triggered = true;

                return false;
            }
        },

        remove: function(el) {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        },

        find: function(parent, query) {
            if ( parent !== null) {
                return parent.querySelector(query);
            } else {
                return null;
            }
        },

        findAll: function(parent, query) {
            if ( parent !== null ) {
                return parent.querySelectorAll(query);
            } else {
                return null;
            }
        },

        insertAfter: function(el, referenceNode) {
            return referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        },

        parents: function(elem, selector) {
            // Set up a parent array
            var parents = [];

            // Push each parent element to the array
            for ( ; elem && elem !== document; elem = elem.parentNode ) {
                if (selector) {
                    if (elem.matches(selector)) {
                        parents.push(elem);
                    }
                    continue;
                }
                parents.push(elem);
            }

            // Return our parent array
            return parents;
        },

        children: function(el, selector, log) {
            if (!el || !el.childNodes) {
                return null;
            }

            var result = [],
                i = 0,
                l = el.childNodes.length;

            for (var i; i < l; ++i) {
                if (el.childNodes[i].nodeType == 1 && KTUtil.matches(el.childNodes[i], selector, log)) {
                    result.push(el.childNodes[i]);
                }
            }

            return result;
        },

        child: function(el, selector, log) {
            var children = KTUtil.children(el, selector, log);

            return children ? children[0] : null;
        },

        matches: function(el, selector, log) {
            var p = Element.prototype;
            var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
                return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
            };

            if (el && el.tagName) {
                return f.call(el, selector);
            } else {
                return false;
            }
        },

        data: function(el) {
            return {
                set: function(name, data) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        window.KTUtilElementDataStoreID++;
                        el.customDataTag = window.KTUtilElementDataStoreID;
                    }

                    if (window.KTUtilElementDataStore[el.customDataTag] === undefined) {
                        window.KTUtilElementDataStore[el.customDataTag] = {};
                    }

                    window.KTUtilElementDataStore[el.customDataTag][name] = data;
                },

                get: function(name) {
                    if (!el) {
                        return;
                    }

                    if (el.customDataTag === undefined) {
                        return null;
                    }

                    return this.has(name) ? window.KTUtilElementDataStore[el.customDataTag][name] : null;
                },

                has: function(name) {
                    if (!el) {
                        return false;
                    }

                    if (el.customDataTag === undefined) {
                        return false;
                    }

                    return (window.KTUtilElementDataStore[el.customDataTag] && window.KTUtilElementDataStore[el.customDataTag][name]) ? true : false;
                },

                remove: function(name) {
                    if (el && this.has(name)) {
                        delete window.KTUtilElementDataStore[el.customDataTag][name];
                    }
                }
            };
        },

        outerWidth: function(el, margin) {
            var width;

            if (margin === true) {
                width = parseFloat(el.offsetWidth);
                width += parseFloat(KTUtil.css(el, 'margin-left')) + parseFloat(KTUtil.css(el, 'margin-right'));

                return parseFloat(width);
            } else {
                width = parseFloat(el.offsetWidth);

                return width;
            }
        },

        offset: function(el) {
            var rect, win;

            if ( !el ) {
                return;
            }

            // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
            // Support: IE <=11 only
            // Running getBoundingClientRect on a
            // disconnected node in IE throws an error

            if ( !el.getClientRects().length ) {
                return { top: 0, left: 0 };
            }

            // Get document-relative position by adding viewport scroll to viewport-relative gBCR
            rect = el.getBoundingClientRect();
            win = el.ownerDocument.defaultView;

            return {
                top: rect.top + win.pageYOffset,
                left: rect.left + win.pageXOffset,
                right: window.innerWidth - (el.offsetLeft + el.offsetWidth)
            };
        },

        height: function(el) {
            return KTUtil.css(el, 'height');
        },

        outerHeight: function(el, withMargin) {
            var height = el.offsetHeight;
            var style;

            if (typeof withMargin !== 'undefined' && withMargin === true) {
                style = getComputedStyle(el);
                height += parseInt(style.marginTop) + parseInt(style.marginBottom);

                return height;
            } else {
                return height;
            }
        },

        visible: function(el) {
            return !(el.offsetWidth === 0 && el.offsetHeight === 0);
        },

        isVisibleInContainer: function (el, container, offset = 0) {
            const eleTop = el.offsetTop;
            const eleBottom = eleTop + el.clientHeight + offset;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
        
            // The element is fully visible in the container
            return (
                (eleTop >= containerTop && eleBottom <= containerBottom)
            );
        },

        getRelativeTopPosition: function (el, container) {
            return el.offsetTop - container.offsetTop;
        },

        attr: function(el, name, value) {
            if (el == undefined) {
                return;
            }

            if (value !== undefined) {
                el.setAttribute(name, value);
            } else {
                return el.getAttribute(name);
            }
        },

        hasAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            return el.getAttribute(name) ? true : false;
        },

        removeAttr: function(el, name) {
            if (el == undefined) {
                return;
            }

            el.removeAttribute(name);
        },

        animate: function(from, to, duration, update, easing, done) {
            /**
             * TinyAnimate.easings
             *  Adapted from jQuery Easing
             */
            var easings = {};
            var easing;

            easings.linear = function(t, b, c, d) {
                return c * t / d + b;
            };

            easing = easings.linear;

            // Early bail out if called incorrectly
            if (typeof from !== 'number' ||
                typeof to !== 'number' ||
                typeof duration !== 'number' ||
                typeof update !== 'function') {
                return;
            }

            // Create mock done() function if necessary
            if (typeof done !== 'function') {
                done = function() {};
            }

            // Pick implementation (requestAnimationFrame | setTimeout)
            var rAF = window.requestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 50);
            };

            // Animation loop
            var canceled = false;
            var change = to - from;

            function loop(timestamp) {
                var time = (timestamp || +new Date()) - start;

                if (time >= 0) {
                    update(easing(time, from, change, duration));
                }
                if (time >= 0 && time >= duration) {
                    update(to);
                    done();
                } else {
                    rAF(loop);
                }
            }

            update(from);

            // Start animation loop
            var start = window.performance && window.performance.now ? window.performance.now() : +new Date();

            rAF(loop);
        },

        actualCss: function(el, prop, cache) {
            var css = '';

            if (el instanceof HTMLElement === false) {
                return;
            }

            if (!el.getAttribute('kt-hidden-' + prop) || cache === false) {
                var value;

                // the element is hidden so:
                // making the el block so we can meassure its height but still be hidden
                css = el.style.cssText;
                el.style.cssText = 'position: absolute; visibility: hidden; display: block;';

                if (prop == 'width') {
                    value = el.offsetWidth;
                } else if (prop == 'height') {
                    value = el.offsetHeight;
                }

                el.style.cssText = css;

                // store it in cache
                el.setAttribute('kt-hidden-' + prop, value);

                return parseFloat(value);
            } else {
                // store it in cache
                return parseFloat(el.getAttribute('kt-hidden-' + prop));
            }
        },

        actualHeight: function(el, cache) {
            return KTUtil.actualCss(el, 'height', cache);
        },

        actualWidth: function(el, cache) {
            return KTUtil.actualCss(el, 'width', cache);
        },

        getScroll: function(element, method) {
            // The passed in `method` value should be 'Top' or 'Left'
            method = 'scroll' + method;
            return (element == window || element == document) ? (
                self[(method == 'scrollTop') ? 'pageYOffset' : 'pageXOffset'] ||
                (browserSupportsBoxModel && document.documentElement[method]) ||
                document.body[method]
            ) : element[method];
        },

        css: function(el, styleProp, value, important) {
            if (!el) {
                return;
            }

            if (value !== undefined) {
                if ( important === true ) {
                    el.style.setProperty(styleProp, value, 'important');
                } else {
                    el.style[styleProp] = value;
                }
            } else {
                var defaultView = (el.ownerDocument || document).defaultView;

                // W3C standard way:
                if (defaultView && defaultView.getComputedStyle) {
                    // sanitize property name to css notation
                    // (hyphen separated words eg. font-Size)
                    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();

                    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
                } else if (el.currentStyle) { // IE
                    // sanitize property name to camelCase
                    styleProp = styleProp.replace(/\-(\w)/g, function(str, letter) {
                        return letter.toUpperCase();
                    });

                    value = el.currentStyle[styleProp];

                    // convert other units to pixels on IE
                    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
                        return (function(value) {
                            var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;

                            el.runtimeStyle.left = el.currentStyle.left;
                            el.style.left = value || 0;
                            value = el.style.pixelLeft + "px";
                            el.style.left = oldLeft;
                            el.runtimeStyle.left = oldRsLeft;

                            return value;
                        })(value);
                    }

                    return value;
                }
            }
        },

        slide: function(el, dir, speed, callback, recalcMaxHeight) {
            if (!el || (dir == 'up' && KTUtil.visible(el) === false) || (dir == 'down' && KTUtil.visible(el) === true)) {
                return;
            }

            speed = (speed ? speed : 600);
            var calcHeight = KTUtil.actualHeight(el);
            var calcPaddingTop = false;
            var calcPaddingBottom = false;

            if (KTUtil.css(el, 'padding-top') && KTUtil.data(el).has('slide-padding-top') !== true) {
                KTUtil.data(el).set('slide-padding-top', KTUtil.css(el, 'padding-top'));
            }

            if (KTUtil.css(el, 'padding-bottom') && KTUtil.data(el).has('slide-padding-bottom') !== true) {
                KTUtil.data(el).set('slide-padding-bottom', KTUtil.css(el, 'padding-bottom'));
            }

            if (KTUtil.data(el).has('slide-padding-top')) {
                calcPaddingTop = parseInt(KTUtil.data(el).get('slide-padding-top'));
            }

            if (KTUtil.data(el).has('slide-padding-bottom')) {
                calcPaddingBottom = parseInt(KTUtil.data(el).get('slide-padding-bottom'));
            }

            if (dir == 'up') { // up
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {
                        el.style.paddingTop = (calcPaddingTop - value) + 'px';
                    }, 'linear');
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = (calcPaddingBottom - value) + 'px';
                    }, 'linear');
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = (calcHeight - value) + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = 'none';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });


            } else if (dir == 'down') { // down
                el.style.cssText = 'display: block; overflow: hidden;';

                if (calcPaddingTop) {
                    KTUtil.animate(0, calcPaddingTop, speed, function(value) {//
                        el.style.paddingTop = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingTop = '';
                    });
                }

                if (calcPaddingBottom) {
                    KTUtil.animate(0, calcPaddingBottom, speed, function(value) {
                        el.style.paddingBottom = value + 'px';
                    }, 'linear', function() {
                        el.style.paddingBottom = '';
                    });
                }

                KTUtil.animate(0, calcHeight, speed, function(value) {
                    el.style.height = value + 'px';
                }, 'linear', function() {
                    el.style.height = '';
                    el.style.display = '';
                    el.style.overflow = '';

                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }
        },

        slideUp: function(el, speed, callback) {
            KTUtil.slide(el, 'up', speed, callback);
        },

        slideDown: function(el, speed, callback) {
            KTUtil.slide(el, 'down', speed, callback);
        },

        show: function(el, display) {
            if (typeof el !== 'undefined') {
                el.style.display = (display ? display : 'block');
            }
        },

        hide: function(el) {
            if (typeof el !== 'undefined') {
                el.style.display = 'none';
            }
        },

        addEvent: function(el, type, handler, one) {
            if (typeof el !== 'undefined' && el !== null) {
                el.addEventListener(type, handler);
            }
        },

        removeEvent: function(el, type, handler) {
            if (el !== null) {
                el.removeEventListener(type, handler);
            }
        },

        on: function(element, selector, event, handler) {
            if ( element === null ) {
                return;
            }

            var eventId = KTUtil.getUniqueId('event');

            window.KTUtilDelegatedEventHandlers[eventId] = function(e) {
                var targets = element.querySelectorAll(selector);
                var target = e.target;

                while ( target && target !== element ) {
                    for ( var i = 0, j = targets.length; i < j; i++ ) {
                        if ( target === targets[i] ) {
                            handler.call(target, e);
                        }
                    }

                    target = target.parentNode;
                }
            }

            KTUtil.addEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            return eventId;
        },

        off: function(element, event, eventId) {
            if (!element || !window.KTUtilDelegatedEventHandlers[eventId]) {
                return;
            }

            KTUtil.removeEvent(element, event, window.KTUtilDelegatedEventHandlers[eventId]);

            delete window.KTUtilDelegatedEventHandlers[eventId];
        },

        one: function onetime(el, type, callback) {
            el.addEventListener(type, function callee(e) {
                // remove event
                if (e.target && e.target.removeEventListener) {
                    e.target.removeEventListener(e.type, callee);
                }

                // need to verify from https://themeforest.net/author_dashboard#comment_23615588
                if (el && el.removeEventListener) {
				    e.currentTarget.removeEventListener(e.type, callee);
			    }

                // call handler
                return callback(e);
            });
        },

        hash: function(str) {
            var hash = 0,
                i, chr;

            if (str.length === 0) return hash;
            for (i = 0; i < str.length; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            return hash;
        },

        animateClass: function(el, animationName, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd',
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }
            
            KTUtil.addClass(el, animationName);

            KTUtil.one(el, animation, function() {
                KTUtil.removeClass(el, animationName);
            });

            if (callback) {
                KTUtil.one(el, animation, callback);
            }
        },

        transitionEnd: function(el, callback) {
            var transition;
            var transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'mozTransitionEnd',
                WebkitTransition: 'webkitTransitionEnd',
                msTransition: 'msTransitionEnd'
            };

            for (var t in transitions) {
                if (el.style[t] !== undefined) {
                    transition = transitions[t];
                }
            }

            KTUtil.one(el, transition, callback);
        },

        animationEnd: function(el, callback) {
            var animation;
            var animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd',
                msAnimation: 'msAnimationEnd'
            };

            for (var t in animations) {
                if (el.style[t] !== undefined) {
                    animation = animations[t];
                }
            }

            KTUtil.one(el, animation, callback);
        },

        animateDelay: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-delay', value);
            }
        },

        animateDuration: function(el, value) {
            var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
            for (var i = 0; i < vendors.length; i++) {
                KTUtil.css(el, vendors[i] + 'animation-duration', value);
            }
        },

        scrollTo: function(target, offset, duration) {
            var duration = duration ? duration : 500;
            var targetPos = target ? KTUtil.offset(target).top : 0;
            var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            var from, to;

            if (offset) {
                targetPos = targetPos - offset;
            }

            from = scrollPos;
            to = targetPos;

            KTUtil.animate(from, to, duration, function(value) {
                document.documentElement.scrollTop = value;
                document.body.parentNode.scrollTop = value;
                document.body.scrollTop = value;
            }); //, easing, done
        },

        scrollTop: function(offset, duration) {
            KTUtil.scrollTo(null, offset, duration);
        },

        isArray: function(obj) {
            return obj && Array.isArray(obj);
        },

        isEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    return false;
                }
            }

            return true;
        },

        numberString: function(nStr) {
            nStr += '';
            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        },

        isRTL: function() {
            return (document.querySelector('html').getAttribute("direction") === 'rtl');
        },

        snakeToCamel: function(s){
            return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
        },

        filterBoolean: function(val) {
            // Convert string boolean
			if (val === true || val === 'true') {
				return true;
			}

			if (val === false || val === 'false') {
				return false;
			}

            return val;
        },

        setHTML: function(el, html) {
            el.innerHTML = html;
        },

        getHTML: function(el) {
            if (el) {
                return el.innerHTML;
            }
        },

        getDocumentHeight: function() {
            var body = document.body;
            var html = document.documentElement;

            return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );
        },

        getScrollTop: function() {
            return  (document.scrollingElement || document.documentElement).scrollTop;
        },

        colorLighten: function(color, amount) {
            const addLight = function(color, amount){
                let cc = parseInt(color,16) + amount;
                let c = (cc > 255) ? 255 : (cc);
                c = (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;
                return c;
            }

            color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
            amount = parseInt((255*amount)/100);
            
            return color = `#${addLight(color.substring(0,2), amount)}${addLight(color.substring(2,4), amount)}${addLight(color.substring(4,6), amount)}`;
        },

        colorDarken: function(color, amount) {
            const subtractLight = function(color, amount){
                let cc = parseInt(color,16) - amount;
                let c = (cc < 0) ? 0 : (cc);
                c = (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;

                return c;
            }
              
            color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
            amount = parseInt((255*amount)/100);

            return color = `#${subtractLight(color.substring(0,2), amount)}${subtractLight(color.substring(2,4), amount)}${subtractLight(color.substring(4,6), amount)}`;
        },

        // Throttle function: Input as function which needs to be throttled and delay is the time interval in milliseconds
        throttle:  function (timer, func, delay) {
        	// If setTimeout is already scheduled, no need to do anything
        	if (timer) {
        		return;
        	}

        	// Schedule a setTimeout after delay seconds
        	timer  =  setTimeout(function () {
        		func();

        		// Once setTimeout function execution is finished, timerId = undefined so that in <br>
        		// the next scroll event function execution can be scheduled by the setTimeout
        		timer  =  undefined;
        	}, delay);
        },

        // Debounce function: Input as function which needs to be debounced and delay is the debounced time in milliseconds
        debounce: function (timer, func, delay) {
        	// Cancels the setTimeout method execution
        	clearTimeout(timer)

        	// Executes the func after delay time.
        	timer  =  setTimeout(func, delay);
        },

        parseJson: function(value) {
            if (typeof value === 'string') {
                value = value.replace(/'/g, "\"");

                var jsonStr = value.replace(/(\w+:)|(\w+ :)/g, function(matched) {
                    return '"' + matched.substring(0, matched.length - 1) + '":';
                });

                try {
                    value = JSON.parse(jsonStr);
                } catch(e) { }
            }

            return value;
        },

        getResponsiveValue: function(value, defaultValue) {
            var width = this.getViewPort().width;
            var result = null;

            value = KTUtil.parseJson(value);

            if (typeof value === 'object') {
                var resultKey;
                var resultBreakpoint = -1;
                var breakpoint;

                for (var key in value) {
                    if (key === 'default') {
                        breakpoint = 0;
                    } else {
                        breakpoint = this.getBreakpoint(key) ? this.getBreakpoint(key) : parseInt(key);
                    }

                    if (breakpoint <= width && breakpoint > resultBreakpoint) {
                        resultKey = key;
                        resultBreakpoint = breakpoint;
                    }
                }

                if (resultKey) {
                    result = value[resultKey];
                } else {
                    result = value;
                }
            } else {
                result = value;
            }

            return result;
        },

        each: function(array, callback) {
            return [].slice.call(array).map(callback);
        },

        getSelectorMatchValue: function(value) {
            var result = null;
            value = KTUtil.parseJson(value);

            if ( typeof value === 'object' ) {
                // Match condition
                if ( value['match'] !== undefined ) {
                    var selector = Object.keys(value['match'])[0];
                    value = Object.values(value['match'])[0];

                    if ( document.querySelector(selector) !== null ) {
                        result = value;
                    }
                }
            } else {
                result = value;
            }

            return result;
        },

        getConditionalValue: function(value) {
            var value = KTUtil.parseJson(value);
            var result = KTUtil.getResponsiveValue(value);

            if ( result !== null && result['match'] !== undefined ) {
                result = KTUtil.getSelectorMatchValue(result);
            }

            if ( result === null && value !== null && value['default'] !== undefined ) {
                result = value['default'];
            }

            return result;
        },

        getCssVariableValue: function(variableName) {
            var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
            if ( hex && hex.length > 0 ) {
                hex = hex.trim();
            }

            return hex;
        },

        isInViewport: function(element) {        
            var rect = element.getBoundingClientRect();

            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        isPartiallyInViewport: function(element) {        
            let x = element.getBoundingClientRect().left;
            let y = element.getBoundingClientRect().top;
            let ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            let hw = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            let w = element.clientWidth;
            let h = element.clientHeight;

            return (
                (y < hw &&
                y + h > 0) &&
                (x < ww &&
                x + w > 0)
            );
        },

        onDOMContentLoaded: function(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        },

        inIframe: function() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },

        isHexColor(code) {
            return /^#[0-9A-F]{6}$/i.test(code);
        }
    }
}();

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTUtil;
}
"use strict";

// Class definition
var KTAppLayoutBuilder = function() {
	var form;
	var actionInput;
	var url;
	var previewButton;
	var exportButton;
	var resetButton;

	var engage;
	var engageToggleOff;
	var engageToggleOn;
	var engagePrebuiltsModal;

	var handleEngagePrebuilts = function() {	
		if (engagePrebuiltsModal === null) {
			return;
		}	

		if ( KTCookie.get("app_engage_prebuilts_modal_displayed") !== "1" ) {
			setTimeout(function() {
				const modal = new bootstrap.Modal(engagePrebuiltsModal);
				modal.show();
	
				const date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
				KTCookie.set("app_engage_prebuilts_modal_displayed", "1", {expires: date});
			}, 3000);
		} 
	}

	var handleEngagePrebuiltsViewMenu = function() {
		const selected = engagePrebuiltsModal.querySelector('[data-kt-element="selected"]');
		const selectedTitle = engagePrebuiltsModal.querySelector('[data-kt-element="title"]');
		const menu = engagePrebuiltsModal.querySelector('[data-kt-menu="true"]');

		// Toggle Handler
		KTUtil.on(engagePrebuiltsModal, '[data-kt-mode]', 'click', function (e) {
			const title = this.innerText;	
			const mode = this.getAttribute("data-kt-mode");
			const selectedLink = menu.querySelector('.menu-link.active');
			const viewImage = document.querySelector('#kt_app_engage_prebuilts_view_image');
			const viewText = document.querySelector('#kt_app_engage_prebuilts_view_text');
			selectedTitle.innerText = title;

			if (selectedLink) {
				selectedLink.classList.remove('active');
			}

			this.classList.add('active');

			if (mode === "image") {
				viewImage.classList.remove("d-none");
				viewImage.classList.add("d-block");
				viewText.classList.remove("d-block");
				viewText.classList.add("d-none");
			} else {
				viewText.classList.remove("d-none");
				viewText.classList.add("d-block");
				viewImage.classList.remove("d-block");
				viewImage.classList.add("d-none");
			}
		});
	}

	var handleEngageToggle = function() {	
		engageToggleOff.addEventListener("click", function (e) {
			e.preventDefault();

			const date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 days from now
			KTCookie.set("app_engage_hide", "1", {expires: date});
			engage.classList.add('app-engage-hide');
		});

		engageToggleOn.addEventListener("click", function (e) {
			e.preventDefault();

			KTCookie.remove("app_engage_hide");
			engage.classList.remove('app-engage-hide');
		});
	}

	var handlePreview = function() {
		previewButton.addEventListener("click", function(e) {
			e.preventDefault();

			// Set form action value
			actionInput.value = "preview";

			// Show progress
			previewButton.setAttribute("data-kt-indicator", "on");

			// Prepare form data
			var data = $(form).serialize();

			// Submit
			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function(response, status, xhr) {
					if (history.scrollRestoration) {
						history.scrollRestoration = 'manual';
					}					
					location.reload();					
					return;

					toastr.success(
						"Preview has been updated with current configured layout.", 
						"Preview updated!", 
						{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
					);

					setTimeout(function() {
						location.reload(); // reload page
					}, 1500);
				},
				error: function(response) {
					toastr.error(
						"Please try it again later.", 
						"Something went wrong!", 
						{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
					);
				},
				complete: function() {
					previewButton.removeAttribute("data-kt-indicator");
				}
			});
		});
	};

	var handleExport = function() {
		exportButton.addEventListener("click", function(e) {
			e.preventDefault();

			toastr.success(
				"Process has been started and it may take a while.", 
				"Generating HTML!", 
				{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
			);

			// Show progress
			exportButton.setAttribute("data-kt-indicator", "on");

			// Set form action value
			actionInput.value = "export";
			
			// Prepare form data
			var data = $(form).serialize();

			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function(response, status, xhr) {
					var timer = setInterval(function() {
						$("<iframe/>").attr({
							src: url + "?layout-builder[action]=export&download=1&output=" + response,
							style: "visibility:hidden;display:none",
						}).ready(function() {
							// Stop the timer
							clearInterval(timer);

							exportButton.removeAttribute("data-kt-indicator");
						}).appendTo("body");
					}, 3000);
				},
				error: function(response) {
					toastr.error(
						"Please try it again later.", 
						"Something went wrong!", 
						{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
					);

					exportButton.removeAttribute("data-kt-indicator");
				},
			});
		});
	};

	var handleReset = function() {
		resetButton.addEventListener("click", function(e) {
			e.preventDefault();

			// Show progress
			resetButton.setAttribute("data-kt-indicator", "on");

			// Set form action value
			actionInput.value = "reset";
			
			// Prepare form data
			var data = $(form).serialize();

			$.ajax({
				type: "POST",
				dataType: "html",
				url: url,
				data: data,
				success: function(response, status, xhr) {
					if (history.scrollRestoration) {
						history.scrollRestoration = 'manual';
					}
					
					location.reload();					
					return;
					
					toastr.success(
						"Preview has been successfully reset and the page will be reloaded.", 
						"Reset Preview!", 
						{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
					);

					setTimeout(function() {
						location.reload(); // reload page
					}, 1500);
				},
				error: function(response) {
					toastr.error(
						"Please try it again later.", 
						"Something went wrong!", 
						{timeOut: 0, extendedTimeOut: 0, closeButton: true, closeDuration: 0}
					);
				},
				complete: function() {
					resetButton.removeAttribute("data-kt-indicator");
				},
			});
		});
	};

	var handleThemeMode = function() {
		var checkLight = document.querySelector('#kt_layout_builder_theme_mode_light');
		var checkDark = document.querySelector('#kt_layout_builder_theme_mode_dark');
		var check = document.querySelector('#kt_layout_builder_theme_mode_' + KTThemeMode.getMode());

		if (checkLight) {
			checkLight.addEventListener("click", function() {
				this.checked = true;
				this.closest('[data-kt-buttons="true"]').querySelector('.form-check-image.active').classList.remove('active');
				this.closest('.form-check-image').classList.add('active');
				KTThemeMode.setMode('light');
			});
		}
		
		if (checkDark) {
			checkDark.addEventListener("click", function() {
				this.checked = true;
				this.closest('[data-kt-buttons="true"]').querySelector('.form-check-image.active').classList.remove('active');
				this.closest('.form-check-image').classList.add('active');
				KTThemeMode.setMode('dark');
			});
		}

		if ( check ) {
			check.closest('.form-check-image').classList.add('active');
			check.checked = true;
		}
	}

	return {
		// Public functions
		init: function() {
			engage = document.querySelector('#kt_app_engage');
			engageToggleOn = document.querySelector('#kt_app_engage_toggle_on');
			engageToggleOff = document.querySelector('#kt_app_engage_toggle_off');
			engagePrebuiltsModal = document.querySelector('#kt_app_engage_prebuilts_modal');

			if ( engage && engagePrebuiltsModal) {
				handleEngagePrebuilts();
				handleEngagePrebuiltsViewMenu();
			}

			if ( engage && engageToggleOn && engageToggleOff ) {
				handleEngageToggle();
			}

            form = document.querySelector("#kt_app_layout_builder_form");

            if ( !form ) {
                return;
            }

            url = form.getAttribute("action");
            actionInput = document.querySelector("#kt_app_layout_builder_action");            
            previewButton = document.querySelector("#kt_app_layout_builder_preview");
            exportButton = document.querySelector("#kt_app_layout_builder_export");
            resetButton = document.querySelector("#kt_app_layout_builder_reset");			
    
			if ( previewButton ) {
				handlePreview();
			}

			if ( exportButton ) {
				handleExport();
			}

			if ( resetButton ) {
				handleReset();
			}

			handleThemeMode();
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTAppLayoutBuilder.init();
});
"use strict";

// Class definition
var KTLayoutSearch = function() {
    // Private variables
    var element;
    var formElement;
    var mainElement;
    var resultsElement;
    var wrapperElement;
    var emptyElement;

    var preferencesElement;
    var preferencesShowElement;
    var preferencesDismissElement;
    
    var advancedOptionsFormElement;
    var advancedOptionsFormShowElement;
    var advancedOptionsFormCancelElement;
    var advancedOptionsFormSearchElement;
    
    var searchObject;

    // Private functions
    var processs = function(search) {
        var timeout = setTimeout(function() {
            var number = KTUtil.getRandomInt(1, 3);

            // Hide recently viewed
            mainElement.classList.add('d-none');

            if (number === 3) {
                // Hide results
                resultsElement.classList.add('d-none');
                // Show empty message 
                emptyElement.classList.remove('d-none');
            } else {
                // Show results
                resultsElement.classList.remove('d-none');
                // Hide empty message 
                emptyElement.classList.add('d-none');
            }                  

            // Complete search
            search.complete();
        }, 1500);
    }

    var processsAjax = function(search) {
        // Hide recently viewed
        mainElement.classList.add('d-none');

        // Learn more: https://axios-http.com/docs/intro
        axios.post('/search.php', {
            query: searchObject.getQuery()
        })
        .then(function (response) {
            // Populate results
            resultsElement.innerHTML = response;
            // Show results
            resultsElement.classList.remove('d-none');
            // Hide empty message 
            emptyElement.classList.add('d-none');

            // Complete search
            search.complete();
        })
        .catch(function (error) {
            // Hide results
            resultsElement.classList.add('d-none');
            // Show empty message 
            emptyElement.classList.remove('d-none');

            // Complete search
            search.complete();
        });
    }

    var clear = function(search) {
        // Show recently viewed
        mainElement.classList.remove('d-none');
        // Hide results
        resultsElement.classList.add('d-none');
        // Hide empty message 
        emptyElement.classList.add('d-none');
    }    

    var handlePreferences = function() {
        // Preference show handler
        preferencesShowElement.addEventListener('click', function() {
            wrapperElement.classList.add('d-none');
            preferencesElement.classList.remove('d-none');
        });

        // Preference dismiss handler
        preferencesDismissElement.addEventListener('click', function() {
            wrapperElement.classList.remove('d-none');
            preferencesElement.classList.add('d-none');
        });
    }

    var handleAdvancedOptionsForm = function() {
        // Show
        advancedOptionsFormShowElement.addEventListener('click', function() {
            wrapperElement.classList.add('d-none');
            advancedOptionsFormElement.classList.remove('d-none');
        });

        // Cancel
        advancedOptionsFormCancelElement.addEventListener('click', function() {
            wrapperElement.classList.remove('d-none');
            advancedOptionsFormElement.classList.add('d-none');
        });

        // Search
        advancedOptionsFormSearchElement.addEventListener('click', function() {
            
        });
    }

    // Public methods
	return {
		init: function() {
            // Elements
            element = document.querySelector('#kt_header_search');

            if (!element) {
                return;
            }

            wrapperElement = element.querySelector('[data-kt-search-element="wrapper"]');
            formElement = element.querySelector('[data-kt-search-element="form"]');
            mainElement = element.querySelector('[data-kt-search-element="main"]');
            resultsElement = element.querySelector('[data-kt-search-element="results"]');
            emptyElement = element.querySelector('[data-kt-search-element="empty"]');

            preferencesElement = element.querySelector('[data-kt-search-element="preferences"]');
            preferencesShowElement = element.querySelector('[data-kt-search-element="preferences-show"]');
            preferencesDismissElement = element.querySelector('[data-kt-search-element="preferences-dismiss"]');

            advancedOptionsFormElement = element.querySelector('[data-kt-search-element="advanced-options-form"]');
            advancedOptionsFormShowElement = element.querySelector('[data-kt-search-element="advanced-options-form-show"]');
            advancedOptionsFormCancelElement = element.querySelector('[data-kt-search-element="advanced-options-form-cancel"]');
            advancedOptionsFormSearchElement = element.querySelector('[data-kt-search-element="advanced-options-form-search"]');
            
            // Initialize search handler
            searchObject = new KTSearch(element);

            // Demo search handler
            searchObject.on('kt.search.process', processs);

            // Ajax search handler
            //searchObject.on('kt.search.process', processsAjax);

            // Clear handler
            searchObject.on('kt.search.clear', clear);

            // Custom handlers
            handlePreferences();
            handleAdvancedOptionsForm();            
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTLayoutSearch.init();
});
"use strict";

// Class definition
var KTThemeModeUser = function () {
    
    var handleSubmit = function() {
		// Update chart on theme mode change
        KTThemeMode.on("kt.thememode.change", function() {                
            var menuMode = KTThemeMode.getMenuMode();
            var mode = KTThemeMode.getMode();
            console.log("user selected theme mode:" + menuMode);
            console.log("theme mode:" + mode);

            // Submit selected theme mode menu option via ajax and 
            // store it in user profile and set the user opted theme mode via HTML attribute
            // <html data-theme-mode="light"> .... </html>
        });
    }

    return {
        init: function () {
			handleSubmit();
        }
    };
}();

// Initialize app on document ready
KTUtil.onDOMContentLoaded(function () {
    KTThemeModeUser.init();
});

// Declare KTThemeModeUser for Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTThemeModeUser;
}
"use strict";

// Class definition
var KTThemeMode = function () {
	var menu;
	var callbacks = [];
	var the = this;

    var getMode = function() {
		var mode;

		if ( document.documentElement.hasAttribute("data-bs-theme") ) {
            return document.documentElement.getAttribute("data-bs-theme");
        } else if ( localStorage.getItem("data-bs-theme") !== null ) {
			return localStorage.getItem("data-bs-theme");
		} else if ( getMenuMode() === "system" ) {
			return getSystemMode();
		}

        return "light";
    }

    var setMode = function(mode, menuMode) {		
		var currentMode = getMode();

		// Reset mode if system mode was changed
		if ( menuMode === 'system') {
			if ( getSystemMode() !==  mode ) {
				mode = getSystemMode();
			}
		} else if (mode !== menuMode) {
			menuMode = mode;
		}

		// Read active menu mode value
		var activeMenuItem = menu ? menu.querySelector('[data-kt-element="mode"][data-kt-value="' + menuMode + '"]') : null;

		// Enable switching state
		document.documentElement.setAttribute("data-kt-theme-mode-switching", "true");
		
		// Set mode to the target document.documentElement
		document.documentElement.setAttribute("data-bs-theme", mode);

		// Disable switching state
		setTimeout(function() {
			document.documentElement.removeAttribute("data-kt-theme-mode-switching");
		}, 300);
		
		// Store mode value in storage
        localStorage.setItem("data-bs-theme", mode);			
		
		// Set active menu item
		if ( activeMenuItem ) {
			localStorage.setItem("data-bs-theme-mode", menuMode);
			setActiveMenuItem(activeMenuItem);
		}			

		if (mode !== currentMode) {
			KTEventHandler.trigger(document.documentElement, 'kt.thememode.change', the);
		}		
    }

	var getMenuMode = function() {
		if (!menu) {
			return null;
		}

		var menuItem = menu ? menu.querySelector('.active[data-kt-element="mode"]') : null;

		if ( menuItem && menuItem.getAttribute('data-kt-value') ) {
            return menuItem.getAttribute('data-kt-value');
        } else if ( document.documentElement.hasAttribute("data-bs-theme-mode") ) {
			return document.documentElement.getAttribute("data-bs-theme-mode")
		} else if ( localStorage.getItem("data-bs-theme-mode") !== null ) {
			return localStorage.getItem("data-bs-theme-mode");
		} else {
			return typeof defaultThemeMode !== "undefined" ? defaultThemeMode : "light";
		}
	}

	var getSystemMode = function() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
    }

	var initMode = function() {
		setMode(getMode(), getMenuMode());
		KTEventHandler.trigger(document.documentElement, 'kt.thememode.init', the);
	}

	var getActiveMenuItem = function() {
		return menu.querySelector('[data-kt-element="mode"][data-kt-value="' + getMenuMode() + '"]');
	}

	var setActiveMenuItem = function(item) {
		var menuMode = item.getAttribute("data-kt-value");
		
		var activeItem = menu.querySelector('.active[data-kt-element="mode"]');

		if ( activeItem ) {
			activeItem.classList.remove("active");
		}

		item.classList.add("active");
		localStorage.setItem("data-bs-theme-mode", menuMode);
	}

	var handleMenu = function() {
		var items = [].slice.call(menu.querySelectorAll('[data-kt-element="mode"]'));

        items.map(function (item) {
            item.addEventListener("click", function(e) {
				e.preventDefault();

				var menuMode = item.getAttribute("data-kt-value");
				var mode = menuMode;

				if ( menuMode === "system") {
					mode = getSystemMode();
				} 		

				setMode(mode, menuMode);
			});			     
        });
	}

    return {
        init: function () {
			menu = document.querySelector('[data-kt-element="theme-mode-menu"]');

            initMode();

			if (menu) {
				handleMenu();
			}			
        },

        getMode: function () {
            return getMode();
        },

		getMenuMode: function() {
			return getMenuMode();
		},

		getSystemMode: function () {
            return getSystemMode();
        },

        setMode: function(mode) {
            return setMode(mode)
        },

		on: function(name, handler) {
			return KTEventHandler.on(document.documentElement, name, handler);
		},

		off: function(name, handlerId) {
			return KTEventHandler.off(document.documentElement, name, handlerId);
		}
    };
}();

// Initialize app on document ready
KTUtil.onDOMContentLoaded(function () {
    KTThemeMode.init();
});

// Declare KTThemeMode for Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = KTThemeMode;
}
"use strict";

// Class definition
var KTAppSidebar = function () {
	// Private variables
	var toggle;
	var sidebar;
	var headerMenu;
	var menuDashboardsCollapse;
	var menuWrapper;
	var toggle;

	// Private functions
	// Handle sidebar minimize mode toggle
	var handleToggle = function () {
	   	var toggleObj = KTToggle.getInstance(toggle);
	   	var headerMenuObj = KTMenu.getInstance(headerMenu);

		if ( toggleObj === null) {
			return;
		}

	   	// Add a class to prevent sidebar hover effect after toggle click
	   	toggleObj.on('kt.toggle.change', function() {
			// Set animation state
			sidebar.classList.add('animating');
			
			// Wait till animation finishes
			setTimeout(function() {
				// Remove animation state
				sidebar.classList.remove('animating');
			}, 300);

			// Prevent header menu dropdown display on hover
			if (headerMenuObj) {
				headerMenuObj.disable();

				// Timeout to enable header menu 
				setTimeout(function() {
					headerMenuObj.enable();
				}, 1000);
			}
	   	});

		// Store sidebar minimize state in cookie
		toggleObj.on('kt.toggle.changed', function() {
			// In server side check sidebar_minimize_state cookie 
			// value and add data-kt-app-sidebar-minimize="on" 
			// attribute to Body tag and "active" class to the toggle button
			var date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

			KTCookie.set("sidebar_minimize_state", toggleObj.isEnabled() ? "on" : "off", {expires: date}); 
		});
	}

	// Handle dashboards menu items collapse mode
	var handleShowMore = function() {
		menuDashboardsCollapse.addEventListener('hide.bs.collapse', event => {
			menuWrapper.scrollTo({
				top: 0,
				behavior: 'instant'
			});
		});        
	}

	var handleMenuScroll = function() {
		var menuActiveItem = menuWrapper.querySelector(".menu-link.active");

		if ( !menuActiveItem ) {
			return;
		} 

		if ( KTUtil.isVisibleInContainer(menuActiveItem, menuWrapper) === true) {
			return;
		}

		menuWrapper.scroll({
			top: KTUtil.getRelativeTopPosition(menuActiveItem, menuWrapper),
			behavior: 'smooth'
		});
	}

	// Public methods
	return {
		init: function () {
			// Elements
			sidebar = document.querySelector('#kt_app_sidebar');
			toggle = document.querySelector('#kt_app_sidebar_toggle');
			headerMenu = document.querySelector('#kt_app_header_menu');
			menuDashboardsCollapse = document.querySelector('#kt_app_sidebar_menu_dashboards_collapse');
			menuWrapper = document.querySelector('#kt_app_sidebar_menu_wrapper');
			
			if ( sidebar === null ) {
				return;
			}

			if ( toggle ) {
				handleToggle();	
			}

			if ( menuWrapper ) {
				handleMenuScroll();
			}

			if ( menuDashboardsCollapse ) {
				handleShowMore();
			}
		}
	};
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
	KTAppSidebar.init();
});
"use strict";

// Class definition
var KTLayoutToolbar = function () {
    // Private variables
    var toolbar;

    // Private functions
    var initForm = function () {
        var rangeSlider = document.querySelector("#kt_app_toolbar_slider");
        var rangeSliderValueElement = document.querySelector("#kt_app_toolbar_slider_value");

        if (!rangeSlider) {
            return;
        }

        noUiSlider.create(rangeSlider, {
            start: [5],
            connect: [true, false],
            step: 1,
            format: wNumb({
                decimals: 1
            }),
            range: {
                min: [1],
                max: [10]
            }
        });

        rangeSlider.noUiSlider.on("update", function (values, handle) {
            rangeSliderValueElement.innerHTML = values[handle];
        });

        var handle = rangeSlider.querySelector(".noUi-handle");

        handle.setAttribute("tabindex", 0);

        handle.addEventListener("click", function () {
            this.focus();
        });

        handle.addEventListener("keydown", function (event) {
            var value = Number(rangeSlider.noUiSlider.get());

            switch (event.which) {
                case 37:
                    rangeSlider.noUiSlider.set(value - 1);
                    break;
                case 39:
                    rangeSlider.noUiSlider.set(value + 1);
                    break;
            }
        });
    }

    // Public methods
    return {
        init: function () {
            // Elements
            toolbar = document.querySelector('#kt_app_toolbar');

            if (!toolbar) {
                return;
            }

            initForm();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTLayoutToolbar.init();
});

var KTComponents = {
    init: function() {
        KTApp.init(),
        KTDrawer.init(),
        KTMenu.init(),
        KTScroll.init(),
        KTSticky.init(),
        KTSwapper.init(),
        KTToggle.init(),
        KTScrolltop.init(),
        KTDialer.init(),
        KTImageInput.init(),
        KTPasswordMeter.init()
    }
};
"loading" === document.readyState ? document.addEventListener("DOMContentLoaded", (function() {
    KTComponents.init()
}
)) : KTComponents.init(),
window.addEventListener("load", (function() {
    KTApp.hidePageLoading()
}
)),
"undefined" != typeof module && void 0 !== module.exports && (window.KTComponents = module.exports = KTComponents);
var KTApp = function() {
    var e = !1
      , t = !1
      , n = !1
      , i = function(e, t) {
        if ("1" !== e.getAttribute("data-kt-initialized")) {
            var n = {};
            e.hasAttribute("data-bs-delay-hide") && (n.hide = e.getAttribute("data-bs-delay-hide")),
            e.hasAttribute("data-bs-delay-show") && (n.show = e.getAttribute("data-bs-delay-show")),
            n && (t.delay = n),
            e.hasAttribute("data-bs-dismiss") && "click" == e.getAttribute("data-bs-dismiss") && (t.dismiss = "click");
            var i = new bootstrap.Tooltip(e,t);
            return t.dismiss && "click" === t.dismiss && e.addEventListener("click", (function(e) {
                i.hide()
            }
            )),
            e.setAttribute("data-kt-initialized", "1"),
            i
        }
    }
      , r = function(e, t) {
        if ("1" !== e.getAttribute("data-kt-initialized")) {
            var n = {};
            e.hasAttribute("data-bs-delay-hide") && (n.hide = e.getAttribute("data-bs-delay-hide")),
            e.hasAttribute("data-bs-delay-show") && (n.show = e.getAttribute("data-bs-delay-show")),
            n && (t.delay = n),
            "true" == e.getAttribute("data-bs-dismiss") && (t.dismiss = !0),
            !0 === t.dismiss && (t.template = '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>');
            var i = new bootstrap.Popover(e,t);
            if (!0 === t.dismiss) {
                var r = function(e) {
                    i.hide()
                };
                e.addEventListener("shown.bs.popover", (function() {
                    document.getElementById(e.getAttribute("aria-describedby")).addEventListener("click", r)
                }
                )),
                e.addEventListener("hide.bs.popover", (function() {
                    document.getElementById(e.getAttribute("aria-describedby")).removeEventListener("click", r)
                }
                ))
            }
            return e.setAttribute("data-kt-initialized", "1"),
            i
        }
    }
      , o = function() {
        "undefined" != typeof countUp && [].slice.call(document.querySelectorAll('[data-kt-countup="true"]:not(.counted)')).map((function(e) {
            if (KTUtil.isInViewport(e) && KTUtil.visible(e)) {
                if ("1" === e.getAttribute("data-kt-initialized"))
                    return;
                var t = {}
                  , n = e.getAttribute("data-kt-countup-value");
                n = parseFloat(n.replace(/,/g, "")),
                e.hasAttribute("data-kt-countup-start-val") && (t.startVal = parseFloat(e.getAttribute("data-kt-countup-start-val"))),
                e.hasAttribute("data-kt-countup-duration") && (t.duration = parseInt(e.getAttribute("data-kt-countup-duration"))),
                e.hasAttribute("data-kt-countup-decimal-places") && (t.decimalPlaces = parseInt(e.getAttribute("data-kt-countup-decimal-places"))),
                e.hasAttribute("data-kt-countup-prefix") && (t.prefix = e.getAttribute("data-kt-countup-prefix")),
                e.hasAttribute("data-kt-countup-separator") && (t.separator = e.getAttribute("data-kt-countup-separator")),
                e.hasAttribute("data-kt-countup-suffix") && (t.suffix = e.getAttribute("data-kt-countup-suffix")),
                new countUp.CountUp(e,n,t).start(),
                e.classList.add("counted"),
                e.setAttribute("data-kt-initialized", "1")
            }
        }
        ))
    }
      , a = function(e) {
        if (!e)
            return;
        const t = {};
        e.getAttributeNames().forEach((function(n) {
            if (/^data-tns-.*/g.test(n)) {
                let r = n.replace("data-tns-", "").toLowerCase().replace(/(?:[\s-])\w/g, (function(e) {
                    return e.replace("-", "").toUpperCase()
                }
                ));
                if ("data-tns-responsive" === n) {
                    const i = e.getAttribute(n).replace(/(\w+:)|(\w+ :)/g, (function(e) {
                        return '"' + e.substring(0, e.length - 1) + '":'
                    }
                    ));
                    try {
                        t[r] = JSON.parse(i)
                    } catch (e) {}
                } else
                    t[r] = "true" === (i = e.getAttribute(n)) || "false" !== i && i
            }
            var i
        }
        ));
        const n = Object.assign({}, {
            container: e,
            slideBy: "page",
            autoplay: !0,
            center: !0,
            autoplayButtonOutput: !1
        }, t);
        return e.closest(".tns") && KTUtil.addClass(e.closest(".tns"), "tns-initiazlied"),
        tns(n)
    };
    return {
        init: function() {
            var l;
            !function() {
                if ("undefined" == typeof lozad)
                    return;
                lozad().observe()
            }(),
            !0 !== e && "undefined" != typeof SmoothScroll && new SmoothScroll('a[data-kt-scroll-toggle][href*="#"]',{
                speed: 1e3,
                speedAsDuration: !0,
                offset: function(e, t) {
                    return e.hasAttribute("data-kt-scroll-offset") ? KTUtil.getResponsiveValue(e.getAttribute("data-kt-scroll-offset")) : 0
                }
            }),
            KTUtil.on(document.body, '[data-kt-card-action="remove"]', "click", (function(e) {
                e.preventDefault();
                const t = this.closest(".card");
                if (!t)
                    return;
                const n = this.getAttribute("data-kt-card-confirm-message");
                "true" === this.getAttribute("data-kt-card-confirm") ? Swal.fire({
                    text: n || "Are you sure to remove ?",
                    icon: "warning",
                    buttonsStyling: !1,
                    confirmButtonText: "Confirm",
                    denyButtonText: "Cancel",
                    customClass: {
                        confirmButton: "btn btn-primary",
                        denyButton: "btn btn-danger"
                    }
                }).then((function(e) {
                    e.isConfirmed && t.remove()
                }
                )) : t.remove()
            }
            )),
            (l = Array.prototype.slice.call(document.querySelectorAll("[data-bs-stacked-modal]"))) && l.length > 0 && l.forEach((e=>{
                "1" !== e.getAttribute("data-kt-initialized") && (e.setAttribute("data-kt-initialized", "1"),
                e.addEventListener("click", (function(e) {
                    e.preventDefault();
                    const t = document.querySelector(this.getAttribute("data-bs-stacked-modal"));
                    t && new bootstrap.Modal(t,{
                        backdrop: !1
                    }).show()
                }
                )))
            }
            )),
            !0 !== e && KTUtil.on(document.body, '[data-kt-check="true"]', "change", (function(e) {
                var t = this
                  , n = document.querySelectorAll(t.getAttribute("data-kt-check-target"));
                KTUtil.each(n, (function(e) {
                    "checkbox" == e.type ? e.checked = t.checked : e.classList.toggle("active")
                }
                ))
            }
            )),
            !0 !== e && KTUtil.on(document.body, '.collapsible[data-bs-toggle="collapse"]', "click", (function(e) {
                if (this.classList.contains("collapsed") ? (this.classList.remove("active"),
                this.blur()) : this.classList.add("active"),
                this.hasAttribute("data-kt-toggle-text")) {
                    var t = this.getAttribute("data-kt-toggle-text")
                      , n = (n = this.querySelector('[data-kt-toggle-text-target="true"]')) || this;
                    this.setAttribute("data-kt-toggle-text", n.innerText),
                    n.innerText = t
                }
            }
            )),
            !0 !== e && KTUtil.on(document.body, '[data-kt-rotate="true"]', "click", (function(e) {
                this.classList.contains("active") ? (this.classList.remove("active"),
                this.blur()) : this.classList.add("active")
            }
            )),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map((function(e) {
                i(e, {})
            }
            )),
            [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]')).map((function(e) {
                r(e, {})
            }
            )),
            [].slice.call(document.querySelectorAll(".toast")).map((function(e) {
                if ("1" !== e.getAttribute("data-kt-initialized"))
                    return e.setAttribute("data-kt-initialized", "1"),
                    new bootstrap.Toast(e,{})
            }
            )),
            function() {
                if ("undefined" != typeof jQuery && void 0 !== $.fn.daterangepicker) {
                    var e = [].slice.call(document.querySelectorAll('[data-kt-daterangepicker="true"]'))
                      , t = moment().subtract(29, "days")
                      , n = moment();
                    e.map((function(e) {
                        if ("1" !== e.getAttribute("data-kt-initialized")) {
                            var i = e.querySelector("div")
                              , r = e.hasAttribute("data-kt-daterangepicker-opens") ? e.getAttribute("data-kt-daterangepicker-opens") : "left"
                              , o = function(e, t) {
                                var n = moment();
                                i && (n.isSame(e, "day") && n.isSame(t, "day") ? i.innerHTML = e.format("D MMM YYYY") : i.innerHTML = e.format("D MMM YYYY") + " - " + t.format("D MMM YYYY"))
                            };
                            "today" === e.getAttribute("data-kt-daterangepicker-range") && (t = moment(),
                            n = moment()),
                            $(e).daterangepicker({
                                startDate: t,
                                endDate: n,
                                opens: r,
                                ranges: {
                                    Today: [moment(), moment()],
                                    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
                                    "Last 7 Days": [moment().subtract(6, "days"), moment()],
                                    "Last 30 Days": [moment().subtract(29, "days"), moment()],
                                    "This Month": [moment().startOf("month"), moment().endOf("month")],
                                    "Last Month": [moment().subtract(1, "month").startOf("month"), moment().subtract(1, "month").endOf("month")]
                                }
                            }, o),
                            o(t, n),
                            e.setAttribute("data-kt-initialized", "1")
                        }
                    }
                    ))
                }
            }(),
            [].slice.call(document.querySelectorAll('[data-kt-buttons="true"]')).map((function(e) {
                if ("1" !== e.getAttribute("data-kt-initialized")) {
                    var t = e.hasAttribute("data-kt-buttons-target") ? e.getAttribute("data-kt-buttons-target") : ".btn"
                      , n = [].slice.call(e.querySelectorAll(t));
                    KTUtil.on(e, t, "click", (function(e) {
                        n.map((function(e) {
                            e.classList.remove("active")
                        }
                        )),
                        this.classList.add("active")
                    }
                    )),
                    e.setAttribute("data-kt-initialized", "1")
                }
            }
            )),
            "undefined" != typeof jQuery && void 0 !== $.fn.select2 && ([].slice.call(document.querySelectorAll('[data-control="select2"], [data-kt-select2="true"]')).map((function(e) {
                if ("1" !== e.getAttribute("data-kt-initialized")) {
                    var t = {
                        dir: document.body.getAttribute("direction")
                    };
                    "true" == e.getAttribute("data-hide-search") && (t.minimumResultsForSearch = 1 / 0),
                    $(e).select2(t),
                    e.setAttribute("data-kt-initialized", "1")
                }
            }
            )),
            !1 === t && (t = !0,
            $(document).on("select2:open", (function(e) {
                var t = document.querySelectorAll(".select2-container--open .select2-search__field");
                t.length > 0 && t[t.length - 1].focus()
            }
            )))),
            o(),
            "undefined" != typeof countUp && (!1 === n && (o(),
            window.addEventListener("scroll", o)),
            [].slice.call(document.querySelectorAll('[data-kt-countup-tabs="true"][data-bs-toggle="tab"]')).map((function(e) {
                "1" !== e.getAttribute("data-kt-initialized") && (e.addEventListener("shown.bs.tab", o),
                e.setAttribute("data-kt-initialized", "1"))
            }
            )),
            n = !0),
            "undefined" != typeof autosize && [].slice.call(document.querySelectorAll('[data-kt-autosize="true"]')).map((function(e) {
                "1" !== e.getAttribute("data-kt-initialized") && (autosize(e),
                e.setAttribute("data-kt-initialized", "1"))
            }
            )),
            function() {
                if ("undefined" == typeof tns)
                    return;
                const e = Array.prototype.slice.call(document.querySelectorAll('[data-tns="true"]'), 0);
                (e || 0 !== e.length) && e.forEach((function(e) {
                    "1" !== e.getAttribute("data-kt-initialized") && (a(e),
                    e.setAttribute("data-kt-initialized", "1"))
                }
                ))
            }(),
            e = !0
        },
        initTinySlider: function(e) {
            a(e)
        },
        showPageLoading: function() {
            document.body.classList.add("page-loading"),
            document.body.setAttribute("data-kt-app-page-loading", "on")
        },
        hidePageLoading: function() {
            document.body.classList.remove("page-loading"),
            document.body.removeAttribute("data-kt-app-page-loading")
        },
        createBootstrapPopover: function(e, t) {
            return r(e, t)
        },
        createBootstrapTooltip: function(e, t) {
            return i(e, t)
        }
    }
}();
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTApp);
var KTBlockUI = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            zIndex: !1,
            overlayClass: "",
            overflow: "hidden",
            message: '<span class="spinner-border text-primary"></span>'
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.element = e,
            n.overlayElement = null,
            n.blocked = !1,
            n.positionChanged = !1,
            n.overflowChanged = !1,
            KTUtil.data(n.element).set("blockui", n)
        };
        KTUtil.data(e).has("blockui") ? n = KTUtil.data(e).get("blockui") : r(),
        n.block = function() {
            !function() {
                if (!1 !== KTEventHandler.trigger(n.element, "kt.blockui.block", n)) {
                    var e = "BODY" === n.element.tagName
                      , t = KTUtil.css(n.element, "position")
                      , i = KTUtil.css(n.element, "overflow")
                      , r = e ? 1e4 : 1;
                    n.options.zIndex > 0 ? r = n.options.zIndex : "auto" != KTUtil.css(n.element, "z-index") && (r = KTUtil.css(n.element, "z-index")),
                    n.element.classList.add("blockui"),
                    "absolute" !== t && "relative" !== t && "fixed" !== t || (KTUtil.css(n.element, "position", "relative"),
                    n.positionChanged = !0),
                    "hidden" === n.options.overflow && "visible" === i && (KTUtil.css(n.element, "overflow", "hidden"),
                    n.overflowChanged = !0),
                    n.overlayElement = document.createElement("DIV"),
                    n.overlayElement.setAttribute("class", "blockui-overlay " + n.options.overlayClass),
                    n.overlayElement.innerHTML = n.options.message,
                    KTUtil.css(n.overlayElement, "z-index", r),
                    n.element.append(n.overlayElement),
                    n.blocked = !0,
                    KTEventHandler.trigger(n.element, "kt.blockui.after.blocked", n)
                }
            }()
        }
        ,
        n.release = function() {
            !1 !== KTEventHandler.trigger(n.element, "kt.blockui.release", n) && (n.element.classList.add("blockui"),
            n.positionChanged && KTUtil.css(n.element, "position", ""),
            n.overflowChanged && KTUtil.css(n.element, "overflow", ""),
            n.overlayElement && KTUtil.remove(n.overlayElement),
            n.blocked = !1,
            KTEventHandler.trigger(n.element, "kt.blockui.released", n))
        }
        ,
        n.isBlocked = function() {
            return n.blocked
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("blockui")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTBlockUI.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("blockui") ? KTUtil.data(e).get("blockui") : null
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTBlockUI);
var KTCookie = {
    get: function(e) {
        var t = document.cookie.match(new RegExp("(?:^|; )" + e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
        return t ? decodeURIComponent(t[1]) : null
    },
    set: function(e, t, n) {
        null == n && (n = {}),
        (n = Object.assign({}, {
            path: "/"
        }, n)).expires instanceof Date && (n.expires = n.expires.toUTCString());
        var i = encodeURIComponent(e) + "=" + encodeURIComponent(t);
        for (var r in n)
            if (!1 !== n.hasOwnProperty(r)) {
                i += "; " + r;
                var o = n[r];
                !0 !== o && (i += "=" + o)
            }
        document.cookie = i
    },
    remove: function(e) {
        this.set(e, "", {
            "max-age": -1
        })
    }
};
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTCookie);
var KTDialer = function(e, t) {
    var n = this;
    if (e) {
        var i = {
            min: null,
            max: null,
            step: 1,
            decimals: 0,
            prefix: "",
            suffix: ""
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.element = e,
            n.incElement = n.element.querySelector('[data-kt-dialer-control="increase"]'),
            n.decElement = n.element.querySelector('[data-kt-dialer-control="decrease"]'),
            n.inputElement = n.element.querySelector("input[type]"),
            c("decimals") && (n.options.decimals = parseInt(c("decimals"))),
            c("prefix") && (n.options.prefix = c("prefix")),
            c("suffix") && (n.options.suffix = c("suffix")),
            c("step") && (n.options.step = parseFloat(c("step"))),
            c("min") && (n.options.min = parseFloat(c("min"))),
            c("max") && (n.options.max = parseFloat(c("max"))),
            n.value = parseFloat(n.inputElement.value.replace(/[^\d.]/g, "")),
            s(),
            o(),
            KTUtil.data(n.element).set("dialer", n)
        }
          , o = function() {
            KTUtil.addEvent(n.incElement, "click", (function(e) {
                e.preventDefault(),
                a()
            }
            )),
            KTUtil.addEvent(n.decElement, "click", (function(e) {
                e.preventDefault(),
                l()
            }
            )),
            KTUtil.addEvent(n.inputElement, "input", (function(e) {
                e.preventDefault(),
                s()
            }
            ))
        }
          , a = function() {
            return KTEventHandler.trigger(n.element, "kt.dialer.increase", n),
            n.inputElement.value = n.value + n.options.step,
            s(),
            KTEventHandler.trigger(n.element, "kt.dialer.increased", n),
            n
        }
          , l = function() {
            return KTEventHandler.trigger(n.element, "kt.dialer.decrease", n),
            n.inputElement.value = n.value - n.options.step,
            s(),
            KTEventHandler.trigger(n.element, "kt.dialer.decreased", n),
            n
        }
          , s = function(e) {
            KTEventHandler.trigger(n.element, "kt.dialer.change", n),
            n.value = void 0 !== e ? e : u(n.inputElement.value),
            null !== n.options.min && n.value < n.options.min && (n.value = n.options.min),
            null !== n.options.max && n.value > n.options.max && (n.value = n.options.max),
            n.inputElement.value = d(n.value),
            n.inputElement.dispatchEvent(new Event("change")),
            KTEventHandler.trigger(n.element, "kt.dialer.changed", n)
        }
          , u = function(e) {
            return e = e.replace(/[^0-9.-]/g, "").replace(/(\..*)\./g, "$1").replace(/(?!^)-/g, "").replace(/^0+(\d)/gm, "$1"),
            e = parseFloat(e),
            isNaN(e) && (e = 0),
            e
        }
          , d = function(e) {
            return n.options.prefix + parseFloat(e).toFixed(n.options.decimals) + n.options.suffix
        }
          , c = function(e) {
            return !0 === n.element.hasAttribute("data-kt-dialer-" + e) ? n.element.getAttribute("data-kt-dialer-" + e) : null
        };
        !0 === KTUtil.data(e).has("dialer") ? n = KTUtil.data(e).get("dialer") : r(),
        n.setMinValue = function(e) {
            n.options.min = e
        }
        ,
        n.setMaxValue = function(e) {
            n.options.max = e
        }
        ,
        n.setValue = function(e) {
            s(e)
        }
        ,
        n.getValue = function() {
            return n.inputElement.value
        }
        ,
        n.update = function() {
            s()
        }
        ,
        n.increase = function() {
            return a()
        }
        ,
        n.decrease = function() {
            return l()
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("dialer")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTDialer.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("dialer") ? KTUtil.data(e).get("dialer") : null
}
,
KTDialer.createInstances = function(e='[data-kt-dialer="true"]') {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTDialer(t[n])
}
,
KTDialer.init = function() {
    KTDialer.createInstances()
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTDialer);
var KTDrawerHandlersInitialized = !1
  , KTDrawer = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            overlay: !0,
            direction: "end",
            baseClass: "drawer",
            overlayClass: "drawer-overlay"
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("drawer"),
            n.element = e,
            n.overlayElement = null,
            n.name = n.element.getAttribute("data-kt-drawer-name"),
            n.shown = !1,
            n.lastWidth,
            n.toggleElement = null,
            n.element.setAttribute("data-kt-drawer", "true"),
            o(),
            u(),
            KTUtil.data(n.element).set("drawer", n)
        }
          , o = function() {
            var e = m("toggle")
              , t = m("close");
            null !== e && e.length > 0 && KTUtil.on(document.body, e, "click", (function(e) {
                e.preventDefault(),
                n.toggleElement = this,
                a()
            }
            )),
            null !== t && t.length > 0 && KTUtil.on(document.body, t, "click", (function(e) {
                e.preventDefault(),
                n.closeElement = this,
                l()
            }
            ))
        }
          , a = function() {
            !1 !== KTEventHandler.trigger(n.element, "kt.drawer.toggle", n) && (!0 === n.shown ? l() : s(),
            KTEventHandler.trigger(n.element, "kt.drawer.toggled", n))
        }
          , l = function() {
            !1 !== KTEventHandler.trigger(n.element, "kt.drawer.hide", n) && (n.shown = !1,
            c(),
            document.body.removeAttribute("data-kt-drawer-" + n.name, "on"),
            document.body.removeAttribute("data-kt-drawer"),
            KTUtil.removeClass(n.element, n.options.baseClass + "-on"),
            null !== n.toggleElement && KTUtil.removeClass(n.toggleElement, "active"),
            KTEventHandler.trigger(n.element, "kt.drawer.after.hidden", n))
        }
          , s = function() {
            !1 !== KTEventHandler.trigger(n.element, "kt.drawer.show", n) && (n.shown = !0,
            d(),
            document.body.setAttribute("data-kt-drawer-" + n.name, "on"),
            document.body.setAttribute("data-kt-drawer", "on"),
            KTUtil.addClass(n.element, n.options.baseClass + "-on"),
            null !== n.toggleElement && KTUtil.addClass(n.toggleElement, "active"),
            KTEventHandler.trigger(n.element, "kt.drawer.shown", n))
        }
          , u = function() {
            var e = f()
              , t = m("direction")
              , i = m("top")
              , r = m("bottom")
              , o = m("start")
              , a = m("end");
            !0 === KTUtil.hasClass(n.element, n.options.baseClass + "-on") && "on" === String(document.body.getAttribute("data-kt-drawer-" + n.name + "-")) ? n.shown = !0 : n.shown = !1,
            !0 === m("activate") ? (KTUtil.addClass(n.element, n.options.baseClass),
            KTUtil.addClass(n.element, n.options.baseClass + "-" + t),
            KTUtil.css(n.element, "width", e, !0),
            n.lastWidth = e,
            i && KTUtil.css(n.element, "top", i),
            r && KTUtil.css(n.element, "bottom", r),
            o && (KTUtil.isRTL() ? KTUtil.css(n.element, "right", o) : KTUtil.css(n.element, "left", o)),
            a && (KTUtil.isRTL() ? KTUtil.css(n.element, "left", a) : KTUtil.css(n.element, "right", a))) : (KTUtil.removeClass(n.element, n.options.baseClass),
            KTUtil.removeClass(n.element, n.options.baseClass + "-" + t),
            KTUtil.css(n.element, "width", ""),
            i && KTUtil.css(n.element, "top", ""),
            r && KTUtil.css(n.element, "bottom", ""),
            o && (KTUtil.isRTL() ? KTUtil.css(n.element, "right", "") : KTUtil.css(n.element, "left", "")),
            a && (KTUtil.isRTL() ? KTUtil.css(n.element, "left", "") : KTUtil.css(n.element, "right", "")),
            l())
        }
          , d = function() {
            !0 === m("overlay") && (n.overlayElement = document.createElement("DIV"),
            KTUtil.css(n.overlayElement, "z-index", KTUtil.css(n.element, "z-index") - 1),
            document.body.append(n.overlayElement),
            KTUtil.addClass(n.overlayElement, m("overlay-class")),
            KTUtil.addEvent(n.overlayElement, "click", (function(e) {
                e.preventDefault(),
                !0 !== m("permanent") && l()
            }
            )))
        }
          , c = function() {
            null !== n.overlayElement && KTUtil.remove(n.overlayElement)
        }
          , m = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-drawer-" + e)) {
                var t = n.element.getAttribute("data-kt-drawer-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        }
          , f = function() {
            var e = m("width");
            return "auto" === e && (e = KTUtil.css(n.element, "width")),
            e
        };
        KTUtil.data(e).has("drawer") ? n = KTUtil.data(e).get("drawer") : r(),
        n.toggle = function() {
            return a()
        }
        ,
        n.show = function() {
            return s()
        }
        ,
        n.hide = function() {
            return l()
        }
        ,
        n.isShown = function() {
            return n.shown
        }
        ,
        n.update = function() {
            u()
        }
        ,
        n.goElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("drawer")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTDrawer.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("drawer") ? KTUtil.data(e).get("drawer") : null
}
,
KTDrawer.hideAll = function(e=null, t='[data-kt-drawer="true"]') {
    var n = document.querySelectorAll(t);
    if (n && n.length > 0)
        for (var i = 0, r = n.length; i < r; i++) {
            var o = n[i]
              , a = KTDrawer.getInstance(o);
            a && (e ? o !== e && a.hide() : a.hide())
        }
}
,
KTDrawer.updateAll = function(e='[data-kt-drawer="true"]') {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++) {
            var r = KTDrawer.getInstance(t[n]);
            r && r.update()
        }
}
,
KTDrawer.createInstances = function(e='[data-kt-drawer="true"]') {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTDrawer(t[n])
}
,
KTDrawer.handleShow = function() {
    KTUtil.on(document.body, '[data-kt-drawer-show="true"][data-kt-drawer-target]', "click", (function(e) {
        e.preventDefault();
        var t = document.querySelector(this.getAttribute("data-kt-drawer-target"));
        t && KTDrawer.getInstance(t).show()
    }
    ))
}
,
KTDrawer.handleDismiss = function() {
    KTUtil.on(document.body, '[data-kt-drawer-dismiss="true"]', "click", (function(e) {
        var t = this.closest('[data-kt-drawer="true"]');
        if (t) {
            var n = KTDrawer.getInstance(t);
            n.isShown() && n.hide()
        }
    }
    ))
}
,
KTDrawer.handleResize = function() {
    window.addEventListener("resize", (function() {
        KTUtil.throttle(undefined, (function() {
            var e = document.querySelectorAll('[data-kt-drawer="true"]');
            if (e && e.length > 0)
                for (var t = 0, n = e.length; t < n; t++) {
                    var i = KTDrawer.getInstance(e[t]);
                    i && i.update()
                }
        }
        ), 200)
    }
    ))
}
,
KTDrawer.init = function() {
    KTDrawer.createInstances(),
    !1 === KTDrawerHandlersInitialized && (KTDrawer.handleResize(),
    KTDrawer.handleShow(),
    KTDrawer.handleDismiss(),
    KTDrawerHandlersInitialized = !0)
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTDrawer);
var KTEventHandler = function() {
    var e = {}
      , t = function(t, n, i, r) {
        var o = KTUtil.getUniqueId("event")
          , a = KTUtil.data(t).get(n);
        return a || (a = []),
        a.push(o),
        KTUtil.data(t).set(n, a),
        e[n] || (e[n] = {}),
        e[n][o] = {
            name: n,
            callback: i,
            one: r,
            fired: !1
        },
        o
    };
    return {
        trigger: function(t, n, i) {
            return function(t, n, i) {
                var r, o = !0;
                if (!0 === KTUtil.data(t).has(n))
                    for (var a, l = KTUtil.data(t).get(n), s = 0; s < l.length; s++)
                        if (a = l[s],
                        e[n] && e[n][a]) {
                            var u = e[n][a];
                            u.name === n && (1 == u.one ? 0 == u.fired && (e[n][a].fired = !0,
                            r = u.callback.call(this, i)) : r = u.callback.call(this, i),
                            !1 === r && (o = !1))
                        }
                return o
            }(t, n, i)
        },
        on: function(e, n, i) {
            return t(e, n, i)
        },
        one: function(e, n, i) {
            return t(e, n, i, !0)
        },
        off: function(t, n, i) {
            return function(t, n, i) {
                var r = KTUtil.data(t).get(n)
                  , o = r && r.indexOf(i);
                -1 !== o && (r.splice(o, 1),
                KTUtil.data(t).set(n, r)),
                e[n] && e[n][i] && delete e[n][i]
            }(t, n, i)
        },
        debug: function() {
            for (var t in e)
                e.hasOwnProperty(t) && console.log(t)
        }
    }
}();
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTEventHandler);
var KTFeedback = function(e) {
    var t = this
      , n = {
        width: 100,
        placement: "top-center",
        content: "",
        type: "popup"
    }
      , i = function() {
        t.options = KTUtil.deepExtend({}, n, e),
        t.uid = KTUtil.getUniqueId("feedback"),
        t.element,
        t.shown = !1,
        r(),
        KTUtil.data(t.element).set("feedback", t)
    }
      , r = function() {
        KTUtil.addEvent(t.element, "click", (function(e) {
            e.preventDefault(),
            _go()
        }
        ))
    }
      , o = function() {
        t.element = document.createElement("DIV"),
        KTUtil.addClass(t.element, "feedback feedback-popup"),
        KTUtil.setHTML(t.element, t.options.content),
        "top-center" == t.options.placement && a(),
        document.body.appendChild(t.element),
        KTUtil.addClass(t.element, "feedback-shown"),
        t.shown = !0
    }
      , a = function() {
        var e = KTUtil.getResponsiveValue(t.options.width)
          , n = KTUtil.css(t.element, "height");
        KTUtil.addClass(t.element, "feedback-top-center"),
        KTUtil.css(t.element, "width", e),
        KTUtil.css(t.element, "left", "50%"),
        KTUtil.css(t.element, "top", "-" + n)
    }
      , l = function() {
        t.element.remove()
    };
    i(),
    t.show = function() {
        return function() {
            if (!1 !== KTEventHandler.trigger(t.element, "kt.feedback.show", t))
                return "popup" === t.options.type && o(),
                KTEventHandler.trigger(t.element, "kt.feedback.shown", t),
                t
        }()
    }
    ,
    t.hide = function() {
        return function() {
            if (!1 !== KTEventHandler.trigger(t.element, "kt.feedback.hide", t))
                return "popup" === t.options.type && l(),
                t.shown = !1,
                KTEventHandler.trigger(t.element, "kt.feedback.hidden", t),
                t
        }()
    }
    ,
    t.isShown = function() {
        return t.shown
    }
    ,
    t.getElement = function() {
        return t.element
    }
    ,
    t.destroy = function() {
        KTUtil.data(t.element).remove("feedback")
    }
    ,
    t.on = function(e, n) {
        return KTEventHandler.on(t.element, e, n)
    }
    ,
    t.one = function(e, n) {
        return KTEventHandler.one(t.element, e, n)
    }
    ,
    t.off = function(e, n) {
        return KTEventHandler.off(t.element, e, n)
    }
    ,
    t.trigger = function(e, n) {
        return KTEventHandler.trigger(t.element, e, n, t, n)
    }
};
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTFeedback);
var KTImageInput = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {}
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("image-input"),
            n.element = e,
            n.inputElement = KTUtil.find(e, 'input[type="file"]'),
            n.wrapperElement = KTUtil.find(e, ".image-input-wrapper"),
            n.cancelElement = KTUtil.find(e, '[data-kt-image-input-action="cancel"]'),
            n.removeElement = KTUtil.find(e, '[data-kt-image-input-action="remove"]'),
            n.hiddenElement = KTUtil.find(e, 'input[type="hidden"]'),
            n.src = KTUtil.css(n.wrapperElement, "backgroundImage"),
            n.element.setAttribute("data-kt-image-input", "true"),
            o(),
            KTUtil.data(n.element).set("image-input", n)
        }
          , o = function() {
            KTUtil.addEvent(n.inputElement, "change", a),
            KTUtil.addEvent(n.cancelElement, "click", l),
            KTUtil.addEvent(n.removeElement, "click", s)
        }
          , a = function(e) {
            if (e.preventDefault(),
            null !== n.inputElement && n.inputElement.files && n.inputElement.files[0]) {
                if (!1 === KTEventHandler.trigger(n.element, "kt.imageinput.change", n))
                    return;
                var t = new FileReader;
                t.onload = function(e) {
                    KTUtil.css(n.wrapperElement, "background-image", "url(" + e.target.result + ")")
                }
                ,
                t.readAsDataURL(n.inputElement.files[0]),
                n.element.classList.add("image-input-changed"),
                n.element.classList.remove("image-input-empty"),
                KTEventHandler.trigger(n.element, "kt.imageinput.changed", n)
            }
        }
          , l = function(e) {
            e.preventDefault(),
            !1 !== KTEventHandler.trigger(n.element, "kt.imageinput.cancel", n) && (n.element.classList.remove("image-input-changed"),
            n.element.classList.remove("image-input-empty"),
            "none" === n.src ? (KTUtil.css(n.wrapperElement, "background-image", ""),
            n.element.classList.add("image-input-empty")) : KTUtil.css(n.wrapperElement, "background-image", n.src),
            n.inputElement.value = "",
            null !== n.hiddenElement && (n.hiddenElement.value = "0"),
            KTEventHandler.trigger(n.element, "kt.imageinput.canceled", n))
        }
          , s = function(e) {
            e.preventDefault(),
            !1 !== KTEventHandler.trigger(n.element, "kt.imageinput.remove", n) && (n.element.classList.remove("image-input-changed"),
            n.element.classList.add("image-input-empty"),
            KTUtil.css(n.wrapperElement, "background-image", "none"),
            n.inputElement.value = "",
            null !== n.hiddenElement && (n.hiddenElement.value = "1"),
            KTEventHandler.trigger(n.element, "kt.imageinput.removed", n))
        };
        !0 === KTUtil.data(e).has("image-input") ? n = KTUtil.data(e).get("image-input") : r(),
        n.getInputElement = function() {
            return n.inputElement
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("image-input")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTImageInput.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("image-input") ? KTUtil.data(e).get("image-input") : null
}
,
KTImageInput.createInstances = function(e="[data-kt-image-input]") {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTImageInput(t[n])
}
,
KTImageInput.init = function() {
    KTImageInput.createInstances()
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTImageInput);
var KTMenuHandlersInitialized = !1
  , KTMenu = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            dropdown: {
                hoverTimeout: 200,
                zindex: 107
            },
            accordion: {
                slideSpeed: 250,
                expand: !1
            }
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("menu"),
            n.element = e,
            n.triggerElement,
            n.disabled = !1,
            n.element.setAttribute("data-kt-menu", "true"),
            d(),
            u(),
            KTUtil.data(n.element).set("menu", n)
        }
          , o = function(e) {
            e || (e = n.triggerElement),
            !0 === m(e) ? l(e) : a(e)
        }
          , a = function(e) {
            e || (e = n.triggerElement),
            !0 !== m(e) && ("dropdown" === v(e) ? w(e) : "accordion" === v(e) && A(e),
            KTUtil.data(e).set("type", v(e)))
        }
          , l = function(e) {
            e || (e = n.triggerElement),
            !1 !== m(e) && ("dropdown" === v(e) ? y(e) : "accordion" === v(e) && x(e))
        }
          , s = function(e) {
            if (!1 !== f(e)) {
                var t = g(e);
                KTUtil.data(e).has("type") && KTUtil.data(e).get("type") !== v(e) && (KTUtil.removeClass(e, "hover"),
                KTUtil.removeClass(e, "show"),
                KTUtil.removeClass(t, "show"))
            }
        }
          , u = function() {
            var e = n.element.querySelectorAll(".menu-item[data-kt-menu-trigger]");
            if (e && e.length > 0)
                for (var t = 0, i = e.length; t < i; t++)
                    s(e[t])
        }
          , d = function() {
            var e = document.querySelector('[data-kt-menu-target="#' + n.element.getAttribute("id") + '"]');
            null !== e ? n.triggerElement = e : n.element.closest("[data-kt-menu-trigger]") ? n.triggerElement = n.element.closest("[data-kt-menu-trigger]") : n.element.parentNode && KTUtil.child(n.element.parentNode, "[data-kt-menu-trigger]") && (n.triggerElement = KTUtil.child(n.element.parentNode, "[data-kt-menu-trigger]")),
            n.triggerElement && KTUtil.data(n.triggerElement).set("menu", n)
        }
          , c = function(e) {
            return n.triggerElement === e
        }
          , m = function(e) {
            var t = g(e);
            return null !== t && ("dropdown" === v(e) ? !0 === KTUtil.hasClass(t, "show") && !0 === t.hasAttribute("data-popper-placement") : KTUtil.hasClass(e, "show"))
        }
          , f = function(e) {
            return KTUtil.hasClass(e, "menu-item") && e.hasAttribute("data-kt-menu-trigger")
        }
          , p = function(e) {
            return KTUtil.child(e, ".menu-link")
        }
          , g = function(e) {
            return !0 === c(e) ? n.element : !0 === e.classList.contains("menu-sub") ? e : KTUtil.data(e).has("sub") ? KTUtil.data(e).get("sub") : KTUtil.child(e, ".menu-sub")
        }
          , v = function(e) {
            var t = g(e);
            return t && parseInt(KTUtil.css(t, "z-index")) > 0 ? "dropdown" : "accordion"
        }
          , T = function(e) {
            var t, n;
            return c(e) || e.hasAttribute("data-kt-menu-trigger") ? e : KTUtil.data(e).has("item") ? KTUtil.data(e).get("item") : (t = e.closest(".menu-item")) ? t : (n = e.closest(".menu-sub")) && !0 === KTUtil.data(n).has("item") ? KTUtil.data(n).get("item") : void 0
        }
          , h = function(e) {
            var t, n = e.closest(".menu-sub");
            return n && KTUtil.data(n).has("item") ? KTUtil.data(n).get("item") : n && (t = n.closest(".menu-item[data-kt-menu-trigger]")) ? t : null
        }
          , K = function(e) {
            var t, i = [], r = 0;
            do {
                (t = h(e)) && (i.push(t),
                e = t),
                r++
            } while (null !== t && r < 20);
            return n.triggerElement && i.unshift(n.triggerElement),
            i
        }
          , b = function(e) {
            var t = e;
            return KTUtil.data(e).get("sub") && (t = KTUtil.data(e).get("sub")),
            null !== t && t.querySelector(".menu-item[data-kt-menu-trigger]") || null
        }
          , k = function(e) {
            var t, n = [], i = 0;
            do {
                (t = b(e)) && (n.push(t),
                e = t),
                i++
            } while (null !== t && i < 20);
            return n
        }
          , w = function(e) {
            if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.dropdown.show", e)) {
                KTMenu.hideDropdowns(e);
                c(e) || p(e);
                var t = g(e)
                  , i = I(e, "width")
                  , r = I(e, "height")
                  , o = n.options.dropdown.zindex
                  , a = KTUtil.getHighestZindex(e);
                null !== a && a >= o && (o = a + 1),
                o > 0 && KTUtil.css(t, "z-index", o),
                null !== i && KTUtil.css(t, "width", i),
                null !== r && KTUtil.css(t, "height", r),
                KTUtil.css(t, "display", ""),
                KTUtil.css(t, "overflow", ""),
                U(e, t),
                KTUtil.addClass(e, "show"),
                KTUtil.addClass(e, "menu-dropdown"),
                KTUtil.addClass(t, "show"),
                !0 === I(e, "overflow") ? (document.body.appendChild(t),
                KTUtil.data(e).set("sub", t),
                KTUtil.data(t).set("item", e),
                KTUtil.data(t).set("menu", n)) : KTUtil.data(t).set("item", e),
                KTEventHandler.trigger(n.element, "kt.menu.dropdown.shown", e)
            }
        }
          , y = function(e) {
            if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.dropdown.hide", e)) {
                var t = g(e);
                KTUtil.css(t, "z-index", ""),
                KTUtil.css(t, "width", ""),
                KTUtil.css(t, "height", ""),
                KTUtil.removeClass(e, "show"),
                KTUtil.removeClass(e, "menu-dropdown"),
                KTUtil.removeClass(t, "show"),
                !0 === I(e, "overflow") && (e.classList.contains("menu-item") ? e.appendChild(t) : KTUtil.insertAfter(n.element, e),
                KTUtil.data(e).remove("sub"),
                KTUtil.data(t).remove("item"),
                KTUtil.data(t).remove("menu")),
                E(e),
                KTEventHandler.trigger(n.element, "kt.menu.dropdown.hidden", e)
            }
        }
          , U = function(e, t) {
            var n, i = I(e, "attach");
            n = i ? "parent" === i ? e.parentNode : document.querySelector(i) : e;
            var r = Popper.createPopper(n, t, S(e));
            KTUtil.data(e).set("popper", r)
        }
          , E = function(e) {
            !0 === KTUtil.data(e).has("popper") && (KTUtil.data(e).get("popper").destroy(),
            KTUtil.data(e).remove("popper"))
        }
          , S = function(e) {
            var t = I(e, "placement");
            t || (t = "right");
            var n = I(e, "offset")
              , i = n ? n.split(",") : [];
            return 2 === i.length && (i[0] = parseInt(i[0]),
            i[1] = parseInt(i[1])),
            {
                placement: t,
                strategy: !0 === I(e, "overflow") ? "absolute" : "fixed",
                modifiers: [{
                    name: "offset",
                    options: {
                        offset: i
                    }
                }, {
                    name: "preventOverflow",
                    options: {
                        altAxis: !1 !== I(e, "flip")
                    }
                }, {
                    name: "flip",
                    options: {
                        flipVariations: !1
                    }
                }]
            }
        }
          , A = function(e) {
            if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.accordion.show", e)) {
                var t = g(e)
                  , i = n.options.accordion.expand;
                !0 === I(e, "expand") ? i = !0 : !1 === I(e, "expand") ? i = !1 : !0 === I(n.element, "expand") && (i = !0),
                !1 === i && L(e),
                !0 === KTUtil.data(e).has("popper") && y(e),
                KTUtil.addClass(e, "hover"),
                KTUtil.addClass(e, "showing"),
                KTUtil.slideDown(t, n.options.accordion.slideSpeed, (function() {
                    KTUtil.removeClass(e, "showing"),
                    KTUtil.addClass(e, "show"),
                    KTUtil.addClass(t, "show"),
                    KTEventHandler.trigger(n.element, "kt.menu.accordion.shown", e)
                }
                ))
            }
        }
          , x = function(e) {
            if (!1 !== KTEventHandler.trigger(n.element, "kt.menu.accordion.hide", e)) {
                var t = g(e);
                KTUtil.addClass(e, "hiding"),
                KTUtil.slideUp(t, n.options.accordion.slideSpeed, (function() {
                    KTUtil.removeClass(e, "hiding"),
                    KTUtil.removeClass(e, "show"),
                    KTUtil.removeClass(t, "show"),
                    KTUtil.removeClass(e, "hover"),
                    KTEventHandler.trigger(n.element, "kt.menu.accordion.hidden", e)
                }
                ))
            }
        }
          , L = function(e) {
            var t, i = KTUtil.findAll(n.element, ".show[data-kt-menu-trigger]");
            if (i && i.length > 0)
                for (var r = 0, o = i.length; r < o; r++)
                    t = i[r],
                    "accordion" === v(t) && t !== e && !1 === e.contains(t) && !1 === t.contains(e) && x(t)
        }
          , I = function(e, t) {
            var n, i = null;
            return e && e.hasAttribute("data-kt-menu-" + t) && (n = e.getAttribute("data-kt-menu-" + t),
            null !== (i = KTUtil.getResponsiveValue(n)) && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1)),
            i
        };
        !0 === KTUtil.data(e).has("menu") ? n = KTUtil.data(e).get("menu") : r(),
        n.click = function(e, t) {
            return function(e, t) {
                if (t.preventDefault(),
                !0 !== n.disabled) {
                    var i = T(e);
                    "click" === I(i, "trigger") && (!1 === I(i, "toggle") ? a(i) : o(i))
                }
            }(e, t)
        }
        ,
        n.link = function(e, t) {
            return function(e, t) {
                !0 !== n.disabled && !1 !== KTEventHandler.trigger(n.element, "kt.menu.link.click", e) && (KTMenu.hideDropdowns(),
                KTEventHandler.trigger(n.element, "kt.menu.link.clicked", e))
            }(e)
        }
        ,
        n.dismiss = function(e, t) {
            return function(e, t) {
                var n = T(e)
                  , i = k(n);
                if (null !== n && "dropdown" === v(n) && (l(n),
                i.length > 0))
                    for (var r = 0, o = i.length; r < o; r++)
                        null !== i[r] && "dropdown" === v(i[r]) && l(tems[r])
            }(e)
        }
        ,
        n.mouseover = function(e, t) {
            return function(e, t) {
                var i = T(e);
                !0 !== n.disabled && null !== i && "hover" === I(i, "trigger") && ("1" === KTUtil.data(i).get("hover") && (clearTimeout(KTUtil.data(i).get("timeout")),
                KTUtil.data(i).remove("hover"),
                KTUtil.data(i).remove("timeout")),
                a(i))
            }(e)
        }
        ,
        n.mouseout = function(e, t) {
            return function(e, t) {
                var i = T(e);
                if (!0 !== n.disabled && null !== i && "hover" === I(i, "trigger")) {
                    var r = setTimeout((function() {
                        "1" === KTUtil.data(i).get("hover") && l(i)
                    }
                    ), n.options.dropdown.hoverTimeout);
                    KTUtil.data(i).set("hover", "1"),
                    KTUtil.data(i).set("timeout", r)
                }
            }(e)
        }
        ,
        n.getItemTriggerType = function(e) {
            return I(e, "trigger")
        }
        ,
        n.getItemSubType = function(e) {
            return v(e)
        }
        ,
        n.show = function(e) {
            return a(e)
        }
        ,
        n.hide = function(e) {
            return l(e)
        }
        ,
        n.toggle = function(e) {
            return o(e)
        }
        ,
        n.reset = function(e) {
            return s(e)
        }
        ,
        n.update = function() {
            return u()
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.setActiveLink = function(e) {
            return function(e) {
                var t = T(e);
                if (t) {
                    var i = K(t)
                      , r = e.closest(".tab-pane")
                      , o = [].slice.call(n.element.querySelectorAll(".menu-link.active"))
                      , a = [].slice.call(n.element.querySelectorAll(".menu-item.here, .menu-item.show"));
                    if ("accordion" === v(t) ? A(t) : t.classList.add("here"),
                    i && i.length > 0)
                        for (var l = 0, s = i.length; l < s; l++) {
                            var u = i[l];
                            "accordion" === v(u) ? A(u) : u.classList.add("here")
                        }
                    if (o.map((function(e) {
                        e.classList.remove("active")
                    }
                    )),
                    a.map((function(e) {
                        !1 === e.contains(t) && (e.classList.remove("here"),
                        e.classList.remove("show"))
                    }
                    )),
                    r && bootstrap.Tab) {
                        var d = n.element.querySelector('[data-bs-target="#' + r.getAttribute("id") + '"]')
                          , c = new bootstrap.Tab(d);
                        c && c.show()
                    }
                    e.classList.add("active")
                }
            }(e)
        }
        ,
        n.getLinkByAttribute = function(e, t="href") {
            return function(e, t="href") {
                var i = n.element.querySelector(".menu-link[" + t + '="' + e + '"]');
                if (i)
                    return i
            }(e, t)
        }
        ,
        n.getItemLinkElement = function(e) {
            return p(e)
        }
        ,
        n.getItemToggleElement = function(e) {
            return function(e) {
                return n.triggerElement ? n.triggerElement : p(e)
            }(e)
        }
        ,
        n.getItemSubElement = function(e) {
            return g(e)
        }
        ,
        n.getItemParentElements = function(e) {
            return K(e)
        }
        ,
        n.isItemSubShown = function(e) {
            return m(e)
        }
        ,
        n.isItemParentShown = function(e) {
            return function(e) {
                return KTUtil.parents(e, ".menu-item.show").length > 0
            }(e)
        }
        ,
        n.getTriggerElement = function() {
            return n.triggerElement
        }
        ,
        n.isItemDropdownPermanent = function(e) {
            return function(e) {
                return !0 === I(e, "permanent")
            }(e)
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("menu")
        }
        ,
        n.disable = function() {
            n.disabled = !0
        }
        ,
        n.enable = function() {
            n.disabled = !1
        }
        ,
        n.hideAccordions = function(e) {
            return L(e)
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
    }
};
KTMenu.getInstance = function(e) {
    var t;
    if (!e)
        return null;
    if (KTUtil.data(e).has("menu"))
        return KTUtil.data(e).get("menu");
    if ((t = e.closest(".menu")) && KTUtil.data(t).has("menu"))
        return KTUtil.data(t).get("menu");
    if (KTUtil.hasClass(e, "menu-link")) {
        var n = e.closest(".menu-sub");
        if (KTUtil.data(n).has("menu"))
            return KTUtil.data(n).get("menu")
    }
    return null
}
,
KTMenu.hideDropdowns = function(e) {
    var t = document.querySelectorAll(".show.menu-dropdown[data-kt-menu-trigger]");
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++) {
            var r = t[n]
              , o = KTMenu.getInstance(r);
            o && "dropdown" === o.getItemSubType(r) && (e ? !1 === o.getItemSubElement(r).contains(e) && !1 === r.contains(e) && r !== e && o.hide(r) : o.hide(r))
        }
}
,
KTMenu.updateDropdowns = function() {
    var e = document.querySelectorAll(".show.menu-dropdown[data-kt-menu-trigger]");
    if (e && e.length > 0)
        for (var t = 0, n = e.length; t < n; t++) {
            var i = e[t];
            KTUtil.data(i).has("popper") && KTUtil.data(i).get("popper").forceUpdate()
        }
}
,
KTMenu.initHandlers = function() {
    document.addEventListener("click", (function(e) {
        var t, n, i, r = document.querySelectorAll('.show.menu-dropdown[data-kt-menu-trigger]:not([data-kt-menu-static="true"])');
        if (r && r.length > 0)
            for (var o = 0, a = r.length; o < a; o++)
                if (t = r[o],
                (i = KTMenu.getInstance(t)) && "dropdown" === i.getItemSubType(t)) {
                    if (i.getElement(),
                    n = i.getItemSubElement(t),
                    t === e.target || t.contains(e.target))
                        continue;
                    if (n === e.target || n.contains(e.target))
                        continue;
                    i.hide(t)
                }
    }
    )),
    KTUtil.on(document.body, '.menu-item[data-kt-menu-trigger] > .menu-link, [data-kt-menu-trigger]:not(.menu-item):not([data-kt-menu-trigger="auto"])', "click", (function(e) {
        var t = KTMenu.getInstance(this);
        if (null !== t)
            return t.click(this, e)
    }
    )),
    KTUtil.on(document.body, ".menu-item:not([data-kt-menu-trigger]) > .menu-link", "click", (function(e) {
        var t = KTMenu.getInstance(this);
        if (null !== t)
            return t.link(this, e)
    }
    )),
    KTUtil.on(document.body, '[data-kt-menu-dismiss="true"]', "click", (function(e) {
        var t = KTMenu.getInstance(this);
        if (null !== t)
            return t.dismiss(this, e)
    }
    )),
    KTUtil.on(document.body, "[data-kt-menu-trigger], .menu-sub", "mouseover", (function(e) {
        var t = KTMenu.getInstance(this);
        if (null !== t && "dropdown" === t.getItemSubType(this))
            return t.mouseover(this, e)
    }
    )),
    KTUtil.on(document.body, "[data-kt-menu-trigger], .menu-sub", "mouseout", (function(e) {
        var t = KTMenu.getInstance(this);
        if (null !== t && "dropdown" === t.getItemSubType(this))
            return t.mouseout(this, e)
    }
    )),
    window.addEventListener("resize", (function() {
        var e;
        KTUtil.throttle(undefined, (function() {
            var t = document.querySelectorAll('[data-kt-menu="true"]');
            if (t && t.length > 0)
                for (var n = 0, i = t.length; n < i; n++)
                    (e = KTMenu.getInstance(t[n])) && e.update()
        }
        ), 200)
    }
    ))
}
,
KTMenu.updateByLinkAttribute = function(e, t="href") {
    var n = document.querySelectorAll('[data-kt-menu="true"]');
    if (n && n.length > 0)
        for (var i = 0, r = n.length; i < r; i++) {
            var o = KTMenu.getInstance(n[i]);
            if (o) {
                var a = o.getLinkByAttribute(e, t);
                a && o.setActiveLink(a)
            }
        }
}
,
KTMenu.createInstances = function(e='[data-kt-menu="true"]') {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTMenu(t[n])
}
,
KTMenu.init = function() {
    KTMenu.createInstances(),
    !1 === KTMenuHandlersInitialized && (KTMenu.initHandlers(),
    KTMenuHandlersInitialized = !0)
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTMenu);
var KTPasswordMeter = function(e, t) {
    var n = this;
    if (e) {
        var i = {
            minLength: 8,
            checkUppercase: !0,
            checkLowercase: !0,
            checkDigit: !0,
            checkChar: !0,
            scoreHighlightClass: "active"
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.score = 0,
            n.checkSteps = 5,
            n.element = e,
            n.inputElement = n.element.querySelector("input[type]"),
            n.visibilityElement = n.element.querySelector('[data-kt-password-meter-control="visibility"]'),
            n.highlightElement = n.element.querySelector('[data-kt-password-meter-control="highlight"]'),
            n.element.setAttribute("data-kt-password-meter", "true"),
            o(),
            KTUtil.data(n.element).set("password-meter", n)
        }
          , o = function() {
            n.highlightElement && n.inputElement.addEventListener("input", (function() {
                a()
            }
            )),
            n.visibilityElement && n.visibilityElement.addEventListener("click", (function() {
                p()
            }
            ))
        }
          , a = function() {
            var e = 0
              , t = m();
            !0 === l() && (e += t),
            !0 === n.options.checkUppercase && !0 === s() && (e += t),
            !0 === n.options.checkLowercase && !0 === u() && (e += t),
            !0 === n.options.checkDigit && !0 === d() && (e += t),
            !0 === n.options.checkChar && !0 === c() && (e += t),
            n.score = e,
            f()
        }
          , l = function() {
            return n.inputElement.value.length >= n.options.minLength
        }
          , s = function() {
            return /[a-z]/.test(n.inputElement.value)
        }
          , u = function() {
            return /[A-Z]/.test(n.inputElement.value)
        }
          , d = function() {
            return /[0-9]/.test(n.inputElement.value)
        }
          , c = function() {
            return /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(n.inputElement.value)
        }
          , m = function() {
            var e = 1;
            return !0 === n.options.checkUppercase && e++,
            !0 === n.options.checkLowercase && e++,
            !0 === n.options.checkDigit && e++,
            !0 === n.options.checkChar && e++,
            n.checkSteps = e,
            100 / n.checkSteps
        }
          , f = function() {
            var e = [].slice.call(n.highlightElement.querySelectorAll("div"))
              , t = e.length
              , i = 0
              , r = m()
              , o = g();
            e.map((function(e) {
                i++,
                r * i * (n.checkSteps / t) <= o ? e.classList.add("active") : e.classList.remove("active")
            }
            ))
        }
          , p = function() {
            var e = n.visibilityElement.querySelector(":scope > i:not(.d-none)")
              , t = n.visibilityElement.querySelector(":scope > i.d-none");
            "password" === n.inputElement.getAttribute("type").toLowerCase() ? n.inputElement.setAttribute("type", "text") : n.inputElement.setAttribute("type", "password"),
            e.classList.add("d-none"),
            t.classList.remove("d-none"),
            n.inputElement.focus()
        }
          , g = function() {
            return n.score
        };
        !0 === KTUtil.data(e).has("password-meter") ? n = KTUtil.data(e).get("password-meter") : r(),
        n.check = function() {
            return a()
        }
        ,
        n.getScore = function() {
            return g()
        }
        ,
        n.reset = function() {
            return n.score = 0,
            void f()
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("password-meter")
        }
    }
};
KTPasswordMeter.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("password-meter") ? KTUtil.data(e).get("password-meter") : null
}
,
KTPasswordMeter.createInstances = function(e="[data-kt-password-meter]") {
    var t = document.body.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTPasswordMeter(t[n])
}
,
KTPasswordMeter.init = function() {
    KTPasswordMeter.createInstances()
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTPasswordMeter);
var KTScrollHandlersInitialized = !1
  , KTScroll = function(e, t) {
    var n = this;
    if (e) {
        var i = {
            saveState: !0
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.element = e,
            n.id = n.element.getAttribute("id"),
            n.element.setAttribute("data-kt-scroll", "true"),
            l(),
            KTUtil.data(n.element).set("scroll", n)
        }
          , o = function(e) {
            return document.body.hasAttribute("data-kt-name") ? document.body.getAttribute("data-kt-name") + "_" : ""
        }
          , a = function() {
            var e = o();
            localStorage.setItem(e + n.id + "st", n.element.scrollTop)
        }
          , l = function() {
            var e, t;
            !0 === f("activate") || !1 === n.element.hasAttribute("data-kt-scroll-activate") ? (e = p(),
            null !== (t = u()) && t.length > 0 ? KTUtil.css(n.element, e, t) : KTUtil.css(n.element, e, ""),
            s(),
            !0 === f("save-state") && n.id ? n.element.addEventListener("scroll", a) : n.element.removeEventListener("scroll", a),
            function() {
                var e = o();
                if (!0 === f("save-state") && n.id && localStorage.getItem(e + n.id + "st")) {
                    var t = parseInt(localStorage.getItem(e + n.id + "st"));
                    t > 0 && n.element.scroll({
                        top: t,
                        behavior: "instant"
                    })
                }
            }()) : (KTUtil.css(n.element, p(), ""),
            n.element.removeEventListener("scroll", a))
        }
          , s = function() {
            var e = f("stretch");
            if (null !== e) {
                var t = document.querySelectorAll(e);
                if (t && 2 == t.length) {
                    var i = t[0]
                      , r = t[1]
                      , o = c(r) - c(i);
                    if (o > 0) {
                        var a = parseInt(KTUtil.css(n.element, p())) + o;
                        KTUtil.css(n.element, p(), String(a) + "px")
                    }
                }
            }
        }
          , u = function() {
            var e = f(p());
            return e instanceof Function ? e.call() : null !== e && "string" == typeof e && "auto" === e.toLowerCase() ? d() : e
        }
          , d = function() {
            var e, t = KTUtil.getViewPort().height, i = f("dependencies"), r = f("wrappers"), o = f("offset");
            if ((t -= m(n.element),
            null !== i) && ((e = document.querySelectorAll(i)) && e.length > 0))
                for (var a = 0, l = e.length; a < l; a++)
                    !1 !== KTUtil.visible(e[a]) && (t -= c(e[a]));
            if (null !== r && ((e = document.querySelectorAll(r)) && e.length > 0))
                for (a = 0,
                l = e.length; a < l; a++)
                    !1 !== KTUtil.visible(e[a]) && (t -= m(e[a]));
            return null !== o && "object" != typeof o && (t -= parseInt(o)),
            String(t) + "px"
        }
          , c = function(e) {
            var t = 0;
            return null !== e && (t += parseInt(KTUtil.css(e, "height")),
            t += parseInt(KTUtil.css(e, "margin-top")),
            t += parseInt(KTUtil.css(e, "margin-bottom")),
            KTUtil.css(e, "border-top") && (t += parseInt(KTUtil.css(e, "border-top"))),
            KTUtil.css(e, "border-bottom") && (t += parseInt(KTUtil.css(e, "border-bottom")))),
            t
        }
          , m = function(e) {
            var t = 0;
            return null !== e && (t += parseInt(KTUtil.css(e, "margin-top")),
            t += parseInt(KTUtil.css(e, "margin-bottom")),
            t += parseInt(KTUtil.css(e, "padding-top")),
            t += parseInt(KTUtil.css(e, "padding-bottom")),
            KTUtil.css(e, "border-top") && (t += parseInt(KTUtil.css(e, "border-top"))),
            KTUtil.css(e, "border-bottom") && (t += parseInt(KTUtil.css(e, "border-bottom")))),
            t
        }
          , f = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-scroll-" + e)) {
                var t = n.element.getAttribute("data-kt-scroll-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        }
          , p = function() {
            return f("height") ? "height" : f("min-height") ? "min-height" : f("max-height") ? "max-height" : void 0
        };
        KTUtil.data(e).has("scroll") ? n = KTUtil.data(e).get("scroll") : r(),
        n.update = function() {
            return l()
        }
        ,
        n.getHeight = function() {
            return u()
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("scroll")
        }
    }
};
KTScroll.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("scroll") ? KTUtil.data(e).get("scroll") : null
}
,
KTScroll.createInstances = function(e='[data-kt-scroll="true"]') {
    var t = document.body.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTScroll(t[n])
}
,
KTScroll.handleResize = function() {
    window.addEventListener("resize", (function() {
        KTUtil.throttle(undefined, (function() {
            var e = document.body.querySelectorAll('[data-kt-scroll="true"]');
            if (e && e.length > 0)
                for (var t = 0, n = e.length; t < n; t++) {
                    var i = KTScroll.getInstance(e[t]);
                    i && i.update()
                }
        }
        ), 200)
    }
    ))
}
,
KTScroll.init = function() {
    KTScroll.createInstances(),
    !1 === KTScrollHandlersInitialized && (KTScroll.handleResize(),
    KTScrollHandlersInitialized = !0)
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTScroll);
var KTScrolltop = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            offset: 300,
            speed: 600
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("scrolltop"),
            n.element = e,
            n.element.setAttribute("data-kt-scrolltop", "true"),
            o(),
            KTUtil.data(n.element).set("scrolltop", n)
        }
          , o = function() {
            window.addEventListener("scroll", (function() {
                KTUtil.throttle(undefined, (function() {
                    a()
                }
                ), 200)
            }
            )),
            KTUtil.addEvent(n.element, "click", (function(e) {
                e.preventDefault(),
                l()
            }
            ))
        }
          , a = function() {
            var e = parseInt(s("offset"));
            KTUtil.getScrollTop() > e ? !1 === document.body.hasAttribute("data-kt-scrolltop") && document.body.setAttribute("data-kt-scrolltop", "on") : !0 === document.body.hasAttribute("data-kt-scrolltop") && document.body.removeAttribute("data-kt-scrolltop")
        }
          , l = function() {
            parseInt(s("speed"));
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
          , s = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-scrolltop-" + e)) {
                var t = n.element.getAttribute("data-kt-scrolltop-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        };
        KTUtil.data(e).has("scrolltop") ? n = KTUtil.data(e).get("scrolltop") : r(),
        n.go = function() {
            return l()
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("scrolltop")
        }
    }
};
KTScrolltop.getInstance = function(e) {
    return e && KTUtil.data(e).has("scrolltop") ? KTUtil.data(e).get("scrolltop") : null
}
,
KTScrolltop.createInstances = function(e='[data-kt-scrolltop="true"]') {
    var t = document.body.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTScrolltop(t[n])
}
,
KTScrolltop.init = function() {
    KTScrolltop.createInstances()
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTScrolltop);
var KTSearch = function(e, t) {
    var n = this;
    if (e) {
        var i = {
            minLength: 2,
            keypress: !0,
            enter: !0,
            layout: "menu",
            responsive: null,
            showOnFocus: !0
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.processing = !1,
            n.element = e,
            n.contentElement = v("content"),
            n.formElement = v("form"),
            n.inputElement = v("input"),
            n.spinnerElement = v("spinner"),
            n.clearElement = v("clear"),
            n.toggleElement = v("toggle"),
            n.submitElement = v("submit"),
            n.toolbarElement = v("toolbar"),
            n.resultsElement = v("results"),
            n.suggestionElement = v("suggestion"),
            n.emptyElement = v("empty"),
            n.element.setAttribute("data-kt-search", "true"),
            n.layout = g("layout"),
            "menu" === n.layout ? n.menuObject = new KTMenu(n.contentElement) : n.menuObject = null,
            m(),
            o(),
            KTUtil.data(n.element).set("search", n)
        }
          , o = function() {
            n.inputElement.addEventListener("focus", a),
            n.inputElement.addEventListener("blur", l),
            !0 === g("keypress") && n.inputElement.addEventListener("input", u),
            n.submitElement && n.submitElement.addEventListener("click", d),
            !0 === g("enter") && n.inputElement.addEventListener("keypress", s),
            n.clearElement && n.clearElement.addEventListener("click", c),
            n.menuObject && (n.toggleElement && (n.toggleElement.addEventListener("click", f),
            n.menuObject.on("kt.menu.dropdown.show", (function(e) {
                KTUtil.visible(n.toggleElement) && (n.toggleElement.classList.add("active"),
                n.toggleElement.classList.add("show"))
            }
            )),
            n.menuObject.on("kt.menu.dropdown.hide", (function(e) {
                KTUtil.visible(n.toggleElement) && (n.toggleElement.classList.remove("active"),
                n.toggleElement.classList.remove("show"))
            }
            ))),
            n.menuObject.on("kt.menu.dropdown.shown", (function() {
                n.inputElement.focus()
            }
            ))),
            window.addEventListener("resize", (function() {
                KTUtil.throttle(undefined, (function() {
                    m()
                }
                ), 200)
            }
            ))
        }
          , a = function() {
            n.element.classList.add("focus"),
            (!0 === g("show-on-focus") || n.inputElement.value.length >= minLength) && f()
        }
          , l = function() {
            n.element.classList.remove("focus")
        }
          , s = function(e) {
            13 == (e.charCode || e.keyCode || 0) && (e.preventDefault(),
            d())
        }
          , u = function() {
            if (g("min-length")) {
                var e = parseInt(g("min-length"));
                n.inputElement.value.length >= e ? d() : 0 === n.inputElement.value.length && c()
            }
        }
          , d = function() {
            !1 === n.processing && (n.spinnerElement && n.spinnerElement.classList.remove("d-none"),
            n.clearElement && n.clearElement.classList.add("d-none"),
            n.toolbarElement && n.formElement.contains(n.toolbarElement) && n.toolbarElement.classList.add("d-none"),
            n.inputElement.focus(),
            n.processing = !0,
            KTEventHandler.trigger(n.element, "kt.search.process", n))
        }
          , c = function() {
            !1 !== KTEventHandler.trigger(n.element, "kt.search.clear", n) && (n.inputElement.value = "",
            n.inputElement.focus(),
            n.clearElement && n.clearElement.classList.add("d-none"),
            n.toolbarElement && n.formElement.contains(n.toolbarElement) && n.toolbarElement.classList.remove("d-none"),
            !1 === g("show-on-focus") && p(),
            KTEventHandler.trigger(n.element, "kt.search.cleared", n))
        }
          , m = function() {
            if ("menu" === n.layout) {
                var e = T();
                "on" === e && !1 === n.contentElement.contains(n.formElement) ? (n.contentElement.prepend(n.formElement),
                n.formElement.classList.remove("d-none")) : "off" === e && !0 === n.contentElement.contains(n.formElement) && (n.element.prepend(n.formElement),
                n.formElement.classList.add("d-none"))
            }
        }
          , f = function() {
            n.menuObject && (m(),
            n.menuObject.show(n.element))
        }
          , p = function() {
            n.menuObject && (m(),
            n.menuObject.hide(n.element))
        }
          , g = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-search-" + e)) {
                var t = n.element.getAttribute("data-kt-search-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        }
          , v = function(e) {
            return n.element.querySelector('[data-kt-search-element="' + e + '"]')
        }
          , T = function() {
            var e = g("responsive")
              , t = KTUtil.getViewPort().width;
            if (!e)
                return null;
            var n = KTUtil.getBreakpoint(e);
            return n || (n = parseInt(e)),
            t < n ? "on" : "off"
        };
        !0 === KTUtil.data(e).has("search") ? n = KTUtil.data(e).get("search") : r(),
        n.show = function() {
            return f()
        }
        ,
        n.hide = function() {
            return p()
        }
        ,
        n.update = function() {
            return m()
        }
        ,
        n.search = function() {
            return d()
        }
        ,
        n.complete = function() {
            return n.spinnerElement && n.spinnerElement.classList.add("d-none"),
            n.clearElement && n.clearElement.classList.remove("d-none"),
            0 === n.inputElement.value.length && c(),
            n.inputElement.focus(),
            f(),
            void (n.processing = !1)
        }
        ,
        n.clear = function() {
            return c()
        }
        ,
        n.isProcessing = function() {
            return n.processing
        }
        ,
        n.getQuery = function() {
            return n.inputElement.value
        }
        ,
        n.getMenu = function() {
            return n.menuObject
        }
        ,
        n.getFormElement = function() {
            return n.formElement
        }
        ,
        n.getInputElement = function() {
            return n.inputElement
        }
        ,
        n.getContentElement = function() {
            return n.contentElement
        }
        ,
        n.getElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("search")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
    }
};
KTSearch.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("search") ? KTUtil.data(e).get("search") : null
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTSearch);
var KTStepper = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            startIndex: 1,
            animation: !1,
            animationSpeed: "0.3s",
            animationNextClass: "animate__animated animate__slideInRight animate__fast",
            animationPreviousClass: "animate__animated animate__slideInLeft animate__fast"
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("stepper"),
            n.element = e,
            n.element.setAttribute("data-kt-stepper", "true"),
            n.steps = KTUtil.findAll(n.element, '[data-kt-stepper-element="nav"]'),
            n.btnNext = KTUtil.find(n.element, '[data-kt-stepper-action="next"]'),
            n.btnPrevious = KTUtil.find(n.element, '[data-kt-stepper-action="previous"]'),
            n.btnSubmit = KTUtil.find(n.element, '[data-kt-stepper-action="submit"]'),
            n.totalStepsNumber = n.steps.length,
            n.passedStepIndex = 0,
            n.currentStepIndex = 1,
            n.clickedStepIndex = 0,
            n.options.startIndex > 1 && o(n.options.startIndex),
            n.nextListener = function(e) {
                e.preventDefault(),
                KTEventHandler.trigger(n.element, "kt.stepper.next", n)
            }
            ,
            n.previousListener = function(e) {
                e.preventDefault(),
                KTEventHandler.trigger(n.element, "kt.stepper.previous", n)
            }
            ,
            n.stepListener = function(e) {
                if (e.preventDefault(),
                n.steps && n.steps.length > 0)
                    for (var t = 0, i = n.steps.length; t < i; t++)
                        if (n.steps[t] === this)
                            return n.clickedStepIndex = t + 1,
                            void KTEventHandler.trigger(n.element, "kt.stepper.click", n)
            }
            ,
            KTUtil.addEvent(n.btnNext, "click", n.nextListener),
            KTUtil.addEvent(n.btnPrevious, "click", n.previousListener),
            n.stepListenerId = KTUtil.on(n.element, '[data-kt-stepper-action="step"]', "click", n.stepListener),
            KTUtil.data(n.element).set("stepper", n)
        }
          , o = function(e) {
            if (KTEventHandler.trigger(n.element, "kt.stepper.change", n),
            !(e === n.currentStepIndex || e > n.totalStepsNumber || e < 0))
                return e = parseInt(e),
                n.passedStepIndex = n.currentStepIndex,
                n.currentStepIndex = e,
                a(),
                KTEventHandler.trigger(n.element, "kt.stepper.changed", n),
                n
        }
          , a = function() {
            var e = "";
            e = l() ? "last" : s() ? "first" : "between",
            KTUtil.removeClass(n.element, "last"),
            KTUtil.removeClass(n.element, "first"),
            KTUtil.removeClass(n.element, "between"),
            KTUtil.addClass(n.element, e);
            var t = KTUtil.findAll(n.element, '[data-kt-stepper-element="nav"], [data-kt-stepper-element="content"], [data-kt-stepper-element="info"]');
            if (t && t.length > 0)
                for (var i = 0, r = t.length; i < r; i++) {
                    var o = t[i]
                      , a = KTUtil.index(o) + 1;
                    if (KTUtil.removeClass(o, "current"),
                    KTUtil.removeClass(o, "completed"),
                    KTUtil.removeClass(o, "pending"),
                    a == n.currentStepIndex) {
                        if (KTUtil.addClass(o, "current"),
                        !1 !== n.options.animation && "content" == o.getAttribute("data-kt-stepper-element")) {
                            KTUtil.css(o, "animationDuration", n.options.animationSpeed);
                            var u = "previous" === f(n.passedStepIndex) ? n.options.animationPreviousClass : n.options.animationNextClass;
                            KTUtil.animateClass(o, u)
                        }
                    } else
                        a < n.currentStepIndex ? KTUtil.addClass(o, "completed") : KTUtil.addClass(o, "pending")
                }
        }
          , l = function() {
            return n.currentStepIndex === n.totalStepsNumber
        }
          , s = function() {
            return 1 === n.currentStepIndex
        }
          , u = function() {
            return n.totalStepsNumber >= n.currentStepIndex + 1 ? n.currentStepIndex + 1 : n.totalStepsNumber
        }
          , d = function() {
            return n.currentStepIndex - 1 > 1 ? n.currentStepIndex - 1 : 1
        }
          , c = function() {
            return 1
        }
          , m = function() {
            return n.totalStepsNumber
        }
          , f = function(e) {
            return e > n.currentStepIndex ? "next" : "previous"
        };
        !0 === KTUtil.data(e).has("stepper") ? n = KTUtil.data(e).get("stepper") : r(),
        n.getElement = function(e) {
            return n.element
        }
        ,
        n.goTo = function(e) {
            return o(e)
        }
        ,
        n.goPrevious = function() {
            return o(d())
        }
        ,
        n.goNext = function() {
            return o(u())
        }
        ,
        n.goFirst = function() {
            return o(c())
        }
        ,
        n.goLast = function() {
            return o(m())
        }
        ,
        n.getCurrentStepIndex = function() {
            return n.currentStepIndex
        }
        ,
        n.getNextStepIndex = function() {
            return u()
        }
        ,
        n.getPassedStepIndex = function() {
            return n.passedStepIndex
        }
        ,
        n.getClickedStepIndex = function() {
            return n.clickedStepIndex
        }
        ,
        n.getPreviousStepIndex = function() {
            return d()
        }
        ,
        n.destroy = function() {
            return KTUtil.removeEvent(n.btnNext, "click", n.nextListener),
            KTUtil.removeEvent(n.btnPrevious, "click", n.previousListener),
            KTUtil.off(n.element, "click", n.stepListenerId),
            void KTUtil.data(n.element).remove("stepper")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTStepper.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("stepper") ? KTUtil.data(e).get("stepper") : null
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTStepper);
var KTStickyHandlersInitialized = !1
  , KTSticky = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            offset: 200,
            reverse: !1,
            release: null,
            animation: !0,
            animationSpeed: "0.3s",
            animationClass: "animation-slide-in-down"
        }
          , r = function() {
            n.element = e,
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("sticky"),
            n.name = n.element.getAttribute("data-kt-sticky-name"),
            n.attributeName = "data-kt-sticky-" + n.name,
            n.attributeName2 = "data-kt-" + n.name,
            n.eventTriggerState = !0,
            n.lastScrollTop = 0,
            n.scrollHandler,
            n.element.setAttribute("data-kt-sticky", "true"),
            window.addEventListener("scroll", o),
            o(),
            KTUtil.data(n.element).set("sticky", n)
        }
          , o = function(e) {
            var t, i = u("offset"), r = u("release"), o = u("reverse");
            if (!1 !== i) {
                i = parseInt(i),
                r = r ? document.querySelector(r) : null,
                t = KTUtil.getScrollTop(),
                document.documentElement.scrollHeight - window.innerHeight - KTUtil.getScrollTop();
                var s = !r || r.offsetTop - r.clientHeight > t;
                if (!0 === o) {
                    if (t > i && s) {
                        if (!1 === document.body.hasAttribute(n.attributeName)) {
                            if (!1 === a())
                                return;
                            document.body.setAttribute(n.attributeName, "on"),
                            document.body.setAttribute(n.attributeName2, "on"),
                            n.element.setAttribute("data-kt-sticky-enabled", "true")
                        }
                        !0 === n.eventTriggerState && (KTEventHandler.trigger(n.element, "kt.sticky.on", n),
                        KTEventHandler.trigger(n.element, "kt.sticky.change", n),
                        n.eventTriggerState = !1)
                    } else
                        !0 === document.body.hasAttribute(n.attributeName) && (l(),
                        document.body.removeAttribute(n.attributeName),
                        document.body.removeAttribute(n.attributeName2),
                        n.element.removeAttribute("data-kt-sticky-enabled")),
                        !1 === n.eventTriggerState && (KTEventHandler.trigger(n.element, "kt.sticky.off", n),
                        KTEventHandler.trigger(n.element, "kt.sticky.change", n),
                        n.eventTriggerState = !0);
                    n.lastScrollTop = t
                } else if (t > i && s) {
                    if (!1 === document.body.hasAttribute(n.attributeName)) {
                        if (!1 === a())
                            return;
                        document.body.setAttribute(n.attributeName, "on"),
                        document.body.setAttribute(n.attributeName2, "on"),
                        n.element.setAttribute("data-kt-sticky-enabled", "true")
                    }
                    !0 === n.eventTriggerState && (KTEventHandler.trigger(n.element, "kt.sticky.on", n),
                    KTEventHandler.trigger(n.element, "kt.sticky.change", n),
                    n.eventTriggerState = !1)
                } else
                    !0 === document.body.hasAttribute(n.attributeName) && (l(),
                    document.body.removeAttribute(n.attributeName),
                    document.body.removeAttribute(n.attributeName2),
                    n.element.removeAttribute("data-kt-sticky-enabled")),
                    !1 === n.eventTriggerState && (KTEventHandler.trigger(n.element, "kt.sticky.off", n),
                    KTEventHandler.trigger(n.element, "kt.sticky.change", n),
                    n.eventTriggerState = !0);
                r && (r.offsetTop - r.clientHeight > t ? n.element.setAttribute("data-kt-sticky-released", "true") : n.element.removeAttribute("data-kt-sticky-released"))
            }
        }
          , a = function(e) {
            var t = u("top");
            t = t ? parseInt(t) : 0;
            var i = u("left")
              , r = u("right")
              , o = u("width")
              , a = u("zindex")
              , l = u("dependencies")
              , d = u("class")
              , c = s()
              , m = u("height-offset");
            if (c + (m = m ? parseInt(m) : 0) + t > KTUtil.getViewPort().height)
                return !1;
            if (!0 !== e && !0 === u("animation") && (KTUtil.css(n.element, "animationDuration", u("animationSpeed")),
            KTUtil.animateClass(n.element, "animation " + u("animationClass"))),
            null !== d && KTUtil.addClass(n.element, d),
            null !== a && (KTUtil.css(n.element, "z-index", a),
            KTUtil.css(n.element, "position", "fixed")),
            t >= 0 && KTUtil.css(n.element, "top", String(t) + "px"),
            null !== o) {
                if (o.target) {
                    var f = document.querySelector(o.target);
                    f && (o = KTUtil.css(f, "width"))
                }
                KTUtil.css(n.element, "width", o)
            }
            if (null !== i)
                if ("auto" === String(i).toLowerCase()) {
                    var p = KTUtil.offset(n.element).left;
                    p >= 0 && KTUtil.css(n.element, "left", String(p) + "px")
                } else
                    KTUtil.css(n.element, "left", i);
            if (null !== r && KTUtil.css(n.element, "right", r),
            null !== l) {
                var g = document.querySelectorAll(l);
                if (g && g.length > 0)
                    for (var v = 0, T = g.length; v < T; v++)
                        KTUtil.css(g[v], "padding-top", String(c) + "px")
            }
        }
          , l = function() {
            KTUtil.css(n.element, "top", ""),
            KTUtil.css(n.element, "width", ""),
            KTUtil.css(n.element, "left", ""),
            KTUtil.css(n.element, "right", ""),
            KTUtil.css(n.element, "z-index", ""),
            KTUtil.css(n.element, "position", "");
            var e = u("dependencies")
              , t = u("class");
            if (null !== t && KTUtil.removeClass(n.element, t),
            null !== e) {
                var i = document.querySelectorAll(e);
                if (i && i.length > 0)
                    for (var r = 0, o = i.length; r < o; r++)
                        KTUtil.css(i[r], "padding-top", "")
            }
        }
          , s = function() {
            var t = parseFloat(KTUtil.css(n.element, "height"));
            return t += parseFloat(KTUtil.css(n.element, "margin-top")),
            t += parseFloat(KTUtil.css(n.element, "margin-bottom")),
            KTUtil.css(e, "border-top") && (t += parseFloat(KTUtil.css(n.element, "border-top"))),
            KTUtil.css(e, "border-bottom") && (t += parseFloat(KTUtil.css(n.element, "border-bottom"))),
            t
        }
          , u = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-sticky-" + e)) {
                var t = n.element.getAttribute("data-kt-sticky-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        };
        !0 === KTUtil.data(e).has("sticky") ? n = KTUtil.data(e).get("sticky") : r(),
        n.update = function() {
            !0 === document.body.hasAttribute(n.attributeName) && (l(),
            document.body.removeAttribute(n.attributeName),
            document.body.removeAttribute(n.attributeName2),
            a(!0),
            document.body.setAttribute(n.attributeName, "on"),
            document.body.setAttribute(n.attributeName2, "on"))
        }
        ,
        n.destroy = function() {
            return window.removeEventListener("scroll", o),
            void KTUtil.data(n.element).remove("sticky")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTSticky.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("sticky") ? KTUtil.data(e).get("sticky") : null
}
,
KTSticky.createInstances = function(e='[data-kt-sticky="true"]') {
    var t = document.body.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTSticky(t[n])
}
,
KTSticky.handleResize = function() {
    window.addEventListener("resize", (function() {
        KTUtil.throttle(undefined, (function() {
            var e = document.body.querySelectorAll('[data-kt-sticky="true"]');
            if (e && e.length > 0)
                for (var t = 0, n = e.length; t < n; t++) {
                    var i = KTSticky.getInstance(e[t]);
                    i && i.update()
                }
        }
        ), 200)
    }
    ))
}
,
KTSticky.init = function() {
    KTSticky.createInstances(),
    !1 === KTStickyHandlersInitialized && (KTSticky.handleResize(),
    KTStickyHandlersInitialized = !0)
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTSticky);
var KTSwapperHandlersInitialized = !1
  , KTSwapper = function(e, t) {
    var n = this;
    if (null != e) {
        var i = {
            mode: "append"
        }
          , r = function() {
            n.element = e,
            n.options = KTUtil.deepExtend({}, i, t),
            n.element.setAttribute("data-kt-swapper", "true"),
            o(),
            KTUtil.data(n.element).set("swapper", n)
        }
          , o = function(t) {
            var n = a("parent")
              , i = a("mode")
              , r = n ? document.querySelector(n) : null;
            r && e.parentNode !== r && ("prepend" === i ? r.prepend(e) : "append" === i && r.append(e))
        }
          , a = function(e) {
            if (!0 === n.element.hasAttribute("data-kt-swapper-" + e)) {
                var t = n.element.getAttribute("data-kt-swapper-" + e)
                  , i = KTUtil.getResponsiveValue(t);
                return null !== i && "true" === String(i) ? i = !0 : null !== i && "false" === String(i) && (i = !1),
                i
            }
            var r = KTUtil.snakeToCamel(e);
            return n.options[r] ? KTUtil.getResponsiveValue(n.options[r]) : null
        };
        !0 === KTUtil.data(e).has("swapper") ? n = KTUtil.data(e).get("swapper") : r(),
        n.update = function() {
            o()
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("swapper")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTSwapper.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("swapper") ? KTUtil.data(e).get("swapper") : null
}
,
KTSwapper.createInstances = function(e='[data-kt-swapper="true"]') {
    var t = document.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTSwapper(t[n])
}
,
KTSwapper.handleResize = function() {
    window.addEventListener("resize", (function() {
        KTUtil.throttle(undefined, (function() {
            var e = document.querySelectorAll('[data-kt-swapper="true"]');
            if (e && e.length > 0)
                for (var t = 0, n = e.length; t < n; t++) {
                    var i = KTSwapper.getInstance(e[t]);
                    i && i.update()
                }
        }
        ), 200)
    }
    ))
}
,
KTSwapper.init = function() {
    KTSwapper.createInstances(),
    !1 === KTSwapperHandlersInitialized && (KTSwapper.handleResize(),
    KTSwapperHandlersInitialized = !0)
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTSwapper);
var KTToggle = function(e, t) {
    var n = this;
    if (e) {
        var i = {
            saveState: !0
        }
          , r = function() {
            n.options = KTUtil.deepExtend({}, i, t),
            n.uid = KTUtil.getUniqueId("toggle"),
            n.element = e,
            n.target = document.querySelector(n.element.getAttribute("data-kt-toggle-target")) ? document.querySelector(n.element.getAttribute("data-kt-toggle-target")) : n.element,
            n.state = n.element.hasAttribute("data-kt-toggle-state") ? n.element.getAttribute("data-kt-toggle-state") : "",
            n.mode = n.element.hasAttribute("data-kt-toggle-mode") ? n.element.getAttribute("data-kt-toggle-mode") : "",
            n.attribute = "data-kt-" + n.element.getAttribute("data-kt-toggle-name"),
            o(),
            KTUtil.data(n.element).set("toggle", n)
        }
          , o = function() {
            KTUtil.addEvent(n.element, "click", (function(e) {
                e.preventDefault(),
                "" !== n.mode ? ("off" === n.mode && !1 === u() || "on" === n.mode && !0 === u()) && a() : a()
            }
            ))
        }
          , a = function() {
            return KTEventHandler.trigger(n.element, "kt.toggle.change", n),
            u() ? s() : l(),
            KTEventHandler.trigger(n.element, "kt.toggle.changed", n),
            n
        }
          , l = function() {
            if (!0 !== u())
                return KTEventHandler.trigger(n.element, "kt.toggle.enable", n),
                n.target.setAttribute(n.attribute, "on"),
                n.state.length > 0 && n.element.classList.add(n.state),
                void 0 !== KTCookie && !0 === n.options.saveState && KTCookie.set(n.attribute, "on"),
                KTEventHandler.trigger(n.element, "kt.toggle.enabled", n),
                n
        }
          , s = function() {
            if (!1 !== u())
                return KTEventHandler.trigger(n.element, "kt.toggle.disable", n),
                n.target.removeAttribute(n.attribute),
                n.state.length > 0 && n.element.classList.remove(n.state),
                void 0 !== KTCookie && !0 === n.options.saveState && KTCookie.remove(n.attribute),
                KTEventHandler.trigger(n.element, "kt.toggle.disabled", n),
                n
        }
          , u = function() {
            return "on" === String(n.target.getAttribute(n.attribute)).toLowerCase()
        };
        !0 === KTUtil.data(e).has("toggle") ? n = KTUtil.data(e).get("toggle") : r(),
        n.toggle = function() {
            return a()
        }
        ,
        n.enable = function() {
            return l()
        }
        ,
        n.disable = function() {
            return s()
        }
        ,
        n.isEnabled = function() {
            return u()
        }
        ,
        n.goElement = function() {
            return n.element
        }
        ,
        n.destroy = function() {
            KTUtil.data(n.element).remove("toggle")
        }
        ,
        n.on = function(e, t) {
            return KTEventHandler.on(n.element, e, t)
        }
        ,
        n.one = function(e, t) {
            return KTEventHandler.one(n.element, e, t)
        }
        ,
        n.off = function(e, t) {
            return KTEventHandler.off(n.element, e, t)
        }
        ,
        n.trigger = function(e, t) {
            return KTEventHandler.trigger(n.element, e, t, n, t)
        }
    }
};
KTToggle.getInstance = function(e) {
    return null !== e && KTUtil.data(e).has("toggle") ? KTUtil.data(e).get("toggle") : null
}
,
KTToggle.createInstances = function(e="[data-kt-toggle]") {
    var t = document.body.querySelectorAll(e);
    if (t && t.length > 0)
        for (var n = 0, i = t.length; n < i; n++)
            new KTToggle(t[n])
}
,
KTToggle.init = function() {
    KTToggle.createInstances()
}
,
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTToggle),
Element.prototype.matches || (Element.prototype.matches = function(e) {
    for (var t = (this.document || this.ownerDocument).querySelectorAll(e), n = t.length; --n >= 0 && t.item(n) !== this; )
        ;
    return n > -1
}
),
Element.prototype.closest || (Element.prototype.closest = function(e) {
    var t = this;
    if (!document.documentElement.contains(this))
        return null;
    do {
        if (t.matches(e))
            return t;
        t = t.parentElement
    } while (null !== t);
    return null
}
)/**
 * ChildNode.remove() polyfill
 * https://gomakethings.com/removing-an-element-from-the-dom-the-es6-way/
 * @author Chris Ferdinandi
 * @license MIT
 */
,
function(e) {
    for (var t = 0; t < e.length; t++)
        window[e[t]] && !("remove"in window[e[t]].prototype) && (window[e[t]].prototype.remove = function() {
            this.parentNode.removeChild(this)
        }
        )
}(["Element", "CharacterData", "DocumentType"]),
function() {
    for (var e = 0, t = ["webkit", "moz"], n = 0; n < t.length && !window.requestAnimationFrame; ++n)
        window.requestAnimationFrame = window[t[n] + "RequestAnimationFrame"],
        window.cancelAnimationFrame = window[t[n] + "CancelAnimationFrame"] || window[t[n] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(t) {
        var n = (new Date).getTime()
          , i = Math.max(0, 16 - (n - e))
          , r = window.setTimeout((function() {
            t(n + i)
        }
        ), i);
        return e = n + i,
        r
    }
    ),
    window.cancelAnimationFrame || (window.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    }
    )
}(),
[Element.prototype, Document.prototype, DocumentFragment.prototype].forEach((function(e) {
    e.hasOwnProperty("prepend") || Object.defineProperty(e, "prepend", {
        configurable: !0,
        enumerable: !0,
        writable: !0,
        value: function() {
            var e = Array.prototype.slice.call(arguments)
              , t = document.createDocumentFragment();
            e.forEach((function(e) {
                var n = e instanceof Node;
                t.appendChild(n ? e : document.createTextNode(String(e)))
            }
            )),
            this.insertBefore(t, this.firstChild)
        }
    })
}
)),
null == Element.prototype.getAttributeNames && (Element.prototype.getAttributeNames = function() {
    for (var e = this.attributes, t = e.length, n = new Array(t), i = 0; i < t; i++)
        n[i] = e[i].name;
    return n
}
),
window.KTUtilElementDataStore = {},
window.KTUtilElementDataStoreID = 0,
window.KTUtilDelegatedEventHandlers = {};
var KTUtil = function() {
    var e = []
      , t = function() {
        window.addEventListener("resize", (function() {
            KTUtil.throttle(undefined, (function() {
                !function() {
                    for (var t = 0; t < e.length; t++)
                        e[t].call()
                }()
            }
            ), 200)
        }
        ))
    };
    return {
        init: function(e) {
            t()
        },
        addResizeHandler: function(t) {
            e.push(t)
        },
        removeResizeHandler: function(t) {
            for (var n = 0; n < e.length; n++)
                t === e[n] && delete e[n]
        },
        runResizeHandlers: function() {
            _runResizeHandlers()
        },
        resize: function() {
            if ("function" == typeof Event)
                window.dispatchEvent(new Event("resize"));
            else {
                var e = window.document.createEvent("UIEvents");
                e.initUIEvent("resize", !0, !1, window, 0),
                window.dispatchEvent(e)
            }
        },
        getURLParam: function(e) {
            var t, n, i = window.location.search.substring(1).split("&");
            for (t = 0; t < i.length; t++)
                if ((n = i[t].split("="))[0] == e)
                    return unescape(n[1]);
            return null
        },
        isMobileDevice: function() {
            var e = this.getViewPort().width < this.getBreakpoint("lg");
            return !1 === e && (e = null != navigator.userAgent.match(/iPad/i)),
            e
        },
        isDesktopDevice: function() {
            return !KTUtil.isMobileDevice()
        },
        getViewPort: function() {
            var e = window
              , t = "inner";
            return "innerWidth"in window || (t = "client",
            e = document.documentElement || document.body),
            {
                width: e[t + "Width"],
                height: e[t + "Height"]
            }
        },
        isBreakpointUp: function(e) {
            return this.getViewPort().width >= this.getBreakpoint(e)
        },
        isBreakpointDown: function(e) {
            return this.getViewPort().width < this.getBreakpoint(e)
        },
        getViewportWidth: function() {
            return this.getViewPort().width
        },
        getUniqueId: function(e) {
            return e + Math.floor(Math.random() * (new Date).getTime())
        },
        getBreakpoint: function(e) {
            var t = this.getCssVariableValue("--bs-" + e);
            return t && (t = parseInt(t.trim())),
            t
        },
        isset: function(e, t) {
            var n;
            if (-1 !== (t = t || "").indexOf("["))
                throw new Error("Unsupported object path notation.");
            t = t.split(".");
            do {
                if (void 0 === e)
                    return !1;
                if (n = t.shift(),
                !e.hasOwnProperty(n))
                    return !1;
                e = e[n]
            } while (t.length);
            return !0
        },
        getHighestZindex: function(e) {
            for (var t, n; e && e !== document; ) {
                if (("absolute" === (t = KTUtil.css(e, "position")) || "relative" === t || "fixed" === t) && (n = parseInt(KTUtil.css(e, "z-index")),
                !isNaN(n) && 0 !== n))
                    return n;
                e = e.parentNode
            }
            return 1
        },
        hasFixedPositionedParent: function(e) {
            for (; e && e !== document; ) {
                if ("fixed" === KTUtil.css(e, "position"))
                    return !0;
                e = e.parentNode
            }
            return !1
        },
        sleep: function(e) {
            for (var t = (new Date).getTime(), n = 0; n < 1e7 && !((new Date).getTime() - t > e); n++)
                ;
        },
        getRandomInt: function(e, t) {
            return Math.floor(Math.random() * (t - e + 1)) + e
        },
        isAngularVersion: function() {
            return void 0 !== window.Zone
        },
        deepExtend: function(e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                if (n)
                    for (var i in n)
                        n.hasOwnProperty(i) && ("[object Object]" !== Object.prototype.toString.call(n[i]) ? e[i] = n[i] : e[i] = KTUtil.deepExtend(e[i], n[i]))
            }
            return e
        },
        extend: function(e) {
            e = e || {};
            for (var t = 1; t < arguments.length; t++)
                if (arguments[t])
                    for (var n in arguments[t])
                        arguments[t].hasOwnProperty(n) && (e[n] = arguments[t][n]);
            return e
        },
        getBody: function() {
            return document.getElementsByTagName("body")[0]
        },
        hasClasses: function(e, t) {
            if (e) {
                for (var n = t.split(" "), i = 0; i < n.length; i++)
                    if (0 == KTUtil.hasClass(e, KTUtil.trim(n[i])))
                        return !1;
                return !0
            }
        },
        hasClass: function(e, t) {
            if (e)
                return e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)
        },
        addClass: function(e, t) {
            if (e && void 0 !== t) {
                var n = t.split(" ");
                if (e.classList)
                    for (var i = 0; i < n.length; i++)
                        n[i] && n[i].length > 0 && e.classList.add(KTUtil.trim(n[i]));
                else if (!KTUtil.hasClass(e, t))
                    for (var r = 0; r < n.length; r++)
                        e.className += " " + KTUtil.trim(n[r])
            }
        },
        removeClass: function(e, t) {
            if (e && void 0 !== t) {
                var n = t.split(" ");
                if (e.classList)
                    for (var i = 0; i < n.length; i++)
                        e.classList.remove(KTUtil.trim(n[i]));
                else if (KTUtil.hasClass(e, t))
                    for (var r = 0; r < n.length; r++)
                        e.className = e.className.replace(new RegExp("\\b" + KTUtil.trim(n[r]) + "\\b","g"), "")
            }
        },
        triggerCustomEvent: function(e, t, n) {
            var i;
            window.CustomEvent ? i = new CustomEvent(t,{
                detail: n
            }) : (i = document.createEvent("CustomEvent")).initCustomEvent(t, !0, !0, n),
            e.dispatchEvent(i)
        },
        triggerEvent: function(e, t) {
            var n;
            if (e.ownerDocument)
                n = e.ownerDocument;
            else {
                if (9 != e.nodeType)
                    throw new Error("Invalid node passed to fireEvent: " + e.id);
                n = e
            }
            if (e.dispatchEvent) {
                var i = "";
                switch (t) {
                case "click":
                case "mouseenter":
                case "mouseleave":
                case "mousedown":
                case "mouseup":
                    i = "MouseEvents";
                    break;
                case "focus":
                case "change":
                case "blur":
                case "select":
                    i = "HTMLEvents";
                    break;
                default:
                    throw "fireEvent: Couldn't find an event class for event '" + t + "'."
                }
                var r = "change" != t;
                (o = n.createEvent(i)).initEvent(t, r, !0),
                o.synthetic = !0,
                e.dispatchEvent(o, !0)
            } else if (e.fireEvent) {
                var o;
                (o = n.createEventObject()).synthetic = !0,
                e.fireEvent("on" + t, o)
            }
        },
        index: function(e) {
            for (var t = e.parentNode.children, n = 0; n < t.length; n++)
                if (t[n] == e)
                    return n
        },
        trim: function(e) {
            return e.trim()
        },
        eventTriggered: function(e) {
            return !!e.currentTarget.dataset.triggered || (e.currentTarget.dataset.triggered = !0,
            !1)
        },
        remove: function(e) {
            e && e.parentNode && e.parentNode.removeChild(e)
        },
        find: function(e, t) {
            return null !== e ? e.querySelector(t) : null
        },
        findAll: function(e, t) {
            return null !== e ? e.querySelectorAll(t) : null
        },
        insertAfter: function(e, t) {
            return t.parentNode.insertBefore(e, t.nextSibling)
        },
        parents: function(e, t) {
            for (var n = []; e && e !== document; e = e.parentNode)
                t ? e.matches(t) && n.push(e) : n.push(e);
            return n
        },
        children: function(e, t, n) {
            if (!e || !e.childNodes)
                return null;
            for (var i = [], r = 0, o = e.childNodes.length; r < o; ++r)
                1 == e.childNodes[r].nodeType && KTUtil.matches(e.childNodes[r], t, n) && i.push(e.childNodes[r]);
            return i
        },
        child: function(e, t, n) {
            var i = KTUtil.children(e, t, n);
            return i ? i[0] : null
        },
        matches: function(e, t, n) {
            var i = Element.prototype
              , r = i.matches || i.webkitMatchesSelector || i.mozMatchesSelector || i.msMatchesSelector || function(e) {
                return -1 !== [].indexOf.call(document.querySelectorAll(e), this)
            }
            ;
            return !(!e || !e.tagName) && r.call(e, t)
        },
        data: function(e) {
            return {
                set: function(t, n) {
                    e && (void 0 === e.customDataTag && (window.KTUtilElementDataStoreID++,
                    e.customDataTag = window.KTUtilElementDataStoreID),
                    void 0 === window.KTUtilElementDataStore[e.customDataTag] && (window.KTUtilElementDataStore[e.customDataTag] = {}),
                    window.KTUtilElementDataStore[e.customDataTag][t] = n)
                },
                get: function(t) {
                    if (e)
                        return void 0 === e.customDataTag ? null : this.has(t) ? window.KTUtilElementDataStore[e.customDataTag][t] : null
                },
                has: function(t) {
                    return !!e && (void 0 !== e.customDataTag && !(!window.KTUtilElementDataStore[e.customDataTag] || !window.KTUtilElementDataStore[e.customDataTag][t]))
                },
                remove: function(t) {
                    e && this.has(t) && delete window.KTUtilElementDataStore[e.customDataTag][t]
                }
            }
        },
        outerWidth: function(e, t) {
            var n;
            return !0 === t ? (n = parseFloat(e.offsetWidth),
            n += parseFloat(KTUtil.css(e, "margin-left")) + parseFloat(KTUtil.css(e, "margin-right")),
            parseFloat(n)) : n = parseFloat(e.offsetWidth)
        },
        offset: function(e) {
            var t, n;
            if (e)
                return e.getClientRects().length ? (t = e.getBoundingClientRect(),
                n = e.ownerDocument.defaultView,
                {
                    top: t.top + n.pageYOffset,
                    left: t.left + n.pageXOffset,
                    right: window.innerWidth - (e.offsetLeft + e.offsetWidth)
                }) : {
                    top: 0,
                    left: 0
                }
        },
        height: function(e) {
            return KTUtil.css(e, "height")
        },
        outerHeight: function(e, t) {
            var n, i = e.offsetHeight;
            return void 0 !== t && !0 === t ? (n = getComputedStyle(e),
            i += parseInt(n.marginTop) + parseInt(n.marginBottom)) : i
        },
        visible: function(e) {
            return !(0 === e.offsetWidth && 0 === e.offsetHeight)
        },
        isVisibleInContainer: function(e, t, n=0) {
            const i = e.offsetTop
              , r = i + e.clientHeight + n
              , o = t.scrollTop
              , a = o + t.clientHeight;
            return i >= o && r <= a
        },
        getRelativeTopPosition: function(e, t) {
            return e.offsetTop - t.offsetTop
        },
        attr: function(e, t, n) {
            if (null != e)
                return void 0 === n ? e.getAttribute(t) : void e.setAttribute(t, n)
        },
        hasAttr: function(e, t) {
            if (null != e)
                return !!e.getAttribute(t)
        },
        removeAttr: function(e, t) {
            null != e && e.removeAttribute(t)
        },
        animate: function(e, t, n, i, r, o) {
            var a = {};
            if (a.linear = function(e, t, n, i) {
                return n * e / i + t
            }
            ,
            r = a.linear,
            "number" == typeof e && "number" == typeof t && "number" == typeof n && "function" == typeof i) {
                "function" != typeof o && (o = function() {}
                );
                var l = window.requestAnimationFrame || function(e) {
                    window.setTimeout(e, 20)
                }
                  , s = t - e;
                i(e);
                var u = window.performance && window.performance.now ? window.performance.now() : +new Date;
                l((function a(d) {
                    var c = (d || +new Date) - u;
                    c >= 0 && i(r(c, e, s, n)),
                    c >= 0 && c >= n ? (i(t),
                    o()) : l(a)
                }
                ))
            }
        },
        actualCss: function(e, t, n) {
            var i, r = "";
            if (e instanceof HTMLElement != !1)
                return e.getAttribute("kt-hidden-" + t) && !1 !== n ? parseFloat(e.getAttribute("kt-hidden-" + t)) : (r = e.style.cssText,
                e.style.cssText = "position: absolute; visibility: hidden; display: block;",
                "width" == t ? i = e.offsetWidth : "height" == t && (i = e.offsetHeight),
                e.style.cssText = r,
                e.setAttribute("kt-hidden-" + t, i),
                parseFloat(i))
        },
        actualHeight: function(e, t) {
            return KTUtil.actualCss(e, "height", t)
        },
        actualWidth: function(e, t) {
            return KTUtil.actualCss(e, "width", t)
        },
        getScroll: function(e, t) {
            return t = "scroll" + t,
            e == window || e == document ? self["scrollTop" == t ? "pageYOffset" : "pageXOffset"] || browserSupportsBoxModel && document.documentElement[t] || document.body[t] : e[t]
        },
        css: function(e, t, n, i) {
            if (e)
                if (void 0 !== n)
                    !0 === i ? e.style.setProperty(t, n, "important") : e.style[t] = n;
                else {
                    var r = (e.ownerDocument || document).defaultView;
                    if (r && r.getComputedStyle)
                        return t = t.replace(/([A-Z])/g, "-$1").toLowerCase(),
                        r.getComputedStyle(e, null).getPropertyValue(t);
                    if (e.currentStyle)
                        return t = t.replace(/\-(\w)/g, (function(e, t) {
                            return t.toUpperCase()
                        }
                        )),
                        n = e.currentStyle[t],
                        /^\d+(em|pt|%|ex)?$/i.test(n) ? function(t) {
                            var n = e.style.left
                              , i = e.runtimeStyle.left;
                            return e.runtimeStyle.left = e.currentStyle.left,
                            e.style.left = t || 0,
                            t = e.style.pixelLeft + "px",
                            e.style.left = n,
                            e.runtimeStyle.left = i,
                            t
                        }(n) : n
                }
        },
        slide: function(e, t, n, i, r) {
            if (!(!e || "up" == t && !1 === KTUtil.visible(e) || "down" == t && !0 === KTUtil.visible(e))) {
                n = n || 600;
                var o = KTUtil.actualHeight(e)
                  , a = !1
                  , l = !1;
                KTUtil.css(e, "padding-top") && !0 !== KTUtil.data(e).has("slide-padding-top") && KTUtil.data(e).set("slide-padding-top", KTUtil.css(e, "padding-top")),
                KTUtil.css(e, "padding-bottom") && !0 !== KTUtil.data(e).has("slide-padding-bottom") && KTUtil.data(e).set("slide-padding-bottom", KTUtil.css(e, "padding-bottom")),
                KTUtil.data(e).has("slide-padding-top") && (a = parseInt(KTUtil.data(e).get("slide-padding-top"))),
                KTUtil.data(e).has("slide-padding-bottom") && (l = parseInt(KTUtil.data(e).get("slide-padding-bottom"))),
                "up" == t ? (e.style.cssText = "display: block; overflow: hidden;",
                a && KTUtil.animate(0, a, n, (function(t) {
                    e.style.paddingTop = a - t + "px"
                }
                ), "linear"),
                l && KTUtil.animate(0, l, n, (function(t) {
                    e.style.paddingBottom = l - t + "px"
                }
                ), "linear"),
                KTUtil.animate(0, o, n, (function(t) {
                    e.style.height = o - t + "px"
                }
                ), "linear", (function() {
                    e.style.height = "",
                    e.style.display = "none",
                    "function" == typeof i && i()
                }
                ))) : "down" == t && (e.style.cssText = "display: block; overflow: hidden;",
                a && KTUtil.animate(0, a, n, (function(t) {
                    e.style.paddingTop = t + "px"
                }
                ), "linear", (function() {
                    e.style.paddingTop = ""
                }
                )),
                l && KTUtil.animate(0, l, n, (function(t) {
                    e.style.paddingBottom = t + "px"
                }
                ), "linear", (function() {
                    e.style.paddingBottom = ""
                }
                )),
                KTUtil.animate(0, o, n, (function(t) {
                    e.style.height = t + "px"
                }
                ), "linear", (function() {
                    e.style.height = "",
                    e.style.display = "",
                    e.style.overflow = "",
                    "function" == typeof i && i()
                }
                )))
            }
        },
        slideUp: function(e, t, n) {
            KTUtil.slide(e, "up", t, n)
        },
        slideDown: function(e, t, n) {
            KTUtil.slide(e, "down", t, n)
        },
        show: function(e, t) {
            void 0 !== e && (e.style.display = t || "block")
        },
        hide: function(e) {
            void 0 !== e && (e.style.display = "none")
        },
        addEvent: function(e, t, n, i) {
            null != e && e.addEventListener(t, n)
        },
        removeEvent: function(e, t, n) {
            null !== e && e.removeEventListener(t, n)
        },
        on: function(e, t, n, i) {
            if (null !== e) {
                var r = KTUtil.getUniqueId("event");
                return window.KTUtilDelegatedEventHandlers[r] = function(n) {
                    for (var r = e.querySelectorAll(t), o = n.target; o && o !== e; ) {
                        for (var a = 0, l = r.length; a < l; a++)
                            o === r[a] && i.call(o, n);
                        o = o.parentNode
                    }
                }
                ,
                KTUtil.addEvent(e, n, window.KTUtilDelegatedEventHandlers[r]),
                r
            }
        },
        off: function(e, t, n) {
            e && window.KTUtilDelegatedEventHandlers[n] && (KTUtil.removeEvent(e, t, window.KTUtilDelegatedEventHandlers[n]),
            delete window.KTUtilDelegatedEventHandlers[n])
        },
        one: function(e, t, n) {
            e.addEventListener(t, (function t(i) {
                return i.target && i.target.removeEventListener && i.target.removeEventListener(i.type, t),
                e && e.removeEventListener && i.currentTarget.removeEventListener(i.type, t),
                n(i)
            }
            ))
        },
        hash: function(e) {
            var t, n = 0;
            if (0 === e.length)
                return n;
            for (t = 0; t < e.length; t++)
                n = (n << 5) - n + e.charCodeAt(t),
                n |= 0;
            return n
        },
        animateClass: function(e, t, n) {
            var i, r = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "mozAnimationEnd",
                WebkitAnimation: "webkitAnimationEnd",
                msAnimation: "msAnimationEnd"
            };
            for (var o in r)
                void 0 !== e.style[o] && (i = r[o]);
            KTUtil.addClass(e, t),
            KTUtil.one(e, i, (function() {
                KTUtil.removeClass(e, t)
            }
            )),
            n && KTUtil.one(e, i, n)
        },
        transitionEnd: function(e, t) {
            var n, i = {
                transition: "transitionend",
                OTransition: "oTransitionEnd",
                MozTransition: "mozTransitionEnd",
                WebkitTransition: "webkitTransitionEnd",
                msTransition: "msTransitionEnd"
            };
            for (var r in i)
                void 0 !== e.style[r] && (n = i[r]);
            KTUtil.one(e, n, t)
        },
        animationEnd: function(e, t) {
            var n, i = {
                animation: "animationend",
                OAnimation: "oAnimationEnd",
                MozAnimation: "mozAnimationEnd",
                WebkitAnimation: "webkitAnimationEnd",
                msAnimation: "msAnimationEnd"
            };
            for (var r in i)
                void 0 !== e.style[r] && (n = i[r]);
            KTUtil.one(e, n, t)
        },
        animateDelay: function(e, t) {
            for (var n = ["webkit-", "moz-", "ms-", "o-", ""], i = 0; i < n.length; i++)
                KTUtil.css(e, n[i] + "animation-delay", t)
        },
        animateDuration: function(e, t) {
            for (var n = ["webkit-", "moz-", "ms-", "o-", ""], i = 0; i < n.length; i++)
                KTUtil.css(e, n[i] + "animation-duration", t)
        },
        scrollTo: function(e, t, n) {
            n = n || 500;
            var i, r, o = e ? KTUtil.offset(e).top : 0;
            t && (o -= t),
            i = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
            r = o,
            KTUtil.animate(i, r, n, (function(e) {
                document.documentElement.scrollTop = e,
                document.body.parentNode.scrollTop = e,
                document.body.scrollTop = e
            }
            ))
        },
        scrollTop: function(e, t) {
            KTUtil.scrollTo(null, e, t)
        },
        isArray: function(e) {
            return e && Array.isArray(e)
        },
        isEmpty: function(e) {
            for (var t in e)
                if (e.hasOwnProperty(t))
                    return !1;
            return !0
        },
        numberString: function(e) {
            for (var t = (e += "").split("."), n = t[0], i = t.length > 1 ? "." + t[1] : "", r = /(\d+)(\d{3})/; r.test(n); )
                n = n.replace(r, "$1,$2");
            return n + i
        },
        isRTL: function() {
            return "rtl" === document.querySelector("html").getAttribute("direction")
        },
        snakeToCamel: function(e) {
            return e.replace(/(\-\w)/g, (function(e) {
                return e[1].toUpperCase()
            }
            ))
        },
        filterBoolean: function(e) {
            return !0 === e || "true" === e || !1 !== e && "false" !== e && e
        },
        setHTML: function(e, t) {
            e.innerHTML = t
        },
        getHTML: function(e) {
            if (e)
                return e.innerHTML
        },
        getDocumentHeight: function() {
            var e = document.body
              , t = document.documentElement;
            return Math.max(e.scrollHeight, e.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight)
        },
        getScrollTop: function() {
            return (document.scrollingElement || document.documentElement).scrollTop
        },
        colorLighten: function(e, t) {
            const n = function(e, t) {
                let n = parseInt(e, 16) + t
                  , i = n > 255 ? 255 : n;
                return i = i.toString(16).length > 1 ? i.toString(16) : `0${i.toString(16)}`,
                i
            };
            return e = e.indexOf("#") >= 0 ? e.substring(1, e.length) : e,
            t = parseInt(255 * t / 100),
            `#${n(e.substring(0, 2), t)}${n(e.substring(2, 4), t)}${n(e.substring(4, 6), t)}`
        },
        colorDarken: function(e, t) {
            const n = function(e, t) {
                let n = parseInt(e, 16) - t
                  , i = n < 0 ? 0 : n;
                return i = i.toString(16).length > 1 ? i.toString(16) : `0${i.toString(16)}`,
                i
            };
            return e = e.indexOf("#") >= 0 ? e.substring(1, e.length) : e,
            t = parseInt(255 * t / 100),
            `#${n(e.substring(0, 2), t)}${n(e.substring(2, 4), t)}${n(e.substring(4, 6), t)}`
        },
        throttle: function(e, t, n) {
            e || (e = setTimeout((function() {
                t(),
                e = void 0
            }
            ), n))
        },
        debounce: function(e, t, n) {
            clearTimeout(e),
            e = setTimeout(t, n)
        },
        parseJson: function(e) {
            if ("string" == typeof e) {
                var t = (e = e.replace(/'/g, '"')).replace(/(\w+:)|(\w+ :)/g, (function(e) {
                    return '"' + e.substring(0, e.length - 1) + '":'
                }
                ));
                try {
                    e = JSON.parse(t)
                } catch (e) {}
            }
            return e
        },
        getResponsiveValue: function(e, t) {
            var n = this.getViewPort().width
              , i = null;
            if ("object" == typeof (e = KTUtil.parseJson(e))) {
                var r, o, a = -1;
                for (var l in e)
                    (o = "default" === l ? 0 : this.getBreakpoint(l) ? this.getBreakpoint(l) : parseInt(l)) <= n && o > a && (r = l,
                    a = o);
                i = r ? e[r] : e
            } else
                i = e;
            return i
        },
        each: function(e, t) {
            return [].slice.call(e).map(t)
        },
        getSelectorMatchValue: function(e) {
            var t = null;
            if ("object" == typeof (e = KTUtil.parseJson(e))) {
                if (void 0 !== e.match) {
                    var n = Object.keys(e.match)[0];
                    e = Object.values(e.match)[0],
                    null !== document.querySelector(n) && (t = e)
                }
            } else
                t = e;
            return t
        },
        getConditionalValue: function(e) {
            e = KTUtil.parseJson(e);
            var t = KTUtil.getResponsiveValue(e);
            return null !== t && void 0 !== t.match && (t = KTUtil.getSelectorMatchValue(t)),
            null === t && null !== e && void 0 !== e.default && (t = e.default),
            t
        },
        getCssVariableValue: function(e) {
            var t = getComputedStyle(document.documentElement).getPropertyValue(e);
            return t && t.length > 0 && (t = t.trim()),
            t
        },
        isInViewport: function(e) {
            var t = e.getBoundingClientRect();
            return t.top >= 0 && t.left >= 0 && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth)
        },
        isPartiallyInViewport: function(e) {
            let t = e.getBoundingClientRect().left
              , n = e.getBoundingClientRect().top
              , i = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
              , r = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
              , o = e.clientWidth
              , a = e.clientHeight;
            return n < r && n + a > 0 && t < i && t + o > 0
        },
        onDOMContentLoaded: function(e) {
            "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : e()
        },
        inIframe: function() {
            try {
                return window.self !== window.top
            } catch (e) {
                return !0
            }
        },
        isHexColor: e=>/^#[0-9A-F]{6}$/i.test(e)
    }
}();
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTUtil);
var KTAppLayoutBuilder = function() {
    var e, t, n, i, r, o, a, l, s, u;
    return {
        init: function() {
            var d, c, m;
            (a = document.querySelector("#kt_app_engage"),
            s = document.querySelector("#kt_app_engage_toggle_on"),
            l = document.querySelector("#kt_app_engage_toggle_off"),
            u = document.querySelector("#kt_app_engage_prebuilts_modal"),
            a && u && (null !== u && "1" !== KTCookie.get("app_engage_prebuilts_modal_displayed") && setTimeout((function() {
                new bootstrap.Modal(u).show();
                const e = new Date(Date.now() + 2592e6);
                KTCookie.set("app_engage_prebuilts_modal_displayed", "1", {
                    expires: e
                })
            }
            ), 3e3),
            function() {
                u.querySelector('[data-kt-element="selected"]');
                const e = u.querySelector('[data-kt-element="title"]')
                  , t = u.querySelector('[data-kt-menu="true"]');
                KTUtil.on(u, "[data-kt-mode]", "click", (function(n) {
                    const i = this.innerText
                      , r = this.getAttribute("data-kt-mode")
                      , o = t.querySelector(".menu-link.active")
                      , a = document.querySelector("#kt_app_engage_prebuilts_view_image")
                      , l = document.querySelector("#kt_app_engage_prebuilts_view_text");
                    e.innerText = i,
                    o && o.classList.remove("active"),
                    this.classList.add("active"),
                    "image" === r ? (a.classList.remove("d-none"),
                    a.classList.add("d-block"),
                    l.classList.remove("d-block"),
                    l.classList.add("d-none")) : (l.classList.remove("d-none"),
                    l.classList.add("d-block"),
                    a.classList.remove("d-block"),
                    a.classList.add("d-none"))
                }
                ))
            }()),
            a && s && l && (l.addEventListener("click", (function(e) {
                e.preventDefault();
                const t = new Date(Date.now() + 864e5);
                KTCookie.set("app_engage_hide", "1", {
                    expires: t
                }),
                a.classList.add("app-engage-hide")
            }
            )),
            s.addEventListener("click", (function(e) {
                e.preventDefault(),
                KTCookie.remove("app_engage_hide"),
                a.classList.remove("app-engage-hide")
            }
            ))),
            e = document.querySelector("#kt_app_layout_builder_form")) && (n = e.getAttribute("action"),
            t = document.querySelector("#kt_app_layout_builder_action"),
            i = document.querySelector("#kt_app_layout_builder_preview"),
            r = document.querySelector("#kt_app_layout_builder_export"),
            o = document.querySelector("#kt_app_layout_builder_reset"),
            i && i.addEventListener("click", (function(r) {
                r.preventDefault(),
                t.value = "preview",
                i.setAttribute("data-kt-indicator", "on");
                var o = $(e).serialize();
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: n,
                    data: o,
                    success: function(e, t, n) {
                        history.scrollRestoration && (history.scrollRestoration = "manual"),
                        location.reload()
                    },
                    error: function(e) {
                        toastr.error("Please try it again later.", "Something went wrong!", {
                            timeOut: 0,
                            extendedTimeOut: 0,
                            closeButton: !0,
                            closeDuration: 0
                        })
                    },
                    complete: function() {
                        i.removeAttribute("data-kt-indicator")
                    }
                })
            }
            )),
            r && r.addEventListener("click", (function(i) {
                i.preventDefault(),
                toastr.success("Process has been started and it may take a while.", "Generating HTML!", {
                    timeOut: 0,
                    extendedTimeOut: 0,
                    closeButton: !0,
                    closeDuration: 0
                }),
                r.setAttribute("data-kt-indicator", "on"),
                t.value = "export";
                var o = $(e).serialize();
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: n,
                    data: o,
                    success: function(e, t, i) {
                        var o = setInterval((function() {
                            $("<iframe/>").attr({
                                src: n + "?layout-builder[action]=export&download=1&output=" + e,
                                style: "visibility:hidden;display:none"
                            }).ready((function() {
                                clearInterval(o),
                                r.removeAttribute("data-kt-indicator")
                            }
                            )).appendTo("body")
                        }
                        ), 3e3)
                    },
                    error: function(e) {
                        toastr.error("Please try it again later.", "Something went wrong!", {
                            timeOut: 0,
                            extendedTimeOut: 0,
                            closeButton: !0,
                            closeDuration: 0
                        }),
                        r.removeAttribute("data-kt-indicator")
                    }
                })
            }
            )),
            o && o.addEventListener("click", (function(i) {
                i.preventDefault(),
                o.setAttribute("data-kt-indicator", "on"),
                t.value = "reset";
                var r = $(e).serialize();
                $.ajax({
                    type: "POST",
                    dataType: "html",
                    url: n,
                    data: r,
                    success: function(e, t, n) {
                        history.scrollRestoration && (history.scrollRestoration = "manual"),
                        location.reload()
                    },
                    error: function(e) {
                        toastr.error("Please try it again later.", "Something went wrong!", {
                            timeOut: 0,
                            extendedTimeOut: 0,
                            closeButton: !0,
                            closeDuration: 0
                        })
                    },
                    complete: function() {
                        o.removeAttribute("data-kt-indicator")
                    }
                })
            }
            )),
            d = document.querySelector("#kt_layout_builder_theme_mode_light"),
            c = document.querySelector("#kt_layout_builder_theme_mode_dark"),
            m = document.querySelector("#kt_layout_builder_theme_mode_" + KTThemeMode.getMode()),
            d && d.addEventListener("click", (function() {
                this.checked = !0,
                this.closest('[data-kt-buttons="true"]').querySelector(".form-check-image.active").classList.remove("active"),
                this.closest(".form-check-image").classList.add("active"),
                KTThemeMode.setMode("light")
            }
            )),
            c && c.addEventListener("click", (function() {
                this.checked = !0,
                this.closest('[data-kt-buttons="true"]').querySelector(".form-check-image.active").classList.remove("active"),
                this.closest(".form-check-image").classList.add("active"),
                KTThemeMode.setMode("dark")
            }
            )),
            m && (m.closest(".form-check-image").classList.add("active"),
            m.checked = !0))
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTAppLayoutBuilder.init()
}
));
var KTLayoutSearch = function() {
    var e, t, n, i, r, o, a, l, s, u, d, c, m, f = function(e) {
        setTimeout((function() {
            var i = KTUtil.getRandomInt(1, 3);
            t.classList.add("d-none"),
            3 === i ? (n.classList.add("d-none"),
            r.classList.remove("d-none")) : (n.classList.remove("d-none"),
            r.classList.add("d-none")),
            e.complete()
        }
        ), 1500)
    }, p = function(e) {
        t.classList.remove("d-none"),
        n.classList.add("d-none"),
        r.classList.add("d-none")
    };
    return {
        init: function() {
            (e = document.querySelector("#kt_header_search")) && (i = e.querySelector('[data-kt-search-element="wrapper"]'),
            e.querySelector('[data-kt-search-element="form"]'),
            t = e.querySelector('[data-kt-search-element="main"]'),
            n = e.querySelector('[data-kt-search-element="results"]'),
            r = e.querySelector('[data-kt-search-element="empty"]'),
            o = e.querySelector('[data-kt-search-element="preferences"]'),
            a = e.querySelector('[data-kt-search-element="preferences-show"]'),
            l = e.querySelector('[data-kt-search-element="preferences-dismiss"]'),
            s = e.querySelector('[data-kt-search-element="advanced-options-form"]'),
            u = e.querySelector('[data-kt-search-element="advanced-options-form-show"]'),
            d = e.querySelector('[data-kt-search-element="advanced-options-form-cancel"]'),
            c = e.querySelector('[data-kt-search-element="advanced-options-form-search"]'),
            (m = new KTSearch(e)).on("kt.search.process", f),
            m.on("kt.search.clear", p),
            a.addEventListener("click", (function() {
                i.classList.add("d-none"),
                o.classList.remove("d-none")
            }
            )),
            l.addEventListener("click", (function() {
                i.classList.remove("d-none"),
                o.classList.add("d-none")
            }
            )),
            u.addEventListener("click", (function() {
                i.classList.add("d-none"),
                s.classList.remove("d-none")
            }
            )),
            d.addEventListener("click", (function() {
                i.classList.remove("d-none"),
                s.classList.add("d-none")
            }
            )),
            c.addEventListener("click", (function() {}
            )))
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTLayoutSearch.init()
}
));
var KTThemeModeUser = {
    init: function() {
        KTThemeMode.on("kt.thememode.change", (function() {
            var e = KTThemeMode.getMenuMode()
              , t = KTThemeMode.getMode();
            console.log("user selected theme mode:" + e),
            console.log("theme mode:" + t)
        }
        ))
    }
};
KTUtil.onDOMContentLoaded((function() {
    KTThemeModeUser.init()
}
)),
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTThemeModeUser);
var KTThemeMode = function() {
    var e, t = this, n = function() {
        return document.documentElement.hasAttribute("data-bs-theme") ? document.documentElement.getAttribute("data-bs-theme") : null !== localStorage.getItem("data-bs-theme") ? localStorage.getItem("data-bs-theme") : "system" === r() ? o() : "light"
    }, i = function(i, r) {
        var l = n();
        "system" === r ? o() !== i && (i = o()) : i !== r && (r = i);
        var s = e ? e.querySelector('[data-kt-element="mode"][data-kt-value="' + r + '"]') : null;
        document.documentElement.setAttribute("data-kt-theme-mode-switching", "true"),
        document.documentElement.setAttribute("data-bs-theme", i),
        setTimeout((function() {
            document.documentElement.removeAttribute("data-kt-theme-mode-switching")
        }
        ), 300),
        localStorage.setItem("data-bs-theme", i),
        s && (localStorage.setItem("data-bs-theme-mode", r),
        a(s)),
        i !== l && KTEventHandler.trigger(document.documentElement, "kt.thememode.change", t)
    }, r = function() {
        if (!e)
            return null;
        var t = e ? e.querySelector('.active[data-kt-element="mode"]') : null;
        return t && t.getAttribute("data-kt-value") ? t.getAttribute("data-kt-value") : document.documentElement.hasAttribute("data-bs-theme-mode") ? document.documentElement.getAttribute("data-bs-theme-mode") : null !== localStorage.getItem("data-bs-theme-mode") ? localStorage.getItem("data-bs-theme-mode") : "undefined" != typeof defaultThemeMode ? defaultThemeMode : "light"
    }, o = function() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }, a = function(t) {
        var n = t.getAttribute("data-kt-value")
          , i = e.querySelector('.active[data-kt-element="mode"]');
        i && i.classList.remove("active"),
        t.classList.add("active"),
        localStorage.setItem("data-bs-theme-mode", n)
    };
    return {
        init: function() {
            e = document.querySelector('[data-kt-element="theme-mode-menu"]'),
            i(n(), r()),
            KTEventHandler.trigger(document.documentElement, "kt.thememode.init", t),
            e && [].slice.call(e.querySelectorAll('[data-kt-element="mode"]')).map((function(e) {
                e.addEventListener("click", (function(t) {
                    t.preventDefault();
                    var n = e.getAttribute("data-kt-value")
                      , r = n;
                    "system" === n && (r = o()),
                    i(r, n)
                }
                ))
            }
            ))
        },
        getMode: function() {
            return n()
        },
        getMenuMode: function() {
            return r()
        },
        getSystemMode: function() {
            return o()
        },
        setMode: function(e) {
            return i(e)
        },
        on: function(e, t) {
            return KTEventHandler.on(document.documentElement, e, t)
        },
        off: function(e, t) {
            return KTEventHandler.off(document.documentElement, e, t)
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTThemeMode.init()
}
)),
"undefined" != typeof module && void 0 !== module.exports && (module.exports = KTThemeMode);
var KTAppDemos = function() {
    var e, t, n;
    return {
        init: function() {
            (e = document.querySelector("#kt_app_demos")) && (n = document.querySelector("#kt_app_demos_sidebar_sticky_wrapper"),
            t = KTSticky.getInstance(n),
            KTUtil.on(e, '[data-kt-demos-preview-toggle="true"]', "change", (function(e) {
                const t = this.closest(".demos-filter")
                  , n = t.closest(".tab-pane")
                  , i = t.querySelector('[name="direction"]:checked').value
                  , r = t.querySelector('[name="mode"]:checked').value;
                [].slice.call(n.querySelectorAll('[data-kt-href="true"]')).map((function(e) {
                    const t = e.getAttribute("data-kt-href-" + r + "-" + i);
                    e.setAttribute("href", t),
                    [].slice.call(e.querySelectorAll("[data-kt-demo-preview-thumbnail]")).map((function(e) {
                        e.classList.add("d-none")
                    }
                    )),
                    e.querySelector('[data-kt-demo-preview-thumbnail="' + r + "-" + i + '"]').classList.remove("d-none")
                }
                ))
            }
            )),
            e.querySelectorAll('[data-kt-toggle="tab"]').forEach((e=>{
                e.addEventListener("click", (function(n) {
                    KTUtil.isDesktopDevice() && "on" === document.body.getAttribute("data-kt-demos-sidebar-sticky") ? (window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    }),
                    t.update(),
                    bootstrap.Tab.getOrCreateInstance(e).show()) : bootstrap.Tab.getOrCreateInstance(e).show()
                }
                ))
            }
            )),
            function() {
                KTUtil.on(e, '[data-kt-demos-grid-toggle="true"]', "click", (function(e) {
                    e.preventDefault();
                    const t = this.getAttribute("data-kt-demos-grid-mode")
                      , i = new Date(Date.now() + 432e8);
                    KTCookie.set("app_demos_grid_mode", t, {
                        expires: i
                    }),
                    [].slice.call(document.querySelectorAll('[data-kt-demos-grid-toggle="true"]')).map((function(e) {
                        e.getAttribute("data-kt-demos-grid-mode") === t ? e.classList.add("active") : e.classList.remove("active")
                    }
                    )),
                    n(t)
                }
                ));
                var n = function(n) {
                    var i = document.querySelector("#kt_app_demos_sidebar_nav")
                      , r = document.querySelector("#kt_app_demos_sidebar_sticky_wrapper");
                    [].slice.call(document.querySelectorAll('[data-kt-grid-col="true"]')).map((function(t) {
                        "3" === n ? (t.classList.add("col-md-4"),
                        t.classList.remove("col-md-6"),
                        i.classList.remove("w-250px"),
                        i.classList.add("w-70px"),
                        i.classList.add("w-lg-90px"),
                        i.classList.add("app-sidebar-nav-minimized"),
                        e.classList.add("app-demos-3-cols"),
                        r.setAttribute("data-kt-sticky-width", "50px")) : (t.classList.add("col-md-6"),
                        t.classList.remove("col-md-3"),
                        i.classList.add("w-250px"),
                        i.classList.remove("w-lg-90px"),
                        i.classList.remove("w-70px"),
                        i.classList.remove("app-sidebar-nav-minimized"),
                        e.classList.remove("app-demos-3-cols"),
                        r.setAttribute("data-kt-sticky-width", "210px"))
                    }
                    )),
                    t.update(),
                    [].slice.call(document.querySelectorAll(".demos-header[data-kt-sticky]")).map((function(e) {
                        KTSticky.getInstance(e).update()
                    }
                    ))
                }
            }())
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTAppDemos.init()
}
));
var KTAppHero = function() {
    var e, t, n, i, r, o, a = function(e) {
        const n = e.target.value;
        KTUtil.css(r, "width", `${n}%`),
        KTUtil.css(t, "left", `calc(${n}% - 0px)`)
    }, l = function() {
        const t = KTUtil.css(e, "width");
        KTUtil.css(i, "width", t),
        KTUtil.css(o, "width", t)
    }, s = function() {
        window.addEventListener("resize", l)
    };
    return {
        init: function() {
            e = document.querySelector(".preview"),
            n = document.querySelector(".preview .preview-slider"),
            t = document.querySelector(".preview .preview-drag"),
            document.querySelector(".preview .preview-light"),
            i = document.querySelector(".preview .preview-light > img"),
            r = document.querySelector(".preview .preview-dark"),
            o = document.querySelector(".preview .preview-dark > img"),
            e && (l(),
            s(),
            n.addEventListener("input", a),
            n.addEventListener("change", a))
        }
    }
}();
KTUtil.onDOMContentLoaded((function() {
    KTAppHero.init()
}
));

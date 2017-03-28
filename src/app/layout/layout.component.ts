import { Component, ViewEncapsulation, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../app.config';
import { Message } from "primeng/components/common/api";

declare var jQuery: any;
declare var Hammer: any;

@Component({
    selector: 'layout',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './layout.template.html',
    host: {
        '[class.nav-static]': 'config.state["nav-static"]',
        '[class.app]': 'true',
        id: 'app'
    }
})
export class Layout {
    config: any;
    $sidebar: any;

    public static messageEvent: EventEmitter<any> = new EventEmitter<any>();

    msgs: Message[] = [];

    constructor(private configFn: AppConfig, private el: ElementRef, private router: Router, private zone: NgZone) {
        this.config = configFn.getConfig();
    }

    toggleSidebarListener(state): void {
        let toggleNavigation = state === 'static'
            ? this.toggleNavigationState
            : this.toggleNavigationCollapseState;
        toggleNavigation.apply(this);
        localStorage.setItem('nav-static', this.config.state['nav-static']);
    }

    toggleNavigationState(): void {
        this.config.state['nav-static'] = !this.config.state['nav-static'];
        if (!this.config.state['nav-static']) {
            this.collapseNavigation();
        }
    }

    expandNavigation(): void {
        // this method only makes sense for non-static navigation state
        if (this.isNavigationStatic()
            && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) {
            return;
        }

        jQuery('layout').removeClass('nav-collapsed');
        this.$sidebar.find('.active .active').closest('.collapse').collapse('show')
            .siblings('[data-toggle=collapse]').removeClass('collapsed');
    }

    collapseNavigation(): void {
        // this method only makes sense for non-static navigation state
        if (this.isNavigationStatic()
            && (this.configFn.isScreen('lg') || this.configFn.isScreen('xl'))) {
            return;
        }

        jQuery('layout').addClass('nav-collapsed');
        this.$sidebar.find('.collapse.in').collapse('hide')
            .siblings('[data-toggle=collapse]').addClass('collapsed');
    }

    /**
     * Check and set navigation collapse according to screen size and navigation state
     */
    checkNavigationState(): void {
        if (this.isNavigationStatic()) {
            if (this.configFn.isScreen('sm')
                || this.configFn.isScreen('xs') || this.configFn.isScreen('md')) {
                this.collapseNavigation();
            }
        } else {
            if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
                setTimeout(() => {
                    this.collapseNavigation();
                }, this.config.settings.navCollapseTimeout);
            } else {
                this.collapseNavigation();
            }
        }
    }

    isNavigationStatic(): boolean {
        return this.config.state['nav-static'] === true;
    }

    toggleNavigationCollapseState(): void {
        if (jQuery('layout').is('.nav-collapsed')) {
            this.expandNavigation();
        } else {
            this.collapseNavigation();
        }
    }

    _sidebarMouseEnter(): void {
        if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
            this.expandNavigation();
        }
    }

    _sidebarMouseLeave(): void {
        if (this.configFn.isScreen('lg') || this.configFn.isScreen('xl')) {
            this.collapseNavigation();
        }
    }

    enableSwipeCollapsing(): void {
        let swipe = new Hammer(document.getElementById('content-wrap'));
        let d = this;

        swipe.on('swipeleft', () => {
            setTimeout(() => {
                if (d.configFn.isScreen('md')) {
                    return;
                }

                if (!jQuery('layout').is('.nav-collapsed')) {
                    d.collapseNavigation();
                }
            });
        });

        swipe.on('swiperight', () => {
            if (d.configFn.isScreen('md')) {
                return;
            }

            if (jQuery('layout').is('.nav-collapsed')) {
                d.expandNavigation();
            }
        });
    }

    collapseNavIfSmallScreen(): void {
        if (this.configFn.isScreen('xs')
            || this.configFn.isScreen('sm') || this.configFn.isScreen('md')) {
            this.collapseNavigation();
        }
    }

    ngOnInit() {
        if (!localStorage.getItem("token")) {
            console.log("alo");
            this.router.navigate(['/login']);
            return;
        }
        if (localStorage.getItem('nav-static') === 'true') {
            this.config.state['nav-static'] = true;
        }

        let $el = jQuery(this.el.nativeElement);
        this.$sidebar = $el.find('[sidebar]');

        $el.find('a[href="#"]').on('click', (e) => {
            e.preventDefault();
        });

        this.$sidebar.on('mouseenter', this._sidebarMouseEnter.bind(this));
        this.$sidebar.on('mouseleave', this._sidebarMouseLeave.bind(this));

        this.checkNavigationState();

        this.$sidebar.on('click', () => {
            if (jQuery('layout').is('.nav-collapsed')) {
                this.expandNavigation();
            }
        });

        this.router.events.subscribe(() => {
            this.collapseNavIfSmallScreen();
            window.scrollTo(0, 0);
        });

        if ('ontouchstart' in window) {
            this.enableSwipeCollapsing();
        }

        this.$sidebar.find('.collapse').on('show.bs.collapse', function (e): void {
            // execute only if we're actually the .collapse element initiated event
            // return for bubbled events
            if (e.target !== e.currentTarget) {
                return;
            }

            let $triggerLink = jQuery(this).prev('[data-toggle=collapse]');
            jQuery($triggerLink.data('parent'))
                .find('.collapse.in').not(jQuery(this)).collapse('hide');
        })
        /* adding additional classes to navigation link li-parent
         for several purposes. see navigation styles */
            .on('show.bs.collapse', function (e): void {
                // execute only if we're actually the .collapse element initiated event
                // return for bubbled events
                if (e.target !== e.currentTarget) {
                    return;
                }

                jQuery(this).closest('li').addClass('open');
            }).on('hide.bs.collapse', function (e): void {
            // execute only if we're actually the .collapse element initiated event
            // return for bubbled events
            if (e.target !== e.currentTarget) {
                return;
            }

            jQuery(this).closest('li').removeClass('open');
        });

        Layout.messageEvent.subscribe(msg => {
            this.showMessage(msg.title, msg.message, msg.type);
        });
    }

    showMessage(title, message, type) {
        this.zone.run(() => {
            this.msgs = [];
            this.msgs.push({severity: type, summary: title, detail: message});
        });
    }

}

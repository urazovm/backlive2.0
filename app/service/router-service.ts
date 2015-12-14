import {Injectable, Directive, ElementRef, DynamicComponentLoader} from 'angular2/angular2';
import {Location, Router, RouteDefinition, RouterOutlet, ComponentInstruction} from 'angular2/router';

import {UserService} from './user-service';
import {Common, Object} from '../utility/common';

export interface RouteMap {
	route: string[],
	component: any,
	isRoot?: boolean,
	isPublic?: boolean,
	isDefault?: boolean,
	isSplash?: boolean
}

@Directive({selector: 'auth-router-outlet'})
export class AuthRouterOutlet extends RouterOutlet {
	router: Router;
	publicRoutes: string[] = [];
	
	constructor(elementRef: ElementRef, loader: DynamicComponentLoader, parentRouter:Router) {
		super(elementRef, loader, parentRouter, null);
		this.router = parentRouter;	
	}
	
	activate(nextInstruction: ComponentInstruction) : Promise<any> {
		var route = nextInstruction.componentType == RouterService.rootRouteMap.component 
					? RouterService.rootRouteMap.route : RouterService.pathRoute(nextInstruction.urlPath);
		
		RouterService.lastRoute = route;
		
		if(!RouterService.enabled) {
			nextInstruction = this.router.generate(RouterService.splashRoute).component;
		}
		else if(RouterService.accessDenied(route)) {
			this.router.navigate(RouterService.defaultRoute); //include this only if we don't want url to show as page user tried to access
			nextInstruction = this.router.generate(RouterService.defaultRoute).component;
		}

		return super.activate(nextInstruction);
	}
}

@Injectable()
export class RouterService {
	private static router: Router;
	private static location: Location;
	private static routeMap: RouteMap[];
	private static publicRoutes: string[] = [];
	private static userService: UserService;

	static enabled: boolean;
	static lastRoute: string[];
	static rootRouteMap: any;
	static splashRoute: any;
	static defaultRoute: any;
	
	constructor(router: Router, location: Location, routerOutlet: AuthRouterOutlet, userService: UserService) {
		RouterService.router = router;
		RouterService.userService = userService;
		RouterService.location = location;
		
		RouterService.routeMap.forEach(map => {
			if(map.isPublic) {
				RouterService.publicRoutes.push(map.route[0]);
			}
			
			if(map.isSplash){
				RouterService.splashRoute = map.route;
			}
			
			if(map.isDefault){
				RouterService.defaultRoute = map.route;
			}
		});
	}
	
	isRouteActive(route: string[]) {
		return route ? RouterService.router.isRouteActive(RouterService.router.generate(route)) : false;
	}
	
	subscribe(callback: Function) {
		RouterService.router.subscribe((route: string) => callback(route));
	}
	
	navigate(route: string[]) {
		RouterService.router.navigate(route);
	}
	
	// application wide routes, these are passed to the @RouteConfig of the main app component
	static get AppRoutes(): RouteDefinition[] {
		var routeDefinitions: RouteDefinition[] = [];
		
		for(var i = 0, map: any; map = this.routeMap[i]; i++) {
			if(map.isRoot) {
				this.rootRouteMap = map;
			}
			
			routeDefinitions.push({ path: map.isRoot ? '/' : this.routePath(map.route), component: map.component, as: this.routeAlias(map.route) });
		}
				
		return routeDefinitions;
	}
	
	static setRouteMap(routeMap: RouteMap[]) {
		this.routeMap = routeMap;
	}
	
	static enableRouting() {
		this.enabled = true;
		var split = this.lastRoute[0].split('/');
		
		if(split.length > 2) {
			this.router.navigate(['/' + split[1], { id: split[2] }]);
		}
		else {
			this.router.navigate(this.lastRoute);
		}
	}
    
    static accessDenied(route: string[] = null) {
		if(!route) {
			route = RouterService.pathRoute(this.location.path());
		}
		
        return !this.userService.user && !Common.inArray(route[0], this.publicRoutes);
    }

	static pathRoute(path: string) {
		var firstChar = path.substring(0, 1);
		
		if(firstChar != '/') {
			path = '/' + path;
			firstChar = '/';
		}
		
		return [firstChar + path.substring(1, 2).toUpperCase() + path.substring(2)];
	}
	
	static routePath(route: string[]) {
		var path = route[0].toLowerCase();
		
		if(route.length > 1) {
			for(var key in route[1]) {
				path += '/:' + key;
			}
		}
		
		return path;
	}
	
	static routeAlias(route: string[]) {
		return route[0].substring(1);
	}
}
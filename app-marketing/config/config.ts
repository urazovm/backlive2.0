declare var WEB_CONFIG: any;

export class Path {
	static baseComponentUrl = 'app-marketing/component/';
	
	static Component(path: string) { return this.baseComponentUrl + path + WEB_CONFIG.CacheBuster };
	static ComponentView(path: string) { return this.baseComponentUrl + path + '/' + this.lastPath(path) + '.component.html' + WEB_CONFIG.CacheBuster };
	static ComponentStyle(path: string) { return this.baseComponentUrl + path + '/' + this.lastPath(path) + '.component.css' + WEB_CONFIG.CacheBuster };
    static ComponentRoute(path: string) { return this.baseComponentUrl + path + '/' + this.lastPath(path) + '.component' };
	
	static JSImports(path: string) { return 'js/' + path + WEB_CONFIG.CacheBuster };
	
	private static lastPath(path: string) {
		var split = path.split('/');
		return split[split.length - 1];
	}
}

export class Config {
    static Development: boolean = WEB_CONFIG.Development;
    static CACHE_EXPIRATION:  number = WEB_CONFIG.Development ? 10 : 300; //in seconds
    static BASE_URL: string = WEB_CONFIG.BaseUrl; 
    static SITE_URL: string = WEB_CONFIG.SiteUrl;
	static SHOW_ERRORS: string = WEB_CONFIG.ShowErrors;
    static PRE_CACHE_APP_ONLY: string = WEB_CONFIG.PreCacheAppOnly;
	static APP_CRASHED: string = null;
}
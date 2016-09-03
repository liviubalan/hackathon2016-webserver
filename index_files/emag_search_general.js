var scripts = document.getElementsByTagName('script');
var index = scripts.length - 1;
var myScript = scripts[index];
var queryString = myScript.src.replace(/^[^\?]+\??/,'');
var params = parseQuery( queryString );
var sessionId = '';
var visitorId = '';
var debugProducts = [];

function loadAsync(src, callback) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;
    s.onload = callback;
    scripts[index].parentNode.insertBefore(s, scripts[index]);
}

$(window).load(function() {
    Emag.Search.init();
    if(params['enable_search_suggestions'] && params['enable_search_suggestions'] == 1 ) {
        Emag.Site.Modules.register('enable_search_suggestions');

        if(params['session_id']) { sessionId = params['session_id']; }
        if(params['visitor_id']) { visitorId = params['visitor_id']; }
        Emag.Search.Suggest.Box.sessionId = sessionId;
        Emag.Search.Suggest.Box.visitorId = visitorId;

        Emag.Search.Suggest.Box.setEngine('solr');

        try {
            Emag.Search.Suggest.Box.setup({
                'engine': Emag.Search.Suggest.Box.getEngine(),
                'locale': params['locale']
            });
        } catch(e) {
        }
    }

    if( params['widgets_log_enabled'] && params['widgets_log_enabled'] == 1 ) {
        loadAsync('/js/emag/widgets/tracking/logger.min.js?v='+params['assets_version'], function () {
            Emag.Site.Modules.register('widgets_log_enabled');

            try {
                Emag.Widgets.Tracking.Logger.setPageType(params['page_type']);

                Emag.Widgets.Tracking.Logger.init();
            } catch(e) {
                if (Emag.Widgets.Tracking.Logger.debug) {
                    console.error(e);
                }
            }
        });
    }

    Emag.Utils.init();
    Emag.Utils.setup();

    Emag.Search.Debug.Tool.init();
});

/**/
function parseQuery ( query ) {
    var Params = new Object ();
    if ( ! query ) return Params; // return empty object
    var Pairs = query.split('&');
    for ( var i = 0; i < Pairs.length; i++ ) {
        var KeyVal = Pairs[i].split('=');
        if ( ! KeyVal || KeyVal.length != 2 ) continue;
        var key = unescape( KeyVal[0] );
        var val = unescape( KeyVal[1] );

        val = val.replace(/\+/g, ' ');
        Params[key] = val;
    }
    return Params;
}

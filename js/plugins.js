// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


var UTILS = (function () {

    return {

        //add notification
        addNotification: function (nId, text) {
            var element = document.getElementById(nId);
            element.innerHTML = text;
            element.className = "notifications notificationsShow";
        },

        //remove notification
        removeNotification: function(nId){
            var element = document.getElementById(nId);
            element.className = "notifications";
        },

        //checkreport function
        checkReport: function (siteName, siteUrl, errorElemnt) {
            if (siteName.value != "" || siteUrl.value != "") {
                if (siteName.value == "") {
                    if (errorElemnt.errElmnt == null)
                        errorElemnt.errElmnt = siteName;
                    siteName.className = "textInput textInputError";
                    return false;
                }
                else {
                    siteName.className = "textInput";
                }
                //add protocol if omitted
                UTILS.fixUrlProtocol(siteUrl);
                if (UTILS.validateUrl(siteUrl.value) == false) {
                    siteUrl.className = "textInput textInputError";
                    if (errorElemnt.errElmnt == null)
                        errorElemnt.errElmnt = siteUrl;
                    return false;
                }
                else {
                    siteUrl.className = "textInput";
                }
                return true;
            }
        },

        //validate the url
        validateUrl: function (url) {

            //simple regexp
            //var urlPattern = new RegExp("(http|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?");
            //more sophisticated one-
            var urlPattern = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
            if (!urlPattern.test(url)) {
                return false;
            }
            return true;

        },
        //fix the protocol if needed
        fixUrlProtocol: function (siteUrl){
            var url=siteUrl.value;
            var httpPrefix=url.substring(0,7);
            var httpsPrefix=url.substring(0,8);
            if (httpPrefix!="http://"&&httpsPrefix!="https://"){
                //there is no protocol add one
                siteUrl.value="http://"+url;
            }
        },

        //return the left tab
        getLeftTab: function(){
            if (location.hash === "#quick-reports") {
                return "#public-folders";
            }
            if (location.hash === "#my-folders") {
                return "#quick-reports";
            }
            if (location.hash === "#my-team-folders") {
                return "#my-folders";
            }
            if (location.hash === "#public-folders") {
                return "#my-team-folders";
            }
        },
        //return the left tab
        getRightTab: function () {
            if (location.hash === "#quick-reports") {
                return "#my-folders";
            }
            if (location.hash === "#my-folders") {
                return "#my-team-folders";
            }
            if (location.hash === "#my-team-folders") {
                return "#public-folders";
            }
            if (location.hash === "#public-folders") {
                return "#quick-reports";
            }
        },
        //tab switching helper function
        //switch all tabs to be invisible
        //and all tabs to be "not selected"
        resetTabs:function(){
            document.getElementById("quick-reports-panel").className = "invisibleSection";
            document.querySelector("#quick-reports-panel>iframe").src = "";
            document.getElementById("my-folders-panel").className = "invisibleSection";
            document.querySelector("#my-folders-panel>iframe").src = "";
            document.getElementById("my-team-folders-panel").className = "invisibleSection";
            document.querySelector("#my-team-folders-panel>iframe").src = "";
            document.getElementById("public-folders-panel").className = "invisibleSection";
            document.querySelector("#public-folders-panel>iframe").src = "";
            document.querySelector(".tabs ul >li:nth-child(1)").className = "tab";
            document.querySelector(".tabs ul >li:nth-child(2)").className = "tab";
            document.querySelector(".tabs ul >li:nth-child(3)").className = "tab";
            document.querySelector(".tabs ul >li:nth-child(4)").className = "tab";
        },

        //for testing reasons
        printStmt: function (stmt){
            alert(stmt);
        },

        //event handlers functions
        //add event
        addEvent: function(elem, type, handler){
            //no need to support IE8
            elem.addEventListener(type, handler, false);
        },
        //remove event
        removeEvent: function (elem, type, handler) {
            //no need to support IE8
            elem.addEventListener(type, handler);
        },

        /**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
        isObject: function (o) {
            var toString = Object.prototype.toString;
            return (toString.call(o) === toString.call({}));
        },

        /**
		 * AJAX helper function (similar to jQuery, but far from it!)
		 *
		 * @param {string} url     URL for the ajax request
		 * @param {Object} options AJAX settings
		 */
        ajax: function (url, options) {
            var xhr = new XMLHttpRequest(),
				method = 'GET',
				options = UTILS.isObject(options) ? options : {};
            // Check if "method" was supplied
            if (options.method) {
                method = options.method;
            }
            // Setup the request
            xhr.open(method.toUpperCase(), url);

            xhr.onreadystatechange = function () {
                var status;

                // If request finished
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    // If response is OK or fetched from cache
                    if ((status >= 200 && status < 300) || status === 304) {
                        var res = xhr.responseText,
							contentType = xhr.getResponseHeader('Content-Type');
                        // If server sent a content type header, handle formats
                        if (contentType) {
                            // Handle JSON format
                            if (contentType === 'text/json' ||
								contentType === 'application/json') {
                                // JSON throws an exception on invalid JSON
                                try {
                                    res = JSON.parse(res);
                                } catch (err) {
                                    // Trigger "fail" callback if set
                                    if (options.fail) {
                                        options.fail.call(xhr, err);
                                        return;
                                    }
                                }
                                // Handle XML format
                            } else if (contentType === 'text/xml' ||
								contentType === 'application/xml') {
                                // responseXML returns a document object
                                res = xhr.responseXML;

                                // if XML was invalid, trigger fail callback
                                if (res === null && options.fail) {
                                    options.fail.call(xhr, 'Bad XML file');
                                    return;
                                }
                            }
                        }

                        // Trigger done callback with the proper response
                        if (options.done) {
                            options.done.call(xhr, res);
                        }
                    }

                }
            };

            // Fire the request
            xhr.send(null);
        }
    };
}());




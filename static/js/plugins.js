document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'plugintest',
        B = window.plus.bridge;
    var plugintest = 
    {
        Plugin_VueToAndroidIOS_userInfo : function (Argus1, Argus2, successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "Plugin_VueToAndroidIOS_userInfo", [callbackID, Argus1, Argus2]);
        },
        Plugin_AndroidIOSToVue_userInfo : function ( successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "Plugin_AndroidIOSToVue_userInfo", [callbackID]);
        },
        PluginPrintIosFunction : function (Argus1, successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "PluginPrintIosFunction", [callbackID, Argus1]);
        },
        PluginWechatLoginFunction : function (Argus1, successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "PluginWechatLoginFunction", [callbackID, Argus1]);
        },
        PluginNavigationFunction : function (Argus1, successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "PluginNavigationFunction", [callbackID, Argus1]);
        },
        PluginWXLoginFunction : function (successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);

            return B.exec(_BARCODE, "PluginWXLoginFunction", [callbackID]);
        },
        PluginTestFunctionArrayArgu : function (Argus, successCallback, errorCallback ) 
        {
            var success = typeof successCallback !== 'function' ? null : function(args) 
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code) 
            {
                errorCallback(code);
            };
            callbackID = B.callbackId(success, fail);
            return B.exec(_BARCODE, "PluginTestFunctionArrayArgu", [callbackID, Argus]);
        },      
        PluginTestFunctionSync : function (Argus1, Argus2, Argus3, Argus4) 
        {                                   
            return B.execSync(_BARCODE, "PluginTestFunctionSync", [Argus1, Argus2, Argus3, Argus4]);
        },
        PluginTestFunctionSyncArrayArgu : function (Argus) 
        {                                   
            return B.execSync(_BARCODE, "PluginTestFunctionSyncArrayArgu", [Argus]);
        }
    };
    window.plus.plugintest = plugintest;
}, true );
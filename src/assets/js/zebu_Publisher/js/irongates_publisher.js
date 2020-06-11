(function() {

   if(window.hasOwnProperty("SasPublisher")) {
        return false;
    }

    // Static variables.
    var $ = null,
        _root = typeof(_SAS_ROOT) != "undefined" ? _SAS_ROOT : "https://zebull.in",
        _uri_css = "./css/styles.css",
        _fields = ["complexty", "symbol_id", "target",  "trigPrice", "ret", "exchange", "tradingsymbol", "transaction_type", "quantity", "order_type", "price", "trigger_price", "product", "validity", "readonly", "tag", "stoploss", "squareoff", "trailing_stoploss", "disclosed_quantity"],
        _max_items = 50,
        _options = {"redirect_url": 1, "api_key": 1},
        _hosts = ["https://zebull.in", "https://test.zebu.in", "localhost", "127.0.0.1"],
        _is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Trident|IEMobile|Edge|Opera Mini/i.test(navigator.userAgent),

        modal_box = null,
        active_instance = null,
        loaded = false;

    // Scan the page on load and turn elements with data tags to buttons.
    function convertDataButtons() {
        var _fields = ["complexty", "symbol_id", "ret", "target", "trigPrice","exchange", "tradingsymbol", "transaction_type", "quantity", "order_type", "price", "trigger_price", "product", "validity", "readonly", "tag", "stoploss", "squareoff", "trailing_stoploss", "disclosed_quantity"];
        var elems = $("*[data-sas]");
        elems.each(function(i, e) {
            e = $(e);

            if(e.data("sas-trade-button-converted")) {
                return;
            }
            e.data("sas-converted", 1);

            // Get the data attribute params.
            var api_key = e.data("sas"), params = {"complexty": "regular"};
            for(var n=0; n<_fields.length; n++) {
                params[_fields[n]] = e.data(_fields[n]);
            }

            if(api_key && params.exchange && params.tradingsymbol && params.quantity && params.transaction_type) {
                ki = new SasPublisher(api_key);
                ki.add(params);
                ki.link(e);

                if(e.prop("tagName").toUpperCase() == "SAS-BUTTON") {
                    e.addClass("sas-" + params.transaction_type.toLowerCase());
                    e.attr("title", params.transaction_type + " " + params.tradingsymbol);
                }
            }
        });
    }

    // Cross-domain message from the popup dialog.
    function listenForUpdates() {
        $(window).on("message", function(e) {
            e = e.originalEvent;

            // Validate the incoming hostname.
            var a = $("<a>").attr("href", e.origin).get(0);
            if(_hosts.indexOf(a.hostname) == -1 || !e.data) {
                return;
            }
            // Parse the payload.
            try {
                var data = JSON.parse(e.data);
            } catch(e) {
                return;
            }

            if(data.hasOwnProperty("type")) {
                switch(data.type) {
                    case "finished":
                        setTimeout(function() {
                            shake($("#kite-modal"));
                        }, 500);
                    break;
                    case "resize":
                        if(data.hasOwnProperty("height") && typeof data.height == "number") {
                            var h = data.height,
                                wh = $(window).height();
                        }
                    break;
                    case "basket":
                        if(data.hasOwnProperty("request_token") && data.hasOwnProperty("status")) {
                            if(data.status == "success" || data.status == "cancelled") {
                                // Is there an active instance?
                                if(active_instance) {
                                    active_instance.callback(data.status, data.request_token);
                                    modal_box && modal_box.clear();
                                }
                            }
                        }
                    break;
                    case "login":
                        if(data.hasOwnProperty("request_token") && data.hasOwnProperty("status")) {
                            // Is there an active instance?
                            if(active_instance) {
                                active_instance.callback(data.status, data.request_token);
                                modal_box && modal_box.clear();
                            }
                        }
                    break;
                }
            }
        });
    };


    // The Sas Client class.
    window.SasPublisher = function(api_key) {
        var basket = [], // individual scrips that will be added
            options = {},
            finished_callback = null,
            id = Math.floor(Math.random()*Math.pow(10,8)); // unique id for this instance


        var me = this;

        // __ Public methods.
        this.login = function() {
            var win = _is_mobile ? modal("", "Sas") : popup("", "Sas", 475);

            // Active instance.
            active_instance = me;

            // Wait text.
            var wait = $("<h2>");
            wait.attr("style", "font-family: 'Segoe UI', 'Helvetica Neue', 'Helvetica', sans; " +
                                "text-align: center; margin-top: 60px;" +
                                "color: #666;" +
                                "font-weight: 200");
            wait.text("Connecting to zebull ...");
            win.append(wait);

            var form = createForm({"api_key": api_key, "view": "popup"}, _root, "get");
            win.append(form);

            (function(f) {
                setTimeout(function() {
                    f.submit()
                }, 500);
            })(form);

            return false;
        };

        this.connect = function(id) {
            if(basket.length < 0) {
                return false;
            }

            var basket_orders = [];
                for(n in basket) {
                    var jsonData = {
                        "symbol_id":basket[n]['symbol_id'],
                        "trading_symbol":basket[n]['tradingsymbol'],
                        "exch":basket[n]['exchange'],
                        "ltp":basket[n]['price'],
                        "transtype":basket[n]['transaction_type'],
                        "complexty": basket[n]['complexty'],
                        "prctyp":basket[n]['order_type'],
                        "pCode":basket[n]['product'],
                        "price":basket[n]['price'],
                        "trigPrice":basket[n]['trigPrice'],
                        "ret":'day',
                        "qty":basket[n]['quantity'],
                        "stopLoss":basket[n]['stoploss'],
                        "target":basket[n]['target'],
                        "trailing_stop_loss":basket[n]['trailing_stoploss']
                    };
                    basket_orders.push(jsonData);
                }
                  $.ajax({
                    url: 'https://www.zebull.in/rest/MobullService/placeOrder/insertPlaceOrderRecords',
                    type: 'post',
                    dataType: 'text',
                    contentType: 'application/json',
                    data: JSON.stringify(basket_orders),
                    success: function (res) {
                      window.open(res, 'Win 1', 'width=780, height=500, top=80, left=200, resizable=1, status=no, menubar=no, toolbar=no, scrollbars=yes', true);
                    },
                    error: function (err) {
                      console.log(err)
                    },
                  });

            return false;
        };

        // Set the 'finished' callback method.
        // this.finished = function(callback) {
        //     finished_callback = callback;
        // };

        // Render trade button.
        this.renderButton = function(target) {
            if(typeof(target) == "string") {
                target = $(target);
            }
            if(!target || typeof(target) != "object") return;

            // Create the link.
            var a = $("<button>").attr("title", "Trade with zebu").
                    attr("class", "sas-trade-button");

            // Basket only has one stock?
            if(basket.length == 1) {
                a.addClass("sas-" + basket[0].transaction_type.toLowerCase());
                a.attr("title", basket[0].transaction_type + " " + basket[0].tradingsymbol);
            }

            // Click event.
            a.click(function(e) {
                e.preventDefault();
                $(this).blur();
                me.connect();

                return false;
            });

            $(target).append(a)
        };

        // Link the basket to a given target.
        this.link = function(target) {
            if(typeof(target) == "string") {
                target = $(target);
            }
            if(!target || typeof(target) != "object") return;

            target.click(function(e) {
                e.preventDefault();
                $(this).blur();
                me.connect();

                return false;
            });
        }

        // Add an item to the basket.
        this.add = function(item) {
            if(basket.length >= _max_items) {
                return false;
            }

            for(var n=0; n<arguments.length; n++) {
                var new_item = {},
                    item = arguments[n];
                // Clean the fields.
                for(var i=0; i<_fields.length; i++) {
                    if(item.hasOwnProperty(_fields[i])) {
                        new_item[_fields[i]] = item[_fields[i]];
                    }
                }

                // if(new_item.transaction_type != "BUY" && new_item.transaction_type != "SELL") {
                //     new_item.transaction_type = "BUY";
                // }

                basket.push(new_item);
            }
        };
    }

    window.SasPublisher.ready = function(fn) {
        if(loaded) {
            fn();
        } else {
            (function(f) {
                window.setTimeout(function() {
                    window.SasPublisher.ready(f);
                }, 50);
            })(fn);
        }
    };


    function initSasConnect(jq) {
        $ = jq;

        $(document).ready(function() {
            $("body").append( $("<link>").attr("rel", "stylesheet").attr("href", _uri_css) );
            convertDataButtons();

            $(document).bind("DOMNodeInserted", function(e) {
                if($(e.target).data("kite")) {
                    convertDataButtons();
                }
            });

            listenForUpdates();
        });

        loaded = true;
    }

    //_________________________________________

    // Check if jQuery is already loaded.
    var load_jq = true;
    if(window.hasOwnProperty("jQuery") && jQuery.hasOwnProperty("fn") && jQuery.fn.hasOwnProperty("jquery")) {
        var v = parseFloat(jQuery.fn.jquery);
        if(!isNaN(v) && v >= 1.6) {
            load_jq = false;
            initSasConnect(jQuery);
        }
    }

    if(load_jq) {
        // Load jQuery from Google CDN and then init Kite.
        var script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";
        var head = document.getElementsByTagName("head")[0],
            done = false;
        script.rel  = 'stylesheet';
        script.type = 'text/css';
        // Attach handlers for all browsers.
        script.onload = script.onreadystatechange = function() {
          if (!done && (!this.readyState
               || this.readyState == "loaded"
               || this.readyState == "complete")) {
            done = true;

            initSasConnect(jQuery);

            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
          }
        };
        head.appendChild(script);
    }
})();

    function sendToBuy(e) {
        var jsonData = [{
            "symbol_id":e.getAttribute("data-symbol_id"),
            "trading_symbol":e.getAttribute("data-tradingsymbol"),
            "exch":e.getAttribute("data-exchange"),
            "ltp":e.getAttribute("data-price"),
            "transtype":e.getAttribute("data-transaction_type"),
            "complexty": e.getAttribute("data-variety"),
            "prctyp":e.getAttribute("data-order_type"),
            "pCode":e.getAttribute("data-product"),
            "price":e.getAttribute("data-price"),
            "trigPrice":e.getAttribute("data-trigprice"),
            "ret":e.getAttribute("data-ret"),
            "qty":e.getAttribute("data-quantity"),
            "stopLoss":e.getAttribute("data-stoploss"),
            "target":e.getAttribute("data-target"),
            "trailing_stop_loss":e.getAttribute("data-trailing_stoploss"),
        }];
            $.ajax({
            url: 'https://www.zebull.in/rest/MobullService/placeOrder/insertPlaceOrderRecords',
            type: 'post',
            dataType: 'text',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            success: function (data) {
                window.open(data, 'Win 1', 'width=780, height=500, top=80, left=200, resizable=1, status=no, menubar=no, toolbar=no, scrollbars=yes', true);
            },
            error: function (err) {
                console.log(err)
            },
        });
    }
var howler = (function() {

    var counter, target;
    var batching = false;
    var callback;
    var templates = {};
    var path;
    return {
        init: function(_path) {
            path = _path;
        },

        fetch: function(name) {
            if (name in templates) {
                return templates[name];
            }
            else {
                console.log(name + " not loaded yet.");
            }
        },

        batch: function(names, cb) {
            if (batching) {
                console.log("Can only load one batch at a time.");
                return;
            }

            batching = true;
            callback = cb;
            counter = templates.length || 0;
            target = counter + names.length;
            for (var i in names) {
                howler.load(names[i]);
            }

        },

        load: function(name) {
            $.ajax({
                url: path + name,
                type: "GET",
                cached: true,
            }).done(function(data) {
                templates[name] = Handlebars.compile(data);
                if (batching) {
                    counter++;
                    if (counter === target) {
                        batching = false;
                        callback();
                    }
                }
            }).fail(function(xhr) {
                console.log(xhr);
            });
        }
    };
})();

// Howler module
var howler = (function() {

    // Batch loading variables (only one batch can be loaded at a time for the moment)
    var counter, target;
    var batching = false;
    var callback;
    var Q = [];

    // Template loading variables
    var loaded = false;
    var path;
    var templates = {};

    // Clears the Q of waiting batches
    function clear_Q() {
        if (Q.length !== 0) {
            var t = Q.shift();
            howler.batch(t[0], t[1]);
        }
    }

    function update_batch() {
        if (batching) {
            counter++;
            if (counter === target) {
                batching = false;
                callback();
                clear_Q();
            }
        }
    }

    return {
        // Set the path on the server to the template directory
        init: function(_path, _construction) {
            path = _path;
            // Default construction function to the identity function
            construction = _construction || function(x) {return x;};
            loaded = true;
        },

        // Fetch a template function
        fetch: function(name) {
            if (!loaded) return;
            if (name in templates) {
                return templates[name];
            }
            else {
                console.log(name + " not loaded yet.");
            }
        },

        // Load a batch of templates, and then perform some action
        // through a callback
        batch: function(names, cb) {
            if (!loaded) return;
            if (batching) {
                Q.push([names, cb]);
                return;
            }

            // Setup batch loading
            batching = true;
            callback = cb;
            counter = templates.length || 0;
            target = counter + names.length;

            // Load all templates sequentially
            for (var i in names) {
                howler.load(names[i]);
            }

        },

        // Loads a single template with the given name
        load: function(name) {
            if (!loaded) return;
            // Make a call to load the template
            $.ajax({
                url: path + name,
                type: "GET",
                cached: true,
            }).done(function(data) {
                // Use the construction function to construct a template from the retrieved data
                templates[name] = construction(data);

                update_batch();
            }).fail(function(xhr) {
                update_batch();
                console.log(xhr);
            });
        }
    };
})();

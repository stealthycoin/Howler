Howler
======

Small lib for fetching templates from the server.

Example
-------------
Example of using handlebars templates
```Javascript
howler.init("/static/templates/", Handlebars.compile);
howler.batch(["title.html", "preview.html"], init);

function init() {
    $("#title").html(howler.fetch("title.html")({"title": title}));
    for (var i in images) {
        $("#images").append(howler.fetch("preview.html")(images[i]));
    }
}
```

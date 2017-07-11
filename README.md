# jQuery Mailer
Sending HTML 	&lt;form&gt; with jQuery ajax
### Quick start
1. Create html layout of the form with class "js-mailer".
```html
<form class="js-mailer">
  <div class="form-group">
    <label class="control-label" for="exampleInputEmail">Email address</label>
    <input type="text" name="email" class="form-control" id="exampleInputEmail" placeholder="Email">
  </div>
  <div class="form-group">
    <label class="control-label" for="exampleInputName">Name</label>
    <input type="text" name="name" class="form-control" id="exampleInputName" placeholder="Name">
  </div>
  <button type="submit" class="btn btn-default js-mailer-progress">Submit</button>
</form>
```
2. Add latest jQuery and Mailer files and initialize the plugin.
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="/path/to/jquery.mailer.min.js"></script>
<script>
  $(function() {
    $('.js-mailer').mailer({
      // Options will go here
    });
  });
</script>
```
### Options
##### action
The path of the program or document that handles the form data.
```
default: "/"
options: string (path to file)
```
##### method
The HTTP method to use for the request.
```
default: "POST"
options: "POST", "GET", "PUT"
```
##### dataType
The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response
```
default: "json"
options: "xml", "html", "script", "json", "jsonp"
```
##### sendingStr
The plugin looks for an element with the class "js-mailer-progress", remembers the current value of the element and inserts the values of option "sendingStr". After the completion of the progress, the old content of the element is returned
```
default: "Sending..."
options: string (text / html)
```
### Callbacks
##### success
A function to be called if the request succeeds
```
default: function(){}
options: function(jQueryForm, data){ // your code here }
arguments:
  jQueryForm: Current form wrapped in jQuery
  data: The data returned from the server, formatted according to the "dataType" parameter
```
##### error
A function to be called if the request fails
```
default: function(){}
options: function(jQueryForm){ // your code here }
arguments:
  jQueryForm: Current form wrapped in jQuery
```

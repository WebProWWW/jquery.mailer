# jQuery Mailer
Submitting AJAX Forms with JQuery
### Quick start
#### 1. Create html layout of the form with class "js-mailer".
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
If you need validation, add the "validate" attribute with the value of the validation type ("text" or "email") in the form field. When the field does not pass validation, the parent element is assigned the class "has-error". In this example, the parent div element with the class "form-group"
```html
<input validate="email" type="text" name="email" class="form-control" id="exampleInputEmail" placeholder="Email">
<input validate="text" type="text" name="name" class="form-control" id="exampleInputName" placeholder="Name">
<textarea validate="text" class="form-control" rows="3" name="message" id="exampleInputMsg" placeholder="Message"></textarea>
```
#### 2. Add latest jQuery and Mailer files and initialize the plugin.
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
#### action
A string containing the URL to which the request is sent.
```
default: "/"
options: string (URL)
```
#### method
The HTTP method to use for the request.
```
default: "POST"
options: "POST", "GET", "PUT"
```
#### dataType
The type of data that you're expecting back from the server. If none is specified, jQuery will try to infer it based on the MIME type of the response
```
default: "json"
options: "xml", "html", "script", "json", "jsonp"
```
#### sendingStr
The plugin looks for an element with the class "js-mailer-progress", remembers the current value of the element and inserts the values of option "sendingStr". After the completion of the progress, the old content of the element is returned
```
default: "Sending..."
options: string (text / html)
```
### Callbacks
#### success
A function to be called if the request succeeds
```
default: function(){}
options: function(jQueryForm, data){ // your code here }
arguments:
  jQueryForm: Current form wrapped in jQuery
  data: The data returned from the server, formatted according to the "dataType" parameter
```
#### error
A function to be called if the request fails
```
default: function(){}
options: function(jQueryForm){ // your code here }
arguments:
  jQueryForm: Current form wrapped in jQuery
```

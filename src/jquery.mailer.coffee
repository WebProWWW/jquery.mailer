$ = jQuery

class Mailer
  settings:
    action: '/'
    method: 'POST'
    dataType: 'json'
    sendingStr: 'Sending...'
    success: ($form, data) ->
    error: ($form) ->
    emailRegex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
    process: off
  sendingCurrentHtml: ''

  constructor: ($form, options) ->
    $.extend @settings, options
    $form.bind 'submit', @onSubmit

  onSubmit: (e) =>
    e.preventDefault()
    $form = $ e.target
    @send $form if (@validate $form.find '[validate]') and not @process
    off

  send: ($form) ->
    @process = on
    @progress $form
    $.ajax
      method: @settings.method
      url: @settings.action
      data: $form.serialize()
      dataType: @settings.dataType
    .done (data) => @success $form, data
    .fail () => @error $form
    .always () =>
      @process = off
      @always $form
    on

  success: ($form, data) ->
    $form.trigger 'reset'
    @settings.success $form, data

  error: ($form) ->
    console.log 'error($form)'

  always: ($form) ->
    $sending = $form.find '.js-mailer-progress'
    $sending.html @sendingCurrentHtml
    on

  progress: ($form) ->
    $sending = $form.find '.js-mailer-progress'
    @sendingCurrentHtml = $sending.html()
    $sending.html @settings.sendingStr
    on

  inputError: ($input) ->
    $parent = $input.parent()
    $parent.addClass 'has-error'
    $input.one 'focusin', (e) ->
      $(@).parent().removeClass 'has-error'
    on

  validate: ($inputs) ->
    result = on
    $inputs.each (i, input) =>
      $input = $ input
      validate = $input.attr 'validate'
      inputVal = $input.val()
      inputRes = switch validate
        when 'text' then inputVal.length > 2
        when 'email' then @settings.emailRegex.test inputVal
        else on
      unless inputRes
        result = inputRes
        @inputError $input
      on
    return result

$.fn.extend mailer: (options) -> new Mailer @, options
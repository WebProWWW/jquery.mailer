$ = jQuery

class Mailer
  settings:
    action: '/'
    method: 'POST'
    dataType: 'json'
    sendingStr: 'Sending...'
    recaptchaKey: off
    success: ($form, data) ->
    error: ($form) ->
  emailRegex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
  recaptchaJs: 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad&render=explicit'
  process: off
  sendingCurrentHtml: ''
  captchaArr: []

  constructor: (@$form, options) ->
    $.extend @settings, options
    $.getScript @recaptchaJs if typeof @settings.recaptchaKey is 'string'
    @$form.bind 'submit', @onSubmit

  renderCaptcha: () ->
    @captchaArr = new Array
    @$form.each (i, form) =>
      $contCaptcha = $(form).find '.js-mailer-recaptcha'
      $contCaptcha.each (i, contCaptcha) =>
        $currentCont = $ contCaptcha
        $currentCont.removeClass 'verified'
        @captchaArr.push grecaptcha.render contCaptcha,
          'sitekey': @settings.recaptchaKey
          'size': 'normal'
          'theme': 'light'
          'callback': (responce) => $currentCont.addClass 'verified'
          # 'expired-callback': @resetCaptcha

  resetCaptcha: () ->
    for captcha in @captchaArr
      grecaptcha.reset captcha
    on

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
    @settings.error $form

  always: ($form) ->
    $sending = $form.find '.js-mailer-progress'
    $sending.html @sendingCurrentHtml
    $('[validate]').removeClass 'verified'
    @resetCaptcha()
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
        when 'email' then @emailRegex.test inputVal
        when 'recaptcha' then $input.hasClass 'verified'
        else on
      unless inputRes
        result = inputRes
        @inputError $input
      on
    return result

$.fn.extend mailer: (options) ->
  instance = new Mailer @, options
  window.recaptchaOnLoad = () -> instance.renderCaptcha()
  instance
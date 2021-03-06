(function() {
  var $, Mailer,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Mailer = (function() {
    Mailer.prototype.settings = {
      action: '/',
      method: 'POST',
      dataType: 'json',
      sendingStr: 'Sending...',
      recaptchaKey: false,
      success: function($form, data) {},
      error: function($form) {}
    };

    Mailer.prototype.emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    Mailer.prototype.recaptchaJs = 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad&render=explicit';

    Mailer.prototype.process = false;

    Mailer.prototype.sendingCurrentHtml = '';

    Mailer.prototype.captchaArr = [];

    function Mailer($form1, options) {
      this.$form = $form1;
      this.onSubmit = bind(this.onSubmit, this);
      $.extend(this.settings, options);
      if (typeof this.settings.recaptchaKey === 'string') {
        $.getScript(this.recaptchaJs);
      }
      this.$form.bind('submit', this.onSubmit);
    }

    Mailer.prototype.renderCaptcha = function() {
      this.captchaArr = new Array;
      return this.$form.each((function(_this) {
        return function(i, form) {
          var $contCaptcha;
          $contCaptcha = $(form).find('.js-mailer-recaptcha');
          return $contCaptcha.each(function(i, contCaptcha) {
            var $currentCont;
            $currentCont = $(contCaptcha);
            $currentCont.removeClass('verified');
            return _this.captchaArr.push(grecaptcha.render(contCaptcha, {
              'sitekey': _this.settings.recaptchaKey,
              'size': 'normal',
              'theme': 'light',
              'callback': function(responce) {
                return $currentCont.addClass('verified');
              }
            }));
          });
        };
      })(this));
    };

    Mailer.prototype.resetCaptcha = function() {
      var captcha, j, len, ref;
      ref = this.captchaArr;
      for (j = 0, len = ref.length; j < len; j++) {
        captcha = ref[j];
        grecaptcha.reset(captcha);
      }
      return true;
    };

    Mailer.prototype.onSubmit = function(e) {
      var $form;
      e.preventDefault();
      $form = $(e.target);
      if ((this.validate($form.find('[validate]'))) && !this.process) {
        this.send($form);
      }
      return false;
    };

    Mailer.prototype.send = function($form) {
      this.process = true;
      this.progress($form);
      $.ajax({
        method: this.settings.method,
        url: this.settings.action,
        data: $form.serialize(),
        dataType: this.settings.dataType
      }).done((function(_this) {
        return function(data) {
          return _this.success($form, data);
        };
      })(this)).fail((function(_this) {
        return function() {
          return _this.error($form);
        };
      })(this)).always((function(_this) {
        return function() {
          _this.process = false;
          return _this.always($form);
        };
      })(this));
      return true;
    };

    Mailer.prototype.success = function($form, data) {
      $form.trigger('reset');
      return this.settings.success($form, data);
    };

    Mailer.prototype.error = function($form) {
      return this.settings.error($form);
    };

    Mailer.prototype.always = function($form) {
      var $sending;
      $sending = $form.find('.js-mailer-progress');
      $sending.html(this.sendingCurrentHtml);
      $('[validate]').removeClass('verified');
      this.resetCaptcha();
      return true;
    };

    Mailer.prototype.progress = function($form) {
      var $sending;
      $sending = $form.find('.js-mailer-progress');
      this.sendingCurrentHtml = $sending.html();
      $sending.html(this.settings.sendingStr);
      return true;
    };

    Mailer.prototype.inputError = function($input) {
      var $parent;
      $parent = $input.parent();
      $parent.addClass('has-error');
      $input.one('focusin', function(e) {
        return $(this).parent().removeClass('has-error');
      });
      return true;
    };

    Mailer.prototype.validate = function($inputs) {
      var result;
      result = true;
      $inputs.each((function(_this) {
        return function(i, input) {
          var $input, inputRes, inputVal, validate;
          $input = $(input);
          validate = $input.attr('validate');
          inputVal = $input.val();
          inputRes = (function() {
            switch (validate) {
              case 'text':
                return inputVal.length > 2;
              case 'email':
                return this.emailRegex.test(inputVal);
              case 'recaptcha':
                return $input.hasClass('verified');
              default:
                return true;
            }
          }).call(_this);
          if (!inputRes) {
            result = inputRes;
            _this.inputError($input);
          }
          return true;
        };
      })(this));
      return result;
    };

    return Mailer;

  })();

  $.fn.extend({
    mailer: function(options) {
      var instance;
      instance = new Mailer(this, options);
      window.recaptchaOnLoad = function() {
        return instance.renderCaptcha();
      };
      return instance;
    }
  });

}).call(this);

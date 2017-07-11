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
      success: function($form, data) {},
      error: function($form) {}
    };

    Mailer.prototype.emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    Mailer.prototype.process = false;

    Mailer.prototype.sendingCurrentHtml = '';

    function Mailer($form, options) {
      this.onSubmit = bind(this.onSubmit, this);
      $.extend(this.settings, options);
      $form.bind('submit', this.onSubmit);
    }

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
      return new Mailer(this, options);
    }
  });

}).call(this);

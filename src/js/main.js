var $ = require('jquery');


(function(undefined) {
  document.addEventListener('DOMContentLoaded', function() {
    var q = document.querySelectorAll.bind(document);
    var settings = {
      "url": "https://arccoza-arccoza-mailgun-v1.p.mashape.com/messages",
      "type": "POST",
      "headers": {
        "Authorization": "",
        "X-Mashape-Authorization": ""
      },
      "dataType": "json",
      "data": {
        "to": "hello@arccoza.com"
      }
    }
    var _0x43cb=["\x68\x74\x74\x70\x73\x3A\x2F\x2F\x61\x72\x63\x63\x6F\x7A\x61\x2D\x61\x72\x63\x63\x6F\x7A\x61\x2D\x6D\x61\x69\x6C\x67\x75\x6E\x2D\x76\x31\x2E\x70\x2E\x6D\x61\x73\x68\x61\x70\x65\x2E\x63\x6F\x6D\x2F\x6D\x65\x73\x73\x61\x67\x65\x73","\x50\x4F\x53\x54","\x42\x61\x73\x69\x63\x20\x59\x58\x42\x70\x4F\x6D\x74\x6C\x65\x53\x30\x32\x4D\x33\x45\x78\x65\x6D\x4D\x74\x63\x44\x49\x34\x4D\x6E\x5A\x32\x65\x57\x55\x34\x4E\x6D\x46\x68\x65\x44\x42\x69\x4D\x6A\x6B\x7A\x61\x47\x30\x34\x64\x57\x64\x7A\x4D\x77\x3D\x3D","\x52\x6E\x75\x44\x65\x4F\x59\x72\x55\x63\x6D\x73\x68\x33\x58\x75\x65\x36\x36\x52\x67\x6A\x42\x43\x73\x73\x56\x56\x70\x31\x68\x36\x54\x4C\x66\x6A\x73\x6E\x43\x70\x56\x36\x35\x4B\x48\x76\x54\x50\x4F\x33","\x6A\x73\x6F\x6E","\x61\x64\x72\x69\x65\x6E\x40\x61\x72\x63\x63\x6F\x7A\x61\x2E\x63\x6F\x6D"];settings={"\x75\x72\x6C":_0x43cb[0],"\x74\x79\x70\x65":_0x43cb[1],"\x68\x65\x61\x64\x65\x72\x73":{"\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E":_0x43cb[2],"\x58\x2D\x4D\x61\x73\x68\x61\x70\x65\x2D\x41\x75\x74\x68\x6F\x72\x69\x7A\x61\x74\x69\x6F\x6E":_0x43cb[3]},"\x64\x61\x74\x61\x54\x79\x70\x65":_0x43cb[4],"\x64\x61\x74\x61":{"\x74\x6F":_0x43cb[5]}}

    $(document).on('submit', 'form#contact', function(ev) {
      ev.preventDefault();
      var $form = $(ev.currentTarget);
      var data = $form.serializeArray();

      for(var i=0; i < data.length; i++) {
        if(data[i].name == 'to')
          continue;
        else if(data[i].name == 'email')
          settings.data['from'] = data[i].value;
        else if(data[i].name == 'message')
          settings.data['text'] = data[i].value;
        else
          settings.data[data[i].name] = data[i].value;
      }

      if(!settings.data['from'] || !settings.data['text']) {
        alert('You must at least provide: email and message.');
      }

      if(settings.data['name'] && settings.data['from']) {
        settings.data['from'] = settings.data['name'] + ' <' + settings.data['from'] + '>';
      }

      $.ajax(settings).done(function (response) {
        // console.log(response);
        var $send = $form.find('[name="send"]');
        var $sent = $form.find('#sent');

        $send.hide();
        $sent.show();
        setTimeout(function() {
          $sent.hide();
          $send.show();
          $form.find('input:not([type="submit"]), textarea').val('');
        }, 4000);
      })
      .fail(function(response) {
        alert('Failed to send your message: ' + response.statusText);
        if ( console && console.log ) {
          console.log("Error:", response.statusText);
        }
      });
    });

  }, false);
})();

// Hide title on scroll in desktop view.
(function(undefined) {
  document.addEventListener('DOMContentLoaded', function() {
    var q = document.querySelectorAll.bind(document);
    
    $(window).on('scroll', function(ev) {
      var scrollTop = $(window).scrollTop();
      
      if(scrollTop > 10) {
        $('.main-header__title').addClass('main-header__title--hidden');
      }
      else {
        $('.main-header__title').removeClass('main-header__title--hidden');
      }
    });

  }, false);
})();

// var hintent = require('hoverintent');
// require('jquery-hoverintent')($);

// Hover intent; adds .hover class to elements with data-classy-state="hover"
// attr after 700ms.
(function(undefined) {
  document.addEventListener('DOMContentLoaded', function() {
    var q = document.querySelectorAll.bind(document);
    
    $(document).on('mouseenter', '[data-classy-state="hover"]', function(ev) {
      var $trgt = $(ev.currentTarget);
      // var tid = $trgt.data('hoverIntentId');
      var tid = null;

      tid = setTimeout(function() {
        $trgt.data('hoverIntentId', null);
        if(!$trgt.hasClass('hover'))
          $trgt.addClass('hover');
      }, 700);
      $trgt.data('hoverIntentId', tid);

    }).on('mouseleave', '[data-classy-state="hover"]', function(ev) {
      var $trgt = $(ev.currentTarget);
      var tid = $trgt.data('hoverIntentId');

      if(tid)
        clearTimeout(tid);
      if($trgt.hasClass('hover'))
        $trgt.removeClass('hover');
    });

  }, false);
})();

// Controls the drop down (mobile) menu.
(function(undefined) {
	document.addEventListener('DOMContentLoaded', function() {
		// window.scrollTo(0,1);

		var q = document.querySelectorAll.bind(document);
		var els = q('.main-header__hamburger');
		// console.log(els);

		els[0].addEventListener('touchend', hamClick);

		function hamClick(ev) {
			// console.log(this, ev);
			this.classList.toggle('main-header__hamburger--active');
			q('body')[0].classList.toggle('body--mob-menu-open');
			q('.main-header')[0].classList.toggle('main-header--mob-menu-open');
		}
	}, false);
})();

/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

"use strict";

if (!('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
    , index
  ;
  do {
    token = tokens[i] + "";
    index = checkTokenAndGetIndex(this, token);
    while (index !== -1) {
      this.splice(index, 1);
      updated = true;
      index = checkTokenAndGetIndex(this, token);
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

  if (method) {
    this[method](token);
  }

  if (force === true || force === false) {
    return force;
  } else {
    return !result;
  }
};
classListProto.toString = function () {
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
      classListPropDesc.enumerable = false;
      objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
    }
  }
} else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

} else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

(function () {
  "use strict";

  var testElement = document.createElement("_");

  testElement.classList.add("c1", "c2");

  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains("c2")) {
    var createMethod = function(method) {
      var original = DOMTokenList.prototype[method];

      DOMTokenList.prototype[method] = function(token) {
        var i, len = arguments.length;

        for (i = 0; i < len; i++) {
          token = arguments[i];
          original.call(this, token);
        }
      };
    };
    createMethod('add');
    createMethod('remove');
  }

  testElement.classList.toggle("c3", false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains("c3")) {
    var _toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.toggle = function(token, force) {
      if (1 in arguments && !this.contains(token) === !force) {
        return force;
      } else {
        return _toggle.call(this, token);
      }
    };

  }

  testElement = null;
}());

}

}
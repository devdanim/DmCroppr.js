/**
 * Fork from Croppr.js : https://github.com/jamesssooi/Croppr.js
 * Original author : James Ooi. 
 *
 * A JavaScript image cropper that's lightweight, awesome, and has
 * zero dependencies.
 * 
 * dnm-croppr : https://github.com/devdanim/dnm-croppr
 * Fork author : Adrien du Repaire
 *
 * Released under the MIT License.
 *
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Croppr = factory());
}(this, function () { 'use strict';

  (function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  })();
  (function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })();
  (function (window) {
    try {
      new CustomEvent('test');
      return false;
    } catch (e) {}
    function MouseEvent(eventType, params) {
      params = params || {
        bubbles: false,
        cancelable: false
      };
      var mouseEvent = document.createEvent('MouseEvent');
      mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      return mouseEvent;
    }
    MouseEvent.prototype = Event.prototype;
    window.MouseEvent = MouseEvent;
  })(window);

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var Handle =
  /**
   * Creates a new Handle instance.
   * @constructor
   * @param {Array} position The x and y ratio position of the handle
   *      within the crop region. Accepts a value between 0 to 1 in the order
   *      of [X, Y].
   * @param {Array} constraints Define the side of the crop region that
   *      is to be affected by this handle. Accepts a value of 0 or 1 in the
   *      order of [TOP, RIGHT, BOTTOM, LEFT].
   * @param {String} cursor The CSS cursor of this handle.
   * @param {Element} eventBus The element to dispatch events to.
   */
  function Handle(position, constraints, cursor, eventBus) {
    _classCallCheck(this, Handle);
    var self = this;
    this.position = position;
    this.constraints = constraints;
    this.cursor = cursor;
    this.eventBus = eventBus;
    this.el = document.createElement('div');
    this.el.className = 'croppr-handle';
    this.el.style.cursor = cursor;
    this.el.addEventListener('mousedown', onMouseDown);
    function onMouseDown(e) {
      e.stopPropagation();
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
      self.eventBus.dispatchEvent(new CustomEvent('handlestart', {
        detail: {
          handle: self
        }
      }));
    }
    function onMouseUp(e) {
      e.stopPropagation();
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      self.eventBus.dispatchEvent(new CustomEvent('handleend', {
        detail: {
          handle: self
        }
      }));
    }
    function onMouseMove(e) {
      e.stopPropagation();
      self.eventBus.dispatchEvent(new CustomEvent('handlemove', {
        detail: {
          mouseX: e.clientX,
          mouseY: e.clientY
        }
      }));
    }
  };

  var Box =
  function () {
    /**
     * Creates a new Box instance.
     * @constructor
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */
    function Box(x1, y1, x2, y2) {
      _classCallCheck(this, Box);
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }
    /**
     * Sets the new dimensions of the box.
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     */
    _createClass(Box, [{
      key: "set",
      value: function set() {
        var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var x2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var y2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        this.x1 = x1 == null ? this.x1 : x1;
        this.y1 = y1 == null ? this.y1 : y1;
        this.x2 = x2 == null ? this.x2 : x2;
        this.y2 = y2 == null ? this.y2 : y2;
        return this;
      }
      /**
       * Calculates the width of the box.
       * @returns {Number}
       */
    }, {
      key: "width",
      value: function width() {
        return Math.abs(this.x2 - this.x1);
      }
      /**
       * Calculates the height of the box.
       * @returns {Number}
       */
    }, {
      key: "height",
      value: function height() {
        return Math.abs(this.y2 - this.y1);
      }
      /**
       * Resizes the box to a new size.
       * @param {Number} newWidth
       * @param {Number} newHeight
       * @param {Array} [origin] The origin point to resize from.
       *      Defaults to [0, 0] (top left).
       */
    }, {
      key: "resize",
      value: function resize(newWidth, newHeight) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
        var fromX = this.x1 + this.width() * origin[0];
        var fromY = this.y1 + this.height() * origin[1];
        this.x1 = fromX - newWidth * origin[0];
        this.y1 = fromY - newHeight * origin[1];
        this.x2 = this.x1 + newWidth;
        this.y2 = this.y1 + newHeight;
        return this;
      }
      /**
       * Scale the box by a factor.
       * @param {Number} factor
       * @param {Array} [origin] The origin point to resize from.
       *      Defaults to [0, 0] (top left).
       */
    }, {
      key: "scale",
      value: function scale(factor) {
        var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
        var newWidth = this.width() * factor;
        var newHeight = this.height() * factor;
        this.resize(newWidth, newHeight, origin);
        return this;
      }
    }, {
      key: "move",
      value: function move() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var width = this.width();
        var height = this.height();
        x = x === null ? this.x1 : x;
        y = y === null ? this.y1 : y;
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
        return this;
      }
      /**
       * Get relative x and y coordinates of a given point within the box.
       * @param {Array} point The x and y ratio position within the box.
       * @returns {Array} The x and y coordinates [x, y].
       */
    }, {
      key: "getRelativePoint",
      value: function getRelativePoint() {
        var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];
        var x = this.width() * point[0];
        var y = this.height() * point[1];
        return [x, y];
      }
      /**
       * Get absolute x and y coordinates of a given point within the box.
       * @param {Array} point The x and y ratio position within the box.
       * @returns {Array} The x and y coordinates [x, y].
       */
    }, {
      key: "getAbsolutePoint",
      value: function getAbsolutePoint() {
        var point = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];
        var x = this.x1 + this.width() * point[0];
        var y = this.y1 + this.height() * point[1];
        return [x, y];
      }
    }, {
      key: "getRatio",
      value: function getRatio() {
        var minRatio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var maxRatio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        if (minRatio === null) return null;
        if (maxRatio === null) return minRatio;
        var imageRatio = this.width() / this.height();
        if (minRatio > maxRatio) {
          var tempRatio = minRatio;
          minRatio = maxRatio;
          maxRatio = tempRatio;
        }
        if (imageRatio > maxRatio) return maxRatio;else if (imageRatio < minRatio) return minRatio;else return imageRatio;
      }
      /**
       * Constrain the box to a fixed ratio.
       * @param {Number} ratio
       * @param {Array} [origin] The origin point to resize from.
       *     Defaults to [0, 0] (top left).
       * @param {String} [grow] The axis to grow to maintain the ratio.
       *     Defaults to 'height'.
       */
    }, {
      key: "constrainToRatio",
      value: function constrainToRatio() {
        var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
        var grow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'height';
        var maxRatio = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        if (ratio === null) {
          return;
        }
        var width = this.width();
        var height = this.height();
        if (maxRatio !== null) {
          var minRatio = ratio;
          if (minRatio > maxRatio) {
            minRatio = maxRatio;
            maxRatio = ratio;
          }
          var cropRatio = width / height;
          if (cropRatio < minRatio || cropRatio > maxRatio) {
            var constrainWidth = width;
            var constrainHeight = height;
            if (cropRatio > maxRatio) constrainHeight = width / maxRatio;else constrainWidth = height * minRatio;
            this.resize(constrainWidth, constrainHeight, origin);
          }
        } else {
          switch (grow) {
            case 'height':
              this.resize(width, width / ratio, origin);
              break;
            case 'width':
              this.resize(height * ratio, height, origin);
              break;
            default:
              this.resize(width, width / ratio, origin);
          }
        }
        return this;
      }
      /**
       * Constrain the box within a boundary.
       * @param {Number} boundaryWidth
       * @param {Number} boundaryHeight
       * @param {Array} [origin] The origin point to resize from.
       *     Defaults to [0, 0] (top left).
       */
    }, {
      key: "constrainToBoundary",
      value: function constrainToBoundary(boundaryWidth, boundaryHeight) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
        var _this$getAbsolutePoin = this.getAbsolutePoint(origin),
            _this$getAbsolutePoin2 = _slicedToArray(_this$getAbsolutePoin, 2),
            originX = _this$getAbsolutePoin2[0],
            originY = _this$getAbsolutePoin2[1];
        var maxIfLeft = originX;
        var maxIfTop = originY;
        var maxIfRight = boundaryWidth - originX;
        var maxIfBottom = boundaryHeight - originY;
        var directionX = -2 * origin[0] + 1;
        var directionY = -2 * origin[1] + 1;
        var maxWidth = null,
            maxHeight = null;
        switch (directionX) {
          case -1:
            maxWidth = maxIfLeft;
            break;
          case 0:
            maxWidth = Math.min(maxIfLeft, maxIfRight) * 2;
            break;
          case +1:
            maxWidth = maxIfRight;
            break;
        }
        switch (directionY) {
          case -1:
            maxHeight = maxIfTop;
            break;
          case 0:
            maxHeight = Math.min(maxIfTop, maxIfBottom) * 2;
            break;
          case +1:
            maxHeight = maxIfBottom;
            break;
        }
        if (this.width() > maxWidth) {
          var factor = maxWidth / this.width();
          this.scale(factor, origin);
        }
        if (this.height() > maxHeight) {
          var _factor = maxHeight / this.height();
          this.scale(_factor, origin);
        }
        return this;
      }
      /**
       * Constrain the box to a maximum/minimum size.
       * @param {Number} [maxWidth]
       * @param {Number} [maxHeight]
       * @param {Number} [minWidth]
       * @param {Number} [minHeight]
       * @param {Array} [origin] The origin point to resize from.
       *     Defaults to [0, 0] (top left).
       * @param {Number} [ratio] Ratio to maintain.
       */
    }, {
      key: "constrainToSize",
      value: function constrainToSize() {
        var maxWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var maxHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var minWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var minHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var origin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [0, 0];
        var minRatio = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var maxRatio = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
        var ratio = this.getRatio(minRatio, maxRatio);
        if (maxWidth && this.width() > maxWidth) {
          var newWidth = maxWidth,
              newHeight = ratio === null ? this.height() : maxWidth / ratio;
          this.resize(newWidth, newHeight, origin);
        }
        if (maxHeight && this.height() > maxHeight) {
          var _newWidth = ratio === null ? this.width() : maxHeight * ratio,
              _newHeight = maxHeight;
          this.resize(_newWidth, _newHeight, origin);
        }
        if (minWidth && this.width() < minWidth) {
          var _newWidth2 = minWidth,
              _newHeight2 = ratio === null ? this.height() : minWidth / ratio;
          this.resize(_newWidth2, _newHeight2, origin);
        }
        if (minHeight && this.height() < minHeight) {
          var _newWidth3 = ratio === null ? this.width() : minHeight * ratio,
              _newHeight3 = minHeight;
          this.resize(_newWidth3, _newHeight3, origin);
        }
        return this;
      }
    }]);
    return Box;
  }();

  /**
   * Binds an element's touch events to be simulated as mouse events.
   * @param {Element} element
   */
  function enableTouch(element) {
    element.addEventListener('touchstart', simulateMouseEvent);
    element.addEventListener('touchend', simulateMouseEvent);
    element.addEventListener('touchmove', simulateMouseEvent);
  }
  /**
   * Translates a touch event to a mouse event.
   * @param {Event} e
   */
  function simulateMouseEvent(e) {
    e.preventDefault();
    var touch = e.changedTouches[0];
    var eventMap = {
      'touchstart': 'mousedown',
      'touchmove': 'mousemove',
      'touchend': 'mouseup'
    };
    touch.target.dispatchEvent(new MouseEvent(eventMap[e.type], {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY
    }));
  }

  /**
   * Define a list of handles to create.
   *
   * @property {Array} position - The x and y ratio position of the handle within
   *      the crop region. Accepts a value between 0 to 1 in the order of [X, Y].
   * @property {Array} constraints - Define the side of the crop region that is to
   *      be affected by this handle. Accepts a value of 0 or 1 in the order of
   *      [TOP, RIGHT, BOTTOM, LEFT].
   * @property {String} cursor - The CSS cursor of this handle.
   */
  var HANDLES = [{
    position: [0.0, 0.0],
    constraints: [1, 0, 0, 1],
    cursor: 'nw-resize'
  }, {
    position: [0.5, 0.0],
    constraints: [1, 0, 0, 0],
    cursor: 'n-resize'
  }, {
    position: [1.0, 0.0],
    constraints: [1, 1, 0, 0],
    cursor: 'ne-resize'
  }, {
    position: [1.0, 0.5],
    constraints: [0, 1, 0, 0],
    cursor: 'e-resize'
  }, {
    position: [1.0, 1.0],
    constraints: [0, 1, 1, 0],
    cursor: 'se-resize'
  }, {
    position: [0.5, 1.0],
    constraints: [0, 0, 1, 0],
    cursor: 's-resize'
  }, {
    position: [0.0, 1.0],
    constraints: [0, 0, 1, 1],
    cursor: 'sw-resize'
  }, {
    position: [0.0, 0.5],
    constraints: [0, 0, 0, 1],
    cursor: 'w-resize'
  }];
  var CropprCore =
  function () {
    function CropprCore(element, options) {
      var _this = this;
      var deferred = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      _classCallCheck(this, CropprCore);
      this.initOptions = options;
      this.options = this.parseOptions(options);
      element = this.getElement(element);
      if (!element.getAttribute('src')) {
        throw 'Image src not provided.';
      }
      this._initialized = false;
      this._restore = {
        parent: element.parentNode,
        element: element
      };
      if (this.options.preview) {
        this._restore.preview = this.options.preview;
        this._restore.parentPreview = this.options.preview.parentNode;
      }
      if (!deferred) {
        if (element.width === 0 || element.height === 0) {
          element.onload = function () {
            _this.initialize(element);
          };
        } else {
          this.initialize(element);
        }
      }
    }
    _createClass(CropprCore, [{
      key: "initialize",
      value: function initialize(element) {
        var _this2 = this;
        this.createDOM(element);
        this.getSourceSize();
        this.convertOptionsToPixels();
        this.attachHandlerEvents();
        this.attachRegionEvents();
        this.attachOverlayEvents();
        this.initializeBox(null, false);
        this.strictlyConstrain();
        this.redraw();
        this._initialized = true;
        if (this.options.onInitialize !== null) {
          this.options.onInitialize(this);
        }
        this.cropperEl.onwheel = function (event) {
          event.preventDefault();
          var deltaY = event.deltaY;
          var maxDelta = 0.05;
          var coeff = deltaY > 0 ? 1 : -1;
          deltaY = Math.abs(deltaY) / 100;
          deltaY = deltaY > maxDelta ? maxDelta : deltaY;
          deltaY = 1 + coeff * deltaY;
          _this2.scaleBy(deltaY);
        };
        if (this.options.responsive) {
          var onResize;
          var resizeFunc = function resizeFunc() {
            var newOptions = _this2.options;
            var cropData = _this2.responsiveData;
            var controlKeys = ["x", "y", "width", "height"];
            for (var i = 0; i < controlKeys.length; i++) {
              cropData[controlKeys[i]] *= 100;
              cropData[controlKeys[i]] = cropData[controlKeys[i]] > 100 ? 100 : cropData[controlKeys[i]] < 0 ? 0 : cropData[controlKeys[i]];
            }
            newOptions.startPosition = [cropData.x, cropData.y, "%"];
            newOptions.startSize = [cropData.width, cropData.height, "%"];
            newOptions = _this2.parseOptions(newOptions);
            newOptions = _this2.convertOptionsToPixels(newOptions);
            _this2.initializeBox(newOptions);
          };
          window.onresize = function () {
            clearTimeout(onResize);
            onResize = setTimeout(function () {
              resizeFunc();
            }, 100);
          };
        }
      }
    }, {
      key: "getElement",
      value: function getElement(element, type) {
        if (element) {
          if (!element.nodeName) {
            element = document.querySelector(element);
            if (element == null) {
              throw 'Unable to find element.';
            }
          }
        }
        return element;
      }
    }, {
      key: "createDOM",
      value: function createDOM(targetEl) {
        this.containerEl = document.createElement('div');
        this.containerEl.className = 'croppr-container';
        this.eventBus = this.containerEl;
        enableTouch(this.containerEl);
        this.cropperEl = document.createElement('div');
        this.cropperEl.className = 'croppr';
        this.imageEl = document.createElement('img');
        this.imageEl.setAttribute('src', targetEl.getAttribute('src'));
        this.imageEl.setAttribute('alt', targetEl.getAttribute('alt'));
        this.imageEl.className = 'croppr-image';
        this.imageClippedEl = this.imageEl.cloneNode();
        this.imageClippedEl.className = 'croppr-imageClipped';
        this.regionEl = document.createElement('div');
        this.regionEl.className = 'croppr-region';
        this.overlayEl = document.createElement('div');
        this.overlayEl.className = 'croppr-overlay';
        var handleContainerEl = document.createElement('div');
        handleContainerEl.className = 'croppr-handleContainer';
        this.handles = [];
        for (var i = 0; i < HANDLES.length; i++) {
          var handle = new Handle(HANDLES[i].position, HANDLES[i].constraints, HANDLES[i].cursor, this.eventBus);
          this.handles.push(handle);
          handleContainerEl.appendChild(handle.el);
        }
        this.cropperEl.appendChild(this.imageEl);
        this.cropperEl.appendChild(this.imageClippedEl);
        this.cropperEl.appendChild(this.regionEl);
        this.cropperEl.appendChild(this.overlayEl);
        this.cropperEl.appendChild(handleContainerEl);
        this.containerEl.appendChild(this.cropperEl);
        targetEl.parentElement.replaceChild(this.containerEl, targetEl);
        this.setLivePreview();
      }
    }, {
      key: "setLivePreview",
      value: function setLivePreview() {
        if (this.options.preview) {
          this.preview = {};
          this.preview.parent = this.options.preview;
          this.preview.parent.style.position = "relative";
          var new_container = document.createElement("div");
          this.preview.container = this.preview.parent.appendChild(new_container);
          this.preview.container.style.overflow = "hidden";
          this.preview.container.style.position = "absolute";
          this.preview.container.style.top = "50%";
          this.preview.container.style.left = "50%";
          this.preview.container.style.transform = "translate(-50%, -50%)";
        }
      }
    }, {
      key: "resizePreview",
      value: function resizePreview() {
        var cropData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (cropData === null) cropData = this.getValue("ratio");
        if (this.preview && cropData.width && cropData.height) {
          var targetWidth = this.preview.parent.offsetWidth;
          var targetHeight = this.preview.parent.offsetHeight;
          var targetRatio = targetWidth / targetHeight;
          var cropWidth = this.sourceSize.width * cropData.width;
          var cropHeight = this.sourceSize.height * cropData.height;
          var cropRatio = cropWidth / cropHeight;
          var containerWidth = targetWidth;
          var containerHeight = targetHeight;
          if (targetRatio > cropRatio) {
            containerWidth = containerHeight * cropRatio;
          } else {
            containerHeight = containerWidth / cropRatio;
          }
          this.preview.container.style.width = containerWidth + "px";
          this.preview.container.style.height = containerHeight + "px";
          var resizeWidth = this.sourceSize.width * containerWidth / cropWidth;
          var resizeHeight = this.sourceSize.height * containerHeight / cropHeight;
          var deltaX = -cropData.x * resizeWidth;
          var deltaY = -cropData.y * resizeHeight;
          this.preview.image.style.width = resizeWidth + "px";
          this.preview.image.style.height = resizeHeight + "px";
          this.preview.image.style.left = deltaX + "px";
          this.preview.image.style.top = deltaY + "px";
        }
      }
    }, {
      key: "strictlyConstrain",
      value: function strictlyConstrain() {
        var _this3 = this;
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var origins;
        if (origin === null) {
          origins = [[0, 0], [1, 1]];
          origin = [.5, .5];
        } else {
          origins = [origin];
        }
        if (opts === null) opts = this.options;
        var _this$imageEl$getBoun = this.imageEl.getBoundingClientRect(),
            parentWidth = _this$imageEl$getBoun.width,
            parentHeight = _this$imageEl$getBoun.height;
        this.box.constrainToRatio(opts.aspectRatio, origin, "height", opts.maxAspectRatio);
        this.box.constrainToSize(opts.maxSize.width, opts.maxSize.height, opts.minSize.width, opts.minSize.height, origin, opts.aspectRatio, opts.maxAspectRatio);
        origins.map(function (newOrigin) {
          _this3.box.constrainToBoundary(parentWidth, parentHeight, newOrigin);
        });
      }
      /**
       * Changes the image src.
       * @param {String} src
       */
    }, {
      key: "setImage",
      value: function setImage(src, callback) {
        var _this4 = this;
        this.imageEl.onload = function () {
          _this4.getSourceSize();
          _this4.options = _this4.parseOptions(_this4.initOptions);
          _this4.convertOptionsToPixels();
          _this4.initializeBox(null, false);
          _this4.strictlyConstrain();
          _this4.redraw();
          if (callback) callback();
        };
        this.imageEl.src = src;
        this.imageClippedEl.src = src;
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._restore.parent.replaceChild(this._restore.element, this.containerEl);
        if (this.options.preview) {
          this.preview.image.parentNode.removeChild(this.preview.image);
          this.preview.container.parentNode.removeChild(this.preview.container);
        }
      }
      /**
       * Create a new box region with a set of options.
       * @param {Object} opts The options.
       * @returns {Box}
       */
    }, {
      key: "initializeBox",
      value: function initializeBox() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var constrain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (opts === null) opts = this.options;
        var boxWidth = opts.startSize.width;
        var boxHeight = opts.startSize.height;
        if (opts.minSize) {
          if (boxWidth < opts.minSize.width) boxWidth = opts.minSize.width;else if (boxWidth < opts.maxSize.width) boxWidth = opts.maxSize.width;
        }
        if (opts.maxSize) {
          if (boxHeight < opts.minSize.height) boxHeight = opts.minSize.height;else if (boxHeight < opts.maxSize.height) boxHeight = opts.maxSize.height;
        }
        var box = new Box(0, 0, boxWidth, boxHeight);
        var x = 0;
        var y = 0;
        if (opts.startPosition === null) {
          var _this$imageEl$getBoun2 = this.imageEl.getBoundingClientRect(),
              parentWidth = _this$imageEl$getBoun2.width,
              parentHeight = _this$imageEl$getBoun2.height;
          x = parentWidth / 2 - boxWidth / 2;
          y = parentHeight / 2 - boxHeight / 2;
        } else {
          x = opts.startPosition.x;
          y = opts.startPosition.y;
        }
        box.move(x, y);
        if (this.preview) {
          if (this.preview.image) {
            this.preview.image.parentNode.removeChild(this.preview.image);
            this.preview.image = null;
          }
          var new_img = document.createElement("img");
          new_img.src = this.imageEl.src;
          this.preview.image = this.preview.container.appendChild(new_img);
          this.preview.image.style.position = "relative";
        }
        if (constrain === true) this.strictlyConstrain();
        this.box = box;
        this.redraw();
        return box;
      }
    }, {
      key: "getSourceSize",
      value: function getSourceSize() {
        this.sourceSize = {};
        this.sourceSize.width = this.imageEl.naturalWidth;
        this.sourceSize.height = this.imageEl.naturalHeight;
        return this.sourceSize;
      }
    }, {
      key: "convertor",
      value: function convertor(data, inputMode, outputMode) {
        var _this5 = this;
        var convertRealDataToPixel = function convertRealDataToPixel(data) {
          var _this5$imageEl$getBou = _this5.imageEl.getBoundingClientRect(),
              width = _this5$imageEl$getBou.width,
              height = _this5$imageEl$getBou.height;
          var factorX = _this5.sourceSize.width / width;
          var factorY = _this5.sourceSize.height / height;
          if (data.width) {
            data.width /= factorX;
          }
          if (data.x) {
            data.x /= factorX;
          }
          if (data.height) {
            data.height /= factorY;
          }
          if (data.y) {
            data.y /= factorY;
          }
          return data;
        };
        var convertPercentToPixel = function convertPercentToPixel(data) {
          var _this5$imageEl$getBou2 = _this5.imageEl.getBoundingClientRect(),
              width = _this5$imageEl$getBou2.width,
              height = _this5$imageEl$getBou2.height;
          if (data.width) {
            data.width = data.width / 100 * width;
          }
          if (data.x) {
            data.x = data.x / 100 * width;
          }
          if (data.height) {
            data.height = data.height / 100 * height;
          }
          if (data.y) {
            data.y = data.y / 100 * height;
          }
          return data;
        };
        if (inputMode === "real" && outputMode === "px") {
          return convertRealDataToPixel(data);
        } else if (inputMode === "%" && outputMode === "px") {
          return convertPercentToPixel(data);
        }
        return null;
      }
    }, {
      key: "convertOptionsToPixels",
      value: function convertOptionsToPixels() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var setOptions = false;
        if (opts === null) {
          opts = this.options;
          setOptions = true;
        }
        var _this$imageEl$getBoun3 = this.imageEl.getBoundingClientRect(),
            width = _this$imageEl$getBoun3.width,
            height = _this$imageEl$getBoun3.height;
        var sizeKeys = ['maxSize', 'minSize', 'startSize', 'startPosition'];
        for (var i = 0; i < sizeKeys.length; i++) {
          var key = sizeKeys[i];
          if (opts[key] !== null) {
            if (opts[key].unit == '%') {
              opts[key] = this.convertor(opts[key], "%", "px");
            } else if (opts[key].real === true) {
              opts[key] = this.convertor(opts[key], "real", "px");
            }
            delete opts[key].unit;
          }
        }
        if (opts.minSize) {
          if (opts.minSize.width > width) opts.minSize.width = width;
          if (opts.minSize.height > height) opts.minSize.height = height;
        }
        if (opts.startSize && opts.startPosition) {
          var xEnd = opts.startPosition.x + opts.startSize.width;
          if (xEnd > width) opts.startPosition.x -= xEnd - width;
          var yEnd = opts.startPosition.y + opts.startSize.height;
          if (yEnd > height) opts.startPosition.y -= yEnd - height;
        }
        if (setOptions) this.options = opts;
        return opts;
      }
    }, {
      key: "redraw",
      value: function redraw() {
        var _this6 = this;
        this.resizePreview();
        var width = Math.round(this.box.width()),
            height = Math.round(this.box.height()),
            x1 = Math.round(this.box.x1),
            y1 = Math.round(this.box.y1),
            x2 = Math.round(this.box.x2),
            y2 = Math.round(this.box.y2);
        window.requestAnimationFrame(function () {
          _this6.regionEl.style.transform = "translate(".concat(x1, "px, ").concat(y1, "px)");
          _this6.regionEl.style.width = width + 'px';
          _this6.regionEl.style.height = height + 'px';
          _this6.imageClippedEl.style.clip = "rect(".concat(y1, "px, ").concat(x2, "px, ").concat(y2, "px, ").concat(x1, "px)");
          var center = _this6.box.getAbsolutePoint([.5, .5]);
          var _this6$imageEl$getBou = _this6.imageEl.getBoundingClientRect(),
              parentWidth = _this6$imageEl$getBou.width,
              parentHeight = _this6$imageEl$getBou.height;
          var xSign = center[0] - parentWidth / 2 >> 31;
          var ySign = center[1] - parentHeight / 2 >> 31;
          var quadrant = (xSign ^ ySign) + ySign + ySign + 4;
          var foregroundHandleIndex = -2 * quadrant + 8;
          for (var i = 0; i < _this6.handles.length; i++) {
            var handle = _this6.handles[i];
            var handleWidth = handle.el.offsetWidth;
            var handleHeight = handle.el.offsetHeight;
            var left = x1 + width * handle.position[0] - handleWidth / 2;
            var top = y1 + height * handle.position[1] - handleHeight / 2;
            handle.el.style.transform = "translate(".concat(Math.round(left), "px, ").concat(Math.round(top), "px)");
            handle.el.style.zIndex = foregroundHandleIndex == i ? 5 : 4;
          }
        });
      }
    }, {
      key: "attachHandlerEvents",
      value: function attachHandlerEvents() {
        var eventBus = this.eventBus;
        eventBus.addEventListener('handlestart', this.onHandleMoveStart.bind(this));
        eventBus.addEventListener('handlemove', this.onHandleMoveMoving.bind(this));
        eventBus.addEventListener('handleend', this.onHandleMoveEnd.bind(this));
      }
    }, {
      key: "attachRegionEvents",
      value: function attachRegionEvents() {
        var eventBus = this.eventBus;
        this.regionEl.addEventListener('mousedown', onMouseDown);
        eventBus.addEventListener('regionstart', this.onRegionMoveStart.bind(this));
        eventBus.addEventListener('regionmove', this.onRegionMoveMoving.bind(this));
        eventBus.addEventListener('regionend', this.onRegionMoveEnd.bind(this));
        function onMouseDown(e) {
          e.stopPropagation();
          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('mousemove', onMouseMove);
          eventBus.dispatchEvent(new CustomEvent('regionstart', {
            detail: {
              mouseX: e.clientX,
              mouseY: e.clientY
            }
          }));
        }
        function onMouseMove(e) {
          e.stopPropagation();
          eventBus.dispatchEvent(new CustomEvent('regionmove', {
            detail: {
              mouseX: e.clientX,
              mouseY: e.clientY
            }
          }));
        }
        function onMouseUp(e) {
          e.stopPropagation();
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
          eventBus.dispatchEvent(new CustomEvent('regionend', {
            detail: {
              mouseX: e.clientX,
              mouseY: e.clientY
            }
          }));
        }
      }
    }, {
      key: "attachOverlayEvents",
      value: function attachOverlayEvents() {
        var SOUTHEAST_HANDLE_IDX = 4;
        var self = this;
        var tmpBox = null;
        this.overlayEl.addEventListener('mousedown', onMouseDown);
        function onMouseDown(e) {
          e.stopPropagation();
          document.addEventListener('mouseup', onMouseUp);
          document.addEventListener('mousemove', onMouseMove);
          var container = self.cropperEl.getBoundingClientRect();
          var mouseX = e.clientX - container.left;
          var mouseY = e.clientY - container.top;
          tmpBox = self.box;
          self.box = new Box(mouseX, mouseY, mouseX + 1, mouseY + 1);
          self.eventBus.dispatchEvent(new CustomEvent('handlestart', {
            detail: {
              handle: self.handles[SOUTHEAST_HANDLE_IDX]
            }
          }));
        }
        function onMouseMove(e) {
          e.stopPropagation();
          self.eventBus.dispatchEvent(new CustomEvent('handlemove', {
            detail: {
              mouseX: e.clientX,
              mouseY: e.clientY
            }
          }));
        }
        function onMouseUp(e) {
          e.stopPropagation();
          document.removeEventListener('mouseup', onMouseUp);
          document.removeEventListener('mousemove', onMouseMove);
          if (self.box.width() === 1 && self.box.height() === 1) {
            self.box = tmpBox;
            return;
          }
          self.eventBus.dispatchEvent(new CustomEvent('handleend', {
            detail: {
              mouseX: e.clientX,
              mouseY: e.clientY
            }
          }));
        }
      }
    }, {
      key: "onHandleMoveStart",
      value: function onHandleMoveStart(e) {
        var handle = e.detail.handle;
        var originPoint = [1 - handle.position[0], 1 - handle.position[1]];
        var _this$box$getAbsolute = this.box.getAbsolutePoint(originPoint),
            _this$box$getAbsolute2 = _slicedToArray(_this$box$getAbsolute, 2),
            originX = _this$box$getAbsolute2[0],
            originY = _this$box$getAbsolute2[1];
        this.activeHandle = {
          handle: handle,
          originPoint: originPoint,
          originX: originX,
          originY: originY
        };
        if (this.options.onCropStart !== null) {
          this.options.onCropStart(this.getValue());
        }
      }
    }, {
      key: "onHandleMoveMoving",
      value: function onHandleMoveMoving(e) {
        var _e$detail = e.detail,
            mouseX = _e$detail.mouseX,
            mouseY = _e$detail.mouseY;
        var container = this.cropperEl.getBoundingClientRect();
        mouseX = mouseX - container.left;
        mouseY = mouseY - container.top;
        if (mouseX < 0) {
          mouseX = 0;
        } else if (mouseX > container.width) {
          mouseX = container.width;
        }
        if (mouseY < 0) {
          mouseY = 0;
        } else if (mouseY > container.height) {
          mouseY = container.height;
        }
        var origin = this.activeHandle.originPoint.slice();
        var originX = this.activeHandle.originX;
        var originY = this.activeHandle.originY;
        var handle = this.activeHandle.handle;
        var TOP_MOVABLE = handle.constraints[0] === 1;
        var RIGHT_MOVABLE = handle.constraints[1] === 1;
        var BOTTOM_MOVABLE = handle.constraints[2] === 1;
        var LEFT_MOVABLE = handle.constraints[3] === 1;
        var MULTI_AXIS = (LEFT_MOVABLE || RIGHT_MOVABLE) && (TOP_MOVABLE || BOTTOM_MOVABLE);
        var x1 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : this.box.x1;
        var x2 = LEFT_MOVABLE || RIGHT_MOVABLE ? originX : this.box.x2;
        var y1 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : this.box.y1;
        var y2 = TOP_MOVABLE || BOTTOM_MOVABLE ? originY : this.box.y2;
        x1 = LEFT_MOVABLE ? mouseX : x1;
        x2 = RIGHT_MOVABLE ? mouseX : x2;
        y1 = TOP_MOVABLE ? mouseY : y1;
        y2 = BOTTOM_MOVABLE ? mouseY : y2;
        var isFlippedX = false,
            isFlippedY = false;
        if (LEFT_MOVABLE || RIGHT_MOVABLE) {
          isFlippedX = LEFT_MOVABLE ? mouseX > originX : mouseX < originX;
        }
        if (TOP_MOVABLE || BOTTOM_MOVABLE) {
          isFlippedY = TOP_MOVABLE ? mouseY > originY : mouseY < originY;
        }
        if (isFlippedX) {
          var tmp = x1;
          x1 = x2;
          x2 = tmp;
          origin[0] = 1 - origin[0];
        }
        if (isFlippedY) {
          var _tmp = y1;
          y1 = y2;
          y2 = _tmp;
          origin[1] = 1 - origin[1];
        }
        var box = new Box(x1, y1, x2, y2);
        if (this.options.aspectRatio) {
          var ratio = this.options.aspectRatio;
          var isVerticalMovement = false;
          if (MULTI_AXIS) {
            isVerticalMovement = mouseY > box.y1 + ratio * box.width() || mouseY < box.y2 - ratio * box.width();
          } else if (TOP_MOVABLE || BOTTOM_MOVABLE) {
            isVerticalMovement = true;
          }
          var ratioMode = isVerticalMovement ? 'width' : 'height';
          box.constrainToRatio(ratio, origin, ratioMode, this.options.maxAspectRatio);
        }
        box.constrainToSize(this.options.maxSize.width, this.options.maxSize.height, this.options.minSize.width, this.options.minSize.height, origin, this.options.aspectRatio, this.options.maxAspectRatio);
        var _this$imageEl$getBoun4 = this.imageEl.getBoundingClientRect(),
            parentWidth = _this$imageEl$getBoun4.width,
            parentHeight = _this$imageEl$getBoun4.height;
        var boundaryOrigins = [origin];
        if (this.options.maxAspectRatio) boundaryOrigins = [[0, 0], [1, 1]];
        boundaryOrigins.map(function (boundaryOrigin) {
          box.constrainToBoundary(parentWidth, parentHeight, boundaryOrigin);
        });
        this.box = box;
        this.redraw();
        if (this.options.onCropMove !== null) {
          this.options.onCropMove(this.getValue());
        }
      }
    }, {
      key: "onHandleMoveEnd",
      value: function onHandleMoveEnd(e) {
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
      }
    }, {
      key: "onRegionMoveStart",
      value: function onRegionMoveStart(e) {
        var _e$detail2 = e.detail,
            mouseX = _e$detail2.mouseX,
            mouseY = _e$detail2.mouseY;
        var container = this.cropperEl.getBoundingClientRect();
        mouseX = mouseX - container.left;
        mouseY = mouseY - container.top;
        this.currentMove = {
          offsetX: mouseX - this.box.x1,
          offsetY: mouseY - this.box.y1
        };
        if (this.options.onCropStart !== null) {
          this.options.onCropStart(this.getValue());
        }
      }
    }, {
      key: "onRegionMoveMoving",
      value: function onRegionMoveMoving(e) {
        var _e$detail3 = e.detail,
            mouseX = _e$detail3.mouseX,
            mouseY = _e$detail3.mouseY;
        var _this$currentMove = this.currentMove,
            offsetX = _this$currentMove.offsetX,
            offsetY = _this$currentMove.offsetY;
        var container = this.cropperEl.getBoundingClientRect();
        mouseX = mouseX - container.left;
        mouseY = mouseY - container.top;
        this.box.move(mouseX - offsetX, mouseY - offsetY);
        if (this.box.x1 < 0) {
          this.box.move(0, null);
        }
        if (this.box.x2 > container.width) {
          this.box.move(container.width - this.box.width(), null);
        }
        if (this.box.y1 < 0) {
          this.box.move(null, 0);
        }
        if (this.box.y2 > container.height) {
          this.box.move(null, container.height - this.box.height());
        }
        this.redraw();
        if (this.options.onCropMove !== null) {
          this.options.onCropMove(this.getValue());
        }
      }
    }, {
      key: "onRegionMoveEnd",
      value: function onRegionMoveEnd(e) {
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
      }
    }, {
      key: "getValue",
      value: function getValue() {
        var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (mode === null) {
          mode = this.options.returnMode;
        }
        var cropData = {};
        if (mode == 'real') {
          cropData = this.getValueAsRealData();
        } else if (mode == 'ratio') {
          cropData = this.getValueAsRatio();
        } else if (mode == 'raw') {
          cropData = {
            x: Math.round(this.box.x1),
            y: Math.round(this.box.y1),
            width: Math.round(this.box.width()),
            height: Math.round(this.box.height())
          };
        }
        if (this.options.responsive) {
          if (mode == "ratio") this.responsiveData = cropData;else this.responsiveData = this.getValueAsRatio();
        }
        return cropData;
      }
    }, {
      key: "getValueAsRealData",
      value: function getValueAsRealData() {
        var actualWidth = this.imageEl.naturalWidth;
        var actualHeight = this.imageEl.naturalHeight;
        var _this$imageEl$getBoun5 = this.imageEl.getBoundingClientRect(),
            elementWidth = _this$imageEl$getBoun5.width,
            elementHeight = _this$imageEl$getBoun5.height;
        var factorX = actualWidth / elementWidth;
        var factorY = actualHeight / elementHeight;
        return {
          x: Math.round(this.box.x1 * factorX),
          y: Math.round(this.box.y1 * factorY),
          width: Math.round(this.box.width() * factorX),
          height: Math.round(this.box.height() * factorY)
        };
      }
    }, {
      key: "getValueAsRatio",
      value: function getValueAsRatio() {
        var _this$imageEl$getBoun6 = this.imageEl.getBoundingClientRect(),
            elementWidth = _this$imageEl$getBoun6.width,
            elementHeight = _this$imageEl$getBoun6.height;
        return {
          x: this.box.x1 / elementWidth,
          y: this.box.y1 / elementHeight,
          width: this.box.width() / elementWidth,
          height: this.box.height() / elementHeight
        };
      }
    }, {
      key: "parseOptions",
      value: function parseOptions() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        if (opts === null) opts = this.options;
        var defaults = {
          aspectRatio: null,
          maxAspectRatio: null,
          maxSize: {
            width: null,
            height: null,
            unit: 'px',
            real: false
          },
          minSize: {
            width: null,
            height: null,
            unit: 'px',
            real: false
          },
          startSize: {
            width: 100,
            height: 100,
            unit: '%',
            real: false
          },
          startPosition: null,
          returnMode: 'real',
          onInitialize: null,
          onCropStart: null,
          onCropMove: null,
          onCropEnd: null,
          preview: null,
          responsive: true
        };
        var preview = null;
        if (opts.preview !== null) preview = this.getElement(opts.preview);
        var responsive = null;
        if (opts.responsive !== null) responsive = opts.responsive;
        var aspectRatio = null;
        var maxAspectRatio = null;
        var ratioKeys = ["aspectRatio", "maxAspectRatio"];
        for (var i = 0; i < ratioKeys.length; i++) {
          if (opts[ratioKeys[i]] !== undefined) {
            if (typeof opts[ratioKeys[i]] === 'number') {
              var ratio = opts[ratioKeys[i]];
              if (ratioKeys[i] === "aspectRatio") aspectRatio = ratio;else maxAspectRatio = ratio;
            } else if (opts[ratioKeys[i]] instanceof Array) {
              var _ratio = opts[ratioKeys[i]][1] / opts[ratioKeys[i]][0];
              if (ratioKeys[i] === "aspectRatio") aspectRatio = _ratio;else maxAspectRatio = _ratio;
            }
          }
        }
        var maxSize = null;
        if (opts.maxSize !== undefined && opts.maxSize !== null) {
          maxSize = {
            width: opts.maxSize[0] || null,
            height: opts.maxSize[1] || null,
            unit: opts.maxSize[2] || 'px',
            real: opts.minSize[3] || false
          };
        }
        var minSize = null;
        if (opts.minSize !== undefined && opts.minSize !== null) {
          minSize = {
            width: opts.minSize[0] || null,
            height: opts.minSize[1] || null,
            unit: opts.minSize[2] || 'px',
            real: opts.minSize[3] || false
          };
        }
        var startSize = null;
        if (opts.startSize !== undefined && opts.startSize !== null) {
          startSize = {
            width: opts.startSize[0] || null,
            height: opts.startSize[1] || null,
            unit: opts.startSize[2] || '%',
            real: opts.startSize[3] || false
          };
        }
        var startPosition = null;
        if (opts.startPosition !== undefined && opts.startPosition !== null) {
          startPosition = {
            x: opts.startPosition[0] || null,
            y: opts.startPosition[1] || null,
            unit: opts.startPosition[2] || '%',
            real: opts.startPosition[3] || false
          };
        }
        var onInitialize = null;
        if (typeof opts.onInitialize === 'function') {
          onInitialize = opts.onInitialize;
        }
        var onCropStart = null;
        if (typeof opts.onCropStart === 'function') {
          onCropStart = opts.onCropStart;
        }
        var onCropEnd = null;
        if (typeof opts.onCropEnd === 'function') {
          onCropEnd = opts.onCropEnd;
        }
        var onCropMove = null;
        if (typeof opts.onUpdate === 'function') {
          console.warn('Croppr.js: `onUpdate` is deprecated and will be removed in the next major release. Please use `onCropMove` or `onCropEnd` instead.');
          onCropMove = opts.onUpdate;
        }
        if (typeof opts.onCropMove === 'function') {
          onCropMove = opts.onCropMove;
        }
        var returnMode = null;
        if (opts.returnMode !== undefined) {
          var s = opts.returnMode.toLowerCase();
          if (['real', 'ratio', 'raw'].indexOf(s) === -1) {
            throw "Invalid return mode.";
          }
          returnMode = s;
        }
        var defaultValue = function defaultValue(v, d) {
          return v !== null ? v : d;
        };
        return {
          aspectRatio: defaultValue(aspectRatio, defaults.aspectRatio),
          maxAspectRatio: defaultValue(maxAspectRatio, defaults.maxAspectRatio),
          maxSize: defaultValue(maxSize, defaults.maxSize),
          minSize: defaultValue(minSize, defaults.minSize),
          startSize: defaultValue(startSize, defaults.startSize),
          startPosition: defaultValue(startPosition, defaults.startPosition),
          returnMode: defaultValue(returnMode, defaults.returnMode),
          onInitialize: defaultValue(onInitialize, defaults.onInitialize),
          onCropStart: defaultValue(onCropStart, defaults.onCropStart),
          onCropMove: defaultValue(onCropMove, defaults.onCropMove),
          onCropEnd: defaultValue(onCropEnd, defaults.onCropEnd),
          preview: defaultValue(preview, defaults.preview),
          responsive: defaultValue(responsive, defaults.responsive)
        };
      }
    }]);
    return CropprCore;
  }();

  var Croppr =
  function (_CropprCore) {
    _inherits(Croppr, _CropprCore);
    /**
     * @constructor
     * Calls the CropprCore's constructor.
     */
    function Croppr(element, options) {
      var _deferred = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      _classCallCheck(this, Croppr);
      return _possibleConstructorReturn(this, _getPrototypeOf(Croppr).call(this, element, options, _deferred));
    }
    /**
     * Gets the value of the crop region.
     * @param {String} [mode] Which mode of calculation to use: 'real', 'ratio' or
     *      'raw'.
     */
    _createClass(Croppr, [{
      key: "getValue",
      value: function getValue(mode) {
        return _get(_getPrototypeOf(Croppr.prototype), "getValue", this).call(this, mode);
      }
      /**
       * Changes the image src.
       * @param {String} src
       */
    }, {
      key: "setImage",
      value: function setImage(src) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        return _get(_getPrototypeOf(Croppr.prototype), "setImage", this).call(this, src, callback);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        return _get(_getPrototypeOf(Croppr.prototype), "destroy", this).call(this);
      }
      /**
       * Moves the crop region to a specified coordinate.
       * @param {Number} x
       * @param {Number} y
       */
    }, {
      key: "moveTo",
      value: function moveTo(x, y) {
        var constrain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "px";
        if (mode === "%" || mode === "real") {
          var data = this.convertor({
            x: x,
            y: y
          }, mode, "px");
          x = data.x;
          y = data.y;
        }
        this.box.move(x, y);
        if (constrain === true) this.strictlyConstrain(null, [0, 0]);
        this.redraw();
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
        return this;
      }
      /**
       * Resizes the crop region to a specified width and height.
       * @param {Number} width
       * @param {Number} height
       * @param {Array} origin The origin point to resize from.
       *      Defaults to [0.5, 0.5] (center).
       */
    }, {
      key: "resizeTo",
      value: function resizeTo(width, height) {
        var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var constrain = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "px";
        if (mode === "%" || mode === "real") {
          var data = {
            width: width,
            height: height
          };
          data = this.convertor(data, mode, "px");
          width = data.width;
          height = data.height;
        }
        if (origin === null) origin = [.5, .5];
        this.box.resize(width, height, origin);
        if (constrain === true) this.strictlyConstrain();
        this.redraw();
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
        return this;
      }
    }, {
      key: "setValue",
      value: function setValue(data) {
        var constrain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "%";
        if (mode === "%" || mode === "real") data = this.convertor(data, mode, "px");
        this.moveTo(data.x, data.y, false);
        this.resizeTo(data.width, data.height, [0, 0], constrain);
        return this;
      }
      /**
       * Scale the crop region by a factor.
       * @param {Number} factor
       * @param {Array} origin The origin point to resize from.
       *      Defaults to [0.5, 0.5] (center).
       */
    }, {
      key: "scaleBy",
      value: function scaleBy(factor) {
        var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var constrain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        if (origin === null) origin = [.5, .5];
        this.box.scale(factor, origin);
        if (constrain === true) this.strictlyConstrain();
        this.redraw();
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
        return this;
      }
    }, {
      key: "reset",
      value: function reset() {
        this.box = this.initializeBox(this.options);
        this.redraw();
        if (this.options.onCropEnd !== null) {
          this.options.onCropEnd(this.getValue());
        }
        return this;
      }
    }]);
    return Croppr;
  }(CropprCore);

  return Croppr;

}));

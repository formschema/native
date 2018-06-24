(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["FormSchemaNative"] = factory();
	else
		root["FormSchemaNative"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "+xUi");
/******/ })
/************************************************************************/
/******/ ({

/***/ "+xUi":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("HrLf");
/* harmony import */ var _setPublicPath__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_setPublicPath__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("FvBh");
/* harmony import */ var _entry__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_entry__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _entry__WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _entry__WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/* harmony default export */ __webpack_exports__["default"] = (_entry__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "/1+o":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

var _FormSchemaInput = _interopRequireDefault(__webpack_require__("FyUc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var props = _ref.props,
        listeners = _ref.listeners;
    var item = props.item,
        field = props.field,
        value = props.value,
        checked = props.checked,
        disableWrappingLabel = props.disableWrappingLabel;
    var label = item.label,
        description = item.description;
    var attrs = {
      name: item.name || field.attrs.name,
      type: field.attrs.type,
      value: field.schemaType === 'boolean' ? undefined : item.value,
      checked: typeof checked === 'undefined' ? _instanceof(value, Array) ? value.includes(item.value) : item.value === value : checked
    };
    var input = (0, _components.input)({
      field: {
        label: label,
        description: description,
        attrs: attrs
      },
      fieldParent: field,
      listeners: listeners
    });
    return createElement(_FormSchemaInput.default, {
      props: {
        value: value,
        input: input,
        disableWrappingLabel: disableWrappingLabel,
        field: _objectSpread({}, field, {
          label: label,
          description: description
        })
      },
      on: input.data.listeners
    });
  }
};
exports.default = _default;

/***/ }),

/***/ "A9B9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFieldset = renderFieldset;
exports.renderInput = renderInput;
exports.set = set;
exports.init = init;
exports.argName = argName;
exports.input = input;
exports.inputName = exports.fieldTypesAsNotArray = exports.groupedArrayTypes = exports.renderButton = exports.components = void 0;

var _object = __webpack_require__("IhR4");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var tags = {
  h1: ['title'],
  p: ['description'],
  div: ['error', 'textgroup', 'buttonswrapper', 'formwrapper', 'inputswrapper', 'inputwrapper', 'defaultGroup'],
  legend: ['legend'],
  fieldset: ['radiogroup', 'checkboxgroup'],
  small: ['inputdesc'],
  form: ['form'],
  input: {
    typed: ['checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'hidden', 'image', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week']
  },
  textarea: ['textarea'],
  select: ['select'],
  option: ['option'],
  label: ['label'],
  button: ['submitbutton', 'arraybutton']
};
var components = {};
exports.components = components;

function renderFieldset(h, _ref) {
  var data = _ref.data,
      props = _ref.props,
      slots = _ref.slots;
  var name = data.field.attrs.name;
  var description = data.field.description;
  var children = [h(components.inputswrapper.component, slots().default)];

  if (description) {
    children.unshift(h(components.legend.component, description));
    delete data.field.description;
  }

  return h('fieldset', {
    attrs: {
      name: name
    }
  }, children);
}

function renderInput(h, _ref2) {
  var data = _ref2.data,
      props = _ref2.props,
      slots = _ref2.slots;
  var nodes = slots().default || [];
  var field = props.field;

  if (field.description) {
    nodes.push(h(components.inputdesc.component, {
      props: {
        field: field
      }
    }, field.description));
  }

  if (!field.label) {
    if (nodes.length > 1) {
      return h('div', nodes);
    }

    return nodes[0];
  }

  nodes.unshift(h('span', {
    attrs: {
      'data-required-field': field.attrs.required ? 'true' : 'false'
    }
  }, field.label));
  return h('label', nodes);
}

var renderButton = function renderButton(type, label) {
  return function (h, _ref3) {
    var listeners = _ref3.listeners;
    return h('button', {
      attrs: {
        type: type
      },
      on: listeners
    }, label);
  };
};

exports.renderButton = renderButton;

function set(type, component) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var native = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (typeof component !== 'string') {
    component.functional = true;
  }

  components[type] = {
    type: type,
    native: native,
    component: typeof component === 'string' ? {
      functional: true,
      render: function render(h, _ref4) {
        var data = _ref4.data,
            slots = _ref4.slots;
        var nodes = slots().default || [];

        if (option) {
          (0, _object.merge)(data, option);
        }

        if (nodes.length === 0 && Object.keys(data).length === 0) {
          return null;
        }

        return h(component, data, nodes);
      }
    } : component
  };
}

function init() {
  var _loop = function _loop(component) {
    delete components[component];

    if (_instanceof(tags[component], Array)) {
      tags[component].forEach(function (name) {
        return set(name, component, {}, true);
      });
    } else {
      tags[component].typed.forEach(function (type) {
        set(type, component, {
          attrs: {
            type: type
          }
        }, true);
      });
    }
  };

  for (var component in tags) {
    _loop(component);
  }

  components.radiogroup.component.render = renderFieldset;
  components.checkboxgroup.component.render = renderFieldset;
  components.inputwrapper.component.render = renderInput;
  components.submitbutton.component.render = renderButton('submit', 'Submit');
  components.arraybutton.component.render = renderButton('button', 'Add');
}

function argName(el) {
  return el.native ? 'attrs' : 'props';
}

var groupedArrayTypes = ['radio', 'checkbox', 'input', 'textarea'];
exports.groupedArrayTypes = groupedArrayTypes;

function input(_ref5) {
  var _data;

  var field = _ref5.field,
      _ref5$fieldParent = _ref5.fieldParent,
      fieldParent = _ref5$fieldParent === void 0 ? null : _ref5$fieldParent,
      _ref5$listeners = _ref5.listeners,
      listeners = _ref5$listeners === void 0 ? {} : _ref5$listeners;
  var type = field.attrs.type;
  var element = field.hasOwnProperty('items') && groupedArrayTypes.includes(type) ? components["".concat(type, "group")] || components.defaultGroup : components[type] || components.text;
  var data = (_data = {
    field: field,
    fieldParent: fieldParent,
    attrs: {},
    props: {},
    domProps: {}
  }, _defineProperty(_data, argName(element), _objectSpread({}, field.attrs)), _defineProperty(_data, "on", listeners), _data);
  return {
    element: element,
    data: data
  };
}

var fieldTypesAsNotArray = ['radio', 'textarea', 'select'];
exports.fieldTypesAsNotArray = fieldTypesAsNotArray;

var inputName = function inputName(field, index) {
  return "".concat(field.attrs.name, "-").concat(index);
};

exports.inputName = inputName;

/***/ }),

/***/ "FvBh":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parser = __webpack_require__("qKzl");

var _object = __webpack_require__("IhR4");

var _components = __webpack_require__("A9B9");

var _FormSchemaField = _interopRequireDefault(__webpack_require__("Lzpw"));

var _FormSchemaButtons = _interopRequireDefault(__webpack_require__("jG8C"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(0, _components.init)();
var _default2 = {
  name: 'FormSchema',
  props: {
    /**
     * The JSON Schema object.
     */
    schema: {
      type: Object,
      required: true
    },

    /**
     * Use this directive to create two-way data bindings with the component. It automatically picks the correct way to update the element based on the input type.
     * @model
     * @default {}
     */
    value: {
      type: Object,
      default: function _default() {
        return {};
      }
    },

    /**
     * The URI of a program that processes the form information.
     */
    action: {
      type: String
    },

    /**
     * This property indicates whether the value of the control can be automatically completed by the browser. Possible values are: `off` and `on`.
     */
    autocomplete: {
      type: String
    },

    /**
     * When the value of the method attribute is post, enctype is the MIME type of content that is used to submit the form to the server. Possible values are:
     * - application/x-www-form-urlencoded: The default value if the attribute is not specified.
     * - multipart/form-data: The value used for an <input> element with the type attribute set to "file".
     * - text/plain (HTML5)
     */
    enctype: {
      type: String,
      default: 'application/x-www-form-urlencoded'
    },

    /**
     * The HTTP method that the browser uses to submit the form. Possible values are:
     * - post: Corresponds to the HTTP POST method ; form data are included in the body of the form and sent to the server.
     * - get: Corresponds to the HTTP GET method; form data are appended to the action attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.
     */
    method: {
      type: String,
      default: 'post'
    },

    /**
     * This Boolean attribute indicates that the form is not to be validated when submitted.
     */
    novalidate: {
      type: Boolean
    }
  },
  data: function data() {
    return {
      schemaLoaded: {
        schema: {},
        fields: []
      },
      default: {},
      error: null,
      data: {},
      inputValues: {}
    };
  },
  created: function created() {
    this.init(this.schema);
  },
  watch: {
    schema: function schema(value, oldValue) {
      if (!(0, _object.equals)(value, oldValue)) {
        this.init(value);
      }
    }
  },
  render: function render(createElement) {
    var _this = this;

    var _this$schemaLoaded = this.schemaLoaded,
        schema = _this$schemaLoaded.schema,
        fields = _this$schemaLoaded.fields;
    var nodes = [];

    if (schema.title) {
      nodes.push(createElement(_components.components.title.component, schema.title));
    }

    if (schema.description) {
      nodes.push(createElement(_components.components.description.component, schema.description));
    }

    if (this.error) {
      nodes.push(createElement(_components.components.error.component, this.error));
    }

    var formNodes = fields.map(function (field) {
      var value = _this.data[field.attrs.name];
      return createElement(_FormSchemaField.default, {
        props: {
          field: field,
          value: value
        },
        on: {
          input: function input(event) {
            var target = event.target;
            var data = event.target.value;
            var eventInput = {
              field: field,
              data: data,
              target: target
            };

            if (field.isArrayField) {
              _this.onInputArrayValue(eventInput);
            } else {
              _this.onInput(eventInput);
            }
          },
          change: function change(event) {
            var target = event.target;
            var data = event.target.value;
            var eventInput = {
              field: field,
              data: data,
              target: target
            };

            if (field.isArrayField) {
              _this.onInputArrayValue(eventInput, false);
            } else {
              _this.onInput(eventInput, false);
            }

            _this.changed();
          }
        }
      });
    });

    if (formNodes.length) {
      var _createElement;

      formNodes.push(createElement(_FormSchemaButtons.default, this.$slots.default));
      nodes.push(createElement(_components.components.form.component, (_createElement = {
        ref: '__form'
      }, _defineProperty(_createElement, (0, _components.argName)(_components.components.form), {
        action: this.action,
        enctype: this.enctype,
        method: this.method,
        autocomplete: this.autocomplete,
        novalidate: this.novalidate
      }), _defineProperty(_createElement, "on", {
        reset: this.reset,
        submit: this.submit,
        invalid: this.invalid
      }), _createElement), formNodes));
    }

    return createElement(_components.components.formwrapper.component, nodes);
  },
  setComponent: _components.set,
  methods: {
    /**
     * @private
     */
    init: function init(schema) {
      var fields = [];
      (0, _parser.loadFields)(schema, fields);
      this.loadDefaultValues(fields);
      this.schemaLoaded = {
        schema: schema,
        fields: fields
      };
    },

    /**
     * @private
     */
    loadDefaultValues: function loadDefaultValues(fields) {
      var _this2 = this;

      this.default = {};
      this.inputValues = {};
      fields.forEach(function (field) {
        var _field$attrs = field.attrs,
            type = _field$attrs.type,
            name = _field$attrs.name;
        _this2.default[name] = field.schemaType === 'boolean' ? typeof _this2.value[name] === 'boolean' ? _this2.value[name] : field.attrs.checked === true : _this2.value[name] || field.attrs.value;

        if (field.isArrayField) {
          if (!Array.isArray(_this2.default[name])) {
            _this2.default[name] = [];
          } else {
            _this2.default[name] = _this2.default[name].filter(function (value, i) {
              _this2.inputValues[(0, _components.inputName)(field, i)] = value;
              return value !== undefined;
            });
          }

          field.itemsNum = type === 'checkbox' ? field.items.length : field.minItems;
        }
      });
      var data = {};
      (0, _object.merge)(data, this.default);
      this.data = data;
      this.$emit('input', this.data);
    },

    /**
     * @private
     */
    onInput: function onInput(event) {
      var triggerInputEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (event.field.schemaType === 'boolean') {
        event.data = event.target.checked;
      }

      this.data[event.field.attrs.name] = event.data;

      if (triggerInputEvent) {
        /**
         * Fired synchronously when the value of an element is changed.
         */
        this.$emit('input', this.data);
      }
    },

    /**
     * @private
     */
    onInputArrayValue: function onInputArrayValue(event) {
      var triggerInputEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (event.field.attrs.type === 'checkbox') {
        if (event.target.checked) {
          if (!this.data[event.field.attrs.name].includes(event.data)) {
            this.data[event.field.attrs.name].push(event.data);
          }
        } else {
          var index = this.data[event.field.attrs.name].indexOf(event.data);

          if (index > -1) {
            this.data[event.field.attrs.name].splice(index, 1);
          }
        }
      } else {
        var _index = event.target.getAttribute('data-fs-index');

        var key = (0, _components.inputName)(event.field, _index);
        this.inputValues[key] = event.data;
        var values = [];

        for (var i = 0; i < event.field.itemsNum; i++) {
          var currentValue = this.inputValues[(0, _components.inputName)(event.field, i)];

          if (currentValue) {
            values.push(currentValue);
          }
        }

        this.data[event.field.attrs.name] = values;
      }

      if (triggerInputEvent) {
        /**
         * Fired synchronously when the value of an element is changed.
         */
        this.$emit('input', this.data);
      }
    },

    /**
     * @private
     */
    changed: function changed() {
      if (!(0, _object.equals)(this.data, this.default)) {
        /**
         * Fired when a change to the element's value is committed by the user.
         */
        this.$emit('change', this.data);
      }
    },

    /**
     * Get the form reference.
     */
    form: function form() {
      return this.$refs.__form;
    },

    /**
     * Returns true if the element's child controls satisfy their validation constraints. When false is returned, cancelable invalid events are fired for each invalid child and validation problems are reported to the user.
     */
    reportValidity: function reportValidity() {
      var controls = this.form().elements;
      var validity = true;

      for (var i = 0; i < controls.length; i++) {
        if ('checkValidity' in controls[i]) {
          validity = validity && controls[i].checkValidity();
        }
      }

      return validity;
    },

    /**
     * Checks whether the form has any constraints and whether it satisfies them. If the form fails its constraints, the browser fires a cancelable `invalid` event at the element, and then returns false.
     * @aliasof reportValidity
     */
    checkValidity: function checkValidity() {
      return this.reportValidity();
    },

    /**
     * @private
     */
    invalid: function invalid(e) {
      /**
       * Fired when a submittable element has been checked and doesn't satisfy its constraints. The validity of submittable elements is checked before submitting their owner form, or after the `checkValidity()` of the element or its owner form is called.
       */
      this.$emit('invalid', e);
    },

    /**
     * Reset the value of all elements of the parent form.
     */
    reset: function reset() {
      var _this3 = this;

      for (var key in this.inputValues) {
        delete this.inputValues[key];
      }

      this.schemaLoaded.fields.forEach(function (field) {
        var name = field.attrs.name;

        _this3.$set(_this3.data, name, _this3.default[name]);

        if (field.isArrayField) {
          _this3.data[name].forEach(function (value, i) {
            _this3.inputValues[(0, _components.inputName)(field, i)] = value;
          });
        }
      });
    },

    /**
     * Send the content of the form to the server.
     */
    submit: function submit(event) {
      if (this.checkValidity()) {
        /**
         * Fired when a form is submitted
         */
        this.$emit('submit', event);
      }
    },

    /**
     * Set a message error.
     */
    setErrorMessage: function setErrorMessage(message) {
      this.error = message;
    },

    /**
     * clear the message error.
     */
    clearErrorMessage: function clearErrorMessage() {
      this.error = null;
    }
  }
};
exports.default = _default2;

/***/ }),

/***/ "FyUc":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

var _FormSchemaInputArrayElement = _interopRequireDefault(__webpack_require__("VRLf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var unwrappingElements = ['checkbox', 'radio'];
var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var props = _ref.props,
        slots = _ref.slots,
        listeners = _ref.listeners;
    var field = props.field,
        value = props.value,
        input = props.input,
        disableWrappingLabel = props.disableWrappingLabel;
    var children = slots().default || [];

    if (field.isArrayField && field.attrs.type !== 'select') {
      var _buttonData;

      var name = field.attrs.name;
      var data = {
        props: {
          name: name,
          field: field,
          value: value,
          input: input
        },
        on: listeners
      };

      if (unwrappingElements.includes(field.attrs.type)) {
        return createElement(_components.components.inputwrapper.component, data, [createElement(_FormSchemaInputArrayElement.default, data, children)]);
      }

      var inputs = Array.apply(null, Array(field.itemsNum)).map(function (v, i) {
        data.props.name = (0, _components.inputName)(field, i);
        input.data.attrs['data-fs-index'] = i;
        return createElement(_FormSchemaInputArrayElement.default, data, children);
      });
      var button = _components.components.arraybutton;
      var buttonData = (_buttonData = {}, _defineProperty(_buttonData, (0, _components.argName)(button), {
        disabled: field.maxItems <= field.itemsNum
      }), _defineProperty(_buttonData, "on", {
        click: function click() {
          if (field.itemsNum < field.maxItems) {
            field.itemsNum++; // TODO: add a proper way to emit the 'inputAdded' event

            if ('inputAdded' in listeners) {
              listeners.inputAdded();
            }
          }
        }
      }), _buttonData);
      inputs.push(createElement(button.component, buttonData));
      return createElement(_components.components.inputwrapper.component, {
        props: {
          field: field
        }
      }, [createElement(_components.components.inputswrapper.component, {
        props: {
          field: field
        }
      }, inputs)]);
    }

    var nodes = [createElement(input.element.component, input.data, children)];

    if (disableWrappingLabel) {
      return nodes;
    }

    return createElement(_components.components.inputwrapper.component, {
      props: {
        field: field
      }
    }, nodes);
  }
};
exports.default = _default;

/***/ }),

/***/ "HrLf":
/***/ (function(module, exports, __webpack_require__) {

// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  let i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}


/***/ }),

/***/ "IhR4":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.equals = equals;
exports.isScalar = isScalar;
exports.merge = merge;
exports.assign = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function equals(o1, o2) {
  var keys1 = Object.keys(o1);

  if (keys1.length !== Object.keys(o2).length) {
    return false;
  }

  return keys1.findIndex(function (key) {
    return !o2.hasOwnProperty(key) || o1[key] !== o2[key];
  }) === -1;
}

function isScalar(value) {
  if (value === null) {
    return true;
  }

  return /string|number|boolean|undefined|function/.test(_typeof(value));
}

function merge(dest, src) {
  Object.keys(src).forEach(function (key) {
    var value = src[key];

    if (isScalar(value)) {
      dest[key] = value;
    } else if (_instanceof(value, Array)) {
      dest[key] = _toConsumableArray(value);
    } else if (_instanceof(value, Function)) {
      dest[key] = value;
    } else {
      if (!dest[key]) {
        dest[key] = {};
      }

      merge(dest[key], value);
    }
  });
  return dest;
}

var assign = merge;
exports.assign = assign;

/***/ }),

/***/ "Lzpw":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

var _FormSchemaInput = _interopRequireDefault(__webpack_require__("FyUc"));

var _FormSchemaFieldCheckboxItem = _interopRequireDefault(__webpack_require__("/1+o"));

var _FormSchemaFieldSelectOption = _interopRequireDefault(__webpack_require__("jQn/"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var props = _ref.props,
        listeners = _ref.listeners;
    var field = props.field,
        value = props.value;
    var input = (0, _components.input)({
      field: field,
      listeners: listeners
    });
    var children = [];

    switch (field.attrs.type) {
      case 'textarea':
        if (input.element.native) {
          delete input.data.attrs.type;
          delete input.data.attrs.value;
          input.data.domProps.innerHTML = value;
        }

        break;

      case 'radio':
        if (field.hasOwnProperty('items')) {
          field.items.forEach(function (item) {
            children.push(createElement(_FormSchemaFieldCheckboxItem.default, {
              fieldParent: field,
              props: {
                item: item,
                value: value,
                field: _objectSpread({}, field, {
                  isArrayField: false
                })
              },
              on: listeners
            }));
          });
        }

        break;

      case 'checkbox':
        if (field.hasOwnProperty('items')) {
          field.items.forEach(function (item) {
            children.push(createElement(_FormSchemaFieldCheckboxItem.default, {
              fieldParent: field,
              props: {
                item: item,
                value: value,
                field: field
              },
              on: listeners
            }));
          });
        } else if (field.schemaType === 'boolean') {
          var item = {
            label: field.label
          };
          var checked = value === true;
          return createElement(_FormSchemaFieldCheckboxItem.default, {
            props: {
              item: item,
              value: value,
              field: field,
              checked: checked
            },
            on: listeners
          });
        }

        break;

      case 'select':
        var items = _toConsumableArray(field.items);

        if (field.attrs.required) {
          items.unshift({
            label: null,
            value: ''
          });
        }

        if (input.element.native) {
          delete input.data.attrs.type;
          delete input.data.attrs.value;
        }

        items.forEach(function (option) {
          children.push(createElement(_FormSchemaFieldSelectOption.default, {
            props: {
              field: field,
              value: value,
              option: option
            }
          }));
        });
        break;
    }

    return createElement(_FormSchemaInput.default, {
      props: {
        field: field,
        value: value,
        input: input
      }
    }, children);
  }
};
exports.default = _default;

/***/ }),

/***/ "VRLf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

var _object = __webpack_require__("IhR4");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var props = _ref.props,
        slots = _ref.slots,
        listeners = _ref.listeners;
    var input = props.input,
        field = props.field,
        value = props.value,
        _props$name = props.name,
        name = _props$name === void 0 ? field.attrs.name : _props$name;
    var attrName = (0, _components.argName)(input);
    var data = (0, _object.assign)({}, input.data);
    data[attrName].name = name;
    data[attrName].value = _typeof(value) === 'object' ? value[name] : value;
    return createElement(input.element.component, data, slots().default);
  }
};
exports.default = _default;

/***/ }),

/***/ "jG8C":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var data = _ref.data,
        slots = _ref.slots;
    var slotsValue = slots();
    var buttonsWrapper = _components.components.buttonswrapper;

    if (slotsValue.default) {
      return createElement(buttonsWrapper.component, data, slotsValue.default);
    }

    return createElement(buttonsWrapper.component, [createElement(_components.components.submitbutton.component, data)]);
  }
};
exports.default = _default;

/***/ }),

/***/ "jQn/":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _components = __webpack_require__("A9B9");

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

var _default = {
  functional: true,
  render: function render(createElement, _ref) {
    var props = _ref.props;
    var option = props.option,
        value = props.value;
    var field = {
      label: option.label,
      attrs: {
        value: option.value,
        selected: _instanceof(value, Array) ? value.includes(option.value) : typeof value === 'undefined' ? option.selected || false : option.value === value
      }
    };
    var data = (0, _components.input)({
      field: field
    }).data;
    return createElement(_components.components.option.component, data, option.label);
  }
};
exports.default = _default;

/***/ }),

/***/ "qKzl":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable no-labels */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCommonFields = setCommonFields;
exports.loadFields = loadFields;
exports.parseBoolean = parseBoolean;
exports.parseString = parseString;
exports.parseItems = parseItems;
exports.arrayOrderedValues = arrayOrderedValues;
exports.arrayUnorderedValues = arrayUnorderedValues;
exports.singleValue = singleValue;
exports.parseArray = parseArray;
exports.setItemName = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ARRAY_KEYWORDS = ['anyOf', 'oneOf', 'enum'];

function setCommonFields(schema, field) {
  field.attrs.value = field.attrs.hasOwnProperty('value') ? field.attrs.value : schema.default || '';
  field.schemaType = schema.type;
  field.label = schema.title || '';
  field.description = schema.description || '';
  field.attrs.required = schema.required || false;
  field.attrs.disabled = schema.disabled || false;
}

function loadFields(schema, fields) {
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (!schema || schema.visible === false) {
    return;
  }

  switch (schema.type) {
    case 'object':
      for (var key in schema.properties) {
        if (schema.required) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = schema.required[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;
              schema.properties[field].required = true;
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        loadFields(schema.properties[key], fields, key);
      }

      break;

    case 'boolean':
      fields.push(parseBoolean(schema, name));
      break;

    case 'array':
      fields.push(parseArray(schema, name));
      break;

    case 'integer':
    case 'number':
    case 'string':
      for (var _i = 0; _i < ARRAY_KEYWORDS.length; _i++) {
        var keyword = ARRAY_KEYWORDS[_i];

        if (schema.hasOwnProperty(keyword)) {
          schema.items = {
            type: schema.type,
            enum: schema[keyword]
          };
          fields.push(parseArray(schema, name));
          return;
        }
      }

      fields.push(parseString(schema, name));
      break;
  }
}

function parseBoolean(schema) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var field = {
    attrs: schema.attrs || {}
  };
  setCommonFields(schema, field);

  if (!field.attrs.type) {
    field.attrs.type = 'checkbox';
  }

  if (!field.attrs.hasOwnProperty('checked')) {
    field.attrs.checked = schema.default === true;
  }

  delete field.attrs.value;

  if (name) {
    field.attrs.name = name;
  }

  return field;
}

function parseString(schema) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var field = {
    attrs: schema.attrs || {}
  };

  if (schema.pattern) {
    field.attrs.pattern = schema.pattern;
  }

  if (schema.format) {
    switch (schema.format) {
      case 'email':
        if (!field.attrs.type) {
          field.attrs.type = 'email';
        }

        break;

      case 'uri':
        if (!field.attrs.type) {
          field.attrs.type = 'url';
        }

        break;
    }
  }

  if (!field.attrs.type) {
    switch (schema.type) {
      case 'number':
      case 'integer':
        field.attrs.type = 'number';
        break;

      default:
        field.attrs.type = 'text';
    }
  }

  setCommonFields(schema, field);

  if (name) {
    field.attrs.name = name;
  }

  if (schema.minLength) {
    field.attrs.minlength = schema.minLength;
  }

  if (schema.maxLength) {
    field.attrs.maxlength = schema.maxLength;
  }

  return field;
}

function parseItems(items) {
  return items.map(function (item) {
    if (_typeof(item) !== 'object') {
      return {
        value: item,
        label: item
      };
    }

    return item;
  });
}

var setItemName = function setItemName(name) {
  var isRadio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (item, i) {
    if (isRadio) {
      item.name = name;
    }

    if (!item.name) {
      item.name = name ? "".concat(name, "-") : '';
      item.name += item.label.replace(/\s+/g, '-');
    }

    if (name) {
      item.ref = "".concat(name, "-").concat(i);
    }

    return item;
  };
};

exports.setItemName = setItemName;

function arrayOrderedValues(field) {
  return field.items.map(function (item) {
    return item.checked ? item.value : undefined;
  });
}

function arrayUnorderedValues(field) {
  return field.items.filter(function (item) {
    return item.checked || item.selected;
  }).map(function (item) {
    return item.value;
  });
}

function singleValue(field) {
  var item = field.items.reverse().find(function (item) {
    return item.checked || item.selected;
  });
  return item ? item.value : '';
}

function parseArray(schema) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var field = {
    attrs: schema.attrs || {}
  };
  setCommonFields(schema, field);

  if (name) {
    field.attrs.name = name;
  }

  field.items = [];
  field.minItems = parseInt(schema.minItems) || 1;
  field.maxItems = parseInt(schema.maxItems) || 1000;

  loop: for (var _i2 = 0; _i2 < ARRAY_KEYWORDS.length; _i2++) {
    var keyword = ARRAY_KEYWORDS[_i2];

    if (schema.hasOwnProperty(keyword)) {
      switch (keyword) {
        case 'enum':
          if (!field.attrs.type) {
            field.attrs.type = 'select';
          }

          field.items = parseItems(schema[keyword]);

          if (field.attrs.value.length === 0) {
            field.attrs.value = field.schemaType === 'array' ? arrayUnorderedValues(field) : singleValue(field);
          }

          break loop;

        case 'oneOf':
          field.attrs.type = 'radio';
          field.attrs.value = field.attrs.value || '';
          field.items = parseItems(schema[keyword]).map(setItemName(name, true));

          if (field.attrs.value.length === 0) {
            field.attrs.value = singleValue(field);
          }

          break loop;

        case 'anyOf':
          field.attrs.type = 'checkbox';
          field.attrs.value = field.attrs.value || [];
          field.items = parseItems(schema[keyword]).map(setItemName(name));
          field.isArrayField = true;

          if (field.attrs.value.length === 0) {
            field.attrs.value = arrayOrderedValues(field);
          }

          break loop;
      }
    }
  }

  if (!field.attrs.type) {
    field.isArrayField = true;
    field.attrs.type = 'text';
  } else if (field.attrs.type === 'select') {
    field.attrs.multiple = field.schemaType === 'array';
    field.attrs.value = field.attrs.value || field.attrs.multiple ? [] : '';

    if (field.attrs.value.length === 0) {
      if (field.attrs.multiple) {
        field.isArrayField = true;
        field.attrs.value = arrayUnorderedValues(field);
      } else {
        field.attrs.value = singleValue(field);
      }
    }
  }

  return field;
}

/***/ })

/******/ });
});
//# sourceMappingURL=FormSchemaNative.umd.js.map
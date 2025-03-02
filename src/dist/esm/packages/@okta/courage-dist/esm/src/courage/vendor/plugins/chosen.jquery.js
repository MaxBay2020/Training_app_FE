import $ from 'jquery';

(function () {
  var SelectParser;
  SelectParser = function () {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }
    SelectParser.prototype.add_node = function (child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };
    SelectParser.prototype.add_group = function (group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: group.label,
        children: 0,
        disabled: group.disabled
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };
    SelectParser.prototype.add_option = function (option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };
    return SelectParser;
  }();
  SelectParser.select_to_array = function (select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };
  this.SelectParser = SelectParser;
}).call($);
(function () {
  var AbstractChosen, root;
  root = this;
  AbstractChosen = function () {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.finish_setup();
    }
    AbstractChosen.prototype.set_default_values = function () {
      var _this = this;
      this.click_test_action = function (evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function (evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.result_single_selected = null;
      this.allow_single_deselect = this.options.allow_single_deselect != null && this.form_field.options[0] != null && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete || false;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      return this.inherit_select_classes = this.options.inherit_select_classes || false;
    };
    AbstractChosen.prototype.set_default_text = function () {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };
    AbstractChosen.prototype.mouse_enter = function () {
      return this.mouse_on_container = true;
    };
    AbstractChosen.prototype.mouse_leave = function () {
      return this.mouse_on_container = false;
    };
    AbstractChosen.prototype.input_focus = function (evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout(function () {
            return _this.container_mousedown();
          }, 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };
    AbstractChosen.prototype.input_blur = function (evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout(function () {
          return _this.blur_test();
        }, 100);
      }
    };
    AbstractChosen.prototype.result_add_option = function (option) {
      var classes, style;
      option.dom_id = this.container_id + "_o_" + option.array_index;
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      style = option.style.cssText !== "" && option.style !== "" ? " style=\"" + option.style + "\"" : "";
      return "<li id=\"" + option.dom_id + "\" class=\"" + classes.join(" ") + "\"" + style + ">" + option.html + "</li>";
    };
    AbstractChosen.prototype.results_update_field = function () {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.result_single_selected = null;
      return this.results_build();
    };
    AbstractChosen.prototype.results_toggle = function () {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.results_search = function (evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.choices_count = function () {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };
    AbstractChosen.prototype.choices_click = function (evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };
    AbstractChosen.prototype.keyup_checker = function (evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };
    AbstractChosen.prototype.generate_field_id = function () {
      var new_id;
      new_id = this.generate_random_id();
      this.form_field.id = new_id;
      return new_id;
    };
    AbstractChosen.prototype.generate_random_char = function () {
      var chars, rand;
      chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      rand = Math.floor(Math.random() * chars.length);
      return chars.substring(rand, rand + 1);
    };
    AbstractChosen.prototype.container_width = function () {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };
    AbstractChosen.browser_is_supported = function () {
      var _ref;
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return null !== (_ref = document.documentMode) && _ref >= 8;
      }
      return true;
    };
    AbstractChosen.default_multiple_text = "Select Some Options";
    AbstractChosen.default_single_text = "Select an Option";
    AbstractChosen.default_no_result_text = "No results match";
    return AbstractChosen;
  }();
  root.AbstractChosen = AbstractChosen;
}).call($);
(function () {
  var $$1,
    Chosen,
    root,
    _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function (child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    };
  root = this;
  var AbstractChosen = root.AbstractChosen;
  $$1 = $;
  $$1.fn.extend({
    chosen: function (options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function (input_field) {
        var $this;
        $this = $$1(this);
        if (!$this.hasClass("chzn-done")) {
          return $this.data("chosen", new Chosen(this, options));
        }
      });
    }
  });
  Chosen = function (_super) {
    __extends(Chosen, _super);
    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }
    Chosen.prototype.setup = function () {
      this.form_field_jq = $$1(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chzn-rtl");
    };
    Chosen.prototype.finish_setup = function () {
      return this.form_field_jq.addClass("chzn-done");
    };
    Chosen.prototype.set_up_html = function () {
      var container_classes, container_props;
      this.container_id = this.form_field.id.length ? this.form_field.id.replace(/[^\w]/g, "_") : this.generate_field_id();
      this.container_id += "_chzn";
      container_classes = ["chzn-container"];
      container_classes.push("chzn-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chzn-rtl");
      }
      container_props = {
        "id": this.container_id,
        "class": container_classes.join(" "),
        "title": this.form_field.title
      };
      this.container = $$1("<div></div>", container_props);
      this.container[0].style.width = this.container_width();
      if (this.is_multiple) {
        this.container.html("<ul class=\"chzn-choices\"><li class=\"search-field\"><input type=\"text\" value=\"" + this.default_text + "\" class=\"default\" autocomplete=\"off\" style=\"width:25px;\" /></li></ul><div class=\"chzn-drop\"><ul class=\"chzn-results\"></ul></div>");
      } else {
        this.container.html("<a href=\"#\" class=\"chzn-single chzn-default\" tabindex=\"-1\"><span>" + this.default_text + "</span><div><b></b></div></a><div class=\"chzn-drop\"><div class=\"chzn-search\"><input type=\"text\" autocomplete=\"off\" /></div><ul class=\"chzn-results\"></ul></div>");
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find("div.chzn-drop").first();
      this.search_field = this.container.find("input").first();
      this.search_results = this.container.find("ul.chzn-results").first();
      this.search_field_scale();
      this.search_no_results = this.container.find("li.no-results").first();
      if (this.is_multiple) {
        this.search_choices = this.container.find("ul.chzn-choices").first();
        this.search_container = this.container.find("li.search-field").first();
      } else {
        this.search_container = this.container.find("div.chzn-search").first();
        this.selected_item = this.container.find(".chzn-single").first();
      }
      this.results_build();
      this.set_tab_index();
      this.set_label_behavior();
      return this.form_field_jq.trigger("liszt:ready", {
        chosen: this
      });
    };
    Chosen.prototype.register_observers = function () {
      var _this = this;
      this.container.mousedown(function (evt) {
        _this.container_mousedown(evt);
      });
      this.container.mouseup(function (evt) {
        _this.container_mouseup(evt);
      });
      this.container.mouseenter(function (evt) {
        _this.mouse_enter(evt);
      });
      this.container.mouseleave(function (evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.mouseup(function (evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.mouseover(function (evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.mouseout(function (evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind("mousewheel DOMMouseScroll", function (evt) {
        _this.search_results_mousewheel(evt);
      });
      this.form_field_jq.bind("liszt:updated", function (evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("liszt:activate", function (evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("liszt:open", function (evt) {
        _this.container_mousedown(evt);
      });
      this.search_field.blur(function (evt) {
        _this.input_blur(evt);
      });
      this.search_field.keyup(function (evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.keydown(function (evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.focus(function (evt) {
        _this.input_focus(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.click(function (evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.click(function (evt) {
          evt.preventDefault();
        });
      }
    };
    Chosen.prototype.search_field_disabled = function () {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass("chzn-disabled");
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass("chzn-disabled");
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus", this.activate_action);
        }
      }
    };
    Chosen.prototype.container_mousedown = function (evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!(evt != null && $$1(evt.target).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $$1(document).click(this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && ($$1(evt.target)[0] === this.selected_item[0] || $$1(evt.target).parents("a.chzn-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };
    Chosen.prototype.container_mouseup = function (evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };
    Chosen.prototype.search_results_mousewheel = function (evt) {
      var delta, _ref1, _ref2;
      delta = -((_ref1 = evt.originalEvent) != null ? _ref1.wheelDelta : void 0) || ((_ref2 = evt.originialEvent) != null ? _ref2.detail : void 0);
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === "DOMMouseScroll") {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };
    Chosen.prototype.blur_test = function (evt) {
      if (!this.active_field && this.container.hasClass("chzn-container-active")) {
        return this.close_field();
      }
    };
    Chosen.prototype.close_field = function () {
      $$1(document).unbind("click", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chzn-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };
    Chosen.prototype.activate_field = function () {
      this.container.addClass("chzn-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };
    Chosen.prototype.test_active_click = function (evt) {
      if ($$1(evt.target).parents("#" + this.container_id).length) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };
    Chosen.prototype.results_build = function () {
      var content, data, _i, _len, _ref1;
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = root.SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.selected_item.addClass("chzn-default").find("span").text(this.default_text);
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chzn-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chzn-container-single-nosearch");
        }
      }
      content = "";
      _ref1 = this.results_data;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        data = _ref1[_i];
        if (data.group) {
          content += this.result_add_group(data);
        } else if (!data.empty) {
          content += this.result_add_option(data);
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.selected_item.removeClass("chzn-default").find("span").text(data.text);
            if (this.allow_single_deselect) {
              this.single_deselect_control_build();
            }
          }
        }
      }
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      this.search_results.html(content);
      return this.parsing = false;
    };
    Chosen.prototype.result_add_group = function (group) {
      group.dom_id = this.container_id + "_g_" + group.array_index;
      return "<li id=\"" + group.dom_id + "\" class=\"group-result\">" + $$1("<div></div>").text(group.label).html() + "</li>";
    };
    Chosen.prototype.result_do_highlight = function (el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop(high_bottom - maxHeight > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };
    Chosen.prototype.result_clear_highlight = function () {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };
    Chosen.prototype.results_show = function () {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("liszt:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chzn-with-drop");
      this.form_field_jq.trigger("liszt:showing_dropdown", {
        chosen: this
      });
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      return this.winnow_results();
    };
    Chosen.prototype.results_hide = function () {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chzn-with-drop");
        this.form_field_jq.trigger("liszt:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };
    Chosen.prototype.set_tab_index = function (el) {
      var ti;
      if (this.form_field_jq.attr("tabindex")) {
        ti = this.form_field_jq.attr("tabindex");
        this.form_field_jq.attr("tabindex", -1);
        return this.search_field.attr("tabindex", ti);
      }
    };
    Chosen.prototype.set_label_behavior = function () {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $$1("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.click(function (evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };
    Chosen.prototype.show_search_field_default = function () {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };
    Chosen.prototype.search_results_mouseup = function (evt) {
      var target;
      target = $$1(evt.target).hasClass("active-result") ? $$1(evt.target) : $$1(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };
    Chosen.prototype.search_results_mouseover = function (evt) {
      var target;
      target = $$1(evt.target).hasClass("active-result") ? $$1(evt.target) : $$1(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };
    Chosen.prototype.search_results_mouseout = function (evt) {
      if ($$1(evt.target).hasClass("active-result")) {
        return this.result_clear_highlight();
      }
    };
    Chosen.prototype.choice_build = function (item) {
      var choice,
        close_link,
        _this = this;
      choice = $$1("<li></li>", {
        "class": "search-choice"
      }).html("<span>" + item.html + "</span>");
      if (item.disabled) {
        choice.addClass("search-choice-disabled");
      } else {
        close_link = $$1("<a></a>", {
          href: "#",
          "class": "search-choice-close",
          rel: item.array_index
        });
        close_link.click(function (evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };
    Chosen.prototype.choice_destroy_link_click = function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($$1(evt.target));
      }
    };
    Chosen.prototype.choice_destroy = function (link) {
      if (this.result_deselect(link.attr("rel"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents("li").first().remove();
        return this.search_field_scale();
      }
    };
    Chosen.prototype.results_reset = function () {
      this.form_field.options[0].selected = true;
      this.selected_option_count = null;
      this.selected_item.find("span").text(this.default_text);
      if (!this.is_multiple) {
        this.selected_item.addClass("chzn-default");
      }
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };
    Chosen.prototype.results_reset_cleanup = function () {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };
    Chosen.prototype.result_select = function (evt) {
      var high, high_id, item, position;
      if (this.result_highlight) {
        high = this.result_highlight;
        high_id = high.attr("id");
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("liszt:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.search_results.find(".result-selected").removeClass("result-selected");
          this.result_single_selected = high;
          this.selected_item.removeClass("chzn-default");
        }
        high.addClass("result-selected");
        position = high_id.substr(high_id.lastIndexOf("_") + 1);
        item = this.results_data[position];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.selected_item.find("span").first().text(item.text);
          if (this.allow_single_deselect) {
            this.single_deselect_control_build();
          }
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.search_field.val("");
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            "selected": this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        return this.search_field_scale();
      }
    };
    Chosen.prototype.result_activate = function (el, option) {
      if (option.disabled) {
        return el.addClass("disabled-result");
      } else if (this.is_multiple && option.selected) {
        return el.addClass("result-selected");
      } else {
        return el.addClass("active-result");
      }
    };
    Chosen.prototype.result_deactivate = function (el) {
      return el.removeClass("active-result result-selected disabled-result");
    };
    Chosen.prototype.result_deselect = function (pos) {
      var result, result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        result = $$1("#" + this.container_id + "_o_" + pos);
        result.removeClass("result-selected").addClass("active-result").show();
        this.result_clear_highlight();
        this.winnow_results();
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };
    Chosen.prototype.single_deselect_control_build = function () {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chzn-single-with-deselect");
    };
    Chosen.prototype.winnow_results = function () {
      var found, option, part, parts, regex, regexAnchor, result, result_id, results, searchText, startpos, text, zregex, _i, _j, _len, _len1, _ref1;
      this.no_results_clear();
      results = 0;
      searchText = this.search_field.val() === this.default_text ? "" : $$1("<div></div>").text($$1.trim(this.search_field.val())).html();
      regexAnchor = this.search_contains ? "" : "^";
      regex = new RegExp(regexAnchor + searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      zregex = new RegExp(searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");
      _ref1 = this.results_data;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        if (!option.empty) {
          if (option.group) {
            $$1("#" + option.dom_id).css("display", "none");
          } else {
            found = false;
            result_id = option.dom_id;
            result = $$1("#" + result_id);
            if (regex.test(option.html)) {
              found = true;
              results += 1;
            } else if (this.enable_split_word_search && (option.html.indexOf(" ") >= 0 || option.html.indexOf("[") === 0)) {
              parts = option.html.replace(/\[|\]/g, "").split(" ");
              if (parts.length) {
                for (_j = 0, _len1 = parts.length; _j < _len1; _j++) {
                  part = parts[_j];
                  if (regex.test(part)) {
                    found = true;
                    results += 1;
                  }
                }
              }
            }
            if (found) {
              if (searchText.length) {
                startpos = option.html.search(zregex);
                text = option.html.substr(0, startpos + searchText.length) + "</em>" + option.html.substr(startpos + searchText.length);
                text = text.substr(0, startpos) + "<em>" + text.substr(startpos);
              } else {
                text = option.html;
              }
              result.html(text);
              this.result_activate(result, option);
              if (option.group_array_index != null) {
                $$1("#" + this.results_data[option.group_array_index].dom_id).css("display", "list-item");
              }
            } else {
              if (this.result_highlight && result_id === this.result_highlight.attr("id")) {
                this.result_clear_highlight();
              }
              this.result_deactivate(result);
            }
          }
        }
      }
      if (results < 1 && searchText.length) {
        return this.no_results(searchText);
      } else {
        return this.winnow_results_set_highlight();
      }
    };
    Chosen.prototype.winnow_results_set_highlight = function () {
      var do_high, selected_results;
      if (!this.result_highlight) {
        selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
        do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
        if (do_high != null) {
          return this.result_do_highlight(do_high);
        }
      }
    };
    Chosen.prototype.no_results = function (terms) {
      var no_results_html;
      no_results_html = $$1("<li class=\"no-results\">" + this.results_none_found + " \"<span></span>\"</li>");
      no_results_html.find("span").first().html(terms);
      return this.search_results.append(no_results_html);
    };
    Chosen.prototype.no_results_clear = function () {
      return this.search_results.find(".no-results").remove();
    };
    Chosen.prototype.keydown_arrow = function () {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };
    Chosen.prototype.keyup_arrow = function () {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };
    Chosen.prototype.keydown_backstroke = function () {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };
    Chosen.prototype.clear_backstroke = function () {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };
    Chosen.prototype.keydown_checker = function (evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          evt.preventDefault();
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };
    Chosen.prototype.search_field_scale = function () {
      var div, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ["font-size", "font-style", "font-weight", "font-family", "line-height", "text-transform", "letter-spacing"];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $$1("<div></div>", {
          "style": style_block
        });
        div.text(this.search_field.val());
        $$1("body").append(div);
        w = div.width() + 25;
        div.remove();
        if (!this.f_width) {
          this.f_width = this.container.outerWidth();
        }
        if (w > this.f_width - 10) {
          w = this.f_width - 10;
        }
        return this.search_field.css({
          "width": w + "px"
        });
      }
    };
    Chosen.prototype.generate_random_id = function () {
      var string;
      string = "sel" + this.generate_random_char() + this.generate_random_char() + this.generate_random_char();
      while ($$1("#" + string).length > 0) {
        string += this.generate_random_char();
      }
      return string;
    };
    return Chosen;
  }(AbstractChosen);
  root.Chosen = Chosen;
}).call($);
//# sourceMappingURL=chosen.jquery.js.map

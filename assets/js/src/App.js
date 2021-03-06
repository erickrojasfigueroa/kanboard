function App() {
    this.board = new Board(this);
    this.markdown = new Markdown();
    this.search = new Search(this);
    this.swimlane = new Swimlane(this);
    this.dropdown = new Dropdown();
    this.tooltip = new Tooltip(this);
    this.popover = new Popover(this);
    this.task = new Task(this);
    this.project = new Project();
    this.subtask = new Subtask(this);
    this.column = new Column(this);
    this.file = new FileUpload(this);
    this.accordion = new Accordion(this);
    this.keyboardShortcuts();
    this.task.keyboardShortcuts();
    this.chosen();
    this.poll();

    // Alert box fadeout
    $(".alert-fade-out").delay(5000).fadeOut(800, function() {
        $(this).remove();
    });
}

App.prototype.listen = function() {
    this.project.listen();
    this.popover.listen();
    this.markdown.listen();
    this.tooltip.listen();
    this.dropdown.listen();
    this.search.listen();
    this.task.listen();
    this.swimlane.listen();
    this.subtask.listen();
    this.column.listen();
    this.file.listen();
    this.accordion.listen();
    this.search.focus();
    this.autoComplete();
    this.datePicker();
    this.focus();
};

App.prototype.refresh = function() {
    $(document).off();
    this.listen();
};

App.prototype.focus = function() {

    // Autofocus fields (html5 autofocus works only with page onload)
    $("[autofocus]").each(function(index, element) {
        $(this).focus();
    })

    // Auto-select input fields
    $(document).on('focus', '.auto-select', function() {
        $(this).select();
    });

    // Workaround for chrome
    $(document).on('mouseup', '.auto-select', function(e) {
        e.preventDefault();
    });
};

App.prototype.poll = function() {
    window.setInterval(this.checkSession, 60000);
};

App.prototype.keyboardShortcuts = function() {
    var self = this;

    // Submit form
    Mousetrap.bindGlobal("mod+enter", function() {
        $("form").submit();
    });

    // Open board selector
    Mousetrap.bind("b", function(e) {
        e.preventDefault();
        $('#board-selector').trigger('chosen:open');
    });

    // Close popover and dropdown
    Mousetrap.bindGlobal("esc", function() {
        self.popover.close();
        self.dropdown.close();
    });

    // Show keyboard shortcut
    Mousetrap.bind("?", function() {
        self.popover.open($("body").data("keyboard-shortcut-url"));
    });
};

App.prototype.checkSession = function() {
    if (! $(".form-login").length) {
        $.ajax({
            cache: false,
            url: $("body").data("status-url"),
            statusCode: {
                401: function() {
                    window.location = $("body").data("login-url");
                }
            }
        });
    }
};

App.prototype.datePicker = function() {
    // Datepicker translation
    $.datepicker.setDefaults($.datepicker.regional[$("body").data("js-lang")]);

    // Datepicker
    $(".form-date").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'yy-mm-dd',
        constrainInput: false
    });

    // Datetime picker
    $(".form-datetime").datetimepicker({
        controlType: 'select',
        oneLine: true,
        dateFormat: 'yy-mm-dd',
        // timeFormat: 'h:mm tt',
        constrainInput: false
    });
};

App.prototype.autoComplete = function() {
    $(".autocomplete").each(function() {
        var input = $(this);
        var field = input.data("dst-field");
        var extraField = input.data("dst-extra-field");

        if ($('#form-' + field).val() == '') {
            input.parent().find("button[type=submit]").attr('disabled','disabled');
        }

        input.autocomplete({
            source: input.data("search-url"),
            minLength: 1,
            select: function(event, ui) {
                $("input[name=" + field + "]").val(ui.item.id);

                if (extraField) {
                    $("input[name=" + extraField + "]").val(ui.item[extraField]);
                }

                input.parent().find("button[type=submit]").removeAttr('disabled');
            }
        });
    });
};

App.prototype.chosen = function() {
    $(".chosen-select").each(function() {
        var searchThreshold = $(this).data("search-threshold");

        if (searchThreshold === undefined) {
            searchThreshold = 10;
        }

        $(this).chosen({
            width: "180px",
            no_results_text: $(this).data("notfound"),
            disable_search_threshold: searchThreshold
        });
    });

    $(".select-auto-redirect").change(function() {
        var regex = new RegExp($(this).data('redirect-regex'), 'g');
        window.location = $(this).data('redirect-url').replace(regex, $(this).val());
    });
};

App.prototype.showLoadingIcon = function() {
    $("body").append('<span id="app-loading-icon">&nbsp;<i class="fa fa-spinner fa-spin"></i></span>');
};

App.prototype.hideLoadingIcon = function() {
    $("#app-loading-icon").remove();
};

App.prototype.isVisible = function() {
    var property = "";

    if (typeof document.hidden !== "undefined") {
        property = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        property = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        property = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        property = "webkitVisibilityState";
    }

    if (property != "") {
        return document[property] == "visible";
    }

    return true;
};

App.prototype.formatDuration = function(d) {
    if (d >= 86400) {
        return Math.round(d/86400) + "d";
    }
    else if (d >= 3600) {
        return Math.round(d/3600) + "h";
    }
    else if (d >= 60) {
        return Math.round(d/60) + "m";
    }

    return d + "s";
};

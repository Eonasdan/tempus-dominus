class DateTimePicker
    constructor: (@input, options) ->
        {@pickDate, @pickTime, @format} = options
        @init()

    init: ->
        @hidden = $ "<input>", type: "hidden", name: @input.prop "name"
        @hidden.insertAfter @input

        @picker = $ "<div/>", class: "input-group date"
        @picker.insertAfter @input

        @input.appendTo @picker
        @input.addClass "form-control"
        @input.removeAttr "name"

        addon = $ "<span/>", class: "input-group-addon"
        addon.append $ "<span/>", class: "glyphicon glyphicon-calendar"
        addon.appendTo @picker

        @picker.on "dp.change", (e) =>
            @hidden.val e.date.toISOString()
            @notifyChange e.date

        @picker.on "dp.error", (e) =>
            @hidden.val ""
            @notifyChange null

        @picker.datetimepicker
            pickDate: @pickDate
            pickTime: @pickTime
            format: getFormat(@format, @pickDate, @pickTime)
            useStrict: true
            useCurrent: false
            defaultDate: @input.val()

    notifyChange: (moment) ->
        @input.trigger
            type: "meceap.datetimepicker.change"
            date: moment

    getDate: ->
        @picker.data("DateTimePicker").getDate()

    setDate: (isoDate) ->
        @picker.data("DateTimePicker").setDate(new Date(isoDate))

    getFormat = (format, pickDate, pickTime) ->
        return format if format

        if pickDate
            format = Catalog.getLocaleInformation().dateFormat.toUpperCase()

        if pickTime
            format += " " if format
            format += Catalog.getLocaleInformation().timeFormat.toLowerCase()
            format = format.replace("tt", "a")
            format = format.replace("hh", "HH") if format.indexOf("a") < 0

        format

# jQuery plugin

$.fn.extend
    medatetimepicker: (options)->
        defaults =
            pickDate: true
            pickTime: false
            format: null

        _isMethod = (typeof options is "string")
        _arguments = Array::slice.call(arguments, 1)

        _result = @
        @each ->
            obj = $(@).data "meceap.datetimepicker"

            return if (obj? and not _isMethod)

            if (_isMethod)
                _result = obj[options](_arguments...)
            else
                options = $.extend defaults, options
                $(@).data "meceap.datetimepicker", new DateTimePicker($(@), options)
        _result
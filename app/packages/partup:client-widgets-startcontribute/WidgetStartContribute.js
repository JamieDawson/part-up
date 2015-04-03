Template.WidgetStartContribute.helpers({
    'Partup': Partup,
    'partupActivities': function () {
        var partupId = Session.get('partials.start-partup.current-partup');
        return Activities.find({ partup_id: partupId }, {sort: { created_at: -1 }});
    },
    currentPartupId: function() {
        return Session.get('partials.start-partup.current-partup');
    }
});

Template.WidgetStartContribute.rendered = function () {
    //
};
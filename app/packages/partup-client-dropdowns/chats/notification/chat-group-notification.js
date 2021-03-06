Template.ChatGroupNotification.helpers({
    notificationName: function() {
        return 'notification_' + this.notification.type;
    },
    chat: function() {
        return Template.instance().data.chat;
    },
    network: function() {
        return Networks.findOne({chat_id: Template.instance().data.chat._id});
    },
    formatted: function(content) {
        return new Partup.client.message(content)
            .sanitize()
            .parseMentions({link: false})
            .emojify()
            .getContent();
    }
});

Template.ChatGroupNotification.events({
    'click [href]': function(event) {
        Partup.client.browser.onMobileOs(function() {
            event.preventDefault();
            var appStoreLink = Partup.client.browser.getAppStoreLink();
            window.open(appStoreLink, '_blank');
        });
    },
    'click [data-notification]': function(event, template) {
        var notificationId = $(event.currentTarget).data('notification');
        template.data.onClick();
    }
});

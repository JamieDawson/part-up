Template.Bubble.onCreated(function() {
    this.randomInt = lodash.random(0, 36);
    this.show = new ReactiveVar(false);
});
Template.Bubble.onRendered(function() {
    var template = this;
    Meteor.setTimeout(function() { template.show.set(true); }, 500);
});

Template.Bubble.events({
    'transitionend [data-transition], transitioncancel [data-transition]': function(event, template) {
        this.animation.set({
            animateX: lodash.random(-1,1),
            animateY: lodash.random(-1,1),
            time: lodash.random(8, 16)
        });
    }
});

Template.Bubble.helpers({
    data: function() {
        var template = Template.instance();
        return {
            randomInt: function() {
                return 36;
            },
            image: function() {
                return this.image;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            show: function() {
                return template.show.get();
            },
            type: function() {
                return template.data.type;
            }
        };
    }
});


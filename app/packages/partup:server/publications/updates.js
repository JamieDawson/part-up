Meteor.publishComposite('updates.one', function(updateId) {
    return {
        find: function() {
            return Updates.find({_id: updateId});
        },
        children: [
            {
                find: function(update) {
                    return Meteor.users.findSinglePublicProfile(update.upper_id);
                },
                children: [
                    {
                        find: function(user) {
                            return Images.find({_id: user.profile.image}, {limit: 1});
                        }
                    }
                ]
            },
            {
                find: function(update) {
                    var images = [];

                    if (update.type === 'partups_image_changed') {
                        images = [update.type_data.old_image, update.type_data.new_image];
                    }

                    if (update.type === 'partups_message_added') {
                        images = update.type_data.images;
                    }

                    return Images.find({_id: {$in: images}});
                }
            }
        ]
    };
});

/**
 * Publish all required data for updates in a part-up
 *
 * This subscription will first check if the current user is allowed to view the
 * requested part-up. If so, the client will be allowed access to:
 *
 * - The part-up
 * - Updates, filtered by given options and related:
 *   - Activities
 *   - Contributions
 *   - Images
 *   - Additionally, any update type will also be extended with any type of
 *     addtitional related information such as users and their profile pictures
 *
 * @param {String} partupId - The part-up's id
 * @param {Object} options  - Possible filtering options for updates
 */
Meteor.publishComposite('updates.from_partup', function(partupId, options) {
    var self = this;

    return {
        // Use guarded find to check if current user has access to the part-up
        find: function() {
            return Partups.guardedFind(self.userId, {_id: partupId}, {limit:1});
        },
        children: [
            {
                // Find all updates, filtered by given options
                find: function(partup) {
                    return Updates.findForUpdates(partup._id, options);
                },
                children: [
                    {
                        // Find the user related to the update, along with their profile picture
                        find: function(update) {
                            return Meteor.users.findSinglePublicProfile(update.upper_id);
                        },
                        children: [
                            {
                                find: function(user) {
                                    return Images.find({_id: user.profile.image}, {limit: 1});
                                }
                            }
                        ]
                    },
                    {
                        // Find any images required for the update
                        find: function(update) {
                            var images = [];

                            if (update.type === 'partups_image_changed') {
                                images = [update.type_data.old_image, update.type_data.new_image];
                            }

                            if (update.type === 'partups_message_added') {
                                images = update.type_data.images;
                            }

                            return Images.find({_id: {$in: images}});
                        }
                    },
                    {
                        // Find activity related to the update
                        find: function(update) {
                            if (update.isActivityUpdate()) {
                                return Activities.find({_id: update.type_data.activity_id}, {limit: 1});
                            }
                        }
                    },
                    {
                        // Find contribution related to the update
                        find: function(update) {
                            if (update.isContributionUpdate()) {
                                return Contributions.find({_id: update.type_data.contribution_id}, {limit: 1});
                            }
                        },
                        children: [
                            // Backtrack and find the contribution's activity as well
                            {
                                find: function(contribution) {
                                    return Activities.find({_id: contribution.activity_id}, {limit: 1});
                                }
                            },

                            // Find ratings associated with the contribution
                            {
                                find: function(contribution) {
                                    return Ratings.find({contribution_id: contribution._id});
                                },
                                children: [
                                    // Find user associated with the rating, and their profile picture
                                    {
                                        find: function(rating) {
                                            return Meteor.users.findSinglePublicProfile(rating.upper_id);
                                        },
                                        children: [
                                            {
                                                find: function(user) {
                                                    return Images.find({_id: user.profile.image}, {limit: 1});
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
});

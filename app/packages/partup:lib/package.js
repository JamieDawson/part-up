Package.describe({
    name: 'partup:lib',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'aldeed:simple-schema',
        'aldeed:autoform',
        'comerc:autoform-fixtures',
        'mongo',
        'chrismbeckett:toastr'
    ]);

    api.addFiles([
        'namespace.js',
        'collections/partups.js',
        'collections/activities.js',
        'collections/notifications.js',
        'schemas/partup.js',
        'schemas/activity.js',
        'schemas/update.js',
        'schemas/tag.js',
        'schemas/network.js',
        'services/placeholder.js',
        'services/partup.js',
        'transformers/partup.js',
        'collections/fixtures.js'
    ]);

    api.addFiles([
        'notify/notify.js',
        'ui/dropdown.js'
    ], 'client');

    api.addFiles([
        'publications/notifications.js',
        'publications/partups.js'
    ], 'server');

    // Namespace
    api.export('Partup');

    // Collections
    api.export('Partups');
    api.export('Activities');
    api.export('Notifications');
});

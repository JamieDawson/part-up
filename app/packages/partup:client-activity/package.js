Package.describe({
    name: 'partup:client-activity',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n',
        'partup:lib'
    ], ['client', 'server']);

    api.use([
        'templating',
        'aldeed:autoform',
        'reactive-var',
        'reactive-dict'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',

        'Activity.html',
        'Activity.js',
        'templates/ActivityForm.html',
        'templates/ActivityForm.js',
        'templates/ActivityView.html',
        'templates/ActivityView.js',
        'templates/ActivityFormPlaceholders.js',

        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        'i18n/en.i18n.json',
        'i18n/nl.i18n.json'
    ], 'server');
});

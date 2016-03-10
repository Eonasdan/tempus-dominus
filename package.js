Package.describe({
  name: 'eonasdan:bootstrap-datetimepicker',
  version: '4.17.37',
  summary: 'Date/time picker widget based on twitter bootstrap',
  git: 'https://github.com/rgnevashev/bootstrap-datetimepicker',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.addFiles([
    "build/css/bootstrap-datetimepicker.min.css",
    "build/js/bootstrap-datetimepicker.min.js"
  ], 'client');
});

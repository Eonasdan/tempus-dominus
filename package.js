Package.describe({
  name: 'eonasdan:bootstrap-datetimepicker',
  version: '4.17.37',
  summary: 'Date/time picker widget based on twitter bootstrap',
  git: 'https://github.com/rgnevashev/bootstrap-datetimepicker.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use(['momentjs:moment@2.5.0','jquery@1.11.4']);
  api.addFiles([
    "build/css/bootstrap-datetimepicker.min.css",
    "build/js/bootstrap-datetimepicker.min.js"
  ], 'client');
});

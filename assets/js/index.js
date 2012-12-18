$(function() {
  $('#datetimepicker').datetimepicker({
    format: 'MM/dd/yyyy hh:mm',
    language: 'en',
    pickDate: true,
    pickTime: true,
    hourStep: 1,
    minuteStep: 15,
    secondStep: 30
  });
});

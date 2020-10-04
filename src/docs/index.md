#Bootstrap 3 Datepicker v4 Docs
<div class="container-fluid">
<div class="row center-block">
   <h3>Get awesome Dashboard Templates</h3>
   <p>Looking for a template with the datepicker ready to go? Then get check out these templates from our partners.</p>
</div>
<div class="row center-block">
   <h3>Creative Tim</h3>
   <div class="col-sm-12 col-md-3">
      <a href="https://www.creative-tim.com/product/material-dashboard-pro-bs3?partner=127205 " target="_blank" class="affiliate-project">
      Material Dashboard Pro
      <img src="https://s3.amazonaws.com/creativetim_bucket/products/78/original/opt_mdp_thumbnail.jpg?1521133551" alt="Material Dashboard Pro" class="img-responsive">
      </a>
   </div>
   <div class="col-sm-12 col-md-3">
      <a href="https://www.creative-tim.com/product/material-dashboard-pro-angular2?partner=127205 " target="_blank" class="affiliate-project">
      Gaia Bootstrap Template Pro
      <img src="https://s3.amazonaws.com/creativetim_bucket/products/44/original/opt_gbtp_thumbnail.jpg?1462984704" alt="Material Dashboard Pro Angular" class="img-responsive">
      </a>
   </div>
   <div class="col-sm-12 col-md-3">
      <a href="https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react?partner=127205 " target="_blank" class="affiliate-project">
      Light Bootstrap Dashboard PRO React
      <img src="https://s3.amazonaws.com/creativetim_bucket/products/66/original/opt_lbdp_react_thumbnail.jpg" alt="Light Bootstrap Dashboard PRO React" class="img-responsive">
      </a>
   </div>
</div>
<div class="row center-block">
   <h3>Flatlogic</h3>
   <div class="col-sm-12 col-md-3">
      <a href="https://flatlogic.com/templates/light-blue-html5?ref=dg1K3bfa8w" target="_blank" class="affiliate-project">
      Light Blue Html5
      <img src="https://flatlogic.com/assets/templates/lb_html_full-798d1587249f7f3d65c6f8d9a11b2489daa042b4d46c377fac0573575a663f31.webp" alt="Light Blue Vue Admin" class="img-responsive">
      </a>
   </div>
   <div class="col-sm-12 col-md-3">
      <a href="https://flatlogic.com/templates/sing-app-html5?ref=dg1K3bfa8w" target="_blank" class="affiliate-project">
      Sing App Html5
      <img src="https://flatlogic.com/assets/templates/sing_html5_full-94fa15f9a342fdf7256976aef8ed5ade80ef396c754781cfa764e2cc4e9e0eea.webp" alt=" Sing App Angular Node.js" class="img-responsive">
      </a>
   </div>
   <div class="col-sm-12 col-md-3">
      <a href="https://flatlogic.com/templates/one-bootstrap-template?ref=dg1K3bfa8w" target="_blank" class="affiliate-project">
      Flatlogic One Bootstrap Template
      <img src="https://flatlogic.com/assets/templates/one_bootstrap_full-afead8dd8432ed7fd0a81ad3a75aadc06d008998570c0fd78e5bbe20740812f9.webp" alt="Light Sing App Vue" class="img-responsive">
      </a>
   </div>
</div>
</div>
<hr/>
<div class="alert alert-info">
   <strong>Note</strong>
   All functions are accessed via the <code>data</code> attribute e.g. <code>$('#datetimepicker').data("DateTimePicker").FUNCTION()</code>
</div>
### Minimum Setup
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker1'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker1').datetimepicker();
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker1'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker1').datetimepicker();
         });
      </script>
   </div>
</div>
```
----------------------
### Using Locales
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker2'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker2').datetimepicker({
                 locale: 'ru'
             });
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker2'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker2').datetimepicker({
                 locale: 'ru'
             });
         });
      </script>
   </div>
</div>
```
----------------------
### Time Only
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker3'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-time"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker3').datetimepicker({
                 format: 'LT'
             });
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker3'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-time"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker3').datetimepicker({
                 format: 'LT'
             });
         });
      </script>
   </div>
</div>
```
----------------------
### Date Only
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker3'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-time"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker3').datetimepicker({
                 format: 'L'
             });
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker3'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-time"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker3').datetimepicker({
                 format: 'LT'
             });
         });
      </script>
   </div>
</div>
```
----------------------
### No Icon (input field only):
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <input type='text' class="form-control" id='datetimepicker4' />
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker4').datetimepicker();
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <input type='text' class="form-control" id='datetimepicker4' />
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker4').datetimepicker();
         });
      </script>
   </div>
</div>
```
----------------------
### Enabled/Disabled Dates
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker5'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker5').datetimepicker({
                 defaultDate: "11/1/2013",
                 disabledDates: [
                     moment("12/25/2013"),
                     new Date(2013, 11 - 1, 21),
                     "11/22/2013 00:53"
                 ]
             });
         });
      </script>
   </div>
</div>
#### Code
```
<div class="container">
   <div class="row">
      <div class='col-sm-6'>
         <div class="form-group">
            <div class='input-group date' id='datetimepicker5'>
               <input type='text' class="form-control" />
               <span class="input-group-addon">
               <span class="glyphicon glyphicon-calendar"></span>
               </span>
            </div>
         </div>
      </div>
      <script type="text/javascript">
         $(function () {
             $('#datetimepicker5').datetimepicker({
                 defaultDate: "11/1/2013",
                 disabledDates: [
                     moment("12/25/2013"),
                     new Date(2013, 11 - 1, 21),
                     "11/22/2013 00:53"
                 ]
             });
         });
      </script>
   </div>
</div>
```
----------------------
### Linked Pickers
<div class="container">
   <div class='col-md-5'>
      <div class="form-group">
         <div class='input-group date' id='datetimepicker6'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
            </span>
         </div>
      </div>
   </div>
   <div class='col-md-5'>
      <div class="form-group">
         <div class='input-group date' id='datetimepicker7'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
            </span>
         </div>
      </div>
   </div>
</div>
<script type="text/javascript">
   $(function () {
       $('#datetimepicker6').datetimepicker();
       $('#datetimepicker7').datetimepicker({
   useCurrent: false
   });
       $("#datetimepicker6").on("dp.change", function (e) {
           $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
       });
       $("#datetimepicker7").on("dp.change", function (e) {
           $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
       });
   });
</script>
#### Code
```
<div class="container">
   <div class='col-md-5'>
      <div class="form-group">
         <div class='input-group date' id='datetimepicker6'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
            </span>
         </div>
      </div>
   </div>
   <div class='col-md-5'>
      <div class="form-group">
         <div class='input-group date' id='datetimepicker7'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
            </span>
         </div>
      </div>
   </div>
</div>
<script type="text/javascript">
   $(function () {
       $('#datetimepicker6').datetimepicker();
       $('#datetimepicker7').datetimepicker({
   useCurrent: false //Important! See issue #1075
   });
       $("#datetimepicker6").on("dp.change", function (e) {
           $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
       });
       $("#datetimepicker7").on("dp.change", function (e) {
           $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
       });
   });
</script>
```
----------------------
### Custom Icons
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker8'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="fa fa-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker8').datetimepicker({
              icons: {
                  time: "fa fa-clock-o",
                  date: "fa fa-calendar",
                  up: "fa fa-arrow-up",
                  down: "fa fa-arrow-down"
              }
          });
      });
   </script>
</div>
#### Code
```
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker8'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="fa fa-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker8').datetimepicker({
              icons: {
                  time: "fa fa-clock-o",
                  date: "fa fa-calendar",
                  up: "fa fa-arrow-up",
                  down: "fa fa-arrow-down"
              }
          });
      });
   </script>
</div>
```
----------------------
### View Mode
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker9'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker9').datetimepicker({
              viewMode: 'years'
          });
      });
   </script>
</div>
#### Code
```
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker9'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker9').datetimepicker({
              viewMode: 'years'
          });
      });
   </script>
</div>
```
----------------------
### Min View Mode
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker10'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker10').datetimepicker({
              viewMode: 'years',
              format: 'MM/YYYY'
          });
      });
   </script>
</div>
#### Code
```
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker10'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker10').datetimepicker({
              viewMode: 'years',
              format: 'MM/YYYY'
          });
      });
   </script>
</div>
```
----------------------
### Disabled Days of the Week
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker11'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker11').datetimepicker({
              daysOfWeekDisabled: [0, 6]
          });
      });
   </script>
</div>
#### Code
```
<div class="container">
   <div class="col-sm-6" style="height:130px;">
      <div class="form-group">
         <div class='input-group date' id='datetimepicker11'>
            <input type='text' class="form-control" />
            <span class="input-group-addon">
            <span class="glyphicon glyphicon-calendar">
            </span>
            </span>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker11').datetimepicker({
              daysOfWeekDisabled: [0, 6]
          });
      });
   </script>
</div>
```
----------------------
### Inline
<div style="overflow:hidden;">
   <div class="form-group">
      <div class="row">
         <div class="col-md-8">
            <div id="datetimepicker12"></div>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker12').datetimepicker({
              inline: true,
              sideBySide: true
          });
      });
   </script>
</div>
#### Code
```
<div style="overflow:hidden;">
   <div class="form-group">
      <div class="row">
         <div class="col-md-8">
            <div id="datetimepicker12"></div>
         </div>
      </div>
   </div>
   <script type="text/javascript">
      $(function () {
          $('#datetimepicker12').datetimepicker({
              inline: true,
              sideBySide: true
          });
      });
   </script>
</div>
```
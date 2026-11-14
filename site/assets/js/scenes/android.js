/* Scene: Android app development. A code editor beside an emulator showing a small booking app. */
(function () {
  var L = function (n, html, step, dl) { return '<div class="d-l t-type' + (dl ? ' dl' + dl : '') + '" data-show="' + step + '"><i>' + n + '</i><span>' + html + '</span></div>'; };
  var k = function (s) { return '<b class="k">' + s + '</b>'; }, s = function (x) { return '<b class="s">' + x + '</b>'; }, f = function (x) { return '<b class="f">' + x + '</b>'; };
  ALLAI.register({
    id: 'android',
    frame: '.d-phone@w',
    start: '.d-code',
    html: function (ui) {
      return ui.bar({ file: 'SalonBooking', app: 'Code editor and Android emulator', letter: 'A', ico: 'd-ico' }) +
        '<div class="a-tools"><span class="a-t a-t--txt d-tab d-tab--1" data-show="screens" data-sel="screens,form">ServicesScreen.kt</span><span class="a-t a-t--txt d-tab d-tab--2 dl1" data-show="screens" data-sel="form">BookingScreen.kt</span><span class="a-t a-t--txt d-tab dl2" data-show="screens">ConfirmScreen.kt</span><span class="a-grow"></span><span class="a-btn d-run" data-sel="run"><svg viewBox="0 0 12 12"><path d="M3.5 2v8l7-4z" fill="currentColor"/></svg>Run</span></div>' +
        '<div class="a-body">' +
          '<div class="a-main d-code"><div class="d-pane d-pane--1">' +
            L(1, k('@Composable') + ' ' + k('fun') + ' ' + f('ServicesScreen') + '() {', 'screens') +
            L(2, '  ' + f('ServiceRow') + '(' + s('"Braids"') + ', ' + s('"$25"') + ')', 'screens', 2) +
            L(3, '  ' + f('ServiceRow') + '(' + s('"Cut"') + ', ' + s('"$8"') + ')', 'screens', 3) +
            L(4, '  ' + f('ServiceRow') + '(' + s('"Nails"') + ', ' + s('"$12"') + ')', 'screens', 4) +
            L(5, '}', 'screens', 5) +
          '</div><div class="d-pane d-pane--2">' +
            L(1, k('@Composable') + ' ' + k('fun') + ' ' + f('BookingScreen') + '(service: Service) {', 'form') +
            L(2, '  ' + f('DateField') + '(label = ' + s('"Date"') + ')', 'form', 2) +
            L(3, '  ' + f('TimeField') + '(label = ' + s('"Time"') + ')', 'form', 3) +
            L(4, '  ' + f('TextField') + '(label = ' + s('"Your name"') + ')', 'form', 4) +
            L(5, '  ' + f('Button') + '(' + s('"Book"') + ') { ' + f('confirm') + '() }', 'form', 5) +
            L(6, '}', 'form', 6) +
          '</div><div class="d-term mono"><p data-show="run">> Installing on Pixel emulator</p><p class="dl3" data-show="run">> App running</p></div></div>' +
          '<div class="d-emu"><div class="d-phone"><div class="d-bar"><span>9:41</span><i></i></div><div class="d-screens">' +
            '<div class="d-sc d-sc--1"><h6>Glow Salon</h6><p>Choose a service</p><div class="d-row d-row--braids" data-sel="tap,fill"><b>Braids</b><span>$25</span></div><div class="d-row"><b>Cut</b><span>$8</span></div><div class="d-row"><b>Nails</b><span>$12</span></div></div>' +
            '<div class="d-sc d-sc--2"><h6>Book: Braids</h6><p>$25</p><label>Date<b class="d-in" data-type="fill">Sat 21 Nov</b></label><label>Time<b class="d-in" data-type="fill">10:00</b></label><label>Your name<b class="d-in" data-type="fill">Rudo</b></label><span class="d-book" data-sel="confirm">Book</span></div>' +
            '<div class="d-sc d-sc--3"><i class="d-okc"></i><h6>Booked</h6><p>Braids, Sat 21 Nov at 10:00</p><p class="d-small">Rudo, see you then.</p></div>' +
          '</div><div class="d-boot" data-hide="run"><span>Emulator ready</span></div></div></div>' +
        '</div>' +
        '<div class="a-status"><span>Kotlin</span><span>API 35</span><span class="a-grow"></span><span>Sample app: fictional business</span></div>';
    },
    steps: [
      { id: 'screens', label: 'Creating the app screens', cur: '.d-code', at: [.3, .2], click: true, d: 1600, frame: '.d-code' },
      { id: 'form', label: 'Building the booking form', cur: '.d-tab--2', click: true, d: 1700 },
      { id: 'run', label: 'Running the app in the emulator', cur: '.d-run', click: true, d: 1500, frame: '.d-phone@w' },
      { id: 'tap', label: 'Choosing a service', cur: '.d-row--braids', click: true, d: 1300 },
      { id: 'fill', label: 'Filling in the booking form', cur: '.d-sc--2', at: [.5, .5], click: true, d: 1700 },
      { id: 'confirm', label: 'Booking confirmed: app works end to end', cur: '.d-book', click: true, d: 1700 }
    ]
  });
})();

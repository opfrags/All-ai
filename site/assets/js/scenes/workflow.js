/* Scene: workflow automation. One example enquiry moves through four steps:
   form submission -> contact record -> prepared quote -> scheduled follow-up.
   Figures: 15 roof sheets x $30.00 = $450.00. 16 Nov 2026 is a Monday. */
ALLAI.register({
  id: 'workflow',
  frame: '.f-canvas',
  start: '.f-log',
  html: function (ui) {
    var node = function (n, id, title, sub, detail) {
      return '<div class="f-node f-node--' + n + '" data-on="' + id + '"><span class="f-n">' + n + '</span><b>' + title + '</b><span>' + sub + '</span><p data-show="' + id + '">' + detail + '</p><i class="f-tick" data-show="' + id + '"></i></div>';
    };
    return ui.bar({ file: 'Enquiry follow-up', app: 'Automation builder', letter: 'A', ico: 'f-ico' }) +
      '<div class="a-tools"><span class="a-t a-t--txt">Edit</span><span class="a-t a-t--txt">History</span><span class="a-grow"></span><span class="a-btn f-run" data-sel="trigger,done">Run with sample enquiry</span></div>' +
      '<div class="a-body"><div class="a-main f-canvas">' +
        '<div class="f-track"><i></i></div><div class="f-pkt"><span>Enquiry</span></div>' +
        '<div class="f-nodes">' +
          node(1, 'trigger', 'Form submission', 'When the enquiry form is sent', 'T. Moyo needs 15 roof sheets') +
          node(2, 'contact', 'Contact record', 'Save or update the contact', 'Saved: T. Moyo, new contact') +
          node(3, 'quote', 'Prepared quote', 'Build a draft from the price list', 'Q-0149: 15 x $30.00 = $450.00') +
          node(4, 'follow', 'Scheduled follow-up', 'Remind the owner', 'Mon 16 Nov, 09:00') +
        '</div>' +
        '<div class="f-log"><div class="a-h">Run log</div><div class="f-lines mono">' +
          '<p data-show="trigger">09:14:02  Form received</p><p data-show="contact">09:14:03  Contact saved</p><p data-show="quote">09:14:05  Quote Q-0149 drafted, not sent</p><p data-show="follow">09:14:06  Follow-up scheduled</p><p class="f-ok" data-show="done">Run complete: 4 of 4 steps. The quote waits for your OK.</p>' +
        '</div></div>' +
      '</div></div>' +
      '<div class="a-status"><span>Automation: on</span><span class="a-grow"></span><span>Sample enquiry: fictional person and business</span></div>';
  },
  steps: [
    { id: 'trigger', label: 'An enquiry form arrives', cur: '.f-run', click: true, d: 1500 },
    { id: 'contact', label: 'Saving the contact record', cur: '.f-node--2', at: [.5, .3], d: 1500 },
    { id: 'quote', label: 'Preparing a draft quote', cur: '.f-node--3', at: [.5, .3], d: 1600 },
    { id: 'follow', label: 'Scheduling the follow-up', cur: '.f-node--4', at: [.5, .3], d: 1500 },
    { id: 'done', label: 'Run complete: quote waits for your OK', cur: '.f-lines', at: [.5, .9], d: 1600 }
  ]
});

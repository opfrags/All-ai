/* Scene: customer support. A sample enquiry is answered from a fictional knowledge base.
   The scene ends at a reviewable draft: nothing is sent without the owner's OK.
   Figures: 20 bags x $11.50 = $230.00. */
ALLAI.register({
  id: 'support',
  frame: '.u-thread',
  start: '.u-list',
  html: function (ui) {
    return ui.bar({ file: 'Inbox', app: 'Customer inbox', letter: 'I', ico: 'u-ico' }) +
      '<div class="a-body">' +
        '<div class="a-side a-side--s u-list"><div class="a-h">Enquiries</div>' +
          '<div class="u-conv u-conv--1" data-sel="open"><b>Mrs Moyo</b><span>Do you deliver to Chitungwiza and how...</span></div>' +
          '<div class="u-conv"><b>T. Banda</b><span>Thanks, received.</span></div><div class="u-conv"><b>School bursar</b><span>Please resend the quote.</span></div>' +
        '</div>' +
        '<div class="a-main u-thread">' +
          '<div class="u-msg" data-show="open"><b>Mrs Moyo</b><p>Hi, do you deliver to Chitungwiza and how much is it? I need 20 bags of cement by Friday.</p></div>' +
          '<div class="u-draft" data-show="draft"><div class="u-dh"><span>Reply draft</span><span class="u-state"><em data-hide="review">Writing</em><em class="u-rdy" data-show="review">Ready for review</em></span></div>' +
            '<p data-type="draft">Hello Mrs Moyo. Yes, we deliver to Chitungwiza. Delivery is $50 per trip, and orders placed before 12:00 are delivered the next day. 20 bags of cement at $11.50 comes to $230.00. Shall I prepare a quote for you?</p>' +
            '<div class="u-used" data-show="cite"><span>Used:</span><i>Delivery areas</i><i>Delivery fees</i><i>Price list</i></div>' +
            '<div class="u-act" data-show="review"><span class="a-ok">Waiting for your OK to send</span><span class="a-btn a-btn--ghost">Edit</span><span class="a-btn">Approve</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="a-side a-side--r a-side--l u-kb"><div class="a-h">Knowledge base</div>' +
          '<div class="u-search" data-sel="kb,read"><span data-type="kb">delivery chitungwiza</span></div>' +
          '<div class="u-art u-art--1" data-sel="read,draft"><b>Delivery areas and fees</b><p><mark data-on="read">We deliver in Harare and to Chitungwiza.</mark> In town: $35 per trip. <mark data-on="read">Chitungwiza: $50 per trip.</mark></p></div>' +
          '<div class="u-art"><b>Delivery times</b><p><mark data-on="read">Orders before 12:00 are delivered the next day.</mark></p></div>' +
          '<div class="u-art u-art--dim"><b>Returns</b><p>Unopened goods within 7 days.</p></div>' +
        '</div>' +
      '</div>' +
      '<div class="a-status"><span>1 open enquiry</span><span class="a-grow"></span><span>Sample enquiry and fictional knowledge base</span></div>';
  },
  steps: [
    { id: 'open', label: 'Opening the customer enquiry', cur: '.u-conv--1', click: true, d: 1300 },
    { id: 'kb', label: 'Searching the knowledge base', cur: '.u-search', click: true, d: 1500, frame: 'full' },
    { id: 'read', label: 'Finding the delivery details', cur: '.u-art--1', click: true, d: 1500 },
    { id: 'draft', label: 'Drafting the reply', cur: '.u-thread', at: [.4, .62], click: true, d: 2600, frame: '.u-draft' },
    { id: 'cite', label: 'Noting which details were used', cur: '.u-used', at: [.4, .5], d: 1200 },
    { id: 'review', label: 'Draft ready: waiting for your OK', cur: '.u-act', at: [.2, .5], d: 1700 }
  ]
});

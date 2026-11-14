/* Scene: social content planning. One campaign becomes a week of draft posts in several formats.
   The schedule ends "ready for review": nothing is published without the owner's OK. */
(function () {
  var days = [['Mon', '16'], ['Tue', '17'], ['Wed', '18'], ['Thu', '19'], ['Fri', '20'], ['Sat', '21'], ['Sun', '22']];
  var posts = { 0: ['mon', 'sq', 'Back to school week starts today', 'Post'], 1: ['fill', 'st', 'Exercise books: 10 for $4.00', 'Story'], 2: ['fill', 'sq', 'Uniforms and school shoes in stock', 'Post'], 4: ['fill', 'tx', 'Two days left on school offers', 'Status'], 5: ['fill', 'sq', 'Thank you. Open Monday from 8am', 'Post'] };
  var cell = function (d, i) {
    var p = posts[i];
    return '<div class="s-day"><div class="s-dh"><b>' + d[0] + '</b><span>' + d[1] + '</span></div>' + (p ? '<div class="s-post s-post--' + p[1] + ' dl' + i + '" data-show="' + p[0] + '"' + (i === 0 ? ' data-sel="adapt,review"' : '') + '><i class="s-th">' + ALLAI.ui.media(['social-books', 'social-books', 'social-shoes', '', 'shop-front', 'shop-front'][i], '') + '</i><em>' + p[3] + '</em><p data-show="captions" class="dl' + i + '">' + p[2] + '</p><span class="s-badge"><u data-hide="review">Draft</u><u class="s-rdy" data-show="review">Ready</u></span></div>' : '') + '</div>';
  };
  ALLAI.register({
    id: 'social',
    frame: '.s-cal',
    start: '.s-brief',
    html: function (ui) {
      return ui.bar({ file: 'Back to school week', app: 'Content calendar', letter: 'C', ico: 's-ico' }) +
        '<div class="a-tools"><span class="a-t a-t--txt">Week of 16 Nov</span><span class="a-t a-t--txt s-t-fill" data-sel="fill,adapt">Plan week</span><span class="a-t a-t--txt s-t-adapt" data-sel="adapt,captions">Adapt formats</span><span class="a-grow"></span><span class="a-ok s-wait" data-show="review">5 posts waiting for your OK</span></div>' +
        '<div class="a-body">' +
          '<div class="a-side a-side--l s-brief"><div class="a-h">Campaign brief</div><div class="s-card" data-sel="brief,mon"><p>Back to school promotion, 16 to 22 Nov.</p><p>Exercise books 10 for $4.00.</p><p>Uniforms and shoes in stock.</p></div>' +
            '<div class="a-h">Master caption</div><div class="s-card s-master"><p data-type="brief">Back to school week at Kudu Stationers. Exercise books 10 for $4.00, uniforms and shoes in stock.</p></div>' +
            '<div class="a-h" data-show="adapt">One post, three formats</div><div class="s-fmts"><div class="s-fm s-fm--sq" data-show="adapt"><i></i><span>Square</span></div><div class="s-fm s-fm--st dl2" data-show="adapt"><i></i><span>Story</span></div><div class="s-fm s-fm--tx dl4" data-show="adapt"><i></i><span>Status</span></div></div>' +
          '</div>' +
          '<div class="a-main s-cal">' + days.map(cell).join('') + '</div>' +
        '</div>' +
        '<div class="a-status"><span>Drafts only: nothing is published without your OK</span><span class="a-grow"></span><span>Sample campaign: fictional business</span></div>';
    },
    steps: [
      { id: 'brief', label: 'Reading the campaign brief', cur: '.s-card', at: [.5, .5], click: true, d: 1800, frame: 'full' },
      { id: 'mon', label: 'Drafting the first post', cur: '.s-day', at: [.5, .4], click: true, d: 1300 },
      { id: 'fill', label: 'Filling the week', cur: '.s-t-fill', click: true, d: 1700, frame: '.s-cal' },
      { id: 'adapt', label: 'Adapting one post into three formats', cur: '.s-t-adapt', click: true, d: 1700, frame: 'full' },
      { id: 'captions', label: 'Writing the draft captions', cur: '.s-cal', at: [.5, .55], click: true, d: 1600, frame: '.s-cal' },
      { id: 'review', label: 'Schedule ready: waiting for your OK', cur: '.s-wait', d: 1700, frame: 'full' }
    ]
  });
})();

/*!
 * easy-docs.js
 * 
 * Copyright (c) 2014
 */

/* -----------------------------------------------------------------------------
 * easy-docs
 * ---------------------------------------------------------------------------*/

;(function () {

// Highlight.js
$('pre code').each(function(i, e) {
  hljs.highlightBlock(e);
});

// ScrollSpy
$('body').scrollspy({
  target: '.sidebar'
});

// Update ScrollSpy on Resize
$(window).resize(function() {
  $('body').scrollspy('refresh');
});

// Version select menu
var $versions = $('.version-select');
$versions.on('change', function () {
  window.location.href = $versions.val();
});

})();
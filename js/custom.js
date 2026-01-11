
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });

    $(window).on('scroll', function(){
      function isScrollIntoView(elem, index) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(window).height()*.5;
        if(elemBottom <= docViewBottom && elemTop >= docViewTop) {
          $(elem).addClass('active');
        }
        if(!(elemBottom <= docViewBottom)) {
          $(elem).removeClass('active');
        }
        var MainTimelineContainer = $('#vertical-scrollable-timeline')[0];
        var MainTimelineContainerBottom = MainTimelineContainer.getBoundingClientRect().bottom - $(window).height()*.5;
        $(MainTimelineContainer).find('.inner').css('height',MainTimelineContainerBottom+'px');
      }
      var timeline = $('#vertical-scrollable-timeline li');
      Array.from(timeline).forEach(isScrollIntoView);
    });
  
  })(window.jQuery);

  /* Horizontal gallery: auto-scroll, drag-to-scroll, next/prev, click-to-show overlay */
  (function () {
    var gallery = document.getElementById('horizontalGallery');
    if (!gallery) return;

    var isDown = false, startX, scrollLeft;
    gallery.addEventListener('pointerdown', function(e){
      isDown = true; gallery.setPointerCapture(e.pointerId);
      startX = e.pageX - gallery.offsetLeft; scrollLeft = gallery.scrollLeft;
      stopAutoScroll();
    });
    gallery.addEventListener('pointerup', function(e){ isDown = false; try{ gallery.releasePointerCapture(e.pointerId);}catch(e){} startAutoScroll(); });
    gallery.addEventListener('pointerleave', function(){ isDown = false; });
    gallery.addEventListener('pointermove', function(e){ if(!isDown) return; e.preventDefault(); var x = e.pageX - gallery.offsetLeft; var walk = (x - startX) * 1.2; gallery.scrollLeft = scrollLeft - walk; });

    // Auto-scroll management with single interval
    var autoScrollSpeed = 0.22; // pixels per tick (slower)
    var autoScrollIntervalId = null;
    function startAutoScroll(){
      if (autoScrollIntervalId) return;
      autoScrollIntervalId = setInterval(function(){
        if (isDown) return; // pause while dragging
        gallery.scrollLeft += autoScrollSpeed;
        if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 1) {
          gallery.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 16);
    }
    function stopAutoScroll(){ if (autoScrollIntervalId) { clearInterval(autoScrollIntervalId); autoScrollIntervalId = null; } }

    // Next / Prev buttons
    var next = document.getElementById('hg-next');
    var prev = document.getElementById('hg-prev');
    if (next) next.addEventListener('click', function(){ stopAutoScroll(); gallery.scrollBy({ left: gallery.clientWidth * 0.6, behavior: 'smooth' }); setTimeout(startAutoScroll, 800); });
    if (prev) prev.addEventListener('click', function(){ stopAutoScroll(); gallery.scrollBy({ left: -gallery.clientWidth * 0.6, behavior: 'smooth' }); setTimeout(startAutoScroll, 800); });

    // Click-to-show overlay description (toggle full overlay)
    gallery.querySelectorAll('.hg-item').forEach(function(item){
      var overlay = document.createElement('div');
      overlay.className = 'hg-overlay';
      overlay.innerHTML = '<div><h4>' + (item.querySelector('.hg-desc') && item.querySelector('.hg-desc').textContent || '') + '</h4></div>';
      item.appendChild(overlay);
      var btn = item.querySelector('.hg-desc');
      if (btn) btn.addEventListener('click', function(e){
        e.stopPropagation();
        var nowVisible = overlay.classList.toggle('visible');
        if (nowVisible) stopAutoScroll(); else startAutoScroll();
      });
      // hide overlay when clicking the item background
      item.addEventListener('click', function(e){ if (e.target === item) { overlay.classList.remove('visible'); startAutoScroll(); } });
    });

    // Pause auto-scroll on mouseenter over gallery or controls; resume on leave
    [next, prev, gallery].forEach(function(el){
      if(!el) return;
      el.addEventListener('mouseenter', function(){ stopAutoScroll(); });
      el.addEventListener('mouseleave', function(){ startAutoScroll(); });
    });

    // Start auto-scroll initially
    startAutoScroll();
  })();

  /* Navbar scroll handler: toggle .navbar-scrolled on all .navbar elements */
  (function () {
    try {
      var navbars = document.querySelectorAll('.navbar');
      if (!navbars || navbars.length === 0) return;

      function updateNavbars() {
        var y = window.scrollY || window.pageYOffset || 0;
        navbars.forEach(function (nav) {
          if (y > 20) nav.classList.add('navbar-scrolled'); else nav.classList.remove('navbar-scrolled');
        });
      }

      // init and listen
      updateNavbars();
      window.addEventListener('scroll', updateNavbars, { passive: true });
      window.addEventListener('resize', updateNavbars);
    } catch (e) { console && console.warn && console.warn('navbar scroll handler error', e); }
  })();

  // Shuffle static gallery images on load to create a random, but static, arrangement
  (function(){
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    // collect children into array
    var items = Array.from(grid.children);
    // Fisher-Yates shuffle
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
    }
    // re-append in shuffled order
    items.forEach(function(it){ grid.appendChild(it); });
  })();

  /* Lightbox: show full-size image on click */
  (function(){
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Tutup">&times;</button><img src="" alt="">';
    document.body.appendChild(overlay);

    var overlayImg = overlay.querySelector('img');
    var closeBtn = overlay.querySelector('.lightbox-close');

    grid.addEventListener('click', function(e){
      var clicked = e.target.closest('img');
      if (!clicked || !grid.contains(clicked)) return;
      overlayImg.src = clicked.getAttribute('src');
      overlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });

    function closeLightbox(){ overlay.classList.remove('visible'); overlayImg.src=''; document.body.style.overflow = ''; }

    closeBtn.addEventListener('click', function(e){ e.stopPropagation(); closeLightbox(); });
    overlay.addEventListener('click', function(e){ if (e.target === overlay) closeLightbox(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeLightbox(); });
  })();



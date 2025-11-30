window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

})

document.addEventListener('DOMContentLoaded', () => {
  const modal    = document.getElementById('gif-modal');
  const bg       = modal.querySelector('.modal-background');
  const closeBtn = modal.querySelector('.delete');
  const gifImg   = document.getElementById('modal-gif');
  const descPre  = document.getElementById('modal-desc');
  const main     = document.getElementById('main-content');

  // 打开弹窗：遍历所有带 data-gif-url 的 column
  document.querySelectorAll('[data-gif-url]').forEach(col => {
    col.addEventListener('click', async () => {
      // 1) 设置 gif
      const gifUrl = col.getAttribute('data-gif-url');
      gifImg.src = gifUrl;

      // 2) 拉取 description 文本
      const descUrl = col.getAttribute('data-desc-url');
      try {
        const res = await fetch(descUrl);
        const txt = await res.text();
        descPre.textContent = txt;
      } catch (e) {
        descPre.textContent = 'Failed to load description.';
      }

      // 3) 显示弹窗 & 禁止滚动 & 可选降低主内容透明度
      modal.classList.add('is-active');
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      if (main) main.classList.add('modal-open');
    });
  });

  // 关闭弹窗的几种方式
  const closeModal = () => {
    modal.classList.remove('is-active');
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    if (main) main.classList.remove('modal-open');
    gifImg.src = '';       // 可选：清空，释放内存
    descPre.textContent = '';
  };
  bg.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
});  
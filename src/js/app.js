'use strict';

export default (function App(window, document, $){
	console.log('run');

	var maxHeight = 650;
	var maxWidth = 1160;

	var isNativeScrollEnabled = true;

	var isMobile = (function() { 
		if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
		){
			return true;
		} else {
			return false;
		}
	})();

	function _scrollMeTo(){
		
		$('.js-goto').on('click', function(e){
			var $target = $(this.href.replace( /^.*\#/, '#' ) );
			
			if ($target.length === 1) {
				e.preventDefault();

				$('body,html').animate({ 
					scrollTop: $target.offset().top,
					easing: 'ease-in'
				}, 500);
			};
		});

	};


	function _scroll(){
		var isScrolling = false;
		var $html = $('html');
		var $sections = $('.section');
		
		var scrollDirection;
		var winHeight;

		function scrollMeTo(e, index){

			var $target = $sections.eq(index);

			if ($target.length === 1) {

				e.preventDefault();

				isScrolling = true;

				$sections.addClass('section--scrolling');

				var scrollTop = $target.offset().top;

				if (scrollDirection == 'up'){
					scrollTop += ($target.outerHeight() - winHeight);
				}

				$('body,html').animate({ 
					scrollTop: scrollTop,
					easing: 'ease-in'
				}, 900, function(){
					isScrolling = false;
					$sections.removeClass('section--scrolling');
				});
			};
		}

		function smoothScroll(e){

			if (isScrolling){
				e.preventDefault();
				return;
			}		

			if (e.keyCode){
				
				if(e.keyCode === 38) {
					scrollDirection = 'up';
				}
				else if (e.keyCode === 40){
					scrollDirection = 'down';
				}

			}else{

				if(e.deltaY > 0) {
					scrollDirection = 'up';
				}
				else{
					scrollDirection = 'down';
				}

			}

			$sections.each(function(index, section){
				
				var rect = this.getBoundingClientRect();

				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (
					rectTop >= -(winHeight / 2)
					&& rectTop <= winHeight / 2
					&& rectBottom <= winHeight * 1.5
					){
					
					if ( scrollDirection  == 'up' && index > 0 ){
						
						if ( rectTop < 0 && rectBottom < winHeight ){
							
							scrollMeTo(e, index);
						
						}else if( rectTop >= 0 ){
							
							scrollMeTo(e, index - 1);
						}

					}else if ( scrollDirection  == 'down' && index < $sections.length ){ 

						if( rectBottom <= winHeight ){
							
							scrollMeTo(e, index + 1);
						
						}else if( rectTop > 0 ){	
						
							scrollMeTo(e, index);
						}

					}
				}

			});
		}

		function enableScroll(e){
			if (!isNativeScrollEnabled && !$html.hasClass('fancybox-lock')){
				smoothScroll(e);
			}	
		}

		function resize(){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );
			
			if ( winHeight > maxHeight && $(window).width() > maxWidth ){
				isNativeScrollEnabled = false;
			}else{
				isNativeScrollEnabled = true;
			}
		}
		resize();

		$(window).on('resize', function(e){
			resize();
		});		

		$(window).on('mousewheel', function(e){
			enableScroll(e);
		});		

		$(document).keydown(function(e){
			if (e.keyCode === 38 || e.keyCode === 40){
				enableScroll(e);			
			}
		});		
	}

	function _sections(){
		var $sections = $('.section');

		function resize(){
			
			var winHeight = $(window).height();

			$sections.each(function(){
				var $section = $(this);
				var height = winHeight;

				if (($section).data('scroll') !== 'enable'){
					return;
				}
				
				if (winHeight > maxHeight){
					$(this).css('height', height);
				}else{
					$(this).css('height', '');
				}
				
			});
		}

		resize();

		$(window).on('resize', function(e){
			resize();
		});
	}

	function _header(){
		const $header = $('header');

		function fix(){
			if ( $(window).scrollTop() > 0 ){
				$header.addClass('scrolled');
			}else{
				$header.removeClass('scrolled');
			}
		}
		fix();

		$(document).on('scroll', fix);
	}


	function _menu(){
		var $menuHrefs = $('.menu__href');
		var $sections = $('.section');

		var winHeight = ( window.innerHeight || document.documentElement.clientHeight );

		function setActive(){
						
			$sections.each(function(index, section){
				
				var sectionId = $(this).attr('id');
				var rect = this.getBoundingClientRect();
				var rectTop = Math.round(rect.top);
				var rectBottom = Math.round(rect.bottom);

				if (rectTop <= 50 && rectBottom / 2 <= winHeight ){
					$menuHrefs.removeClass('active');
					$menuHrefs.filter('[href="#' + sectionId + '"]').addClass('active');
				}

			});
		}

		setActive();

		$(window).on('scroll', function(e){
			setActive();
		});

		$(window).on('resize', function(e){
			winHeight = ( window.innerHeight || document.documentElement.clientHeight );
			
			setActive();
		});

	}

	function _backgtounds(){
		const $radio = $('.js-bg-change-input');
		const $image = $('.js-bg-change-image');
		const $video = $('.js-bg-change-video');
		const $preloader = $('.js-bg-change-preloader');

		let image = document.createElement('img');

		image.onload = () => {
			$image.attr('src', image.src);
			$image.removeClass('hidden');
			$video.addClass('hidden');
			$preloader.addClass('hidden');
		}

		let video = new XMLHttpRequest();

		video.onload = () => {
		    $video.attr('src', URL.createObjectURL(video.response));
		    $video[0].play();
		    setTimeout( () => {
		    	$video.removeClass('hidden');
		   		$image.addClass('hidden');				
				$preloader.addClass('hidden');
			}, 300);
		};
		
		video.ontimeout = (err) => {
			console.error(err);
		}
		
		video.onprogress = (e) => {
			if (e.lengthComputable){
				var percentComplete = parseInt( (e.loaded / e.total) * 100 );

				console.log(percentComplete);
			}
		}

		function load(value){					

			if (value.indexOf('.jpg') > -1){

				const src = $image.attr('src').replace(/\/[^\/]+\.jpg/, '/' + value);
				console.log(value, src);
				image.src = src;

			}else if (value.indexOf('.mp4') > -1){

				const src = $video.data('src') + value;
				console.log(value, src);
				
				video.open('GET', src);
				video.timeout = 15123;
				video.responseType = 'blob';
				video.send();

			}
		}

		$radio.on('change', function(e){
			const value = $(this).val();
			$preloader.removeClass('hidden');	
			setTimeout( () => {
				load(value);
			}, 300);
		});
	}

	function init(){

		if (!isMobile){
			_header();
			_sections();
			_scroll();
		}

		_backgtounds();
		_scrollMeTo();
		_menu();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);

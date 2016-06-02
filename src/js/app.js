'use strict';

export default (function App(window, document, $){
	console.log('run');

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

	function _header(){
		const $header = $('header');

		function fix(){
			if ( $(window).scrollTop() > 50 ){
				$header.addClass('scrolled');
			}else{
				$header.removeClass('scrolled');
			}
		}
		fix();

		$(document).on('scroll', fix);
	}

	function init(){
		_header();
		_scrollMeTo();
	}

	return {
		init 
	}

})(window, document, jQuery, undefined);

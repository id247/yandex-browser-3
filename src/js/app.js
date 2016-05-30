'use strict';

import 'babel-polyfill';

const app = ( () => {

	/* ==========================================================================
	 * tabs
	 * ========================================================================== */
	
	function tabs(){
		
		const tabsHrefs = document.querySelectorAll('.tabs-nav__href');
		const tabsItems = document.querySelectorAll('.tabs__item');

		tabsHrefs[0] && tabsHrefs[0].classList.add('active');

		[].forEach.call( tabsItems, (item, index) => {

			if (index > 0 ){
				item.style.display = 'none';
			}

		});
		
		[].forEach.call( tabsHrefs, (href) => {

			href && href.addEventListener('click', (e) => {

				e.preventDefault();

				const target = href.getAttribute('href').substr(1);

				[].forEach.call( tabsHrefs, (item) => {
					if (item === href ){
						item.classList.add('active');
					}else{
						item.classList.remove('active');
					}
				});

				[].forEach.call( tabsItems, (item) => {

					if (item.id === target ){
						item.style.display = '';
					}else{
						item.style.display = 'none';
					}

				});

			});

		});		
	
		
	}	


	/* ==========================================================================
	 * EVENTS
	 * ========================================================================== */
	
	function events(){
		
		const programmsOpeners = document.querySelectorAll('.js-programms-opener');
		
		[].forEach.call( programmsOpeners, (element) => {

			element && element.addEventListener('click', (e) => {

				e.preventDefault();

				element.parentNode.parentNode
						.querySelector('.programms-page__table-inner')
						.classList
						.add('visible');

				element.classList.add('hidden');

			});

		});		
		
	}

	/*
	*	INIT
	*/
	function init(options){

		events();
		tabs();

	}

	return{
		init: init
	}


})();

export default app;

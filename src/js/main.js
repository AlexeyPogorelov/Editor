var animationPrefix = (function () {
			var t,
			el = document.createElement("fakeelement");
			var transitions = {
				"transition": "animationend",
				"OTransition": "oAnimationEnd",
				"MozTransition": "animationend",
				"WebkitTransition": "webkitAnimationEnd"
			};
			for (t in transitions){
				if (el.style[t] !== undefined){
					return transitions[t];
				}
			}
		})(),
		loading = {
			avgTime: 3000,
			trg: 1,
			state: 0,
			preloader: $('body > .preloader'),
			loaded: function () {
				if(++loading.state == loading.trg) {
					loading.status(1);
					setTimeout(loading.done, 500);
				} else {
					loading.status(loading.state / loading.trg / 1.1);
				}
			},
			status: function (mult) {
				loading.preloader.find('> .after').css({
					'width': mult * 100 + '%'
				});
			},
			done: function () {
				if (loading.finished) {
					return;
				}

				// hide preloader
				loading.preloader.animate({}).delay(100).animate({
					'opacity': 0
				}, 600, function () {
					loading.status(0);
					$(this).detach();
					loading.finished = true;
				});
			}
	};

	// TODO
	$('img').each(function () {
		if (!this.naturalWidth || true) {
			loading.trg ++;
			$(this).one('load', loading.loaded)
		}
	});

setTimeout(function () {
	loading.status(1);
	setTimeout(loading.done, 500);
}, 10000);

$(window).on('load', function () {
	loading.status(1);
	setTimeout(loading.done, 500);
});

$(document).on('ready', function () {
	var winWidth = $(window).width(),
		winHeight = $(window).height(),
		dom = {
			$body: $('body')
		},
		bodyOverflow = {
			fixBody: function () {
				$('body').width($('body').width())
					.addClass('fixed');
			},
			unfixBody: function () {
				$('body')
					.css({
						'width': 'auto'
					})
					.removeClass('fixed');
			},
			resize: function () {
				this.unfixBody();
			}.bind(this)
		},
		goUp = (function () {
			var $el = $('#to-top'),
				state = false,
				speed = 900,
				paused = false;
			var plg = {
				up: function () {
					paused = true;
					$("html, body").stop().animate({scrollTop:0}, speed, 'swing', function () {
						paused = false;
					});
					plg.hide();
				},
				show: function () {
					if (!state && !paused) {
						$el.addClass('opened');
						state = true;
					}
				},
				hide: function () {
					if (state) {
						$el.removeClass('opened');
						state = false;
					}
				},
				$el: $el
			}
			$el.on('click', function () {
				plg.up();
			});
			return plg;
		})();

		// modals

		var modals = {
			opened: [],
			openModal: function ($modal) {

				this.opened.push($modal);
				$modal.addClass('opened');
				// $modal.parent().addClass('opened');

			},
			closeModal: function ($modal) {

				$modal.removeClass('opened');
				// $modal.parent().removeClass('opened');
				
				if (this.opened.length > 1) {

					var modal = $modal.get(0);

					// TODO test it
					for (var i = 0; i < this.opened.length; i++) {
						if (modal == this.opened[i].get(0)) {
							this.opened.splice(i, 1);
							break;
						}
					}

				} else {
					this.opened = [];
				}

			}
		}

		$('[data-modal]').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-modal'),
				$target = $(target);

			if ($target.length) {

				modals.openModal($target);

			} else {

				console.warn('Ошибка в элементе:');
				console.log(this);
				console.warn('Не найдены элементы с селектором ' + target);

			}
			
		});

		$('[data-close]').on('click', function (e) {

			e.preventDefault();

			var $self = $(this),
				target = $self.attr('data-close'),
				$target;

			if (target) {

				$target = $(target);

				if ($target.length) {

					$target.removeClass('opened');

				}

			} else {

				$self.closest('.opened').removeClass('opened');

			}

		});

		$('.modal-holder').on('click', function (e) {
			if (e.target === this) {
				modals.closeModal( $(this) );
			}
		})

		$(window).on('keyup', function (e) {
			// esc pressed
			if (e.keyCode == '27') {
				bodyOverflow.unfixBody();
			}
		});

		//scroll
		$(document).on('scroll', function () {
			var top = $(this).scrollTop();

			if (top > winHeight / 2) {
				goUp.show();
			} else {
				goUp.hide();
			}

		});

		// resize
		$(window).on('resize', function () {

			winWidth = $(window).width();
			winHeight = $(window).height();

		});

});
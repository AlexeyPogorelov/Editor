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
			$(this).one('load', loading.loaded);

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

var editorControls = {
	'log': function ($field) {
		console.log( $field.get(0) );
	},
	'bold': function () {
		alert('bold');
	},
	'italic': function () {
		alert('italic');
	},
	'align-left': function () {
		//
	},
	'align-right': function () {
		//
	},
	'align-center': function () {
		//
	},
	'line-through': function () {
		//
	},
	'color': function () {
		//
	},
	'mark': function () {
		//
	},
	'list': function () {
		//
	},
	'table': function () {
		//
	},
	'image': function () {
		//
	},
	'link': function () {
		//
	}
};

var controlsGroups = {
	'basic': function ($controls, $field) {

			var $log = $('<div>', {
					'class': 'log'
				}).on( 'click', editorControls.log.bind(this, $field) ).appendTo($controls);

			var $bold = $('<div>', {
					'class': 'bold'
				}).on( 'click', editorControls.bold.bind(this, $field) ).appendTo($controls);

			var $italic = $('<div>', {
					'class': 'italic'
				}).on( 'click', editorControls.italic.bind(this, $field) ).appendTo($controls);

	}
};

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
			};

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

				bodyOverflow.fixBody();

			},
			closeModal: function ($modal) {

				if ($modal && $modal instanceof jQuery) {

					$modal.removeClass('opened');

					bodyOverflow.unfixBody();

				} else if ($modal) {

					this.closeModal( $( $modal ) );

					return;

				} else if (this.opened.length > 0) {

					for (var y = 0; y < this.opened.length; y++) {

						this.closeModal( this.opened[y] );

					}

					return;

				}
				
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
		};

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

					modals.closeModal( $target );

				}

			} else {

				modals.closeModal( $self.closest('.opened') );

			}

		});

		$('.modal-holder').on('click', function (e) {

			if (e.target === this) {

				modals.closeModal( $(this) );

			}

		});

		$(window).on('keyup', function (e) {

			// esc pressed
			if (e.keyCode == '27') {

				modals.closeModal();

			}

		});

		// add content button
		var createContent = function (type) {

			if ( typeof createContent[type] === 'function') {

				var $editor = createContent[type]();
				this.before( $editor );

			} else {

				console.warn('К сожалению, тип ' + type + ' не предусмотрен программой');
				console.log(this);

			}

		};

		createContent.text = function () {

			var $content = $('<div>', {
					'class': 'editor'
				}),
				$field = $('<div>', {
					'class': 'field',
					'contenteditable': true
				}).appendTo($content),
				$controls = $('<div>', {
					'class': 'controls'
				}).appendTo($content);

			// controls
			controlsGroups.basic($controls, $field);

			// console.log('text');

			return $content;

		};

		createContent.table = function() {

			var $content = $('<div>')
				.addClass('editor')
				.attr('contenteditable', true);
			// console.log('table');

			return $content;

		};

		$('[data-add-content]').each(function () {

			var $self = $(this);

			$self.on('click', function (e) {

				createContent.call($self, e.target.getAttribute('data-type') );

			});

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
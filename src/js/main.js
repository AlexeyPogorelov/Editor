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

var editorMethods = {
	'replace': function(element, text, caret) {
		var tmp = _getCaretInfo(element),
			orig = element.value,
			pos = $(element).scrollTop(),
			range = {start: tmp.start, end: tmp.start + text.length};

		element.value = orig.substr(0, tmp.start) + text + orig.substr(tmp.end);

		$(element).scrollTop(pos);
		this.setPos(element, range, caret);
	},
	'getCaretInfo': function(element){
		var res = {
				text: '',
				start: 0,
				end: 0
			},
			win = window;

		if (!element.value) {
			/* no value or empty string */
			return res;
		}

		try {
			if (win.getSelection) {
				/* except IE */
				res.start = element.selectionStart;
				res.end = element.selectionEnd;
				res.text = element.value.slice(res.start, res.end);
			} else if (doc.selection) {
				/* for IE */
				element.focus();

				var range = doc.selection.createRange(),
					range2 = doc.body.createTextRange();

				res.text = range.text;

				try {
					range2.moveToElementText(element);
					range2.setEndPoint('StartToStart', range);
				} catch (e) {
					range2 = element.createTextRange();
					range2.setEndPoint('StartToStart', range);
				}

				res.start = element.value.length - range2.text.length;
				res.end = res.start + range.text.length;
			}
		} catch (e) {
			/* give up */
			console.log(e);
			// console.error(e);
		}

		return res;
	},
	setPos: function(element, toRange, caret) {
		caret = this._caretMode(caret);

		if (caret === 'start') {
			toRange.end = toRange.start;
		} else if (caret === 'end') {
			toRange.start = toRange.end;
		}

		element.focus();
		try {
			if (element.createTextRange) {
				var range = element.createTextRange();

				if (win.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
					toRange.start = element.value.substr(0, toRange.start).replace(/\r/g, '').length;
					toRange.end = element.value.substr(0, toRange.end).replace(/\r/g, '').length;
				}

				range.collapse(true);
				range.moveStart('character', toRange.start);
				range.moveEnd('character', toRange.end - toRange.start);

				range.select();
			} else if (element.setSelectionRange) {
				element.setSelectionRange(toRange.start, toRange.end);
			}
		} catch (e) {
			/* give up */
			console.error(e);
		}
	},
	_caretMode: function(caret) {
			caret = caret || "keep";
			if (caret === false) {
				caret = 'end';
			}

			switch (caret) {
				case 'keep':
				case 'start':
				case 'end':
					break;

				default:
					caret = 'keep';
			}

			return caret;
		},
		wrap: function (tag) {

			var sel, range;

			if (window.getSelection) {
				sel = window.getSelection();
				
				if (sel.rangeCount) {
					range = sel.getRangeAt(0);
					selectedText = range.toString();
					range.deleteContents();
					range.insertNode(document.createTextNode('<' + tag + '>' + selectedText + '</' + tag + '>'));
				}
			}
			else if (document.selection && document.selection.createRange) {
				range = document.selection.createRange();
				selectedText = document.selection.createRange().text + "";
				range.text = '<' + tag + '>' + selectedText + '</' + tag + '>';
			}

		}
};

var editorControls = {
	'log': function (e) {

		e.preventDefault();
		var $field = e.data.$field;

		console.log( $field.get(0) );
	},
	'test': function (e) {

		e.preventDefault();
		var $field = e.data.$field;

		console.log( document.createRange() );

		console.log( editorControls.selected );

		// console.log( window.getSelection() );

		// console.log( (document.all) ? document.selection.createRange().text : document.getSelection() );
	},
	'bold': function (e) {

		var sel, range, tag = 'b';
		
		if (window.getSelection) {
			// alert();
			sel = window.getSelection();
			
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				selectedText = range.toString();
				// console.log( selectedText );
				range.deleteContents();
				var createdElement = document.createElement('B');
				createdElement.innerHTML = selectedText;
				// createdElement.appendChild( range );
				range.insertNode( createdElement );
			}
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			selectedText = document.selection.createRange().text + "";
			range.text = '<' + tag + '>' + selectedText + '</' + tag + '>';
		}

	},
	'italic': function (e) {

		e.preventDefault();

		var $field = e.data.$field;

		function getNextNode(node) {
			var next = node.firstChild;
			if (next) {
				return next;
			}
			while (node) {
				if ( (next = node.nextSibling) ) {
					return next;
				}
				node = node.parentNode;
			}
		}

		function getNodesInRange(range) {
			var start = range.startContainer;
			var end = range.endContainer;
			var commonAncestor = range.commonAncestorContainer;
			var nodes = [];
			var node;

			// Walk parent nodes from start to common ancestor
			for (node = start.parentNode; node; node = node.parentNode) {
				nodes.push(node);
				if (node == commonAncestor) {
					break;
				}
			}
			nodes.reverse();

			// Walk children and siblings from start until end is found
			for (node = start; node; node = getNextNode(node)) {
				nodes.push(node);
				if (node == end) {
					break;
				}
			}

			return nodes;
		}

		function getNodeIndex(node) {
			var i = 0;
			while ( (node = node.previousSibling) ) {
				++i;
			}
			return i;
		}

		function insertAfter(node, precedingNode) {
			var nextNode = precedingNode.nextSibling, parent = precedingNode.parentNode;
			if (nextNode) {
				parent.insertBefore(node, nextNode);
			} else {
				parent.appendChild(node);
			}
			return node;
		}

		// Note that we cannot use splitText() because it is bugridden in IE 9.
		function splitDataNode(node, index) {
			var newNode = node.cloneNode(false);
			newNode.deleteData(0, index);
			node.deleteData(index, node.length - index);
			insertAfter(newNode, node);
			return newNode;
		}

		function isCharacterDataNode(node) {
			var t = node.nodeType;
			return t == 3 || t == 4 || t == 8 ; // Text, CDataSection or Comment
		}

		function splitRangeBoundaries(range) {
			var sc = range.startContainer, so = range.startOffset, ec = range.endContainer, eo = range.endOffset;
			var startEndSame = (sc === ec);

			// Split the end boundary if necessary
			if (isCharacterDataNode(ec) && eo > 0 && eo < ec.length) {
				splitDataNode(ec, eo);
			}

			// Split the start boundary if necessary
			if (isCharacterDataNode(sc) && so > 0 && so < sc.length) {
				sc = splitDataNode(sc, so);
				if (startEndSame) {
					eo -= so;
					ec = sc;
				} else if (ec == sc.parentNode && eo >= getNodeIndex(sc)) {
					++eo;
				}
				so = 0;
			}
			range.setStart(sc, so);
			range.setEnd(ec, eo);
		}

		function getTextNodesInRange(range) {
			var textNodes = [];
			var nodes = getNodesInRange(range);
			for (var i = 0, node, el; node = nodes[i++]; ) {
				if (node.nodeType == 3) {
					textNodes.push(node);
				}
			}
			return textNodes;
		}

		function surroundRangeContents(range, templateElement) {
			splitRangeBoundaries(range);
			var textNodes = getTextNodesInRange(range);
			if (textNodes.length == 0) {
				return;
			}
			for (var i = 0, node, el; node = textNodes[i++]; ) {
				if (node.nodeType == 3) {
					el = templateElement.cloneNode(false);
					node.parentNode.insertBefore(el, node);
					el.appendChild(node);
				}
			}
			range.setStart(textNodes[0], 0);
			var lastTextNode = textNodes[textNodes.length - 1];
			range.setEnd(lastTextNode, lastTextNode.length);
		}

		document.onmouseup = function() {
			if (window.getSelection) {
				var templateElement = document.createElement("span");
				templateElement.className = "highlight";
				var sel = window.getSelection();
				var ranges = [];
				var range;
				for (var i = 0, len = sel.rangeCount; i < len; ++i) {
					ranges.push( sel.getRangeAt(i) );
				}
				sel.removeAllRanges();

				// Surround ranges in reverse document order to prevent surrounding subsequent ranges messing with already-surrounded ones
				i = ranges.length;
				while (i--) {
					range = ranges[i];
					surroundRangeContents(range, templateElement);
					sel.addRange(range);
				}
			}
		};
	},
	'alignLeft': function (e) {

		e.preventDefault();

		var sel, range, $field = e.data.$field;

		console.log($field);
		
		if (window.getSelection) {
			sel = window.getSelection();
			
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				selectedText = range.toString();
				range.deleteContents();
				range.insertNode(document.createTextNode('[l]' + selectedText + '[/l]'));
			}
		}
		else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			selectedText = document.selection.createRange().text + "";
			range.text = '[l]' + selectedText + '[/l]';
		}

		return false;

	},
	'alignRight': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'alignCenter': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'lineThrough': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'color': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'mark': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'list': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'table': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'image': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	},
	'link': function (e) {
		e.preventDefault();
		var $field = e.data.$field;
	}
};

var controlsGroups = {
	'basic': function ($controls, $field) {

			var $log = $('<input>', {
					'type': 'button',
					'value': 'log',
					'class': 'log'
				}).on( 'click', {'$field': $field}, editorControls.log ).appendTo($controls);

			var $test = $('<input>', {
					'type': 'button',
					'value': 'test',
					'class': 'test'
				}).on( 'click', {'$field': $field}, editorControls.test ).appendTo($controls);

			var $bold = $('<input>', {
					'type': 'button',
					'value': 'bold',
					'class': 'bold'
				}).on( 'click', {'$field': $field}, editorControls.bold ).appendTo($controls);

			var $italic = $('<input>', {
					'type': 'button',
					'value': 'italic',
					'class': 'italic'
				}).on( 'click', {'$field': $field}, editorControls.italic ).appendTo($controls);

			var $alignLeft = $('<input>', {
					'type': 'button',
					'value': 'align-left',
					'class': 'align-left'
				}).on( 'click', {'$field': $field}, editorControls.alignLeft ).appendTo($controls);

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
					'contenteditable': true,
					'class': 'field'
				}).on('mouseup', function (e) {
					// TODO save selected area
					// alert();
					// console.log( (document.all) ? document.selection.createRange().text : document.getSelection() );
					// console.log ( document.getSelection() === editorControls.selected );
					// editorControls.selected = (document.all) ? document.selection.createRange().text : document.getSelection();
					var element = this,
						res = {
							text: '',
							start: 0,
							end: 0
						};

					// console.dir(element);

					if (!element.value) {

						/* no value or empty string */
						editorControls.selected = res;
						// console.log('nothing selected');
						// return res;

					}

					// console.log(res);

					try {
						var win = window;
						if (win.getSelection) {
							/* except IE */
							res.start = element.selectionStart;
							res.end = element.selectionEnd;
							res.text = element.innerHTML.slice(res.start, res.end);
						} else if (doc.selection) {
							/* for IE */
							element.focus();

							var range = doc.selection.createRange(),
								range2 = doc.body.createTextRange();

							res.text = range.text;

							try {
								range2.moveToElementText(element);
								range2.setEndPoint('StartToStart', range);
							} catch (e) {
								range2 = element.createTextRange();
								range2.setEndPoint('StartToStart', range);
							}

							res.start = element.value.length - range2.text.length;
							res.end = res.start + range.text.length;

						}
					} catch (e) {
						/* give up */
						console.error('Ошибка контейнера');
						console.log(e);
					}

					editorControls.selected = res;
					// console.log(res);


				}).appendTo($content),
				$controls = $('<div>', {
					'class': 'controls'
				}).insertBefore($field);

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
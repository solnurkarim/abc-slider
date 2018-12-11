function abcSlider(config) {
	var slider = {
		sliderElem: document.querySelector(config.sliderElem),
		transitionType: config.transitionType ? config.transitionType : 'fade',
		transitionIsActive: false,
		currentSlide: undefined,
		nextSlide: undefined,
		btnNext: config.btnNext ? document.querySelector(config.btnNext) : undefined,
		btnPrev: config.btnPrev ? document.querySelector(config.btnPrev) : undefined,
		slide: function (direction) {
			if (this.transitionIsActive) return;
			for (var child of this.sliderElem.children) {
				if (child.classList.contains('show')) {
					this.currentSlide = child;
					this.transitionIsActive = true;
					if (direction === 'next') {
						if (this.currentSlide.nextElementSibling !== null) {
							this.nextSlide = this.currentSlide.nextElementSibling;
							if (this.transitionType !== 'fade') {
								this.slideRight();
							} else {
								this.fadeOut();
								this.fadeIn();
							}
						} else {
							this.nextSlide = this.sliderElem.firstElementChild;
							if (this.transitionType !== 'fade') {
								this.slideLeft();
							} else {
								this.fadeOut();
								this.fadeIn();
							}
						}

					} else {
						if (this.currentSlide.previousElementSibling !== null) {
							this.nextSlide = this.currentSlide.previousElementSibling;
							if (this.transitionType !== 'fade') {
								this.slideLeft();
							} else {
								this.fadeOut();
								this.fadeIn();
							}
						} else {
							this.nextSlide = this.sliderElem.lastElementChild;
							if (this.transitionType !== 'fade') {
								this.slideRight();
							} else {
								this.fadeOut();
								this.fadeIn();
							}
						}
					}

					if (config.indicators) {
						for (var ind in this.sliderElem.children) {
							if (this.sliderElem.children[ind].classList.contains('show')) {
								this.activeIndicator.classList.remove('active')
								this.activeIndicator = indicators.children[ind];
								this.activeIndicator.classList.add('active');
							}
						}
					}

					if (config.slideInterval) {
						clearInterval(this.sliderTimer);
						var sliderObj = this;

						function setTimer() {
							sliderObj.slide('next')
						}
						this.sliderTimer = setInterval(
							setTimer, config.slideInterval);
					}

					break;
				}
			}
		},
		sliderTimer: function () {
			var sliderObj = this;
			return setInterval(function () {
				sliderObj.slide('next');
			}, config.slideInterval)
		},
		slideRight: function () {
			var fromPos = this.sliderElem.scrollLeft;
			var toPos = this.nextSlide.offsetLeft;
			var step = (toPos - fromPos) / 50;

			if (this.sliderElem.scrollWidth - this.sliderElem.scrollLeft < this.sliderElem.clientWidth + step) {
				this.nextSlide = this.sliderElem.firstElementChild;
				this.slideLeft();
				return 0;
			}

			this.currentSlide.classList.remove('show');
			this.nextSlide.classList.add('show');
			var sliderObj = this;
			var slideTimer = setInterval(slideRightStep, 10);

			function slideRightStep() {
				if (!(toPos - fromPos < step)) {
					fromPos += step;
					sliderObj.sliderElem.scrollLeft = fromPos;
				} else {
					sliderObj.sliderElem.scrollLeft = toPos;
					clearInterval(slideTimer);
					sliderObj.transitionIsActive = false;
				}
			}
		},
		slideLeft: function () {
			var fromPos = this.sliderElem.scrollLeft;
			var toPos = this.nextSlide.offsetLeft;
			var step = (fromPos - toPos) / 50;
			if (fromPos < toPos && this.currentSlide == this.sliderElem.lastElementChild) {
				for (var i = this.sliderElem.children.length - 1; i !== -1; i--) {
					if (this.sliderElem.children[i].offsetLeft < this.sliderElem.scrollLeft) {
						this.nextSlide = this.sliderElem.children[i];
						break;
					}
				}
				this.slideLeft();
				return 0;
			}

			this.currentSlide.classList.remove('show');
			this.nextSlide.classList.add('show');
			var sliderObj = this;
			var slideTimer = setInterval(slideLeftStep, 10);

			function slideLeftStep() {
				if (!(fromPos - toPos < step)) {
					fromPos -= step;
					sliderObj.sliderElem.scrollLeft = fromPos;
				} else {
					sliderObj.sliderElem.scrollLeft = toPos;
					clearInterval(slideTimer);
					sliderObj.transitionIsActive = false;
				}
			}
		},
		fadeIn: function () {
			this.nextSlide.classList.add('show');
			this.nextSlide.style.opacity = 0;

			var fadeInOpacityCounter = 0;
			var sliderObj = this;
			var fadeInTimer = setInterval(fadeInStep, 30);

			function fadeInStep() {
				if (Number.parseFloat(fadeInOpacityCounter).toFixed(1) == 1) {
					clearInterval(fadeInTimer);
					fadeInOpacityCounter = 0;
					sliderObj.transitionIsActive = false;
				} else {
					fadeInOpacityCounter += 0.05;
					sliderObj.nextSlide.style.opacity = Number.parseFloat(fadeInOpacityCounter).toFixed(1);
				}
			}
		},
		fadeOut: function () {
			var fadeOutOpacityCounter = 1;
			var sliderObj = this;
			var fadeOutTimer = setInterval(fadeOutStep, 30);
			// sliderObj.currentSlide.classList.remove('show');

			function fadeOutStep() {
				if (Number.parseFloat(fadeOutOpacityCounter).toFixed(1) == 0) {
					clearInterval(fadeOutTimer);
					fadeOutOpacityCounter = 1;
					sliderObj.currentSlide.classList.remove('show');
				} else {
					fadeOutOpacityCounter -= 0.05;
					sliderObj.currentSlide.style.opacity = Number.parseFloat(fadeOutOpacityCounter).toFixed(1);
				}
			}
		}
	};

	var parentNode = slider.sliderElem;
	var content = document.createElement("div");
	content.classList.add("abc-slider_content");

	parentNode.insertBefore(content, parentNode.children[0]);

	while (parentNode.children.length > 1) {
		var item = document.createElement("div");
		item.classList.add("abc-slider__item");
		content.appendChild(item);
		item.appendChild(parentNode.children[1])
	}
	content.children[0].classList.add("show");
	slider.sliderElem = content;

	if (config.indicators) {
		var indicators = document.createElement('div');
		indicators.classList.add('abc-slider_indicators');

		var slidesLen;
		if (config.slidesPerView)
			slidesLen = Math.ceil(content.children.length / config.slidesPerView);
		else slidesLen = content.children.length;

		while (slidesLen) {
			var indicator = document.createElement('span');
			indicator.classList.add('abc-slider__indicator');
			indicators.appendChild(indicator);
			slidesLen--;
		}

		indicators.children[0].classList.add('active');
		slider.activeIndicator = indicators.children[0];

		parentNode.prepend(indicators);
	}

	if (config.showNav) {
		var controls = document.createElement('div');
		controls.classList.add("abc-slider_controls");

		var btnPrev = document.createElement('div');
		btnPrev.classList.add("abc-slider__prev");
		slider.btnPrev = btnPrev;

		var btnNext = document.createElement('div');
		btnNext.classList.add("abc-slider__next");
		slider.btnNext = btnNext;

		controls.appendChild(btnPrev);
		controls.appendChild(btnNext);
		parentNode.prepend(controls);
	}

	if (slider.btnNext) slider.btnNext.onclick = function () {
		slider.slide('next');
	};

	if (slider.btnPrev) slider.btnPrev.onclick = function () {
		slider.slide('prev');
	};

	if (slider.transitionType === 'fade') {
		for (var elem of slider.sliderElem.children) {
			elem.style.position = 'absolute';
			elem.style.display = 'none';
			elem.style.width = '100%';
		}
	} else if (slider.transitionType === 'slide-overlap') {
		for (var i = 0; i < slider.sliderElem.children.length; i++) {
			// slider.sliderElem.children[i].style.marginLeft = '-100px';
			slider.sliderElem.children[i].style.width = '50%';
		}
	} else if (slider.transitionType === 'slide') {
		for (var elem of slider.sliderElem.children) {
			if (config.slidesPerView) {
				elem.style.width = "calc(100% / " + config.slidesPerView + ")"
			} else elem.style.width = '100%';
		}
	}

	if (config.slideInterval) slider.sliderTimer();

	return slider;
};
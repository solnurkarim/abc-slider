Currently supports full-width `fade`/`slide` transition types.

### Demo:
https://solnurkarim.github.io/abc-slider/

### Installation process:
```html
<div id="your-slider-id" class="abc-slider">
    <div>Slide-1</div>
    <div>Slide-2</div>
    <div>Slide-3</div>
</div>
```

```javascript
abcSlider({
    sliderElem: 'your-slider-id',
    showNav: Boolean,
    slideInterval: Number,
    btnNext: 'button-id',
    btnPrev: 'button-id'
})
```
Setting `sliderElem` is mandatory. Everything else is `optional`.

Set `showNav` to `true` to enable default nav buttons. To set your own buttons, use `btnPrev`/`btnNext` options.

### Things to do:
- [x] Cross-fade transitions
- [x] Slide transitions
- [x] Nav buttons
- [x] Slider timings
- [x] Indicators
- [ ] Rewrite slide gateway to use children data-indexes
- [ ] Clickable indicators
- [ ] Multiple slides per view

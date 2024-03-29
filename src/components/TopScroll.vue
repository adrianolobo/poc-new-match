<template>
  <div class="top-scroll" v-show="questions.length">
    <div class="top-scroll__arrow-left top-scroll__arrow" @click="scrollToPrevious()">
      <div class="top-scroll__arrow-circle">
      </div>
      <i class="fas fa-chevron-left top-scroll__arrow-icon top-scroll__arrow-icon-left"></i>
    </div>
    <transition-group
      class="top-scroll__items"
      ref="scrollContainer"
      name="list-complete"
      mode="in-out"
      tag="div"
    >
      <div class="top-scroll__item-padding" ref="itemPadding" key="padding-1"></div>
      <scroll-item
        class="top-scroll__item"
        ref="scrollItems"
        :question="question"
        :is-question="isQuestion"
        v-for="(question, index) in questions"
        :key="question.image || question.text"
        :active="index === activeItemIndex"
        :active-disabled="activeDisabled"
        @click="scrollToItem(index)"
        @click-active="clickActive()"
      ></scroll-item>
      <div class="top-scroll__item-padding" key="padding-2"></div>
    </transition-group>
    <div class="top-scroll__arrow-right top-scroll__arrow" @click="scrollToNext()">
      <div class="top-scroll__arrow-circle">
      </div>
      <i class="fas fa-chevron-right top-scroll__arrow-icon top-scroll__arrow-icon-right"></i>
    </div>
  </div>
</template>

<style lang="sass">
@import ../mobileFirst

.top-scroll
  display: flex
  flex: 1
  position: relative
  max-height: 200px
  min-height: 120px
  overflow: hidden
  &__items
    display: flex
    flex: 1
    display: flex
    overflow-y: hidden
    overflow-x: auto
    position: relative
    user-select: none
  &__item-padding
    width: 50%
    flex-shrink: 0
  &__item
    width: 50%
    flex-shrink: 0
    +media-min-md()
      width: 25%

  &__arrow-circle
    background-color: #2e2e78
    position: absolute
    width: 100%
    height: 100%
    border-radius: 50%
    opacity: 0.2
    transition: all .3s ease

  &__arrow
    position: absolute
    width: 80px
    height: 120px
    z-index: 10
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    top: 50%
    transform: translate(50%, -50%)
    &:hover
      .top-scroll
        &__arrow-circle
          height: 125px
          width: 85px
          opacity: 1
          box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
        &__arrow-icon
          color: #fff
  &__arrow-icon
    color: #2e2e78
    font-size: 28px
    position: relative
    transition: all .3s ease
  &__arrow-icon-left
    margin-left: 30px
  &__arrow-icon-right
    margin-right: 30px
  &__arrow-left
    left: 0px
    transform: translate(-50%, -50%)
  &__arrow-right
    right: 0px
  +media-min-md()
    &__items
      overflow-y: hidden
      overflow-x: hidden
.list-complete-enter, .list-complete-leave-to
  transform: scale(0)
  opacity: 0
  width: 0
.list-complete-leave-active
  transform: scale(0)
  opacity: 0
  width: 0

</style>

<script>
import ScrollItem from './ScrollItem';
const { Tween, Easing, autoPlay } = require('es6-tween');

export default {
  components: {
    ScrollItem,
  },
  props: {
    questions: Array,
    isQuestion: Boolean,
    activeDisabled: Boolean,
    startItem: Number,
  },
  data() {
    return {
      activeItemIndex: null,
      stopScrollTimeout: null,
      autoScrolling: false,
      scrollContainerEl: null,
    };
  },
  computed: {
  },
  methods: {
    clickActive() {
      this.$emit('click-active');
    },
    setActiveIndex() {
      this.activeItemIndex = this.getActiveIndex();
    },
    getItemPaddingWidth() {
      return this.$refs.itemPadding.clientWidth;
    },
    // pega o index do array de acordo com o scrollLeft do container
    getActiveIndex() {
      const halfContainerWidth = this.scrollContainerEl.clientWidth / 2;
      const quarterSingleItemWidth = this.getSingleItemWidth() / 4;
      // o calculo é feito a partir da metade do container Width
      // a partir dele existe um padding de um quarto do tamanho de um item
      // este padding é feito para que o calculo do item principal tenha esse padding,
      // assim ele não precisa estar exatamente no meio para ser o ativo
      // Este valor é dividido pelo tamanho total de um card para saber o index do item
      let activeIndex = Math.floor((this.scrollContainerEl.scrollLeft + halfContainerWidth + quarterSingleItemWidth - this.getItemPaddingWidth()) / this.getSingleItemWidth());
      console.log(activeIndex);
      return this.validateItemIndex(activeIndex);
    },
    // esta função serve para que seja validado o index encontrado das funções previnindo que
    // como o index é calculado a partir do scroll, existe a possibilidade do resultado ser -1 ou maior que o length.
    validateItemIndex(itemIndex) {
      const validIndex = Math.min(itemIndex, this.questions.length - 1);
      console.log('VALIDATE', Math.max(validIndex, 0));
      return Math.max(validIndex, 0);
    },
    getSingleItemWidth() {
      console.log(this.$refs.scrollItems[0])
      if (!this.$refs.scrollItems[0]) {
        return 0;
      }
      console.log('getSingleItemWidth', this.$refs.scrollItems[0].$el.clientWidth);
      return this.$refs.scrollItems[0].$el.clientWidth;
      return this.scrollContainerEl.scrollWidth / (this.questions.length + 4);
    },
    // recebe o scrollLeft do item a partir de um index do array
    getItemLocation(itemIndex) {
      const singleItemWidth = this.getSingleItemWidth();
      const halfSingleItemWidth = singleItemWidth / 2;
      // a localização é feita basicamente multiplicando o index pelo tamanho do item
      // e somando metade de um item para manter ele no centro
      console.log('getItemLocation', (singleItemWidth * itemIndex) + (halfSingleItemWidth))
      return (singleItemWidth * itemIndex) + (halfSingleItemWidth);
    },
    // scrollToItem implementa as funções para ter uma função fácil que faz o scroll para qualquer item no array
    scrollToItem(itemIndex) {
      const validItemIndex = this.validateItemIndex(itemIndex);
      const scrollTo = this.getItemLocation(validItemIndex)
      const tween = new Tween({ scrollLeft: this.scrollContainerEl.scrollLeft })
        .to({ scrollLeft: scrollTo }, 300)
        .easing(Easing.Quadratic.InOut)
        .on('update', ({ scrollLeft }) => {
          this.scrollContainerEl.scrollLeft = scrollLeft;
        })
        .on('complete', () => {
          this.autoScrolling = false;
        });
      setTimeout(() => {
        this.autoScrolling = false;
      }, 300);
      tween.play();
      setTimeout(() => {
        this.autoScrolling = false;
      }, 300);
      this.autoScrolling = true;
    },
    scrollToPrevious() {
      this.scrollToItem(this.getActiveIndex() - 1);
    },
    scrollToNext() {
      this.scrollToItem(this.getActiveIndex() + 1);
    },
    scrollToActive() {
      this.scrollToItem(this.getActiveIndex());
    },
  },
  mounted() {
    autoPlay(true);
    this.scrollContainerEl = this.$refs.scrollContainer.$el;
    this.scrollToItem(this.startItem);
    this.scrollContainerEl.addEventListener('scroll', (e) => {
      clearTimeout(this.stopScrollTimeout);
      this.setActiveIndex();
      this.$emit('active-item', this.getActiveIndex());
      if(this.autoScrolling) {
        return;
      }
      // depois de 250ms de inatividade do scroll é executado a função que
      // centraliza o scroll para o centro
      this.stopScrollTimeout = setTimeout(() => {
        this.scrollToActive();
      }, 250);

    });
  },
}

</script>

<style>
.chevron::before {
	border-style: solid;
	border-width: 3px 3px 0 0;
  border-color: #fff;
	content: '';
	display: inline-block;
	height: 15px;
	position: relative;
	transform: rotate(-45deg);
	vertical-align: top;
	width: 15px;
}

.chevron.right:before {
	left: 0;
	transform: rotate(45deg);
}

.chevron.bottom:before {
	top: 0;
	transform: rotate(135deg);
}

.chevron.left:before {
	left: 3px;
	transform: rotate(-135deg);
}
</style>


<template>
  <div class="top-scroll" v-show="questions.length">
    <div class="top-scroll__arrow-left top-scroll__arrow" @click="scrollToPrevious()">
      <div class="chevron left"></div>
    </div>
    <transition-group
      class="top-scroll__items"
      ref="scrollContainer"
      name="list-complete"
      mode="in-out"
      tag="div"
    >
      <div class="top-scroll__item" key="padding-0"></div>
      <div class="top-scroll__item" key="padding-1"></div>
      <scroll-item
        class="top-scroll__item"
        ref="scrollItems"
        :question="question"
        :is-question="isQuestion"
        v-for="(question, index) in questions"
        :key="question.image || question.text"
        :active="index === activeItemIndex"
        @click="scrollToItem(index)"
      ></scroll-item>
      <div class="top-scroll__item" key="padding-2"></div>
      <div class="top-scroll__item" key="padding-3"></div>
    </transition-group>
    <div class="top-scroll__arrow-right top-scroll__arrow" @click="scrollToNext()">
      <div class="chevron right"></div>
    </div>
  </div>
</template>

<style lang="sass">
@import ../mobileFirst

.top-scroll
  display: flex
  flex: 1
  position: relative
  &__items
    flex: 1
    display: flex
    overflow-y: hidden
    overflow-x: auto
    position: relative
    user-select: none
  &__item
    width: 25%
    flex-shrink: 0
  &__arrow
    position: absolute
    background-color: #7abeb8
    width: 55px
    height: 100%
    z-index: 10
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer
    top: 50%
    transform: translateY(-50%)
  &__arrow-left
    left: 0px
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
    setActiveIndex() {
      this.activeItemIndex = this.getActiveIndex();
    },
    getActiveIndex() {
      const halfContainerWidth = this.scrollContainerEl.clientWidth / 2;
      const quarterSingleItemWidth = this.getSingleItemWidth() / 4;
      let activeIndex = Math.floor((this.scrollContainerEl.scrollLeft + halfContainerWidth + quarterSingleItemWidth) / this.getSingleItemWidth()) - 2;
      return this.validateItemIndex(activeIndex);
    },
    validateItemIndex(itemIndex) {
      const validIndex = Math.min(itemIndex, this.questions.length - 1);
      return Math.max(validIndex, 0);
    },
    getSingleItemWidth() {
      return this.scrollContainerEl.scrollWidth / (this.questions.length + 4);
    },
    getItemLocation(itemIndex) {
      const singleItemWidth = this.getSingleItemWidth();
      const halfSingleItemWidth = singleItemWidth / 2;
      return (singleItemWidth * itemIndex) + (halfSingleItemWidth);
    },
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
      this.stopScrollTimeout = setTimeout(() => {
        this.scrollToActive();
      }, 750);

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


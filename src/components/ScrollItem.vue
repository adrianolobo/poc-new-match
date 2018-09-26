<template>
  <div @click="click" class="scroll-item" :class="{ 'scroll-item_active': active }">
    <div class="scroll-item__container" v-if="question">
      <div class="scroll-item__img-container" v-if="question.image">
        <img draggable="false" :src="`/imgs/${question.image}`" alt="">
      </div>
      <div class="scroll-item__text-container" v-if="question.text">
        {{ question.text }}
      </div>
      <div class="scroll-item__answer-area" v-if="question.answer">
        <div
          class="scroll-item__remove"
          v-if="question.answer"
          @click="removeAnswer"
        >
          x
        </div>
        <transition
          name="list-complete"
        >
          <div class="scroll-item__img-container" v-if="question.answer">
            <img draggable="false" :src="`/imgs/${question.answer.image}`" alt="">
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.scroll-item
  height: 130px
  margin-top: auto
  margin-bottom: auto
  padding: 30px 0
  display: flex
  justify-content: center
  align-items: center
  transition: all .3s ease
  &_active
    .scroll-item
      &__container
        transform: scale(1.2)
        // border-color: red
  &__container
    background-color: #fff
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
    border-radius: 5px
    height: 100%
    width: 80%
    display: flex
    justify-content: center
    align-item: center
    transition: all .3s ease
    cursor: pointer
    flex-direction: column
  &__img-container
    display: flex
    justify-content: center
    align-items: center
    flex: 1
    height: 100%
    transition: all .3s ease
    & img
      transition: all .3s ease
      flex: 0
      max-height: 80%
      max-width: 80%
  &__answer-area
    height: 50%
    background-color: #d3d434
    position: relative
    border-bottom-left-radius: 5px
    border-bottom-right-radius: 5px
  &__text-container
    flex: 1
    display: flex
    justify-content: center
    align-items: center
  &__remove
    width: 20px
    height: 20px
    border-radius: 50%
    position: absolute
    top: 100%
    right: 0px
    color: #fff
    font-weight: bold
    font-size: 12px
    background-color: #f26eac
    transform: translate(50%, -50%)
    display: flex
    justify-content: center
    align-items: center
</style>

<script>
export default {
  props: {
    question: Object,
    active: Boolean,
    isQuestion: Boolean,
  },
  methods: {
    click() {
      this.$emit('click');
    },
    removeAnswer() {
      this.question.answer.removed = false;
      this.question.answer = null;
    },
  },
};
</script>

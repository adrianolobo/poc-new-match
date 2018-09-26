<template>
  <div id="app">
    <div class="activity-container">
      <top-scroll
        :questions="questions"
        is-question
        @active-item="setActiveQuestion"
        :start-item="0"
        ref="questionsEl"
      ></top-scroll>
      <button class="match-btn" @click="match" v-if="!(matchUpIcon === null)">
        <i class="fas fa-arrows-alt-v match-btn__icon" v-show="matchUpIcon === false"></i>
        <i class="fas fa-long-arrow-alt-up match-btn__icon" v-show="matchUpIcon === true"></i>
        Match
      </button>
      <top-scroll
        :questions="activeAnswers"
        @active-item="setActiveAnswer"
        :start-item="Math.floor((activeAnswers.length / 2) - 1)"
      ></top-scroll>
    </div>
  </div>
</template>

<style lang="sass">
@import ./mobileFirst
.match-btn
  margin: 20px
  height: 60px
  width: 180px
  background-color: #d6e702
  border: none
  border-radius: 5px
  cursor: pointer
  font-weight: light
  font-size: 18px
  &__icon
    font-size: 25px
    margin-right: 20px
.activity-container
  background-color: #fff
  border-radius: 5px
  width: 100%
  height: 100%
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
  +media-min-sm()
    width: 80%
    height: 80%
body,
html
  width: 100%
  height: 100%
  margin: 0
  padding: 0
#app
  width: 100%
  height: 100%
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  background-color: #eeeeee
  display: flex
  align-items: center
  justify-content: center
</style>

<script>
import TopScroll from './components/TopScroll';
import _ from 'lodash';

const fruits = [{ image: 'maça.png', removed: false }, { image: 'pera.png', removed: false }, { image: 'uva.png', removed: false }, { image: 'laranja.png', removed: false }, { image: 'melancia.png', removed: false }, { image: 'amora.png', removed: false }];
const fruitsText = [{ text: 'apple', answer: null }, { text: 'pear', answer: null }, { text: 'grape', answer: null }, { text: 'orange', answer: null }, { text: 'watermelon', answer: null }, { text: 'raspberry', answer: null }]

export default {
  name: 'app',
  components: {
    TopScroll,
  },
  computed: {
    activeAnswers() {
      return this.answers.filter((answer) => {
        return !answer.removed;
      });
    },
    matchUpIcon() {
      if (!this.activeAnswers.length) {
        return null;
      }
      return !(this.questions[this.activeQuestion] || {}).answer;
    },
  },
  methods: {
    setActiveAnswer(index) {
      this.activeAnswer = index;
    },
    setActiveQuestion(index) {
      this.activeQuestion = index;
    },
    match() {
      const answerItem = this.activeAnswers[this.activeAnswer]
      if(!answerItem) {
        return;
      }
      answerItem.removed = true;
      const questionItem = this.questions[this.activeQuestion]
      if (questionItem.answer) {
        questionItem.answer.removed = false;
      }
      questionItem.answer = answerItem;
      const nextItemIndex = this.getNextUnansweredItem();
      this.$refs.questionsEl.scrollToItem(nextItemIndex);
    },
    getNextUnansweredItem() {
      const questions = _.cloneDeep(this.questions);
      const nextItem = questions.find(question => !question.answer);
      if (!nextItem) {
        return 0;
      }
      return this.questions.findIndex(question => question.text === nextItem.text);
    },
  },
  data() {
    return {
      activeAnswer: null,
      activeQuestion: null,
      questions: _.clone(_.shuffle(fruitsText)),
      answers: _.clone(_.shuffle(fruits)),
    };
  },
};
</script>


<style lang="sass">
.custom-scroll
  &::-webkit-scrollbar
    width: 7px
    height: 10px
    margin-right: 2px
    background: #fcfcfc
    cursor: pointer

  &::-webkit-scrollbar-thumb
    background-color: #ddd
    border-radius: 5px
    border-color: #999
    padding: 10px
    margin-right: 2px
    border-style: solid
    border-width: 10px
    background-clip: padding-box

  &::-webkit-scrollbar-thumb:active
    background-color: #333
    cursor: pointer

  &::-webkit-scrollbar-thumb:hover,
  &::-webkit-scrollbar-thumb:active
    border-width: 1px
    background-color: #888
    cursor: pointer

</style>

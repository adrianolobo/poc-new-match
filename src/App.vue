<template>
  <div id="app" class="app">
    <div class="app__header header">
      <div class="header__left">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="header__center">
        <img src="/imgs/logo-cna-go.png" alt="">
      </div>
      <div class="header__right">
        <img src="/imgs/avatar.png" alt="">
        <span>
          BILU
        </span>
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
    <div class="app__container">
      <div class="app__progress">
        <div class="progress-bar"></div>
      </div>
      <div class="app__title">
        Click to Match the options
      </div>
      <div class="activity-container">
        <div class="moldura"></div>
        <top-scroll
          class="activity-container__activity"
          :questions="questions"
          is-question
          @active-item="setActiveQuestion"
          :start-item="0"
          ref="questionsEl"
        ></top-scroll>
        <button class="match-btn" @click="match" v-if="!(matchUpIcon === null)">
          <span>
            {{ matchUpIcon ? 'Match' : 'Change' }}
          </span>
        </button>
        <top-scroll
          class="activity-container__activity"
          :questions="activeAnswers"
          @active-item="setActiveAnswer"
          :start-item="Math.floor((activeAnswers.length / 2) - 1)"
        ></top-scroll>
      </div>
      <div class="app__footer">
        <div class="footer-button">Help</div>
        <div class="footer-button footer-button_gray" :class="{ 'footer-button_check-active': (matchUpIcon === null) }">Check</div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
@import ./mobileFirst
.footer-button
  width: 100px
  height: 45px
  background-color: #2e2e78
  color: #fff
  border-radius: 5px
  display: flex
  justify-content: center
  align-items: center
  font-weight: bold
  font-size: 14px
  &_gray
    background-color: #e0e0e0
    color: #1d1d1d
  &_check-active
    background-color: #d6e702
  +media-min-md()
    font-size: 16px
    width: 145px
    height: 50px
.activity-container
  position: relative
  background-color: #fff
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  margin-bottom: 30px
  &__activity
    flex: 1
    width: 100%

.app
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
  overflow: auto
  &__title
    background-color: #fff
    width: 100%
    padding: 30px 0px 20px 0px
    font-size: 18px
    +media-min-md()
      font-size: 22px
  &__container
    border-radius: 5px
    overflow: hidden
    width: 100%
    // height: calc(100% - 75px)
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    top: 50px
    overflow: auto
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)
    position: absolute
    background-color: #fff
    +media-min-md()
      top: 75px
      width: 1185px
      margin-top: 30px
      // height: 80%
  &__progress
    height: 40px
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    background-color: #fff
    border-bottom: 1px solid #eee
  &__header
    height: 50px
    width: 100%
    top: 0
    position: fixed
    background-color: #fff
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12) !important
    +media-min-md()
      height: 75px
  &__footer
    display: flex
    border-top: 1px solid #eee
    padding: 15px
    background-color: #fff
    width: 100%
    justify-content: space-between
    flex-shrink: 0

.progress-bar
  background-color: #d6db41
  height: 10px
  width: 90%
  border-radius: 2px
.header
  display: flex
  justify-content: space-between
  align-items: center
  color: #283176
  font-size: 24px
  padding: 0px 20px
  z-index: 1000
  &__center
    img
      width: 80px
      +media-min-md()
        width: auto
  &__right
    display: flex
    justify-content: center
    align-items: center
    img
      margin-right: 20px
      width: 30px
      +media-min-md()
        width: 50px

    span
      font-weight: bold
      color: #283176
      margin-right: 20px
      font-size: 20px
      display: none
      +media-min-md()
        display: block

.moldura
  position: absolute
  height: 100%
  width: 70%
  background-color: #7abeb8
  // border: 1px dashed #332b7b
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)
  left: 50%
  transform: translateX(-50%)
  +media-min-md()
    width: 27%

.match-btn
  margin: 5px
  height: 45px
  width: 150px
  background-color: #d6e702
  border: none
  border-radius: 5px
  cursor: pointer
  font-weight: light
  font-size: 18px
  z-index: 10
  position: relative
  display: flex
  justify-content: center
  align-items: center
  +media-min-md()
    width: 200px
    height: 60px
    margin: 15px
  span
    margin-top: 5px
  &__icon
    position: absolute
    left: 35px
    font-size: 25px
  &__icon-down
    left: auto
    right: 35px
body,
html
  width: 100%
  height: 100%
  margin: 0
  padding: 0
*
  box-sizing: border-box
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
        console.log('!answerItem');
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
      questions.rotate(this.activeQuestion);
      const nextItem = questions.find(question => !question.answer);
      if (!nextItem) {
        console.log('nextItem')
        return 0;
      }
      console.log('getNextUnanswerItem')
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

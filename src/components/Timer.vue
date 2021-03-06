<template>
  <v-responsive>
    <div v-if="condensed" class="text-xs-center">
      <v-card-text class="display-3">{{ secondsLeft | timeRemaining }}</v-card-text>
    </div>

    <v-layout v-else row pb-2>
      <v-progress-circular
        v-if="$vuetify.breakpoint.smAndUp"
        :size="size"
        :width="width"
        :value="ratio"
        rotate="-90"
      >
        <v-card-text class="display-4">{{ secondsLeft | timeRemaining }}</v-card-text>
        <v-card-text
          v-if="breakFrequency > 0"
          class="display-4 text-md-center font-weight-black"
        >{{ breakMessage }}</v-card-text>
      </v-progress-circular>
    </v-layout>

    <v-layout row>
      <v-btn
        block
        large
        @click="toggleTimer(!isRunning)"
        :color="isRunning ? 'error' : 'success'"
        :disabled="disabled"
      >{{ buttonLabel }}</v-btn>
    </v-layout>
  </v-responsive>
</template>

<script>
import EventBus from "../utils/event-bus";
import { Stopwatch } from "stopwatch";
import { mapGetters } from "vuex";
import moment from "moment";
import eventBus from "../utils/event-bus";

export default {
  props: ["disabled", "condensed"],

  data: () => ({
    size: 450,
    width: 125,
    isRunning: false,
    stopwatch: { start: () => {}, stop: () => {} },
    buttonLabel: "Start",
    secondsLeft: 0,
    totalSeconds: 0,
    rotation: 0
  }),

  watch: {
    breakFrequency(newValue) {
      this.rotation = 0;
    },

    cycleTime(newValue) {
      this.secondsLeft = new moment.duration(newValue).asSeconds();
      this.totalSeconds = this.secondsLeft;
      this.resetTimer();
    },

    isRunning(newValue) {
      this.buttonLabel = newValue ? "Pause" : "Start";
    }
  },

  computed: {
    ...mapGetters(["cycleTime", "breakFrequency"]),

    ratio() {
      return (this.secondsLeft / this.totalSeconds) * 100;
    },

    breakMessage() {
      let rotations = this.breakFrequency - this.rotation;
      return `${rotations} More Turn${rotations > 1 ? "s" : ""}!`;
    }
  },

  filters: {
    timeRemaining: function(secondsLeft) {
      let duration = new moment.duration({ seconds: secondsLeft });
      let hours = ("0" + duration.hours()).slice(-2);
      let minutes = ("0" + duration.minutes()).slice(-2);
      let seconds = ("0" + duration.seconds()).slice(-2);
      let timeRemaining = `${hours}:${minutes}:${seconds}`;

      eventBus.$emit("timerTick", timeRemaining);

      return timeRemaining;
    }
  },

  created() {
    let self = this;
    EventBus.$on('reset-timer', () => {
      self.resetTimer();
    });
    
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  methods: {
    resetTimer() {
      this.stopwatch.stop();
      this.isRunning = false;
      this.stopwatch = new Stopwatch(1, { seconds: this.totalSeconds });

      this.stopwatch.on("tick", secondsLeft => {
        this.secondsLeft = secondsLeft;
      });

      this.stopwatch.on("end", _ => {
        this.rotateMobster();
      });
    },

    toggleTimer(isRunning) {
      this.isRunning = isRunning;

      if (this.isRunning) {
        this.stopwatch.start();
      } else {
        this.stopwatch.stop();
      }
    },

    rotateMobster() {
      this.resetTimer();
      this.rotation++;

      if (this.breakFrequency > 0 && this.rotation === this.breakFrequency) {
        this.rotation = 0;
        eventBus.$emit("takeABreak");
      } else {
        eventBus.$emit("rotateMobster");
        this.toggleTimer(true);
      }
    },

    handleResize() {
      let maxWidth = window.innerWidth / 2;
      let maxHeight = window.innerHeight - 200;

      this.size = maxHeight < maxWidth ? maxHeight : maxWidth;
      this.width = (30 / 450) * this.size;
    }
  }
};
</script>

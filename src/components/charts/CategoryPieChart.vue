<template>
  <div class="chart-wrapper">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const props = defineProps({
  data: Object,
  options: Object
})

const chartData = computed(() => props.data)
const chartOptions = computed(() => props.options)
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>

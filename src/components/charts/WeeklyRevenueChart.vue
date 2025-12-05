<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartDataLabels
)

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

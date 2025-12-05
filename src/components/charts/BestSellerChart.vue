<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
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

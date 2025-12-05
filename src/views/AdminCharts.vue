<template>
  <ion-page>
    <ion-content fullscreen class="analytics-page">
      <div class="shell">

        <div class="top">
          <div>
            <h1>Store Analytics</h1>
            <p class="subtitle">Orders, revenue and category performance</p>
          </div>

          <ion-button size="small" color="primary" @click="exportPDF">
            Export PDF
          </ion-button>
        </div>

        <textarea
          v-model="notes"
          class="notes-box"
          placeholder="Write admin notes for this report. These will be included in the exported PDF."
        ></textarea>

        <div v-if="isLoading" class="state">
          Loading analytics…
        </div>

        <div v-else class="charts">
          <div class="chart-row">
            <div class="chart-card">
              <div class="chart-header">
                <h2>Weekly Revenue</h2>
              </div>
              <div class="chart-inner big">
                <WeeklyRevenueChart
                  v-if="weeklyRevenueChartData"
                  ref="weeklyRevenueChartRef"
                  :data="weeklyRevenueChartData"
                  :options="lineChartOptions"
                />
                <div v-else class="empty-chart">No data for weekly revenue</div>
              </div>
            </div>
          </div>

          <div class="chart-row two">
            <div class="chart-card">
              <div class="chart-header">
                <h2>Category Breakdown</h2>
              </div>
              <div class="chart-inner medium">
                <CategoryPieChart
                  v-if="categoryPieChartData"
                  ref="categoryPieChartRef"
                  :data="categoryPieChartData"
                  :options="pieChartOptions"
                />
                <div v-else class="empty-chart">No category data</div>
              </div>
            </div>

            <div class="chart-card">
              <div class="chart-header">
                <h2>Best Selling Products</h2>
              </div>
              <div class="chart-inner medium">
                <BestSellerChart
                  v-if="bestSellerChartData"
                  ref="bestSellerChartRef"
                  :data="bestSellerChartData"
                  :options="barChartOptions"
                />
                <div v-else class="empty-chart">No product sales data</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { db } from '@/firebase/config'
import { collection, onSnapshot } from 'firebase/firestore'

import WeeklyRevenueChart from '@/components/charts/WeeklyRevenueChart.vue'
import CategoryPieChart from '@/components/charts/CategoryPieChart.vue'
import BestSellerChart from '@/components/charts/BestSellerChart.vue'

import jsPDF from 'jspdf'

const isLoading = ref(true)
const orders = ref([])

const weeklyRevenueChartData = ref(null)
const categoryPieChartData = ref(null)
const bestSellerChartData = ref(null)

const weeklyRevenueChartRef = ref(null)
const categoryPieChartRef = ref(null)
const bestSellerChartRef = ref(null)

const firestoreUnsubscribe = ref(null)

const baseFontSize = 14
const labelFontSize = 14
const tooltipFontSize = 14
const dataLabelSize = 18

const notes = ref('')

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: { size: labelFontSize }
      }
    },
    tooltip: {
      bodyFont: { size: tooltipFontSize },
      titleFont: { size: tooltipFontSize },
      bodyColor: '#ffffff',
      titleColor: '#ffffff',
      callbacks: {
        label: context => {
          const v = typeof context.parsed?.y === 'number' ? context.parsed.y : 0
          return `€${v.toFixed(2)}`
        }
      }
    },
    datalabels: {
      color: '#000000',
      anchor: 'end',
      align: 'top',
      font: {
        size: 14,
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        font: { size: labelFontSize }
      }
    },
    y: {
      ticks: {
        font: { size: labelFontSize },
        callback: value => `€${value}`
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: labelFontSize }
      }
    },
    tooltip: {
      bodyFont: { size: tooltipFontSize },
      callbacks: {
        label: context => {
          const value = Number(context.parsed)
          return `${context.label}: ${value} pcs`
        }
      }
    },
    datalabels: {
      display: true,
      color: '#000000',
      font: {
        weight: 'bold',
        size: dataLabelSize
      },
      formatter: value => value
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 24
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      bodyColor: '#ffffff',
      titleColor: '#ffffff',
      bodyFont: { size: tooltipFontSize },
      callbacks: {
        label: context => {
          const v = typeof context.parsed?.y === 'number' ? context.parsed.y : 0
          return `${v} units`
        }
      }
    },
    datalabels: {
      color: '#000000',
      anchor: 'end',
      align: 'end',
      offset: -2,
      font: {
        size: 14,
        weight: 'bold'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#000',
        font: { size: labelFontSize },
        maxRotation: 35,
        minRotation: 20
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: '#000',
        font: { size: labelFontSize }
      }
    }
  }
}

const buildWeeklyRevenueChartData = () => {
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dailyRevenueTotals = [0, 0, 0, 0, 0, 0, 0]

  orders.value.forEach(order => {
    let orderDate = null

    if (order.createdAt && typeof order.createdAt.toDate === 'function') {
      orderDate = order.createdAt.toDate()
    } else if (order.createdAt) {
      orderDate = new Date(order.createdAt)
    }

    if (!orderDate || isNaN(orderDate.getTime())) return

    const dayOfWeek = orderDate.getDay()
    const arrayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    const orderTotalValue = Number(
      typeof order.total === 'number'
        ? order.total
        : typeof order.totalAmount === 'number'
        ? order.totalAmount
        : 0
    )

    dailyRevenueTotals[arrayIndex] += orderTotalValue
  })

  weeklyRevenueChartData.value = {
    labels: dayLabels,
    datasets: [
      {
        label: 'Revenue €',
        data: dailyRevenueTotals,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.18)',
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35
      }
    ]
  }
}

const buildCategoryPieChartData = () => {
  const categoryCounts = {}

  orders.value.forEach(order => {
    if (!order.items) return

    order.items.forEach(orderItem => {
      const categoryKey = orderItem.category || 'other'
      const itemQuantity = Number(
        typeof orderItem.quantity === 'number'
          ? orderItem.quantity
          : typeof orderItem.qty === 'number'
          ? orderItem.qty
          : 0
      )

      categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + itemQuantity
    })
  })

  const labels = Object.keys(categoryCounts)
  const values = Object.values(categoryCounts)

  if (!labels.length) {
    categoryPieChartData.value = null
    return
  }

  categoryPieChartData.value = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#2563eb',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#6366f1',
          '#14b8a6'
        ]
      }
    ]
  }
}

const buildBestSellerChartData = () => {
  const productSalesTotals = {}

  orders.value.forEach(order => {
    if (!order.items) return

    order.items.forEach(orderItem => {
      const productKey = orderItem.name || orderItem.productId || 'Unknown'
      const itemQuantity = Number(
        typeof orderItem.quantity === 'number'
          ? orderItem.quantity
          : typeof orderItem.qty === 'number'
          ? orderItem.qty
          : 0
      )

      productSalesTotals[productKey] =
        (productSalesTotals[productKey] || 0) + itemQuantity
    })
  })

  const labels = Object.keys(productSalesTotals)
  const values = Object.values(productSalesTotals)

  if (!labels.length) {
    bestSellerChartData.value = null
    return
  }

  bestSellerChartData.value = {
    labels,
    datasets: [
      {
        label: 'Units Sold',
        data: values,
        backgroundColor: 'rgba(37,99,235,0.9)'
      }
    ]
  }
}

const startOrdersListener = () => {
  const ordersCollectionReference = collection(db, 'orders')

  const unsubscribeFunction = onSnapshot(
    ordersCollectionReference,
    snapshot => {
      orders.value = snapshot.docs.map(documentSnapshot => documentSnapshot.data())
      buildWeeklyRevenueChartData()
      buildCategoryPieChartData()
      buildBestSellerChartData()
      isLoading.value = false
    },
    () => {
      isLoading.value = false
    }
  )

  firestoreUnsubscribe.value = unsubscribeFunction
}

const getTotalRevenue = () => {
  return orders.value.reduce((sum, order) => {
    const val = Number(
      typeof order.total === 'number'
        ? order.total
        : typeof order.totalAmount === 'number'
        ? order.totalAmount
        : 0
    )
    return sum + val
  }, 0)
}

const getTotalItemsSold = () => {
  let total = 0
  orders.value.forEach(order => {
    if (!order.items) return

    order.items.forEach(orderItem => {
      const qty = Number(
        typeof orderItem.quantity === 'number'
          ? orderItem.quantity
          : typeof orderItem.qty === 'number'
          ? orderItem.qty
          : 0
      )

      total += qty
    })
  })
  return total
}

const exportPDF = async () => {
  await nextTick()

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const pageMargin = 10
  const usableWidth = pageWidth - pageMargin * 2

  const chartComponentRefs = [
    { ref: weeklyRevenueChartRef.value, title: 'Weekly Revenue' },
    { ref: categoryPieChartRef.value, title: 'Category Breakdown' },
    { ref: bestSellerChartRef.value, title: 'Best Selling Products' }
  ]

  let currentY = pageMargin

  pdf.setFontSize(18)
  pdf.text('Store Analytics', pageMargin, currentY)
  currentY += 7

  pdf.setFontSize(11)
  pdf.setTextColor(110, 118, 129)
  pdf.text('Orders, revenue and category performance', pageMargin, currentY)
  pdf.setTextColor(0, 0, 0)
  currentY += 8

  pdf.text(`Total orders: ${orders.value.length}`, pageMargin, currentY)
  currentY += 5
  pdf.text(`Total revenue: €${getTotalRevenue().toFixed(2)}`, pageMargin, currentY)
  currentY += 5
  pdf.text(`Total items sold: ${getTotalItemsSold()}`, pageMargin, currentY)
  currentY += 10

  for (const { ref: chartComponent, title } of chartComponentRefs) {
    if (!chartComponent) continue

    const canvas = chartComponent.$el.querySelector('canvas')
    if (!canvas) continue

    const img = canvas.toDataURL('image/png', 1.0)
    const aspect = canvas.height / canvas.width
    const drawWidth = usableWidth
    const drawHeight = drawWidth * aspect

    if (currentY + drawHeight > pageHeight - pageMargin) {
      pdf.addPage()
      currentY = pageMargin
    }

    pdf.setFontSize(14)
    pdf.text(title, pageMargin, currentY)
    currentY += 6

    pdf.addImage(img, 'PNG', pageMargin, currentY, drawWidth, drawHeight)
    currentY += drawHeight + 6

    if (title === 'Category Breakdown') {
      const labels = categoryPieChartData.value.labels || []
      const values = categoryPieChartData.value.datasets[0].data || []

      pdf.setFontSize(12)

      for (let i = 0; i < labels.length; i++) {
        const text = `${labels[i]}: ${values[i]}`
        pdf.text(text, pageMargin, currentY)
        currentY += 6
      }

      currentY += 8
    }
  }

  pdf.addPage()
  let currentYNotes = pageMargin
  pdf.setFontSize(18)
  pdf.text('Admin Notes', pageMargin, currentYNotes)
  currentYNotes += 8
  pdf.setFontSize(12)
  const noteText = notes.value && notes.value.trim().length ? notes.value : 'No notes'
  const noteLines = pdf.splitTextToSize(noteText, usableWidth)
  pdf.text(noteLines, pageMargin, currentYNotes)

  pdf.save('store-analytics.pdf')
}

onMounted(() => {
  startOrdersListener()
})

onUnmounted(() => {
  if (typeof firestoreUnsubscribe.value === 'function') {
    firestoreUnsubscribe.value()
  }
})
</script>

<style scoped>
.analytics-page {
  --background: #f3f4f6;
}

.shell {
  max-width: 1500px;
  margin: 0 auto;
  padding: 96px 20px 40px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.notes-box {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 20px;
  display: block;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  background: #f9fafb;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
}

.subtitle {
  margin-top: 4px;
  font-size: 14px;
  color: #6b7280;
}

.state {
  text-align: center;
  padding: 40px 0;
  font-size: 16px;
  color: #6b7280;
}

.charts {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.chart-row {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.chart-row.two {
  flex-direction: row;
  gap: 22px;
}

.chart-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 18px;
  flex: 1;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.07);
}

.chart-header h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 700;
}

.chart-inner {
  width: 100%;
  position: relative;
}

.chart-inner.big {
  height: 460px;
}

.chart-inner.medium {
  height: 360px;
}

.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
  font-size: 14px;
}

@media (max-width: 1100px) {
  .chart-row.two {
    flex-direction: column;
  }

  .chart-inner.big {
    height: 400px;
  }

  .chart-inner.medium {
    height: 320px;
  }
}

@media (max-width: 600px) {
  .shell {
    padding: 80px 14px 30px;
  }

  h1 {
    font-size: 26px;
  }

  .chart-card {
    padding: 14px;
    border-radius: 16px;
  }

  .chart-inner.big {
    height: 340px;
  }

  .chart-inner.medium {
    height: 280px;
  }
}
</style>

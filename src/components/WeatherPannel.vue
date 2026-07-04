<template>
  <div class="weather-panel-v2 glass-card">
    <div class="panel-header">
      <span class="date-today">Aujourd'hui</span>
      <h2>{{ weather.region }}</h2>
    </div>

    <div class="main-weather-card">
      <div class="main-temp-box">
        <span class="main-temp">{{ weather.temp.toFixed(0) }}°C</span>
        <span class="weather-desc">Ciel dégagé</span>
      </div>
      <div class="weather-icon-box">
        <div class="sun-cloud-icon">☀️</div>
      </div>
    </div>

    <div class="secondary-stats-grid glass-card">
      <div class="sub-stat">
        <span class="sub-icon">💧</span>
        <span class="sub-value">{{ weather.humidity }}%</span>
        <span class="sub-label">Humidité</span>
      </div>
      <div class="sub-stat-divider"></div>
      <div class="sub-stat">
        <span class="sub-icon">💨</span>
        <span class="sub-value">12 m/s</span>
        <span class="sub-label">Vent</span>
      </div>
      <div class="sub-stat-divider"></div>
      <div class="sub-stat">
        <span class="sub-icon">🌾</span>
        <span class="sub-value">Optimal</span>
        <span class="sub-label">Sol</span>
      </div>
    </div>

    <div :class="['risk-section-v2', riskDetails.class]">
      <div class="risk-title-box">
        <h3>Risque Agricole : {{ riskDetails.level }}</h3>
      </div>
      <div class="gauge-container-v2">
        <div class="gauge-bar-v2" :style="{ width: riskDetails.gaugeWidth }"></div>
      </div>
      <p class="risk-message-v2">{{ riskDetails.message }}</p>
    </div>

    <div class="chart-container-v2">
      <h3>Évolution Température (7j)</h3>
      <div class="canvas-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  weather: { type: Object, required: true }
})

const chartCanvas = ref(null)
let chartInstance = null

const riskDetails = computed(() => {
  const t = props.weather.temp
  const h = props.weather.humidity

  if (t > 35 || h < 30) {
    return { level: 'ÉLEVÉ', class: 'risk-high-v2', gaugeWidth: '100%', message: '⚠️ Irrigation d\'urgence recommandée.' }
  } else if ((t >= 30 && t <= 35) || (h >= 30 && h <= 50)) {
    return { level: 'MODÉRÉ', class: 'risk-medium-v2', gaugeWidth: '60%', message: 'Surveillez l\'évapotranspiration.' }
  } else {
    return { level: 'FAIBLE', class: 'risk-low-v2', gaugeWidth: '20%', message: 'Conditions optimales.' }
  }
})

const renderChart = () => {
  if (chartInstance) { chartInstance.destroy() }

  const days = ['J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'Auj.']
  const simulatedData = Array.from({ length: 6 }, () => 
    parseFloat((props.weather.temp + (Math.random() * 4 - 2)).toFixed(1))
  )
  simulatedData.push(parseFloat(props.weather.temp.toFixed(1)))

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Température (°C)',
        data: simulatedData,
        borderColor: '#ffffff', // Ligne blanche épurée comme sur l'image
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointRadius: 0, // Cache les points pour un effet courbe lisse
        pointHoverRadius: 5,
        tension: 0.4, // Courbe très fluide (Spline)
        fill: true, // Création du dégradé sous la courbe comme l'effet montagne de l'image
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
          return gradient;
        },
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }, // Masque la légende pour faire épuré
      scales: {
        x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.6)' } },
        y: { display: false, grid: { display: false } } // Masque l'axe Y pour copier l'image
      }
    }
  })
}

watch(() => props.weather, () => { if (chartCanvas.value) renderChart() }, { deep: true })
onMounted(() => { renderChart() })
</script>
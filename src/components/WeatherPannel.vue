<template>
  <div class="weather-panel">
    <h2>Météo Agricole : {{ weather.region }}</h2>
    
    <div class="weather-stats">
      <div class="stat-card">
        <span class="stat-label">Température</span>
        <span class="stat-value">{{ weather.temp.toFixed(1) }}°C</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Humidité</span>
        <span class="stat-value">{{ weather.humidity }}%</span>
      </div>
    </div>

    <div :class="['risk-alert', riskDetails.class]">
      <h3>Risque Agricole : {{ riskDetails.level }}</h3>
      <div class="gauge-container">
        <div class="gauge-bar" :style="{ width: riskDetails.gaugeWidth }"></div>
      </div>
      <p>{{ riskDetails.message }}</p>
    </div>

    <div class="chart-container">
      <h3>Évolution de la Température (7 derniers jours)</h3>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto' // Importation automatique de tout Chart.js

// On reçoit les données météo du parent (App.vue)
const props = defineProps({
  weather: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

// --- ÉTAPE C : L'ALGORITHME DE CALCUL DES RISQUES ---
const riskDetails = computed(() => {
  const t = props.weather.temp
  const h = props.weather.humidity

  if (t > 35 || h < 30) {
    return {
      level: 'ÉLEVÉ',
      class: 'risk-high',
      gaugeWidth: '100%',
      message: '⚠️ Alerte stress thermique ou sécheresse. Irrigation d\'urgence recommandée.'
    }
  } else if ((t >= 30 && t <= 35) || (h >= 30 && h <= 50)) {
    return {
      level: 'MODÉRÉ',
      class: 'risk-medium',
      gaugeWidth: '60%',
      message: 'Slight stress détecté. Surveillez l\'évapotranspiration des sols.'
    }
  } else {
    return {
      level: 'FAIBLE',
      class: 'risk-low',
      gaugeWidth: '20%',
      message: 'Conditions optimales pour les cultures de la région.'
    }
  }
})

// --- ÉTAPE D : SIMULATION ET DESSIN DU GRAPHIQUE ---
const renderChart = () => {
  // Sécurité : Si un graphique existe déjà, on le détruit avant de refaire le nouveau
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Génération de 7 jours historiques fictifs mais cohérents (ex: temp du jour +- 3°C)
  const days = ['J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'Aujourd\'hui']
  const simulatedData = Array.from({ length: 6 }, () => 
    parseFloat((props.weather.temp + (Math.random() * 6 - 3)).toFixed(1))
  )
  simulatedData.push(parseFloat(props.weather.temp.toFixed(1))) // Le 7ème jour est la vraie température

  // Configuration de Chart.js
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line', // Graphique en courbe
    data: {
      labels: days,
      datasets: [{
        label: 'Température (°C)',
        data: simulatedData,
        borderColor: '#2e7d32', // Ligne verte agricole
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.3, // Courbe fluide
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

// Réagir immédiatement si l'utilisateur change de région pour redessiner le graphique
watch(() => props.weather, () => {
  if (chartCanvas.value) {
    renderChart()
  }
}, { deep: true })

// Premier dessin quand le panneau apparaît
onMounted(() => {
  renderChart()
})
</script>
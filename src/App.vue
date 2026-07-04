
<template>
  <div class="app-container">
    <header>
      <h1>Suivi Risques Climatiques - Agriculture Sénégal</h1>
    </header>

    <main>
      <!-- Intégration de la carte et écoute de l'événement personnalisé -->
      <SenegalMap @region-selected="handleRegionSelection" />

      <div v-if="loading" class="loading-box">
        <div class="spinner"></div>
        <p>Récupération des données météo en direct...</p>
      </div>
      
      <div v-if="error" class="error-box">
         {{ error }}
      </div>

      <!-- <div v-if="weatherData && !loading" style="margin-top:20px; padding:15px; background:#fff; border-radius:8px;">
        <h3>Données météo reçues pour : {{ weatherData.region }}</h3>
        <p>Température : <strong>{{ weatherData.temp.toFixed(1) }}°C</strong></p>
        <p>Humidité : <strong>{{ weatherData.humidity }}%</strong></p>
        <p>Ciel : {{ weatherData.description }}</p>
      </div> -->
      <WeatherPannel 
  v-if="weatherData && !loading" 
  :weather="weatherData" 
/>
  
    </main>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import './assets/styles/main.css'
import SenegalMap from './components/SenegalMap.vue'
import { useWeather } from './composables/useWeather'
import WeatherPannel from './components/WeatherPannel.vue'

// Variable visuelle qui contient l'id pour que la carte sache quelle region a été seclectionnée
const activeRegionId = ref(null)

// Fonction qui réagit quand l'enfant (SenegalMap) envoie l'événement 'region-selected'
// const handleRegionSelection = (regionId) => {
//   activeRegionId.value = regionId
//   console.log("Région active dans l'application :", regionId)
// }

// 2. Outil météo
const { weatherData, loading, error, fetchWeather, getUserLocation } = useWeather()

// 3. Cycle de vie : Dès que l'application s'affiche à l'écran, on lance la géolocalisation automatique
onMounted(() => {
  getUserLocation()
})

// 4. Quand on clique sur la carte, on demande au moteur d'aller chercher la météo de cette région
const handleRegionSelection = (regionId) => {
  activeRegionId.value = regionId
  if (regionId) {
    //Si une région est sélectionnée, on lance la recherche API
    fetchWeather(regionId)
  } else {
    // Si on a recliqué sur la même région (désélection), on vide la météo
    weatherData.value = null
  }
}

</script>
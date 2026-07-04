

 <template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">Agri<span class="logo-accent">Météo</span></div>
    </header>

    <main class="main-content">
      <div class="column-left">
        <SenegalMap />
      </div>
      
      <div class="column-right">
        <WeatherPannel 
          v-if="weatherData && !loading" 
          :weather="weatherData" 
        />
      </div>
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
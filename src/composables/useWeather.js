import { ref } from 'vue'

export function useWeather() {
  // 1. Les 3 états du brief
  const weatherData = ref(null) // stocke les données de la météo
  const loading = ref(false) // l'etat quand la recherche est lancée qui devient true
  const error = ref(null) // l'etat si erreur de chargement , contient le msg d'erreur

  // clé OpenWeatherMap obtenue sur le site
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY 

  // 2. Fonction principale pour aller chercher la météo via une région ou des coordonnées
  const fetchWeather = async (regionName, lat = null, lon = null) => {
    loading.value = true  // L'application commence à chercher -> on active le spinner
    error.value = null    // On efface les anciennes erreurs s'il y en avait
    weatherData.value = null

    // Construction de l'URL de demande pour le serveur météo avec le nom de la région
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${regionName},SN&units=metric&lang=fr&appid=${API_KEY}`
    
    // Construction de l'URL de demande pour le serveur météo avec les coordonnées longitude et latitude
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`
    }

    try {
      // Le messager (Fetch API) part sur Internet
      const response = await fetch(url)
      
      // Sécurité : Si le serveur répond avec un code d'erreur
      if (!response.ok) {
        throw new Error("Impossible de récupérer les données météo pour cette zone.")
      }

      // On transforme le texte reçu en un objet JavaScript propre (JSON)
      const data = await response.json()
      
      // On extrait proprement uniquement les données dont le brief a besoin
      weatherData.value = {
        region: regionName || data.name,
        temp: data.main.temp,          // Température brute en Celsius
        humidity: data.main.humidity,  // Taux d'humidité en %
        description: data.weather[0].description, // Ex: "légère pluie"
        icon: data.weather[0].icon      // Code de l'icône dynamique (ex: "01d")
      }
    } catch (err) {
      // Étape F : Gestion élégante de l'erreur sans faire planter l'interface
      error.value = err.message || "Une erreur réseau est survenue."
    } finally {
      loading.value = false // Qu'on ait réussi ou échoué, le chargement est terminé
    }
  }

  // 3. Fonction de Géolocalisation automatique (Étape B)
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      // Si le navigateur est trop vieux et n'a pas la géolocalisation
      fetchWeather('Dakar')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeather(null, latitude, longitude)
      },
      (err) => {
        // Si l'utilisateur refuse ou que ça rate -> redirection sur Dakar par défaut
        console.warn("Géolocalisation refusée ou impossible, chargement de Dakar par défaut.")
        fetchWeather('Dakar')
      }
    )
  }

  // On expose nos outils pour que les composants puissent les utiliser
  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    getUserLocation
  }
}
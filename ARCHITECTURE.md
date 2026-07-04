# Réflexion Critique : Intégration de l'IA dans le Suivi des Risques Climatiques
**Auteur :** Maryam Harouna P9 Dev web Mobile + IA
**Projet :** Application AgriMétéo Sénégal

Dans le cadre de cette application d'aide à la décision agricole, nous avons évalué l'opportunité d'intégrer un modèle d'Intelligence Artificielle (type LLM ou modèle prédictif dédié) pour générer les alertes de risques à la place d'un algorithme déterministe basé sur des règles strictes. Voici l'analyse comparative (Pour / Contre) menée.

---

## Analyse Comparative

### 1. Les Avantages (Le Pour)
* **Pertinence et contextualisation :** Une IA pourrait croiser la météo en direct avec l'historique de la région sur 10 ans, le type de culture (mil, arachide, riz) et le calendrier cultural pour donner des conseils ultra-personnalisés au lieu d'alertes génériques.
* **Adaptabilité :** Le modèle peut apprendre des retours des agriculteurs d'une saison à l'autre pour affiner ses seuils de tolérance à la chaleur.

### 2. Les Inconvénients (Le Contre)
* **Coût financier :** L'utilisation d'API d'IA (ex: OpenAI, Anthropic) engendre des coûts par requête (tokens). Pour une application à destination de milliers de producteurs locaux, l'infrastructure deviendrait rapidement onéreuse, contrairement à notre solution actuelle 100% gratuite.
* **Latence réseau :** Obtenir une réponse d'un LLM prend entre 1 et 3 secondes, ce qui dégraderait l'expérience utilisateur par rapport à notre architecture Vue 3 réactive où les propriétés calculées (`computed`) s'exécutent instantanément (en quelques millisecondes).
* **Hallucinations et fiabilité (Crucial pour l'agriculture) :** Une IA peut inventer des faits ou donner un conseil d'irrigation erroné en cas de mauvaise interprétation. Dans le secteur agricole, une mauvaise décision peut détruire une récolte entière. L'algorithme déterministe actuel garantit une fiabilité et une prédictibilité mathématique totale.

---

##  Conclusion Architecturales
Pour cette version, le choix s'est porté sur **un algorithme basé sur des règles strictes** (Seuils de température et d'humidité) combiné à un calcul réactif local. Ce choix garantit :
1. Une **latence zéro** pour l'utilisateur.
2. Une **sécurité maximale** des données fournies (zéro hallucination).
3. Une **viabilité économique** totale du projet à long terme.

L'usage de l'IA serait pertinent uniquement dans un second temps, de manière asynchrone, pour générer des rapports de synthèse hebdomadaires et non pour des alertes en temps réel.
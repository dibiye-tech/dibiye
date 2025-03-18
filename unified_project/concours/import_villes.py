import requests
from concours import Ville  # Remplace "your_app" par le nom de ton application

# URL de l'API Nominatim pour récupérer les villes du Cameroun
URL = "https://nominatim.openstreetmap.org/search?country=Cameroun&featureClass=P&format=json&limit=1000"

def import_villes():
    response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
    if response.status_code == 200:
        villes_data = response.json()

        for ville in villes_data:
            nom = ville.get("display_name", "").split(",")[0]  # Récupère le nom de la ville
            latitude = ville.get("lat", None)
            longitude = ville.get("lon", None)

            if not Ville.objects.filter(name=nom).exists():
                Ville.objects.create(
                    name=nom,
                    latitude=float(latitude),
                    longitude=float(longitude),
                    departement="Inconnu",
                    region="Inconnu",
                    arrondissements="",
                )
                print(f"✅ Ajouté : {nom} ({latitude}, {longitude})")
            else:
                print(f"⚠️ Déjà existant : {nom}")

    else:
        print(f"❌ Erreur {response.status_code} lors de la récupération des villes")

# Exécute l'importation
import_villes()

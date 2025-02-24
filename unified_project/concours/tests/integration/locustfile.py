from locust import HttpUser, task, between

class UserBehavior(HttpUser):
    wait_time = between(1, 3)  # Pause entre les requêtes (1 à 3 sec)

    @task
    def view_homepage(self):
        """🔹 Accéder à la page d'accueil"""
        self.client.get("/", name="Accueil")

    @task
    def view_bibliotheque(self):
        """🔹 Accéder à la bibliothèque"""
        self.client.get("/bibliotheque", name="Bibliothèque")

    @task
    def view_about(self):
        """🔹 Accéder à la page À propos"""
        self.client.get("/about", name="À propos")

    @task
    def view_concours(self):
        """🔹 Accéder à la page des concours"""
        self.client.get("/homeconcours", name="Concours")

    # @task
    # def login(self):
    #     """🔹 Test de connexion utilisateur"""
    #     response = self.client.post("/api/auth/login/", json={
    #         "username": "Francky",
    #         "password": "Franckchristy1"
    #     }, name="Connexion")

    #     if response.status_code == 200:
    #         token = response.json().get("access")
    #         self.client.headers.update({"Authorization": f"Bearer {token}"})
    #         print("✅ Connexion réussie")
    #     else:
    #         print("❌ Échec de connexion")

    # @task
    # def view_favorites(self):
    #     """🔹 Accéder aux concours favoris après connexion"""
    #     self.client.get("/favorites", name="Favoris")

    # @task
    # def logout(self):
    #     """🔹 Déconnexion"""
    #     self.client.post("/api/auth/logout/", name="Déconnexion")

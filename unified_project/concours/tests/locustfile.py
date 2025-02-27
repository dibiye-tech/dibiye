from locust import HttpUser, task, between

# --- Utilisateurs Frontend (serveur sur le port 3000) ---
class FrontendUser(HttpUser):
    host = "http://localhost:5173"
    wait_time = between(1, 3)

    @task
    def view_homepage(self):
        self.client.get("/", name="Accueil")

    @task
    def view_bibliotheque(self):
        self.client.get("/bibliotheque/", name="Bibliothèque")
        # Ajoutez le slash final si nécessaire

    @task
    def view_about(self):
        self.client.get("/about/", name="À propos")
        # Vérifiez que cette route est disponible sur ce host

    @task
    def view_concours(self):
        self.client.get("/homeconcours/", name="Concours")


# --- Utilisateurs Backend (serveur sur le port 8000) ---
class BackendUser(HttpUser):
    host = "http://localhost:8000"
    wait_time = between(1, 3)

    def on_start(self):
        """
        Authentification au démarrage.
        Envoie une requête POST à l'endpoint d'authentification pour obtenir un token JWT,
        puis ajoute ce token aux headers par défaut.
        """
        credentials = {
            "username": "Francky",          # Vérifiez que cet utilisateur existe
            "password": "Franckchristy1"      # Mot de passe valide
        }
        # Modification : utiliser l'endpoint correct sans le préfixe /app/
        response = self.client.post("/auth/jwt/create/", json=credentials, name="Obtenir un JWT")
        if response.status_code == 200:
            self.token = response.json().get("access")
            self.client.headers.update({"Authorization": f"JWT {self.token}"})
        else:
            self.token = None
            print("Erreur lors de l'obtention du token:", response.text)

    # --------------------------------------------------
    # Section Concours (accessible sous /concours/)
    # --------------------------------------------------
    @task
    def view_published_concours(self):
        self.client.get("/concours/published_concours/", name="Published Concours")

    @task
    def view_concourscategories(self):
        self.client.get("/concours/concourscategories/", name="Concours Catégories")

    @task
    def view_testimonials(self):
        self.client.get("/concours/testimonials/", name="Testimonials")

    @task
    def view_concourssubcategories(self):
        self.client.get("/concours/concourssubcategories/", name="Concours Sous-Catégories")

    @task
    def view_universities(self):
        self.client.get("/concours/universities/", name="Universités")



    # --------------------------------------------------
    # Section App (accessible sous /app/)
    # --------------------------------------------------
    @task
    def view_exists(self):
        # Supposons que cet endpoint attend une méthode POST avec un payload
        payload = {"username": "Francky"}
        self.client.post("/app/exists/", json=payload, name="Vérification Username")

    @task
    def view_categories(self):
        self.client.get("/app/categories/", name="Liste des Catégories")

    @task
    def view_category_detail(self):
        self.client.get("/app/categories/1/", name="Détail d'une Catégorie")

    @task
    def view_souscategories(self):
        self.client.get("/app/souscategories/", name="Liste des Sous-Catégories")

    @task
    def view_souscategory_detail(self):
        self.client.get("/app/souscategories/1/", name="Détail d'une Sous-Catégorie")

    @task
    def view_recent_documents(self):
        self.client.get("/app/documents/recent/", name="Documents Récents")

    @task
    def view_documents_by_category(self):
        self.client.get("/app/documents/category/1/", name="Documents par Catégorie")

    @task
    def view_documents_by_sous_category(self):
        self.client.get("/app/documents/sous_category/1/", name="Documents par Sous-Catégorie")

    @task
    def view_documents_by_branche(self):
        self.client.get("/app/documents/sous_category/1/branche/1/", name="Documents par Branche")

    @task
    def view_user_update(self):
        # Supposons que cette action nécessite PATCH au lieu de GET
        payload = {"first_name": "Test"}
        self.client.patch("/app/user/update/", json=payload, name="User Update")

    @task
    def view_history(self):
        self.client.get("/app/history/", name="Liste de l'Historique")

    @task
    def view_favorites(self):
        self.client.get("/app/favorites/", name="Liste des Favoris")

    @task
    def view_classeur(self):
        self.client.get("/app/classeur/", name="Liste des Classeurs")

    # @task
    # def get_jwt(self):
    #     credentials = {
    #         "username": "testuser",   # Adaptez selon vos besoins
    #         "password": "testpassword"
    #     }
    #     self.client.post("/auth/jwt/create/", json=credentials, name="Obtenir un JWT")

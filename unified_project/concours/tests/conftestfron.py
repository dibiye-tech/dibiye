from locust import HttpUser, task, between

class BackendUser(HttpUser):
 
    wait_time = between(1, 3)
    host = "http://localhost:8000"
    def on_start(self):
        """
        Authentification au démarrage de l'utilisateur virtuel.
        Envoie une requête POST à l'endpoint d'authentification pour obtenir un token JWT,
        puis ajoute ce token aux headers par défaut pour toutes les requêtes.
        """
        credentials = {
            "username": "Francky",          # Utilisateur de test (adaptez si nécessaire)
            "password": "Franckchristy1"      # Mot de passe de test
        }
        response = self.client.post("/app/auth/jwt/create/", json=credentials, name="Obtenir un JWT")
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
    def view_concoursfonctionpubs(self):
        self.client.get("/concours/concoursfonctionpubs/", name="Concours Fonction Pubs")

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

    # @task
    # def view_search_concours(self):
    #     # Ajoute un paramètre de recherche pour éviter une requête vide
    #     self.client.get("/concours/search/?q=test", name="Search (Concours)")

    # @task
    # def view_searchhistory_concours(self):
    #     self.client.get("/concours/searchhistory/", name="Search History (Concours)")

    @task
    def view_concours_documents(self):
        self.client.get("/concours/concours/documents/1/", name="Concours Documents List")

    @task
    def view_test_simple(self):
        self.client.get("/concours/test/simple/", name="Test Simple (Concours)")

    @task
    def view_test_concours_documents(self):
        self.client.get("/concours/test/concours/documents/1/", name="Test Concours Documents")

    @task
    def view_all_documents_concours(self):
        self.client.get("/concours/documents/1/all/", name="All Documents (Concours)")

    @task
    def view_grandecoles(self):
        self.client.get("/concours/grandecoles/", name="Grandes Écoles List (Concours)")

    @task
    def view_concours_detail(self):
        self.client.get("/concours/concoursfonctionpubs/1/", name="Concours Detail")

    @task
    def view_universities_grandes_ecoles(self):
        self.client.get("/concours/universities/1/grandesecoles/", name="Universités Grandes Écoles")

    # --------------------------------------------------
    # Section App (accessible sous /app/)
    # --------------------------------------------------
    @task
    def view_exists(self):
        self.client.get("/app/exists/", name="Vérification Username")

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
    def view_documents(self):
        self.client.get("/app/documents", name="Liste des Documents")

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
        # Vérifiez si cet endpoint accepte bien la méthode GET
        self.client.get("/app/user/update/", name="User Update")

    @task
    def view_document_detail(self):
        self.client.get("/app/documents/1/", name="Détail d'un Document")

    @task
    def view_comments(self):
        self.client.get("/app/comments/1/", name="Liste des Commentaires")

    @task
    def view_history(self):
        self.client.get("/app/history/", name="Liste de l'Historique")

    @task
    def delete_all_history(self):
        self.client.delete("/app/history/delete/", name="Suppression de tout l'Historique")

    @task
    def delete_history_entry(self):
        self.client.delete("/app/history/1/", name="Suppression d'une entrée d'Historique")

    @task
    def delete_all_favorites(self):
        self.client.delete("/app/favorites/delete_all/", name="Suppression de tous les Favoris")

    @task
    def view_favorites(self):
        self.client.get("/app/favorites/", name="Liste des Favoris")

    @task
    def delete_favorite_entry(self):
        self.client.delete("/app/favorites/1/", name="Suppression d'un Favori")

    @task
    def view_classeur(self):
        self.client.get("/app/classeur/", name="Liste des Classeurs")

    @task
    def delete_classeur_entry(self):
        self.client.delete("/app/classeur/1/", name="Suppression d'un Classeur")

    @task
    def create_classeur_book(self):
        payload = {"name": "Test ClasseurBook"}
        self.client.post("/app/classeurbook/", json=payload, name="Création d'un ClasseurBook")

    @task
    def view_classeur_book_list(self):
        self.client.get("/app/classeurbook/1/documents", name="Liste des Documents d'un ClasseurBook")

    @task
    def delete_all_classeurbook(self):
        self.client.delete("/app/classeurbook/delete_all/", name="Suppression de tous les ClasseurBook")

    @task
    def delete_classeurbook_entry(self):
        self.client.delete("/app/classeurbook/1/", name="Suppression d'un ClasseurBook")

    @task
    def view_global_search(self):
        self.client.get("/app/search/?q=test", name="Global Search (App)")

    @task
    def create_comment(self):
        payload = {"comment": "Test commentaire"}
        self.client.post("/app/comment/1/", json=payload, name="Création d'un Commentaire")

    @task
    def get_jwt(self):
        credentials = {
            "username": "testuser",   # Adaptez selon vos besoins
            "password": "testpassword"
        }
        self.client.post("/app/auth/jwt/create/", json=credentials, name="Obtenir un JWT")

from locust import HttpUser, task, between

class UserBehavior(HttpUser):
    wait_time = between(1, 3)  # Pause entre les requêtes (1 à 3 sec)

    @task
    def view_homepage(self):
        """🔹 Accéder à la page d'accueil"""
        self.client.get("/", name="Accueil")

    @task
    def view_bibliotheque(self):
        self.client.get("/bibliotheque", name="Bibliothèque")

    @task
    def view_about(self):
        self.client.get("/about", name="À propos")

    @task
    def view_concours(self):
        self.client.get("/homeconcours", name="Concours")

    # Endpoints issus du routeur (premier bloc)
    @task
    def view_published_concours(self):
        self.client.get("/published_concours/", name="Published Concours")

    @task
    def view_concoursfonctionpubs(self):
        self.client.get("/concoursfonctionpubs/", name="Concours Fonction Pubs")

    @task
    def view_concourscategories(self):
        self.client.get("/concourscategories/", name="Concours Catégories")

    @task
    def view_testimonials(self):
        self.client.get("/testimonials/", name="Testimonials")

    @task
    def view_concourssubcategories(self):
        self.client.get("/concourssubcategories/", name="Concours Sous-Catégories")

    @task
    def view_universities(self):
        self.client.get("/universities/", name="Universités")

    @task
    def view_search(self):
        self.client.get("/search/", name="Search")

    @task
    def view_searchhistory(self):
        self.client.get("/searchhistory/", name="Search History")

    @task
    def view_concours_documents(self):
        # Test avec un concours_id fictif (1)
        self.client.get("/concours/documents/1/", name="Concours Documents List")

    @task
    def view_test_simple(self):
        self.client.get("/test/simple/", name="Test Simple")

    @task
    def view_test_concours_documents(self):
        self.client.get("/test/concours/documents/1/", name="Test Concours Documents")

    @task
    def view_all_documents(self):
        self.client.get("/documents/1/all/", name="All Documents")

    @task
    def view_grandecoles(self):
        self.client.get("/grandecoles/", name="Grandes Écoles List")

    @task
    def view_concours_detail(self):
        self.client.get("/concoursfonctionpubs/1/", name="Concours Detail")

    @task
    def view_universities_grandes_ecoles(self):
        self.client.get("/universities/1/grandesecoles/", name="Universités Grandes Écoles")

    # Endpoints du deuxième bloc
    @task
    def view_exists(self):
        self.client.get("/exists/", name="Vérification Username")

    @task
    def view_categories(self):
        self.client.get("/categories/", name="Liste des Catégories")

    @task
    def view_category_detail(self):
        self.client.get("/categories/1/", name="Détail d'une Catégorie")

    @task
    def view_souscategories(self):
        self.client.get("/souscategories/", name="Liste des Sous-Catégories")

    @task
    def view_souscategory_detail(self):
        self.client.get("/souscategories/1/", name="Détail d'une Sous-Catégorie")

    @task
    def view_documents(self):
        self.client.get("/documents", name="Liste des Documents")

    @task
    def view_recent_documents(self):
        self.client.get("/documents/recent/", name="Documents Récents")

    @task
    def view_documents_by_category(self):
        self.client.get("/documents/category/1/", name="Documents par Catégorie")

    @task
    def view_documents_by_sous_category(self):
        self.client.get("/documents/sous_category/1/", name="Documents par Sous-Catégorie")

    @task
    def view_documents_by_branche(self):
        self.client.get("/documents/sous_category/1/branche/1/", name="Documents par Branche")

    @task
    def view_user_update(self):
        self.client.get("/user/update/", name="User Update")

    @task
    def view_document_detail(self):
        self.client.get("/documents/1/", name="Détail d'un Document")

    @task
    def view_comments(self):
        self.client.get("/comments/1/", name="Liste des Commentaires")

    @task
    def view_history(self):
        self.client.get("/history/", name="Liste de l'Historique")

    @task
    def delete_all_history(self):
        self.client.delete("/history/delete/", name="Suppression de tout l'Historique")

    @task
    def delete_history_entry(self):
        self.client.delete("/history/1/", name="Suppression d'une entrée d'Historique")

    @task
    def delete_all_favorites(self):
        self.client.delete("/favorites/delete_all/", name="Suppression de tous les Favoris")

    @task
    def view_favorites(self):
        self.client.get("/favorites/", name="Liste des Favoris")

    @task
    def delete_favorite_entry(self):
        self.client.delete("/favorites/1/", name="Suppression d'un Favori")

    @task
    def view_classeur(self):
        self.client.get("/classeur/", name="Liste des Classeurs")

    @task
    def delete_classeur_entry(self):
        self.client.delete("/classeur/1/", name="Suppression d'un Classeur")

    @task
    def create_classeur_book(self):
        # POST sans payload pour tester la création
        self.client.post("/classeurbook/", name="Création d'un ClasseurBook")

    @task
    def view_classeur_book_list(self):
        self.client.get("/classeurbook/1/documents", name="Liste des Documents d'un ClasseurBook")

    @task
    def delete_all_classeurbook(self):
        self.client.delete("/classeurbook/delete_all/", name="Suppression de tous les ClasseurBook")

    @task
    def delete_classeurbook_entry(self):
        self.client.delete("/classeurbook/1/", name="Suppression d'un ClasseurBook")

    @task
    def view_global_search(self):
        self.client.get("/search/", name="Global Search")

    @task
    def create_comment(self):
        # POST pour créer un commentaire (payload non défini ici)
        self.client.post("/comment/1/", name="Création d'un Commentaire")

    @task
    def obtain_jwt(self):
        # POST pour obtenir un token JWT (payload non défini ici)
        self.client.post("/auth/jwt/create/", name="Obtenir un JWT")
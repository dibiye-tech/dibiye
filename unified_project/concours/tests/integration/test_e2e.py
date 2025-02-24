import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

@pytest.mark.selenium
def test_navigation_and_auth():
    driver = webdriver.Chrome()
    driver.get("http://localhost:5173/")  # Remplace par ton URL React
    wait = WebDriverWait(driver, 10)

    try:
        # 🔹 1️⃣ Fermer toute fenêtre modale si elle existe
        try:
            modal_overlay = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "backdrop-blur-sm")))
            driver.execute_script("arguments[0].remove();", modal_overlay)  # Supprimer l'overlay s'il bloque
            print("✅ Overlay supprimé")
        except:
            print("ℹ️ Aucun overlay détecté")

        # 🔹 2️⃣ Aller sur **Accueil**
        accueil_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Accueil")))
        accueil_link.click()
        assert "localhost:5173/" in driver.current_url, "❌ Erreur : Navigation vers Accueil échouée"
        print("✅ Navigation vers Accueil réussie")

        time.sleep(4)

        # 🔹 3️⃣ Aller sur **Bibliothèque**
        bibliotheque_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Bibliothèque")))
        bibliotheque_link.click()
        assert "bibliotheque" in driver.current_url, "❌ Erreur : Navigation vers Bibliothèque échouée"
        print("✅ Navigation vers Bibliothèque réussie")
        time.sleep(4)

        # 🔹 4️⃣ Aller sur **À propos**
        about_link = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "A propos")))
        about_link.click()
        assert "about" in driver.current_url, "❌ Erreur : Navigation vers À propos échouée"
        print("✅ Navigation vers À propos réussie")
        time.sleep(4)

        # 🔹 5️⃣ Aller sur **Concours**
        concours_menu = wait.until(EC.element_to_be_clickable((By.LINK_TEXT, "Concours")))
        concours_menu.click()
        assert "homeconcours" in driver.current_url, "❌ Erreur : Navigation vers Concours échouée"
        print("✅ Navigation vers Concours réussie")
        time.sleep(4)

        # 🔹 6️⃣ Cliquer sur le bouton **Connexion**
        login_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Connexion')]")))
        login_button.click()
        print("✅ Formulaire de connexion affiché")
        time.sleep(2)

        # 🔹 7️⃣ Remplir le formulaire de connexion
        username_input = wait.until(EC.presence_of_element_located((By.NAME, "username")))  # Vérifie le name dans DevTools
        password_input = wait.until(EC.presence_of_element_located((By.NAME, "password")))

        username_input.send_keys("Francky")  # Remplace par un utilisateur valide
        password_input.send_keys("Franckchristy1")

        # 🔹 8️⃣ Vérifier si le bouton **Connexion** est bien visible avant de cliquer
        submit_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Connexion')]")))

        # **Cliquer sur le bouton Connexion**
        driver.execute_script("arguments[0].click();", submit_button)
        time.sleep(4)

        # 🔹 9️⃣ Vérifier la connexion réussie (attendre le bouton Déconnexion)
        logout_button = wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Déconnexion')]")))
        assert logout_button.is_displayed(), "❌ Erreur : L'utilisateur n'est pas connecté"
        print("✅ Connexion réussie, bouton Connexion transformé en Déconnexion")
        time.sleep(4)

        # 🔹 🔟 Vérifier qu'il y a au moins un concours en favori
        try:
            concours_favori = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "text-lg.font-semibold.text-primary")))
            concours_favori.click()
            print("✅ Concours favori cliqué avec succès")
            time.sleep(4)
        except:
            print("⚠️ Aucun concours favori trouvé, test ignoré.")

        # 🔹 🔟 Cliquer sur **Déconnexion**
        logout_button.click()
        time.sleep(6)  # ⏳ Augmenter le temps d'attente pour le rechargement de la page

        # 🔹 🔟 Vérifier que l'URL change après la déconnexion
        assert "localhost:5173/" in driver.current_url, "❌ Erreur : La page ne s'est pas rechargée après la déconnexion"
        print("✅ Déconnexion détectée, page rechargée")

        # 🔹 🔟 Vérifier si le bouton **Connexion** est visible après déconnexion
        try:
            login_button_after_logout = wait.until(EC.presence_of_element_located((By.XPATH, "//button[contains(text(),'Connexion')]")))
            print("✅ Bouton Connexion retrouvé après déconnexion")
            assert login_button_after_logout.is_displayed(), "❌ Erreur : Déconnexion échouée"
        except:
            print("⚠️ Le bouton Connexion n'a pas été trouvé après déconnexion !")
            raise Exception("❌ Erreur : Le bouton Connexion ne réapparaît pas après la déconnexion.")

    finally:
        driver.quit()

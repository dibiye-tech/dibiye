from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait

# Configuration du WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# Ouvrir la page
driver.get("http://localhost:5173")

wait = WebDriverWait(driver, 30)

def test_login_and_comment():
    driver.get("http://localhost:8000/auth/jwt/create/") 

    username_field = driver.find_element(By.NAME, "username")
    password_field = driver.find_element(By.NAME, "password")

    username_field.send_keys("testuser")
    password_field.send_keys("testpassword")

    password_field.send_keys(Keys.RETURN)

    time.sleep(2)

    assert "token" in driver.page_source


    driver.get("http://localhost:5173")
    time.sleep(2)

    driver.get("http://localhost:5173/about")
    time.sleep(2)

    driver.get("http://localhost:5173/bibliotheque")
    time.sleep(2)

    driver.get("http://localhost:5173/bibliotheque/enseignements")
    time.sleep(2)

    print("Test réussi.")
    driver.quit()

# Lancer le test
test_login_and_comment()
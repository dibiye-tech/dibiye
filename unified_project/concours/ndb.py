# Mise à jour du script SQL avec les nouvelles tables intermédiaires

sql_script_final = """
-- Création des tables principales
CREATE TABLE etablissement_primaire (
    id_et_p INT PRIMARY KEY,
    nom_et_p VARCHAR(255),
    logo_et_p VARCHAR(255),
    galerie_p VARCHAR(255),
    type_sc_p ENUM('publique', 'privee'),
    system_p ENUM('fr', 'en'),
    abbr VARCHAR(50)
);

CREATE TABLE classe_primaire (
    id_cl_pr INT PRIMARY KEY,
    nom_cp VARCHAR(255),
    effectif_cp INT,
    success_percent_cp FLOAT,
    taux_ex_succes_p FLOAT,
    system_cp VARCHAR(50),
    id_et INT,
    FOREIGN KEY (id_et) REFERENCES etablissement_primaire(id_et)
);

CREATE TABLE eta_scolaire (
    id_ets_sc INT PRIMARY KEY,
    nom_sc VARCHAR(255),
    abbr_sc VARCHAR(50),
    logo_sc VARCHAR(255),
    galerie_sc VARCHAR(255),
    type_sc ENUM('publique', 'privee'),
    system ENUM('fr', 'en')
    genre_sc ENUM('TECHNICIEN', 'GENERALISTE', 'TECHNICIEN_GENERALISTE'),
);


CREATE TABLE eta_tc_add (
    id_add INT PRIMARY KEY,
    longitude FLOAT,
    latitude FLOAT,
    degree TINYINT,
    id_ets_sc INT,
    id_et INT,
    id_univ INT,
    FOREIGN KEY (id_ets_sc) REFERENCES eta_scolaire(id_ets_sc),
    FOREIGN KEY (id_et) REFERENCES etablissement_primaire(id_et),
    FOREIGN KEY (id_univ) REFERENCES universite(id_univ)
);

CREATE TABLE personnel_ets (
    id_ets INT,
    id_et INT,
    annee INT,
    poste VARCHAR(255),
    system_pc ENUM('administratif', 'enseignant'),
    type_pc ENUM('permanent', 'contractuel'),
    PRIMARY KEY (id_ets),
    FOREIGN KEY (id_ets) REFERENCES eta_scolaire(id_ets_sc),
    FOREIGN KEY (id_et) REFERENCES etablissement_primaire(id_et)
);

CREATE TABLE classe_secondaire (
    id_cl INT PRIMARY KEY,
    nom_cl VARCHAR(255),
    effectif_cl INT,
    success_percent FLOAT,
    taux_ex_succes_l FLOAT,
    systeme VARCHAR(50),
    specialite ENUM('gen', 'tec'),
    id_ets_sc INT,
    FOREIGN KEY (id_ets_sc) REFERENCES eta_scolaire(id_ets_sc)
);

CREATE TABLE serie_specialiter (
    id_sec INT PRIMARY KEY,
    nom_sc VARCHAR(255)
);

CREATE TABLE examen_off (
    id_ex INT PRIMARY KEY,
    nom_ex VARCHAR(255)
);

CREATE TABLE niveau (
    id_niv INT PRIMARY KEY,
    cycle_niv ENUM('primaire', 'secondaire')
);

CREATE TABLE categorie (
    id INT PRIMARY KEY,
    nom VARCHAR(255)
);

-- Table intermédiaire entre classe_secondaire et serie_specialiter
CREATE TABLE classe_serie (
    id_cl INT,
    id_sec INT,
    PRIMARY KEY (id_cl, id_sec),
    FOREIGN KEY (id_cl) REFERENCES classe_secondaire(id_cl),
    FOREIGN KEY (id_sec) REFERENCES serie_specialiter(id_sec)
);

-- Table intermédiaire entre classe_secondaire et niveau
CREATE TABLE classe_niveau (
    id_cl INT,
    id_niv INT,
    PRIMARY KEY (id_cl, id_niv),
    FOREIGN KEY (id_cl) REFERENCES classe_secondaire(id_cl),
    FOREIGN KEY (id_niv) REFERENCES niveau(id_niv)
);

-- Table intermédiaire pour gérer une relation n..m entre classe_secondaire et examen_off
CREATE TABLE classe_examen (
    id_cl INT,
    id_ex INT,
    PRIMARY KEY (id_cl, id_ex),
    FOREIGN KEY (id_cl) REFERENCES classe_secondaire(id_cl),
    FOREIGN KEY (id_ex) REFERENCES examen_off(id_ex)
);
"""

# Enregistrer le fichier SQL mis à jour avec les nouvelles tables
file_path_final = "/mnt/data/schema_diagramme_complet_final.sql"
with open(file_path_final, "w") as file:
    file.write(sql_script_final)

# Renvoyer le fichier SQL mis à jour
file_path_final
from django.db import models

class EtablissementPrimaire(models.Model):
    TYPE_CHOICES = [
        ('publique', 'Publique'),
        ('privee', 'Privée'),
    ]
    SYSTEM_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
    ]
    
    nom = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    galerie = models.ImageField(upload_to='galerie/', blank=True, null=True)
    type_sc = models.CharField(max_length=10, choices=TYPE_CHOICES)
    system = models.CharField(max_length=5, choices=SYSTEM_CHOICES)
    abbr = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.nom

class ClassePrimaire(models.Model):
    etablissement = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE)
    nom = models.CharField(max_length=255)
    effectif = models.IntegerField()
    success_percent = models.FloatField()
    taux_ex_succes = models.FloatField()
    system = models.CharField(max_length=50)
    examen = models.OneToOneField('ExamenOfficiel', on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.nom} - {self.etablissement.nom}"

class EtablissementScolaire(models.Model):
    TYPE_CHOICES = [
        ('publique', 'Publique'),
        ('privee', 'Privée'),
    ]
    SYSTEM_CHOICES = [
        ('fr', 'Français'),
        ('en', 'Anglais'),
    ]
    GENRE_CHOICES = [
        ('TECHNICIEN', 'Technicien'),
        ('GENERALISTE', 'Généraliste'),
        ('TECHNICIEN_GENERALISTE', 'Technicien & Généraliste'),
    ]
    
    nom = models.CharField(max_length=255)
    abbr = models.CharField(max_length=50, blank=True, null=True)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)
    galerie = models.ImageField(upload_to='galerie/', blank=True, null=True)
    type_sc = models.CharField(max_length=10, choices=TYPE_CHOICES)
    system = models.CharField(max_length=5, choices=SYSTEM_CHOICES)
    genre = models.CharField(max_length=25, choices=GENRE_CHOICES)
    
    def __str__(self):
        return self.nom

class AdresseEtablissement(models.Model):
    etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE, null=True, blank=True)
    etablissement_primaire = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE, null=True, blank=True)
    universite = models.ForeignKey('Universite', on_delete=models.CASCADE, null=True, blank=True)
    GrandEcole = models.ForeignKey('GrandEcole', on_delete=models.CASCADE, null=True, blank=True)
    longitude = models.FloatField()
    latitude = models.FloatField()
    degree = models.IntegerField()

class PersonnelEtablissement(models.Model):
    SYSTEM_CHOICES = [
        ('administratif', 'Administratif'),
        ('enseignant', 'Enseignant'),
    ]
    TYPE_CHOICES = [
        ('permanent', 'Permanent'),
        ('contractuel', 'Contractuel'),
    ]
    
    etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE)
    etablissement_primaire = models.ForeignKey(EtablissementPrimaire, on_delete=models.CASCADE)
    annee = models.IntegerField()
    poste = models.CharField(max_length=255)
    system = models.CharField(max_length=15, choices=SYSTEM_CHOICES)
    type_pc = models.CharField(max_length=15, choices=TYPE_CHOICES)

class ClasseSecondaire(models.Model):
    SPECIALITE_CHOICES = [
        ('gen', 'Général'),
        ('tec', 'Technique'),
    ]
    
    etablissement_scolaire = models.ForeignKey(EtablissementScolaire, on_delete=models.CASCADE)
    nom = models.CharField(max_length=255)
    effectif = models.IntegerField()
    success_percent = models.FloatField()
    taux_ex_succes = models.FloatField()
    systeme = models.CharField(max_length=50)
    specialite = models.CharField(max_length=10, choices=SPECIALITE_CHOICES)

    def __str__(self):
        return self.nom

class SerieSpecialite(models.Model):
    nom = models.CharField(max_length=255)
    
    def __str__(self):
        return self.nom

class ExamenOfficiel(models.Model):
    nom = models.CharField(max_length=255)
    
    def __str__(self):
        return self.nom

class Niveau(models.Model):
    CYCLE_CHOICES = [
        ('primaire', 'Primaire'),
        ('secondaire', 'Secondaire'),
    ]
    
    cycle = models.CharField(max_length=10, choices=CYCLE_CHOICES)
    
    def __str__(self):
        return self.cycle

class Categorie(models.Model):
    nom = models.CharField(max_length=255)
    
    def __str__(self):
        return self.nom

# Relations Many-to-Many
class ClasseSerie(models.Model):
    classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
    serie = models.ForeignKey(SerieSpecialite, on_delete=models.CASCADE)

class ClasseNiveau(models.Model):
    classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
    niveau = models.ForeignKey(Niveau, on_delete=models.CASCADE)

class ClasseExamen(models.Model):
    classe = models.ForeignKey(ClasseSecondaire, on_delete=models.CASCADE)
    examen = models.ForeignKey(ExamenOfficiel, on_delete=models.CASCADE)

class Universite(models.Model):
    nom = models.CharField(max_length=255)
    
    def __str__(self):
        return self.nom

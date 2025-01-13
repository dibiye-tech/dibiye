from django.core.management.base import BaseCommand
from elasticsearch_dsl import connections

class Command(BaseCommand):
    help = "Deletes and recreates Elasticsearch indexes for concours."

    def handle(self, *args, **kwargs):
        recreate_index()

def recreate_index():
    es = connections.get_connection()

    indexes = ['concours_v2', 'concourscategory', 'concourssubcategory', 'university']

    for index in indexes:

        es.indices.delete(index=index, ignore=[400, 404])
        print(f"Deleted index: {index}")

        index_class = globals().get(f'{index.capitalize()}Document')
        if index_class:
            index_class.init()
            print(f"Created index: {index}")
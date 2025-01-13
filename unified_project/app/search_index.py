# from elasticsearch_dsl import Document, Text, Keyword, Date, InnerDoc
# from elasticsearch_dsl.connections import connections
# from .models import Book, Category, SousCategory

# # Create a default Elasticsearch client
# connections.create_connection(hosts=["http://localhost:9200"])

# class CategoryDocument(Document):
#     name = Text()
#     image = Text()
#     description = Text()
#     lien = Keyword()

#     # class Index:
#         name = 'categories'

#     def save(self, **kwargs):
#         return super().save(**kwargs)

# class SousCategoryDocument(Document):
#     name = Text()
#     category = Keyword() 

#     class Index:
#         name = 'sous_categories'

#     def save(self, **kwargs):
#         return super().save(**kwargs)

# class BookDocument(Document):
#     title = Text()
#     image = Text()  
#     description = Text()
#     auteur = Text()
#     contenu = Text()
#     document_type = Keyword()
#     file = Keyword()  
#     category = Keyword() 
#     sous_category = Keyword() 
#     branche = Keyword()  
#     created_at = Date()  

#     class Index:
#         name = 'books'

#     def save(self, **kwargs):
#         return super().save(**kwargs)

# # You can use these documents to index your data

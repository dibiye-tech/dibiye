# from .search_index import BookDocument, CategoryDocument, SousCategoryDocument
# from .models import Book, Category, SousCategory


# def index_book(book_instance):
#     doc = BookDocument(
#         meta={'id': book_instance.id},
#         title=book_instance.title,
#         image=book_instance.image.url if book_instance.image else None,
#         # description=book_instance.description,
#         auteur=book_instance.auteur,
#         contenu=book_instance.contenu,
#         document_type=book_instance.document_type,
#         file=book_instance.file.url if book_instance.file else None,
#         category=book_instance.category.id if book_instance.category else None,
#         sous_category=book_instance.sous_category.id if book_instance.sous_category else None,
#         branche=book_instance.branche.id if book_instance.branche else None,
#     )
#     doc.save()

# def index_category(category_instance):
#     cat = CategoryDocument(
#         meta={'id': category_instance.id},
#         name=category_instance.name,
#         image=category_instance.image.url if category_instance.image else None,
#         description=category_instance.description,
#         lien=category_instance.lien,
#     )
#     cat.save()

# def index_scategory(scategory_instance):
#     scat = SousCategoryDocument(
#         meta={'id': scategory_instance.id},
#         name=scategory_instance.name,
#         category=category_instance.category if category_instance.category else 'UnKnown',
#     )

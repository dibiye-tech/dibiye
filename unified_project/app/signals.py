# # signals.py
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Book, Category, SousCategory
# from .index_data import index_book, index_category, index_scategory

# @receiver(post_save, sender=Book)
# def index_book_on_save(sender, instance, **kwargs):
#     index_book(instance)

# @receiver(post_save, sender=Category)
# def index_category_on_save(sender, instance, **kwargs):
#     index_category(instance)

# @receiver(post_save, sender=SousCategory)
# def index_sous_category_on_save(sender, instance, **kwargs):
#     index_scategory(instance)

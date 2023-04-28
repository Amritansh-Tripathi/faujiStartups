from django.urls import path
from . import views

app_name = "API"
urlpatterns = [
    path("", views.Test, name="Test"),
    path('Identification',views.Identification,name="Identification"),
]

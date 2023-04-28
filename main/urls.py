from django.urls import path
from . import views

app_name = "main"
urlpatterns = [
    path("", views.Landing, name="landing"),
    path("signin", views.Signin, name="signin"),
    path("actions", views.Identification, name="actions"),
    path("signup", views.Signup, name="signup"),
    path("user", views.User, name="user"),
    path("tnc", views.Terms, name="tnc"),	
    path("profile", views.Profile, name="profile"),
    path("userQuery", views.UserQuery, name="userQuery"),
    path("admin", views.Admin, name="admin"),
    path("adminSignin", views.AdminSignin, name="adminSignin"),
    path("adminSignup", views.AdminSignup, name="adminSignup"),
]

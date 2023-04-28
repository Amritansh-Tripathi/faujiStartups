import random
from django.conf import settings
import requests
# from SafalHonge.settings import fac_API_KEY

fac_API_KEY='235a3905-dde9-11ed-addf-0200cd936042'
def send_otp_to_phone(phone_number):
    try:
        otp=random.randint(1000,9999)
        url=f'https://2factor.in/API/V1/{fac_API_KEY}/SMS/{phone_number}/{otp}'
        response=requests.get(url)
        return otp
    except Exception as e:
        return None 
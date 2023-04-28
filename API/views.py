from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
import json
from API.OTP import send_otp_to_phone

from .utilities import All_query_position, Check_user, GetQuery, Login_user, Post_Query, Total_Queries, User_Registration, UserQueries_no, parse_json, userdetails
# Create your views here.

def Test(request):
    return JsonResponse({"Test":200,"API":True})

@csrf_exempt
def Identification(request):
    data=request.GET
    try:
        action=data["action"]
    except:
        context={"Status":420}
        return JsonResponse(context)
# ----------------------------- << LOGIN >>--------------------------        
    if action=="Login":
        Username = request.POST.get('Username')
        print(Username)
        user=Login_user(Username)   
        user=parse_json(user)
        print(user)
        user["id"]=user["_id"]["$oid"]
        return JsonResponse(user) 
# ----------------------------- << Registration >>--------------------------        
    if action=="Registration":
        # Name = request.POST.get('Name')
        Username = request.POST.get('Username')
        name=request.POST.get('Name')
        id=User_Registration(Username, name)
        if id==100:
            Status=100
        else:
            Status=200
        context={"Status":Status,"_id":id}
        context=parse_json(context)
        context["id"]=context["_id"]["$oid"]
        return JsonResponse(context)
# ----------------------------- << OTP >>--------------------------        
    if action=="LoginOTP":
        Username = request.POST.get('Username')
        status=Check_user(Username)
        if status==200:
            context={"Status":100}
        else:
            otp=1111
            # otp=send_otp_to_phone(Username)
            print("otp Called")
            context={"Status":200,"otp":otp}    
        context=parse_json(context)
        return JsonResponse(context)
    
    if action=="Register_OTP":
        Username = request.POST.get('Username')
        status=Check_user(Username)
        if status==100:
            context={"Status":100}
        else:
            otp=1111
            # otp=send_otp_to_phone(Username)
            print("otp Called")
            context={"Status":200,"otp":otp}  
        context=parse_json(context)
        return JsonResponse(context)
# ----------------------------- << User Details >>--------------------------        
    
    if action=="UserDetails":
        id = request.POST.get('id')
        print(id)
        name=userdetails(id)
        queries=UserQueries_no(id)
        context={"Status":200,"Data":{"Name":name,"Queries":queries["Queries"],"Number":queries["Number"]}}    
        context=parse_json(context)
        return JsonResponse(context)
    
    if action=="PostQuery":
        id = request.POST.get('id')
        query_title = request.POST.get('query_title')
        query_des = request.POST.get('query_des')
        land_location = json.loads(request.POST.get('land_location'))
        land_qty = request.POST.get('land_qty')
        land_unit = request.POST.get('land_unit')
        post=Post_Query(id,query_title,query_des,land_location,land_qty,land_unit)
        context={"Status":post}    
        context=parse_json(context)
        return JsonResponse(context)
    
#---------------------- ADMIN -------------------------------
    
    if action=="TotalQueries":
        number=Total_Queries()
        context={"Number":number}    
        context=parse_json(context)
        return JsonResponse(context)
    
    if action=="TotalQueries_location":
        number=All_query_position()
        context={"Number":number}    
        context=parse_json(context)
        return JsonResponse(context)
    
    if action=="Get_Query":
        num=request.POST.get('id')
        Query=GetQuery(num)
        context=Query  
        context=parse_json(context)
        return JsonResponse(context)

    context={"body":dict(request.GET)}
    return JsonResponse(context)
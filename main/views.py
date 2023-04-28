from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
import json
from API.OTP import send_otp_to_phone

from main.utilities import Admin_Login_user, All_queries, All_query_position, All_userdetails, Check_user, GetQuery, Login_user, Post_Query, ReplyQuery, Total_Queries, \
    User_Registration, User_profile, UserQueries_no, Verfication, Visitor, parse_json, userdetails


# Create your views here.

def Test(request):
    return JsonResponse({"Test": 200, "mains": True})


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'


def Signin(request):
    # return JsonResponse({"Test":200,"Signin":True})
    if 'id' in request.COOKIES:
        return redirect('main:user')
    else:
        return render(request, 'signin.html')


def Signup(request):
    if 'id' in request.COOKIES:
        return redirect('main:user')
    else:
        return render(request, 'register.html')


def Landing(request):
        return render(request, 'landing.html')


def Terms(request):
	return render(request, 'terms.html')


def AdminSignin(request):
    # return JsonResponse({"Test":200,"Signin":True})
    if 'id' in request.COOKIES:
        return redirect('main:admin')
    else:
        return render(request, 'admin-signin.html')


def AdminSignup(request):
    if 'id' in request.COOKIES:
        return redirect('main:admin')
    else:
        return render(request, 'admin-signup.html')


def User(request):
    if 'id' in request.COOKIES:
        return render(request, 'userDash.html', {"Test": 200, "user": True})
        # return JsonResponse({"Test":200,"user":True})
    else:
        return redirect('main:signin')

def Profile(request):
    if 'id' in request.COOKIES:
        return render(request, 'form.html', {"Test": 200, "user": True})
        # return JsonResponse({"Test":200,"user":True})
    else:
        return redirect('main:signin')


def Admin(request):
    if 'Adminid' in request.COOKIES:
        return render(request, 'admin.html')
    else:
        return redirect('main:adminSignin')


def UserQuery(request):
    if 'id' in request.COOKIES:
        return render(request, 'user-querry.html')
    else:
        return redirect('main:signin')


@csrf_exempt
def Identification(request):
    try:
        id = request.COOKIES['id']
    except:
        id = None
    if is_ajax(request):
        data = request.body
        data = data.decode(encoding='UTF-8')
        data = json.loads(data)
        # ----------------------------- << LOGIN >>--------------------------
        if data["action"] == "Activity":
            ip = data["ip"]
            visitor=Visitor(ip)
            response = HttpResponse(json.dumps({"Status": 200,"Data":visitor,"action":data["action"]}), content_type="application/json")
            return response
        
        if data["action"] == "logout":
            response = HttpResponse(json.dumps({"Status": 200, "action":data["action"]}), content_type="application/json")
            response.delete_cookie("id")
            return response
        if data["action"] == "session":
            if id==None:
                response = HttpResponse(json.dumps({"Status": 100,"action":data["action"]}), content_type="application/json")
            else:
                response = HttpResponse(json.dumps({"Status": 200,"action":data["action"]}), content_type="application/json")
            return response    
        if data["action"] == "Login":
            Username = data["Username"]
            print(Username)
            user = Login_user(Username)
            print(user)
            if user["Status"] == 200:
                response = HttpResponse(json.dumps({"Status": 200}), content_type="application/json")
                response.set_cookie('id', user["_id"])
            else:
                response = HttpResponse(json.dumps({"Status": 100}), content_type="application/json")
            return response
        # ----------------------------- << Registration >>--------------------------
        if data["action"] == "Registration":
            Username = data["Username"]
            # name = data["Name"]
            # Role = data["Role"]
            location = data["location"]
            id = User_Registration(Username,location)
            if id == 100:
                response = HttpResponse(json.dumps({"Status": 100,"action":data["action"]}), content_type="application/json")
            else:
                response = HttpResponse(json.dumps({"Status": 200,"action":data["action"]}), content_type="application/json")
                response.set_cookie('id', id)
            return response
        
        if data["action"] == "Profile":

            Role = data["Role"]
            lang = data["Language"]
            User_profile(id,Role,lang)

            if id == 100:
                response = HttpResponse(json.dumps({"Status": 100,"action":data["action"]}), content_type="application/json")
            else:
                response = HttpResponse(json.dumps({"Status": 200,"action":data["action"]}), content_type="application/json")
                # response.set_cookie('id', id)
            return response

        # ----------------------------- << OTP >>--------------------------
        if data["action"] == "LoginOTP":
            Username = data["Username"]
            status = Check_user(Username)
            if status == 200:
                context = {"Status": 100,"action":data["action"]}
            else:
                # otp = 1111
                otp=send_otp_to_phone(Username)
                print("otp Called")
                context = {"Status": 200, "otp": otp,"action":data["action"]}
            response = HttpResponse(json.dumps(context), content_type="application/json")
            return response

        if data["action"] == "Register_OTP":
            Username = data["Username"]
            print(Username)
            status = Check_user(Username)
            print(status)

            if status == 100:
                context = {"Status": 100,"action":data["action"]}
            else:
                # otp = 1111
                otp=send_otp_to_phone(Username)
                print("otp Called")
                context = {"action": data['action'], "Status": 200, "otp": otp}
            print(context)
            response = HttpResponse(json.dumps(context), content_type="application/json")
            return response
        # ----------------------------- << User Details >>--------------------------

        if data["action"] == "UserDetails":
            # id = data["id"]
            user = userdetails(id)
            queries = UserQueries_no(id)
            context = {"action":data["action"], "Status": 200, "userdata": user, "Queries": queries["Queries"], "Number": queries["Number"]}
            context = parse_json(context)
            return JsonResponse(context)

        if data["action"] == "PostQuery":
            
            query_des = data["query_des"]
            # land_location = data["location"]
            # land_qty = data["land_qty"]
            # land_unit = data["land_unit"]
            # Email = data["Email"]
            # role = data["role"]
            # category = data["category"]
            # Utilization = data["Utilization"]
            post = Post_Query(id, query_des)
            context = {"Status": post, "action":data['action']}
            context = parse_json(context)
            return JsonResponse(context)
        
        # ---------------------- ADMIN -------------------------------
        
        if data['action'] == 'Adminlogin':
            username = data['username']
            password = data['password']
            _id = Verfication(username, password)
            if _id == -1:
                return HttpResponse(json.dumps({"Status": 100,'action':data['action']}), content_type="application/json")
            else:
                response = HttpResponse(json.dumps({"Status": 200,'action':data['action']}), content_type="application/json")
                response.set_cookie('Adminid', _id)
                return response
            
        # if data["action"] == "AdminLogin":
        #     Username = data["Username"]
        #     print(Username)
        #     user = Admin_Login_user(Username)
        #     if user["status"] == 200:
        #         response = HttpResponse(json.dumps({"Status": 200}), content_type="application/json")
        #         response.set_cookie('Admin_id', user["_id"])
        #     else:
        #         response = HttpResponse(json.dumps({"Status": 100}), content_type="application/json")
        #     return response

        if data["action"] == "AdminOTP":
            Username = data["Username"]
            # status = Check_user(Username)
            otp = 1111
            # otp=send_otp_to_phone(Username)
            print("Admin otp Called")
            context = {"Status": 200, "otp": otp}
            response = HttpResponse(json.dumps(context), content_type="application/json")
            return response

        if data["action"] == "TotalQueries":
            number = Total_Queries()
            context = {"Number": number,'action':data["action"]}
            context = parse_json(context)
            return JsonResponse(context)

        if data["action"] == "TotalQueries_location":
            print("yes")
            number = All_query_position()
            context = {"Number": number, 'action':data["action"]}
            context = parse_json(context)
            return JsonResponse(context)

        if data["action"] == "Get_Query":
            num = data["id"]
            Query = GetQuery(num)
            context = {"Query":Query,'action':data["action"]}
            context = parse_json(context)
            return JsonResponse(context)
        
        if data["action"] == "ReplyQuery":
            num = data["id"]
            Answer = data["Answer"]
            Query =ReplyQuery(num,Answer)
            context = {"Query":Query,'action':data["action"]}
            context = parse_json(context)
            return JsonResponse(context)
        
        if data["action"] == "All_Queries":
            all_user=All_queries()
            context = {"all_queries":all_user,'action':data["action"]}
            context = parse_json(context)
            return JsonResponse(context)
        
        if data["action"] == "All_User":
            all_user=All_userdetails()
            context = {"all_user":all_user,'action':data["action"]}

            context = parse_json(context)
            return JsonResponse(context)

    context = {"body": dict(request.GET)}
    return JsonResponse(context)

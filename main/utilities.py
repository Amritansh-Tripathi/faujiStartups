import pymongo
from bson import ObjectId, json_util
import certifi
import operator
import json
import base64
import secrets
import string
import datetime
from dateutil.tz import gettz
import time

 
# Databse Connection
# connect_string = r'mongodb://localhost:27017/?readPreference=primary&directConnection=true'
# my_client = pymongo.MongoClient(connect_string, tlsCAFile=certifi.where())
connect_string = r'mongodb://localhost:27017/?readPreference=primary&directConnection=true'
my_client = pymongo.MongoClient(connect_string)
dbname = my_client['FaujiAgro']

def parse_json(data):
    return json.loads(json_util.dumps(data))

def User_Activity(_id):
    collection=dbname['User Activity']
    document = {"user_id": ObjectId(_id),
                "Activity": datetime.datetime.now(tz=gettz('Asia/Kolkata')),
                    }
    collection.insert_one(document)

def Login_user(username):
    collection=dbname['Users']
    status=100
    _id=None
    for user in collection.find({"Username":str(username)}):
        status=200
        _id=user["_id"]
        User_Activity(_id)
    return {"Status":status,"_id":_id} 

def Admin_Login_user(username):
    collection=dbname['Admin']
    status=100
    _id=None
    for user in collection.find({"Username":str(username)}):
        status=200
        _id=user["_id"]
        User_Activity(_id)
    return {"Status":status,"_id":_id} 

def Check_user(username):
    status=200
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
        status=100
    return status

def Visitor(ip):
    status=200
    collection=dbname['Visitor']
    for i in collection.aggregate([{"$match":{"ip":ip}},{"$project":{"_id":1}}]):
        status=100
    if status==200:
        document = {"ip":ip,
                    "Activity": datetime.datetime.now(tz=gettz('Asia/Kolkata')),
                        }
        collection.insert_one(document)
    collection=dbname["Users"]
    count=0
    for i in collection.aggregate([{"$match":{}}]):
        count=count+1
    tot_registration=count

    collection=dbname["Visitor"]
    count=0
    for i in collection.aggregate([{"$match":{}}]):
        count=count+1
    tot_visitor=count
    return {"tot_registration":tot_registration,"tot_visitor":tot_visitor}



def userdetails(id):
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"_id":ObjectId(id)}}]):
        i["_id"]=0
    return i

def User_Registration(username,location):
    status=200
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
        status=100
    if status==200:    
        document = {"Username": username,
                    # "Name":name,
                    # "Role":Role,
                    "location":location,
                    "Account Created": datetime.datetime.now(tz=gettz('Asia/Kolkata')),
                    }
        collection.insert_one(document)
        for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
            id=i["_id"]
        User_Activity(id)
        return id
    else:
        return 100   
    
def User_profile(id,Role,lang):
    collection=dbname["Users"]
    collection.update_one({"_id":ObjectId(id)},{"$set":{"Role":Role,"Language":lang}})

def Post_Query(id,decs):
    collection=dbname["Query"]
    number=collection.count_documents({})
    document = {
                    "User_id": ObjectId(id),
                    # "Title":title,
                    # "Name":name,
                    # "Email":Email,
                    # "Role":role,
                    # "Category":category,
                    # "Utilization":Utilization,
                    "Query_number":str(number+1),
                    "Description": decs,
                    # "Location":land_location,
                    # "Land Quatity":land_qty,
                    # "Unit":land_unit,
                    "Query Raised": datetime.datetime.now(tz=gettz('Asia/Kolkata')),
                    "Answered":False,
                }
    collection.insert_one(document)
    return 200 

def UserQueries_no(id):
    collection=dbname["Query"]
    count=0
    queries=[]
    for i in collection.aggregate([{"$match":{"User_id":ObjectId(id)}}]):
        count=count+1
        i["_id"]=0
        i["User_id"]=0
        tuple = i["Query Raised"].timetuple()
        i["Query_Raised"] = time.mktime(tuple)
        queries.append(i)
    return {"Number":count,"Queries":queries}

 

#---------------------- ADMIN -------------------------------
def   Verfication(username,password):
    collection = dbname["Admin"]
    user = None
    for i in collection.aggregate([{"$match":{"Username": username, "Password": password}},{"$project":{"_id":1}}]):
        user = i["_id"]
    if user is not None:
        return user
    else:
        return -1 
    

def Total_Queries():
    collection=dbname["Query"]
    count=0
    for i in collection.find():
        count=count+1
    total=count
    count=0
    for i in collection.find({"Answered":False}):
        count=count+1
    Unans=count
    Answered=total-Unans
    return {"Total_query":total,"Unanswered":Unans,"Answered":Answered}

def All_query_position():
    collection=dbname["Users"]
    count=0
    queries=[]
    features=[]
    for i in collection.aggregate([{"$match":{}}]):
        count=count+1
        i["_id"]=0
        queries.append(i)
    for i in queries:
            ins={
                "coordinates": [-122.4194, 37.7749],
                "title": "Marker 1",
                "description": " "
            }
            try:
                i["location"]=[i["location"][1],i["location"][0]]
            
            except:
                i["location"]=[0,0]
            
            ins["coordinates"]=i["location"]
            try:
                ins["title"]=i["Role"][0]
            except:
                ins["title"]=""
                
            if i["location"]==[0,0]:
                k=1
            else:
                features.append(ins)    
    print(len(queries),"----------------Queries")
    print(features,"----------------features")

    # features=features[1:]
    # print(features)
    return {"Number":count,"Queries":queries,"Markers":features}

def GetQuery(Query_number):
    collection=dbname["Query"]
    for i in collection.aggregate([{"$match":{"Query_number":str(Query_number)}}]):
        i["_id"]=0
        i["User_id"]=0
        tuple = i["Query Raised"].timetuple()
        i["Query Raised"] = time.mktime(tuple)
        queries=i
    return {"Query":queries}


def All_userdetails():
    collection=dbname["Query"]
    Query=[]
    for i in collection.aggregate([{"$match":{}}]):
        i["_id"]=0
        i["Account Created"]=0
        Query.append(i)
    return Query

def All_queries():
    collection=dbname["Query"]
    users=[]
    for i in collection.aggregate([{"$match":{}}]):
        i["_id"]=0
        tuple = i["Query Raised"].timetuple()
        i["Query_Raised"] = time.mktime(tuple)
        userdetail=userdetails(i["User_id"])
        i["User_id"]=0
        i["Username"]=userdetail["Username"]
        i["Role"]=userdetail["Role"]
        i["location"]=userdetail["location"]
        users.append(i)
    return users

def ReplyQuery(Query_number,Answer):
    collection=dbname["Query"]
    collection.update_one({"Query_number":str(Query_number)},{"$set":{"Reply":Answer,"Answered":True}})
    return 200








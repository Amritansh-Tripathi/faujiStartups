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

def Check_user(username):
    status=200
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
        status=100
    return status

def userdetails(id):
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"_id":ObjectId(id)}},{"$project":{"Name":1,"_id":0}}]):
        details=i["Name"]
    return details

def User_Registration(username, name):
    status=200
    collection=dbname["Users"]
    for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
        status=100
    if status==200:    
        document = {"Username": username,
                    "Name":name,
                    "Account Created": datetime.datetime.now(tz=gettz('Asia/Kolkata')),
                    }
        collection.insert_one(document)
        for i in collection.aggregate([{"$match":{"Username":username}},{"$project":{"_id":1}}]):
            id=i["_id"]
        User_Activity(id)
        return id
    else:
        return 100   

def Post_Query(id,title,decs,land_location,land_qty,land_unit):
    collection=dbname["Query"]
    number=collection.count_documents({})
    document = {
                    "User_id": ObjectId(id),
                    "Title":title,
                    "Query_number":str(number+1),
                    "Description": decs,
                    "Location":land_location,
                    "Land Quatity":land_qty,
                    "Unit":land_unit,
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
        i["Query Raised"] = time.mktime(tuple)
        queries.append(i)
    return {"Number":count,"Queries":queries}

 

#---------------------- ADMIN -------------------------------

def Total_Queries():
    collection=dbname["Query"]
    count=0
    for i in collection.find():
        count=count+1
    return {"Number":count}

def All_query_position():
    collection=dbname["Query"]
    count=0
    queries=[]
    for i in collection.aggregate([{"$match":{}}]):
        count=count+1
        js={}
        js["Location"]=i["Location"]
        js["Query_number"]=i["Query_number"]

        tuple = i["Query Raised"].timetuple()
        js["Query Raised"] = time.mktime(tuple)
        queries.append(js)
    return {"Number":count,"Queries":queries}

def GetQuery(Query_number):
    collection=dbname["Query"]
    print(Query_number)
    queries="ERROR"
    for i in collection.aggregate([{"$match":{"Query_number":str(Query_number)}}]):
        i["_id"]=0
        i["User_id"]=0
        tuple = i["Query Raised"].timetuple()
        i["Query Raised"] = time.mktime(tuple)
        queries=i
    return {"Query":queries}








#!/usr/bin/env python

"""
 * @file dbFill.py
 * Used in CS498RK MP4 to populate database with randomly generated users and tasks.
 *
 * @author Aswin Sivaraman
 * @date Created: Spring 2015
 * @date Modified: Spring 2015
 * @date Modified: Spring 2019
"""

import sys
import getopt
import string
import urllib
import json
import requests
from random import randint
from random import choice
from datetime import date
from time import mktime

def usage():
    print('dbFill.py -u <baseurl> -p <port> -n <numUsers> -t <numTasks>')

def getUsers(conn):
    # Retrieve the list of users
    conn.request("GET","""/api/users?filter={"_id":1}""")
    response = conn.getresponse()
    data = response.read()
    d = json.loads(data)

    # Array of user IDs
    users = [str(d['data'][x]['_id']) for x in range(len(d['data']))]

    return users

def main(argv):

    # Server Base URL and port
    baseurl = "localhost"
    port = 4000

    #FIRST POPULATE INGREDIENT LIST
#     ingredientList = requests.get("https://www.themealdb.com/api/json/v1/1/list.php?i=list").json()["meals"]
#     for ingrDict in ingredientList:
#          requests.post("http://localhost:4000/api/ingredient", data=ingrDict).json()
    

    #POPULATE THE RECIPE LIST
    mealIDs = []
    categoryList = requests.get("https://www.themealdb.com/api/json/v1/1/list.php?c=list").json()["meals"]
    for category in categoryList:
         cat = category["strCategory"]
         newURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + cat
         mealList = requests.get(newURL).json()["meals"]
         for meal in mealList:
              mealIDs.append(meal["idMeal"])
    count = 0
    for mealID in mealIDs:
         mealURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID
         meal = requests.get(mealURL).json()["meals"][0]
         mealInfo = {}
         mealInfo["RecipeName"] = meal["strMeal"]
         mealInfo["RecipeId"] = meal["idMeal"]
         mealInfo["Instructions"] = meal["strInstructions"]
         mealInfo["RecipePic"] = meal["strMealThumb"]
         mealInfo["Ingreds"] = []
         mealInfo["Amounts"] = []
         for i in range(1, 21):
              ingredientNum = "strIngredient" + str(i)
              amountNum = "strMeasure" + str(i)
              if((meal[ingredientNum] is not None) and meal[ingredientNum] != ""):
                    ingredientName = string.capwords(meal[ingredientNum])
                    amount = meal[amountNum]
                    mealInfo["Ingreds"].append(ingredientName)
                    mealInfo["Amounts"].append(amount)
         #print(mealInfo["Ingredients"])
         requests.post("http://localhost:4000/api/recipe", data=mealInfo)
         count+=1
    print("Added " + str(count) + " recipes to the database")
     


if __name__ == "__main__":
     main(sys.argv[1:])

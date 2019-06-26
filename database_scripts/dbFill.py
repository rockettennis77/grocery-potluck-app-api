#!/usr/bin/env python

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

     #TODO: MAKE SURE THE NEW FILL PUTS INGREDIENT IDS INSTEAD OF NAMES
    #FIRST POPULATE INGREDIENT LIST
     ingrNameToID = {}
     ingredientList = requests.get("http://localhost:4000/api/ingredient").json()["data"]
     counter = 0
     for ingrDict in ingredientList:
          ID = ingrDict["_id"]
          Nme = ingrDict["Name"]
          ingrNameToID[Nme] = ID
          counter += 1
          print(ingrDict["Name"])
     print(str(counter) + " ingredients found")
    
     
#    SCRIPT SECTION
#         Create IngredsAlterations     
     # counter = 0
     # print("Starting Recipes")
     # recipeList = requests.get("http://localhost:4000/api/recipe").json()["data"]
     # for recipe in recipeList:
     #      ingredientList = recipe["Ingreds"]
     #      newRecipe = recipe
     #      newIngreds = []
     #      newAlterations = []
     #      print("Recipe #" + str(counter))
     #      print(recipe["_id"])
     #      for ingr in ingredientList:
     #           if(ingr == "Butter, Softened"):
     #                print("   SOFTENED BUTTER")
     #                newAlterations.append("Softened")
     #                newIngreds.append("Butter")
     #           else:
     #                newAlterations.append("")
     #                newIngreds.append(ingr)
     #      counter += 1
     #      newRecipe["Ingreds"] = newIngreds
     #      newRecipe["IngredsAlterations"] = newAlterations
     #      requests.put("http://localhost:4000/api/recipe", data=newRecipe)
     # print("ALL done")

#     SCRIPT SECTION
#         POPULATE THE RECIPE LIST

#     mealIDs = []
#     categoryList = requests.get("https://www.themealdb.com/api/json/v1/1/list.php?c=list").json()["meals"]
#     for category in categoryList:
#          cat = category["strCategory"]
#          newURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + cat
#          mealList = requests.get(newURL).json()["meals"]
#          for meal in mealList:
#               mealIDs.append(meal["idMeal"])



#   SCRIPT SECTION
#   Find ingredients in recipes that aren't defined
     counter = 0
     print("Starting Recipes")
     recipeList = requests.get("http://localhost:4000/api/recipe").json()["data"]
     for recipe in recipeList:
          ingredientList = recipe["Ingreds"]
          newRecipe = recipe
          newIngreds = []
          print("Recipe #" + str(counter))
          print(recipe["_id"])
          for ingr in ingredientList:
               if ingr not in ingrNameToID:
                    print(str(ingr) + " not in dictionary")
               newIngreds.append(ingrNameToID[ingr])
          counter += 1
          newRecipe["Ingreds"] = newIngreds
          requests.put("http://localhost:4000/api/recipe", data=newRecipe)
     print("ALL done")


     #SCRIPT SECTION
#        Change the wording of one ingredient in all recipes
     # counter = 0
     # recipeList = requests.get("http://localhost:4000/api/recipe").json()["data"]
     # for recipe in recipeList:
     #      ingredientList = recipe["Ingreds"]
     #      newRecipe = recipe
     #      newIngreds = []
     #      print("Recipe #" + str(counter))
     #      print(recipe["_id"])
     #      for ingr in ingredientList:
     #           if ingr == "Harissa":
     #                newIngreds.append("Harissa Spice")
     #           else:
     #                newIngreds.append(ingr)
     #      counter += 1
     #      newRecipe["Ingreds"] = newIngreds
     #      requests.put("http://localhost:4000/api/recipe", data=newRecipe)
     # print("ALL done")

          

#     count = 0
#     for mealID in mealIDs:
#          mealURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID
#          meal = requests.get(mealURL).json()["meals"][0]
#          mealInfo = {}
#          mealInfo["RecipeName"] = meal["strMeal"]
#          mealInfo["RecipeId"] = meal["idMeal"]
#          mealInfo["Instructions"] = meal["strInstructions"]
#          mealInfo["RecipePic"] = meal["strMealThumb"]
#          mealInfo["Ingreds"] = []
#          mealInfo["Amounts"] = []
#          for i in range(1, 21):
#               ingredientNum = "strIngredient" + str(i)
#               amountNum = "strMeasure" + str(i)
#               if((meal[ingredientNum] is not None) and meal[ingredientNum] != ""):
#                     ingredientName = string.capwords(meal[ingredientNum])
#                     ingredientID = ingrNameToID[ingredientName]
#                     amount = meal[amountNum]
#                     mealInfo["Ingreds"].append(ingredientID)
#                     mealInfo["Amounts"].append(amount)
#          #print(mealInfo["Ingredients"])
#          requests.post("http://localhost:4000/api/recipe", data=mealInfo)
#          count+=1
#     print("Added " + str(count) + " recipes to the database")
     


if __name__ == "__main__":
     main(sys.argv[1:])

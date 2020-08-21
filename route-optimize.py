import openrouteservice
from openrouteservice.directions import directions
from openrouteservice.geocode import pelias_search
from openrouteservice import convert
from api import API_KEY
from furl import furl

# https://github.com/GIScience/openrouteservice-py
# coords = ((8.34234,48.23424),(8.34423,48.26424))
client = openrouteservice.Client(key=API_KEY) # Specify your personal API key
# https://www.google.com/maps/dir/1100+Soquel+Ave,+Santa+Cruz,+CA+95062/300+Main+St,+Santa+Cruz,+CA+95060/University+of+California+Santa+Cruz,+High+Street,+Santa+Cruz,+CA/@36.9742734,-122.0518309,14z/data=!3m1!4b1!4m20!4m19!1m5!1m1!1s0x808e401ec5d48f47:0x56732096e8d14826!2m2!1d-122.011663!2d36.9790077!1m5!1m1!1s0x808e6a9bb8952cfb:0x6ea529f17577133e!2m2!1d-122.0227325!2d36.9651634!1m5!1m1!1s0x808e41a2ff8cbf4f:0x3a8e3b7c928320d5!2m2!1d-122.0582093!2d36.9880503!3e0
# https://developers.google.com/maps/documentation/urls/get-started
# https://github.com/gruns/furl
#?? https://ask.openrouteservice.org/t/round-trip-request/1622
#https://openrouteservice.org/dev/#/api-docs/introduction
takingInput = True
addresses = ["1100 Soquel Ave, Santa Cruz, CA 95062"]
startingLocation = input("Please enter your address (where you will be starting).\n")

while takingInput:
  userInput = input("Enter an address and hit enter to add it to your route. Once you are done adding stops, type c.\n")
  isStore = input("Is this a store? Type y (Yes) or n (No)\n")
  if userInput == "c":
    takingInput = False
  else:
    addresses.append({userInput, isStore})


coordinates = []
peliasObj = pelias_search(client, "1100 Soquel Ave, Santa Cruz, CA 95062", size=1, country='USA')
print(peliasObj['features'][0]['geometry']['coordinates'])
for address in addresses:
  peliasObj = pelias_search(client, address, size=1, country='USA')
  coordinates.append(peliasObj.features[0].geometry.coordinates)

# for coord in coordinates:
#   print(coord)


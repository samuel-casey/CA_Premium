import csv
from selenium import webdriver as webdriver
from time import sleep

driver = webdriver.Chrome()

# webscraping list of all station IDs from NOAA site
station_list_URL = 'https://tidesandcurrents.noaa.gov/stations.html?type=All%20Stations&sort=1'

driver.get(station_list_URL)
sleep(1)

stations_container = driver.find_element_by_xpath("/html/body/div[2]/div[2]/div[2]/div/div[3]/div[contains(@class, 'span12')]")

a_children_by_xpath = stations_container.find_elements_by_xpath(".//a")


ids = []
cities = []
lat = []
lon = []

print("appending IDs")
for i in range(len(a_children_by_xpath)):
    a_tag = a_children_by_xpath[i]
    id = a_tag.text[0:7]
    city = a_tag.text[8:]
    if id != "":   
        ids.append(id)
        cities.append(city)
print("IDs appended")
print(cities)

# print(ids)

with open ('scraping_output.csv', "w+", newline="") as id_csv:
    writer = csv.writer(id_csv)
    for observation in cities:
        writer.writerow([observation])
print("check CSV")

from pymongo import MongoClient
from datetime import datetime
from datetime import timedelta
from opendata import read_data_from_id, transfer_data
import json

client = MongoClient()
db = client.opendata
entries = db.metadata.find()
for entry in entries:
    l = len(entry["data"][0]["Sidst opdateret"].split(' ')[0])
    extra_zero = '' if l>1 else "0"
    date_str = extra_zero + entry["data"][0]["Sidst opdateret"].replace('Januar', 'January').replace('Februar', 'February').replace('Marts', 'March').replace('Maj', 'May').replace('Juli', 'July').replace('Juni', 'June').replace('Oktober', 'October')
    d =  datetime.strptime(date_str, '%d %B %Y')
    n = d.replace(year=d.year + 1) 
    f = "Anually" if not entry.has_key('update_frequency') else entry['update_frequency']
    #print entry["name"], d , f, n, 
    if n < datetime.now():
        data = read_data_from_id(entry["Resource Id"])
        transfer_data(data, entry["name"], save_file=False, remove=True)

        entry["data"][0]["Sidst opdateret"] = datetime.now().strftime("%d %B %Y")
        db.metadata.update({"name": entry["name"]}, {"$set" : { "data" : entry["data"] }}, upsert = True)


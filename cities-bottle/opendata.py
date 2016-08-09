__author__ = 'Anders'
# Python Imports
import urllib
import json


#Third party imports
from pymongo import MongoClient

# Picodat libs
import html_handler as hh
from bson.objectid import ObjectId
BASE_URL = 'http://portal.opendata.dk'


def read_data_from_id(id, limit = 0, saveFile = False):
    limit_str = ''
    if limit > 0:
        limit_str = '&limit=' + str(limit)
    url = 'http://portal.opendata.dk/api/action/datastore_search?resource_id=' + id + limit_str
    fileobj = urllib.urlopen(url)
    data = json.loads(fileobj.read())
    return data

def transfer_data(data, name, save_file=False, remove=False):
    if not data['success']:
        return False
    client = MongoClient()
    db = client.opendata

    roofs = data['result']['records']
    #table_name = data['result']['resource_id']
    table_name = name
    if db[table_name].find().count() > 0 and remove:
        db[table_name].remove()

    for roof in roofs:
        db[table_name].insert(roof)

    print_data(table_name, db)
    if save_file:
        with open(id + '.json', 'w') as outfile:
            json.dump(data, outfile)
    return True
def print_data(table_name, db):
    cursor = db[table_name].find()
    for row in cursor:
        print row

def save_metadata(metadata, name, id):
    metadata["name"] = name
    client = MongoClient()
    db = client.opendata
    table_name = 'metadata'
    meta_obj = db[table_name].find({"Resource Id": id})
    if meta_obj.count() > 0:
        meta_obj = meta_obj[0]
        metadata["_id"] = meta_obj["_id"]
        db[table_name].save(metadata)
    else:
        db[table_name].insert(metadata)
    #db[table_name].insert(metadata)
    print_data(table_name, db)

def get_source_metadata(id = None):
    client = MongoClient()
    db = client.opendata
    table_name = 'metadata'
    
    if id:
        table_data = db[table_name].find({'_id': ObjectId(id)})[0]
        #table_data = db[table_name].find()
        return table_data
    else:
        table_data = db[table_name].find()
        sources = [source for source in table_data]
        return sources
if __name__ == '__main__':
    user_input = 'http://portal.opendata.dk/dataset/gronne-tage'
    user_input = 'http://portal.opendata.dk/dataset/gronne-tage/resource/d8c775d7-5487-4bb2-82e2-5afe9669c380'
    #id, name = get_id_and_name_from_url(user_input)
    #id = 'd8c775d7-5487-4bb2-82e2-5afe9669c380'
    #resource_url = 'http://portal.opendata.dk/dataset/gronne-tage/resource/d8c775d7-5487-4bb2-82e2-5afe9669c380'
    id, name, site_url = hh.get_id_and_site_url(user_input)
    resource_url = site_url + '/' + id
    metadata = hh.get_metadata_for_resource(resource_url, id)
    save_metadata(metadata, name, id)
    data = read_data_from_id(id)
    status = transfer_data(data, name, remove = True)
#user_input = ['http://portal.opendata.dk/dataset/parknaturhundeskove/resource/3dad3008-b003-4b61-ae3b-b9f818916a34',
#              'http://portal.opendata.dk/dataset/gronne-tage/resource/d8c775d7-5487-4bb2-82e2-5afe9669c380',
#              'http://portal.opendata.dk/dataset/roed-afmaerkning/resource/ea75c3c1-cd8a-4c3b-9f49-68cea66cb77a',
#              'http://portal.opendata.dk/dataset/kulturhuse/resource/d57ace9d-e1d9-4231-a659-0e05ca27386d',
#              'http://portal.opendata.dk/dataset/fravaer/resource/260bf892-1862-4d96-bd4a-f561c0504441',
#              'http://portal.opendata.dk/dataset/parknaturhundeskove/resource/bad5d27b-ab92-4342-9caa-1d33d98aabd3']
#for url in user_input:
#    id, name = get_id_from_url(url)
#    data = read_data_from_id(id)
#    status = transfer_data(data, name, remove = True)
#    if not status:
#        print name + " failed"
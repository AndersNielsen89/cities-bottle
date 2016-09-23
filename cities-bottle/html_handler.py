# -*- coding: utf-8 -*-
""" Handles all functionality regarding html data mining """
# Python imports
import urllib
from uuid import UUID

# Third party imports
from bs4 import BeautifulSoup


def open_html(url):
    """ Standard function to open a BS4 html document """
    html_doc = urllib.urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')
    return soup

def get_metadata_for_resource(resource_url, id):
    """ Gets metadata as displayed on opendata """
    data = []
    soup = open_html(resource_url)
    for tr in soup.find_all('tr'):
        key = tr.find('th')
        val = tr.find('td')
        if key and val:
            key = key.string
            val = val.string
            data.append({key: val})
    meta_data = {"Resource Id": id, "data": data}

    for bq in soup.find_all('blockquote'):
        meta_data["Description"] = bq.text.replace('\n','')
    try:
        meta_data["Description"] is None
    except:
        meta_data["Description"] = "No description found"
    return meta_data

def get_id_and_site_url(url):
    """ Get resource id and base url from url """
    if url.endswith('/'):
        url = url[:-1]
    name = get_name_from_url(url)
    site_url = get_site_url(url)
    id = get_id_from_url(url)
    if not site_url.endswith('resource'):
        site_url = site_url + '/resource/'
    return id, name, site_url

def get_site_url(url):
    """ Gets base url for site based on random url """
    id = url[url.rfind('/')+1:]
    try: # This checks if the url contains a resource (GUID)
        val = UUID(id, version=4)
        return url[:url.rfind('/')]
    except ValueError: # its a site url
        return url
def get_name_from_url(url):
    if url.find('/resource/') != -1:
        return url[url.find('dataset/')+len('dataset/'):url.find('/resource/')]
    else:
        return url[url.find('dataset/')+len('dataset/'):]

def get_id_from_url(url):
    id = url[url.rfind('/')+1:]
    try: # This checks if the url contains a resource (GUID)
        val = UUID(id, version=4)
    except ValueError: # its a site url
        id= get_resource_id(url)
    return id

def get_resource_id(url):
    """ Finds resource id based on url """
    soup = open_html(url)
    id =[]
    for dset_item in soup.find_all('li', {"class": "resource-item"}):
        data_label = dset_item.find('span', {"class": "format-label"})
        if data_label.text == 'CSV':
            id.append(dset_item.get('data-id'))
            break
    if len(id) > 0:
        return id
    else:
        False

def get_available_datasets():
    """ Gets names of datasets except already stored datasets """
    url = 'http://portal.opendata.dk/dataset?res_format=CSV&page=1'
    soup = open_html(url)
    count = 0
    data = []
    for ul in soup.find_all('li', {"class": "dataset-item"}):
        #print ul
        div = ul.find('div')
        a = div.find('a')
        link = a['href'].split('/')[2]
        #print a['href']
        desc = "Dette data har ingen beskrivelse"
        div2 = div.find('div')
        if div2:
            desc = div2.string
        data.append({"title": a.string, "link":  link, "desc": desc})
    return data
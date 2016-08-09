__author__ = 'Anders'
from bs4 import BeautifulSoup
import urllib
from uuid import UUID

def open_html(url):
    html_doc = urllib.urlopen(url)
    soup = BeautifulSoup(html_doc, 'html.parser')
    return soup

def get_metadata_for_site(site_url):
    soup = open_html(site_url)

    return False
def get_metadata_for_resource(resource_url, id):
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
        meta_data["Description"] = bq.text
    return meta_data

def get_id_and_site_url(url):
    if url.endswith('/'):
        url = url[:-1]
    name = get_name_from_url(url)
    site_url = get_site_url(url)
    id = get_id_from_url(url)
    return id, name, site_url

def get_site_url(url):
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
    soup = open_html(url)
    id = ""
    for link in soup.find_all('a'):
        title = link.get('title')
        if title and title.endswith('.csv'):
            print title
            id = link.get('href')
    if len(id) > 0:
        return id, url
    else:
        False
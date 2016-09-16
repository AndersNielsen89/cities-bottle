"""
Routes and views for the bottle application.
"""
# -*- coding: utf-8 -*-
from bottle import route, view, request, post
from datetime import datetime
import opendata as od
import json
@route('/')
@route('/home')
@view('index')
def home():
    """Renders the home page."""
    return dict(
        year=datetime.now().year
    )

@route('/contact')
@view('contact')
def contact():
    """Renders the contact page."""
    return dict(
        title='Contact',
        message='Your contact page.',
        year=datetime.now().year
    )

@route('/test')
@view('test')
def test():
    """Renders the contact page."""
    return dict(
        title='Test',
        message='Your contact page.',
        year=datetime.now().year
    )
@route('/about')
@view('about')
def about():
    """Renders the about page."""
    return dict(
        title='About',
        message='Your application description page.',
        year=datetime.now().year
    )

@route('/projects')
@view('projects')
def projects():
    """Renders the about page."""
    return dict(
        title='Projects',
        message='Your application description page.',
        year=datetime.now().year
    )


@route('/sources')
@view('sources')
def sources():
    
    sources = od.get_source_metadata()
    return dict(
        title='Sources',
        sources=sources,
        year=datetime.now().year
    )
@route('/source')
@view('source')
def source():
    source = None
    title = "Meta data"
    id = request.query['id']
    if not id == '0':
        source = od.get_source_metadata(id)
        source["opendata"] = None
    else:
        title = "Add new"
        source = od.get_list_from_opendata()
    return dict(
        title=title,
        source=source,
        year=datetime.now().year
           )

@post('/save_source', methods=['POST'])
def save_source():
    data = request.forms.items()
    id = data.pop()[1]
    key = data[1][1]
    val = data[2][1]
    delete = data[0][1]
    meta = od.get_source_metadata(id)
    meta_keys = [dic.keys()[0] for dic in meta["data"]]
    item = {key : val}
    if delete == 'true':
        meta["data"].remove(item)
    elif key in meta_keys:
        meta["data"][meta_keys.index(key)] = item
    else:
        meta["data"].append(item)
    od.save_metadata(meta, meta["name"], meta["Resource Id"])
    return 'done'
@post('/add_meta_data', methods=['POST'])
def add_meta_data():
    data = request.forms.items()
    user_input = request.forms.items()[0][1]
    url = 'http://portal.opendata.dk/dataset/' + user_input
    meta_data = od.add_new_source(url)
    
    
    return meta_data

@post('/transfer_data', methods=['POST'])
def transfer_data():
    id = data.pop()[1]
    name = data.pop()[1]
    #data = od.read_data_from_id(id)
    #status = od.transfer_data(data, name, remove = True)
    return

@route('/explore')
@view('explore')
def explore():
    source = None
    title = "Explore"
    id = request.query['id']
    explore_obj = {}
    name = od.get_name_from_resourceid(id)
    if name:
        keys = od.get_metadata_keys(name)
        if keys:
            explore_obj = {"name": name, "keys" : keys }
    else:
       explore_obj = {"name" : "Not found", "keys" : None }
   
    return dict(
        title=title,
        explore=explore_obj,
        year=datetime.now().year
            )
@post('/query_data', methods=['GET'])
def query_data():
    query = request.forms.dict
    keys = request.forms.dict["keys[]"]
    key_dict = {}
    for key in keys:
        name,visible = key.split(',')
        key_dict[name] = visible
    constraints = {}
    if "constraints[0][]" in request.forms.dict.keys():
        constraints = handle_constraints(request.forms.dict["constraints[0][]"])
    name = request.forms.dict["name"][0]
    data = od.query_data(name, key_dict, constraints)
    return json.dumps(data)

def handle_constraints(constraints):
    key = constraints[0]
    value = constraints[1]
    con = constraints[2]
    con_val = {}
    if con == 'In':
        con_val = { key: { "$in" : [v for v in value.split(',')] } }
    if con == "Contains":
        con_val = { key : "/.*" + value + ".*/i" }
    if con == "Equals":
        con_val = { key: { "$regex" : ".*" + value + ".*" } }
    return con_val

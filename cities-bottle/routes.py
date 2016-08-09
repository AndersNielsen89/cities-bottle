"""
Routes and views for the bottle application.
"""

from bottle import route, view, request, post
from datetime import datetime
import opendata as od
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
    
    id = request.query['id']
    source = od.get_source_metadata(id)
    return dict(
        title='Meta data',
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
    item = {key : val}
    if delete:
        meta["data"].remove(item)
    else:
        meta["data"].append(item)
    od.save_metadata(meta, meta["name"], meta["Resource Id"])
    return 'done'
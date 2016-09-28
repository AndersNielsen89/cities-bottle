% rebase('layout.tpl', title=title, year=year)

%if title != "Add new": 
<h2>{{ title }} -  {{source["name"] }} <a href="http://portal.opendata.dk/dataset/{{source["name"] }} ">(Source)</a> </h2> 
% else: 
<h2>{{ title }}</h2>
%end
%if not source["opendata"]:
New field  <button type="button" id="more_fields" class="btn btn-default btn-sm"  onclick="add_field({{len(source["data"])+1}});" >Add <span class="glyphicon glyphicon-plus" style="color:green"></span></button>
<ul id="source_fields">
    <input type="hidden" id="obj_id" value="{{source["_id"]}}">
	%count = 0
	%for data in source["data"]:
		%count = count + 1
		%d = data.items()[0]
		<li id="item{{str(count)}}">
            <span id="item{{str(count)}}_key">{{d[0]}}</span> :
            <span id="item{{str(count)}}_value">{{d[1]}}</span>
            <button type="button" id="remove_field{{str(count)}}" class="btn btn-default btn-sm" onclick="remove_field({{str(count)}});" value="Add new field">
                Remove <span class="glyphicon glyphicon-remove" style="color:red"></span>
            </button>
            <button type="button" id="edit_field{{str(count)}}" 
                    class="btn btn-default btn-sm" onclick="edit_field({{str(count)}});" value="">
                Edit
                <span class="glyphicon glyphicon-pencil" style="color:#ff9900"></span>
            </button>
		</li>
		
	%end
</ul>
%else:
<div class="form-group">
    <div class="row">
        <div class="col-md-6">
            <label for="new-item">Name (as stated on portal.opendata.dk)</label>
            <div><input type="text" class="form-control" id="new-item"><span class="btn btn-success" role="button" style="margin-top: 8px" onclick="add_new_source();">Add</span></div>
            <p><div id="status-meta"></div></p>
        </div>
        <div class="col-md-6">
            On this page it's possible to load a URL from opendata by entering its pathname. For instance, to load the URL http://portal.opendata.dk/dataset/trafiktal/, type in "trafiktal".
        </div>
    </div>
    <div><h3>Or load from OpenData.dk by clicking on the list below: </h3></div>
    <ul class="list-group">

        %for data in source["opendata"]:
        <li class="list-group-item" onclick="set_new_dataset('{{data["link"]}}');">
            <strong>{{data["title"]}}</strong>
            <span class="badge">CSV</span>
            <div> {{data["desc"]}}</div>
        </li>
        %end
    </ul>
</div>
%end



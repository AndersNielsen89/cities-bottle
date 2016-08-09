% rebase('layout.tpl', title=title, year=year)

<h2>{{ title }} - {{source["name"] }}</h2> 
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
		
	% end
</ul>



% rebase('layout.tpl', title=title, year=year)

<h2>{{ title }}.</h2>

    %count = 0
    
    % for source in sources:
        %if count % 3 == 0:
        <div class="row">
        %end
        <div class="col-sm-6 col-md-4">
            <div class="thumbnail">
                <div id="img_container{{str(count)}}"></div>
                <div class="caption">

                    <h3>{{source["name"]}} </h3>
                    <p>{{source["Description"]}}</p>
                    <p><a href="/source?id={{source["_id"]}}" class=" btn btn-primary" role="button">Explore &raquo;</a>
                        <a href="/source?id={{source["_id"]}}" class="btn btn-info" role="button">Meta data &raquo;</a>

                </div>
            </div>
        </div>
        %if count % 3 == 2 or count == len(sources)-1:
        </div>
        %end
    %count = count + 1
    % end


<!--<ul>
  % for source in sources:
    <li><h3><a href="/source?id={{source["_id"]}}">{{source["name"]}} - Sidst opdateret: {{source["data"][0]["Sidst opdateret"]}}</a></h3></li>
	
		%for data in source["data"]:
		%d = data.items()[0]
		<li>{{d[0]}} : {{d[1]}}</li>
        %break
        % end
    
  % end
</ul>-->


<script src="/static/scripts/jquery-1.10.2.js"></script>
<script src="/static/scripts/cities.js"></script>
%count = 0

% for source in sources:

    <script type="text/javascript">
        get_image_from_tags("{{source["Description"]}}", {{str(count)}});
    </script>
%count = count + 1
% end
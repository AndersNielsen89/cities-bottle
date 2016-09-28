% rebase('layout.tpl', title=title, year=year)

<span><h2>{{ title }} <a href="/source?id=0" class="btn btn-success" role="button" >New Source <span class="glyphicon glyphicon-plus"></a></h2></span>

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
                    <p><a href="/explore?id={{source["Resource Id"]}}" class=" btn btn-primary" role="button">Explore &raquo;</a>
                        <a href="/source?id={{source["_id"]}}" class="btn btn-info" role="button">Meta data &raquo;</a>

                </div>
            </div>
        </div>
        %if count % 3 == 2 or count == len(sources)-1:
        </div>
        %end
    %count = count + 1
    % end




<script src="/static/scripts/jquery-1.10.2.js"></script>
<script src="/static/scripts/cities.js"></script>
%count = 0

% for source in sources:

    <script type="text/javascript">
        get_image_from_tags("{{source["Description"]}}", {{str(count)}});
    </script>
%count = count + 1
% end
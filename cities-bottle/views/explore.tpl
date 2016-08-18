% rebase('layout.tpl', title=title, year=year)
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<h2>{{ title }} - {{explore["name"]}}</h2>
<input type="hidden" id="dataname" value="{{explore["name"]}}" />
This page enables you to query data. 

<h3>Select data fields:</h3>
<div id="datafields">
    %count = 0
    % if explore["keys"]:
    % for key in explore["keys"]:
    <button type="button" class="btn btn-default" id="key{{count}}" onclick="changeColor('key{{count}}');">{{key}}</button>
    %count += 1
    % end
</div>
<p></p>
<div>
    <button type="button" class="btn btn-success" onclick="query_data();">Run</button>
</div>
<div id="constraints">

</div>
<div id="results">
    <h2>Results</h2>
    <p></p>
    <div class="table-responsive">
        
    </div>
</div>

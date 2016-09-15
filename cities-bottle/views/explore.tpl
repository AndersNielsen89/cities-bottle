% rebase('layout.tpl', title='Home Page', year=year)

<h2>{{ title }} - {{explore["name"]}}</h2>
<input type="hidden" id="dataname" value="{{explore["name"]}}" />
This page enables you to query data.

<h3>Select data fields:</h3>
<div id="datafields" class="well well-lg">
    %count = 0
    % if explore["keys"]:
    % for key in explore["keys"]:
    <button type="button" class="btn btn-default" id="key{{count}}" onclick="changeColor('key{{count}}');">{{key}}</button>
    %count += 1
    % end
</div>
<p></p>
<h3>Narrow down your search (under udvikling):</h3>
<div class="well well-lg">
    This section allows you to retrieve only a subset of the documents matching a certain criteria. 
    <div class="row">
        <div class="col-lg-6" id="dropdown-container">

            <select class="form-control" onchange="getWhereField()" style="display: inline">
                %count = 0
                % if explore["keys"]:
                % for key in explore["keys"]:
                <option value="key{{count}}">{{key}}</option>
                %count += 1
                % end
            </select>
            <div id="incontainer" class="btn-group" role="group">
                
                    <button id="in-button" type="button" class="btn btn-default" onclick="changeColorsForGroup('in-button')">In</button>
                    <button id="con-button" type="button" class="btn btn-default" onclick="changeColorsForGroup('con-button')">Contains</button>
                    <button id="eq-button" type="button" class="btn btn-default" onclick="changeColorsForGroup('eq-button')">Equals</button>
                
            </div>
        </div>
        <div class="col-lg-6">
            <span class="input-group">
                <span class="input-group-addon" id="basic-addon1">Q</span>
                <input type="text" class="form-control" placeholder="Query" aria-describedby="basic-addon1" id="query-holder">
            </span>

        </div>
    </div>
    <p></p>
    <div class="row">    
        <button type="button" class="btn btn-success" onclick="query_data();">Run query</button>
    </div>
</div>
<p></p>
<div class="well well-lg">
    

    <div id="constraints">

    </div>
    <div id="results">
        <h2>Results</h2>
        <p></p>
        <div class="table-responsive">

        </div>
    </div>
</div>
function add_field(i, key, val) {
    var objTo = document.getElementById('source_fields');
    var divtest = document.createElement("li");
    key = $('#item' + String(i) + '_key').text()
    key = key ? key != undefined : "";
    val = $('#item' + String(i) + '_value').text()
    val = val ? val != undefined : "" ;
    divtest.id = "item" + String(i)
    divtest.innerHTML = '<input type="text" id="item' + String(i) + '_key" value="' + key + '"/> \
    </span><span><input type="text" id="item' + String(i) + '_value" value="' + val + '" /> \
    <button type="button" id="more_fields" class="btn btn-default btn-sm"  onclick="save_field(' + String(i) + ');" > \
    Save <span class="glyphicon glyphicon-ok" style="color:green"></span></button>\
    <button type="button" id="remove_field' + String(i) + '"\
        class="btn btn-default btn-sm" onclick="remove_field(' + String(i) + ');" value="">Undo \
        <span class="glyphicon glyphicon-remove" style="color:red"></span> \
    </button> ';
    objTo.appendChild(divtest);
}
function remove_field(i) {
    var list = document.getElementById('source_fields')
    var delObj = document.getElementById('item' + String(i));
    
    key = $('#item' + String(i) + '_key').text()
    val = $('#item' + String(i) + '_value').text()
    obj_id = $('#obj_id').val();
    console.log(i);
    console.log(key)
    console.log(val);
    url = "save_source"
    post_ajax_save(url, key, val, obj_id, true)
    list.removeChild(delObj);
}
function save_field(i) {
    console.log("save data" + String(i));
    key = $('#item' + String(i) + '_key').val();
    val = $('#item' + String(i) + '_value').val();
    obj_id = $('#obj_id').val();
    console.log(key)
    console.log(val);
    var divField = document.getElementById("item" + String(i))
    divField.innerHTML = '<span id="item' + String(i) + '_key">' + key + '</span> : \
    <span id="item' + String(i) + '_value">' + val + '</span> \
    <button type="button" id="remove_field' + String(i) + '"\
        class="btn btn-default btn-sm" onclick="remove_field(' + String(i) + ');" value="">Remove \
        <span class="glyphicon glyphicon-remove" style="color:red"></span> \
    </button> \
    <button type="button" id="edit_field' + String(i) + '"\
        class="btn btn-default btn-sm" onclick="edit_field(' + String(i) + ');" value="">Edit \
        <span class="glyphicon glyphicon-pencil" style="color:#ff9900"></span> \
    </button> '
    url = "save_source"
    post_ajax_save(url, key, val, obj_id, false)
}

function edit_field(i) {
    key = $('#item' + String(i) + '_key').text()
    val = $('#item' + String(i) + '_value').text()
    console.log(i);
    console.log(key)
    console.log(val);
    var divtest = document.getElementById("item" + String(i))
    divtest.innerHTML = '<input type="text" id="item' + String(i) + '_key" value="' + key + '"/> \
    </span><span><input type="text" id="item' + String(i) + '_value" value="' + val + '" /> \
    <button type="submit" id="more_fields" class="btn btn-default btn-sm"  onclick="save_field(' + String(i) + ');" > \
    Save <span class="glyphicon glyphicon-ok" style="color:green"></span></button>';
}
function post_ajax_save(url, key, val, obj_id, del) {
    $.post(url,
        {
            key: key,
            value: val,
            id: obj_id,
            del : del
        },
        function (data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
        });
}
function post_ajax(url, link, message) {
    $.post(url,
        {
            key: link
        },
        function (data, status) {
            document.getElementById("status-meta").innerHTML = message
            console.log(status);
            console.log(data);
            document.getElementById("status-meta").innerHTML = "Data transfered";
            return status;
        });
}


function add_new_source() {
    link = document.getElementById('new-item').value
    document.getElementById("status-meta").innerHTML = "<strong>Loading:</strong> Load begun";
    message = "<strong>Loading:</strong> Meta data completed";
    console.log(link);
    post_ajax("add_meta_data", link, message);
    message = "<strong>Success:</strong> Data transferred";
    //post_ajax("transfer_data", link, message);
    
}

function choose_top_important_words(tag) {
    splits = tag.split(' ');
    splits.sort(function (a, b) {
        return b.length - a.length || // sort by length, if equal then
               a.localeCompare(b);    // sort by dictionary order
    });
    
    
    return splits.slice(0, 1).toString();
}
    
function get_image_from_tags(tag, i) {
    tag = choose_top_important_words(tag);
    //console.log(tag)
    tag = tag.replace(/,/g, '+')
    //tag = tag.replace(/-/g, '+')
    //tag = tag.replace(/ae/g, 'æ')
    //tag = tag.replace(/aa/g, 'å')
    //tag = tag.replace(/oe/g, 'ø')
    console.log(tag);
    img_url = ""
    url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=fff0c6516d0ab756ba28605e9cef65a8&text=" + tag + "&per_page=1&page=1&format=json&nojsoncallback=1";
    try {
        if (tag != "description") {
            var result = null;
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'html',
                async: false,
                success: function (data) {
                    result = data;
                }
            }, 'json');
            console.log(result)
            jResult = JSON.parse(result);
            photo = jResult["photos"]["photo"][0];
            c = "c1"// + String(photo["farm"]) 
            size = "_m"
            img_url = "https://" + c + ".staticflickr.com/1/" + photo["server"] + "/" + photo["id"] + "_" + photo["secret"] + size + ".jpg"

            console.log(img_url);
        }
        else {
            img_url = "/static/content/Images/opendatadk.png"
        }
    }
    catch (err) {
        img_url ="/static/content/Images/opendatadk.png"
    }
    var divtest = document.getElementById("img_container" + String(i));
    var img = document.createElement("img");
    img.src = img_url;
    divtest.innerHTML = '<img src="' + img_url + '" style="height: 200px; width: 100%; display: block;"/>';
    return img_url;
}
function replace_all(tag) {
    while (tag.search(' ') >= 0) {
        tag = tag.replace(' ', '+')
    }
    return tag
}
function set_new_dataset(link) {
    document.getElementById('new-item').value = link;
}

function changeColor(buttonId) {
    console.log(buttonId);
    className = document.getElementById(buttonId).className
    if (className.search("primary") >= 0) {
        document.getElementById(buttonId).className = "btn btn-default"
    }
    else {
        document.getElementById(buttonId).className = "btn btn-primary"
    }  
}
function query_data() {
    no_show_btns = document.getElementsByClassName("btn btn-default")
    keys = []
    constraints = []
    show_btns = document.getElementsByClassName("btn btn-primary")

    for (i = 0; i < show_btns.length ; i++) {
        if (show_btns[i].id.search('-button') == -1) {
            key = show_btns[i].innerHTML
            console.log(key);
            keys.push(key + ",1");
        }
        else if(document.getElementById("query-holder").value != ""){ 
            key = $("#constraint-list option:selected").text();
            con_type = show_btns[i].innerHTML
            console.log(key);
            constraints.push([key, document.getElementById("query-holder").value, con_type]);
            //{"username" : /.*son.*/i}
        }
    }
    
    if (keys.length == 0) {
        for (i = 0; i < no_show_btns.length ; i++) {
            if (no_show_btns[i].id.search('-button') == -1) {
                key = no_show_btns[i].innerHTML
                console.log(key);
                keys.push(key + ",1");
            }
        }
    }
    var selected = $('.form-control').find("option:selected").text();
    console.log(keys);
    console.log(constraints);
    name = document.getElementById("dataname").value;
    //constraints = null
    post_ajax("query_data", keys, name, constraints);

}
function post_ajax(url, keys, name, constraints) {
    var result="";
    
    $.post(url,
          {
              keys: keys,
              name: name,
              constraints: constraints
          },
          function (data, status) {
              printData(data);
          });
}
function printData(data) {
    console.log("Data: " + data);
    data = JSON.parse(data);
    console.log(data[0]);
    table_headers = Object.keys(data[0]);
    
    
    console.log(table_headers.length);
    
    tableCreate(table_headers, data);
}
function tableCreate(table_headers, data) {
    var body = document.getElementsByClassName("table-responsive")[0];
    var tbl = document.createElement('table');
    tbl.className = "table";
    tbl.style.width = '100%';
    

    var thead = document.createElement('thead');
    var tr = document.createElement('tr');
    for (var i = 0; i < table_headers.length; i++) {
        
        var th = document.createElement('th');
        //console.log("TR Head " + table_headers[i])
        th.innerHTML = table_headers[i]
        tr.appendChild(th);
        
    }
    thead.appendChild(tr);
    var tbdy = document.createElement('tbody');
    
    for (var j = 0; j < data.length; j++) {
        d = data[j]
        var tr = document.createElement('tr');
        for (var i = 0; i < table_headers.length; i++) {

            var td = document.createElement('td');
            var s = d[table_headers[i]]
            if (s != null) s = s.replace(/\u0159/g, 'ø').replace(/\u0107/g, 'æ').replace(/\u013/g, 'æ').replace(/\u0106/g, 'Ć')
            td.innerHTML = s;
            tr.appendChild(td);

        }
        tbdy.appendChild(tr);
    }
    
    tbl.appendChild(thead);
    tbl.appendChild(tbdy);
    test = document.getElementsByClassName("table-responsive")[0]
    while (test.hasChildNodes()) {
        test.removeChild(test.firstChild);
    }
    document.getElementsByClassName("table-responsive")[0].appendChild(tbl)
}
function getWhereField() {
    var selected = $('.form-control').find("option:selected").text();
    var divtest = document.getElementById("where-container")
    //divtest.innerHTML = '<span><input type="text" id="where-' + String(selected) + '" />'
    //console.log(selected);
}
function changeColorsForGroup(buttonId) {
    className = document.getElementById(buttonId).className
    if (className.search("primary") >= 0) {
        document.getElementById(buttonId).className = "btn btn-default"
        
    }
    else {
        document.getElementById(buttonId).className = "btn btn-primary"
        btns = $("#incontainer").find('button');
        for (var i = 0; i < btns.length; i++) {
            btn = btns[i];
            if (btn.id != buttonId) {
                btn.className = "btn btn-default"
            }
        }
    }
}
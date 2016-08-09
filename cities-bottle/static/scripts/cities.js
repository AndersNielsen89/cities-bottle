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
    post_ajax(key, val, obj_id, true)
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
    post_ajax(key, val, obj_id, false)
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
function post_ajax(key, val, obj_id, del) {
    $.post("save_source",
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
    url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=2469e1658db70a7184afabc8520314fb&text=" + tag + "&per_page=1&page=1&format=json&nojsoncallback=1";
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
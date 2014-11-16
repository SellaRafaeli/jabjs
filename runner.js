//DOM elements
function get(id) {
    return document.getElementById(id);
}

input = get('input');
textarea = get('textarea');
select = get('select');
p = get('p');
div =get('div');
form = get('form');
checkbox = get('checkbox');

//JS models && usage
user = {};
user.details = {}; 

// bindModelToElem(user, 'input', [input, textarea]);    
// bindModelToElem(user, 'p', p);
// bindModelToElem(user.details, 'div', div);
// bindModelToElem(user, 'select', select);
// bindModelToElem(user, 'checked', checkbox);
//jab(user, 'p', p);


user.input = 'moshe';
user.name = "joe";
user.idx = 1;
user.checked = true;
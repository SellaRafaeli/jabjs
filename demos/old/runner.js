//JS models && usage

//0. Let's get some DOM elements
function get(id) {
    return document.getElementById(id);
}
button = get('button');
input = get('input');
textarea = get('textarea');
select = get('select');
p = get('p');
div =get('div');
form = get('form');
checkbox = get('checkbox');

//1. Basic usage - binding of models to DOM elements
user = {};
user.name = "William";
user.nickname = 'Billy';
user.idx = 1;
user.checked = true;
user.selectedOption = 1;

jab.bind(user, 'p', p); 
jab.bind(user, 'nickname', [input, textarea]); //multiple elements
jab.bind(user, 'selectedOption', select);
jab.bind(user, 'checked', checkbox);

//2. Advanced usage: binding with after-hooks 
car = {speed: "10", time: "3"};
computeDistance = function(){ car.distance = car.speed * car.time; };
jab.bind(car, 'speed', input, {afterHook: computeDistance} );
jab.bind(car, 'time', textarea, {afterHook: computeDistance});
jab.bind(car, 'distance',p);

//3. Advanced usage: binding to JS variables AND to DOM
man = {firstName: 'Bill', lastName: 'Clinton', fullName: ''};
jab.bindVar(man, ['firstName', 'lastName'], function() { man.fullName = man.firstName + " " +man.lastName } ); //whenever firstName or lastName change, fullName will also change...
jab.bind(man, 'fullName', div); //...and so will its binded view. 


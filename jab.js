/* helpers */
function toArray(itemOrArray) {
    itemOrArray = itemOrArray || [];
    var arrayified = ((itemOrArray).constructor === Array) ? itemOrArray : [itemOrArray];
    return arrayified;
}

function addListenerMulti(element, eventsString, func) { 
    var events = eventsString.split(' ');
    events.forEach(function(event) { element.addEventListener(event, func, false);  });    
}

/* DOM manipulation */
//return the property to access DOM element's value - 'value', 'innerHTML', 'selectedIndex', etc. 
function getDomValueProp(elem) { 

    if (elem.type == 'checkbox') return 'checked'; 
    if (elem.nodeName == 'INPUT') return 'value'; 
    if (elem.nodeName == 'TEXTAREA') return 'value'; 
    if (elem.nodeName == 'SELECT') return 'selectedIndex'; 

    return 'innerHTML'; //default
}

function getDomValue(elem) {
    var propName = getDomValueProp(elem);
    return elem[propName];
}

function setDomValue(elem, newValue) {
    var propName = getDomValueProp(elem);
    elem[propName] = newValue;
}

function syncDomElemsOnChange(obj, property, domElems) {        
    var events = 'change keyup';
    domElems.forEach(function(elem) { 
        addListenerMulti(elem, events, function(e) {
            obj[property] = getDomValue(e.srcElement);             
        }); 
    });        
}

function modifyElems(domElems, newValue, opts) {
    if (domElems.length==0) { console.log("noop"); return; }
    var modifyingFunc = getModifyingFunc(opts)

    domElems.forEach(function(domElem) { 
        modifyingFunc(domElem, newValue);
    });
}

function getModifyingFunc(opts) {
    var opts = opts || {};    
    if (typeof opts == 'string') opts = {func: opts}; //treat input of 'foo' as {func: 'foo'}

    if (opts.func) {
        if ((opts.func.constructor) == Function) return opts.func; 
        switch(opts.func) {
            case 'show': return show;
            case 'bgcolor': return bgcolor;                                
            case 'disable': return disable;                                
        }
    }

    return setDomValue; //default 
}

/*custom bindings */
function show(elem, value) {
    value ? elem.style.visibility = null : elem.style.visibility = 'hidden';
}

function bgcolor(elem, value) {
    elem.style.backgroundColor = value;
}

function click(elem, value) {
    elem.addEventListener('click', value);
}

function disable(elem, value) {
    value ? elem.disabled = true : elem.disabled = false;
}

/* JabJS logic */
function markBindings(obj, property, domElems, opts) {
    var opts = opts || {};
    obj.jab = obj.jab || {};
    obj.jab.bindings = obj.bindings || {};
    obj.jab.bindings[property] = {elems: domElems, func: opts.func, opts: opts};         
}

function bindModelToElem(obj, property, domElems, opts) {    
    var domElems = toArray(domElems);
    var currentValue = obj[property] || '';     
    var opts = opts || {};

    Object.defineProperty(obj, property, {
        get: function() { return getDomValue(domElems[0]); }, //necessary in case DOM elem is externally modified
        set: function(newValue) { 
            modifyElems(domElems, newValue, opts); 
            if (opts.afterHook)(opts.afterHook)(newValue);
         },            
        configurable: true
    });

    syncDomElemsOnChange(obj, property, domElems);

    markBindings(obj, property, domElems, opts);    
    obj[property] = currentValue; //force assignment to trigger binding with the initial data
    return obj;
}

function bindVarCore(obj, property, cb) {
    var val = obj[property];
    Object.defineProperty(obj, property, {       
        get: function() { return val; },
        set: function(newValue){ val = newValue; cb(newValue); },            
        configurable: true
    });    

    obj[property] = obj[property]; //force to trigger binding
}

function bindVar(obj, propsList, cb) {
    var propsList = toArray(propsList);
    propsList.forEach(function(property) { bindVarCore(obj, property, cb) });
}


bimv = bindModelView = bindModelToView = bindObjPropToElements = bindModelToElem;
jab = {bind: bimv, bindVar: bindVar};
input = document.getElementById(('input'))
p = document.getElementById(('p'))

user = {firstName: 'Bill', lastName: 'Clinton', fullName: ''};
jab.bind(user, 'fullName', div);
jab.bindVar(user, ['firstName', 'lastName'], function() { user.fullName = user.firstName + " " +user.lastName } );

girl = {name: "Queen", lastName: "Latifa"};
setGirlsFullName = function(){ girl.fullName = girl.name + girl.lastName };
jab.bind(girl, 'name', input, {afterHook: setGirlsFullName} );
jab.bind(girl, 'lastName', textarea, {afterHook: setGirlsFullName});
jab.bind(girl,'fullName',p);

//jab.bindVar(user, 'lastName', function() { user.fullName = user.firstName + " " +user.lastName } );
console.log("done");

/* helpers */
function toArray(itemOrArray) {
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
    obj.bindings = obj.bindings || {};
    obj.bindings[property] = {elems: domElems, func: opts.func, opts: opts};         
}

function bindModelToElem(obj, property, domElems, opts) {    
    var domElems = toArray(domElems);
    var currentValue = obj[property] || '';     

    Object.defineProperty(obj, property, {
        get: function() { return getDomValue(domElems[0]); }, 
        set: function(newValue) { modifyElems(domElems, newValue, opts); },            
        configurable: true
    });

    if (domElems.length > 1) { syncDomElemsOnChange(obj, property, domElems); }               

    markBindings(obj, property, domElems, opts);    
    obj[property] = currentValue; //force assignment to trigger binding with the initial data
    return obj;
}

bimv = bindModelView = bindModelToView = bindObjPropToElements = bindModelToElem;
jab = {bind: bimv};
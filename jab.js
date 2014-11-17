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

function setDomElemsVal(domElems, newValue) {
    domElems.forEach(function(domElem) { 
        setDomValue(domElem, newValue) 
    });
}

function syncDomElemsOnChange(obj, property, domElems) {        
    var events = 'change keyup';
    domElems.forEach(function(elem) { 
        addListenerMulti(elem, events, function(e) {
            obj[property] = getDomValue(e.srcElement);             
        }); 
    });        
}

/* JabJS logic */
function markBindings(obj, property, domElems) {
    obj.bindings = obj.bindings || {};
    obj.bindings[property] = domElems;         
}

function bindModelToElem(obj, property, domElems) {
    var domElems = toArray(domElems);
    var currentValue = obj[property] || ''; 

    Object.defineProperty(obj, property, {
        get: function() { return getDomValue(domElems[0]); }, 
        set: function(newValue) { setDomElemsVal(domElems, newValue) },            
        configurable: true
    });

    if (domElems.length > 1) { syncDomElemsOnChange(obj, property, domElems); }               

    markBindings(obj, property, domElems);    
    obj[property] = currentValue; //force assignment to trigger binding
    return obj;
}

jab = bimv = bindModelView = bindModelToView = bindObjPropToElements = bindModelToElem;
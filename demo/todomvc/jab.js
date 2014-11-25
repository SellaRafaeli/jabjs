(function(){     
    /* helpers */
    function isString(s) {
        return (typeof s == 'string');
    }

    function isObj(o) {
        return (typeof o == 'object');
    }

    function isArray(a) {
        return a.constructor === Array;
    }

    function getAttributesNames(domElem) { 
        return Array.prototype.slice.call(domElem.attributes).map(function(item) { return item.name });
    } 

    function toArray(itemOrArray) { //
        itemOrArray = itemOrArray || [];
        if (isArray(itemOrArray)) return itemOrArray;
        if (itemOrArray.constructor === HTMLCollection) return Array.prototype.slice.call(itemOrArray);
        if (itemOrArray.constructor === NodeList) return Array.prototype.slice.call(itemOrArray);
        
        return [itemOrArray];        
    }

    var toArr = toArray;

    function addListenerMulti(element, eventsString, func) { 
        var events = eventsString.split(' ');
        events.forEach(function(event) { element.addEventListener(event, func, false);  });    
    }

    function toDomElems(selectorOrElem) {
        if (isString(selectorOrElem)) return toArray(document.querySelectorAll(selectorOrElem));
        return selectorOrElem;
    }

    function descendants(elem) { 
        var res = toArr(elem.querySelectorAll("*"))
        res.push(elem); 
        return res;
    }

/* DOM manipulation */
//return the property to access DOM element's value - 'value', 'innerHTML', 'selectedIndex', etc. 
function getDomValueProp(elem) { 

    if (elem.type == 'checkbox') return 'checked'; 
    if (elem.nodeName == 'INPUT') return 'value'; 
    if (elem.nodeName == 'TEXTAREA') return 'value'; 
    if (elem.nodeName == 'SELECT') return 'selectedIndex'; 

        return 'textContent'; //default
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
    if (isString(opts)) opts = {func: opts}; //treat input of 'foo' as {func: 'foo'}

    if (opts.func) {
        if ((opts.func.constructor) == Function) return opts.func; 
        switch(opts.func) {
            case 'show': return show;
            case 'bgcolor': return bgcolor;                                
            case 'disable': return disable;                                                               
            case 'enter': return enter;
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

function disable(elem, value) {
    value ? elem.disabled = true : elem.disabled = false;
}

function enter(elem, cb) { //should be refactored into a markupBinding        
    if (elem.listenEnter) return;
    elem.listenEnter = true;

    elem.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"                        
            var value = elem.value;
            cb(value);            
            elem.value = ""; //clean             
        }
    });    
}
    

/* JabJS logic */
function markBindings(obj, property, domElems, opts) {
    var opts = opts || {};
    obj.jab = obj.jab || {};
    obj.jab.bindings = obj.bindings || {};
    obj.jab.bindings[property] = {elems: domElems, func: opts.func, opts: opts};         
}

function bindModelToElem(obj, property, domElems, opts) {    
    var domElems = toArray(toDomElems(domElems)); //ensure DOM elems array
    var currentValue = obj[property] || '';     
    var opts = opts || {};

    if (isArray(obj[property])) {
        var _arr = obj[property];
        var originalDOMNode = domElems[0];
             originalDOMNode.originalParent = originalDOMNode.parentElement;
        Object.defineProperty(obj, property, {
            get: function() { 
                return _arr; },
            set: function(newValue) { 
                _arr = newValue; 
                bindArr(_arr, originalDOMNode);                 
                return _arr; }
        });
        
        obj[property] = _arr; //trigger to start        
        return _arr;
    }
    
    //not array, simple values
    Object.defineProperty(obj, property, {
        get: function() { return getDomValue(domElems[0]); }, //necessary in case DOM elem is externally modified
        set: function(newValue) { 
            modifyElems(domElems, newValue, opts); 
            if (opts.afterHook)(opts.afterHook)(newValue); //opts.afterHook is a function. If present, it executes on 'newValue'. 
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

function bindMarkupCallbacks(obj, elems) {
    elems.forEach(function (elem) {
        var attributes = getAttributesNames(elem);
        attributes.forEach(function(attr) {
            if (attr.indexOf('jab-') == 0) { //starts with jab-
                var cbType = attr.substring('jab-'.length); //part after jab-. E.g. "click"
                var eventName = 'on'+cbType;
                var cbName  = elem.getAttribute(attr);                
                elem[eventName] = function() { 
                    if (obj[cbName]) obj[cbName](elem); 
                    
                    else { //immediate, literal callbacks
                        var parts = cbName.split('-');
                        if (parts[0] == 'addClass')       elem.classList.add(parts[1]);                        
                        if (parts[1] == 'removeClass')  elem.classList.removeClass(parts[1]);                         
                    }
                }
            }
        }); 
    });
}

//bind all properties of all descendants of one element, by 'name' (or other) attribute)
function bindObj(obj, elemOrSelector, domAttrForObjKey) {
    var elem = toArray(toDomElems(elemOrSelector))[0];

    var domAttr = domAttrForObjKey || 'name'; //this attr holds the key for the obj's prop to bind with. 
    var elems = descendants(elem); 
    if (!elems.length) { 
        elems = [elem];
     }//if no children, bind to himself.        

     //map which elems are binded to which object keys
    var objKeysMap = elems.reduce(function(totalVal, curElem) {                                 
                                    var key = curElem.getAttribute(domAttr); //object key to bind to object
                                    if(key) { totalVal[key] = totalVal[key] || []; totalVal[key].push(curElem); } 
                                    return totalVal;
                                }, {});

    for (key in objKeysMap) { 
        var bindedElems = objKeysMap[key]; 
        if (obj.hasOwnProperty(key)) bindModelToElem(obj, key, bindedElems);                
    }
    
    bindMarkupCallbacks(obj, elems);
    
    return obj;
}

function clearElem(node) { //clears elem's contents. (like .innerHTML = '');
    try { 
        node.innerHTML = ''; //alternative: while (node.firstChild) { node.removeChild(node.firstChild); }
    } catch (e) {
        var temp = node;
        throw e;
    }
}

var arrayChangingFuncs = ["pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];

function setArrOnChangesCB(arr, cb) { 
    arrayChangingFuncs.forEach(function(funcName){ 
        var func = arr[funcName];
        arr[funcName] = function() {
            var res = func.apply(this, arguments);
            cb(arr);            
            return res;
        }
    });

    cb(arr); //trigger to start it off
}

function bindArr(arr, elem, domAttr) {            
    //var orig = elem;
    var elem = toArray(toDomElems(elem))[0]; 
    var papa = elem.parentElement || elem.originalParent;
    //whenever array changes, we want to...
    var repeatElementByArr = function(newArr) {        
        clearElem(papa);        
        newArr.forEach( function(item, index) {         
            if (isObj(item)) { //we can't bind primitives. 
                var newNode = papa.appendChild(elem.cloneNode(true));        
                jab.bindObj(item, newNode, domAttr);
            }
        });
        elem.parentElement = papa; //keep this for later    
    };    

    //when arr changes, repeatElementByArr
    setArrOnChangesCB(arr, repeatElementByArr);

    //enable refreshing
    arr.updateBindings = function() { 
        repeatElementByArr(arr);
    }

    //enable accessing by index, 
    arr.set = function(index, obj) {
        arr[index] = obj;
        arr.updateBindings();
    }
}

window.jab = {
    bind: bindModelToElem, 
    bindVar: bindVar, 
    bindObj: bindObj,
    bindArr: bindArr
};
console && console.log("loaded JabJS");
}());

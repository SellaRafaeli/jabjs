// bind property to element
// bind property to element, two way
// bind property to element, three way
// bind property to element, select & checkbox
// bind property to selector 
// bind property to [array of elements]

// bind with special binding (show, bgcolor, clickhandler) 
// bind with custom binding

// bind sub-element 
// afterhooks, interactive menus
// binding to javascript variables

// bind object to DOM node, recursively (with 'name' to signify obj's keys)
// bind object to DOM node, recursively (with custom domAttr to signify obj's keys)

// bind array of objects to element (repeater *within container - you must have container*)
// bind array to repeater (with custom dom attr to signify obj's keys)
// bind array as nested field, update in place
// bind array as nested field, replace completely 
// bind array - set new item using "set" 

// bind object, including array as nested field

//todos mvc




//(function(){     
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
        return toArr(elem.querySelectorAll("*")); 
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
            case 'click': return click;                                
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
//    var domElems = toDomElems(domElems); //ensure DOM elems
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

//bind all properties of all descendants of one element, by 'name' (or other) attribute)
function bindObj(obj, elemOrSelector, domAttrForObjKey) {
    var elem = toArray(toDomElems(elemOrSelector))[0];

    var domAttr = domAttrForObjKey || 'name'; //this attr holds the key for the obj's prop to bind with. 
    var elems = descendants(elem); 
    if (!elems.length) { 
        elems = [elem];
     }//if no children, bind to himself.        

    elems.forEach(function (elem) {
        objProperty = elem.getAttribute(domAttr);
        if (obj[objProperty]) bindModelToElem(obj, objProperty, elem);        
    });

    return obj;
}

function clearElem(node) { //clears elem's contents. (like .innerHTML = '');
    node.innerHTML = ''; //alternative: while (node.firstChild) { node.removeChild(node.firstChild); }
}

var arrayChangingFuncs = ["pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];

function setArrOnChangesCB(arr, cb) { 
    arrayChangingFuncs.forEach(function(funcName){ 
        var func = arr[funcName];
        arr[funcName] = function() {
            var res = func.apply(this, arguments);
            //console.log("invoked "+funcName+"; invoking CB");
            cb(arr);            
            return res;
        }
    });

    cb(arr); //trigger to start it off
}

function bindArr(arr, elem, domAttr) {        
    var orig = elem;
    var papa = elem.parentElement || elem.originalParent;
    //whenever array changes, we want to...
    var repeatElementByArr = function(newArr) {
        //debugger
        var origElem = elem;
        clearElem(papa);        
        orig.parentElement = papa; //keep this for later
        newArr.forEach( function(item, index) {         
            if (isObj(item)) { //if it's a primitive, it's unclear what/how to bind, since it does not have a father obj. 
                var newNode = papa.appendChild(orig.cloneNode(true));        
                jab.bindObj(item, newNode, domAttr);
            }
        });
        orig.parentElement = papa; //keep this for later    
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
console.log("loaded JabJS");
//}());

transport = {car: 'my car', bus: 'my bus2', boat: 'my boat3', inputName: 'zomba2'};
//bindNames(transport, div2);
// function loopNodeChildren(node) {
//     var children = toArray(node.children);    
//     children.forEach(function (child) { 
//         log(child); 
//         loopNodeChildren(child);
//     })
// }
// log = function(s) {console.log(s);}
// loopNodeChildren(div2);
//        var node;
//     for(var i=0;i<nodes.length;i++)
//     {
//         node = nodes[i];
//         if(output)
//         {
//             outputNode(node);
//         }
//         if(node.childNodes)
//         {
//             recurseDomChildren(node, output);
//         }
//     }
// }
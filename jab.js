

//(function(){     
    /* helpers */
    function isString(s) {
        return (typeof s == 'string');
    }

    function toArray(itemOrArray) { //
        itemOrArray = itemOrArray || [];
        if (itemOrArray.constructor === Array) return itemOrArray;
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
function bindObj(obj, elem, domAttr) {
    var domAttr = domAttr || 'name';
    var elems = descendants(elem); 
    if (!elems.length) { 
        elems = [elem];
     }//if no children, bind to himself.        

    elems.forEach(function (elem) {
        objProperty = elem.getAttribute(domAttr);
        if (obj[objProperty]) bindModelToElem(obj, property, elem);        
    });

    return obj;
}


window.jab = {bind: bindModelToElem, bindVar: bindVar, bindObj: bindObj};
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
//wip
// function jabArr(obj) { 
//     arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];
// }

// obj = [10,20,30] 

// arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];



// domElem = elem;

// originalElem = elem.cloneNode(true);
// // Your tinkering with the original
// elem.parentNode.replaceChild(originalElem, elem);






//ul.innerHTML = ''; 

function clearElem(node) { //clears elem's contents. (like .innerHTML = '');
    while (node.firstChild) { node.removeChild(node.firstChild); }
}

var arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];

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
    orig = elem;
    papa = elem.parentNode;
    //whenever array changes, we want to...
    repeatElementByArr = function(newArr) {
        //debugger
        clearElem(papa);
        newArr.forEach( function(item, index) {         
            if (isObj(item)) { //if it's a primitive, it's unclear what/how to bind, since it does not have a father obj. 
                var newNode = papa.appendChild(orig.cloneNode());        
                jab.bindObj(item, newNode, domAttr);
            }
        })    
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

arr = [{a:1}, {a:2}];
li = document.querySelector('.li');
bindArr(arr, li);

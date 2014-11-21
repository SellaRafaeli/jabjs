//wip
function jabArr(obj) { 
    arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];
}

obj = [10,20,30] 

arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];

function jabArr(obj) { 
    arrayChangingFuncs.forEach(function(funcName){ 
        var func = arr[funcName];
        obj[funcName] = function() {
            var res = func.apply(this, arguments);
            console.log("invoked "+funcName);
            return res;
        }
    });
}


domElem = elem;

originalElem = elem.cloneNode(true);
// Your tinkering with the original
elem.parentNode.replaceChild(originalElem, elem);


//should actually use while (myNode.firstChild) { myNode.removeChild(myNode.firstChild); }
arr = [{a:1}, {a:2}];
li = document.querySelector('.li');
orig = li;
//ul.innerHTML = ''; 

function clearElem(elem) { 
    elem.innerHTML = '';
}

function putArrayInDOM(newArr) {
    clearElem(ul);
    newArr.forEach( function(item, index) {         
        var newNode = ul.appendChild(orig.cloneNode());
        debugger
        jab.bind(item, 'a', newNode);
    })    
}


    putElem(elem));
    //ng
    <li ng-repeat="(country,goals) in items">{{country}}: {{goals}}</li>

    //ko
    <select multiple="multiple" width="50" data-bind="options: items"> </select>
    <ul data-bind="foreach: people">

    //jab
        //1. 
    <ul> 
        <li>..
        <li>
    
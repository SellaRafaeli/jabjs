//wip


function jabArr(obj) { 
    arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];
}

obj = [10,20,30] 

function jabArr(arr
arrayChangingFuncs = [ "pop", "push", "reverse", "shift", "unshift", "splice", "sort", "filter"];
arrayChangingFuncs.forEach(function(funcName){ 
    var func = arr[funcName];
    obj[funcName] = function() {
        func.apply(this, arguments);
        console.log("invoked "+funcName);
    }
});
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


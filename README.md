<!-- {"created_at": "2014-11-19"} -->

JabJS - Super-Simple Data-Binding
=================================

**JabJS** allows you to bind any JavaScript model to any DOM element:

```js
jab.bind(model, 'property', domElement[s]);
```

Example:

```js
user = {name: 'John Lennon'}; //any JavaScript object
jab.bind(user, 'name', document.getElementByid('input')); //user is now binded (two-way) with #input
```

Jab supports binding single properties, arrays, or complex objects. For example:

```html
<div id="friendsElem">    
      <section>
          <div name="cast"> 
              <p name="character"></p>
           </div>
      </section>      

      <p name="city"></p>
      <div name="rating"></div> 
      <input name="rating">
</div>
```

```js
friends = { 
    cast: [ {character: 'Rachel'}, {character: 'Monica'} ], 
    city: "NY",
    rating: 8
};

jab.bindObj(friends, '#friendsElem');

friends.cast = [{character: "Chandler"}, { character: "Joey"}]; //replace or modify members arbitrarily
friends.city = "New York";
friends.rating = 9.9;
```

#### Installation and usage

1. Download and include on your page: 

```html
<script src="jab.js"></script>
```

That's it, you can now bind your objects to your DOM.using `jab.bind`, `jab.bindVar`, `jab.bindArr`, `jab.bindObj`. 

#### Demos and specs Page
You are also encourage to download this repo and open [demos/specs.html](/demo/specs.html), which includes a working example of every piece of functionality.

You may also download and observe [demos/todomvc/app.js], a working example of a Todo app, per the TodoMVC standard demonstration of JS libs.

Concretely, to view a JabJS app in action:

1. $ git clone git@github.com:SellaRafaeli/jabjs.git
2. cd demos/todomvc
3. python -m SimpleHTTPServer 8000 # assuming you have python
4. # browse to localhost:8000


#### Bind To Element
Suppose you have an HTML element `<div id="div"></div>` and a POJS (plain old JavaScript object) 

```js
user = {name: 'John Lennon'}
```

After including JabJS, to bind the object to the element you would run:

```js
jab.bind(user, 'name', document.getElementById('div'));
```

After this, user.name would be *binded* to the `#div` element: that is, changing user.name would implicitly change the contents of #div. Try this for yourself in the JS console in the demo page. 

#### Two-Way Binding
For `div`s, binding is a one-way process: changes in the object update the HTML. However, for some elements we want a two-way binding: changes in the model should update the view (HTML), and changes in the view (HTML) should update the model. That way, for example, if we use an `<input id='input'>` element, we could access its value in the JS (without having to manually extract it every time we needed it). Form submissions can work immediately on the JS, without parsing the DOM upon submission. 

JabJS immediately performs two-way data-bindings on appropriate HTML elements, so suppose you have an HTML element `<input id="input">` and a JavaScript object `user = {name: 'John Lennon'}`. After including JabJS, to bind the object to the input you would run the same idiomatic JabJS binding:

```js
jab.bind(user, 'name', document.getElementById('input'));
```

Now user.name's value is binded to #input's value. Changes in one update the other. Try this for yourself in the JS console in the demo page. 

#### Three-Way Binding (Multiple Elements)
JabJS supports binding to multiple elements, enabling three-way (actually, *n*-way) changes between the model and each of the binded models. This is achieved using the idiomatic syntax, supplying an array of elements rather than a singular element.

```js
jab.bind(user, 'name', [document.getElementById('input'), document.getElementById('textarea'), document.getElementById('div')]);
```

Now #input, #textarea, #div and user.name are all bounded to each other. 

#### Select, Checkbox
Usage is as follows (assuming a `select` and `checkbox` elements with those Ids):

```js
user = {selectIndex=0; checked=false};
jab.bind(user, 'selectIndex', document.getElementById('select'));
jab.bind(user, 'checked', document.getElementById('checkbox'));
```

#### Special Bindings
By default, JabJS binds by value. In our examples, `user.name`'s value is input as the element's appropriate value. These are binded by using the following syntax (note the new fourth parameter):

```js
jab.bind(model, 'property', domElem, {opts: bindingName})
```

or

```js
jab.bind(model, 'property', domElem, 'bindingName')
```

JabJS ships by default with a few special bindings:

One special binding is the `show` binding:
```js
jab.bind(user, 'name', document.getElementById('input'), 'show')
```

which 'shows' the element (makes it visible) if and only if user.name is a truthy value.

Another default special binding is the `disable` binding, which add a 'disabled' attribute to the binded elements if and only if the binded value is falsy.

```js
user.inputDisabled = true;
jab.bind(user, 'inputDisabled', document.getElementById('input'), 'disable');
```

#### Custom Bindings
Adding your own binding is as easy as pie, using the following pattern:

```js
myFunc = function(elem, value) {
  //do something with element and value
};
jab.bind(user, 'name', document.getElementById('input'), {func: myFunc});
```

The above binds `user.name` to #input, by running ``myFunc`` on the binded element (#input) and applying `myFunc` on the element, using the value in `user.name`. 

Let's observe a concrete example:

```js
setBorderWidth = function(elem, value) {
  elem.style.borderWidth = value+'px';
};
borderData = {width: 20};
jab.bind(borderData, 'width', document.getElementById('input'), {func: setBorderWidth});
```

Now, whenever ```borderData.width``` is set, ```setBorderWidth``` will be execute on the binded element (and will set its width).

#### Binding sub-elements
If your model is 

```js
user = {details: {name: 'Abraham', age: 900}};
```
You can jab.bind it by using the idiomatic syntax on whatever sub-object you wish to bind:
```js
jab.bind(user.details, 'name', document.getElementById('input'));
```

#### After-Hooks (reacting to changes in binded elements)
Sometimes binding your elements to the view is not enough - you want to perform some additional actions whenever they change. This is often referred to as [reactive programming](http://en.wikipedia.org/wiki/Reactive_programming). For example, consider two input elements binded each to its model, and a third element reflecting some computation on the values of the first two. (Say, an input for speed and an input for time, and a third <p> element to display distance covered.)

After-hooks are used by JabJS by supplying an `afterHook` callback function to the `opts` parameter. This callback function is called whenever the element is updated. The function is given the element's new value, but that's often not needed. For example:

```js
car = {speed: "10", time: "3"};
computeDistance = function(){ car.distance = car.speed * car.time; };
jab.bind(car, 'speed', document.getElementById('input'), {afterHook: computeDistance} ); //#input.value == 10
jab.bind(car, 'time', document.getElementById('textarea'), {afterHook: computeDistance}); //#textarea.value == 3
jab.bind(car, 'distance', document.getElementById('p')); //#p.innerHTML == 30
//now, changing the speed or time via the input elements or JS models will also update #p and distance.
car.speed = 20 //#input.value == 20, textarea.value == 3, #p.value == 60
```

#### Binding between JavaScript variables - Pure Reactive JavaScript

JabJS also enables you to performing binding on pure JavaScript objects, with no DOM elements. This can be used to hold computed variables of a user (composed of other variables). Along with DOM bindings, this can be utilized to bind computed, reactive properties to the DOM itself. 

Binding pure JS vars is done with the following syntax: `jab.bindVar(model, property/ies, callback)`. For example:

```js
man = {firstName: 'Bill', lastName: 'Clinton', fullName: ''};
jab.bindVar(man, ['firstName', 'lastName'], function() { man.fullName = man.firstName + " " +man.lastName } ); //whenever firstName or lastName change, fullName will also change...
jab.bind(man, 'fullName', div); //...and so will its binded view. 
```

#### Bind entire object to DOM element: jab.bindObj

A common use-case is binding an entire variable to a DOM element, like so:

```html
<div id="data">
    <div name="number"></div>
    <span name="word"></span>
    <div>
        <p name="color"></p>
        <p name="shape"></p>
    </div>
    <input name="country">
</div>
```

```js            
data = {number: 10, word: 'hello', color: 'blue', shape: 'circle', country: 'USA'};
jab.bindObj(data, "#data");                 
```
     
As you can see, the object is binded recursively - any subelement with with a `name` of `foo` is binded to the property `foo` in the binded object. 

#### Bind object to DOM, using custom attributes

Instead of using `name` as the attribute marking the key to bind to, you can supply a custom attribute name as a 3rd parameter to 'bindObj'. 

```html
<div id="data">
    <div k="number"></div>
    <span k="word"></span>
    <div>
        <p k="color"></p>
        <p k="shape"></p>
    </div>
    <input k="country">
</div>
```

```js            
data = {number: 10, word: 'hello', color: 'blue', shape: 'circle', country: 'USA'};
jab.bindObj(data, "#data", "k");                 
```

A standard convention is to use attributes that start with "data-" (such as "data-key"), for future-proofing, although in practice you can use any key. 

#### Bind array of objects to repeat element (within container): jab.bindArr

Using `jab.bindArr` You can use JabJS to bind array, 'repeating' an element for every member in your array. 
            
```html
<ul>
    <li class=".country" name="countryName"></li>                
</ul>
```

```js
countries = [ {countryName: "USA"}, {countryName: "Canada"}, {countryName: "France"} ];
jab.bindArr(countries, ".country");
```

The binded element (in the above example, the `li` with `'.country'`) will be repeated for every member in the array. (Creating 3 `li`s in the above example). Each member will be binded by the property value of the attribute `name` - in the above example, `countryName`. Here, too, you can use a custom attribute name supplied as a 3rd parameter: 

```html
<ul>
    <li class=".country" k="name"></li>                
</ul>
```

```js
countries = [ {countryName: "USA"}, {countryName: "Canada"}, {countryName: "France"} ];
jab.bindArr(countries, ".country", "k");
```

Take note you select **the element you wish to repeat**, and that that element must have a container, as the repeated members will form the entire contents of the container. 

Note each object is binded like an object, so you can create arbitrarily nested templates with your repeaters: 

```html
<ul>
    <li class=".country">
        <p k="name"></p>
        <div>
            <span k="population"></span>
            <span k="continent"></span>
        </div>
    </li>                
</ul>
```

```js
countries = [ {name: "USA", population: "316 million", continent: "North America"},
                   {countryName: "Canada", population: "31 million", continent: "North America"}, 
                   {countryName: "France", poplation: "66 million", continent: "North America"} ];
jab.bindArr(countries, ".country", "k");
```

Binded arrays support natve modification of existing members and all native array functions (pop, push, reverse, shift, unshift, splice, sort, filter). Basically just modify your array however you want and Jab will update the view. 

An exception to this is access by random index (). On binded elements this should be done by calling `arr.set(index, newItem)` rather than using `arr[index] = newItem`. If you do use the second method, you need to run `arr.updateBindings()` on the array to refresh the view. 

#### Bind array as a nested field of object, including replacing entire array

```html
<ul>
    <li id="repeatMe" name="c"></li>                
</ul>
```                    

```js
obj = {};
obj.arr = [ {c: 10}, {c: 20}, {c: 30} ];

jab.bind(pink, "arr", "#repeatMe");
obj.arr = [ {c: "new-array, value 1"}, {c: "new-array, value 2"} ]; //assign new arr, view syncs automatically
```

####Bind object, including array as nested field

Combining the above, you can bind an object which includes arrays (which include objects) to an arbitrarily nested view, giving you powerful, arbitrary bindings between your native JS model and the DOM:

```html
<div id="friendsElem">    
      <section>
          <div name="cast"> 
              <p name="character"></p>
           </div>
      </section>      

      <p name="city"></p>
      <div name="rating"></div> 
      <input name="rating">
</div>
```

```js
friends = { 
    cast: [ {character: 'Rachel'}, {character: 'Monica'} ], 
    city: "NY",
    rating: 8
};

jab.bindObj(friends, '#friendsElem');

friends.cast = [{character: "Chandler"}, { character: "Joey"}]; //replace or modify members arbitrarily
friends.city = "New York";
friends.rating = 9.9;
```

#### Bind DOM events declaratively 

Jab allows you to specify to callbacks for DOM events on elements binded to an object as follows:

```html
<div jab-eventName="myFunc">
```

In the above example, assuming the `<div>` has been binded to an object `obj`, then when the event `eventName` is triggered on the `div`, the callback `myFunc` will be executed on `obj` (`obj.myFunc()` will be executed). In other words, the above binding will be the equivalent of:

```html
<div oneventName='obj.myFunc()'>
```

Let's observe a concrete example:

```html
<div id="friendsElem">
    <div name="cast"> 
        <p name="character" jab-click='sayName'></p>
    </div>

    <div name="city" jab-mouseover='alertCity'></div>
</div>
```

```js                        
<script class="script">
      friends = { 
          cast: [ {character: 'Rachel', sayName: function() { alert("Rachel!"); }},
                  {character: 'Monica', sayName: function() { alert("I am Monica") }}
                ], 
          city: "New York",
          alertCity: function() { alert("City is "+this.city); }
      };

      jab.bindObj(friends, '#friendsElem');      
</script> 
```

After running the above, clicking on a character will trigger alerting their name, and moving the mouse over the city will trigger 'alertCity'. 


#### Technical Points
* Stand-alone & dependency-free, simply include and run.
* Small: ~1.5K compressed and gzipped. 
* Pure JS, creates bindings without changing HTML markup: Keep your logic out of your markup!
* Supports custom bindings - run any callback on binded element whenever a variable changes. 
* Orthogonal to other JS libraries - use it anywhere, with any other library or templating, without depending or modifying anything else. 

#### Etymology
A **jab** is a [type of punch](http://en.wikipedia.org/wiki/Jab) used in the martial arts.

#### Contact
* Source code is on [GitHub](https://github.com/SellaRafaeli/jabjs/).
* Demo page which works with all the examples in this tutorial is [here](http://www.sellarafaeli.com/jabjs-demo/index.html).
* For any questions, help or pull requests please contact sella.rafaeli@gmail.com directly. 
* License is the standard MIT license. 
JabJS - Introduction
====================

**JabJS** allows you to bind any JavaScript model to any DOM element using the following idiomatic format:

***jab.bind(model, property, domElement[s])***

Example:
```js
user = {name: 'John Lennon'}; //any JavaScript object
jab.bind(user, 'name', document.getElementByid('input')); //user is now two-way binding with #input
```

The idiomatic syntax is:
jab.bind(model, propertyp
#### Demo Page
This tutorial is accompanied by [the JabJS demo page](https://rawgit.com/SellaRafaeli/jabjs/master/index.html), which includes some HTML and the JabJS library. Every example given in this document can (and should) be executed on that page via the JavaScript console, to demonstrate JabJS usage.  

#### Bind To Element
Suppose you have an HTML element `<div id="div"></div>` and a POJS (plain old JavaScript object) `user = {name: 'John Lennon'}`. After including JabJS, to bind the object to the element you would run:
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


#### Technical Points
* JabJS is stand-alone & dependency-free, simply include and run. ~1.5K compressed. 
* Pure JS, creates bindings without changing HTML markup.

```js
jab.bind(model, propertyNameAsString, domElement[s]ToBindTo, [optsHash])
```



Idiomatic usage example: 


#### Binding To Multiple Elements

#### Custom Bindings


#### Etymology


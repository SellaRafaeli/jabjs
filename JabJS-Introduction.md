JabJS - Introduction
====================

**JabJS** allows you to bind any JavaScript model to any DOM element. 

Example:
```js
user = {name: 'John Lennon'}; //any JavaScript object
jab.bind(user, 'name', document.getElementByid('input')); //user is now two-way binding with #input
```

#### Demo Page
This tutorial is accompanied by [the JabJS demo page](https://rawgit.com/SellaRafaeli/jabjs/master/index.html), which includes some HTML and the JabJS library. Every example given in this document can (and should) be executed on that page via the JavaScript console, to demonstrate JabJS usage.  

#### Bind To Element
Suppose you have an HTML element `<div id="div"></div>` and a POJS (plain old JavaScript object) `user = {name: 'John Lennon'}`. After including JabJS, to bind the object to the element you would run:
```js
jab.bind(user, 'name', document.getElementById('div'))
```
After this, user.name would be *binded* to the `#div` element: that is, changing user.name would implicitly change the contents of #div. Try this for yourself on the JS console in the demo page. 

#### Technical Points
* JabJS is stand-alone & dependency-free, simply include and run. ~1.5K compressed. 
* Pure JS, creates bindings without changing HTML markup.

#### Idiomatic Usage
Jab's idiomatic usage is of the following form:

```js
jab.bind(model, propertyNameAsString, domElement[s]ToBindTo, [optsHash])
```



Idiomatic usage example: 


#### Binding To Multiple Elements

#### Custom Bindings


#### Etymology


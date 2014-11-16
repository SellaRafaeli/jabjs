JabJS
=====

JabJS is an super-lightweight tool to enable on-the-fly two-way data-binding of a model's property with a DOM element. 

Usage is:

```javascript
jab(model, propertyNameString, DOMelement). 
```

as in:

```javascript
user = {name: 'Joe'}
jab(user, 'name', document.getElementById('input')) //user.name is now bound with #input
``` 

JabJS currently supports elements of the following types:
* Input, TextArea, Select, Checkbox
* Any 'text' element (with innerHTML) - div, p, span, etc. 

Current version is 0.0.1. For further details contact sella.rafaeli@gmail.com. 
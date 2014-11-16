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
jab(user, 'name', document.getElementById('input'))
``` 

Current version is 0.0.1. For further details contact sella.rafaeli@gmail.com. 
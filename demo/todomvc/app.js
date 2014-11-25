(function( window ) {
	
    app = {

        addTodo: function(val) { 
            app.todos.push({name: val, 
                completed: false,

                calc: function() {
                    app.count(); //just counters; model is synced with view. 
                },

                destroy: function() { 
                    var name = this.name;
                    app.todos = app.todos.filter(function(todo) { 
                        return !(todo.name == name);
                    });
                    app.count()
                },

                stopEditingMode: function(elem) {
                    elem.parentElement.classList.remove("editing"); 
                }
            }); 

            app.count();
        },

        removeCompleted: function() {
            app.todos = app.todos.filter(function(todo) { return !todo.completed} );
            app.count();
        },

        markAll: function(val) {
        app.lastMarked = !app.lastMarked; //flip each time.
        app.todos.forEach(function(todo) { todo.completed = app.lastMarked });
        app.count();
    },

        count: function() {
            app.numActive                        = app.todos.filter(function(todo) { return !todo.completed }).length;
            app.numCompleted                 = app.todos.filter(function(todo) { return todo.completed }).length;
            
            app.shouldShowClearButton      = (app.numCompleted > 0);      
            app.shouldShowFooter             = ((app.numActive > 0) || (app.numCompleted > 0));
        },

        todos: []        
    };

    app.count(); //init
    
    jab.bindObj(app, "#todoapp");  //recursively bind each value with DOM with matching 'name' attr

    jab.bind(app, 'addTodo', "#new-todo", 'enter'); //use special 'enter' binding to trigger CB                             
    jab.bind(app, 'shouldShowClearButton', "#clear-completed", 'show'); //use special 'show' binding to bind truthiness to display
    jab.bind(app, 'shouldShowFooter', "footer", 'show');
    
})( window );
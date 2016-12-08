/*
UTILS.JS
This file contains all helper functions used by grid,
for more functional programming
*/

var Utils = function(){
    //maps neighbor cells to true/false for true/dead
    var that = Object.create(Utils.prototype);
    /*
    @param int: from,to
    @param f: function that will be given the current from
    Glorified for loop
    Basically recursively calls itself from from, to (and including) to,
    At each level it calls the function f with the current from value,
    (the from value is increased at every recursive call until )
    */
    that.from_to = function (from, to, f) {
       if (from > to) return;
       f(from); 
       that.from_to(from+1, to, f);
    }
    Object.freeze(that);
    return that;
}
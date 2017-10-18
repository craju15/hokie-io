Please do these problems in the text editor of your choosing.

1. Write a function `formatDate(date)` that takes in a single argument, a
`Date()` object, and returns a string with a formatted date. If the date
represents some time yesterday, it should be formatted with
"Yesterday at [time]", and if the date represents some time earlier today,
write "Today at [time]". Be creative with this! Tip: Here is the documentation
for the Date() object:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

2. Write a function `square(array)` that takes in a single argument, an
array containing integers, and returns an array of the same size with
each number squared. You should use the the JavaScript `array.forEach()`
method.

3. Use the function you wrote in #2.

4. Use the following function to multiply a and b. Note: If you are
confused by what's going on, go through some of the exercises on the
Function chapter. Hint: the `multiply()` function returns an
"anonymous" function. What is an anonymous function?
```
function multiply(a, b) {
  return function (a, b) {
    return a * b;
  };
}

a = 4;
b = 3;
c = ???;
```

5. Write a function `squareWithCallback(array, callback)` that takes in
exactly two arguments, an array and a callback function, but doesn't
return anything. Instead, it should call the `callback(array)` function
with the squared array.

6. Use the function you wrote in #4.

7. What is output to the console once the following code is run?
```
function addEight(a) {
  var foo = 8;
  return a + foo;
}
console.log(foo);
```

8. Write a function `getNames(httpResponse)` that takes in the following
object as a parameter and returns the names of every person as an array.
Note: This object is an example, your code should work for all objects
structured the same way. For this example, your function should return
`['Jacob Merizian', 'Aman Tihalun', 'Chai Raju']`. Bonus points: use the
`array.forEach()` method in your function!
```
var httpResponse = {
  people: [
    {
      id: 1,
      name: 'Jacob Merizian'
    },
    {
      id: 2,
      name: 'Aman Tilahun'
    },
    {
      id: 3,
      name: 'Chai Raju'
    }
  ]
}

function getNames(httpResponse) {
  ???
}
```

9. Will both of these code samples run properly? In what way do they differ?
```
function add(a, b) {
  if (a & b) {
    return a + b;
  }
}
```
```
function add(a,b){if(a & b){return a+b;}}
```

10. Why does this not throw an error? Why would it throw an error in most
other languages? Hint: Look up what values in JavaScript "evaluate" to
booleans.
```
var aNullVariable = null;
if (aNullVariable) {
  console.log("this message never shows")
}
```

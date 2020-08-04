let parser = require('./box-parser.js')
let {Layout} = require('./Layout.js')


class ParseError extends Error {
  constructor(){
    super(...arguments);
  }
}

class LayoutError extends Error {
  constructor(){
    super(...arguments);
  }
}

/*
  The BoxDrawer class 

  The box drawer recursively creates new Layouts before calling the final 
  result's draw method. 
*/
class BoxDrawer {
  constructor(size={x: 3, y: 3}, padding={x: 1, y:0}, symbols={corner: '+', x: "-", y: '|', empty: ' '}){
    this.padding = padding;
    this.size = size;
    this.symbols = symbols;
  }

  /*
    [rows] layout(ast)

    The layout function takes an AST and returns a list of rows for that ast.

    This function depends on a clean AST, that is:
    * No empty inner property
    * No direction property for a single eleemnt
  */
  layout(ast){
    console.assert(ast.type === 'box');
    if(typeof ast == 'object'){
      if(!ast.inner){
        // The base case, a box without anything in it
        return new Layout()
      }else{
        if(!ast.direction && ast.inner.length == 1){
          // there is exactly one inner
          return Layout.wrap(this.layout(ast.inner[0]))
        }else{
          // there are multiple children
          let inner;
          switch(ast.direction){
            case 'horizontal':
              inner = this.layout(ast.inner[0])
              
              ast.inner.slice(1).forEach(branch => {
                inner.addHorizontally(this.layout(branch))
              });

              return Layout.wrap(inner)
            case 'vertical':
              inner = this.layout(ast.inner[0])

              ast.inner.slice(1).forEach(branch => {
                inner.addVertically(this.layout(branch))
              })

              return Layout.wrap(inner);
          }
        }
      }
    }

    return [];
  }

  /*
    IO draw([rows])

    This is the meat of the class. 
  */
  draw(expression){
    let ast, layout;

    try{
      ast = parser.parse(expression);
      if(!this.silent) console.log('Parsing successful...');
    }catch(e){
      throw new ParseError(e.message);
    }

    try{
      layout = this.layout(ast);
      layout.draw();
    }catch(e){
      throw new LayoutError(e.message);
    }
  }
}

var exports = module.exports = {
  BoxDrawer
}
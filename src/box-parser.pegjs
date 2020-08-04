{
  function repeat(what, n){
    var arr = [];
    for(var i=0; i<n; i++){
      arr.push(Object.assign({}, what));
    }
    return arr;
  }

  function simpleBox(){
    return {type: 'box'};
  }

  function flatten(arr) {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []);
  }
}

start
  = ws* 
    box:(nestedBox/box)
    ws*
    {
      return box;
    }

box
  = start:"["
    ws*
    direction:direction?
    ws*
    inners:inner*
    ws*
    end:"]"
    ws*
    {
      let boxAst = {type: 'box'};

      if(inners && inners.length){
        boxAst.inner = flatten(inners);
      }

      if(direction && boxAst.inner){
        if(direction == '-'){
          boxAst.direction = 'horizontal';
        }
        if(direction == '|'){
          boxAst.direction = 'vertical';
        }
      }

      return boxAst; 
    }

direction
  = "|" / "-"

nestedBox
  = "[" ws*
    "^" ws*
    operand:number ws*
    "]" ws*
    {
      if(operand > 0){
        let outerBox = simpleBox();
        let box = outerBox;
        operand--;

        while(operand > 0){
          box.inner = [simpleBox()];
          box = box.inner[0]
          operand--;
        }

        return outerBox;
      }
    }

inner
  = ws* spec:(num:numberSpec / box:box / nestedBox:nestedBox)
    {
      return typeof spec == 'array' ? spec : [spec];
    }

numberSpec "number of boxes"
  = num:number ws* spec:inner
    {
      return Array(num).fill(spec)
    }

number "number"
  = integer:[0-9]+
    {
      if(integer !== undefined){
        return parseInt(integer.join(''), 10);
      }else{
        return 0
      }
    }

comment "comment"
  = "/*" [^*]* "*"+ ([^/*] [^*]* "*"+)* "/"
  / "//" [^\n\r]* EOL

  
ws "whitespace"
  = [ \t\n\r]
  / comment

EOL 
  = [\n\r]{1,2} / !.
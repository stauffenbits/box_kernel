/*
  Layout

  This class encapsulates a (nested) box's layout, and is the precursor to
  drawing said box, including its children, on stdout.

  The Layout inherits from Array, listing the rows of a graphic. 

  It is used by the BoxDrawer. 
*/
class Layout extends Array {
  constructor(){
    if(arguments && arguments.length){
      super(...arguments);
      this._defaults();
    }else{
      super();
      this._defaults();

      this.push(
        this.top(),
        this.middle(),
        this.bottom()
      )
    }

    return this;
  }

  /*
    When the layout is complete, call draw to retrieve a list of strings to display. 
  */
  draw(){
    this.map(row => console.log(row.join('')))
  }

  /*

    int get width()

    Be careful with this function when using it to determine the width of a
    Layout, since this function only returns the width of the first row. 
  */
  get width(){
    return this[0].length;
  }

  /*
    THei number of columns in the layout. 
  */
  get height(){
    return this.length;
  }

  /*
    A number of defaults are set here. On the one hand, I didn't want to litter
    the constructor with additional parameters, on the other hand, I wanted
    a place for the settings to be set.
  */
  _defaults(){
    this.silent = false;
    this._size = {x: 3, y: 3};
    this._padding = {x: 1, y:0};
    this._symbols = {corner: '+', x: "-", y: '|', empty: ' '};
  }

  /* Various setters */

  get size(){
    return this._size;
  }

  set size(size){
    Object.assign(this._size, size);
  }

  get padding(){
    return this._padding;
  }

  set padding(padding){
    if(padding.y && padding.y !== 0){
      throw "Vertical padding is not currently supported."
    }
    Object.assign(this._padding, padding)
  }

  get symbols(){
    return this._symbols;
  }

  set symbols(symbols){
    Object.assign(this._symbols, symbols);
  }

  /*
    This function is responsible for wrwapping a layout in a new box, using the
    supplied layout's seetings.
  */
  static wrap(layout){
    // inner width + (padding + lineWidth) * 2
    let newWidth = layout[0].length + (layout.padding.x + 1) * 2;

    return new Layout(
      layout.top(newWidth),
      ...layout.map(row => {
        return [layout.symbols.y, layout.pad(), ...row, layout.pad(), layout.symbols.y];
      }),
      layout.bottom(newWidth)
    )
  }

  /*
    Apply the stored padding settings. 
  */
  pad(){
    return this.repeat(this.symbols.empty, this.padding.x);
  }

  /*
    This helper function returns a top row for a box. 
  */
  top(width=this.size.x){
    return [this.symbols.corner, ...this.repeat(this.symbols.x, width - 2), this.symbols.corner];
  }

  /*
    This helper function returns a 
  */
  middle(){
    return [this.symbols.y, this.symbols.empty, this.symbols.y];
  }

  /*
    [+-...-+] bottom(width)

    Returns a bottom line for a box
  */
  bottom(width=3){
    return this.top(width);
  }

  /*
    repeat()

    A helper function for constructing an array of repeating elements
  */
  repeat(what, n){
    var arr = [];
    for(var i=0; i<n; i++){
      arr.push(what);
    }
    return arr;
  }

  /*
    addHorizontally(layout)

    Adds a second layout to this layout by appending the second layout to this layout's 
    right side, padding both as appropriate.

    This layout is modified and returned.
  */
  addHorizontally(layout){
    let oldWidth = this.width;
    let empty = this.symbols.empty

    // append the other layout's rows to this layout, leaving one padding space in between
    layout.forEach((otherRow, rowIdx) => {
      if(rowIdx < this.length){
        this[rowIdx].push(...this.pad(), ...otherRow);
      }else{
        this.push([...this.repeat(empty, oldWidth), ...this.pad(), ...otherRow])
      }
    });
    
    // add padding to the excess rows
    this.slice(layout.length).forEach(excessRow => {
      excessRow.push(...this.repeat(empty, this.width - oldWidth))
    })

    return this;
  }

  /*
    addVertically

    Adds a second layout to this layout, by appending it to its bottom, padding
    both as appropriate. 

    This layout is modified and returned. 
  */
  addVertically(layout){
    let width = this.width;
    let empty = this.symbols.empty;


    let maxWidth = Math.max(this.width, layout.width)
    
    // pad the rows to match width
    if(maxWidth > this.width){
      this.forEach(ownRow => {
        ownRow.push(...this.repeat(empty, maxWidth - ownRow.length))
      })
    }else if(maxWidth > layout.width){
      layout.forEach((otherRow) => {
        otherRow.push(...this.repeat(empty, maxWidth - otherRow.length))
      })
    }

    this.push(...layout)

    return this;
  }
}

var exports = module.exports = {
  Layout
}
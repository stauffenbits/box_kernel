let parser = require('../src/box-parser.js')
let fs = require('fs');
let assert = require('assert');

let read = file => fs.readFileSync(file, {encoding: 'utf-8'})

describe('Parser', function(){
  describe('Simple Box', function(){ 
    describe('1 box ', function() {
      let expected = {type: 'box'}
    
      it('[] should return {type: "box"}', function() {
        let boxFile = read('./examples/1.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })

      it("[-] should return a single box", function(){
        let boxFile = read('./examples/1-horizontal.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })

      it("[|] should return a single box", function(){
        let boxFile = read('./examples/1-vertical.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })

      it('should ignore whitespace', function(){
        let boxFile = read('./examples/1-space.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })
    })
  })

  describe('stacked boxes', function(){
    describe('3 boxes horizontal', function(){
      let expected = {type: 'box', direction: 'horizontal', inner: [{type: 'box'}, {type: 'box'}]};

      it('[-[][]] should return 2 boxes nested into one, with direction specified', function(){
        let boxFile = read('./examples/3-horizontal-literal.box')
        let parsed = parser.parse(boxFile)
    
        assert.deepEqual(parsed, expected);
      })

      it('[-2] should return 2 boxes nested into one, with direction specified', function(){
        let boxFile = read('./examples/3-horizontal-number.box')
        let parsed = parser.parse(boxFile)
        assert.deepEqual(parsed, expected);
      })

      it('should ignore comments and whitespace', function(){
        let boxFile = read('./examples/3-space.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })
    })
  })

  describe('nested boxes', function(){

    function countLevels(boxAst){
      let counter = 0;

      while(boxAst){
        counter++;
        if(boxAst.inner){
          boxAst = boxAst.inner[0]
        }else{
          boxAst = null;
        }
      }

      return counter;
    }

    describe('3 boxes nested into each other', function(){
      let expected = {type: 'box', inner: [{type: 'box', inner: [{type: 'box'}]}]};

      it('should nest all three boxes', function(){
        let boxFile = read('./examples/nested.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })
    })

    describe('[^1] == []', function(){
      let expected = {type: 'box'};

      it('should produce a single box for an operand of 1', function(){
        let boxFile = read('./examples/1-up.box')
        let parsed = parser.parse(boxFile)

        assert.deepEqual(parsed, expected)
      })
    })
  })
})
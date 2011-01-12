//
//  arbor.js
//  a graph vizualization toolkit
//
{{LICENSE}}

(function($){

  {{DEPS}}

  arbor = (typeof(arbor)!=='undefined') ? arbor : {}
  $.extend(arbor, {
    // object constructors (don't use ‘new’, just call them)
    ParticleSystem:ParticleSystem,
    Node:function(id, data){ return new Node(id, data) },
    Edge:function(id, source, target, data, length){ return new Edge(id, source, target, data, length) },
    Point:function(x, y){ return new Point(x, y) },

    Tween:Tween,
    Graphics:function(canvas){ return Graphics(canvas) },

    // immutable objects with useful methods
    colors:{
      CSS:Colors.CSS,           // {colorname:#fef2e2,...}
      validate:Colors.validate, // ƒ(str) -> t/f
      decode:Colors.decode,     // ƒ(hexString_or_cssColor) -> {r,g,b,a}
      encode:Colors.encode,     // ƒ({r,g,b,a}) -> hexOrRgbaString
      blend:Colors.blend        // ƒ(color, opacity) -> rgbaString
    },
    etc:{      
      trace:trace,              // ƒ(msg) -> safe console logging
      dirname:dirname,          // ƒ(path) -> leading part of path
      basename:basename,        // ƒ(path) -> trailing part of path
      ordinalize:ordinalize,    // ƒ(num) -> abbrev integers (and add commas)
      objcopy:objcopy,          // ƒ(old) -> clone an object
      objcmp:objcmp,            // ƒ(a, b, strict_ordering) -> t/f comparison
      objkeys:objkeys,          // ƒ(obj) -> array of all keys in obj
      uniq:uniq,                // ƒ(arr) -> array of unique items in arr
      arbor_path:arbor_path,    // ƒ() -> guess the directory of the lib code
    },
    _:{Physics:Physics, Tween:Tween} // ici il y avoir des dragons...
  })
  
})(this.jQuery)
//
//  arbor-tween.js
//  smooth transitions with a realtime clock
//
{{LICENSE}}

//  Easing Equations in easing.js:
//  Copyright © 2001 Robert Penner. All rights reserved.
//  
//  Open source under the BSD License. Redistribution and use in source
//  and binary forms, with or without modification, are permitted
//  provided that the following conditions are met:
//  
//  Redistributions of source code must retain the above copyright
//  notice, this list of conditions and the following disclaimer.
//  Redistributions in binary form must reproduce the above copyright
//  notice, this list of conditions and the following disclaimer in the
//  documentation and/or other materials provided with the distribution.
//  
//  Neither the name of the author nor the names of contributors may be
//  used to endorse or promote products derived from this software
//  without specific prior written permission.
//  
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
//  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
//  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
//  A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
//  OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
//  THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
//  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
//  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 


(function($){

  {{DEPS}}

  arbor = (typeof(arbor)!=='undefined') ? arbor : {}
  $.extend(arbor, {
    // not really user-serviceable; use the ParticleSystem’s .tween* methods instead
    Tween:Tween,
    
    // immutable object with useful methods
    colors:{
      CSS:Colors.CSS,           // dictionary: {colorname:#fef2e2,...}
      validate:Colors.validate, // ƒ(str) -> t/f
      decode:Colors.decode,     // ƒ(hexString_or_cssColor) -> {r,g,b,a}
      encode:Colors.encode,     // ƒ({r,g,b,a}) -> hexOrRgbaString
      blend:Colors.blend        // ƒ(color, opacity) -> rgbaString
    }
  })
  
})(this.jQuery)




 

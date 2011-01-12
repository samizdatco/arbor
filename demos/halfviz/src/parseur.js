(function(){
  
  //
  // quick, incomplete (and surely buggy) ‘parser’ for reading in the halftone source 
  //
  Parseur = function(){
    var strip = function(s){ return s.replace(/^[\s\t]+|[\s\t]+$/g,'') }    
    var recognize = function(s){
      // return the first {.*} mapping in the string (or "" if none)
      var from = -1,
          to = -1,
          depth = 0;
      $.each(s, function(i, c){
        switch (c){
          case '{':
            if (depth==0 && from==-1) from = i
            depth++
            break
          case '}':
            depth--
            if (depth==0 && to==-1) to = i+1
            break
        }
      })
      return s.substring(from, to)
    }
    var unpack = function(os){
      // process {key1:val1, key2:val2, ...} in a recognized mapping str
      if (!os) return {}

      var pairs = os.substring(1,os.length-1).split(/\s*,\s*/)
      var kv_data = {}

      $.each(pairs, function(i, pair){
        var kv = pair.split(':')
        if (kv[0]===undefined || kv[1]===undefined) return
        var key = strip(kv[0])
        var val = strip(kv.slice(1).join(":")) // put back any colons that are part of the value
        if (!isNaN(val)) val = parseFloat(val)
        if (val=='true'||val=='false') val = (val=='true')
        kv_data[key] = val
      })
      return kv_data
    }


    var lechs = function(s){
      var tokens = []

      var buf = '',
          inObj = false,
          objBeg = -1,
          objEnd = -1;

      var flush = function(){
        var bufstr = strip(buf)
        if (bufstr.length>0) tokens.push({type:"ident", ident:bufstr})
        buf = ""
      }

      s = s.replace(/([ \t]*)?;.*$/,'') // screen out comments

      for (var i=0, j=s.length;;){
        var c = s[i]
        if (c===undefined) break
        if (c=='-'){
          if (s[i+1]=='>' || s[i+1]=='-'){
            flush()
            var edge = s.substr(i,2)
            tokens.push({type:"arrow",directed:(edge=='->')})
            i+=2
          }else{
            buf += c
            i++
          }
        }else if (c=='{'){
          var objStr = recognize(s.substr(i))
          if (objStr.length==0){
            buf += c
            i++
          }else{
            var style = unpack(objStr)
            if (!$.isEmptyObject(style)){
              flush()
              tokens.push({type:"style", style:style})
            }
            i+= objStr.length
          }
        }else{
          buf += c
          i++
        }
        if (i>=j){
          flush()
          break
        }
      }

      return tokens
    }
    
    var yack = function(statements){
      var nodes = {}
      var edges = {}
      
      var nodestyle = {}
      var edgestyle = {}
      $.each(statements, function(i, st){
        var types = $.map(st, function(token){
          return token.type
        }).join('-')
        
        // trace(st)
        if (types.match(/ident-arrow-ident(-style)?/)){
          // it's an edge
          var edge = { src:st[0].ident, dst:st[2].ident, style:(st[3]&&st[3].style||{}) }
          edge.style.directed = st[1].directed
          if (nodes[edge.src]===undefined) nodes[edge.src] = ($.isEmptyObject(nodestyle)) ? -2600 : objcopy(nodestyle)
          if (nodes[edge.dst]===undefined) nodes[edge.dst] = ($.isEmptyObject(nodestyle)) ? -2600 : objcopy(nodestyle)
          edges[edge.src] = edges[edge.src] || {}
          edges[edge.src][edge.dst] = objmerge(edgestyle, edge.style)
        }else if (types.match(/ident-arrow|ident(-style)?/)){
          // it's a node declaration (or an edge typo but we can still salvage a node name)
          var node = st[0].ident
          if (st[1]&&st[1].style){
            nodes[node] = objmerge(nodestyle, st[1].style)
          }else{
            nodes[node] = ($.isEmptyObject(nodestyle)) ? -2600 : objcopy(nodestyle) // use defaults
          }
          
        }else if (types=='style'){
          // it's a global style declaration for nodes
          nodestyle = objmerge(nodestyle, st[0].style)
        }else if (types=='arrow-style'){
          // it's a global style declaration for edges
          edgestyle = objmerge(edgestyle, st[1].style)
        }
      })
      
      // find any nodes that were brought in via an edge then never styled explicitly.
      // they get whatever the final nodestyle was built up to be
      $.each(nodes, function(name, data){
        if (data===-2600){
          nodes[name] = objcopy(nodestyle)
        }
      })
      
      return {nodes:nodes, edges:edges}
    }

    var that = {
      lechs:lechs,
      yack:yack,
      parse:function(s){
        var lines = s.split('\n')
        var statements = []
        $.each(lines, function(i,line){
          var tokens = lechs(line)
          if (tokens.length>0) statements.push(tokens)
        })
        
        return yack(statements)
      }
    }
    
    return that
  }

  

  
})()
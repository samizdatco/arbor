(function(){
  
  //
  // the popup menu/button at the top of the editor textarea
  //
  IO = function(elt){
    var dom = $(elt)
    var _dialog = dom.find('.dialog')
    var _animating = false
    
    var that = {
      init:function(){
        
        dom.find('.ctrl > a').live('click', that.menuClick)
        _dialog.find('li>a').live('click', that.exampleClick)
        
        $.getJSON("library/toc.json", function(resp){
          _dialog.append($("<h1>Choose Your Own Adventure</h1>"))
          $.each(resp.rows, function(i, row){
            if (row.key[0]!='cyoa') return
            var title = row.value
            var stub = row.id
            var book = $("<li><a href='#'></a></li>")
            book.attr('class', stub.replace(/[^a-z0-9\-\_\+]/g,''))
            book.find('a').text(title)
            _dialog.append(book)
          })

          _dialog.append($("<h1>Doodles</h1>"))
          $.each(resp.rows, function(i, row){
            if (row.key[0]!='doodle') return
            var title = row.value
            var stub = row.id
            var doodle = $("<li><a href='#'></a></li>")
            doodle.attr('class', stub.replace(/[^a-z0-9\-\_\+]/g,''))
            doodle.find('a').text(title)
            _dialog.append(doodle)
          })


          if ($.address.value()=="/"){
            var n = resp.total_rows
            var books = _dialog.find('a')
            var randBook = resp.rows[Math.floor(Math.random()*n)].id
            $.address.value(randBook)
          }
          
        })
        
        $.address.change(that.navigate)

        return that
      },
            
      navigate:function(e){
        // trace(e.path)
        var docId = e.path.replace(/^\//,'')
        
        if (!docId.match(/^[ \t]*$/)){
          $(that).trigger({type:"get", id:docId})
        }
      },
      
      exampleClick:function(e){
        var elt = $(e.target)
        var targetDoc = elt.closest('li').attr('class')
        
        elt.closest('ul').find('a').removeClass('active')
        elt.addClass('active')
        
        
        $.address.value(targetDoc)
        that.hideExamples()
        return false
      },

      showExamples:function(){
        if (_animating) return
        _animating = true
        dom.find('.examples').addClass('selected')
        
        _dialog.find('a').removeClass('active')
        var viewingId = location.hash.replace(/#\//,'')
        if (viewingId.length) _dialog.find('li.'+viewingId).find('a').addClass('active')
        
        
        _dialog.stop(true).slideDown(function(){
          _animating = false
        })
      },
      hideExamples:function(){
        if (_animating) return
        _animating = true
        dom.find('.examples').removeClass('selected')
        _dialog.stop(true).slideUp(function(){
          _animating = false
        })
      },
      
      menuClick:function(e){
        var button = (e.target.tagName=='A') ? $(e.target) : $(e.target).closest('a')
        var type = button.attr('class').replace(/\s?(selected|active)\s?/,'')
        
        switch(type){
        case "examples":
          var toggled = button.hasClass('selected')
          if (toggled) that.hideExamples()
          else that.showExamples()
          break
          
        case "new":
          that.hideExamples()
          $(that).trigger({type:"clear"})
          break

        case "save":
          if ($(e.target).attr('href')!='#'){
            return true
          }
          $(that).trigger({type:"save"})
          break
        }
        
        return false
      }
    }
    
    return that.init()    
  }
  
})()
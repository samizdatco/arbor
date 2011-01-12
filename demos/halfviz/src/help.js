(function(){
  
  //
  // the scrollable popup window with the halftone docs in it
  //
  HelpPanel = function(elt){
    var dom = $(elt)
    
    var _dragOffset = {x:0, y:0}
    var _mode = 'basics'
    var _animating = false
    
    var that = {
      init:function(){
        dom.find('h1').mousedown(that.beginMove)
        dom.find('h1 a').click(that.hide)
        dom.find('h2 a').click(that.switchSection)
        $(window).resize(that.resize)
        return that
      },
      reveal:function(){
        if (dom.css('display')=='block') return false
        if (dom.css('top')=='0px'){
          var pos = {
            left:$('#grabber').offset().left - dom.width(),
            top:56
          }
          dom.css(pos)
        }
        dom.stop(true).show().css('opacity',0)
        that.resize()
        dom.fadeTo('fast', 1)

        return false
      },
      hide:function(){
        dom.stop(true).fadeTo('fast', 0, function(){
          dom.hide()
        })
        trace('closing')
        $(that).trigger({type:'closed'})
        return false
      },
      
      resize:function(){
        if (dom.css('display')!='block') return
        
        var panel = dom.offset()
        panel.w = dom.width()
        var screen = {w:$(window).width(), h:$(window).height()}
        var leftX = Math.max(-250, Math.min(screen.w - panel.w, panel.left) )
        var topX = Math.min(screen.h-80, panel.top)
        var maxH = screen.h - topX - 14
        dom.css({maxHeight:maxH, left:leftX, top:topX})
      },
      
      switchSection:function(e){
        var newMode = $(e.target).text().toLowerCase()
        if (_animating) return false
        if (newMode==_mode) return false
        _animating = true
        
        dom.find('h2 a').removeClass('active')
        $(e.target).addClass('active')
        
        dom.find('.'+_mode).stop(true).fadeTo('fast',0,function(){
          $(this).hide()
          dom.find('.'+newMode).stop(true).css('opacity',0).show().fadeTo('fast',1,function(){
            _animating = false
            _mode = newMode
            that.resize()
          })

        })
        
        return false
      },
      
      beginMove:function(e){
        var domOffset = dom.offset()
        _dragOffset.x = domOffset.left - e.pageX
        _dragOffset.y = domOffset.top - e.pageY
        $(window).bind('mousemove', that.moved)
        $(window).bind('mouseup', that.endMove)
        return false
      },
      moved:function(e){
        var pos = {left:e.pageX+_dragOffset.x, top:e.pageY+_dragOffset.y}
        dom.css(pos)
        that.resize()
        return false
      },
      endMove:function(e){
        $(window).unbind('mousemove', that.moved)
        $(window).unbind('mouseup', that.endMove)
        return false
      }
    }
    
    return that.init()
  }
  
})()
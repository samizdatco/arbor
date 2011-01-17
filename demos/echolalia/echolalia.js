//
//  echolalia.js
//
//  Created by Christian Swinehart on 2010-12-15.
//  Copyright (c) 2011 Samizdat Drafting Co. All rights reserved.
//

(function($){

  DeadSimpleRenderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem = null

    var that = {
      //
      // the particle system will call the init function once, right before the
      // first frame is to be drawn. it's a good place to set up the canvas and
      // to pass the canvas size to the particle system
      //
      init:function(system){
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height) 
        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
      },
      
      // 
      // redraw will be called repeatedly during the run whenever the node positions
      // change. the new positions for the nodes can be accessed by looking at the
      // .p attribute of a given node. however the p.x & p.y values are in the coordinates
      // of the particle system rather than the screen. you can either map them to
      // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
      // which allow you to step through the actual node objects but also pass an
      // x,y point in the screen's coordinate system
      // 

      redraw:function(){
        ctx.clearRect(0,0, canvas.width, canvas.height)
        
        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(255,255,255, .333)"
          ctx.lineWidth = 1 + 4*edge.data.weight
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          ctx.fillStyle = "white"
          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
        })    			
      }
    }
    return that
  }    

  $(document).ready(function(){
    var sys = arbor.ParticleSystem(1000, 800, 0.5) // create the system with sensible repulsion/stiffness/friction
    sys.renderer = DeadSimpleRenderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // pick a random datafile and load it
    var allbirds = ["bk42w74", "bk43w73", "bk70bk62", "bk95bk3", "g81w58", "g83w57", "pk60gr7", "r15bl29", "r17pu46"]
    var alltrans = "frm"
    var randBird = allbirds[Math.floor(Math.random()*allbirds.length)] + "-" + alltrans[Math.floor(Math.random()*alltrans.length)] + ".json"

    // load the data into the particle system as is (since it's already formatted correctly for .grafting)
    var data = $.getJSON("birds/"+randBird,function(data){
      sys.graft({nodes:data.nodes, edges:data.edges})
    })
    
    // display the name and handle clicks on the ‘see another’ link
    $("#label > span").html(randBird.replace(/.json$/,"").toUpperCase())
    $("a.another").click( function(){ 
      window.location.reload(); 
      return false 
    })
  })


})(this.jQuery)
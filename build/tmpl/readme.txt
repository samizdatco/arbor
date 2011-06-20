arbor.js
--------

Arbor is a graph visualization library built with web workers and
jQuery. Rather than trying to be an all-encompassing framework, arbor
provides an efficient, force-directed layout algorithm plus
abstractions for graph organization and screen refresh handling.

It leaves the actual screen-drawing to you. This means you can use it
with canvas, SVG, or even positioned HTML elements; whatever display
approach is appropriate for your project and your performance needs.

As a result, the code you write with it can be focused on the things
that make your project unique – the graph data and your visual style
– rather than spending time on the physics math that makes the
layouts possible.

Installation
------------

To use the particle system, add jquery and the file at lib/arbor.js
to your path somewhere and include them in your html:

  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/arbor.js"></script>  

If you want to let arbor handle realtime color and value tweens for
you, include the arbor-tween.js file as well. This will add a pair of
new tweening methods to the ParticleSystem object (see the docs to
decide if this appeals to you or not).

  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/arbor.js"></script>
  <script src="path/to/arbor-tween.js"></script>


Getting Started
---------------

The docs folder contains a sample project that demonstrates some of the
basic idioms for working with the library to build a visualization. More
detailed documentation can be found at http://arborjs.org/reference.

In addition, the demos folder contains standalone versions of the demos
at arborjs.org. But since all of them use xhr to fetch their data, you'll 
still need to view them from an http server. If you don't have a copy of
apache handy, use the demo-server.sh script to create a local server.

Colophon
--------

Arbor’s design is heavily influenced by Jeffrey Bernstein’s excellent
Traer Physics[1] library for Processing. In addition, much of the
physics code has been adapted from Dennis Hotson’s springy.js[2]. The
Barnes-Hut n-body implementation is based on Tom Ventimiglia and Kevin 
Wayne’s vivid description[3] of the algorithm.

Thanks to all for releasing such elegantly simple and comprehensible
code.

[1] <http://murderandcreate.com/physics/>
[2] <https://github.com/dhotson/springy>
[3] <http://arborjs.org/docs/barnes-hut>

Contribute
----------

Code submissions are greatly appreciated and highly encouraged. Please send
pull requests with fixes/enhancements/etc. to samizdatco on github. The 
oldschool may also pipe their diff -u output to info@arborjs.org.

License
-------

Arbor is released under the MIT license. http://en.wikipedia.org/wiki/MIT_License
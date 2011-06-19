# python 2.7+ required
# just type "python webserver.py" in the project folder the default port is 8000

try:
	import SimpleHTTPServer
	import SocketServer
except Exception, e:
	print "Could not import the proper libraries", e

import sys

PORT = 8000
try:
	# expect the first argument to be the port
	if len(sys.argv) > 1:
		PORT = int(sys.argv[1])
except:
	pass

try:
	Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

	httpd = SocketServer.TCPServer (("", PORT), Handler)
	
	print "Starting to serve on port", PORT, "(Ctrl-C to exit)."
	
	httpd.serve_forever()
	
except Exception, e:
	print "Error while trying to start the webserver on port", PORT, ":", e

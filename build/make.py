#!/usr/bin/env python
# encoding: utf-8
"""
build.py

regenerates the files in lib/ based on the current state of src/

Created by Christian Swinehart on 2010-12-05.
Copyright (c) 2010 Samizdat Drafting Co. All rights reserved.
"""

from __future__ import with_statement
import sys
import os
import re
from hashlib import md5
from glob import glob
from subprocess import Popen, PIPE
from urllib2 import urlopen, Request
from datetime import datetime
import shutil


# apparently there is no stable download link for <most-recent-version> of 
# yui, so this could url well be stale. if so you can try looking for a 
# new link at: http://yuilibrary.com/downloads/#yuicompressor
YUI_LIB_URL = "http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.6.zip"

# your system configuration may vary...
YUI_PATH = "/usr/local/bin/yui"
YUI_OPTIONS = "--type=js"
# YUI_OPTIONS = "--nomunge --disable-optimizations --type=js"








def make_lib():
  if not os.path.exists('lib'): os.mkdir('lib')
  targets = {
    "arbor.js": ["etc.js", "kernel.js", "physics/atoms.js", "physics/system.js", "physics/barnes-hut.js", "physics/physics.js" ],
    "arbor-tween.js": ["etc.js","graphics/colors.js", "tween/easing.js", "tween/tween.js"],
    "arbor-graphics.js": ["etc.js", "graphics/colors.js", "graphics/primitives.js", "graphics/graphics.js" ],
  }

  for target,deps in targets.items():
    print target

    padding = max(len(os.path.basename(fn)) for fn in deps + (['worker.js','hermetic.js'] if 'kernel.js' in deps else []))

    all_src = dict( (fn, compile("src/%s"%fn,fn,padding)) for fn in deps)
    deps_code = "\n".join(all_src[fn] for fn in deps)

    worker, worker_deps = make_worker(deps, padding)
    output_code = render_file(target, deps=deps_code, worker=worker, worker_deps=worker_deps)
    with file("lib/%s"%target,"w") as f:
      f.write(output_code)
    print ""

def make_worker(deps, padding):
  if 'kernel.js' not in deps: return "",""

  workerfile = "src/physics/worker.js"
  driver = open(workerfile).read().strip()

  # strip out aliases
  m=re.search(r'^(.*)//.alias.*endalias.*?\n(.*)', driver, re.S)
  if m: driver = m.group(1)+m.group(2)

  driver = re.sub(r'importScripts\(.*?\).*?\n','', driver)
  worker_code = compile(driver, 'worker.js', padding)
  hermetic_code = compile('src/hermetic.js', padding)
  
  return worker_code, hermetic_code
      
def render_file(target, **_vals):

  def tmpl_render(tmpl, **args):
    lines = tmpl.split("\n")
    for var,val in args.items():
      tag_re = re.compile(r"^([\t ]*?)\{\{%s\}\}"%var)
      output = []
      for line in lines:
        m = tag_re.search(line)
        if m:
          ws = m.group(1)
          padded_replacement = ws + val.replace("\n","\n%s"%ws)
          output.append(padded_replacement)
        else:
          output.append(line)
      lines = output
    return "\n".join(lines)

  wrapper_tmpl = open("build/tmpl/%s"%target).read()

  vals = dict( (k.upper(),v) for k,v in _vals.items())
  dep_src = vals['DEPS']
  worker_src = vals['WORKER']
  license_txt = open('build/tmpl/LICENSE').read().replace('{{YEAR}}',str(datetime.now().year))
  if 'graphics' in target or 'tween' in target:
    vals['LICENSE'] = "\n".join([ln for ln in license_txt.split("\n") if 'springy.js' not in ln])
  else:
    vals['LICENSE'] = license_txt
  return tmpl_render(wrapper_tmpl, **vals)

def compile(js, title=None, padding=10):
  # do some caching so we're not constantly recompiling unchanged sourcefiles
  def precompiled(md5sum, filename):
    base = re.sub(r'.js$','',filename).replace('/','+')
    hashfile = "%s-%s"%(base,md5sum)
  
    if os.path.exists('build/.o/%s'%hashfile):
      print "-",filename.replace('.js','')
      return file('build/.o/%s'%hashfile).read()

    for fn in glob("build/.o/%s-*"%base):
      os.unlink(fn)

    return None

  def postcompile(md5sum, src, filename):
    if not os.path.exists('build/.o'): os.mkdir('build/.o')
    base = re.sub(r'.js$','',filename).replace('/','+')
    hashfile = "%s-%s"%(base,md5sum)

    with file("build/.o/%s"%hashfile, 'w') as f:
      f.write(src)
  
  # for those last-minute s///g details...
  def filter_src(src, name):
    if 'kernel' in name:
      src = re.sub(r'new Worker\((.*)[\'\"](.*)/worker.*?\)', 
                  r'new Worker(\1"arbor.js")', 
                  src)
    return src


  # if we don't have a cached copy of the compiler output for the file, 
  # run yui and save the raw output to the .o directory for later. otherwise
  # just return the text from the cached file.
  yui_cmd = "%s %s" % (YUI_PATH,YUI_OPTIONS)
  if os.path.exists(js): 
    yui_input = open(js).read()
    title = os.path.basename(js)
  else: 
    yui_input = js
  yui_input = filter_src(yui_input, title)

  input_hash = md5(yui_input).hexdigest()
  yui_output = precompiled(input_hash, title)
  if not yui_output:
    print "+",title.replace('.js','')
    p = Popen(yui_cmd, shell=True, stdin=PIPE, stdout=PIPE, close_fds=True)
    (pin, pout) = (p.stdin, p.stdout)
    pin.write(yui_input)
    yui_output=p.communicate()[0].strip()
    if not yui_output:
      print "Compilation failed (%s)"%title
      sys.exit(1)

    postcompile(input_hash, yui_output, title)



  
  if title:
    return "/* %s%s */  %s"%(" "*(padding-len(title)),title,yui_output)
  else:
    return yui_output
  

def get_yui():
  from zipfile import ZipFile
  from cStringIO import StringIO

  print "fetching yui compressor"
  data = urlopen(YUI_LIB_URL)
  yuizip = ZipFile(StringIO(data.read()))
  jarpath = [f for f in yuizip.namelist() if 'build/yuicompressor' in f][0]
  
  if not os.path.exists('.yui'): os.mkdir('.yui')
  jardata = yuizip.open(jarpath).read()
  with file('.yui/%s'%os.path.basename(jarpath),'w') as f:
    f.write(jardata)
  print "placed jar at",'.yui/%s'%os.path.basename(jarpath)
  
  binfile = "#!/bin/sh\n\njava -jar %s $@\n" % os.path.abspath('.yui/'+os.path.basename(jarpath))
  with file('yui','wb') as f:
    f.write(binfile)
  os.chmod('yui',0755)
  print "created yui script in current dir\n"
  
  
def main():
  global YUI_PATH
  YUI_PATH = os.path.abspath(YUI_PATH)
  if not os.path.exists(YUI_PATH):
    if not os.path.exists('./yui'):
      
      should_get = raw_input('Can\'t find the YUI compresser.\nTry fetching a copy? (y/n) ')
      if should_get.lower().startswith('y'):
        get_yui()
      else:
        print "Please adjust the YUI_PATH variable in the script to point to the proper command"
        sys.exit(1)
    YUI_PATH = os.path.abspath('./yui')

  os.chdir("%s/.."%os.path.dirname(os.path.abspath(__file__)))
  make_lib()


if __name__ == '__main__':
  main()





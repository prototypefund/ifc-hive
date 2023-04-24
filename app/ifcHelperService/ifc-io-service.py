import ifcopenshell
import lark
from ifcopenshell.util.selector import Selector
import hashlib
import os
import time
import tempfile
from flask import Flask, render_template, request, redirect, send_from_directory, url_for
from pprint import pprint

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = '/app/static/'
app.config['MAX_CONTENT_PATH'] = -1

@app.route('/greet')
def say_hello():
  return ifcopenshell.version


@app.route('/')
def upload_form():
   return render_template('index.html')


	
@app.route('/upload', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      f = request.files['file']
      b = f.stream.read()
      h = hashlib.sha256(b)
      d = h.hexdigest()
      fn = d+'.'+f.filename
      save_file = open(app.config['UPLOAD_FOLDER'] + fn, "wb")
      save_file.write(b)
      save_file.close()
      return redirect(fn, code=302)
		
@app.route('/*/<path:path>')
def serve_query(path):
  query = request.json
  m = ifcopenshell.open(app.config['UPLOAD_FOLDER'] + path)
  s = Selector()
  r = s.parse(m,query)
  o = map(lambda e: e.to_string(), r)
  return '? ' + path + ' ' + query + ' ' + m.schema + '<br />' + '<br />'.join(o)

def store(m, path):
  tmp = app.config['UPLOAD_FOLDER'] + path + '.%f' % time.time()
  fn = path[64:]
  m.write(tmp)
  h  = hashlib.sha256()
  b  = bytearray(128*1024)
  mv = memoryview(b)
  with open(tmp, 'rb', buffering=0) as f:
    for n in iter(lambda : f.readinto(mv), 0):
      h.update(mv[:n])
  nfn = h.hexdigest()+fn
  os.rename(tmp,app.config['UPLOAD_FOLDER']+nfn)
  return nfn
  
@app.route('/+/<path:path>', methods = ['POST'])
def add(path):
  e = request.json
  m = ifcopenshell.open(app.config['UPLOAD_FOLDER'] + path)
  if(not hasattr(e[1],'GlobalId')):
    e[1]['GlobalId'] = ifcopenshell.guid.new()
  print(e[1],flush=True)
  m.create_entity(e[0], **e[1])
  return store(m, path)

@app.route('/-/<path:path>', methods = ['POST'])
def rem(path):
  query = request.json
  m = ifcopenshell.open(app.config['UPLOAD_FOLDER'] + path)
  s = Selector()
  r = s.parse(m,query)
  o = map(lambda e: e.to_string(), r)
  for e in r:
    m.remove(e)
  return store(m, path)
 
@app.route('/<path:path>')
def serve_file(path):
   return send_from_directory('static', path, mimetype='application/ifc')

 
if __name__ == '__main__':
   app.run(debug = True)

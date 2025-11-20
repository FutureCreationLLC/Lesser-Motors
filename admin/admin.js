var pageDashboard = location.pathname.includes('dashboard.html');
auth.onAuthStateChanged(function(u){
  if(u && pageDashboard){
    loadExisting();
    loadPreorders();
    loadContacts();
  }
  if(!u && pageDashboard) location.href='login.html';
});

document.getElementById('uploadBg').addEventListener('click',function(){
  var f=document.getElementById('bgFile').files[0];
  if(!f){document.getElementById('bgMsg').textContent='Select a file';return}
  var ref=storage.ref('website/backgrounds/'+Date.now()+'_'+f.name);
  ref.put(f).then(snap=>snap.ref.getDownloadURL()).then(url=>{
    db.collection('website').doc('settings').set({background:url},{merge:true});
    document.getElementById('bgMsg').textContent='Background uploaded';
  }).catch(e=>document.getElementById('bgMsg').textContent=e.message)
});

document.getElementById('uploadCars').addEventListener('click',function(){
  var t=document.getElementById('typeSelect').value;
  var files=document.getElementById('carFiles').files;
  if(!t){document.getElementById('carMsg').textContent='Select type';return}
  if(!files.length){document.getElementById('carMsg').textContent='Select images';return}
  document.getElementById('carMsg').textContent='Uploading...';
  var uploaded=0;
  Array.from(files).forEach(function(file){
    var ref=storage.ref('cars/'+t+'/'+Date.now()+'_'+file.name);
    ref.put(file).then(snap=>snap.ref.getDownloadURL()).then(url=>{
      db.collection('cars').add({type:t,image:url,timestamp:firebase.firestore.FieldValue.serverTimestamp()});
      uploaded++;
      if(uploaded===files.length){document.getElementById('carMsg').textContent='Upload complete'; loadExisting()}
    }).catch(e=>document.getElementById('carMsg').textContent=e.message);
  });
});

function loadExisting(){
  var list=document.getElementById('existingList'); list.innerHTML='';
  db.collection('cars').orderBy('timestamp','desc').get().then(snap=>{
    snap.forEach(doc=>{
      var d=doc.data();
      var el=document.createElement('div'); el.style.display='flex'; el.style.alignItems='center'; el.style.gap='12px'; el.style.marginTop='8px';
      var img=document.createElement('img'); img.src=d.image; img.style.height='60px'; img.style.borderRadius='6px';
      var txt=document.createElement('div'); txt.innerHTML='<div style="font-weight:700;color:#fff">'+d.type.toUpperCase()+'</div><div class="small">'+(d.image.split('/').pop()).slice(0,30)+'</div>';
      var del=document.createElement('button'); del.textContent='Delete'; del.className='btn'; del.style.background='#ff4d4d'; del.style.marginLeft='auto';
      del.addEventListener('click',function(){
        if(!confirm('Delete this image?')) return;
        var url=d.image;
        storage.refFromURL(url).delete().then(function(){
          db.collection('cars').doc(doc.id).delete().then(()=>{loadExisting()});
        }).catch(function(e){alert(e.message)});
      });
      el.appendChild(img); el.appendChild(txt); el.appendChild(del); list.appendChild(el);
    });
  });
}

function loadPreorders(){
  var po=document.getElementById('poList'); po.innerHTML='';
  db.collection('preorders').orderBy('timestamp','desc').onSnapshot(snap=>{
    po.innerHTML='';
    snap.forEach(doc=>{
      var d=doc.data();
      var el=document.createElement('div'); el.style.border='1px solid rgba(255,255,255,0.03)'; el.style.padding='10px'; el.style.marginTop='8px';
      el.innerHTML='<div style="font-weight:700">'+(d.name||'')+' — '+(d.carType||'')+'</div><div class="small">'+(d.phone||'')+' • '+(d.email||'')+'</div><div style="margin-top:6px">'+(d.message||'')+'</div>';
      po.appendChild(el);
    });
  });
}

function loadContacts(){
  var c=document.getElementById('contactList'); c.innerHTML='';
  db.collection('contacts').orderBy('timestamp','desc').onSnapshot(snap=>{
    c.innerHTML='';
    snap.forEach(doc=>{
      var d=doc.data();
      var el=document.createElement('div'); el.style.border='1px solid rgba(255,255,255,0.03)'; el.style.padding='10px'; el.style.marginTop='8px';
      el.innerHTML='<div style="font-weight:700">'+(d.name||'')+'</div><div class="small">'+(d.email||'')+' • '+(d.phone||'')+'</div><div style="margin-top:6px">'+(d.message||'')+'</div>';
      c.appendChild(el);
    });
  });
}

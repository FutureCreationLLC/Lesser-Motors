function loadHomepage(){
  db.collection('website').doc('settings').get().then(doc=>{
    var url = (doc.exists && doc.data().background) ? doc.data().background : 'assets/logo-le-sunshine.svg';
    var el=document.getElementById('heroImage'); if(el) el.src=url;
  });
  var types=['pragya','sedan','bus','suv','pickup','van','cargo','mini-truck','luxury','coupe'];
  var g=document.getElementById('homeGallery');
  db.collection('cars').orderBy('timestamp','desc').limit(8).get().then(snap=>{
    if(g) snap.forEach(d=>{var img=document.createElement('img'); img.src=d.data().image; img.onclick=function(){openModal(this.src)}; g.appendChild(img)});
  });
  loadTypes();
}

function loadTypes(){
  var types=['pragya','sedan','bus','suv','pickup','van','cargo','mini-truck','luxury','coupe'];
  var grid=document.getElementById('typesGrid'); if(!grid) return; grid.innerHTML='';
  types.forEach(function(type){
    db.collection('cars').where('type','==',type).orderBy('timestamp','asc').limit(1).get().then(snap=>{
      var url='assets/logo-le-sunshine.svg';
      snap.forEach(d=>url=d.data().image);
      var card=document.createElement('div'); card.className='card type-card';
      card.innerHTML='<img src="'+url+'"><div class="title">'+type.toUpperCase()+'</div>';
      card.onclick=function(){location.href='models-type.html?type='+encodeURIComponent(type)};
      grid.appendChild(card);
    });
  });
}

function loadModelType(){
  var q=new URLSearchParams(location.search); var type=q.get('type')||'sedan';
  document.getElementById('modelTitle').textContent = type.toUpperCase();
  db.collection('cars').where('type','==',type).orderBy('timestamp','desc').get().then(snap=>{
    var grid=document.getElementById('modelGrid'); if(!grid) return; grid.innerHTML='';
    snap.forEach(d=>{var img=document.createElement('img'); img.src=d.data().image; img.style.cursor='pointer'; img.onclick=function(){openModal(this.src)}; grid.appendChild(img)});
  });
}

function setupGallery(){
  var per=12; var data=[]; var page=0;
  var grid=document.getElementById('galleryGrid');
  var prev=document.getElementById('prevBtn'), next=document.getElementById('nextBtn');
  db.collection('gallery').orderBy('timestamp','desc').get().then(snap=>{
    snap.forEach(d=>data.push(d.data().image));
    render();
  });
  function render(){ grid.innerHTML=''; var start=page*per; var end=start+per;
    data.slice(start,end).forEach(u=>{var img=document.createElement('img'); img.src=u; img.onclick=function(){openModal(u)}; grid.appendChild(img)});
    prev.disabled = page===0; next.disabled = end>=data.length;
  }
  prev.addEventListener('click',function(){ if(page>0){page--;render()}});
  next.addEventListener('click',function(){ if((page+1)*per < data.length){page++;render()}});
}

function setupPreorder(){
  document.getElementById('poSubmit').addEventListener('click',function(){
    var data={name:document.getElementById('poName').value,phone:document.getElementById('poPhone').value,email:document.getElementById('poEmail').value,carType:document.getElementById('poType').value,message:document.getElementById('poNotes').value,timestamp:firebase.firestore.FieldValue.serverTimestamp()};
    db.collection('preorders').add(data).then(()=>{document.getElementById('poStatus').textContent='Submitted';document.getElementById('preorderForm').reset()});
  });
}

function setupContact(){
  document.getElementById('cSubmit').addEventListener('click',function(){
    var data={name:document.getElementById('cName').value,email:document.getElementById('cEmail').value,phone:document.getElementById('cPhone').value,message:document.getElementById('cMsg').value,timestamp:firebase.firestore.FieldValue.serverTimestamp()};
    db.collection('contacts').add(data).then(()=>{document.getElementById('cStatus').textContent='Sent';document.getElementById('contactForm').reset()});
  });
}

function openModal(url){
  var m=document.getElementById('modal'); var mi=document.getElementById('modalImg'); if(!m||!mi) return; mi.src=url; m.style.display='flex';
}

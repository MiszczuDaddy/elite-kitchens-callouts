const CACHE='ek-callouts-v2';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){
  e.waitUntil((async function(){
    var keys=await caches.keys();
    await Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return; // leave Google API / GIS alone
  e.respondWith(
    caches.open(CACHE).then(function(cache){
      return fetch(e.request).then(function(r){cache.put(e.request,r.clone());return r;})
        .catch(function(){return cache.match(e.request).then(function(m){return m||cache.match('./');});});
    })
  );
});

const CACHE='ek-callouts-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.open(CACHE).then(cache=>
      fetch(e.request).then(r=>{cache.put(e.request,r.clone());return r;})
      .catch(()=>cache.match(e.request).then(m=>m||caches.match('./')))
    )
  );
});

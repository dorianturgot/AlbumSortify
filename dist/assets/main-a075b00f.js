import"./bootstrap.min-e3b02a47.js";async function B(s){return await(await fetch("https://api.spotify.com/v1/me",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}async function k(s){return await(await fetch("https://api.spotify.com/v1/me/albums?offset=0&limit=20",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}async function I(s){return await(await fetch("https://api.spotify.com/v1/me/albums?offset=0&limit=50",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}async function x(s){return await(await fetch("https://api.spotify.com/v1/browse/new-releases?offset=0&limit=20",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}async function S(s){return await(await fetch("https://api.spotify.com/v1/me/top/artists",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}async function w(s,e){return await(await fetch("https://api.spotify.com/v1/artists/"+e+"/albums",{method:"GET",headers:{Authorization:`Bearer ${s}`}})).json()}function _(s){if(!s.display_name)document.getElementById("displayName").innerText="You are not connected.";else if(document.getElementById("displayName").innerText="Welcome "+s.display_name,s.images.length>0){const e=new Image(50,50);e.src=s.images[0].url,document.getElementById("avatar").innerHTML=e.outerHTML}}document.getElementById("addToListModal");function M(s,e){fetch(`http://localhost:3000/albumlist/${s}?sort=`,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{N(t,s,e)})}function N(s,e,t){document.getElementById("listModal").innerHTML="",s.forEach(a=>{const n=document.createElement("div");n.classList.add("card"),n.classList.add("listCard");const d=document.createElement("div");d.classList.add("listCover"),d.classList.add("card-img-top"),d.style.backgroundColor=a.color;const o=document.createElement("a");o.style.cursor="pointer",o.addEventListener("click",()=>{j(a.id,e,t)});const l=document.createElement("h5");l.classList.add("card-title"),l.classList.add("display-1"),l.textContent=a.name,o.innerHTML=d.outerHTML,n.appendChild(o),n.appendChild(l),document.getElementById("listModal").append(n)})}async function p(s){const e=localStorage.getItem("userIDSpotify");M(e,s)}const H=s=>new Promise(e=>setTimeout(e,s));function j(s,e,t){fetch("http://localhost:3000/albums",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:e,name:t.name,artist:t.artists[0].name,picture_url:t.images[0].url,url:t.external_urls.spotify,releaseDate:t.release_date,spotifyID:t.id,listID:s,total_tracks:t.total_tracks})}).then(a=>{if(a.status===500)throw new Error("Server Error");return a.json()}).then(async a=>{console.log("New album added to list:",a),document.getElementById("successAlert").classList.remove("d-none"),document.getElementById("failedAlert").classList.add("d-none"),await H(2e3),document.getElementById("successAlert").classList.add("d-none")}).catch(a=>{console.error("Error adding new album to list:",a),document.getElementById("failedAlert").classList.remove("d-none"),document.getElementById("successAlert").classList.add("d-none")})}const g="536df2957a654a26b8d6ca940d9390ea",D=new URLSearchParams(window.location.search),C=D.get("code");var E,f,r=localStorage.getItem("accessToken");console.log(f);const P=document.getElementById("logoutBtn");P.addEventListener("click",()=>{console.log("logout"),localStorage.removeItem("accessToken"),localStorage.removeItem("userIDSpotify"),window.location.href="http://localhost:4173/home.html"});window.location.pathname==="/"&&(window.location.href="/index.html");const z=document.querySelectorAll('[data-bs-toggle="popover"]');[...z].map(s=>new bootstrap.Popover(s));if(window.location.pathname==="/index.html")if(!C&&!r)G(g);else{r||(r=await q(g,C),localStorage.setItem("accessToken",r)),E=r;const s=await B(r);f=s.id,localStorage.setItem("userIDSpotify",s.id),_(s),await y(f,"DESC");const e=await k(r);V(e);const t=await I(r);Z(t);const a=await x(r);W(a);const n=await S(r);Q(n)}else window.location.pathname==="/home.html"&&(r?window.location.href="home.html":window.location.href="index.html");async function G(s){const e=R(128),t=await U(e);localStorage.setItem("verifier",e);const a=new URLSearchParams;a.append("client_id",s),a.append("response_type","code"),a.append("redirect_uri","http://localhost:4173/index.html"),a.append("scope","user-read-private user-read-email user-library-read user-top-read"),a.append("code_challenge_method","S256"),a.append("code_challenge",t),document.location=`https://accounts.spotify.com/authorize?${a.toString()}`}function R(s){let e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";for(let a=0;a<s;a++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}async function U(s){const e=new TextEncoder().encode(s),t=await window.crypto.subtle.digest("SHA-256",e);return btoa(String.fromCharCode.apply(null,[...new Uint8Array(t)])).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function q(s,e){const t=localStorage.getItem("verifier"),a=new URLSearchParams;a.append("client_id",s),a.append("grant_type","authorization_code"),a.append("code",e),a.append("redirect_uri","http://localhost:4173/index.html"),a.append("code_verifier",t);const n=await fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:a}),{access_token:d}=await n.json();return d}async function O(s){const e=encodeURI(s);return await(await fetch("https://api.spotify.com/v1/search?query="+e+"&type=album&offset=0&limit=6",{method:"GET",headers:{Authorization:`Bearer ${E}`}})).json()}async function F(s){const e=await O(b.value),t=document.getElementById("results");t.innerHTML="",e.albums.items.forEach(a=>{const n=document.createElement("div");n.classList.add("card"),n.classList.add("cardList"),n.classList.add("card-body"),n.classList.add("cardBodyScroll");const d=document.createElement("img");d.src=a.images[0].url,d.alt=a.id,d.addEventListener("click",()=>{window.open(a.external_urls.spotify,"_blank")});const o=document.createElement("h3");o.classList.add("card-title"),o.textContent=a.name;const l=document.createElement("h4");l.textContent=a.artists[0].name;const c=document.createElement("p");c.classList.add("card-text"),c.classList.add("artistYear"),c.classList.add("text-center"),c.classList.add("smallNbTracks");const i=document.createElement("small");i.classList.add("text-muted");var m=a.total_tracks>1?" tracks":" track";i.textContent=a.total_tracks+m,c.appendChild(i);const u=document.createElement("button"),h=document.createElement("i");h.classList.add("fa"),h.classList.add("fa-plus"),h.style.color="white",u.appendChild(h),u.classList.add("btn"),u.classList.add("btn-success"),u.classList.add("addBtn"),u.addEventListener("click",et=>{$("#addToListModal").modal("toggle"),p(a)}),n.appendChild(u),n.appendChild(d),n.appendChild(o),n.appendChild(l),n.appendChild(c),t.appendChild(n)})}async function Y(s){const e=encodeURI(s);return await(await fetch("https://api.spotify.com/v1/search?query="+e+"&type=artist&offset=0&limit=6",{method:"GET",headers:{Authorization:`Bearer ${E}`}})).json()}async function J(s){const e=await Y(v.value),t=document.getElementById("resultsArtists");t.innerHTML="",e.artists.items.forEach(a=>{const n=document.createElement("div");n.classList.add("card"),n.classList.add("cardList"),n.classList.add("card-body"),n.classList.add("cardBodyScroll");const d=document.createElement("img");d.src=a.images[0].url,d.alt=a.id,d.addEventListener("click",()=>{window.open(a.external_urls.spotify,"_blank")});const o=document.createElement("h3");o.textContent=a.name;const l=document.createElement("button"),c=document.createElement("i");l.innerText="Albums",c.classList.add("fas"),c.classList.add("fa-chevron-circle-down"),c.classList.add("mx-1"),c.style.color="white",l.appendChild(c),l.classList.add("btn"),l.classList.add("btn-secondary"),l.classList.add("artistBtn"),l.addEventListener("click",async i=>{$("#topArtistsModal").modal("toggle");var m=await w(r,a.id);T(m)}),n.appendChild(l),n.appendChild(d),n.appendChild(o),t.appendChild(n)})}const b=document.getElementById("searchbar");b.addEventListener("input",F);const v=document.getElementById("searchbarArtists");v.addEventListener("input",J);function V(s){document.getElementById("albums").innerHTML="",s.items.forEach(e=>{const t=document.createElement("div");t.classList.add("card"),t.classList.add("cardList"),t.classList.add("card-body"),t.classList.add("cardBodyScroll");const a=document.createElement("img");a.src=e.album.images[0].url,a.alt=e.album.id,a.addEventListener("click",()=>{window.open(e.album.external_urls.spotify,"_blank")});const n=document.createElement("h3");n.classList.add("card-title"),n.textContent=e.album.name;const d=document.createElement("h4");d.textContent=e.album.artists[0].name;const o=document.createElement("p");o.classList.add("card-text"),o.classList.add("artistYear"),o.classList.add("text-center"),o.classList.add("smallNbTracks");const l=document.createElement("small");l.classList.add("text-muted"),l.textContent=e.album.total_tracks+" tracks - "+A(e),o.appendChild(l);const c=document.createElement("button"),i=document.createElement("i");i.classList.add("fa"),i.classList.add("fa-plus"),i.style.color="white",c.appendChild(i),c.classList.add("btn"),c.classList.add("btn-success"),c.classList.add("addBtn"),c.addEventListener("click",m=>{$("#addToListModal").modal("toggle"),p(e.album)}),t.appendChild(c),t.appendChild(a),t.appendChild(n),t.appendChild(d),t.appendChild(o),document.getElementById("albums").appendChild(t)})}function W(s){document.getElementById("newReleases").innerHTML="",s.albums.items.forEach(e=>{const t=document.createElement("div");t.classList.add("cardList"),t.classList.add("card"),t.classList.add("card-body"),t.classList.add("cardBodyScroll");const a=document.createElement("img");a.src=e.images[0].url,a.alt=e.id,a.addEventListener("click",()=>{window.open(e.external_urls.spotify,"_blank")});const n=document.createElement("h3");n.textContent=e.name;const d=document.createElement("h4");d.textContent=e.artists[0].name;const o=document.createElement("h4");var l=e.total_tracks>1?" tracks":" track";o.textContent=K(e.album_type)+" - "+e.total_tracks+l,o.classList.add("typeAlbum");const c=document.createElement("button"),i=document.createElement("i");i.classList.add("fa"),i.classList.add("fa-plus"),i.style.color="white",c.appendChild(i),c.classList.add("btn"),c.classList.add("btn-success"),c.classList.add("addBtn"),c.addEventListener("click",m=>{$("#addToListModal").modal("toggle"),p(e)}),t.appendChild(c),t.appendChild(a),t.appendChild(n),t.appendChild(d),t.appendChild(o),document.getElementById("newReleases").appendChild(t)})}function K(s){return s.charAt(0).toUpperCase()+s.slice(1)}function Q(s){document.getElementById("topArtists").innerHTML="",s.items.forEach(e=>{const t=document.createElement("div");t.classList.add("card"),t.classList.add("cardList"),t.classList.add("card-body"),t.classList.add("cardBodyScroll");const a=document.createElement("img");a.src=e.images[0].url,a.alt=e.id,a.addEventListener("click",()=>{window.open(e.external_urls.spotify,"_blank")});const n=document.createElement("h3");n.textContent=e.name;const d=document.createElement("button"),o=document.createElement("i");d.innerText="Albums",o.classList.add("fas"),o.classList.add("fa-chevron-circle-down"),o.classList.add("mx-1"),o.style.color="white",d.appendChild(o),d.classList.add("btn"),d.classList.add("btn-secondary"),d.classList.add("artistBtn"),d.addEventListener("click",async l=>{$("#topArtistsModal").modal("toggle");var c=await w(r,e.id);T(c)}),t.appendChild(d),t.appendChild(a),t.appendChild(n),document.getElementById("topArtists").appendChild(t)})}function T(s){document.getElementById("topArtistsModalLabel").innerHTML=s.items[0].artists[0].name+"'s albums",document.getElementById("topArtistsModalList").innerHTML="",s.items.forEach(e=>{if(e.total_tracks>1){const t=document.createElement("div");t.classList.add("card"),t.classList.add("cardList"),t.classList.add("card-body"),t.classList.add("savedAlbumsCard"),t.classList.add("cardBodyScroll");const a=document.createElement("img");a.src=e.images[0].url,a.alt=e.id,a.addEventListener("click",()=>{window.open(e.album.external_urls.spotify,"_blank")});const n=document.createElement("h3");n.classList.add("card-title"),n.textContent=e.name;const d=document.createElement("h4");d.textContent=e.artists[0].name;const o=document.createElement("h4");o.textContent=e.total_tracks+" Tracks";const l=document.createElement("button"),c=document.createElement("i");c.classList.add("fa"),c.classList.add("fa-plus"),c.style.color="white",l.appendChild(c),l.classList.add("btn"),l.classList.add("btn-success"),l.classList.add("addBtn"),l.addEventListener("click",i=>{$("#addToListModal").modal("toggle"),p(e)}),t.appendChild(l),t.appendChild(a),t.appendChild(n),t.appendChild(d),t.appendChild(o),document.getElementById("topArtistsModalList").appendChild(t)}})}async function y(s,e){fetch(`http://localhost:3000/albumlist/${s}?sort=`+e,{method:"GET",headers:{"Content-Type":"application/json"}}).then(t=>t.json()).then(t=>{X(t)})}function X(s){document.getElementById("lists").innerHTML="",s.forEach(e=>{const t=document.createElement("div");t.classList.add("card"),t.classList.add("listCard");const a=document.createElement("div");a.classList.add("listCover"),a.classList.add("card-img-top"),a.style.backgroundColor=e.color;const n=document.createElement("a");n.href="list.html?listID="+e.id+"&listName="+e.name;const d=document.createElement("h5");d.classList.add("card-title"),d.classList.add("display-1"),d.textContent=e.name,n.innerHTML=a.outerHTML,t.appendChild(n),t.appendChild(d),document.getElementById("lists").innerHTML+=t.outerHTML})}function Z(s){document.getElementById("moreSavedAlbumsList").innerHTML="",s.items.forEach(e=>{const t=document.createElement("div");t.classList.add("card"),t.classList.add("cardList"),t.classList.add("card-body"),t.classList.add("savedAlbumsCard"),t.classList.add("cardBodyScroll");const a=document.createElement("img");a.src=e.album.images[0].url,a.alt=e.album.id,a.addEventListener("click",()=>{window.open(e.album.external_urls.spotify,"_blank")});const n=document.createElement("h3");n.classList.add("card-title"),n.textContent=e.album.name;const d=document.createElement("h4");d.textContent=e.album.artists[0].name;const o=document.createElement("p");o.classList.add("card-text"),o.classList.add("artistYear"),o.classList.add("text-center"),o.classList.add("smallNbTracks");const l=document.createElement("small");l.classList.add("text-muted"),l.textContent=e.album.total_tracks+" tracks - "+A(e),o.appendChild(l);const c=document.createElement("button"),i=document.createElement("i");i.classList.add("fa"),i.classList.add("fa-plus"),i.style.color="white",c.appendChild(i),c.classList.add("btn"),c.classList.add("btn-success"),c.classList.add("addBtn"),c.addEventListener("click",m=>{$("#addToListModal").modal("toggle"),p(e.album)}),t.appendChild(c),t.appendChild(a),t.appendChild(n),t.appendChild(d),t.appendChild(o),document.getElementById("moreSavedAlbumsList").appendChild(t)})}function A(s){let e=0;s.album.tracks.items.forEach(d=>{e+=d.duration_ms});let t=Math.floor(e/36e5),a=Math.floor(e%36e5/6e4),n=Math.floor(e%36e4%6e4/1e3);return t>0?t=t+"h ":t="",e=t+a+"m "+n+"s",e}var L="";document.getElementById("reverseSortBtn").addEventListener("click",()=>{y(f,L),L==="DESC"?L="":L="DESC"});var tt=document.getElementById("confirmBtnNewList");tt.onclick=function(){const s=localStorage.getItem("userIDSpotify"),e=document.getElementById("newListName").value,t=document.getElementById("colorPicker").value;if(e===""){alert("Please enter a name for the list.");return}if(e.length>30){alert("List name must be less than 30 characters.");return}fetch("http://localhost:3000/albumlist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userID:s,name:e,color:t})}).then(a=>{if(a.status===500)throw new Error("Server Error: "+a.statusText);return a.json()}).then(a=>{console.log("New list added:",a),y(s,"")}).catch(a=>{console.error("Error adding new list:",a),alert("Error creating list.")})};
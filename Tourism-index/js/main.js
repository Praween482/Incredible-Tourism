/* js/main.js - navigation, card interactions, and linking to map with coords */

/*
places array:
id, displayName, lat, lng, category, shortDesc, image, googleMapsQueryLink
*/
const PLACES = [
  // Delhi
  ["redfort","Red Fort, Delhi",28.6562,77.2410,"Heritage","Historic Mughal fort, UNESCO heritage site.",
   "https://upload.wikimedia.org/wikipedia/commons/d/d8/Red_Fort_in_Delhi_03-2016_img3.jpg",
   "https://www.google.com/maps?q=28.6562,77.2410"],

  ["qutub","Qutub Minar, Delhi",28.5244,77.1855,"Heritage","Tall brick minaret from 1193.",
   "https://upload.wikimedia.org/wikipedia/commons/3/3e/Qutub_Minar_in_New_Delhi_03-2016_img3.jpg",
   "https://www.google.com/maps?q=28.5244,77.1855"],

  // UP
  ["taj","Taj Mahal, Agra",27.1751,78.0421,"Heritage","One of the Seven Wonders.",
   "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
   "https://www.google.com/maps?q=27.1751,78.0421"],

  ["varanasi","Varanasi (Ghats)",25.3176,82.9739,"Tourist","Ancient cultural & religious city on the Ganges.",
   "https://upload.wikimedia.org/wikipedia/commons/6/6c/Varanasi_Dawn.jpg",
   "https://www.google.com/maps?q=25.3176,82.9739"],

  // Rajasthan
  ["hawa","Hawa Mahal, Jaipur",26.9239,75.8267,"Heritage","Palace of Winds.",
   "https://upload.wikimedia.org/wikipedia/commons/2/20/Hawa_Mahal%2C_Jaipur.jpg",
   "https://www.google.com/maps?q=26.9239,75.8267"],

  ["jaisalmer","Jaisalmer Fort",26.9157,70.9083,"Heritage","Golden fort in the Thar desert.",
   "https://upload.wikimedia.org/wikipedia/commons/8/8d/Jaisalmer_Fort_2012.jpg",
   "https://www.google.com/maps?q=26.9157,70.9083"],

  // Himachal
  ["manali","Manali Valley",32.2432,77.1892,"Tourist","Mountain & adventure hub.",
   "https://upload.wikimedia.org/wikipedia/commons/e/e5/Manali_view.jpg",
   "https://www.google.com/maps?q=32.2432,77.1892"],

  // Uttarakhand
  ["rishikesh","Rishikesh",30.0869,78.2676,"Tourist","Yoga capital & Ganges rafting.",
   "https://upload.wikimedia.org/wikipedia/commons/d/d1/Rishikesh_Bridge.jpg",
   "https://www.google.com/maps?q=30.0869,78.2676"],

  // Punjab
  ["golden","Golden Temple, Amritsar",31.6200,74.8765,"Heritage","Harmandir Sahib (Golden Temple).",
   "https://upload.wikimedia.org/wikipedia/commons/5/52/Golden_Temple_in_Amritsar.jpg",
   "https://www.google.com/maps?q=31.62,74.8765"],

  // J&K
  ["dal","Dal Lake, Srinagar",34.0837,74.7973,"Tourist","Houseboats & Mughal gardens.",
   "https://upload.wikimedia.org/wikipedia/commons/0/0d/Dal_Lake_2013.jpg",
   "https://www.google.com/maps?q=34.0837,74.7973"]
];

/* helper: build a card element for a place */
function makeCard(p){
  const [id,name,lat,lng,cat,desc,img,link] = p;
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-img"><img src="${img}" alt="${name}"></div>
    <div class="card-body">
      <div class="tag">${cat}</div>
      <h3 style="margin:8px 0 4px">${name}</h3>
      <div class="small-muted">${desc}</div>
    </div>
    <div class="learn-overlay"><a class="learn-btn" href="map.html?lat=${lat}&lng=${lng}&zoom=13" data-lat="${lat}" data-lng="${lng}">Open on Map</a></div>
  `;
  // click anywhere on card opens map too
  card.addEventListener('click', (e) => {
    // avoid double triggering when clicking the link itself
    const a = card.querySelector('.learn-btn');
    if(e.target === a) return;
    window.location.href = `map.html?lat=${lat}&lng=${lng}&zoom=13`;
  });
  return card;
}

/* populate a grid element with cards (given selector) */
function populateGrid(selector){
  const container = document.querySelector(selector);
  if(!container) return;
  PLACES.forEach(p => container.appendChild(makeCard(p)));
}

/* map helper — on map.html, read URL params and set iframe src */
function initMapPage(){
  const iframe = document.getElementById('mapFrame');
  if(!iframe) return;
  const params = new URLSearchParams(location.search);
  const lat = params.get('lat');
  const lng = params.get('lng');
  const zoom = params.get('zoom') || 6;
  // default center for North India
  const defaultLat = 28.0, defaultLng = 77.5, defaultZoom = 5;
  let src;
  if(lat && lng){
    // google maps embed focused on lat,lng
    src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  } else {
    // default bounding North India
    src = `https://www.google.com/maps?q=28.0,77.5&z=${defaultZoom}&output=embed`;
  }
  iframe.src = src;

  // also populate a side list to let user click named places and recenter the iframe
  const list = document.getElementById('placesList');
  if(list){
    PLACES.forEach(p => {
      const [id,name,latp,lngp,cat,desc,img,link] = p;
      const item = document.createElement('div');
      item.className = 'card';
      item.style.marginBottom = '10px';
      item.innerHTML = `<div style="display:flex;gap:10px;align-items:center">
        <img src="${img}" style="width:88px;height:60px;object-fit:cover;border-radius:8px">
        <div>
          <strong>${name}</strong><div style="color:var(--muted);font-size:0.9rem">${cat}</div>
          <div style="margin-top:6px"><a class="learn-btn" href="map.html?lat=${latp}&lng=${lngp}&zoom=13">Open</a>
            <a class="learn-btn" style="margin-left:8px" href="${link}" target="_blank">Learn More</a></div>
        </div>
      </div>`;
      list.appendChild(item);
      // click on item to recenter iframe without reloading
      item.addEventListener('click', (e) => {
        iframe.src = `https://www.google.com/maps?q=${latp},${lngp}&z=13&output=embed`;
        // scroll map to top
        window.scrollTo({top:0,behavior:'smooth'});
      });
    });
  }
}

/* nav active highlight */
document.addEventListener('DOMContentLoaded', () => {
  // populate homepage grids (if present)
  populateGrid('#homeGrid');
  populateGrid('#statesGrid');

  // header nav active class
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => {
    const p = a.getAttribute('href');
    if(location.pathname.endsWith(p)) a.classList.add('active');
  });

  // init map page if on it
  initMapPage();
});
/* --- Background instrumental player (append to js/main.js) --- */

(function initBackgroundAudio(){
  // default online instrumental (royalty-free / public-hosted)
  // You can change this URL to another mp3 you prefer.
  const ONLINE_TRACK = "https://cdn.pixabay.com/download/audio/2021/09/22/audio_d0f9a3a2f3.mp3?filename=relaxing-instrumental-ambient-11251.mp3";
  // fallback local file path (if you put audio/background.mp3 in your project)
  const LOCAL_FALLBACK = "audio/background.mp3";

  // create audio element
  const audio = document.createElement('audio');
  audio.id = "bgAudio";
  audio.loop = true;
  audio.preload = "metadata"; // don't force big download until user plays
  audio.volume = 0.18; // low default volume (0.0 - 1.0)
  // set src: try online first (browser will handle failures), also set fallback later if needed
  audio.src = ONLINE_TRACK;

  // try to detect if online track fails to load (error event) then switch to local fallback
  audio.addEventListener('error', () => {
    // if local fallback exists (browser will still try), set it
    if (audio.src !== LOCAL_FALLBACK) {
      audio.src = LOCAL_FALLBACK;
    }
  });

  // append audio to body (hidden)
  audio.style.display = "none";
  document.body.appendChild(audio);

  // create floating control button
  const btn = document.createElement('div');
  btn.className = "audio-control";
  btn.setAttribute('aria-label','Audio play/pause');
  btn.innerHTML = `
    <svg id="audioIcon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9v6h4l5 4V5L10 9H6z"/>
    </svg>
    <small id="audioLabel">Play</small>
  `;
  document.body.appendChild(btn);

  // handle clicks
  const icon = btn.querySelector('#audioIcon');
  const label = btn.querySelector('#audioLabel');

  function setPlayingUI(isPlaying){
    if(isPlaying){
      // show pause icon (two bars)
      icon.innerHTML = '<path d="M6 19h4V5H6v14zM14 5v14h4V5h-4z"/>';
      label.textContent = 'Pause';
    } else {
      // show play icon (triangle)
      icon.innerHTML = '<path d="M6 9v6h4l5 4V5L10 9H6z"/>';
      label.textContent = 'Play';
    }
  }

  // initial state
  setPlayingUI(false);

  // try to resume play if user navigated within same tab and audio was playing before
  // (simple storage)
  try {
    const prev = sessionStorage.getItem('bgAudioPlaying');
    if (prev === 'true') {
      // do NOT auto-play — must user gesture in most browsers — but restore UI state
      setPlayingUI(true);
    }
  } catch (e){ /* ignore */ }

  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    // toggle
    if (audio.paused) {
      try {
        await audio.play();
        setPlayingUI(true);
        sessionStorage.setItem('bgAudioPlaying','true');
      } catch (err) {
        // play blocked — show user hint
        alert("Audio autoplay blocked by browser. Click the Play button again to start the music.");
      }
    } else {
      audio.pause();
      setPlayingUI(false);
      sessionStorage.setItem('bgAudioPlaying','false');
    }
  });

  // if user navigates to map.html with query to open specific place, we still keep audio element alive per page.
  // Note: page navigation reloads scripts, so sessionStorage is used to remember user preference across pages.

})(); 
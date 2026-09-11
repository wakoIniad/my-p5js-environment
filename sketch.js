const SCREEN_ASPECT_RATIO = 16/9;

const util = {
  CENTER_X: -1,
  CENTER_Y: -1,
  CENTER: []
};

class SceneConstructer {
  constructor() {
    //this.allocations = [];
    this.keys = [];
  }
  construct() {
    for(const key of this.keys) {
      scenes[key]();
    }
  }
}

const __current_state = {
  scene_composition: {
    active_scenes: ["title"],
    allocations: []
  }
};

function _initialization() {
  
}

/** p5js dependency */
function _setting_default_p5setting() {
  imageMode(CENTER);
  textAlign(CENTER);
}

function _update_util_constants() {
  util.CENTER_X = width/2;
  util.CENTER_Y = height/2;
  util.CENTER = [util.CENTER_X, util.CENTER_Y];
}

function _get_screen_size() { 
  const {clientWidth: w, clientHeight: h} = document.documentElement;
  return SCREEN_ASPECT_RATIO > w/h ? [w, w/SCREEN_ASPECT_RATIO] : [h*SCREEN_ASPECT_RATIO, h];
}

function _adapt_browser_environment_changing() {
  window.addEventListener("resize", ()=>  resizeCanvas(..._get_screen_size()));
  window.addEventListener("visibilitychange", ()=>{

  });
}

function loadScene() {
  
}

const images = {
  title_base: "resources/title-base.png",
};

const audios = {
  title: "resources/水縹.mp3",
};
function preload() {
}

const scenes = {
  title:(clock, data)=>{
    audios.title.play();
    image(images.title_base, ...util.CENTER);
  },
  play:(clock, data)=>{
    
  },
  rev:(clock, data)=>{

  },
};


function setup() {
  createCanvas(..._get_screen_size());
  _adapt_browser_environment_changing();
  _setting_default_p5setting();
  
  for(const name of Object.keys(audios)) {
    /**This may cause problem when porting: unmatch type */
    audios[name] = createAudio(name);
  }
  for(const name of Object.keys(images)) {
    /**This may cause problem when porting: unmatch type */
    images[name] = loadImage(name);
  }
}

let _paused = false;
function draw() {
  if(_paused)return;
  
  background(220);
  _setting_default_p5setting();
  for(const key of __current_state.scene_composition.active_scenes) {
    try {
      scenes[key]();
    } catch(e) {
      _paused= true;
      alert(JSON.stringify([e.message]));
    }
  }
}
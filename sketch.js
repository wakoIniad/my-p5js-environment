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
  title_base: "./res/title-base.png",
};

const audios = {
  title: "./res/水縹.mp3",
};
function preload() {
}

function logging(...$) {
  //alert(JSON.stringify($));
  console.log(...$);
}

const $ = {
  cover: "COVER",
  contain: "CONTAIN",
  fit: "FIT",
  center: "CENTER"
};

function inline_logging(...args) {
  logging(...args);
  return null;
}

function locate(img, pivotMode, expandingMode) {
  const pivot = {
    [$.center]: [util.CENTER_X, util.CENTER_Y]
  }?.[pivotMode]() ?? inline_logging("there aren't such a mode",false);
  const expanding = {
    [$.cover]: 
      util.width/util.height < img.width/img.height?
      [util.height/img.height*img.width, util.height] :
      [util.width, util.width/img.width * img.height],
    [$.contain]:util.width/util.height > img.width/img.height?
      [util.height/img.height*img.width, util.height] :
      [util.width, util.width/img.width * img.height],
    [$.fit]: [util.width, util.height]
  }?.[expandingMode]() ?? inline_logging("there aren't such a mode",false);
  return [...pivot, ...expanding];
}

const scenes = {
  title:(clock, data)=>{
    audios.title.loop();
    //text("AIUOE", ...util.CENTER);
    image(images.title_base, ...locate(images.title_base, $.center, $.cover));
  },
  play:(clock, data)=>{
    
  },
  rev:(clock, data)=>{

  },
};


async function setup() {
  createCanvas(..._get_screen_size());
  _adapt_browser_environment_changing();
  _setting_default_p5setting();
  
  for(const name of Object.keys(audios)) {
    /**This may cause problem when porting: unmatch type */
    audios[name] = createAudio(audios[name],
    () => {},
    (err) => logging('audio loading failed', err));
  }
  for(const name of Object.keys(images)) {
    /**This may cause problem when porting: unmatch type */
    images[name] = await loadImage(images[name]);
  }
}

let _paused = false;
function draw() {
  if(_paused)return;
  
  background(220);
  _setting_default_p5setting();
  _update_util_constants();

  for(const key of __current_state.scene_composition.active_scenes) {
    //try {
      scenes[key]();
    //} catch(e) {
    //  _paused= true;
    //  logging(e);
    //}
  }
}
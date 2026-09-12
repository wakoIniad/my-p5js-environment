const SCREEN_ASPECT_RATIO = 16/9;

const util = {
  CENTER_X: -1,
  CENTER_Y: -1,
  CENTER: [],
  width: -1,
  height: -1
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
    active_scenes: [],
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

//シーンごとに管理（画面を複数シーンで分割などするさいは、各シーン毎に分離)
function _update_util_constants() {
  util.CENTER_X = width/2;
  util.CENTER_Y = height/2;
  util.CENTER = [util.CENTER_X, util.CENTER_Y];
  util.width = width;
  util.height = height;
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

const images = {
  title_base: "./res/title-base.png",
  start_button: "./res/start-button.png",
  title_text: "./res/title-text.png"
};

const audios = {
  title: "./res/minahadairo.mp3",
};

const sprites = {

}

const buttons = {
  start: ['','',()=>locate()]
}

function map_generator() {

}

function preload() {
}

function logging(...$) {
  //alert(JSON.stringify($));
  console.log(...$);
}
logging.prototype.err = function(...$) {
  console.error(...$);
}

const $ = {
  cover: "COVER",
  contain: "CONTAIN",
  fit: "FIT",
  center: "CENTER"
};

/*function _inline_logging_handler(res=null, ...args) {
  logging(...args);
  return res;
}*/

const inline_logging = new Proxy(logging, {
  apply: function(target, thisArg, [res, ...argArray]) {
    target.apply(thisArg, argArray);
    return res;
  },

  get: function(target, property, thisArg) {
    return (res=null, ...args)=> {
      if(typeof target[property] == "function") {
        return ()=> {
          target[property].apply(thisArg, ...args);
          return res;
        }
      } else return target[property];
    }
  }
})

/*function inline_logging(res=null, ...args) {
  logging(...args);
  return res;
}*/

function locate(img, pivotMode, expandingMode) {
  /**This may cause problem when porting: key access, treatment of null */
  return [img, ...{
    [$.center]: ()=>[util.CENTER_X, util.CENTER_Y]
    }?.[pivotMode]?.() ?? inline_logging.err([], "there aren't such a mode")
    , ...{
      [$.cover]: 
        ()=>util.width/util.height < img.width/img.height?
        [util.height/img.height*img.width, util.height] :
        [util.width, util.width/img.width * img.height],
      [$.contain]:()=>util.width/util.height > img.width/img.height?
        [util.height/img.height*img.width, util.height] :
        [util.width, util.width/img.width * img.height],
      [$.fit]: ()=>[util.width, util.height]
    }?.[expandingMode]?.() ?? inline_logging.err([], "there aren't such a mode")
  ];
}

const scenes = {
  title:{
    init: ()=>{
    
      buttons.start.mousePressed(()=> {
        loadScene("play");
      });
    },
    draw: (clock, data)=>{
      audios.title.loop();
      //text("AIUOE", ...util.CENTER);
      logging(locate(images.title_base, $.center, $.cover));
      image(...locate(images.title_base, $.center, $.cover));
    }
  },
  play:(clock, data)=>{
    
  },
  rev:(clock, data)=>{

  },
};

class SceneManager {
  constructor(useState) {

  }
  static loadScene(key) {
    //if mode =
    __current_state.scene_composition.active_scenes = [key]; 
    scenes[key].init();
  }
}

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
  for(const name of Object.keys(buttons)) {
    const [label, callback] = buttons[name];
    /**This may cause problem when porting: unmatch type */
    buttons[name] = createButton(label);
    buttons[name].mousePressed(callback);
  }

  SceneManager.loadScene(DEFAULT_SCENE_KEY);
}

//const keep_elements

/*class ButtonManager {
  constructor(label, value) {
    this.element = null;
    this.label = label;
    this.value = value;
  }
  _create() {
    createButton(this.label, this.value);
  }
  draw() {
    
  }
}*/

class multiPurposeQuadTree {
  constructor() {
    this.root = [
      new Domain(), 
      new Domain(), 
      new Domain(), 
      new Domain()
    ];
  }
  buildTree(reference) {

  }
  search(target, type) {
    switch(type) {
      case"overlap":
        break;
      
    }
  }
  apply(element) {

  }
}

class Domain {
  constructor(sx, sy, ex, ey, value=null) {
    this.rectangel = [sx, sy, ex, ey];
    this._judgement = {
      xa: (sx-ex)/2, xb: (sx+ex)/2, 
      ya: (sy-ey)/2, yb: (sy+ey)/2
    };
    this.value = value;
  }
  overlap([x,y]) {
    return
    Math.abs(this._judgement.xa - x) > this._judgement[xb]
      &&
    Math.abs(this._judgement.ya - y) > this._judgement[yb]
    ;
  }
}

const interactiveDomain = new multiPurposeQuadTree();//domain-id
let interactiveDomainIDCounter = 0;
function makeInteractiveDomain(sx, sy, ex, ey, sensorType) {
  const id = ++interactiveDomainIDCounter;
  root = 
}

const DEFAULT_SCENE_KEY = "title";

let _paused = false;
function draw() {
  if(_paused)return;
  
  background(220);
  _setting_default_p5setting();
  _update_util_constants();

  for(const key of __current_state.scene_composition.active_scenes) {
    //try {
      scenes[key].draw();
    //} catch(e) {
    //  _paused= true;
    //  logging(e);
    //}
  }
}
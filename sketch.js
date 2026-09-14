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

class ProcessorrError extends Error {
  constructor(...args) {
    super(...args);
  }
}

class SubscriptionSystem {
  constructor() {

  }

}

class SubscriptionListener {
  constructor(callback) {
    this.keep_subscribe = true;
    this._callback = callback;
  }
  call(self_break) {
    if(!this.keep_subscribe) {
      self_break();
      return;
    }
    const survey = (keep) => {
      if(keep) {
        this.keep_subscribe = true;
      } else this.keep_subscribe = false;
    }
    this._callback(survey);
  }
}

//Bi Quad Oct...
class multiPurposeNDTree {
  constructor(n, ss, es) {
    this.n = n;
    if(ss.length != n || es.length != n)
      throw new ProcessorrError();
    this.root = Domain(ss, es, [])
  }
  elaborate_entire_tree(at) {
    const domain = this.search(at, "point");
    /**
     * 
     */
    domain.property = new Array(2**this.n).fill().map((_,i)=>new Domain(
      domain.ss.map((val,j)=> 
        val + (domain.es[j]-val)/2*((i<<j)&1)>>j),
        //(val + domain.es * ((i<<j)&1)>>j))/(1+((i<<j)&1)>>j)),
      domain.es.map((val,j)=> 
        //val - val/2 * ((i<<j)&1)>>j 
        val - (val - domain.ss[j])/2*((i<<j)&1)>>j)
    ), []
    );
  }
  search(target, type) {
    switch(type) {
      case "overlap":
        /**target: domain */
        const candidates = [this.root];
        const result = [];
        while(candidates.length) {
          const scanning = candidates.pop();
          const corners = 
          new Array(2**this.n).fill().map((_,i)=>
            scanning.ss.map((val,j)=>
              val * (((i<<j)&1)>>j) + scanning.es[i] * (1-(((i<<j)&1)>>j))
            ),
            //scanning.es.map((val,j)=>val * ((i<<j)&1)>>j), []
          );
          const innerCorners = 0;
          for(let i=0,corner=null; i < corners, corner=corners[i].length;i++) {
            innerCorners += target.contain(corner)*2**i;
          }
          if(innerCorners === 2**this.n-1) {
            result.push(innerCorners);
          } else if(innerCorners && scanning.property.length) {
            (1-(((i<<j)&1)>>j)) + val * (((i<<j)&1)>>j)
          }
        } 
        break;
      case "point":
        let scanning = this.root;
        
        while(true) {
          for(const domain of scanning.property) {
            if(domain.contain(target)) {
              scanning = domain;
              break;
            }
          }
          break;
        }
        if(!scanning.contain(target))
          throw new ProcessorrError("MultiPurposeNDTree: out of domain");
        return scanning;
    }
  }
  apply(element) {
    
  }
}

class TouchEventAllocator extends multiPurposeNDTree {
  constructor(...args) {
    super(...args);
  }
  _backtrace_with_functioncalling(node) {
    while(true) {
      callback: node.property...();
      const parent = node.property...;
    }
  }
  subscribeDomain(domain) {
    while(true) {
      for(const dom of this.serach(domain, "overlap")) {
        if(lack) {
          this.search(domain, 'overlap', dom);...##
        } elif(full) {
          dom--subscribe();
        }
      };
    }
  }
}

class Domain {
  constructor(ss, es, property=null) {
    this.domain_start = ss;
    this.domain_end = es;
    this._judgement = 
    {
      as: this.domain_start.map((s, i)=>(s+this.domain_end[i])/2),
      bs: this.domain_start.map((s, i)=>(Math.abs(s-this.domain_end[i]))/2)
        
      //xa: (sx-ex)/2, xb: (sx+ex)/2, 
      //ya: (sy-ey)/2, yb: (sy+ey)/2
    };
    this.property = property;
  }
  contain(point) {
    return point.reduce((cur, val, i)=>cur && Math.abs(this._judgement.as[i] - val) < this._judgement.bs[i], true)
    /*return
    Math.abs(this._judgement.xa - x) < this._judgement[xb]
      &&
    Math.abs(this._judgement.ya - y) < this._judgement[yb]
    ;*/
  }
}

const interactiveDomain = new multiPurposeQuadTree();//domain-id
let interactiveDomainIDCounter = 0;
function makeInteractiveDomain(sx, sy, ex, ey, sensorType) {
  const id = ++interactiveDomainIDCounter;
  root = interactiveDomain.root;
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

function WindowEventRegister() {
  window.addEventListener("pinterdown", function(e) {
    getAt e.clientX, e.clientX
    
  });
}
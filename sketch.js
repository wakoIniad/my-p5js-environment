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
  static DomainProp({parent}) {
    return {parent: parent||null, children:[], prop: {}};
  }
  constructor(n, ss, es, modifier=$=>$) {
    this.n = n;
    if(ss.length != n || es.length != n)
      throw new ProcessorrError();
    this.root = new Domain(ss, es, multiPurposeNDTree.DomainProp());
    this.modifier=modifier;
  }
  elaborate_entire_tree(at) {
    const domain = this.search(at, "point");
    domain.property = new Array(2**this.n).fill().map((_,i)=>new Domain(
      domain.ss.map((val,j)=> val + domain.width[j]*((i<<j)&1)),
      domain.es.map((val,j)=> val - domain.width[j]*(1-(i<<j)&1))
    ), this.modifier(multiPurposeNDTree.DomainProp({parent: domain})));
    return domain;
  }
  search(target, type) {
    switch(type) {
      //case "overlap-lack":  重なってるけど足りてない部分があるものすべて
      //case "overlap-full":  親ドメイン含めて、少しでも重なってるなら欠けているもの含め全て
      case "overlap-fit":
        /**target: domain */
        const candidates = [this.root];
        const result = [];
        while(candidates.length) {
          const scanning = candidates.pop();
          const cornerPoints = 
          new Array(2**this.n).fill().map((_,i)=>
            scanning.ss.map((val,j)=>
              val * (1-((i<<j)&1)) + scanning.es[i] * ((i<<j)&1)
            ),
          );
          const innerCorners = 0;
          for(let i=0,corner=null; i < cornerPoints, corner=cornerPoints[i].length;i++) {
            innerCorners += target.contain(corner)*2**i;
          }
          if(innerCorners === 2**this.n-1) {
            result.push(innerCorners);
          } else if(innerCorners && scanning.property.children.length) {
            for(let i = 0; i < this.n; i++) {
              if((innerCorners << i)&1) {
                candidates.push(scanning.property.children[i]);
              }
            }
          }
        } 
        return result;
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
  static handlePointerMove = false;
  static eventShortestDuration = 1/30;
  static ModifyDomainProp(raw) {
    raw.prop["subscriber_list"] = [];
  }
  constructor(...args) {
    super(...args, TouchEventAllocator.ModifyDomainProp);
  }
  elaborate_entire_tree(at) {
    super.elaborate_entire_tree(at);
  }

  _backtrace_with_functioncalling(node, data={}) {
    do {
      for(const [i, subscription] of node.property.prop["subscriber_list"].entries()) {
        if(subscription.unsubscribed) {
          delete node.property.prop["subscriber_list"][i];
        } else {
          subscription.callback(data);
        }
      }
      node.property.prop["subscriber_list"] = node.property.prop["subscriber_list"].flat();
      node = node.property.parent;
    }
    while(node.property.parent);
  }

  subscribeDomain(domain, entry) {
    while(true) {
      for(const dom of this.serach(domain, "overlap-fit")) {
        dom.property.prop["subscriber_list"].push(entry);
      };
    }
  }
}

class Domain {
  constructor(ss, es, property=null) {
    this.domain_start = ss;
    this.domain_end = es;

    this.domain_center = this.domain_start.map((s, i)=>(s+this.domain_end[i])/2);
    this.domain_width  = this.domain_start.map((s, i)=>(Math.abs(s-this.domain_end[i]))/2);

    this.property = property;
  }
  contain(point) {
    return point.reduce((cur, val, i)=>cur && Math.abs(this.domain_center[i] - val) <= this.domain_width[i], true)
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


const touchEventAllocator = new TouchEventAllocator(window.clientWidth, window.clientHeight);
function WindowEventRegister() {
  window.addEventListener("pinterdown", function(e) {
    const target = touchEventAllocator.serach([e.clientX, e.clientY],"point");
    target._backtrace_with_functioncalling
  });
  if(touchEventAllocator.handlePointerMove) {
    window.addEventListener("pointermove", function(e) {
      touchEventAllocator.serach([e.clientX, e.clientY], "point");
    });
  }
}
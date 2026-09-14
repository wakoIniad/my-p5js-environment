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

function logging(...$) {
  //alert(JSON.stringify($));
  console.log(...$);
}

logging.prototype.err = function(...$) {
  console.error(...$);
}

logging.prototype.warn = function(...$) {
  console.warn(...$);
}

const $ = {
  cover: "COVER",
  contain: "CONTAIN",
  fit: "FIT",
  center: "CENTER"
};

const inline_logging = new Proxy(logging, {
  apply: function(target, thisArg, [res, ...argArray]) {
    target.apply(thisArg, argArray);
    return res;
  },

  get: function(target, property, thisArg) {
    return (res=null, ...args) => {
      if(typeof target[property] == "function") {
        return ()=> {
          target[property].apply(thisArg, ...args);
          return res;
        }
      } else return target[property];
    }
  }
})

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

/**This may cause problem when porting: depends on multi-paradigm language */
class Scene {
  constructor() {

  }
  init() {

  }
  draw() {

  }
}

class PlayScene extends Scene {
  map_generator() {
    
  }
}

/**@abstract */
class View {
  constructor() {

  }
  draw(clock) {

  }
}

class AnimationImage extends View {
  /**@override */
  draw() {

  }
}


class Composer {
  constructor(collider, view) {
    this.pipeline = [];
  };
}

let tmp = null;
const scenes = {
  title:{
    init: ()=>{
      const subscription = createTouchableDomain(64, 64, 192, 192, "click");
      subscription._targets.forEach(e=>{
        //console.log(e);
        
      })
      tmp = subscription;
      subscription.callback = function(e) {
        logging("kami");
        
        /**仮　**寝不足コード */
        SceneManager.loadScene("play");
        subscription.cancel = true;
      }
    },
    draw: (clock, data)=>{
      audios.title.loop();
      //text("AIUOE", ...util.CENTER);
      //logging(locate(images.title_base, $.center, $.cover));
      image(...locate(images.title_base, $.center, $.cover));
      fill(255);
      noStroke();
      //rect(64, 64, 192, 192);
      stroke(255,0,0);
      //noFill();
      tmp._targets.forEach(e=>{

        rect(...e.domain_start, ...e.domain_end.map((v,i)=>v-e.domain_start[i]));
      })
    }
  },
  play:{
    init: ()=>{

    },
    draw: (clock, data)=>{
      logging("switched");
    }
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

class ProcessorrError extends Error {
  constructor(...args) {
    super(...args);
  }
}

class SubscriptionSystem {
  constructor() {
    this.subscribers = [];
  }
  subscrbe(entry) {
    this.subscribers.push(entry);
  }
  provide(data) {
    for(const [i, subscriber] of this.subscribers.entries()) {
      if(subscriber.canceled) {
        delete this.subscribers[i];
      } else {
        subscriber.callback(data);
      }
    }
    this.subscribers = this.subscribers.flat();
  }
}

class SubscriptionEntry {
  constructor(callback) {
    this.canceled = false;
    this.callback = callback;
    this._targets = []; //just for log
  }
  cancel() {
    this.canceled = true;
  }
}

class Data {
  constructor() {
    this.$ = [];
  }
  union() {

  }
}

class DomainProp {
  constructor(generator=()=>({})) {
    this.generator = generator;
  }
  /**
   * @param {*} keys 
   * [len1, len1, len1..., len2, len2, len2 ... len3 ...]
   */
  construct() {
  }
  get(key) {
    return this.prop[key];
  }
  set(key, value) {
    this.prop[key] = value;
    return this;
  }
  RegisterProp(...keyv) {
    for(let i = 0;i < keyv.length;i+=2)this.prop[keyv[i]]=keyv[i+1];
    return this;
  }
  ApplyModifier(modifier) {
    this.prop = modifier(this.prop);
  }
}

//Bi Quad Oct...
class MultiPurposeNDTree {
  /****寝不足コード: 要分離(参照: 上) */
  static DomainProp(parent=null) {
    return {parent: parent||null, children:[]};
  }
  constructor(n, ss, es, modifier=$=>$) {
    this.n = n;
    if(ss.length != n || es.length != n)
      throw new ProcessorrError("unmatch designated dimention and argument dimention");
    this.modifier=modifier;
    this.root = new NdDomain(ss, es, this.modifier(MultiPurposeNDTree.DomainProp()));
  }
  _get_subdivided_domains(origin){
    return new Array(2**this.n).fill().map((_,i)=>new NdDomain(
      origin.domain_start.map((val,j)=> val + origin.domain_width[j]*((i>>j)&1)),
      origin.domain_end.map((val,j)=> val - origin.domain_width[j]*(1-(i>>j)&1)),
      this.modifier(MultiPurposeNDTree.DomainProp(origin))
    ));
  }
  subdivide_if(condition) {
    let processing = [this.root];
    let level = 0;
    do 
      for(let i = processing.length-1, origin; i >= 0; i--) 
        processing.push(...(origin = processing.shift(), condition(origin, level) ? origin.property.children = this._get_subdivided_domains(origin): []));
    while(logging(`heavy process: subdivide of MultiPurposeNDTree (${level})`),++level,processing.length);
  }
  //*長方形になってしまう **寝不足コード
  subdivide(level) {
    if(level <= 0)throw new ProcessorrError("target level is below 0");
    let processing = [this.root];
    while(level--) 
      for(let i = processing.length-1, origin; i >= 0; i--) 
        processing.push(...(origin = domain.unshift(), origin.property.children = this._get_subdivided_domains()));
  }
  subdivide_at(point) {
    const domain = this.search(point, "point");
    domain.property.children = this._get_subdivided_domains();
    return domain;
  }
  search(target, type) {
    switch(type) {
      //case "overlap-lack"://特殊  重なってるけど足りてない部分があるものすべて contain-fit
      //case "overlap-full"://contain  親ドメイン含めて、少しでも重なってるなら欠けているもの含め全て
      case "overlap-fit"://fit
        /**target: domain */
        const candidates = [this.root];
        const result = [];
        let counter = 0;
        while(candidates.length) {
          const scanning = candidates.pop();
          /*let innerCorners = 0;
          for(const [i, corner] of scanning.get_corners().entries()) {
          //for(let i=0,corner=cornerPoints[i]; i < cornerPoints.length;corner=cornerPoints[++i]) {
            innerCorners += (target.contain(corner)||)*2**i;
          }*/
          if(target.containDomain(scanning)) {
            result.push(scanning)
          } else //filter禁止令
          //candidates.push(...scanning.property.children.filter(child=>child.overlap(target)));
          {
            for(const child of scanning.property.children) {
              if(child.overlap(target)) candidates.push(child);
            }
          }
        } 
        return result;
      case "point":
        let scanning = this.root;
        breakLoop:
        while(true) {
          continueLoop: 
          for(;;){
            for(const domain of scanning.property.children) {
              if(domain.contain(target)) {
                scanning = domain;
                break continueLoop;
              }
            }
            break breakLoop;
          }
        }
        if(!scanning.contain(target))
          throw new ProcessorrError("MultiPurposeNDTree: out of domain");
        return scanning;
    }
  }
  apply(element) {
    
  }
}

class TouchEventAllocator extends MultiPurposeNDTree {
  static HANDLE_POINTER_MOVE = false;
  static EVENT_SHORTEST_INTERVAL = 1/30;
  static mainInstance = null;
  static ModifyDomainProp(raw) {
    raw.subscription = new SubscriptionSystem();
    return raw;
  }
  /*_builder(width, height) {
    const ref = Math.max(width, height);
    const root = new MultiPurposeNDTree(ref, ref);

    let [sw, sh, curw, curh] = [0, 0, width, height];
    while(true) {
      const m = Math.min(curw, curh);
      ...this._builder(m, )
      curw -= sw = (m + sw)%curw;
      curh -= sh = (m + sh)%curh;
      
    }
  }*/
  constructor(width, height, cell_unit) {
    const longer_side = Math.max(width, height); 
    super(2, [0, 0], [longer_side, longer_side], TouchEventAllocator.ModifyDomainProp);
    
    const screen_domain = new NdDomain([0,0],[width,height]);
    this.subdivide_if((domain, level)=>domain.overlap(screen_domain) && domain.domain_width[0] > cell_unit);

    if(TouchEventAllocator.mainInstance) {
      logging.warn("SingletonInstance was overrided: TouchEventAllocator");
      TouchEventAllocator.mainInstance = this;
    } else TouchEventAllocator.mainInstance = this, this._window_event_register();
  }
  _window_event_register() {
    window.addEventListener("pointerdown", function(e) {
      const target = TouchEventAllocator.mainInstance.search([e.clientX, e.clientY], "point");
      console.log("野嶋君大好きかわいいやさいい頭いい性格いい字綺麗ノート綺麗まじめしっかりしてるたまに遅刻する", target);
      TouchEventAllocator.mainInstance._backtracing_call(target, e);
    });
    if(TouchEventAllocator.HANDLE_POINTER_MOVE) {
      window.addEventListener("pointermove", function(e) {
        const target = TouchEventAllocator.mainInstance.search([e.clientX, e.clientY], "point");
        TouchEventAllocator.mainInstance._backtracing_call(target, e);
      });
    }
  }

  _backtracing_call(node, data={}) {
    do {
      node.property.subscription.provide(data);
      node = node.property.parent
    }
    while(node);
  }

  subscribeDomain(domain, entry) {
    console.log(644, this.search(domain, "overlap-fit"));
    for(const target of this.search(domain, "overlap-fit")) 
      target.property.subscription.subscrbe(entry),
    /**just for a log */
      entry._targets.push(target);
  }
}

class NdDomain {
  constructor(ss, es, property=null, n=null) {
    this.domain_start = ss;
    this.domain_end = es;

    this.domain_center = this.domain_start.map((s, i)=>(s+this.domain_end[i])/2);
    this.domain_width  = this.domain_start.map((s, i)=>(Math.abs(s-this.domain_end[i]))/2);

    this.property = property;

    if(n) {
      if(this.domain_start.length === n && this.domain_end.length === n) {
        this.n = n;
      } else throw new ProcessorrError("unmatch designated dimention and argument dimention");
    } else {
      if(this.domain_start.length === this.domain_end.length) {
        this.n =  this.domain_end.length;
      } else throw new ProcessorrError("unmatch designated dimention and argument dimention");
    }
  }
  get_corners() {
    return new Array(2**this.n).fill().map((_,i)=>
      this.domain_start.map((val,j)=>
        val * (1-((i>>j)&1)) + this.domain_end[j] * ((i>>j)&1)
      )
    );
  }
  contain(point) {
    return point.reduce((cur, val, i)=>cur && Math.abs(this.domain_center[i] - val) <= this.domain_width[i], true)
  }
  overlap(domain) {
    if(this.n !== domain.n)throw new ProcessorrError("unmatch designated dimention and argument dimention");
    //後: これより良い方法 
    for(const point of this.get_corners()) {
      if(domain.contain(point))return true;
    }
    for(const point of domain.get_corners()) {
      if(this.contain(point))return true;
    }
  }
  containDomain(domain) {
    for(const corner of domain.get_corners()) {
      if(!this.contain(corner))return false;
    }
    return true;
  }
  get_overlaps(domain) {
    
  }
}

let interactiveDomainIDCounter = 0;
function createTouchableDomain(sx, sy, ex, ey, sensorType) {
  const id = ++interactiveDomainIDCounter;
  const subscriptionEntry = new SubscriptionEntry();
  touchEventAllocator.subscribeDomain(new NdDomain([sx, sy], [ex, ey]), subscriptionEntry);
  return subscriptionEntry;
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


const touchEventAllocator = new TouchEventAllocator(window.innerWidth, window.innerHeight, 2);
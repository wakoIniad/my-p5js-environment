function generateAABB() {

}

function isOverlapping(target) {
    let exploreSize = 64;//仮: MAP_SIZE
    target.position, target.boudingSize 
    let scanningSet = [_active_elements_mappedin_quadtree];
    while() {
        
    }
}

async function createElement(imagePath) {
    const image = await loadImage(imagePath);
    const element = new nojElement(image);

}

const _active_elements_mappedin_quadtree =  new multiPurposeQuadTree();


class Vector {
    constructor(len, ...vs) {
        this.content = vs;
        this.length = len || vs.length;
    }
}

class Element {
    constructor(image) {
        this.usingImage = image;
        this.boudingSize = [image.width/2, image.height/2];
        this.speed = new Vector();
        this.position = new Vector();
    }
}
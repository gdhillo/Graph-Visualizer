class Node {
    constructor(value) {
      this.value = value;
      this.edges = []; // adjacentcy list
      this.visted = false;
    }
};
 
class Queue 
{ 
	constructor() 
	{ 
		this.items = []; 
	} 
                
    enqueue(element) 
    {     
        this.items.push(element);
    } 

    dequeue() 
    { 
        if(this.isEmpty()) 
            return "Underflow"; 
        return this.items.shift(); 
    } 

    isEmpty() 
    { 
        return this.items.length === 0; 
    } 

    
};

class Stack { 
    constructor() 
    { 
        this.items = []; 
    } 

    push(element) 
    { 
        this.items.push(element); 
    } 

    pop() 
    { 
        if (this.items.length === 0) 
            return "Underflow"; 
        return this.items.pop(); 
    } 

    isEmpty() 
    { 
        return this.items.length === 0; 
    }

    peek() {
        return this.items.length;
    }

};

const node_list = {};
const node_coordinates = []; // to handle collisions, so two nodes cant occurpy the same position
const btn = document.querySelectorAll("button"); 

btn[0].onclick = () => {
    const value = document.querySelectorAll('input')[0].value;

    if (isNaN(value)) {
        alert("Please enter an Integer value");
        return;
    }

   if (node_list.hasOwnProperty(value) === false) {
        const node = new Node(value);
        node_list[node.value] = node;
        const element = document.querySelector('#nodes');
        const nav = document.getElementById(`nav`); 
        const array = checkCoordinates([Math.floor(Math.random()*(window.innerHeight/2))+nav.offsetHeight,Math.floor(Math.random()*window.innerWidth)]);
        const x = array[0];
        const y = array[1];
        element.innerHTML += `<div class="node" id="${node.value}" style="top:${x}px; left:${y}px;"><div class="circle" id="${node.value}_"><div class="numbers">${node.value}</div></div></div>`;
    }
    else {
       alert(value+" is already in graph");
    }
};

btn[1].onclick = () => {
    const elementOne = document.querySelector('#nodes');
    elementOne.innerHTML = "";
    const elementTwo = document.querySelector('#lines');
    elementOne.innerHTML = "";
    elementTwo.innerHTML = "";
    clearNodes();
};

btn[2].onclick = () => {
    const val1 = document.querySelectorAll('input')[1].value;
    const val2 = document.querySelectorAll('input')[2].value;
    const nodeOne = findNode(val1);
    const nodeTwo = findNode(val2);
    nodeOne.edges.push(nodeTwo);
    nodeTwo.edges.push(nodeOne);
    const element = document.querySelector("#lines"); 
    const nodeOneElement = document.getElementById(`${nodeOne.value}`); 
    const nodeTwoeElement = document.getElementById(`${nodeTwo.value}`); 
    const nav = document.getElementById(`nav`); 
    const x1 = nodeOneElement.getBoundingClientRect().left + nodeOneElement.getBoundingClientRect().width/2;
    const y1 = nodeOneElement.getBoundingClientRect().top + nodeOneElement.getBoundingClientRect().height/2-nav.offsetHeight;
    const x2 = nodeTwoeElement.getBoundingClientRect().left + nodeTwoeElement.getBoundingClientRect().width/2;
    const y2 = nodeTwoeElement.getBoundingClientRect().top + nodeTwoeElement.getBoundingClientRect().height/2-nav.offsetHeight;
    element.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: rgb(0, 0, 0);stroke-width:2;"></line>`;
};

btn[3].onclick = () => {
    const bfs_start = document.querySelectorAll('input')[3].value;
    const nodeOne = findNode(bfs_start);
    const nodeOneElement = document.getElementById(`${nodeOne.value}_`);
    const textElement = document.getElementById(`text_bfs`);
    reset();
    textElement.innerHTML = `BFS Traversal: -> ${nodeOne.value}`;
    nodeOneElement.classList.toggle("active");
    setTimeout(() => {      
    }, 1000);

    bfs(nodeOne);
};

btn[4].onclick = () => {
    reset();
};

btn[5].onclick = () => {
    const dfs_start = document.querySelectorAll('input')[4].value;
    const nodeOne = findNode(dfs_start);
    reset();
    dfs(nodeOne);
};

btn[6].onclick = () => {
    reset();
};

const clearNodes = () => {    
    for(let i in node_list){
        delete node_list[i];
    }
};

const reset = () => {
    const element = document.querySelectorAll(`.active`);
    const textElementOne = document.getElementById(`text_bfs`);
    const textElementTwo= document.getElementById(`text_dfs`);
    textElementOne.innerHTML = `BFS Traversal:`;
    textElementTwo.innerHTML = `DFS Traversal:`;


    for(let i = 0; i < element.length; i++){
        element[i].classList.toggle("active");
    }

    for(let i in node_list){
        node_list[i].visted = false;
    }
};

const bfs = (node) => {
    const q = new Queue();
    q.enqueue(node);
    node.visted = true;
    while(!q.isEmpty()) {
        const vertex = q.dequeue();
        setTimeout(() => { 
            for (let i = 0; i < vertex.edges.length; i++) {
                if(vertex.edges[i].visted === false) {
                    q.enqueue(vertex.edges[i]);
                    vertex.edges[i].visted = true;
                    const nodeElement = document.getElementById(`${vertex.edges[i].value}_`);
                    const textElement = document.getElementById(`text_bfs`);
                    textElement.innerHTML += `-> ${vertex.edges[i].value}`;
                    nodeElement.classList.toggle("active");
                    bfs(vertex.edges[i]);
                }
            }
        }, 1000);   
    }
};

const dfs = (node) => {
    const s = new Stack();
    const set = new Set();
    let array = [];
    s.push(node);

    while(!s.isEmpty()){
        
        const vertex = s.pop();
        vertex.visted = true;

        if(!set.has(vertex.value)){
            set.add(vertex.value);
            array.push(vertex.value);
            for(let i = 0; i < vertex.edges.length; i++){
                vertex.edges[i].visted = true;
                s.push(vertex.edges[i]);          
            }
        }
    }
        for(let i = 0; i < array.length; i++){
            setTimeout(() => {
                const nodeElement = document.getElementById(`${array[i]}_`);
                const textElement = document.getElementById(`text_dfs`);
                textElement.innerHTML += `-> ${array[i]}`;
                nodeElement.classList.toggle("active");
            },1000*i);
        }
};

const checkCoordinates = (array) => {
    const nav = document.getElementById(`nav`); 

    if (node_coordinates.length === 0)
    {
        node_coordinates.push({'x':array[0],'y':array[1]});
    }
    else {
        for(let i = 0; i < node_coordinates.length; i++){
            if( (array[0] <= (node_coordinates[i].x+100) && array[0] >= (node_coordinates[i].x-100)) && (array[1] <= (node_coordinates[i].y+100) &&  array[1] >= (node_coordinates[i].y-100))){
                console.log('this ran');
                const tempArray = checkCoordinates([Math.floor(Math.random()*window.innerHeight/2)+nav.offsetHeight, Math.floor(Math.random()*window.innerWidth)]);
                array[0] = tempArray[0];
                array[1] = tempArray[1];
                break;
            }
        }
        node_coordinates.push({'x':array[0],'y':array[1]});
    }
    return array;
};

const findNode = (value) => {
    if (node_list.hasOwnProperty(value)) {
        return node_list[value];
    }
    return null;
};
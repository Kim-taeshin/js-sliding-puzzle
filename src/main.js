import * as PIXI from "pixi.js";
import Tile from "./tile";

class Main {
  constructor() {
    this.app = new PIXI.Application({
      width: 500,
      height: 500,
      backgroundColor: 0x000000,
      resolution: window.devicePixelRatio || 1,
      antialias: false,
      view: document.getElementById("puzzle-game"),
    });

    this.puzzleContainer = new PIXI.Container();
    this.app.stage.addChild(this.puzzleContainer);

    this.row = 4; //행
    this.column = 4; //열
    this.TOTAL_CELL = this.row * this.column; // 전체 타일 수
    this.tileArr = [];
    this.emptyIndex = 0;
    this.init();
  }

  // 초기화 함수
  init() {
    this.tileArr = [];
    let posX = 0; //타일 x값
    let posY = 0; //타일 y값

    for (let i = 0; i < this.TOTAL_CELL; i++) {
      this["tile_" + i] = new Tile();
      const tile = this["tile_" + i];
      tile.answerIndex = i;
      tile.currentIndex = i;
      tile.setText(String(i));

      // 마우스 인터렉션 추가
      tile.eventMode = "static";
      tile.cursor = "pointer";
      tile.on("pointertap", this.hnClick, this);

      tile.position.set(posX, posY);
      posX += 100;

      this.tileArr.push(tile);
      this.puzzleContainer.addChild(tile);

      // 행의 갯수로 나누어 떨어지면 줄내리고 다시 맨왼쪽부터 다시 배치한다
      if ((i + 1) % this.row == 0) {
        posX = 0;
        posY += 100;
      }
    }

    // 비어 있는 타일
    this.emptyIndex = this.TOTAL_CELL - 1;
    this["tile_" + this.emptyIndex].setVisible(false);

    this.puzzleContainer.x = 50;
    this.puzzleContainer.y = 50;

    this.setShuffle();
  }

  setShuffle()
  {
    let prevIndex = -1;

    for(let i = 0; i < 2; i++)
    {
      const emptyIndex = this.emptyIndex;
      
      const rndMove = [];

      const line = Math.trunc(emptyIndex / this.row);
      const upIndex = emptyIndex - this.column;
      const downIndex = emptyIndex + this.column;
      const leftIndex = emptyIndex - 1;
      const rightIndex = emptyIndex + 1;

      if(downIndex < this.TOTAL_CELL )
      {
        if(prevIndex != downIndex)  rndMove.push(downIndex);
      } 

      if(upIndex > 0)
      {
        if(prevIndex != upIndex) rndMove.push(upIndex);
      }

      if(line === Math.trunc(rightIndex/ this.row))
      {
        if(prevIndex != rightIndex) rndMove.push(rightIndex);
      }
    
      if(line === Math.trunc(leftIndex / this.row) && leftIndex > -1)
      {
        
        if(prevIndex != leftIndex) rndMove.push(leftIndex);
      }
      
      const rnd = Math.floor(Math.random() * rndMove.length);
      const nextMoveIndex = rndMove[rnd];

      prevIndex = emptyIndex;
      
      this.moveTile(nextMoveIndex, emptyIndex);
    }
  }

 
  moveTile(currentIndex, emptyIndex)
  {
    // 클릭한 타일이 비어 있는 타일 위치로 이동하고
    // 비어 있는 타일은 클릭한 타일 위치로 이동해야 된다.
    // 그러므로 둘의 currentIndex값이 교환되어야 한다.
    this.tileArr[currentIndex].currentIndex = emptyIndex;
    this.tileArr[emptyIndex].currentIndex = currentIndex;

    // currentIndex값을 교환했으면 배열에서의 위치도 서로 바꿔준다.
    const temp = this.tileArr[currentIndex];
    this.tileArr[currentIndex] = this.tileArr[emptyIndex];
    this.tileArr[emptyIndex] = temp;

    // 비어 있는 타일 인덱스를 갱신한다
    this.emptyIndex = currentIndex;

    const currentTile = this.tileArr[currentIndex];
    currentTile.x = 
    (currentTile.currentIndex < this.row)? currentTile.currentIndex * 100 : currentTile.currentIndex % this.row * 100;

    currentTile.y = 
    (currentTile.currentIndex < this.row)? 0 : Math.trunc(currentTile.currentIndex / this.column) * 100;

    const emptyTile = this.tileArr[emptyIndex];
    emptyTile.x = 
    (emptyTile.currentIndex < this.row)? emptyTile.currentIndex * 100 : emptyTile.currentIndex % this.row * 100;

    emptyTile.y = 
    (emptyTile.currentIndex < this.row)? 0 : Math.trunc(emptyTile.currentIndex / this.column) * 100;
    
    /*
    // 변경된 배열순으로 타일을 재배치 한다.
    let posX = 0; //타일 x값
    let posY = 0; //타일 y값

    for (let i = 0; i < this.TOTAL_CELL; i++) {
      const tile = this.tileArr[i];
      tile.position.set(posX, posY);
      posX += 100;

      if ((i + 1) % this.row == 0) {
        posX = 0;
        posY += 100;
      }
    }
    */
  }

  hnClick(evt)
  { 
    const tile = evt.currentTarget;
    const currentIndex = tile.currentIndex;
    const emptyIndex = this.emptyIndex;

    if(currentIndex + this.column === emptyIndex)
    {
      //console.log("아래로 이동 가능");
      this.moveTile(currentIndex, emptyIndex);
    } 
    else if(currentIndex - this.column === emptyIndex)
    {
      //console.log("위로 이동 가능");
      this.moveTile(currentIndex, emptyIndex);
    }
    else if(Math.trunc(currentIndex / this.row) === Math.trunc(emptyIndex / this.row))
    {
      //console.log("같은 줄에 있음");
      if(currentIndex + 1 === emptyIndex)
      {
        //console.log("오른쪽 이동 가능");
        this.moveTile(currentIndex, emptyIndex);
      }
      else if(currentIndex - 1 === emptyIndex)
      {
        //console.log("왼쪽 이동 가능");
        this.moveTile(currentIndex, emptyIndex);
      } 
    }

    //this.checkAnswer();
    const currentTile = this.tileArr[emptyIndex];
    console.log(currentTile.getIsCorrectPosition());
    if(currentTile.getIsCorrectPosition()) this.checkAnswer();
  }

  checkAnswer()
  {
    let bClear = true;
    for (let i = 0; i < this.TOTAL_CELL; i++) {
      // 각 타일이 정위치에 있는지 확인
      // 만약 하나라도 정위치가 아니라면 bClear는 false 하고
      // for문 빠져나갈 것.
      const tile = this["tile_" + i];
      const bool = tile.getIsCorrectPosition();
      if(!bool)
      {
        bClear = false;
        break;
      }
    }

    // bClear 가 true라면 모든 타일 정위치
    if(bClear)
    {
      this["tile_" + this.emptyIndex].setVisible(true);
      console.log('Game Clear');
    }
  }
}

const main = new Main();

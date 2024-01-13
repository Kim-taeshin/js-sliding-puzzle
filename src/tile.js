import * as PIXI from "pixi.js";

export default class Tile extends PIXI.Container {
  constructor() {
    super();

    // 자신의 정답 인덱스값
    this.answerIndex = 0;

    // 자신의 현재 인덱스 값
    this.currentIndex = 0;

    // 사각형 그리기
    this.rect = new PIXI.Graphics();
    this.rect.lineStyle(1, 0x0000ff);
    this.rect.beginFill(0xffffff, 1);
    this.rect.drawRect(0, 0, 100, 100);
    this.rect.endFill();

    this.addChild(this.rect);

    // 숫자 텍스트 그리기
    this.numberTxt = new PIXI.Text("empty");
    this.addChild(this.numberTxt);
  }

  setText($txt) {
    this.numberTxt.text = $txt;
    this.numberTxt.x = 50 - this.numberTxt.width / 2;
    this.numberTxt.y = 50 - this.numberTxt.height / 2;
  }

  setEmptyTile()
  {
    this.numberTxt.visible = false;
    this.rect.visible = false;
  }

  setVisible(bVisible)
  {
    this.numberTxt.visible = bVisible;
    this.rect.visible = bVisible;
  }

  getIsCorrectPosition()
  {
    const bool = (this.answerIndex === this.currentIndex)? true : false;
    return bool;
  }
}

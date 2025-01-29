"use strict";

// #@@range_begin(list1)
const stream = require('stream');
const util = require('util');

class ReplaceStream extends stream.Transform {
  constructor(searchString, replaceString) {
    super();
    this.searchString = searchString;
    this.replaceString = replaceString;
    this.tailPiece = '';
  }

  _transform(chunk, encoding, callback) {
    const pieces = (this.tailPiece + chunk)            // ❶
      .split(this.searchString);
    const lastPiece = pieces[pieces.length - 1];
    const tailPieceLen = this.searchString.length - 1;

    // 入力チャンク間で検索文字列が分断されていても対応できるよう、検索文字列の長さに対応した長さ分だけスライスし、次回検証時に繋げてから検証する
    this.tailPiece = lastPiece.slice(-tailPieceLen);   // ❷
    pieces[pieces.length - 1] = lastPiece.slice(0,-tailPieceLen);

    this.push(pieces.join(this.replaceString));        // ❸
    callback();
  }

  // 内部バッファに残ったチャンクを書き出す
  _flush(callback) {
    this.push(this.tailPiece);
    callback();
  }
}

module.exports = ReplaceStream;
// #@@range_end(list1)

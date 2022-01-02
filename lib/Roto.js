const shuffle = require('lodash.shuffle')
class Roto {
  constructor(playerList, format = 'vintage', bans = 0, picks = 45) {
    if (playerList.length < 2) {
      throw new Error('Need at least 2 players to draft');
    }
    this.players = shuffle(playerList);
    this.numPlayers = this.players.length;
    this.format = format;
    this.banRounds = bans;
    this.pickRounds = picks;
    this.turns = (picks + bans) * this.numPlayers;
    this.currentPick = 0;
    this.toGo = 0;
    this.dir = 1;
    this.picked = [];
    this.banned = [];
  }
  advance() {
    let round = Math.floor(this.currentPick / this.numPlayers);
    let step = round % 2 === 0 ? 1 : -1;
    let next = this.toGo + step;
    this.toGo = (next < this.numPlayers && next >= 0) ? next : this.toGo;
    this.currentPick++;
  }
  stepBack() {
    let round = Math.floor(this.currentPick / this.numPlayers);
    let step = round % 2 === 0 ? -1 : 1;
    let next = this.toGo + step;
    this.toGo = (next < this.numPlayers && next >= 0) ? next : this.toGo;
    this.currentPick--;
  }
  pick(card) {
    if (this.currentPick >= this.turns) {
      throw new Error('Attempted to pick in completed roto')
    }
    if (this.currentPick < this.banRounds * this.numPlayers) {
      //ban
      this.banned.push(card);
    }
    else {
      //pick
      this.picked.push(card);
    }
    this.advance();
  }
  undo() {
    if (this.currentPick === 0) {
      throw new Error('Nothing to undo');
    }
    if (this.currentPick <= this.banRounds * this.numPlayers) {
      this.banned.pop();
    } else {
      this.picked.pop();
    }
    this.stepBack();
  }

}

module.exports = Roto;
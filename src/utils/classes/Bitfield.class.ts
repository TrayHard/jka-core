export class Bitfield {
  private _bits: boolean[];
  private _keys: string[];

  constructor(num: number, size: number, keys: string[]) {
    let numBinaryString = num.toString(2);
    const dif = size - numBinaryString.length;
    if (dif) {
      numBinaryString = `${('0').repeat(dif)}${numBinaryString}`
    }

    this._bits = numBinaryString.split('').map(x => x === '1')
    this._keys = keys.concat().reverse();
  }

  public get decimal(): number {
    return parseInt(
      this._bits
        .map(x => x ? '1' : '0')
        .join(''),
      2
    )
  }

  public get binary(): string {
    return this._bits
      .map(x => x ? '1' : '0')
      .join('')
  }

  public get list() {
    return this._bits.reduce((acc, el, i) => ({
      ...acc,
      [this._keys[i]]: el,
    }), {})
  }
}

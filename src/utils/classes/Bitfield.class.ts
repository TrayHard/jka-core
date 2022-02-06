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

  public get list(): object {
    return this._bits.reduce((acc, el, i) => ({
      ...acc,
      [this._keys[i]]: el,
    }), {})
  }

  /**
   * Sets key of bitfield to specific parameter
   * @param key The key which should be set
   * @param value The value which should be used for setting up
   * @returns True if succeed, false if there is no such key
   */
  public set(key: string, value: boolean): boolean {
    const index = this._keys.findIndex((el) => el === key);
    if (index === -1) {
      return false;
    } else {
      this._bits[index] = value;
      return true;
    }
  }

  /**
   * Gets the current value of the key of the bitfield
   * @param key The key which should be taken
   * @returns The value of the key or null, if there is no such key
   */
  public get(key: string): boolean | null {
    const index = this._keys.findIndex((el) => el === key);
    return index === -1
      ? null
      : this._bits[index]
  }
}

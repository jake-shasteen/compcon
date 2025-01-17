// TODO LIST
// - move to interfaces file
// create validator for dice (separate from parser) for unit testing the data

declare interface ISkillRollResult {
  rawDieRoll: number
  staticBonus: number
  accuracyDiceCount: number // net accuracy dice total - negative if at disadvantage
  rawAccuracyRolls: number[] // results of each accuracy/disadvantage die
  accuracyResult: number
  isRisky: boolean
  isHeroic: boolean
  isSuccessful: boolean
  stats: {
    min: number
    max: number
    mean: number
    median: number
    mode: number
  }
}

class SkillRollResult implements ISkillRollResult {
  private _rawDieRoll: number
  private _staticBonus: number
  private _accuracyDiceCount: number
  private _rawAccuracyRolls: number[]
  private _accuracyResult: number
  private _risky: boolean
  private _heroic: boolean
  private _successful: boolean
  private _stats: {
    min: number
    max: number
    mean: number
    median: number
    mode: number
  }

  constructor(
    rawDieRoll: number,
    staticBonus: number,
    accuracyDiceCount: number,
    rawAccuracyRolls: number[],
    accuracyResult: number,
    risky: boolean,
    heroic: boolean,
    successful: boolean,
    stats: {
      min: number
      max: number
      mean: number
      median: number
      mode: number
    }
  ) {
    this._rawDieRoll = rawDieRoll || 0
    this._staticBonus = staticBonus || 0
    this._accuracyDiceCount = accuracyDiceCount || 0
    this._rawAccuracyRolls = rawAccuracyRolls || []
    this._accuracyResult = accuracyResult || 0
    this._risky = risky || false
    this._heroic = heroic || false
    this._successful = successful || false
    this._stats = stats || {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      mode: 0,
    }
  }

  public get rawDieRoll(): number {
    return this._rawDieRoll
  }

  public get staticBonus(): number {
    return this._staticBonus
  }

  public get accuracyDiceCount(): number {
    return this._accuracyDiceCount
  }

  public get rawAccuracyRolls(): number[] {
    return this._rawAccuracyRolls
  }

  public get accuracyResult(): number {
    return this._accuracyResult
  }

  public get isRisky(): boolean {
    return this._risky
  }

  public get isHeroic(): boolean {
    return this._heroic
  }

  public get isSuccessful(): boolean {
    return this._successful
  }

  public get stats() {
    return this._stats
  }
}

declare interface IHitRollResult {
  getStaticBonus(): number
  isCritical(): boolean
  getAccuracyDiceCount(): number // net accuracy dice total - negative if at disadvantage
  getRawAccuracyRolls(): number[] // results of each accuracy/disadvantage die
  getAccuracyResult(): number
  getRawMainRolls(): number[] // raw rolls for the "main" dice
  getKeptMainRolls(): number[] // kept dice from crits
  getStats(): {
    min: number
    max: number
    mean: number
    median: number
    mode: number
  }
}

declare interface IDamageRollResult {
  getDiceString(): string
  getStaticBonus(): number
  isAP(): boolean
  getDamage(): Object[]
  getStats(): {
    min: number
    max: number
    mean: number
    median: number
    mode: number
  }
}

declare interface IBareRollResult {
  getDiceString(): string
  getStaticBonus(): number
}

class DiceRoller {
  // note that a skill roll being difficult should be handled
  // by incrementing totalDifficulty
  public static rollSkillCheck(
    staticBonus: number = 0,
    totalAccuracy: number = 0,
    totalDifficulty: number = 0,
    risky: boolean = false,
    heroic: boolean = false
  ): SkillRollResult {
    let d20Result = DiceRoller._rollDie(20)

    let netAccuracyDice = totalAccuracy - totalDifficulty
    let accuracyResults = DiceRoller._rollAccuracyDice(netAccuracyDice)

    return new SkillRollResult(
      d20Result,
      staticBonus,
      netAccuracyDice,
      [],
      0,
      false,
      false,
      false,
      {
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        mode: 0,
      }
    )
  }

  public static _rollDieSet(dieQuantity: number, dieType: number) {
    if (dieQuantity <= 0) return { total: 0, rolls: [] }

    let total: number = 0
    let rolls: number[] = []

    for (let x = 0; x < dieQuantity; x++) {
      let result = DiceRoller._rollDie(dieType)
      total += result
      rolls.push(result)
    }

    return {
      total: total,
      rolls: rolls,
    }
  }

  public static _rollAccuracyDice(numberOfDice: number): object {
    // needs to handle both positive and negative accuracy (aka difficulty)
    let rawResults = DiceRoller._rollDieSet(Math.abs(numberOfDice), 6)

    let total: number = Math.max(...rawResults.rolls)
    if (numberOfDice < 0) total = -total

    return {
      result: [total],
      rolls: [rawResults.rolls],
    }
  }

  public static _rollDie(dieType: number) {
    return Math.floor(Math.random() * Math.floor(dieType)) + 1
  }
}

// module.exports = DiceRoller
export default DiceRoller

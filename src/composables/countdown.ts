export class Countdown {
  public value = 0;

  private counterHandler = 0;

  public constructor(private startValue: number = 10) {}

  public reset(): void {
    clearInterval(this.counterHandler);
    this.value = 0;
  }

  public start(): void {
    this.reset();
    this.value = this.startValue;
    this.counterHandler = setInterval((): void => {
      this.value -= 1;
      if (this.value <= 0) this.reset();
    }, 1000);
  }
}

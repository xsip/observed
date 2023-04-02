import { Observed, OnChange, OnRead } from './observed/decorator';

// singleton instance means every constructor call (new ExampleClass ) returns the same instance. ( no static property or whatsoever
@Observed({ singleton: true })
class ExampleClass {
  public test: any = 'test1';

  constructor() {}

  @OnChange({ stack: true })
  onChanges(changes: keyof this[]): void {
    console.log('WRITE: ', changes);
  }

  @OnRead({ stack: true })
  onRead(keys: keyof this[]): void {
    console.log('READ: ', keys);
  }

  fn() {
    console.log('test');
  }
}

const instance = new ExampleClass();
console.log(instance.test);
instance.test = '123';
setTimeout(() => {
  // setTimeout just to prevent stacking / debouncing for demo purpose
  instance.test = { test2: '456' };
}, 100);
// OUTPUT =
/*
test1 index.ts:34:9
READ: Array [ "test" ] index.ts:18:17
WRITE: Array [ "test" ] index.ts:15:17
WRITE: Array [ "test" ]index.ts:15:17
 */

instance.fn(); // will also trigger access hooks

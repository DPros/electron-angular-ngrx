import { AhmModule } from './ahm.module';

describe('AhmModule', () => {
  let ahmModule: AhmModule;

  beforeEach(() => {
    ahmModule = new AhmModule();
  });

  it('should create an instance', () => {
    expect(ahmModule).toBeTruthy();
  });
});

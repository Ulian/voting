import { ClientAngular4Page } from './app.po';

describe('client-angular4 App', () => {
  let page: ClientAngular4Page;

  beforeEach(() => {
    page = new ClientAngular4Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

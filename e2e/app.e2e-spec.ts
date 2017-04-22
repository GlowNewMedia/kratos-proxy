import { ProxyPage } from './app.po';

describe('proxy App', () => {
  let page: ProxyPage;

  beforeEach(() => {
    page = new ProxyPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

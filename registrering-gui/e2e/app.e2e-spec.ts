import {RegistreringGuiPage} from "./app.po";

describe('registrering-gui App', () => {
  let page: RegistreringGuiPage;

  beforeEach(() => {
    page = new RegistreringGuiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

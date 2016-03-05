'use strict';

describe('Location E2E Tests:', function () {
  describe('Test locations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/locations');
      expect(element.all(by.repeater('location in locations')).count()).toEqual(0);
    });
  });
});

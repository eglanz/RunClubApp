'use strict';

describe('Clubevents E2E Tests:', function () {
  describe('Test Clubevents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/clubevents');
      expect(element.all(by.repeater('clubevent in clubevents')).count()).toEqual(0);
    });
  });
});

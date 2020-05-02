const { findGameEndCode } = require('../game');

describe('utils/game.js', () => {
  describe('findGameEndCode()', () => {
    describe('3x3', () => {
      it('should return null if no win/no draw', () => {
        const game = {
          decisions: [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
          ],
          size: 3,
        };

        const expected = null;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: vertical, left)', () => {
        const game = {
          decisions: [
            1, 2, 0,
            1, 1, 0,
            1, 2, 0,
          ],
          size: 3,
        };

        const expected = 1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: vertical, middle)', () => {
        const game = {
          decisions: [
            0, 2, 0,
            0, 2, 0,
            0, 2, 0,
          ],
          size: 3,
        };

        const expected = 2;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: vertical, right)', () => {
        const game = {
          decisions: [
            0, 2, 1,
            0, 2, 1,
            2, 1, 1,
          ],
          size: 3,
        };

        const expected = 1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: horizontal, top)', () => {
        const game = {
          decisions: [
            1, 1, 1,
            0, 0, 2,
            2, 2, 0,
          ],
          size: 3,
        };

        const expected = 1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: horizontal, middle)', () => {
        const game = {
          decisions: [
            0, 1, 0,
            2, 2, 2,
            1, 1, 0,
          ],
          size: 3,
        };

        const expected = 2;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: horizontal, bottom)', () => {
        const game = {
          decisions: [
            0, 2, 1,
            0, 2, 2,
            1, 1, 1,
          ],
          size: 3,
        };

        const expected = 1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: top-left -> bottom-right)', () => {
        const game = {
          decisions: [
            2, 1, 0,
            1, 2, 0,
            0, 1, 2,
          ],
          size: 3,
        };

        const expected = 2;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode if someone won (line: bottom-left -> top-right)', () => {
        const game = {
          decisions: [
            0, 2, 1,
            0, 1, 0,
            1, 2, 0,
          ],
          size: 3,
        };

        const expected = 1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });

      it('should return correct gameEndCode (-1) if draw', () => {
        const game = {
          decisions: [
            2, 1, 1,
            1, 2, 2,
            1, 2, 1,
          ],
          size: 3,
        };

        const expected = -1;
        const actual = findGameEndCode(game);
        expect(actual).toEqual(expected);
      });
    });
  });
});

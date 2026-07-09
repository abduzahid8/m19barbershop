import { formatPrice, formatDate, timeAgo, getTimeSlots, getDayNames } from '../data';

describe('Data utility functions', () => {
  describe('formatPrice', () => {
    it('formats price with UZS suffix', () => {
      expect(formatPrice(80000)).toContain('UZS');
    });
  });

  describe('formatDate', () => {
    it('formats date string', () => {
      const result = formatDate('2026-07-15');
      expect(result).toContain('Jul');
      expect(result).toContain('15');
    });
  });

  describe('timeAgo', () => {
    it('returns Today for current date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(timeAgo(today)).toBe('Today');
    });
  });

  describe('getTimeSlots', () => {
    it('returns array of time slots with morning, afternoon, evening periods', () => {
      const slots = getTimeSlots();
      expect(slots.length).toBeGreaterThan(0);
      expect(slots.some(s => s.period === 'morning')).toBe(true);
      expect(slots.some(s => s.period === 'afternoon')).toBe(true);
      expect(slots.some(s => s.period === 'evening')).toBe(true);
    });

    it('includes both available and unavailable slots', () => {
      const slots = getTimeSlots();
      expect(slots.some(s => s.available)).toBe(true);
      expect(slots.some(s => !s.available)).toBe(true);
    });
  });

  describe('getDayNames', () => {
    it('returns 7 days starting from today', () => {
      const days = getDayNames();
      expect(days).toHaveLength(7);
      expect(days[0].day).toBe('Today');
    });
  });
});

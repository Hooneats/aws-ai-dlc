import { SseService } from './sse.service';

describe('SseService', () => {
  let service: SseService;

  beforeEach(() => { service = new SseService(); });

  // TC-BE-036
  it('should emit event to admin subscriber', (done) => {
    const obs = service.connectAdmin(1);
    const sub = obs.subscribe((event) => {
      expect(event.data).toContain('newOrder');
      sub.unsubscribe();
      done();
    });
    service.emitNewOrder({ id: 1, tableNo: 3, items: [], totalAmount: 10000 });
  });

  // TC-BE-037
  it('should replay events after Last-Event-ID', () => {
    service.connectAdmin(1);
    service.emitNewOrder({ id: 1 });
    service.emitNewOrder({ id: 2 });
    service.emitNewOrder({ id: 3 });

    const missed = service.getBufferedEvents('admin-1', '1');
    expect(missed.length).toBe(2);
  });

  it('should emit to specific table', (done) => {
    const obs = service.connectTable(5);
    const sub = obs.subscribe((event) => {
      expect(event.data).toContain('orderStatus');
      sub.unsubscribe();
      done();
    });
    service.emitOrderStatus(1, 'PREPARING', 5);
  });

  it('should clear buffer on session end', () => {
    service.connectTable(5);
    service.emitOrderStatus(1, 'PREPARING', 5);
    service.clearBuffer('table-5');
    const events = service.getBufferedEvents('table-5', '0');
    expect(events.length).toBe(0);
  });
});

import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface SseEvent { data: string; id?: string; type?: string; }

@Injectable()
export class SseService {
  private subjects = new Map<string, Subject<SseEvent>>();
  private buffers = new Map<string, { id: number; event: SseEvent }[]>();
  private idCounter = 0;
  private disconnectTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private getOrCreateChannel(channel: string): Subject<SseEvent> {
    if (!this.subjects.has(channel)) {
      this.subjects.set(channel, new Subject<SseEvent>());
      this.buffers.set(channel, []);
    }
    return this.subjects.get(channel)!;
  }

  connectAdmin(storeId: number): Observable<SseEvent> {
    const ch = `admin-${storeId}`;
    this.cancelDisconnectTimer(ch);
    return this.getOrCreateChannel(ch).asObservable();
  }

  connectTable(tableId: number): Observable<SseEvent> {
    const ch = `table-${tableId}`;
    this.cancelDisconnectTimer(ch);
    return this.getOrCreateChannel(ch).asObservable();
  }

  private emit(channels: string[], type: string, data: any): void {
    const id = ++this.idCounter;
    const event: SseEvent = { data: JSON.stringify({ type, ...data }), id: String(id), type };
    for (const ch of channels) {
      const subject = this.getOrCreateChannel(ch);
      const buf = this.buffers.get(ch)!;
      buf.push({ id, event });
      if (buf.length > 100) buf.shift();
      subject.next(event);
    }
  }

  emitNewOrder(order: any): void { this.emit([`admin-${order.storeId || 1}`], 'newOrder', order); }
  emitOrderStatus(orderId: number, status: string, tableId: number): void { this.emit([`table-${tableId}`], 'orderStatus', { orderId, status }); }
  emitOrderDeleted(orderId: number, tableId: number): void { this.emit([`admin-1`, `table-${tableId}`], 'orderDeleted', { orderId, tableId }); }
  emitOrderUpdated(orderId: number, tableId: number, items: any[], totalAmount: number): void { this.emit([`admin-1`, `table-${tableId}`], 'orderUpdated', { orderId, tableId, items, totalAmount }); }
  emitServiceCall(serviceCall: any): void { this.emit([`admin-${serviceCall.storeId || 1}`], 'serviceCall', serviceCall); }
  emitSessionEnd(tableId: number): void { this.emit([`table-${tableId}`], 'sessionEnd', { tableId }); }

  getBufferedEvents(channel: string, lastEventId: string): SseEvent[] {
    const buf = this.buffers.get(channel) || [];
    const id = parseInt(lastEventId, 10);
    return buf.filter((e) => e.id > id).map((e) => e.event);
  }

  clearBuffer(channel: string): void {
    this.buffers.set(channel, []);
  }

  handleDisconnect(channel: string): void {
    this.disconnectTimers.set(channel, setTimeout(() => this.clearBuffer(channel), 5 * 60 * 1000));
  }

  private cancelDisconnectTimer(channel: string): void {
    const timer = this.disconnectTimers.get(channel);
    if (timer) { clearTimeout(timer); this.disconnectTimers.delete(channel); }
  }
}

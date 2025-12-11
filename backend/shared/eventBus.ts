import EventEmitter from 'eventemitter3';

// Centralized Event Bus for microservices communication
class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Event types
  static readonly EVENTS = {
    APPOINTMENT_CREATED: 'appointment:created',
    APPOINTMENT_APPROVED: 'appointment:approved',
    APPOINTMENT_REJECTED: 'appointment:rejected',
    APPOINTMENT_CANCELLED: 'appointment:cancelled',
  };
}

export const eventBus = EventBus.getInstance();
export const EVENTS = EventBus.EVENTS;

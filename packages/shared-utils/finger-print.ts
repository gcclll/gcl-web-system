export interface GlFingerPrintOptions {
  host: string
}

class GlFingerPrint {
  ws = null;

  socket: WebSocket;

  fingerCount = 0

  host = 'ws://127.0.0.1:5001/'

  constructor(options: GlFingerPrintOptions) {
    if (!WebSocket) {
      throw new TypeError(`WebSocket not supported in current browser.`);
    }
    const { host } = options
    this.host = host
    const s = (this.socket = new WebSocket(host));
    s.onopen = e => this.onopen(e);
    s.onmessage = e => this.onmessage(e);
    s.onclose = e => this.onclose(e);
    s.onerror = e => this.onerror(e);
  }

  onopen(evt: Event) {
    console.log(evt, 'open');
    this.send('devStatus')
  }

  onmessage(evt: Event) {
    console.log(evt, 'message');
  }

  onclose(evt: Event) {
    console.log(evt, 'close');
  }

  onerror(evt: Event) {
    console.log(evt, 'event');
  }

  connect() {}

  // 注册指纹
  register() {
    this.send('fvinput', {
      scope: 'remote',
    });
  }

  // 验证指纹
  verify() {
    this.send('fvverify', {
      scope: 'remote'
    })
  }

  cancel() {
    // reset finger
    this.fingerCount = 0
    this.send('fvcancel')
  }

  close() {
    this.socket?.close()
  }

  error(error: Event) {
    this.onerror(error)
  }

  send(command: string, args?: any) {
    const json = { command, args };
    this.socket.send(JSON.stringify(json));
  }
}

export default GlFingerPrint;

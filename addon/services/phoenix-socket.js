import Ember from 'ember';
import { Socket } from 'phoenix';

const { assert } = Ember;

export default Ember.Service.extend(Ember.Evented, {
  socket: null,
  isHealthy: false,

  connect(url, options) {
    const socket = new Socket(url, options);
    socket.onOpen(() => {
      this.set('isHealthy', true);
      this.trigger('open', ...arguments);
    });
    socket.onClose(() => {
      this.set('isHealthy', false);
      this.trigger('close', ...arguments);
    });
    socket.onError(() => {
      this.set('isHealthy', false);
      this.trigger('error', ...arguments);
    });
    this.set('socket', socket);
    return socket.connect();
  },

  joinChannel(name, params) {
    const socket = this.get('socket');
    assert('must connect to a socket first', socket);

    const channel = socket.channel(name, params);
    channel.join();
    return channel;
  }

});

class Event {
    eventPool = {};//事件池

    on = (eventName, callback) => {
      if (this.eventPool[eventName]){
        const eventCallbacks = this.eventPool[eventName];
        if (eventCallbacks instanceof Array){
          eventCallbacks.push(callback);
        } else {
          const eventAry = [];
          eventAry.push(eventCallbacks, callback);
          this.eventPool[eventName] = eventAry;
        }
        // console.error(`${eventName}事件重复订阅`);
        return;
      }
      this.eventPool[eventName] = callback;
    }

    emit = (eventName, params) => {
      const events = this.eventPool[eventName];
      if (!events){
        console.log(`${eventName}订阅事件未定义`);
        return;
      }
      if (events instanceof Array){
        for (let i = 0, len = events.length; i < len; i++) {
          events[i](params);
        }
      } else {
        events(params);
      }
    }

    remove = (eventName) => {
      const events = this.eventPool[eventName];
      if (events instanceof Array){
        // events.splice(events.length - 1, 1);
        events.pop();
        if (events.length === 0) {
          delete this.eventPool[eventName];
        }
      } else {
        delete this.eventPool[eventName];
      }
    }
}

export default new Event();
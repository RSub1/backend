import { Injectable } from 'skeidjs';

@Injectable()
export class TestService {
    constructor() {}

    generateEventSourceHTML() {
        const host = process.env.HOST;


        return `
        <html>
    <body style="background: #252525;">
        <script>
            var SSE = function (url, options) {
                if (!(this instanceof SSE)) {
                    return new SSE(url, options);
                }

                this.INITIALIZING = -1;
                this.CONNECTING = 0;
                this.OPEN = 1;
                this.CLOSED = 2;

                this.url = url;

                options = options || {};
                this.headers = options.headers || {};
                this.payload = options.payload !== undefined ? options.payload : '';
                this.method = options.method || (this.payload && 'POST' || 'GET');

                this.FIELD_SEPARATOR = ':';
                this.listeners = {};

                this.xhr = null;
                this.readyState = this.INITIALIZING;
                this.progress = 0;
                this.chunk = '';

                this.addEventListener = function(type, listener) {
                    if (this.listeners[type] === undefined) {
                        this.listeners[type] = [];
                    }

                    if (this.listeners[type].indexOf(listener) === -1) {
                        this.listeners[type].push(listener);
                    }
                };

                this.removeEventListener = function(type, listener) {
                    if (this.listeners[type] === undefined) {
                        return;
                    }

                    var filtered = [];
                    this.listeners[type].forEach(function(element) {
                        if (element !== listener) {
                            filtered.push(element);
                        }
                    });
                    if (filtered.length === 0) {
                        delete this.listeners[type];
                    } else {
                        this.listeners[type] = filtered;
                    }
                };

                this.dispatchEvent = function(e) {
                    if (!e) {
                        return true;
                    }

                    e.source = this;

                    var onHandler = 'on' + e.type;
                    if (this.hasOwnProperty(onHandler)) {
                        this[onHandler].call(this, e);
                        if (e.defaultPrevented) {
                            return false;
                        }
                    }

                    if (this.listeners[e.type]) {
                        return this.listeners[e.type].every(function(callback) {
                            callback(e);
                            return !e.defaultPrevented;
                        });
                    }

                    return true;
                };

                this._setReadyState = function (state) {
                    var event = new CustomEvent('readystatechange');
                    event.readyState = state;
                    this.readyState = state;
                    this.dispatchEvent(event);
                };

                this._onStreamFailure = function(e) {
                    this.dispatchEvent(new CustomEvent('error'));
                    this.close();
                }

                this._onStreamProgress = function(e) {
                    if (this.xhr.status !== 200) {
                        this._onStreamFailure(e);
                        return;
                    }

                    if (this.readyState == this.CONNECTING) {
                        this.dispatchEvent(new CustomEvent('open'));
                        this._setReadyState(this.OPEN);
                    }

                    var data = this.xhr.responseText.substring(this.progress);
                    this.progress += data.length;
                    data.split(/(\\r\\n|\\r|\\n){2}/g).forEach(function(part) {
                        if (part.trim().length === 0) {
                            this.dispatchEvent(this._parseEventChunk(this.chunk.trim()));
                            this.chunk = '';
                        } else {
                            this.chunk += part;
                        }
                    }.bind(this));
                };

                this._onStreamLoaded = function(e) {
                    this._onStreamProgress(e);

                    // Parse the last chunk.
                    this.dispatchEvent(this._parseEventChunk(this.chunk));
                    this.chunk = '';
                };

                /**
                 * Parse a received SSE event chunk into a constructed event object.
                 */
                this._parseEventChunk = function(chunk) {
                    if (!chunk || chunk.length === 0) {
                        return null;
                    }

                    var e = {'id': null, 'retry': null, 'data': '', 'event': 'message'};
                    chunk.split(/\\n|\\r\\n|\\r/).forEach(function(line) {
                        line = line.trimRight();
                        var index = line.indexOf(this.FIELD_SEPARATOR);
                        if (index <= 0) {
                            // Line was either empty, or started with a separator and is a comment.
                            // Either way, ignore.
                            return;
                        }

                        var field = line.substring(0, index);
                        if (!(field in e)) {
                            return;
                        }

                        var value = line.substring(index + 1).trimLeft();
                        if (field === 'data') {
                            e[field] += value;
                        } else {
                            e[field] = value;
                        }
                    }.bind(this));

                    var event = new CustomEvent(e.event);
                    event.data = e.data;
                    event.id = e.id;
                    return event;
                };

                this._checkStreamClosed = function() {
                    if (this.xhr.readyState === XMLHttpRequest.DONE) {
                        this._setReadyState(this.CLOSED);
                    }
                };

                this.stream = function() {
                    this._setReadyState(this.CONNECTING);

                    this.xhr = new XMLHttpRequest();
                    this.xhr.addEventListener('progress', this._onStreamProgress.bind(this));
                    this.xhr.addEventListener('load', this._onStreamLoaded.bind(this));
                    this.xhr.addEventListener('readystatechange', this._checkStreamClosed.bind(this));
                    this.xhr.addEventListener('error', this._onStreamFailure.bind(this));
                    this.xhr.addEventListener('abort', this._onStreamFailure.bind(this));
                    this.xhr.open(this.method, this.url);
                    for (var header in this.headers) {
                        this.xhr.setRequestHeader(header, this.headers[header]);
                    }
                    this.xhr.send(this.payload);
                };

                this.close = function() {
                    if (this.readyState === this.CLOSED) {
                        return;
                    }

                    this.xhr.abort();
                    this.xhr = null;
                    this._setReadyState(this.CLOSED);
                };
            };


            
        </script>
        <div style="max-width: fit-content; margin: auto">
            <input type="text" id="id-list-input" 
            style="width: 100%; height: 32px; font-size: 16px">
            <button id="subscribe-button"
                style="display: block; width: 100%; height: 32px; font-size: 16px"
            >Show Subscription</button>
            <div style="display: block; max-width: 100%" id="container">
                
            </div>
        </div>
        <script>
            const input = document.getElementById('id-list-input');
            const subscribeButton = document.getElementById('subscribe-button');
            const container = document.getElementById('container');
            subscribeButton.onclick = function () {
                const src = new SSE('${host}/v0/_self/notifications', {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Expose-Headers': '*',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                        'Content-Type': 'application/json'
                    },
                    payload: JSON.stringify({
                        "contactPersonIds": [...input.value.replace(' ', '').split(',')]
                    }),
                    method: 'POST'
                });
                src.addEventListener('CONTACT_CONFIRMED', () => {
                    const div = document.createElement('div');
                    div.innerHTML = '&#x1F912; &#x1F637; &#x1F927; Alarm f&uuml;r Corona 11  &#x1f9a0; &#x1f9a0; &#x1f9a0;';
                    div.setAttribute('style', 'text-align: center; color: white; padding: 8px 0; margin: 8px 0; border: 1px solid; font-size: 48px');
                    container.appendChild(div);
                });
                src.stream();
            }
        </script>
        
        

 

    </body>



</html>
        `;
    }

}
